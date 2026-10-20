// Offline verification from cached PNGs; no browser, scan refit or remote data.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
const [baselineDirectory, policyFile, selectionFile, nativeFile, imageDirectory, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: early-body-verify.mjs NATIVE_BASELINE POLICY_MATRIX SELECTION NATIVE_MATRIX NATIVE_IMAGES OUTPUT',
);
const files = [
  path.join(baselineDirectory, 'capture.json'),
  path.join(baselineDirectory, 'inputs.json'),
  policyFile,
  selectionFile,
  nativeFile,
];
const raw = await Promise.all(files.map((file) => readFile(file)));
const [capture, inputs, policy, selection, native] = raw.map((b) => JSON.parse(b));
assert.equal(policy.status, 'native-body-policy-matrix-complete');
assert.equal(native.status, 'native-body-policy-matrix-complete');
assert.equal(native.nativeVerification, true);
assert.equal(native.completed, native.total);
assert.equal(native.total, capture.rows.length);
assert.equal(selection.matrixHash, hash(raw[2]));
assert.equal(native.definition.selectionHash, hash(raw[3]));
assert.deepEqual(native.definition.candidates[1].adjustment, selection.selected.adjustment);
for (const report of [policy, native]) {
  assert.equal(report.rendererHash, capture.source.rendererHash);
  assert.equal(report.nativeCaptureHash, hash(raw[0]));
  assert.equal(report.nativeInputsHash, hash(raw[1]));
}
for (const [file, digest] of native.dependencies)
  assert.equal(
    hash(await readFile(new URL(file, import.meta.url))),
    digest,
    'Changed native study dependency: ' + file,
  );
assert.equal(
  native.toolHash,
  hash(await readFile(new URL('early-body-study.mjs', import.meta.url))),
);
const rect = [54, 405, 390, 197],
  isolation = [53, 404, 392, 199],
  rows = [];
const ids = inputs.entries.map((e) => e.id).sort();
for (const rr of [capture.rows, policy.rows, selection.rows, native.rows])
  assert.deepEqual(rr.map((r) => r.id).sort(), ids);
const close = (a, b, message) => assert(Math.abs(a - b) < 1e-10, message + ': ' + a + ' vs ' + b);
for (const e of inputs.entries) {
  const c = capture.rows.find((r) => r.id === e.id),
    p = policy.rows.find((r) => r.id === e.id),
    s = selection.rows.find((r) => r.id === e.id),
    n = native.rows.find((r) => r.id === e.id);
  assert(e.pose.accepted && c.accepted && e.face.wordingMode === 'original');
  assert.equal(c.referenceHash, e.reference.sha256);
  assert.equal(c.poseHash, hash(JSON.stringify(e.pose.transform)));
  for (const r of [p, s, n])
    for (const key of ['referenceHash', 'poseHash']) assert.equal(r[key], c[key]);
  assert.equal(n.baselineHash, c.renderHash);
  assert.equal(p.baselineHash, c.renderHash);
  close(n.trials[0].score, p.trials[0].score, e.name + ' baseline command score');
  close(n.trials[1].score, s.after, e.name + ' guarded recipe prediction');
  assert.equal(n.native.retainedBase, s.retainedBase);
  assert.equal(n.native.outsideChangedBytes, 0);
  assert.equal(n.native.silhouetteChanged, 0);
  assert.equal(n.native.etchingBodyCalls, 0);
  assert(n.native.maximumReplayGrayError <= 1.001);
  const pngs = await Promise.all(
    [
      path.join(baselineDirectory, e.set, e.id + '.png'),
      path.join(baselineDirectory, e.set, e.id + '-scan.png'),
      path.join(imageDirectory, e.id + '.png'),
      path.join(imageDirectory, e.id + '-etching.png'),
    ].map((file) => readFile(file)),
  );
  for (const [i, digest] of [
    [0, c.renderHash],
    [1, c.scanHash],
    [2, n.native.faceHash],
    [3, n.native.etchingHash],
  ])
    assert.equal(hash(pngs[i]), digest);
  assert.equal(n.native.controlEtchingHash, n.native.etchingHash);
  const [before, scan, after, etching] = pngs.map((bytes) => PNG.sync.read(bytes));
  for (const image of [before, scan, after, etching])
    assert.deepEqual([image.width, image.height], [732, 1020]);
  let outside = 0,
    alphaChanged = 0,
    changedPixels = 0,
    etchingCoveredPixels = 0;
  for (let p = 0; p < 732 * 1020; p++) {
    const i = p * 4,
      x = p % 732,
      y = Math.floor(p / 732);
    if (before.data[i + 3] !== after.data[i + 3]) alphaChanged++;
    if (etching.data[i + 3]) etchingCoveredPixels++;
    if ([0, 1, 2, 3].some((k) => before.data[i + k] !== after.data[i + k])) {
      changedPixels++;
      if (
        !(
          x >= isolation[0] * 1.5 &&
          x < (isolation[0] + isolation[2]) * 1.5 &&
          y >= isolation[1] * 1.5 &&
          y < (isolation[1] + isolation[3]) * 1.5
        )
      )
        outside++;
    }
  }
  assert.equal(alphaChanged, 0, e.name + ' silhouette');
  assert.equal(outside, 0, e.name + ' non-body pixels');
  assert.equal(etchingCoveredPixels, n.native.etchingCoveredPixels);
  if (s.retainedBase) assert.equal(hash(pngs[2]), hash(pngs[0]), e.name + ' retained face bytes');
  const reference = normalize(scan),
    canonical = PNG.sync.write({ width: 488, height: 680, data: Buffer.from(reference.data) });
  assert.equal(hash(canonical), n.canonicalReferenceHash);
  assert.equal(p.canonicalReferenceHash, n.canonicalReferenceHash);
  const objective = new JsTextObjective(cropGray(reference, rect).gray, rect[2], rect[3]);
  const scoreBefore = objective.score(nativeGrayCrop(before, rect))[0],
    scoreAfter = objective.score(nativeGrayCrop(after, rect))[0];
  close(scoreBefore, p.trials[0].score, e.name + ' actual baseline score');
  close(scoreAfter, s.after, e.name + ' actual selected score');
  close(scoreAfter, n.native.score, e.name + ' native record score');
  rows.push({
    id: e.id,
    name: e.name,
    material: e.material,
    cohort: e.pose.cohort,
    referenceHash: c.referenceHash,
    poseHash: c.poseHash,
    beforeFaceHash: hash(pngs[0]),
    afterFaceHash: hash(pngs[2]),
    etchingHash: hash(pngs[3]),
    etchingCoveredPixels,
    retainedBase: s.retainedBase,
    changedPixels,
    outside,
    alphaChanged,
    before: scoreBefore,
    after: scoreAfter,
    delta: scoreAfter - scoreBefore,
  });
  if (rows.length % 50 === 0) console.log(rows.length + '/' + inputs.entries.length, e.name);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = (rr) => ({
  count: rr.length,
  beforeMean100: 100 * mean(rr.map((r) => r.before)),
  afterMean100: 100 * mean(rr.map((r) => r.after)),
  improved: rr.filter((r) => r.delta > 1e-9).length,
  regressed: rr.filter((r) => r.delta < -1e-9).length,
  retainedBase: rr.filter((r) => r.retainedBase).length,
  worstRegression100: 100 * Math.max(0, ...rr.map((r) => -r.delta)),
});
const groups = {
  all: summary(rows),
  calibration: summary(rows.filter((r) => r.cohort === 'calibration')),
  validation: summary(rows.filter((r) => r.cohort === 'validation')),
};
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'full-native-shared-body-candidate-not-runtime-adopted',
  scope:
    'All 302 original Unlimited faces. The actual shared rule matches its predicted score exactly, using cached fixed scan poses and no browser for this verification. Every changed native pixel lies in the rules region; face alpha and the before/after default etching plane are unchanged. All 32 density-retained faces match their entire baseline PNG byte-for-byte. Native candidate generation separately checks complete rendered text. The default etching plane contains the fallback set mark; it is not empty, and no illustration-etch resolver was used. This is regional body evidence, not material integration, Oracle certification, whole-card scoring or set completion.',
  rendererHash: native.rendererHash,
  sources: Object.fromEntries(
    ['baselineCapture', 'baselineInputs', 'policyMatrix', 'selection', 'nativeMatrix'].map(
      (k, i) => [k, hash(raw[i])],
    ),
  ),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    ['abu-type-objective.mjs', 'pixels-pure.mjs', 'edges.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  defaultEtching: {
    hashes: [...new Set(rows.map((r) => r.etchingHash))],
    coveredPixels: [...new Set(rows.map((r) => r.etchingCoveredPixels))],
    bodyCalls: 0,
  },
  groups,
  rows,
});
console.log(JSON.stringify({ status: 'native-body-verified', groups }));
