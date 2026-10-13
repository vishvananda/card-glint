import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import {
  readJson,
  writeJson,
  fixtureRoot,
  outputRoot,
  cacheRoot,
  objectFile,
  hash,
} from './common.mjs';
import { readPng } from './pixels.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
import { symbolRaster, stampSymbol } from './symbol-raster.mjs';
import { oldSymbolRegions } from './old-symbol-regions.mjs';

const base = `${outputRoot}/old-symbol-material`,
  snapshot = await readJson(`${cacheRoot}/rollout/old-symbol-material.json`),
  templates = await readJson(`${base}/templates/capture.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  bounds = await readJson(`${fixtureRoot}/old-symbol-stencil-bounds.json`),
  groups = {};
const limits = {
  arn: [
    [48, 74],
    [14, 26],
  ],
  leg: [
    [18, 30],
    [18, 28],
  ],
  all: [
    [40, 64],
    [18, 28],
  ],
  wth: [
    [28, 44],
    [18, 28],
  ],
  exo: [
    [40, 64],
    [18, 28],
  ],
};
const seeds = {
  arn: { right: 439, centerY: 394, width: 65, height: 20 },
  leg: { right: 437, centerY: 394, width: 24, height: 24 },
  all: { right: 426, centerY: 392, width: 56, height: 24 },
  wth: { right: 434, centerY: 390, width: 34, height: 22 },
  exo: { right: 434, centerY: 389, width: 54, height: 22 },
};
for (const set of Object.keys(seeds)) {
  const rect = oldSymbolRegions[set];
  const entries = snapshot.entries.filter((e) => e.card.set === set && e.cohort === 'calibration'),
    samples = [];
  const crop = bounds.rows.find((r) => r.url.endsWith(`/${set}.svg`)).bounds;
  for (const e of entries) {
    const b = templates.rows.find((r) => r.id === e.id),
      asset = b.images.inspect;
    const ref = await cachedGrayRegion(
        objectFile(e.reference),
        e.reference.sha256,
        rect,
        registration.groups[set].transform,
      ),
      bg = await cachedGrayRegion(`${base}/templates/${asset.file}`, asset.sha256, rect);
    // Existing painter ink, not fitted color; both edge polarities are scored.
    const ink = set === 'exo' ? ({ uncommon: 174, rare: 151 }[e.card.rarity] ?? 51) : 24;
    samples.push({ id: e.id, ref: ref.gray, bg: bg.gray, ink });
  }
  const stencilAsset = templates.rows.find((r) => r.set === set).images.stencil,
    stencil = await readPng(`${base}/templates/${stencilAsset.file}`),
    backingAsset = templates.rows.find((r) => r.set === set).images.backing,
    backing = await readPng(`${base}/templates/${backingAsset.file}`),
    tiles = new Map(),
    cache = new Map();
  const evaluate = (p) => {
    const key = JSON.stringify(p);
    if (cache.has(key)) return cache.get(key);
    const values = samples.map((s) => {
      const tileKey = JSON.stringify([p.width, p.height, s.ink]);
      let tile = tiles.get(tileKey);
      if (!tile) {
        tile = symbolRaster(
          stencil,
          crop,
          p.width,
          p.height,
          ['all', 'wth'].includes(set) ? 1 : 0,
          s.ink,
          backing,
        );
        tiles.set(tileKey, tile);
      }
      return compareLettering(s.ref, stampSymbol(s.bg, rect, tile, p), rect[2], rect[3]);
    });
    const f1 = median(values.map((v) => v.edgeF1)),
      distance = median(values.map((v) => v.meanDistance).filter((v) => v != null)),
      score = f1 - 0.02 * distance;
    const result = { ...p, score, edgeF1: f1, distance, rows: values };
    cache.set(key, result);
    return result;
  };
  let current = evaluate(seeds[set]);
  for (const step of [4, 2, 1])
    for (let round = 0; round < 12; round++) {
      const candidates = [];
      for (const field of ['right', 'centerY', 'width', 'height'])
        for (const direction of [-1, 1]) {
          const p = Object.fromEntries(
            ['right', 'centerY', 'width', 'height'].map((k) => [k, current[k]]),
          );
          p[field] += step * direction;
          if (
            p.right < 420 ||
            p.right > 443 ||
            p.centerY < 383 ||
            p.centerY > 398 ||
            p.width < limits[set][0][0] ||
            p.width > limits[set][0][1] ||
            p.height < limits[set][1][0] ||
            p.height > limits[set][1][1] ||
            p.right - p.width < rect[0] + 1 ||
            p.right > rect[0] + rect[2] - 1 ||
            p.centerY - p.height / 2 < rect[1] + 1 ||
            p.centerY + p.height / 2 > rect[1] + rect[3] - 1
          )
            continue;
          candidates.push(evaluate(p));
        }
      candidates.sort((a, b) => b.score - a.score);
      if (!candidates.length || candidates[0].score <= current.score + 1e-6) break;
      current = candidates[0];
    }
  const all = [...cache.values()],
    bestOverlap = all.toSorted((a, b) => b.edgeF1 - a.edgeF1)[0],
    bestDistance = all.toSorted((a, b) => a.distance - b.distance)[0];
  groups[set] = {
    rect,
    crop,
    calibrationIds: samples.map((s) => s.id),
    selected: current,
    bestOverlap,
    bestDistance,
    evaluated: cache.size,
    boundary:
      current.right === 420 ||
      current.right === 443 ||
      current.centerY === 383 ||
      current.centerY === 398 ||
      limits[set][0].includes(current.width) ||
      limits[set][1].includes(current.height) ||
      current.centerY - current.height / 2 <= rect[1] + 1 ||
      current.centerY + current.height / 2 >= rect[1] + rect[3] - 1,
  };
  console.log(set, JSON.stringify({ selected: current, evaluated: cache.size }));
}
assert.equal(templates.planHash, registration.planHash);
await writeJson(`${fixtureRoot}/old-symbol-material-candidates.json`, {
  schemaVersion: 1,
  scope:
    'Analysis-only 2x cached-stencil approximation; bounded multistep coordinate search of one shared placement/size per set. Five calibration cards only. Maximize median dark/light F1 minus 0.02 times median edge distance. Keep alternate objective peaks; production renders and held-out checks determine adoption. Scan registration stays frozen. Opaque backing included; Exodus still needs its white outer rim/rarity treatment. No Chromium used for candidate comparison. Candidate geometry is not adopted by this search.',
  planHash: templates.planHash,
  registrationHash: hash(JSON.stringify(registration)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  rasterHash: hash(await readFile(new URL('./symbol-raster.mjs', import.meta.url))),
  regions: oldSymbolRegions,
  regionHash: hash(await readFile(new URL('./old-symbol-regions.mjs', import.meta.url))),
  groups,
});
