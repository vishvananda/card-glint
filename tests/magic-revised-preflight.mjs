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
assert.match(review.status, /not-set-certification/);
assert.match(corrections.status, /runtime-promotion-pending/);
console.log(
  'Revised preflight:306 frozen originals/poses,304 exact current-source controls, two scan-backed text/style corrections and isolated native replays; no set certification.',
);
