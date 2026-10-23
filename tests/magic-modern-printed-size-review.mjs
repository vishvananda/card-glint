import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const dir = 'games/magic/fixtures/accuracy/m21/';
const review = JSON.parse(await readFile(dir + 'printing-size-diagnostic-review.json'));
const compressed = await readFile(dir + review.evidence.file);
assert.equal(hash(compressed), review.evidence.sha256);
const raw = gunzipSync(compressed);
assert.equal(hash(raw), review.evidence.contentSha256);
const evidence = JSON.parse(raw);
assert.equal(review.status, 'native-text-size-diagnostic-not-production-adoption');
const controls = new Map(evidence.studies.coarse.rows.map((row) => [row.id, row]));
for (const data of Object.values(evidence.studies)) {
  assert.equal(data.rows.length, 297);
  assert.equal(new Set(data.rows.map((row) => row.id)).size, 297);
  assert.deepEqual(data.faults, []);
  assert.equal(data.rows.filter((row) => row.trials).length, 268);
  for (const row of data.rows) {
    const old = controls.get(row.id);
    for (const field of [
      'inputHash',
      'referenceHash',
      'nativeFaceHash',
      'normalizedHash',
      'status',
    ])
      assert.equal(row[field], old[field]);
    if (row.trials) assert.deepEqual(row.trials[0], old.trials[0]);
  }
}
assert(evidence.studies.fine.parameters.perPrinting);
assert(evidence.studies.fine.definition.scope.includes('Per-printing diagnostic'));
assert(!evidence.studies.coarse.parameters.perPrinting);
assert.equal(
  hash(JSON.stringify(evidence.studies.coarse, null, 2) + '\n'),
  evidence.model.source.studyHash,
);
const close = (a, b) => assert(Math.abs(a - b) < 1e-9);
for (const key of ['individual', 'shared']) {
  const native = evidence[key],
    summary = native.summary;
  assert.deepEqual(review[key].summary, summary);
  assert.equal(native.rows.length, 297);
  assert.equal(new Set(native.rows.map((row) => row.id)).size, 297);
  assert.equal(summary.printings, 297);
  assert.equal(summary.unchangedEtchings, 297);
  assert.equal(summary.alphaChanges, 0);
  assert.equal(summary.outsideRulesChanges, 0);
  assert.equal(summary.selectedPrintings, Object.keys(native.plan.adjustments).length);
  assert.equal(native.scope.summary.outsideRegionChanges, 0);
  assert.equal(native.scope.summary.etchingChanges, 0);
  close(native.rows.reduce((sum, row) => sum + row.before100, 0) / 297, summary.before100);
  close(native.rows.reduce((sum, row) => sum + row.after100, 0) / 297, summary.after100);
  assert.equal(native.rows.filter((row) => row.delta100 > 1e-8).length, summary.improved);
  assert.equal(native.rows.filter((row) => row.delta100 < -1e-8).length, summary.regressed);
  assert.equal(
    native.rows.filter((row) => row.beforeFaceHash !== row.afterFaceHash).length,
    summary.changedFaces,
  );
  for (const row of native.rows) {
    const scope = native.scope.rows.find((s) => s.id === row.id);
    assert.equal(row.beforeFaceHash, controls.get(row.id).nativeFaceHash);
    assert.equal(row.referenceHash, controls.get(row.id).referenceHash);
    assert.equal(row.inputHash, controls.get(row.id).inputHash);
    assert.equal(row.beforeFaceHash, scope.beforeFaceHash);
    assert.equal(row.afterFaceHash, scope.afterFaceHash);
    assert.equal(row.etchingHash, scope.etchingHash);
    if (row.beforeFaceHash !== row.afterFaceHash)
      assert(native.plan.adjustments[row.id], 'An unselected printing changed');
    for (const digest of [row.beforeFaceHash, row.afterFaceHash, row.etchingHash, row.poseHash])
      assert.match(digest, /^[a-f0-9]{64}$/);
  }
}
assert.equal(evidence.individual.summary.improved, 105);
assert.equal(evidence.individual.summary.regressed, 0);
assert.equal(evidence.individual.summary.unchangedFaces, 192);
assert.equal(evidence.shared.summary.selectedPrintings, 54);
assert.equal(evidence.shared.summary.changedFaces, 44);
assert.equal(evidence.shared.summary.improved, 25);
assert.equal(evidence.shared.summary.regressed, 19);
assert.equal(evidence.individual.summary.scoreReuse.reused, 192);
assert.equal(evidence.shared.summary.scoreReuse.reused, 253);
// The diagnostic native method remains reproducible after later tool extensions.
for (const [file, source] of Object.entries(evidence.archivedNativeProposalMethods)) {
  const expected =
    file === 'modern-calibration-native.mjs'
      ? evidence.individual.definition.nativeToolHash
      : new Map(evidence.individual.definition.proposalTools).get(file);
  assert.equal(hash(source), expected);
}
// A shared model must resolve the same action from text features for all
// printings, rather than leaking adaptive per-card best-fit centers.
const candidates = evidence.studies.coarse.parameters.candidates;
for (const row of evidence.modelFeatures) {
  let node = evidence.shared.plan.tree;
  while (node.feature) node = row[node.feature] <= node.threshold ? node.left : node.right;
  const action = candidates[node.action];
  const selected = evidence.shared.plan.adjustments[row.id];
  if (node.action === 0) assert.equal(selected, undefined);
  else assert.deepEqual(selected.adjustment, action.adjustment);
}
console.log(
  'Text-size diagnostics: all297 source controls/268 fields exact;105 individual improvements with no regressions; shared-rule25 improvements/19 regressions explicit; full native scope/alpha/etchings, method snapshots and strict score reuse pass.',
);
