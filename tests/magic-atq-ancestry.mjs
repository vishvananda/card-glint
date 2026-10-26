import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  atqProfileDelta,
  preAtqProfileSource,
  atqHistoricalSourceFiles,
  atqProfileHistoricalHash,
  atqProfileRuntimeCompatible,
  atqProfileAffected,
} from '../games/magic/tools/accuracy/atq-profile-ancestry.mjs';
const p = await atqProfileDelta();
assert.equal(await sourceHash(root + '/games/magic/src'), p.afterRenderer);
assert.equal(await atqProfileHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after, file);
  assert.equal(hash(await preAtqProfileSource(file, bytes)), e.before ?? e.after, file);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unreviewed edit\n')]);
  assert.deepEqual(await preAtqProfileSource(file, foreign), foreign);
}
const added = Object.entries(p.files)
  .filter(([, e]) => e.beforeSource === null)
  .map(([f]) => f);
assert.deepEqual(added, ['games/magic/src/calibration/sets/atq.ts']);
assert.deepEqual(await atqHistoricalSourceFiles(added), []);
for (const set of ['lea', 'leb', '2ed', 'arn'])
  assert(await atqProfileRuntimeCompatible('games/magic/src', p.beforeRenderer, set));
for (const set of ['atq', undefined])
  assert.equal(await atqProfileRuntimeCompatible('games/magic/src', p.beforeRenderer, set), false);
assert.equal(await atqProfileRuntimeCompatible('games/magic/src', '0'.repeat(64), 'lea'), false);
for (const task of ['frameColor', 'rules', 'setSymbol', 'manaColor', 'fullCard'])
  assert(atqProfileAffected('atq', task));
for (const task of ['references', 'normalization'])
  assert.equal(atqProfileAffected('atq', task), false);
assert.equal(atqProfileAffected('atq', 'rules', true), false);
assert.equal(atqProfileAffected('arn', 'rules'), false);
const artifacts = {};
for (const [name, a] of Object.entries(p.artifacts)) {
  const z = await readFile(a.file);
  assert.equal(hash(z), a.sha256);
  const bytes = gunzipSync(z);
  assert.equal(hash(bytes), a.contentSha256);
  artifacts[name] = JSON.parse(bytes);
}
const n = artifacts['integrated-native.json.gz'],
  s = artifacts['integrated-scores.json.gz'];
assert.equal(n.status, 'complete');
assert.equal(n.completed, 102);
assert.equal(n.source.rendererHash, p.priorRevision.rendererHash);
assert.equal(s.source.rendererHash, p.priorRevision.rendererHash);
assert.equal(s.source.nativeCaptureHash, p.artifacts['integrated-native.json.gz'].contentSha256);
assert.equal(s.rows.length, 102);
assert.equal(new Set(s.rows.map((r) => r.id)).size, 102);
for (const r of s.rows) {
  const native = n.rows.find((n) => n.id === r.id);
  assert(native);
  assert.equal(r.candidateHash, native.images.original.sha256);
  assert.equal(r.poseHash, native.poseHash);
  assert.equal(r.referenceHash, native.referenceHash);
  for (const mode of ['original', 'oracleModern', 'oracleOriginalSymbols', 'oracleFlavor']) {
    assert.match(native.images[mode].sha256, /^[a-f0-9]{64}$/);
    assert.equal(native.images[mode].layout?.overflow ?? false, false);
  }
}
const mean = (key) => s.rows.reduce((sum, r) => sum + r[key].structuralScore * 100, 0) / 102;
assert.equal(mean('before'), s.summary.all.before100);
assert.equal(mean('candidate'), s.summary.all.candidate100);
assert(s.summary.all.candidate100 - s.summary.all.before100 > 5);
assert.equal(s.summary.all.improved, 101);
assert.equal(s.summary.all.regressed, 1);
assert.equal(s.summary.validation.regressed, 0);
const factories = n.rows.filter((r) => r.name === "Mishra's Factory");
assert.equal(factories.length, 4);
for (const r of factories) {
  const layout = r.images.original.layout;
  assert.equal(layout.top, 414);
  assert.equal(layout.size, 21.75);
  assert.equal(layout.lines.length, 8);
}
const previousScores = artifacts['pre-minus-scores.json.gz'];
assert.equal(s.source.priorScoresHash, p.artifacts['pre-minus-scores.json.gz'].contentSha256);
assert.deepEqual(s.source.metricGraph, previousScores.source.metricGraph);
let reused = 0;
for (const row of s.rows) {
  const old = previousScores.rows.find((r) => r.id === row.id);
  assert.deepEqual(row.before, old.before);
  if (row.candidateHash === old.candidateHash) {
    assert.deepEqual(row.candidate, old.candidate);
    reused++;
  } else assert.equal(row.name, 'Shapeshifter');
}
assert.equal(reused, 101);
const footer = artifacts['footer-parity.json.gz'];
assert.equal(footer.rendererHash, p.priorRevision.rendererHash);
for (const row of footer.rows.filter((r) => r.material !== 'U'))
  assert.equal(row.before, row.after);
const controls = artifacts['unaffected-native.json.gz'];
assert.equal(controls.rows.length, 991);
for (const r of controls.rows) assert.equal(r.before, r.after);
const parentReceipt = await readFile(p.priorRevision.receipt.file);
assert.equal(hash(parentReceipt), p.priorRevision.receipt.sha256);
const parent = JSON.parse(gunzipSync(parentReceipt));
assert.equal(parent.afterRenderer, p.priorRevision.rendererHash);
for (const [name, a] of Object.entries(parent.artifacts))
  assert.deepEqual(p.artifacts[name], a, 'Historical artifact changed: ' + name);
const latest = artifacts['rim-integrated-native.json.gz'],
  scores = artifacts['rim-integrated-scores.json.gz'],
  parity = artifacts['rim-parity.json.gz'],
  prototype = artifacts['land-rim-prototype-native.json.gz'],
  trials = artifacts['land-rim-prototype-scores.json.gz'];
assert.equal(latest.status, 'complete');
assert.equal(latest.source.rendererHash, p.afterRenderer);
assert.equal(scores.source.rendererHash, p.afterRenderer);
assert.equal(
  scores.source.nativeCaptureHash,
  p.artifacts['rim-integrated-native.json.gz'].contentSha256,
);
assert.equal(scores.source.priorScoresHash, p.artifacts['integrated-scores.json.gz'].contentSha256);
assert.deepEqual(scores.source.reuse, {
  reused: 81,
  recomputed: 21,
  reason:
    '102 native PNGs verified, semantic faces/references/poses/metric graph identical; rescore only21 changed lands.',
});
assert.equal(scores.rows.length, 102);
assert.equal(latest.rows.length, 102);
assert.equal(parity.rows.length, 102);
assert.equal(trials.summary['geometry-rim-s110'].all.improved, 21);
assert.equal(trials.summary['geometry-rim-s110'].all.regressed, 0);
assert(trials.summary['geometry-rim-s110'].calibration.delta100 > 9);
assert(trials.summary['geometry-rim-s110'].validation.delta100 > 9);
let lands = 0,
  same = 0;
for (const row of latest.rows) {
  const old = n.rows.find((r) => r.id === row.id),
    score = scores.rows.find((r) => r.id === row.id),
    priorScore = s.rows.find((r) => r.id === row.id);
  assert(old && score && priorScore);
  assert.equal(row.referenceHash, old.referenceHash);
  assert.equal(row.poseHash, old.poseHash);
  assert.equal(score.candidateHash, row.images.original.sha256);
  assert.deepEqual(score.before, priorScore.before);
  for (const mode of ['original', 'oracleModern', 'oracleOriginalSymbols', 'oracleFlavor']) {
    assert.deepEqual(row.images[mode].layout, old.images[mode].layout);
    assert.equal(row.images[mode].layout?.overflow ?? false, false);
  }
  if (row.material === 'L') {
    lands++;
    const trial = prototype.rows.find((r) => r.id === row.id).trials['geometry-rim-s110'];
    assert.equal(row.images.original.sha256, trial.sha256);
    assert.equal(row.images.etching.sha256, trial.etchingHash);
    assert(score.candidate.structuralScore > priorScore.candidate.structuralScore);
  } else {
    same++;
    for (const mode of [
      'original',
      'oracleModern',
      'oracleOriginalSymbols',
      'oracleFlavor',
      'etching',
    ])
      assert.equal(row.images[mode].sha256, old.images[mode].sha256);
    assert.deepEqual(score.candidate, priorScore.candidate);
  }
}
assert.equal(lands, 21);
assert.equal(same, 81);
assert.equal(scores.summary.all.improved, 101);
assert.equal(scores.summary.all.regressed, 1);
assert(scores.summary.all.candidate100 - scores.summary.all.before100 > 7);
const allControls = artifacts['rim-unaffected-native-all.json.gz'];
assert.equal(allControls.rendererHash, p.afterRenderer);
assert.equal(allControls.rows.length, 1297);
assert.deepEqual([...new Set(allControls.rows.map((r) => r.set))].sort(), [
  '2ed',
  '3ed',
  'arn',
  'lea',
  'leb',
]);
for (const r of allControls.rows) assert.equal(r.before, r.after);
console.log(
  'ATQ revisions1–2:102 Originals/306 Oracle;21 improved lands,81 unchanged nonlands;1297 unchanged controls; immutable history and score reuse.',
);
