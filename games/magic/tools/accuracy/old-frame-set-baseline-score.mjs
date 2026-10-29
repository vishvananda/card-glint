// Offline baseline scoring with exact released pixels and frozen scan-only poses.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [
  inputFile,
  posesFile,
  captureFile,
  metricsFile,
  out,
  parentScoresFile,
  parentPosesFile,
  parentCaptureFile,
] = process.argv.slice(2);
assert(
  out,
  'Use INPUTS POSES NATIVE_CAPTURE METRICS NEW_OUTPUT [PARENT_SCORES PARENT_POSES [PARENT_CAPTURE]]',
);
assert.equal(Boolean(parentScoresFile), Boolean(parentPosesFile));
assert(!parentCaptureFile || parentScoresFile, 'Capture reuse needs parent scores and poses');
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
await fs.access(out).then(
  () => {
    throw Error('Output already exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const [ib, pb, cb] = await Promise.all(
  [inputFile, posesFile, captureFile].map((f) => fs.readFile(f)),
);
const input = JSON.parse(ib),
  poses = JSON.parse(pb),
  capture = JSON.parse(cb);
assert.equal(capture.complete, true);
assert.deepEqual(capture.faults, []);
assert.equal(poses.inputHash, hash(ib));
assert.equal(capture.source.inputHash, hash(ib));
assert.equal(capture.rows.length, input.entries.length);
assert.equal(poses.rows.length, input.entries.length);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile)));
const graph = await metricSourceGraph(path.resolve(metricsFile)),
  rows = [];
const parentScoreBytes = parentScoresFile ? await fs.readFile(parentScoresFile) : undefined;
const parentPoseBytes = parentPosesFile ? await fs.readFile(parentPosesFile) : undefined;
const parentScores = parentScoreBytes ? JSON.parse(parentScoreBytes) : undefined;
const parentPoses = parentPoseBytes ? JSON.parse(parentPoseBytes) : undefined;
const parentCaptureBytes = parentCaptureFile ? await fs.readFile(parentCaptureFile) : cb;
const parentCapture = JSON.parse(parentCaptureBytes);
if (parentScores) {
  assert(
    [toolHash, 'b81a35e507316911497823068f184b20f90702a023763125d451f249c33d47da'].includes(
      parentScores.toolHash,
    ),
    'Unrecognized parent scoring method',
  );
  assert(parentCapture.complete && !parentCapture.faults.length);
  assert.equal(parentCapture.source.inputHash, hash(ib));
  assert.equal(parentCapture.rows.length, input.entries.length);
  assert.equal(parentScores.inputHash, hash(ib));
  assert.equal(parentScores.captureHash, hash(parentCaptureBytes));
  assert.equal(parentScores.poseHash, hash(parentPoseBytes));
  assert.equal(parentPoses.inputHash, hash(ib));
  assert.equal(
    parentScores.metrics.hash,
    graph.hash,
    'Metric graph changed; score this baseline without a reuse parent',
  );
  assert.equal(parentScores.rows.length, input.entries.length);
  assert.equal(parentPoses.rows.length, input.entries.length);
}
const reuse = { reused: 0, fresh: 0, rejected: 0 };
for (const e of input.entries) {
  const pose = poses.rows.find((p) => p.id === e.id),
    native = capture.rows.find((r) => r.id === e.id);
  assert.equal(pose.referenceHash, e.reference.sha256);
  assert(native);
  assert.equal(native.referenceHash, e.reference.sha256);
  assert.equal(native.inputHash, hash(JSON.stringify(e.face)));
  if (!pose.accepted) {
    reuse.rejected++;
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      status: 'rejected-normalization',
      reason: pose.reason,
    });
    continue;
  }
  const ref = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(ref), e.reference.sha256);
  const file = native.file ?? e.id + '.png';
  assert.match(file, /^[a-z0-9-]+\.png$/i, 'Invalid native capture filename');
  const rendered = await fs.readFile(path.join(path.dirname(captureFile), file));
  assert.equal(hash(rendered), native.sha256);
  const oldScore = parentScores?.rows.find((r) => r.id === e.id);
  const oldPose = parentPoses?.rows.find((r) => r.id === e.id);
  if (oldScore?.score) {
    const oldNative = parentCapture.rows.find((r) => r.id === e.id);
    assert(oldNative);
    assert.equal(oldScore.nativeHash, oldNative.sha256);
    assert.equal(oldNative.inputHash, native.inputHash);
    assert.equal(oldNative.referenceHash, native.referenceHash);
  }
  const poseTransformHash = hash(JSON.stringify(pose.transform));
  if (
    oldScore?.score &&
    oldPose?.accepted &&
    oldScore.referenceHash === e.reference.sha256 &&
    oldScore.nativeHash === native.sha256 &&
    hash(JSON.stringify(oldPose.transform)) === poseTransformHash
  ) {
    rows.push({ ...oldScore, poseTransformHash, scoreSource: 'exact-parent-score-reuse' });
    reuse.reused++;
    continue;
  }
  reuse.fresh++;
  const reviewedType = ['scan-reviewed-field', 'legacy-annotation'].includes(
    e.wordingEvidence.typeSource,
  );
  const face = {
    ...e.face,
    typeSource: reviewedType ? 'Scan-reviewed original type' : 'Unreviewed type fallback',
    rulesSource:
      e.wordingEvidence.rulesSource === 'scan-reviewed-field'
        ? 'Scan-reviewed original rules'
        : 'MTGJSON original printing text',
  };
  const score = scoreRegions(
    normalize(PNG.sync.read(ref), pose.transform),
    normalize(PNG.sync.read(rendered)),
    e.card,
    face,
  );
  rows.push({
    id: e.id,
    name: e.name,
    material: e.material,
    status: 'diagnostic-measured',
    referenceHash: e.reference.sha256,
    nativeHash: native.sha256,
    poseTransformHash,
    scoreSource: 'fresh-frozen-pose-score',
    typeVerified: reviewedType,
    score,
  });
  if (rows.length % 50 === 0) console.log('Scored', rows.length, '/', input.entries.length);
}
const summarize = (rr) => {
  const measured = rr.filter((r) => r.score),
    values = measured.map((r) => r.score.structuralScore).filter(Number.isFinite);
  return {
    total: rr.length,
    measured: measured.length,
    rejected: rr.length - measured.length,
    structuralMean100: values.length
      ? (100 * values.reduce((a, b) => a + b, 0)) / values.length
      : null,
    components: Object.fromEntries(
      ['title', 'mana', 'type', 'rules', 'symbol', 'stats', 'frame', 'art', 'credits'].map((k) => {
        const values = measured
          .map((r) => r.score.components[k])
          .filter((c) => c?.eligible && Number.isFinite(c.score))
          .map((c) => c.score);
        return [
          k,
          {
            measured: values.length,
            mean100: values.length
              ? (100 * values.reduce((a, b) => a + b, 0)) / values.length
              : null,
          },
        ];
      }),
    ),
  };
};
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(await metricSourceGraph(path.resolve(metricsFile)), graph);
const summary = summarize(rows),
  materials = Object.fromEntries(
    [...new Set(rows.map((r) => r.material))].map((m) => [
      m,
      summarize(rows.filter((r) => r.material === m)),
    ]),
  );
await writeJson(out, {
  schema: 1,
  status: 'released-baseline-diagnostic-not-calibration-approval',
  set: input.set,
  release: capture.source,
  inputHash: hash(ib),
  poseHash: hash(pb),
  captureHash: hash(cb),
  metrics: graph,
  toolHash,
  node: process.version,
  scope:
    'Released native Original pixels with one frozen per-scan frame pose. Type regions with provisional provider wording remain ineligible. Rejected normalization never receives an accepted score. Source/provider body text is identified separately; these baseline numbers do not certify whole-set source review or calibration completion.',
  reuse,
  ...(parentScores
    ? {
        parentScoreHash: hash(parentScoreBytes),
        parentPoseHash: hash(parentPoseBytes),
        parentCaptureHash: hash(parentCaptureBytes),
      }
    : {}),
  summary,
  materials,
  rows,
});
console.log(JSON.stringify({ set: input.set, summary, reuse }));
