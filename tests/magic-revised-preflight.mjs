import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const review = JSON.parse(await readFile(base + 'pre-fit-review.json'));
const artifacts = {};
for (const [file, a] of Object.entries(review.artifacts)) {
  const z = await readFile(base + file);
  assert.equal(hash(z), a.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), a.contentSha256);
  artifacts[file] = JSON.parse(raw);
}
const inputBytes = gunzipSync(await readFile(base + 'original-inputs.json.gz'));
const inputs = JSON.parse(inputBytes);
const nativeBytes = gunzipSync(await readFile(base + 'native-baseline.json.gz'));
const native = JSON.parse(nativeBytes);
const baselineScores = JSON.parse(gunzipSync(await readFile(base + 'scores-baseline.json.gz')));
const posesBytes = gunzipSync(await readFile(base + 'normalization-baseline.json.gz'));
const poses = JSON.parse(posesBytes);
const corrections = artifacts['body-corrections-initial.json.gz'];
const checked = artifacts['body-corrections-native.json.gz'];
const bands = artifacts['frame-bands-baseline.json.gz'];
assert.equal(inputs.entries.length, 306);
assert.equal(native.rows.length, 306);
assert.equal(bands.rows.length, 306);
assert.equal(bands.inputHash, hash(inputBytes));
assert.equal(bands.captureHash, hash(nativeBytes));
assert.equal(bands.normalizationHash, hash(posesBytes));
assert.equal(checked.posesHash, hash(posesBytes));
assert.equal(checked.rows.length, 2);
assert.equal(checked.unchangedOriginals, 304);
assert.deepEqual(checked.metricGraph, baselineScores.source.metricGraph);
const controlsBytes = gunzipSync(
  await readFile('games/magic/fixtures/accuracy/atq-recheck/rim-unaffected-native-all.json.gz'),
);
const controls = JSON.parse(controlsBytes);
assert.equal(hash(controlsBytes), checked.controlsHash);
assert.equal(checked.rendererHash, controls.rendererHash);
const byId = new Map(checked.rows.map((r) => [r.id, r]));
assert.equal(byId.size, 2);
for (const e of inputs.entries) {
  const old = native.rows.find((r) => r.id === e.id);
  const control = controls.rows.find((r) => r.id === e.id);
  assert.equal(control.before, old.sha256);
  assert.equal(control.after, old.sha256);
  assert.equal(control.inputHash, hash(JSON.stringify(e.face)));
  const row = byId.get(e.id);
  if (!row) continue;
  const a = corrections.cards[e.id];
  assert.equal(a.reviewed, true);
  assert.deepEqual(a.reviewedFields, ['rulesText', 'rulesParagraphs']);
  assert.equal(a.referenceHash, e.reference.sha256);
  assert.equal(row.referenceHash, e.reference.sha256);
  assert.equal(row.poseHash, old.poseHash);
  assert.equal(row.poseHash, hash(JSON.stringify(poses.rows.find((r) => r.id === e.id).transform)));
  assert.equal(row.beforeHash, old.sha256);
  assert.equal(row.oldInputHash, hash(JSON.stringify(e.face)));
  assert.deepEqual(a.before, {
    rulesText: e.face.rulesText,
    rulesParagraphs: e.face.rulesParagraphs,
  });
  assert.equal(
    row.inputHash,
    hash(JSON.stringify({ ...e.face, rulesText: a.rulesText, rulesParagraphs: a.rulesParagraphs })),
  );
  assert.equal(row.outsideBody, 0);
  assert(row.changedPixels > 0);
  assert.equal(row.layoutAfter.overflow, false);
  assert.deepEqual(row.beforeScore, baselineScores.rows.find((r) => r.id === e.id).score);
  assert.equal(row.delta100, 100 * (row.score.structuralScore - row.beforeScore.structuralScore));
}
const costs = artifacts['body-cost-corrections.json.gz'];
assert.equal(costs.inputHash, hash(inputBytes));
assert.equal(costs.candidates.length, 9);
assert.equal(Object.keys(costs.cards).length, 7);
for (const [id, a] of Object.entries(costs.cards)) {
  assert(!corrections.cards[id], 'Duplicate earlier correction');
  const e = inputs.entries.find((e) => e.id === id);
  assert(e);
  assert.equal(a.referenceHash, e.reference.sha256);
  assert.equal(a.reviewed, true);
  assert.deepEqual(a.before, {
    rulesText: e.face.rulesText,
    rulesParagraphs: e.face.rulesParagraphs,
  });
  const prefix = /^((?:\{[0-9WUBRGT]+\})+): /;
  assert(prefix.test(a.rulesText));
  assert.equal(a.rulesText.replace(prefix, '$1 '), e.face.rulesText);
  const ps = structuredClone(a.rulesParagraphs);
  ps[0].runs[0].text = ps[0].runs[0].text.replace(prefix, '$1 ');
  assert.deepEqual(ps, e.face.rulesParagraphs, 'Only the printed cost colon may change');
}
assert.match(costs.status, /runtime-promotion-pending/);
for (const [correctionFile, nativeFile, count] of [
  ['body-batch-corrections.json.gz', 'body-batch-native.json.gz', 6],
  ['body-cost-corrections.json.gz', 'body-cost-native.json.gz', 7],
  ['body-final-corrections.json.gz', 'body-final-native.json.gz', 9],
]) {
  const batch = artifacts[correctionFile],
    batchNative = artifacts[nativeFile];
  assert.equal(Object.keys(batch.cards).length, count);
  assert.equal(batchNative.rows.length, count);
  assert.equal(new Set(batchNative.rows.map((r) => r.id)).size, count);
  assert.equal(batchNative.unchangedOriginals, 306 - count);
  assert.equal(batchNative.rendererHash, controls.rendererHash);
  assert.equal(batchNative.controlsHash, hash(controlsBytes));
  assert.equal(batchNative.posesHash, hash(posesBytes));
  assert.deepEqual(batchNative.metricGraph, baselineScores.source.metricGraph);
  for (const row of batchNative.rows) {
    const e = inputs.entries.find((e) => e.id === row.id),
      a = batch.cards[row.id],
      old = native.rows.find((r) => r.id === row.id);
    assert(e && a && old);
    assert.equal(a.reviewed, true);
    assert.deepEqual(a.reviewedFields, ['rulesText', 'rulesParagraphs']);
    assert.equal(a.referenceHash, e.reference.sha256);
    assert.deepEqual(a.before, {
      rulesText: e.face.rulesText,
      rulesParagraphs: e.face.rulesParagraphs,
    });
    assert.equal(row.referenceHash, e.reference.sha256);
    assert.equal(row.poseHash, old.poseHash);
    assert.equal(row.oldInputHash, hash(JSON.stringify(e.face)));
    assert.equal(row.beforeHash, old.sha256);
    assert.equal(
      row.inputHash,
      hash(
        JSON.stringify({ ...e.face, rulesText: a.rulesText, rulesParagraphs: a.rulesParagraphs }),
      ),
    );
    assert.equal(row.outsideBody, 0);
    assert.equal(row.layoutAfter.overflow, false);
    assert.deepEqual(row.beforeScore, baselineScores.rows.find((r) => r.id === e.id).score);
    assert.equal(row.delta100, 100 * (row.score.structuralScore - row.beforeScore.structuralScore));
    assert.equal(row.scoreReused, row.afterHash === row.beforeHash);
    assert.equal(row.scoreReused, row.changedPixels === 0);
    if (row.scoreReused) assert.deepEqual(row.score, row.beforeScore);
  }
  assert.match(batch.status, /runtime-promotion-pending/);
}
const allCorrections = new Map();
for (const file of [
  'body-corrections-initial.json.gz',
  'body-cost-corrections.json.gz',
  'body-batch-corrections.json.gz',
  'body-final-corrections.json.gz',
]) {
  for (const [id, correction] of Object.entries(artifacts[file].cards)) {
    assert(!allCorrections.has(id));
    allCorrections.set(id, { file, correction });
  }
}
const content = artifacts['body-content-review.json.gz'];
assert.equal(content.inputHash, hash(inputBytes));
assert.equal(content.denominator, 306);
assert.equal(content.checked, content.rows.length);
assert.equal(content.checked, content.denominator);
const alphabetical = inputs.entries.toSorted(
  (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
);
assert.deepEqual(
  content.rows.map((r) => r.id),
  alphabetical.slice(0, content.checked).map((r) => r.id),
);
for (const r of content.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    a = allCorrections.get(r.id)?.correction;
  assert.equal(r.correction, allCorrections.get(r.id)?.file ?? null);
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(r.reviewedRulesTextHash, hash(a?.rulesText ?? e.face.rulesText));
  assert.equal(
    r.reviewedParagraphsHash,
    hash(JSON.stringify(a?.rulesParagraphs ?? e.face.rulesParagraphs)),
  );
  assert.equal(
    r.decision,
    a ? 'matches-with-recorded-correction' : 'matches-current-original-source',
  );
}
const draft = artifacts['wording-promotion-draft.json.gz'];
assert.equal(Object.keys(draft.cards).length, 306);
for (const e of inputs.entries) {
  const row = draft.cards[e.id],
    a = allCorrections.get(e.id)?.correction;
  assert.equal(row.referenceHash, e.reference.sha256);
  assert.equal(row.typeLine, e.face.typeLine);
  if (a) {
    assert.deepEqual(row.paragraphs, a.rulesParagraphs);
    const text = (role) =>
      a.rulesParagraphs
        .filter((p) => p.role === role)
        .map((p) => p.runs.map((r) => r.text).join(''))
        .join('\n');
    assert.equal(row.rulesText, text('rules'));
    assert.equal(row.flavorText, text('flavor'));
  } else assert.deepEqual(row.reviewedFields, ['typeLine']);
}
assert.equal(allCorrections.size, 24);
assert.match(draft.status, /not-loaded-by-runtime/);
assert.match(content.status, /not-set-certification/);
assert.match(review.status, /not-set-certification/);
assert.match(corrections.status, /runtime-promotion-pending/);
console.log(
  'Revised preflight:306 frozen originals/poses and scan-read bodies;24 isolated native wording/style corrections with exact controls; no set certification.',
);
