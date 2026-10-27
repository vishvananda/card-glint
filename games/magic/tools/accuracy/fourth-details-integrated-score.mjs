// Reuse only scores whose current native pixels and complete metric identity match.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { hash, sourceHash, writeJson } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { fourthDetailsDelta } from './fourth-details-ancestry.mjs';
const [
  beforeScoresFile,
  prototypeScoresFile,
  nativeProofFile,
  afterCaptureFile,
  metricsFile,
  policyFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: fourth-details-integrated-score.mjs BEFORE_SCORES PROTOTYPE_SCORES NATIVE_PROOF AFTER_CAPTURE METRICS POLICY NEW_OUTPUT',
);
const files = [beforeScoresFile, prototypeScoresFile, nativeProofFile, afterCaptureFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [before, prototype, native, capture] = raw.map((b) => JSON.parse(b)),
  delta = await fourthDetailsDelta();
assert.equal(hash(raw[0]), delta.parentScores.contentSha256);
assert.equal(hash(raw[1]), delta.prototypeScores.contentSha256);
assert.equal(hash(raw[2]), delta.native.contentSha256);
assert.equal(hash(raw[3]), native.source.afterCapture);
assert.equal(before.rendererHash, delta.beforeRenderer);
assert.equal(prototype.rendererHash, delta.beforeRenderer);
assert.equal(native.afterRenderer, delta.afterRenderer);
assert.equal(capture.rendererHash, native.capturedRenderer);
assert.equal(await sourceHash('games/magic/src'), delta.afterRenderer);
assert.equal(before.inputHash, prototype.sources.inputs);
assert.equal(before.inputHash, native.source.inputs);
assert.equal(capture.inputHash, before.inputHash);
assert.equal(capture.status, 'complete');
assert.deepEqual(capture.faults, []);
assert.deepEqual(before.metricGraph, prototype.metricGraph);
assert.deepEqual(before.policyGraph, prototype.policyGraph);
assert.deepEqual(await metricSourceGraph(path.resolve(metricsFile)), before.metricGraph);
assert.deepEqual(await metricSourceGraph(path.resolve(policyFile)), before.policyGraph);
const rows = [];
for (const old of before.rows) {
  const trial = prototype.rows.find((r) => r.id === old.id),
    n = native.rows.find((r) => r.id === old.id),
    cap = capture.rows.find((r) => r.id === old.id);
  assert(trial && n && cap);
  for (const key of ['inputHash', 'referenceHash', 'poseHash']) assert.equal(trial[key], old[key]);
  assert.equal(trial.beforeNativeHash, old.nativeHash);
  assert.equal(n.inputHash, old.inputHash);
  assert.equal(n.referenceHash, old.referenceHash);
  assert.equal(n.modes.original.before, old.nativeHash);
  assert.equal(n.modes.original.after, trial.nativeHash);
  assert.equal(cap.modes.original.sha256, trial.nativeHash);
  const bytes = await fs.readFile(
    path.join(path.dirname(afterCaptureFile), cap.modes.original.file),
  );
  assert.equal(hash(bytes), trial.nativeHash);
  if (!n.scoped) {
    assert.deepEqual(trial.score, old.score);
    assert.equal(trial.nativeHash, old.nativeHash);
  }
  rows.push({
    ...old,
    beforeNativeHash: old.nativeHash,
    nativeHash: trial.nativeHash,
    beforeScore: old.score,
    score: trial.score,
    scoreReused: true,
    reusedFrom: n.scoped ? 'verified-identical-prototype' : 'unchanged-current-native',
    delta100: 100 * (trial.score.structuralScore - old.score.structuralScore),
  });
}
assert.equal(rows.length, 378);
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const summary = {
  cards: 378,
  rankedCards: 378,
  before100: 100 * mean(rows.map((r) => r.beforeScore.structuralScore)),
  current100: 100 * mean(rows.map((r) => r.score.structuralScore)),
  improved: rows.filter((r) => r.delta100 > 0).length,
  regressed: rows.filter((r) => r.delta100 < 0).length,
};
assert.equal(summary.improved, 7);
assert.equal(summary.regressed, 0);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  raw.map(hash),
);
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'integrated-native-semantic-details-scores',
  scope:
    'Current production output exactly matches all measured prototype pixels under the same Original inputs,references,poses,region plans and complete metric graph.371 current scores and7 independently measured prototype scores reuse exact native bytes;no rescoring or new scan fit. This does not certify the full set.',
  rendererHash: delta.afterRenderer,
  capturedRenderer: native.capturedRenderer,
  inputHash: before.inputHash,
  sources: {
    prior: hash(raw[0]),
    prototype: hash(raw[1]),
    native: hash(raw[2]),
    capture: hash(raw[3]),
  },
  metricGraph: before.metricGraph,
  policyGraph: before.policyGraph,
  reuse: { unchangedCurrent: 371, verifiedPrototype: 7, fresh: 0 },
  summary,
  rows,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
});
console.log(summary);
