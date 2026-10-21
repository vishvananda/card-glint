import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, readJson } from '../games/magic/tools/accuracy/common.mjs';
import {
  CALIBRATION_TASKS,
  calibrationTaskStatus,
} from '../games/magic/tools/accuracy/calibration-ledger.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
import {
  unlimitedCalibrationEvidence,
  applyUnlimitedEvidence,
} from '../games/magic/tools/accuracy/calibration-unlimited-evidence.mjs';
const data = await unlimitedCalibrationEvidence();
assert.equal(data.current, true);
for (const [file, expected] of Object.entries(data.receipt.artifacts))
  assert.equal(hash(await readFile(file)), expected, 'Changed Unlimited evidence ' + file);
const ledger = await readJson('games/magic/fixtures/accuracy/calibration-progress.json');
const set = ledger.sets.find((s) => s.set === '2ed');
assert.equal(set.groups.length, 27);
assert.equal(
  set.groups.reduce((n, g) => n + g.printings, 0),
  302,
);
for (const original of set.groups) {
  const group = structuredClone(original);
  applyUnlimitedEvidence(group, data);
  for (const task of Object.keys(CALIBRATION_TASKS)) {
    const item = calibrationTaskStatus(group, task);
    if (group.applicable?.[task] === false) assert.equal(item.status, 'not-applicable');
    else if (task !== 'release') assert.equal(item.status, 'validated', group.key + '/' + task);
  }
  const stale = structuredClone(original);
  applyUnlimitedEvidence(stale, { ...data, current: false });
  assert.equal(stale.tasks.fullCard.status, 'stale');
  const moved = structuredClone(original);
  moved.sourceHash = 'a'.repeat(64);
  applyUnlimitedEvidence(moved, data);
  assert.equal(moved.tasks.frameGeometry.status, 'stale');
  const missing = structuredClone(data);
  missing.receipt.rows = missing.receipt.rows.filter((r) => r.id !== group.printingIds[0]);
  assert.throws(() => applyUnlimitedEvidence(structuredClone(original), missing));
}
const reports = await calibrationReport({ sets: [set] });
assert.equal(
  reports[0].counts.validated,
  320 + set.groups.filter((g) => g.tasks.release.status === 'validated').length,
);
assert.equal(reports[0].originalRulesInputs.ready, 302);
assert.equal(reports[0].originalTypeInputs.ready, 302);
assert.equal(reports[0].counts['needs-audit'], 20);
assert.equal(reports[0].complete, false);
assert(reports[0].outstanding.every((r) => ['frameGeometry', 'fullCard'].includes(r.task)));
// Group-level guards must invalidate every applicable dependent task.
const tampered = structuredClone(set);
tampered.groups[0].guards['games/magic/src/calibration/sets/2ed.ts'] = '0'.repeat(64);
const invalid = await calibrationReport({ sets: [tampered] });
assert(invalid[0].outstanding.some((r) => r.task === 'fullCard' && r.status === 'stale'));
assert(data.receipt.metricCoverage.includes('excluded'));
assert.equal(data.receipt.native.artistOnlyOriginalChanges, 13);
console.log(
  'Unlimited:302 exact census members,27 variants,340 scoped checks; changed source/geometry/member and group guards reject; publication remains a separate gate.',
);

const templates = await readJson('games/magic/fixtures/accuracy/2ed/certified-scan-templates.json');
assert.equal(templates.references.length, 302);
assert.equal(templates.templateHash, data.receipt.scanTemplateHash);
for (const row of data.receipt.rows) {
  const reference = templates.references.find((r) => r.id === row.id);
  assert(reference?.accepted && reference.contentIsolationPassed);
  assert.equal(reference.referenceHash, row.referenceHash);
  assert.equal(hash(JSON.stringify(reference.transform)), row.poseHash);
  assert.equal(reference.nativeScoredPoseHash, row.poseHash);
}
console.log('Published scan templates preserve all302 certified reference/pose joins.');

// A better aggregate must not silently close a visibly wrong frame edge.
const cropReview = await readJson(
  'games/magic/fixtures/accuracy/early-through-fourth/2ed-dual-crop-review.json',
);
assert.equal(cropReview.status, 'open');
assert.equal(cropReview.candidateStudy.adopted, false);
const archive = await readFile(cropReview.candidateStudy.file);
assert.equal(hash(archive), cropReview.candidateStudy.sha256);
const { gunzipSync } = await import('node:zlib');
const cropStudy = JSON.parse(gunzipSync(archive));
assert.equal(cropStudy.capture.rows.length, 10);
assert.equal(cropStudy.scores.rows.length, 10);
for (const row of cropStudy.capture.rows) {
  const original = data.receipt.rows.find((r) => r.id === row.id);
  assert.equal(row.referenceHash, original.referenceHash);
  assert.equal(row.poseHash, original.poseHash);
  assert.equal(row.variants.length, 4);
  assert.equal(row.variants[0].hash, original.nativeFaceHash);
  for (const variant of row.variants)
    assert.deepEqual(
      variant.values,
      cropStudy.capture.rows[0].variants.find((v) => v.name === variant.name).values,
    );
}
const summary = cropStudy.scores.summary;
assert(summary['up-3-art'].structural100 > summary.current.structural100);
assert(summary['up-3-art'].strips.top > summary['up-3.5-art'].strips.top);
assert(summary['up-3.5-art'].structural100 > summary['up-3-art'].structural100);
console.log(
  'Dual crop:40 native candidates,10 exact baseline matches; boundary diagnostic rejects the misleading aggregate optimum. Review remains open.',
);
