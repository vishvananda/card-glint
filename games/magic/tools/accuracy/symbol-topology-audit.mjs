import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { outputRoot, fixtureRoot, readJson, writeJson, hash } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { median } from './metrics.mjs';

const set = process.argv[2];
assert.ok(['m15', 'war'].includes(set));
const directory = `${outputRoot}/${set}/symbol-topology-candidates`,
  bytes = await readFile(`${directory}/capture.json`),
  capture = JSON.parse(bytes),
  baseline = await readJson(`${outputRoot}/${set}/symbol-topology-before/capture.json`),
  rect = capture.rect,
  rows = [],
  start = performance.now();
// Match full-card canonical bilinear sampling, including byte rounding.
function grayCrop(image) {
  const factor = image.width / rect[2];
  assert.equal(image.height, rect[3] * factor);
  const out = new Float32Array(rect[2] * rect[3]);
  for (let y = 0; y < rect[3]; y++)
    for (let x = 0; x < rect[2]; x++) {
      const sx = (x + 0.5) * factor - 0.5,
        sy = (y + 0.5) * factor - 0.5,
        l = Math.floor(sx),
        t = Math.floor(sy),
        fx = sx - l,
        fy = sy - t;
      let luminance = 0;
      for (const [c, w] of [
        [0, 0.2126],
        [1, 0.7152],
        [2, 0.0722],
      ]) {
        const p = (t * image.width + l) * 4 + c;
        luminance +=
          w *
          Math.round(
            (image.data[p] * (1 - fx) + image.data[p + 4] * fx) * (1 - fy) +
              (image.data[p + image.width * 4] * (1 - fx) +
                image.data[p + image.width * 4 + 4] * fx) *
                fy,
          );
      }
      out[y * rect[2] + x] = luminance;
    }
  return out;
}
for (const card of capture.rows) {
  const original = baseline.results.find((r) => r.id === card.id);
  assert.ok(original);
  const ref = await cachedGrayRegion(
      `${outputRoot}/${set}/symbol-topology-before/${card.reference.file}`,
      card.reference.sha256,
      rect,
    ),
    control = await cachedGrayRegion(
      `${outputRoot}/${set}/symbol-topology-before/${original.images.inspect.file}`,
      original.images.inspect.sha256,
      rect,
    ),
    scores = {};
  for (const [id, asset] of Object.entries(card.images)) {
    const b = await readFile(`${directory}/${asset.file}`);
    assert.equal(hash(b), asset.sha256);
    const gray = grayCrop(PNG.sync.read(b));
    if (id === 'control') assert.deepEqual(gray, control.gray);
    const pair = compareLettering(ref.gray, gray, rect[2], rect[3]);
    scores[id] = {
      edgeF1: pair.edgeF1,
      contrast: letteringContrast(ref.gray, gray, rect[2], rect[3]),
      census: pair.censusSimilarity,
    };
  }
  rows.push({
    id: card.id,
    number: card.number,
    name: card.name,
    rarity: card.rarity,
    referenceHash: card.reference.sha256,
    inputHash: card.inputHash,
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
      'lettering-metrics',
      'lettering-contrast',
      'metrics',
      'edges',
    ].map(async (name) => [name, hash(await readFile(new URL(`./${name}.mjs`, import.meta.url)))]),
  ),
);
await writeJson(`${fixtureRoot}/set-symbol-topology-${set}-development-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Previously examined development cards, inspect tier. Fixed shared coordinates, no per-scan fitting. Symbol window includes some surrounding plate ink; diagnostics are not whole-card accuracy percentages.',
  set,
  captureHash: hash(bytes),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  methods,
  rect,
  variants: capture.variants,
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - start,
    scope: 'CPU PNG decoding, canonical sampling and structural metrics. No Chromium or GPU work.',
  },
});
console.log(
  JSON.stringify(Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, v.all])), null, 2),
);
