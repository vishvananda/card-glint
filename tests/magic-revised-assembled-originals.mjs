import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { rebuildReviewedOriginals } from '../games/magic/tools/accuracy/reviewed-original-inputs.mjs';

const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const manifest = JSON.parse(await readFile(base + 'pre-fit-review.json'));
const artifacts = {};
for (const file of [
  'corrected-original-inputs.json.gz',
  'corrected-original-native.json.gz',
  'assembled-wording-native.json.gz',
  'corrected-original-scores.json.gz',
  'wording-promotion-draft.json.gz',
]) {
  const z = await readFile(base + file),
    raw = gunzipSync(z),
    a = manifest.artifacts[file];
  assert.equal(hash(z), a.sha256);
  assert.equal(hash(raw), a.contentSha256);
  artifacts[file] = { bytes: raw, data: JSON.parse(raw) };
}
const read = async (f) => JSON.parse(gunzipSync(await readFile(base + f)));
const before = await read('original-inputs.json.gz'),
  nativeBefore = await read('native-baseline.json.gz'),
  scoresBefore = await read('scores-baseline.json.gz');
const inputs = artifacts['corrected-original-inputs.json.gz'].data;
const native = artifacts['corrected-original-native.json.gz'].data;
const replay = artifacts['assembled-wording-native.json.gz'].data;
const scores = artifacts['corrected-original-scores.json.gz'].data;
const rebuilt = await rebuildReviewedOriginals(
  before,
  artifacts['wording-promotion-draft.json.gz'].data,
);
assert.equal(rebuilt.changes.length, 24);
assert.equal(inputs.entries.length, 306);
assert.equal(native.rows.length, 306);
assert.equal(scores.rows.length, 306);
assert.equal(replay.rows.length, 24);
assert.equal(replay.unchangedOriginals, 282);
assert.equal(native.source.inputHash, hash(artifacts['corrected-original-inputs.json.gz'].bytes));
assert.equal(
  native.source.correctionReplayHash,
  hash(artifacts['assembled-wording-native.json.gz'].bytes),
);
assert.equal(scores.source.captureHash, hash(artifacts['corrected-original-native.json.gz'].bytes));
assert.deepEqual(scores.source.metricGraph, scoresBefore.source.metricGraph);
const sourceOnly = new Map();
for (const file of [
  'body-corrections-native.json.gz',
  'body-batch-native.json.gz',
  'body-cost-native.json.gz',
  'body-final-native.json.gz',
])
  for (const r of (await read(file)).rows) {
    assert(!sourceOnly.has(r.id));
    sourceOnly.set(r.id, r);
  }
for (const e of inputs.entries) {
  const original = before.entries.find((r) => r.id === e.id);
  assert.deepEqual(rebuilt.inputs.entries.find((r) => r.id === e.id).face, e.face);
  assert.deepEqual(e.face.rulesAlignment, { mode: 'auto', reference: e.face.rulesParagraphs });
  assert.deepEqual(e.card, original.card, 'Provider and Oracle data must remain untouched');
  const n = native.rows.find((r) => r.id === e.id),
    s = scores.rows.find((r) => r.id === e.id),
    r = replay.rows.find((r) => r.id === e.id);
  assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(s.inputHash, n.inputHash);
  assert.equal(n.sha256, s.nativeHash);
  assert.equal(n.reused, !r);
  assert.equal(s.reused, !r);
  const old = nativeBefore.rows.find((r) => r.id === e.id),
    oldScore = scoresBefore.rows.find((r) => r.id === e.id);
  assert.equal(n.poseHash, old.poseHash);
  assert.equal(n.referenceHash, old.referenceHash);
  if (r) {
    assert.equal(r.inputHash, n.inputHash);
    assert.equal(r.afterHash, n.sha256);
    assert.equal(r.outsideBody, 0);
    assert.equal(r.layoutAfter.overflow, false);
    assert.deepEqual(s.score, r.score);
    assert.equal(r.afterHash, sourceOnly.get(e.id).afterHash);
    assert.deepEqual(r.score, sourceOnly.get(e.id).score);
  } else {
    assert.deepEqual(e.face, original.face);
    assert.equal(n.sha256, old.sha256);
    assert.deepEqual(s.score, oldScore.score);
  }
}
const average = (rows) => rows.reduce((v, r) => v + r.score.structuralScore * 100, 0) / rows.length;
assert.equal(scores.summary.before100, average(scoresBefore.rows));
assert.equal(scores.summary.after100, average(scores.rows));
assert.equal(scores.summary.reused, 282);
assert.match(scores.status, /not-set-certification/);
console.log(
  'Revised assembled Originals:production wording API reproduced306 self-aligned inputs;24 fresh native replays match source-only pixels/scores;282 exact unchanged controls reused.',
);
