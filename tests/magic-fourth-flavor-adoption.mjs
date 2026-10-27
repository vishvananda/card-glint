import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthFlavorDelta,
  fourthFlavorHistoricalHash,
  preFourthFlavorSource,
  fourthFlavorAffected,
  fourthFlavorApproval,
} from '../games/magic/tools/accuracy/fourth-flavor-ancestry.mjs';
import { validateFourthFlavorData } from '../games/magic/tools/accuracy/fourth-flavor-data-check.mjs';
import {
  fourthDetailsDelta,
  fourthDetailsApproval,
} from '../games/magic/tools/accuracy/fourth-details-ancestry.mjs';
import {
  fourthCenteredDelta,
  fourthCenteredApproval,
} from '../games/magic/tools/accuracy/fourth-centered-ancestry.mjs';
const p = await fourthFlavorDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await fourthFlavorHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const b = await fs.readFile(file);
  assert.equal(hash(b), r.after);
  assert.equal(hash(await preFourthFlavorSource(file, b)), r.before);
  const unknown = Buffer.concat([b, Buffer.from('\n// unreviewed change\n')]);
  assert.deepEqual(await preFourthFlavorSource(file, unknown), unknown);
}
const tampered = structuredClone(p),
  body = tampered.files['games/magic/src/calibration/body.ts'];
body.afterSource += '\n// hidden policy\n';
body.after = hash(body.afterSource);
assert.throws(() => validateFourthFlavorData(tampered));
const read = async (ref) => {
  const bytes = await fs.readFile(ref.file);
  assert.equal(hash(bytes), ref.sha256);
  const raw = ref.file.endsWith('.gz') ? gunzipSync(bytes) : bytes;
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  return raw;
};
const report = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/flavor-fractional-adoption.json'),
);
assert.equal(report.status, 'integrated-pure-flavor-fractional-full-audit-open');
const raw = Object.fromEntries(
  await Promise.all(Object.entries(report.artifacts).map(async ([k, v]) => [k, await read(v)])),
);
const native = JSON.parse(raw.native),
  study = JSON.parse(raw.prototype),
  scores = JSON.parse(raw.scores),
  capture = JSON.parse(raw.capture),
  inputs = JSON.parse(raw.inputs),
  prior = JSON.parse(raw.priorScores),
  extra = JSON.parse(raw.extraBefore);
assert.equal(capture.status, 'complete');
assert.deepEqual(capture.faults, []);
assert.equal(extra.status, 'complete');
assert.equal(extra.rendererHash, p.beforeRenderer);
assert.equal(hash(raw.capture), native.sources.after);
assert.equal(hash(raw.inputs), native.sources.inputs);
assert.equal(hash(raw.extraBefore), native.sources.extraBefore);
assert.equal(capture.inputHash, hash(raw.inputs));
assert.equal(capture.rendererHash, p.afterRenderer);
assert.equal(scores.rendererHash, p.afterRenderer);
assert.equal(scores.sources.native, hash(raw.native));
for (const [name, tool, live] of [
  ['native', 'nativeTool', 'fourth-flavor-native-review'],
  ['prototype', 'studyTool', 'fourth-flavor-text-study'],
  ['scores', 'scoreTool', 'fourth-flavor-score'],
]) {
  const value = JSON.parse(raw[name]);
  assert.equal(value.toolHash, hash(raw[tool]));
  assert.equal(
    value.toolHash,
    hash(await fs.readFile('games/magic/tools/accuracy/' + live + '.mjs')),
  );
}
assert.equal(scores.metricGraph.hash, prior.metricGraph.hash);
assert.equal(scores.policyGraph.hash, prior.policyGraph.hash);
assert.deepEqual(report.summary, scores.summary);
assert.deepEqual(report.regional, study.summary);
assert.deepEqual(report.nativeCounts, native.counts);
assert.deepEqual(report.verification, native.verification);
assert.equal(study.rows.length, 19);
assert.equal(scores.rows.length, 378);
assert.equal(native.rows.length, 492);
for (const n of native.rows) {
  const c = capture.rows.find((c) => c.id === n.id),
    e = inputs.entries.find((e) => e.id === n.id);
  assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(n.referenceHash, e.reference.sha256);
  for (const [mode, m] of Object.entries(n.modes)) {
    assert.equal(m.after, c.modes[mode].sha256);
    assert.equal(m.afterKey, c.modes[mode].keyHash);
    if (m.verifiedBy === 'exact-png-bytes') assert.equal(m.before, m.after);
    else {
      assert.equal(m.verifiedBy, 'rgba-isolation');
      assert(m.changed > 0);
    }
    assert.equal(m.alpha, 0);
    assert.equal(m.outside, 0);
  }
}
const mean = (key) => (100 * scores.rows.reduce((s, r) => s + r[key].structuralScore, 0)) / 378;
assert(Math.abs(mean('beforeScore') - 80.0877298704352) < 1e-12);
assert.equal(mean('score'), scores.summary.current100);
assert.equal(scores.rows.filter((r) => r.scoreReused).length, 362);
assert.equal(scores.summary.improved, 15);
assert.equal(scores.summary.regressed, 1);
const group = { printings: p.ids.length, printingIds: p.ids };
const members = group.printingIds.map((id) => {
  const n = native.rows.find((n) => n.id === id),
    old = prior.rows.find((r) => r.id === id);
  return {
    id,
    name: n.name,
    referenceHash: n.referenceHash,
    poseHash: old.poseHash,
    inputHash: n.inputHash,
    nativeFaceHash: n.modes.original.after,
  };
});
const item = {
  runtimeGuards: { 'games/magic/src': p.afterRenderer },
  proof: {
    fractionalFlavorSource: p.afterRenderer,
    nativeReplayHash: p.native.contentSha256,
    validationKind: 'source-census',
    coveredPrintings: group.printings,
    sourceCensus: { members },
  },
};
assert(await fourthFlavorApproval(item, group));
assert.equal(
  await fourthFlavorApproval({ proof: { fractionalFlavorSource: p.afterRenderer } }, group),
  false,
);
for (const field of ['inputHash', 'referenceHash', 'poseHash', 'nativeFaceHash']) {
  const bad = structuredClone(item);
  bad.proof.sourceCensus.members[0][field] = '0'.repeat(64);
  assert.equal(await fourthFlavorApproval(bad, group), false);
}
const wrong = structuredClone(item);
wrong.runtimeGuards['games/magic/src'] = p.beforeRenderer;
assert.equal(await fourthFlavorApproval(wrong, group), false);
assert.equal(await fourthFlavorApproval(item, { printings: 19 }), false);
assert(await fourthFlavorAffected('4ed', 'rules', false, group));
assert.equal(await fourthFlavorAffected('4ed', 'rules', true, group), false);
assert.equal(await fourthFlavorAffected('4ed', 'manaGeometry', false, group), false);
assert.equal(await fourthFlavorAffected('lea', 'rules', false, group), false);
assert(await fourthFlavorAffected('ice', 'fullCard', false, { printingIds: p.iceIds }));
const d = await fourthDetailsDelta(),
  c = await fourthCenteredDelta();
const bridged = structuredClone(item);
bridged.proof.semanticDetailsSource = d.afterRenderer;
bridged.proof.reviewedCenteringSource = c.afterRenderer;
assert(await fourthDetailsApproval(bridged, group));
assert(await fourthCenteredApproval(bridged, group));
bridged.proof.semanticDetailsSource = '0'.repeat(64);
assert.equal(await fourthDetailsApproval(bridged, group), false);
bridged.proof.reviewedCenteringSource = '0'.repeat(64);
assert.equal(await fourthCenteredApproval(bridged, group), false);
console.log(
  'Pure-flavor adoption:1968 native variants,all19 exact prototypes,20 isolated Original changes,362 score reuses,strict source/member/marker guards and unchanged words/Oracle/masks pass. Fourth/Ice audits remain open.',
);
