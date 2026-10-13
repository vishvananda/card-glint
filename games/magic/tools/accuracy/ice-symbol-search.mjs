import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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

const base = `${outputRoot}/ice-symbol/templates`,
  snapshot = await readJson(`${cacheRoot}/rollout/ice-symbol.json`),
  plan = await readJson(`${fixtureRoot}/ice-symbol-plan.json`),
  templates = await readJson(`${base}/capture.json`),
  rect = [404, 376, 44, 35],
  samples = [],
  stencils = {};
assert.equal(templates.planHash, hash(JSON.stringify(plan)));
for (const e of snapshot.entries.filter((e) => e.cohort === 'calibration')) {
  const t = templates.rows.find((r) => r.id === e.id),
    a = t.images.inspect;
  samples.push({
    id: e.id,
    name: e.card.name,
    ref: (await cachedGrayRegion(objectFile(e.reference), e.reference.sha256, rect)).gray,
    bg: (await cachedGrayRegion(`${base}/${a.file}`, a.sha256, rect)).gray,
  });
}
assert.equal(samples.length, 11);
for (const [name, a] of Object.entries(templates.stencils)) {
  assert.equal(hash(await readFile(`${base}/${a.file}`)), a.sha256);
  stencils[name] = await readPng(`${base}/${a.file}`);
}
const crops = {};
for (const key of ['ice', 'ice2']) {
  const s = stencils[key];
  let x0 = s.width,
    y0 = s.height,
    x1 = 0,
    y1 = 0;
  for (let y = 0; y < s.height; y++)
    for (let x = 0; x < s.width; x++)
      if (s.data[(y * s.width + x) * 4 + 3] > 5) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
  crops[key] = [x0 / s.width, y0 / s.height, (x1 - x0 + 1) / s.width, (y1 - y0 + 1) / s.height];
}
const fields = ['right', 'centerY', 'width', 'height'],
  limits = { right: [430, 445], centerY: [386, 399], width: [16, 28], height: [18, 30] },
  results = [];
for (const outline of [0, 0.5, 1])
  for (const variant of ['ice', 'ice2', 'plate', 'star']) {
    const key = variant === 'ice' ? 'ice' : 'ice2',
      backing = stencils[variant] && !['ice', 'ice2'].includes(variant) ? stencils[variant] : null,
      cache = new Map(),
      tiles = new Map(),
      crop = crops[key];
    const valid = (p) =>
      fields.every((k) => p[k] >= limits[k][0] && p[k] <= limits[k][1]) &&
      p.right - p.width - outline >= rect[0] + 1 &&
      p.right + outline <= rect[0] + rect[2] - 1 &&
      p.centerY - p.height / 2 - outline >= rect[1] + 1 &&
      p.centerY + p.height / 2 + outline <= rect[1] + rect[3] - 1;
    function evaluate(p) {
      const ck = JSON.stringify(p);
      if (cache.has(ck)) return cache.get(ck);
      const tk = JSON.stringify([p.width, p.height]);
      let tile = tiles.get(tk);
      if (!tile) {
        tile = symbolRaster(stencils[key], crop, p.width, p.height, outline, 21, backing);
        tiles.set(tk, tile);
      }
      const rows = samples.map((s) => ({
          id: s.id,
          ...compareLettering(s.ref, stampSymbol(s.bg, rect, tile, p), rect[2], rect[3]),
        })),
        edgeF1 = median(rows.map((r) => r.edgeF1)),
        distance = median(rows.map((r) => r.meanDistance).filter((v) => v !== null)),
        censusSimilarity = median(rows.map((r) => r.censusSimilarity).filter((v) => v !== null)),
        result = {
          ...p,
          score: edgeF1 - 0.02 * distance,
          edgeF1,
          distance,
          censusSimilarity,
          rows,
        };
      cache.set(ck, result);
      return result;
    }
    let current = evaluate({ right: 441, centerY: 393, width: 22, height: 25 });
    const start = current;
    for (const step of [4, 2, 1, 0.5])
      for (let round = 0; round < 12; round++) {
        const choices = [];
        for (const f of fields)
          for (const sign of [-1, 1]) {
            const p = Object.fromEntries(fields.map((k) => [k, current[k]]));
            p[f] += step * sign;
            if (valid(p)) choices.push(evaluate(p));
          }
        choices.sort((a, b) => b.score - a.score);
        if (!choices.length || choices[0].score <= current.score + 1e-6) break;
        current = choices[0];
      }
    const boundary =
      fields.some((k) => limits[k].includes(current[k])) ||
      current.right - current.width - outline <= rect[0] + 1.5 ||
      current.right + outline >= rect[0] + rect[2] - 1.5 ||
      current.centerY - current.height / 2 - outline <= rect[1] + 1.5 ||
      current.centerY + current.height / 2 + outline >= rect[1] + rect[3] - 1.5;
    results.push({
      variant,
      crop,
      outline,
      start,
      selected: current,
      boundary,
      evaluated: cache.size,
      bestCensus: [...cache.values()].sort((a, b) => b.censusSimilarity - a.censusSimilarity)[0],
    });
  }
const result = {
  schemaVersion: 1,
  scope:
    'Eleven frozen Ice Age calibration printings only. Four existing-stencil/backing variants with 0/0.5/1 px rims. Initial right-bound estimate (440) was inside the observed scan silhouette; visual native-resolution review sets outer bound445, still short of frame edge. Identical bounded shared coordinate bumps with raw references. No scan registration; apparent placement remains provisional until independent frame geometry review. Browser-free 2x approximation ranks candidates; production renders and full-set validation are required. White plate/star masks reuse closed existing subpaths; no replacement contour.',
  methodHash: hash(await readFile(new URL(import.meta.url))),
  rasterHash: hash(await readFile(new URL('./symbol-raster.mjs', import.meta.url))),
  planHash: hash(JSON.stringify(plan)),
  templateHash: hash(JSON.stringify(templates)),
  rect,
  limits,
  calibrationIds: samples.map((s) => s.id),
  results,
};
await writeJson(`${fixtureRoot}/ice-symbol-candidate.json`, result);
console.log(
  JSON.stringify(
    results.map(({ variant, selected, boundary, evaluated }) => ({
      variant,
      selected,
      boundary,
      evaluated,
    })),
    null,
    2,
  ),
);
