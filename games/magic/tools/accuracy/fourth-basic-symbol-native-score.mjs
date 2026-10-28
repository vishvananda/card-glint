// Reuse a metric only after actual native pixels match its measured prototype.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
const [prototypeScoresFile, captureFile, nativeProofFile, out] = process.argv.slice(2);
assert(out, 'Use PROTOTYPE_SCORES ACTUAL_NATIVE_CAPTURE NATIVE_ISOLATION OUTPUT');
const raw = await Promise.all(
  [prototypeScoresFile, captureFile, nativeProofFile].map((f) => fs.readFile(f)),
);
const [prior, capture, native] = raw.map((b) => JSON.parse(b));
assert.equal(native.status, 'complete-native-basic-symbol-profile-isolation');
assert.equal(native.afterCaptureHash, hash(raw[1]));
assert.equal(native.beforeRenderer, prior.rendererHash);
assert.equal(native.afterRenderer, capture.rendererHash);
assert.equal(native.inputHash, prior.inputHash);
assert.equal(capture.inputHash, prior.inputHash);
assert.equal(native.prototypeHash, prior.sources.prototype);
assert.equal(native.beforeCaptureHash, prior.sources.native);
assert.equal(prior.rows.length, 378);
const rows = prior.rows.map((r) => {
  const n = native.rows.find((n) => n.id === r.id),
    actual = capture.rows.find((n) => n.id === r.id)?.modes.original;
  assert(n && actual);
  assert.equal(n.set, '4ed');
  assert.equal(actual.sha256, r.nativeHash, 'Actual native/prototype pixel mismatch');
  assert.equal(actual.inputHash, r.inputHash);
  assert.equal(n.modes.original.after, actual.sha256);
  assert.equal(n.referenceHash, r.referenceHash);
  return {
    ...r,
    keyHash: actual.keyHash,
    scoreSource: 'exact-actual-native-prototype-png',
    scoreReused: true,
  };
});
await writeJson(out, {
  schema: 1,
  set: '4ed',
  status: 'current-native-basic-symbol-scores',
  scope:
    'All378 actual Original native PNGs match the already measured shared prototype or its unchanged controls. Metric/region/reference/pose identities stay bound to that immutable score receipt. No second pixel rescore, scan exclusion or numerical score relabeling of the historical prototype receipt.',
  rendererHash: capture.rendererHash,
  prototypeRendererHash: prior.rendererHash,
  inputHash: prior.inputHash,
  sources: { prototypeScores: hash(raw[0]), native: hash(raw[1]), nativeIsolation: hash(raw[2]) },
  metricGraph: prior.metricGraph,
  policyGraph: prior.policyGraph,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  summary: {
    ...prior.summary,
    fresh: 0,
    reused: 378,
    prototypeFresh: prior.summary.fresh,
    prototypeUnchangedReused: prior.summary.reused,
    prototypeScoresReused: 378,
    actualNativeJoined: 378,
  },
  rows,
});
console.log(
  JSON.stringify({
    rendererHash: capture.rendererHash,
    mean100: prior.summary.current100,
    actualNativeJoined: 378,
    rescored: 0,
  }),
);
