import { readFile } from 'node:fs/promises';
import { outputRoot, fixtureRoot, writeJson, hash } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { median } from './metrics.mjs';

const directory = `${outputRoot}/m21/symbol-size-candidates`,
  bytes = await readFile(`${directory}/capture.json`),
  capture = JSON.parse(bytes),
  rect = [387, 387, 66, 30],
  rows = [],
  start = performance.now();
let hits = 0,
  misses = 0;
async function region(directory, asset) {
  const r = await cachedGrayRegion(`${directory}/${asset.file}`, asset.sha256, rect);
  if (r.cacheHit) hits++;
  else misses++;
  return r;
}
for (const card of capture.rows) {
  const reference = await region(`${outputRoot}/m21/symbol-final`, card.reference),
    scores = {};
  for (const [variant, asset] of Object.entries(card.images)) {
    const rendered = await region(directory, asset),
      args = [reference.gray, rendered.gray, rect[2], rect[3]],
      pair = compareLettering(...args);
    scores[variant] = {
      edgeF1: pair.edgeF1,
      contrast: letteringContrast(...args),
      census: pair.censusSimilarity,
    };
  }
  rows.push({
    id: card.id,
    number: card.number,
    name: card.name,
    rarity: card.rarity,
    inputHash: card.inputHash,
    referenceHash: card.reference.sha256,
    scores,
  });
}
const summary = {};
for (const v of capture.variants) {
  summary[v.id] = {};
  for (const rarity of ['all', 'common', 'uncommon', 'rare', 'mythic']) {
    const group = rows.filter((r) => rarity === 'all' || r.rarity === rarity);
    summary[v.id][rarity] = Object.fromEntries(
      ['edgeF1', 'contrast', 'census'].map((metric) => [
        metric,
        {
          median: median(group.map((r) => r.scores[v.id][metric])),
          gains: group.filter((r) => r.scores[v.id][metric] - r.scores.control[metric] > 0.02)
            .length,
          regressions: group
            .filter((r) => r.scores[v.id][metric] - r.scores.control[metric] < -0.02)
            .map((r) => r.number),
        },
      ]),
    );
  }
}
const methods = Object.fromEntries(
  await Promise.all(
    [
      'normalized-gray-region',
      'region-cache',
      'edges',
      'metrics',
      'lettering-metrics',
      'lettering-contrast',
    ].map(async (name) => [name, hash(await readFile(new URL(`./${name}.mjs`, import.meta.url)))]),
  ),
);
await writeJson(`${fixtureRoot}/set-symbol-size-development-measurement.json`, {
  schemaVersion: 1,
  scope:
    '26 previously examined M21 normal cards, inspect tier. Fixed normalization and one symbol window; no per-scan fitting. Development metrics, not independent validation or whole-card accuracy percentages.',
  captureHash: hash(bytes),
  baselineRendererHash: capture.baselineRendererHash,
  studyHash: hash(await readFile(new URL(import.meta.url))),
  methods,
  variants: capture.variants,
  rect,
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - start,
    hits,
    misses,
    scope:
      'CPU source hashing, cached region sampling and structural metrics; no Chromium or GPU work.',
  },
});
console.log(
  JSON.stringify(Object.fromEntries(Object.entries(summary).map(([v, s]) => [v, s.all])), null, 2),
);
