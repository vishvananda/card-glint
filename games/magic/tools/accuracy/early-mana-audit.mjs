import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { readJson, writeJson, outputRoot, fixtureRoot, hash } from './common.mjs';
const set = process.argv[2];
assert.ok(['lea', '2ed'].includes(set));
const base = path.join(outputRoot, set);
const started = performance.now();
const plan = await readJson(path.join(fixtureRoot, 'early-mana-plan.json'));
const frozen = await readJson(path.join(fixtureRoot, 'early-mana-candidate.json'));
const beforeBytes = await readFile(path.join(base, plan.sourceRun, 'capture.json'));
assert.equal(hash(beforeBytes), plan.sets.find((s) => s.code === set).captureHash);
const before = JSON.parse(beforeBytes),
  after = await readJson(path.join(base, 'early-mana/capture.json'));
assert.ok(before.complete && after.complete);
assert.equal(after.results.length, set === 'lea' ? 295 : 302);
const pairs = [];
let prototypeMatches = 0,
  identical = 0,
  outsideChanges = 0;
for (const card of after.results) {
  const old = before.results.find((c) => c.id === card.id);
  assert.equal(card.issue, null);
  assert.equal(card.inputHash, old.inputHash);
  assert.deepEqual(card.layout, old.layout);
  assert.deepEqual(card.assets, old.assets);
  const eligible = card.frame === 'retro-abu' && card.face.manaSymbols.length > 0;
  if (!eligible) identical++;
  const refBytes = await readFile(path.join(base, plan.sourceRun, old.images.reference.file));
  assert.equal(hash(refBytes), card.images.reference.sha256);
  const reference = normalize(PNG.sync.read(refBytes));
  const left = Math.floor(434 - (card.face.manaSymbols.length - 1) * 27 - 18);
  const rect = [left, 31, 454 - left, 31];
  const scores = {};
  for (const tier of ['inspect', 'table']) {
    const aBytes = await readFile(path.join(base, plan.sourceRun, old.images[tier].file));
    const bBytes = await readFile(path.join(base, 'early-mana', card.images[tier].file));
    assert.equal(hash(aBytes), old.images[tier].sha256);
    assert.equal(hash(bBytes), card.images[tier].sha256);
    assert.equal(hash(aBytes) !== hash(bBytes), eligible, `${card.name} ${tier}`);
    const a = PNG.sync.read(aBytes),
      b = PNG.sync.read(bBytes),
      scale = tier === 'inspect' ? 1.5 : 0.5;
    for (let y = 0; y < b.height; y++) {
      const start = y * b.width * 4,
        end = start + b.width * 4;
      if (y < 25 * scale || y >= 69 * scale)
        assert.ok(
          a.data.subarray(start, end).equals(b.data.subarray(start, end)),
          `${card.name}: non-mana row changed`,
        );
      else {
        const left = Math.floor(290 * scale) * 4,
          right = Math.ceil(460 * scale) * 4;
        assert.ok(
          a.data.subarray(start, start + left).equals(b.data.subarray(start, start + left)),
        );
        assert.ok(a.data.subarray(start + right, end).equals(b.data.subarray(start + right, end)));
        for (let i = start + left + 3; i < start + right; i += 4)
          assert.equal(a.data[i], b.data[i], 'Silhouette alpha changed');
      }
    }
    if (eligible) {
      const r = cropGray(reference, rect);
      const measure = (image) => {
        const p = cropGray(normalize(image), rect);
        const m = compareRegion(r.gray, p.gray, r.width, r.height);
        return {
          edgeF1: m.edgeF1[1],
          census: m.censusSimilarity,
          contrast: letteringContrast(r.gray, p.gray, r.width, r.height),
        };
      };
      const x = measure(a),
        y = measure(b);
      scores[tier] = { before: x, after: y, delta: y.edgeF1 - x.edgeF1 };
    }
  }
  pairs.push({
    id: card.id,
    name: card.name,
    number: card.collectorNumber,
    cost: card.face.manaSymbols,
    group: card.face.frameColors ?? card.face.colors,
    changed: eligible,
    inputHash: card.inputHash,
    referenceHash: card.images.reference.sha256,
    scores,
  });
}
assert.equal(outsideChanges, 0, 'Pixels outside mana region changed');
for (const phase of set === 'lea' ? [frozen.developmentPhase, 'validation'] : ['validation']) {
  const trial = await readJson(path.join(outputRoot, 'early-mana', `${set}-${phase}/trial.json`));
  assert.equal(trial.experimentHash, frozen.experimentHash);
  for (const card of trial.results)
    for (const tier of ['inspect', 'table']) {
      const score = card.scores.find((s) => s.tier === tier && s.candidate === frozen.candidate.id);
      assert.equal(
        after.results.find((r) => r.id === card.id).images[tier].sha256,
        score.sha256,
        `${card.name} ${tier} differs from frozen prototype`,
      );
      prototypeMatches++;
    }
}
const summary = Object.fromEntries(
  ['inspect', 'table'].map((tier) => {
    const rows = pairs.filter((p) => p.changed);
    return [
      tier,
      {
        count: rows.length,
        medianBefore: median(rows.map((p) => p.scores[tier].before.edgeF1)),
        medianAfter: median(rows.map((p) => p.scores[tier].after.edgeF1)),
        gains: rows.filter((p) => p.scores[tier].delta > 0.02).length,
        regressions: rows.filter((p) => p.scores[tier].delta < -0.02).map((p) => p.name),
      },
    ];
  }),
);
await writeJson(path.join(fixtureRoot, `${set}/mana-measurement.json`), {
  schemaVersion: 1,
  set,
  seconds: (performance.now() - started) / 1000,
  timingScope:
    'Offline Node PNG decoding, invariant checks and region metrics. CPU elapsed time, not renderer submission or GPU completion time.',
  rendererHash: after.rendererHash,
  baselineRendererHash: before.rendererHash,
  baselineCaptureHash: hash(beforeBytes),
  afterCaptureHash: hash(await readFile(path.join(base, 'early-mana/capture.json'))),
  auditHash: hash(await readFile(new URL(import.meta.url))),
  candidateHash: hash(await readFile(path.join(fixtureRoot, 'early-mana-candidate.json'))),
  identical,
  prototypeMatches,
  outsideChanges,
  summary,
  pairs,
  note: 'Early-frame header-only change; identical source inputs, frame assets and body layout. Shared row geometry, no per-scan registration. Existing symbol contours remain imperfect. Other-set checks verify preservation, not accuracy transfer.',
});
console.log(JSON.stringify({ identical, prototypeMatches, outsideChanges, summary }, null, 2));
