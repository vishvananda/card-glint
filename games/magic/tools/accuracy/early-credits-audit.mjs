import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { median } from './metrics.mjs';
import { readJson, writeJson, fixtureRoot, outputRoot, hash } from './common.mjs';

const set = process.argv[2];
assert.ok(['lea', '2ed'].includes(set));
const base = path.join(outputRoot, set);
const beforeBytes = await readFile(path.join(base, 'early-fields-corpus/capture.json'));
const afterBytes = await readFile(path.join(base, 'early-credits/capture.json'));
const before = JSON.parse(beforeBytes),
  after = JSON.parse(afterBytes);
assert.ok(before.complete && after.complete);
assert.equal(before.results.length, set === 'lea' ? 295 : 302);
assert.equal(after.results.length, before.results.length);
const frozen = await readJson(path.join(fixtureRoot, 'early-lettering-candidate.json'));
const transfer = await readJson(path.join(fixtureRoot, 'early-lettering-transfer.json'));
const prototypes = new Map();
for (const phase of ['development-final', 'validation']) {
  const dir = path.join(outputRoot, 'early-lettering', phase);
  const trial = await readJson(path.join(dir, 'trial.json'));
  assert.equal(trial.experimentHash, frozen.experimentHash);
  for (const row of trial.results.filter((r) => r.set === set))
    prototypes.set(row.id, { dir, row });
}
const image = async (run, asset) => {
  const bytes = await readFile(path.join(base, run, asset.file));
  assert.equal(hash(bytes), asset.sha256);
  return PNG.sync.read(bytes);
};
const rect = [42, 607, 347, 38];
const pairs = [];
let prototypeMatches = 0;
const started = performance.now();
for (const card of after.results) {
  const old = before.results.find((c) => c.id === card.id);
  assert.equal(card.issue, null);
  assert.equal(card.inputHash, old.inputHash);
  assert.deepEqual(card.assets, old.assets);
  assert.deepEqual(card.layout, old.layout);
  const reference = normalize(await image('early-fields-corpus', old.images.reference));
  assert.equal(old.images.reference.sha256, card.images.reference.sha256);
  const target = cropGray(reference, rect);
  const scores = {};
  for (const tier of ['inspect', 'table']) {
    const a = await image('early-fields-corpus', old.images[tier]);
    const b = await image('early-credits', card.images[tier]);
    assert.equal(a.width, b.width);
    assert.equal(a.height, b.height);
    const scale = b.width / 488;
    const left = Math.floor(40 * scale),
      right = Math.ceil(391 * scale);
    const top = Math.floor(600 * scale),
      bottom = Math.ceil(651 * scale);
    const prototype = prototypes.get(card.id);
    let expected = null;
    if (prototype) {
      const s = prototype.row.scores.find(
        (s) => s.tier === tier && s.candidate === frozen.candidate.id,
      );
      const bytes = await readFile(path.join(prototype.dir, s.file));
      assert.equal(hash(bytes), s.sha256);
      expected = PNG.sync.read(bytes);
    }
    for (let y = 0; y < b.height; y++) {
      const start = y * b.width * 4,
        end = start + b.width * 4;
      if (y < top || y >= bottom)
        assert.ok(
          a.data.subarray(start, end).equals(b.data.subarray(start, end)),
          `${card.name}: changed outside credits`,
        );
      else {
        assert.ok(
          a.data.subarray(start, start + left * 4).equals(b.data.subarray(start, start + left * 4)),
        );
        assert.ok(
          a.data.subarray(start + right * 4, end).equals(b.data.subarray(start + right * 4, end)),
        );
        for (let x = left; x < right; x++) {
          const i = start + x * 4;
          assert.equal(a.data[i + 3], b.data[i + 3], 'Alpha changed');
        }
        if (expected)
          assert.ok(
            expected.data
              .subarray(start + left * 4, start + right * 4)
              .equals(b.data.subarray(start + left * 4, start + right * 4)),
            `${card.name}: frozen credit differs`,
          );
      }
    }
    if (prototype) prototypeMatches++;
    const measure = (raster) => {
      const crop = cropGray(normalize(raster), rect);
      return {
        ...compareLettering(target.gray, crop.gray, crop.width, crop.height),
        contrast: letteringContrast(target.gray, crop.gray, crop.width, crop.height),
      };
    };
    scores[tier] = { before: measure(a), after: measure(b) };
  }
  pairs.push({
    id: card.id,
    name: card.name,
    number: card.collectorNumber,
    inputHash: card.inputHash,
    referenceHash: card.images.reference.sha256,
    reviewedCredit:
      prototypes.has(card.id) && !transfer.sourceExclusions.some((e) => e.id === card.id),
    changed: old.images.inspect.sha256 !== card.images.inspect.sha256,
    scores,
  });
  if (pairs.length % 50 === 0)
    console.log(`Measured ${set} ${pairs.length}/${after.results.length}`);
}
assert.equal(prototypeMatches, 32);
const summary = ['corpus-diagnostic', 'reviewed-credits'].flatMap((scope) =>
  ['inspect', 'table'].map((tier) => {
    const rows = pairs.filter((p) => scope === 'corpus-diagnostic' || p.reviewedCredit);
    return {
      scope,
      tier,
      count: rows.length,
      beforeF1: median(rows.map((p) => p.scores[tier].before.edgeF1)),
      afterF1: median(rows.map((p) => p.scores[tier].after.edgeF1)),
      beforeContrast: median(rows.map((p) => p.scores[tier].before.contrast)),
      afterContrast: median(rows.map((p) => p.scores[tier].after.contrast)),
      gains: rows.filter((p) => p.scores[tier].after.edgeF1 > p.scores[tier].before.edgeF1 + 0.02)
        .length,
      regressions: rows
        .filter((p) => p.scores[tier].after.edgeF1 < p.scores[tier].before.edgeF1 - 0.02)
        .map((p) => ({
          id: p.id,
          name: p.name,
          number: p.number,
          delta: p.scores[tier].after.edgeF1 - p.scores[tier].before.edgeF1,
        })),
    };
  }),
);
await writeJson(path.join(fixtureRoot, set, 'early-credits-measurement.json'), {
  schemaVersion: 1,
  set,
  beforeCaptureHash: hash(beforeBytes),
  afterCaptureHash: hash(afterBytes),
  rendererHash: after.rendererHash,
  metricHash: frozen.metricHash,
  scope:
    'Node PNG decoding, normalization, invariant checks and paired credit metrics. No browser or per-scan registration in this audit. CPU elapsed time is not GPU completion time.',
  seconds: (performance.now() - started) / 1000,
  outsideCreditChanges: 0,
  prototypeMatches,
  changed: pairs.filter((p) => p.changed).length,
  summary,
  pairs,
});
console.log(JSON.stringify({ set, prototypeMatches, summary }));
