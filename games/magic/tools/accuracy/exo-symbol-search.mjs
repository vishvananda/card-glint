import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import {
  readJson,
  writeJson,
  fixtureRoot,
  outputRoot,
  cacheRoot,
  objectFile,
  hash,
  root,
} from './common.mjs';
import { readPng } from './pixels.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
import { symbolRaster, stampSymbol } from './symbol-raster.mjs';
import { oldSymbolRegions } from './old-symbol-regions.mjs';

const base = `${outputRoot}/old-symbol-material`,
  snapshot = await readJson(`${cacheRoot}/rollout/exo-symbol.json`),
  templates = await readJson(`${base}/templates/capture.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  bounds = await readJson(`${fixtureRoot}/old-symbol-stencil-bounds.json`),
  rect = oldSymbolRegions.exo,
  crop = bounds.rows.find((r) => r.url.endsWith('/exo.svg')).bounds,
  samples = [],
  palettes = {},
  server = await createServer({ configFile: false, root, server: { middlewareMode: true } });
try {
  const { retroSymbolPalette } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-symbol-material.ts',
  );
  for (const rarity of ['common', 'uncommon', 'rare'])
    palettes[rarity] = retroSymbolPalette({ setCode: 'exo', rarity });
} finally {
  await server.close();
}
for (const e of snapshot.entries.filter((e) => e.cohort === 'calibration')) {
  assert.equal(e.card.set, 'exo');
  const t = templates.rows.find((r) => r.id === e.id),
    asset = t.images.inspect,
    ref = await cachedGrayRegion(
      objectFile(e.reference),
      e.reference.sha256,
      rect,
      registration.groups.exo.transform,
    ),
    bg = await cachedGrayRegion(`${base}/templates/${asset.file}`, asset.sha256, rect);
  samples.push({ id: e.id, rarity: e.card.rarity, ref: ref.gray, bg: bg.gray });
}
assert.equal(samples.length, 5);
const t = templates.rows.find((r) => r.set === 'exo'),
  stencil = await readPng(`${base}/templates/${t.images.stencil.file}`),
  backing = await readPng(`${base}/templates/${t.images.backing.file}`),
  tiles = new Map(),
  cache = new Map(),
  outline = 1.25;
const tones = Object.fromEntries(
  Object.entries(palettes).map(([key, colors]) => [
    key,
    colors.map((color) => {
      const n = Number.parseInt(color.slice(1), 16);
      return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
    }),
  ]),
);
function evaluate(p) {
  const key = JSON.stringify(p);
  if (cache.has(key)) return cache.get(key);
  const values = samples.map((s) => {
    const tileKey = JSON.stringify([p.width, p.height, s.rarity]);
    let tile = tiles.get(tileKey);
    if (!tile) {
      const v = tones[s.rarity],
        ink = (x) => {
          const t = Math.max(0, Math.min(1, x)) * 2,
            i = Math.min(1, Math.floor(t));
          return v[i] * (1 - (t - i)) + v[i + 1] * (t - i);
        };
      tile = symbolRaster(stencil, crop, p.width, p.height, outline, ink, backing);
      tiles.set(tileKey, tile);
    }
    return compareLettering(s.ref, stampSymbol(s.bg, rect, tile, p), rect[2], rect[3]);
  });
  const edgeF1 = median(values.map((v) => v.edgeF1)),
    distance = median(values.map((v) => v.meanDistance).filter((v) => v !== null)),
    result = { ...p, score: edgeF1 - 0.02 * distance, edgeF1, distance, rows: values };
  cache.set(key, result);
  return result;
}
const fields = ['right', 'centerY', 'width', 'height'],
  limits = { right: [420, 441], centerY: [383, 398], width: [40, 64], height: [16, 28] },
  valid = (p) =>
    fields.every((k) => p[k] >= limits[k][0] && p[k] <= limits[k][1]) &&
    p.right - p.width - outline >= rect[0] + 1 &&
    p.right + outline <= rect[0] + rect[2] - 1 &&
    p.centerY - p.height / 2 - outline >= rect[1] + 1 &&
    p.centerY + p.height / 2 + outline <= rect[1] + rect[3] - 1;
let current = evaluate({ right: 434, centerY: 390, width: 54, height: 22 });
for (const step of [4, 2, 1, 0.5])
  for (let round = 0; round < 12; round++) {
    const candidates = [];
    for (const field of fields)
      for (const direction of [-1, 1]) {
        const p = Object.fromEntries(fields.map((k) => [k, current[k]]));
        p[field] += step * direction;
        if (valid(p)) candidates.push(evaluate(p));
      }
    candidates.sort((a, b) => b.score - a.score);
    if (!candidates.length || candidates[0].score <= current.score + 1e-6) break;
    current = candidates[0];
  }
const all = [...cache.values()],
  boundary =
    fields.some((k) => limits[k].includes(current[k])) ||
    current.right - current.width - outline <= rect[0] + 1.5 ||
    current.right + outline >= rect[0] + rect[2] - 1.5 ||
    current.centerY - current.height / 2 - outline <= rect[1] + 1.5 ||
    current.centerY + current.height / 2 + outline >= rect[1] + rect[3] - 1.5;
const result = {
  schemaVersion: 1,
  scope:
    'Five frozen Exodus calibration cards only. Existing stencil/backing, white 1.25 px rim and production rarity palettes. Browser-free 2x approximation, bounded shared coordinate bumps; all other cards remain unused for selection. Frozen internal-frame fit retained for comparability, not certified independent scan normalization. Confirm with actual production renders and full-set validation before adopting the profile.',
  methodHash: hash(await readFile(new URL(import.meta.url))),
  rasterHash: hash(await readFile(new URL('./symbol-raster.mjs', import.meta.url))),
  materialHash: hash(
    await readFile(`${root}/games/magic/src/presentation/retro-symbol-material.ts`),
  ),
  templateHash: hash(JSON.stringify(templates)),
  registrationHash: hash(JSON.stringify(registration)),
  rect,
  crop,
  outline,
  palettes,
  limits,
  calibrationIds: samples.map((s) => s.id),
  selected: current,
  bestOverlap: all.toSorted((a, b) => b.edgeF1 - a.edgeF1)[0],
  bestDistance: all.toSorted((a, b) => a.distance - b.distance)[0],
  evaluated: cache.size,
  boundary,
};
await writeJson(`${fixtureRoot}/exo-symbol-candidate.json`, result);
console.log(JSON.stringify({ selected: current, evaluated: cache.size, boundary }, null, 2));
