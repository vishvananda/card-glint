import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const load = async (file) => {
  const bytes = gunzipSync(await readFile(base + file));
  return { bytes, value: JSON.parse(bytes) };
};
const report = await load('current-stock-full-scores.json.gz');
const capture = await load('artifact-adopted-native-originals.json.gz');
const prior = await load('semantic-frame-scores.json.gz');
const inputs = await load('corrected-original-inputs.json.gz');
const poses = await load('normalization-baseline.json.gz');
const p = report.value;
assert.equal(p.status, 'complete-native-original-stock-baseline');
assert.equal(p.rendererHash, capture.value.source.rendererHash);
assert.equal(p.inputHash, hash(inputs.bytes));
assert.equal(p.captureHash, hash(capture.bytes));
assert.equal(p.priorHash, hash(prior.bytes));
assert.equal(p.posesHash, hash(poses.bytes));
assert.deepEqual(p.metricGraph, prior.value.metricGraph);
assert.equal(p.rows.length, 306);
assert.deepEqual(p.rows.map((r) => r.id).sort(), inputs.value.entries.map((e) => e.id).sort());
let reused = 0,
  fresh = 0;
for (const row of p.rows) {
  const native = capture.value.rows.find((r) => r.id === row.id).modes.original;
  const old = prior.value.rows.find((r) => r.id === row.id);
  const pose = poses.value.rows.find((r) => r.id === row.id);
  assert(pose.accepted);
  assert.equal(row.nativeHash, native.sha256);
  assert.equal(row.inputHash, native.inputHash);
  assert.equal(row.referenceHash, old.referenceHash);
  assert.equal(row.inputHash, old.inputHash);
  assert.equal(row.poseHash, hash(JSON.stringify(pose.transform)));
  assert.equal(row.poseHash, old.poseHash);
  assert.deepEqual(row.beforeScore, old.score);
  assert.equal(row.delta100, 100 * (row.score.structuralScore - old.score.structuralScore));
  if (row.scoreReused) {
    reused++;
    assert.equal(row.nativeHash, old.after);
    assert.deepEqual(row.score, old.score);
    assert.notEqual(row.material, 'A');
  } else {
    fresh++;
    assert.notEqual(row.nativeHash, old.after);
    assert.equal(row.material, 'A');
  }
}
assert.deepEqual({ reused, fresh }, p.reuse);
assert.equal(reused, 255);
assert.equal(fresh, 51);
const mean = (values) => values.reduce((s, v) => s + v, 0) / values.length;
for (const [material, s] of Object.entries(p.summary)) {
  const rows = p.rows.filter((r) => material === 'all' || r.material === material);
  assert.equal(s.cards, rows.length);
  assert.equal(s.before100, mean(rows.map((r) => r.beforeScore.structuralScore * 100)));
  assert.equal(s.current100, mean(rows.map((r) => r.score.structuralScore * 100)));
  assert.equal(s.improved, rows.filter((r) => r.delta100 > 1e-9).length);
  assert.equal(s.regressed, rows.filter((r) => r.delta100 < -1e-9).length);
}
console.log(
  'Revised current baseline:306 complete Original stock-pose joins;255 exact score reuses and51 fresh artifact scores;interior normalization remains separate.',
);

const whole = await load('body-whole-card-scores.json.gz');
const current = await load('body-native-originals.json.gz');
const w = whole.value;
assert.equal(w.status, 'complete-native-original-whole-card-comparison');
assert.equal(w.captureHash, hash(current.bytes));
assert.equal(w.priorHash, hash(report.bytes));
assert.equal(w.inputHash, p.inputHash);
assert.equal(w.posesHash, p.posesHash);
assert.deepEqual(w.metricGraph, p.metricGraph);
assert.equal(w.rows.length, 306);
assert.deepEqual(w.reuse, { reused: 25, fresh: 281 });
for (const r of w.rows) {
  const old = p.rows.find((x) => x.id === r.id),
    n = current.value.rows.find((x) => x.id === r.id);
  assert.equal(r.nativeHash, n.modes.original.sha256);
  assert.equal(r.inputHash, n.modes.original.inputHash);
  for (const k of ['inputHash', 'referenceHash', 'poseHash']) assert.equal(r[k], old[k]);
  assert.deepEqual(r.beforeScore, old.score);
  assert.equal(r.delta100, 100 * (r.score.structuralScore - old.score.structuralScore));
  assert.equal(r.scoreReused, r.material === 'L');
  if (r.scoreReused) {
    assert.deepEqual(r.score, old.score);
    assert.equal(r.nativeHash, old.nativeHash);
  } else assert.notEqual(r.nativeHash, old.nativeHash);
}
for (const [material, t] of Object.entries(w.summary)) {
  const rs = w.rows.filter((r) => material === 'all' || r.material === material);
  assert.equal(t.cards, rs.length);
  assert.equal(t.before100, mean(rs.map((r) => 100 * r.beforeScore.structuralScore)));
  assert.equal(t.current100, mean(rs.map((r) => 100 * r.score.structuralScore)));
  assert.equal(t.improved, rs.filter((r) => r.delta100 > 1e-9).length);
  assert.equal(t.regressed, rs.filter((r) => r.delta100 < -1e-9).length);
}
assert(w.summary.all.current100 > w.summary.all.before100);
console.log(
  'Revised body whole-card comparison:306 exact native/input/reference/pose/metric joins;281 fresh scores,25 exact reused land scores;215 gains and66 recorded losses.',
);
