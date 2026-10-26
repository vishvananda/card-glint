import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { fitPrintedFrameTranslations } from '../games/magic/tools/accuracy/revised-artifact-normalize.mjs';

const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const review = JSON.parse(await readFile(base + 'interior-registration-review.json')),
  data = {};
for (const [file, a] of Object.entries(review.artifacts)) {
  const z = await readFile(base + file),
    raw = gunzipSync(z);
  assert.equal(hash(z), a.sha256);
  assert.equal(hash(raw), a.contentSha256);
  data[file] = JSON.parse(raw);
}
const portable = data['artifact-interior-normalization.json.gz'];
const prototype = data['artifact-interior-normalization-prototype.json.gz'];
const scores = data['artifact-interior-geometry-scores.json.gz'];
const readGzip = async (f) => gunzipSync(await readFile(base + f));
const inputs = await readGzip('original-inputs.json.gz'),
  poses = await readGzip('normalization-baseline.json.gz');
const oldGeometry = JSON.parse(await readGzip('artifact-geometry-scores.json.gz'));
const capture = JSON.parse(await readGzip('artifact-geometry-native.json.gz'));
assert.equal(portable.inputHash, hash(inputs));
assert.equal(portable.posesHash, hash(poses));
assert.equal(scores.inputHash, portable.inputHash);
assert.equal(
  scores.posesHash,
  review.artifacts['artifact-interior-normalization-prototype.json.gz'].contentSha256,
);
assert.equal(scores.captureHash, hash(await readGzip('artifact-geometry-native.json.gz')));
assert.match(portable.status, /awaiting-visual/);
assert.match(scores.status, /not-adopted/);
assert.equal(portable.rows.length, 51);
assert.equal(portable.summary.accepted, 46);
assert.equal(portable.excludedMaterials.length, 255);
assert(portable.rows.every((r) => r.contentIsolationPassed));
const replay = fitPrintedFrameTranslations(portable.rows);
assert.deepEqual(replay.templates, portable.templates);
assert.deepEqual(replay.medoid, portable.medoid);
assert.equal(replay.gauge, portable.gauge);
for (const r of replay.rows) {
  const before = portable.rows.find((v) => v.id === r.id),
    prior = prototype.rows.find((v) => v.id === r.id);
  for (const k of ['fit', 'validation', 'accepted', 'interiorDelta']) {
    assert.deepEqual(r[k], before[k]);
    assert.deepEqual(r[k], prior[k]);
  }
  assert.deepEqual(before.transform, prior.transform);
  assert.deepEqual(before.stockTransform, prior.stockTransform);
}
const accepted = portable.rows
  .filter((r) => r.accepted)
  .map((r) => r.id)
  .sort();
assert.deepEqual(scores.rows.map((r) => r.id).sort(), accepted);
for (const r of scores.rows) {
  const pose = portable.rows.find((p) => p.id === r.id),
    native = capture.rows.find((n) => n.id === r.id);
  assert.equal(r.referenceHash, pose.referenceHash);
  assert.equal(r.poseHash, hash(JSON.stringify(pose.transform)));
  assert.equal(r.stockPoseHash, hash(JSON.stringify(pose.stockTransform)));
  for (const [id, v] of Object.entries(r.trials)) {
    assert.equal(v.sha256, native.trials[id].sha256);
    assert.equal(
      v.delta100,
      100 * (v.score.structuralScore - r.trials.current.score.structuralScore),
    );
  }
  assert(r.trials['-1.25'].delta100 > 0);
}
const oldLosses = oldGeometry.rows.filter((r) => r.trials['-1.25'].delta100 < 0);
assert.equal(oldLosses.length, 15);
assert(oldLosses.every((r) => accepted.includes(r.id)));
assert.equal(scores.summary['-1.25'].validation.cards, 14);
assert.equal(scores.summary['-1.25'].calibration.cards, 32);
assert.equal(scores.summary['-1.25'].all.regressed, 0);
const selected = Object.entries(scores.summary).toSorted(
  ([, a], [, b]) => b.calibration.internalHorizontal100 - a.calibration.internalHorizontal100,
)[0][0];
assert.equal(selected, scores.selectedByCalibrationBands);

// Validation scans cannot move another card's template or the group's gauge.
const changed = structuredClone(portable.rows);
const validation = changed.find((r) => r.cohort === 'validation' && r.accepted);
validation.profiles.fitLeft.fill(0);
validation.profiles.fitRight.fill(0);
const poisoned = fitPrintedFrameTranslations(changed);
assert.deepEqual(poisoned.templates, replay.templates);
assert.equal(poisoned.gauge, replay.gauge);
assert.equal(poisoned.rows.find((r) => r.id === validation.id).accepted, false);
for (const r of poisoned.rows.filter((r) => r.id !== validation.id)) {
  const old = replay.rows.find((v) => v.id === r.id);
  assert.deepEqual(r.fit, old.fit);
  assert.deepEqual(r.interiorDelta, old.interiorDelta);
}
// Held checks may reject a pose; they cannot choose its shift.
const certificationChanged = structuredClone(portable.rows);
const target = certificationChanged.find((r) => r.cohort === 'validation' && r.accepted);
for (const key of ['validationLeft', 'validationRight', 'certificateLeft', 'certificateRight'])
  target.profiles[key].fill(0);
const verified = fitPrintedFrameTranslations(certificationChanged);
assert.deepEqual(
  verified.rows.map((r) => r.fit),
  replay.rows.map((r) => r.fit),
);
assert.equal(verified.rows.find((r) => r.id === target.id).accepted, false);
assert.throws(() => fitPrintedFrameTranslations([]));
const invalid = structuredClone(portable.rows);
invalid[0].profiles.fitLeft[0] = NaN;
assert.throws(() => fitPrintedFrameTranslations(invalid));
console.log(
  'Revised interior registration:51 exact profile replays,46 accepted poses,15 prior losses recovered; template isolation and rejected-pose exclusion passed.',
);
