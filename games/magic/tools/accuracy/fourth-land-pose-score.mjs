import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import { PNG } from 'pngjs';
import { hash, objectFile, root, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, captureFile, poseFile, studyFile, priorFile, metricsFile, policyFile, out] =
  process.argv.slice(2);
assert(
  out,
  'Use ORIGINAL_INPUTS NATIVE_CAPTURE STOCK_POSES LAND_STUDY PRIOR_SCORES METRICS POLICY OUTPUT',
);
const files = [inputFile, captureFile, poseFile, studyFile, priorFile];
const raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [input, capture, poses, study, prior] = raw.map((b) => JSON.parse(b));
assert.equal(study.status, 'complete-experimental-not-adopted');
assert.equal(study.inputHash, hash(raw[0]));
assert.equal(study.parentHash, hash(raw[2]));
assert.equal(capture.inputHash, hash(raw[0]));
assert.equal(prior.inputHash, hash(raw[0]));
assert.equal(capture.rendererHash, prior.rendererHash);
assert.equal(prior.sources.after, hash(raw[1]));
for (const [file, expected] of Object.entries(study.sources))
  assert.equal(
    hash(
      await fs.readFile(
        file === 'package-lock.json' ? root + '/' + file : new URL(file, import.meta.url),
      ),
    ),
    expected,
    'Registration method drift',
  );
// Recreate the scan-only evidence from cached source bytes rather than trust
// a serialized acceptance flag or a caller-edited matrix. No browser is needed.
const verificationDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'fourth-land-verify-'));
try {
  const expectedFile = path.join(verificationDirectory, 'registration.json');
  await promisify(execFile)(
    process.execPath,
    [
      fileURLToPath(new URL('./fourth-land-registration.mjs', import.meta.url)),
      inputFile,
      poseFile,
      expectedFile,
    ],
    { maxBuffer: 2 * 1024 * 1024 },
  );
  assert.deepEqual(
    JSON.parse(await fs.readFile(expectedFile)),
    study,
    'Source-only registration evidence did not reproduce',
  );
} finally {
  await fs.rm(verificationDirectory, { recursive: true, force: true });
}
const graph = await metricSourceGraph(path.resolve(metricsFile)),
  policy = await metricSourceGraph(path.resolve(policyFile));
assert.deepEqual(graph, prior.metricGraph);
assert.deepEqual(policy, prior.policyGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile)));
const { accuracyRegions } = await import(pathToFileURL(path.resolve(policyFile)));
const entries = input.entries.filter((e) => e.card.set === '4ed');
assert.equal(entries.length, 378);
assert.equal(prior.rows.length, 378);
assert.equal(study.rows.length, 15);
assert.equal(new Set(study.rows.map((r) => r.id)).size, 15);
for (const r of study.rows) {
  const e = entries.find((e) => e.id === r.id),
    p = poses.rows.find((p) => p.id === r.id);
  assert(e && p?.accepted);
  assert(/^Basic Land\b/.test(e.card.type_line));
  assert(r.contentIsolationPassed);
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.deepEqual(r.parentTransform, p.transform);
  const panel =
    r.fit.accepted &&
    [r.certificate, ...r.exact].every(
      (v) =>
        v.accepted &&
        v.confidence >= 0.9 &&
        Object.values(v.sides).every((s) => s >= 0.8) &&
        v.residualRms <= 0.5,
    );
  assert.equal(Boolean(r.panelAccepted), Boolean(panel));
  const s = r.textureSummary;
  const texture = Boolean(
    s &&
      !s.weak &&
      r.texturePeers.length === 2 &&
      r.texture.length === 6 &&
      s.afterNcc >= 0.8 &&
      s.afterNcc >= s.beforeNcc + 0.01 &&
      s.minimumPatchDelta >= -0.01 &&
      s.afterResidual <= s.beforeResidual - 0.25,
  );
  assert.equal(r.textureAccepted, texture);
  assert.equal(r.acceptedExperimental, Boolean(panel && texture));
  if (texture)
    for (const id of r.texturePeers) {
      assert.notEqual(id, r.id);
      const peer = entries.find((e) => e.id === id),
        p = poses.rows.find((p) => p.id === id);
      assert.equal(peer.card.name, e.card.name);
      assert(
        p.fit.confidence >= 0.9 &&
          p.certification.confidence >= 0.9 &&
          Object.values(p.certification.sides).every((v) => v >= 0.8),
      );
    }
}
const rows = [];
for (const e of entries) {
  const old = prior.rows.find((r) => r.id === e.id),
    pose = poses.rows.find((r) => r.id === e.id),
    native = capture.rows.find((r) => r.id === e.id)?.modes.original;
  assert(old && pose?.accepted && native);
  assert.equal(old.nativeHash, native.sha256);
  assert.equal(old.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(native.inputHash, old.inputHash);
  assert.equal(old.referenceHash, e.reference.sha256);
  assert.equal(pose.referenceHash, e.reference.sha256);
  assert.equal(old.poseHash, hash(JSON.stringify(pose.transform)));
  const face = {
    ...e.face,
    typeSource: 'Scan-reviewed type',
    rulesSource: 'Original printing source',
  };
  assert.equal(hash(JSON.stringify(accuracyRegions(e.card, face))), old.regionPlanHash);
  const refinement = study.rows.find((r) => r.id === e.id && r.acceptedExperimental);
  let score = old.score;
  if (refinement) {
    const reference = await fs.readFile(objectFile(e.reference)),
      imageBytes = await fs.readFile(path.join(path.dirname(captureFile), native.file));
    assert.equal(hash(reference), e.reference.sha256);
    assert.equal(hash(imageBytes), native.sha256);
    const source = PNG.sync.read(reference),
      image = normalize(PNG.sync.read(imageBytes));
    const before = scoreRegions(normalize(source, pose.transform), image, e.card, face);
    assert(
      Math.abs(before.structuralScore - old.score.structuralScore) < 1e-12,
      'Prior score drift',
    );
    for (const [key, c] of Object.entries(before.components)) {
      const v = old.score.components[key].score;
      if (v == null || c.score == null) assert.equal(v, c.score);
      else assert(Math.abs(v - c.score) < 1e-12, 'Prior component drift');
    }
    score = scoreRegions(normalize(source, refinement.transform), image, e.card, face);
  }
  rows.push({
    ...old,
    beforeScore: old.score,
    score,
    beforePoseHash: old.poseHash,
    poseHash: refinement ? hash(JSON.stringify(refinement.transform)) : old.poseHash,
    normalizationChanged: Boolean(refinement),
    scoreReused: !refinement,
    reusedFrom: refinement
      ? 'fresh-reference-only-frame-pose'
      : 'exact-input-native-reference-pose-and-metric',
    delta100: 100 * (score.structuralScore - old.score.structuralScore),
  });
}
assert.deepEqual(await Promise.all(files.map((f) => fs.readFile(f).then(hash))), raw.map(hash));
assert.deepEqual(await metricSourceGraph(path.resolve(metricsFile)), graph);
assert.deepEqual(await metricSourceGraph(path.resolve(policyFile)), policy);
const mean = (key) => (100 * rows.reduce((n, r) => n + r[key].structuralScore, 0)) / rows.length;
const summary = {
  cards: 378,
  fresh: rows.filter((r) => r.normalizationChanged).length,
  reused: rows.filter((r) => !r.normalizationChanged).length,
  before100: mean('beforeScore'),
  current100: mean('score'),
};
await writeJson(out, {
  schema: 1,
  set: '4ed',
  status: 'complete-experimental-normalization-scores',
  scope:
    'Comparison normalization only. The same Original pixels,words,assets and metric graphs are retained. Only candidates selected by panel/independent-texture gates before text scoring change pose. Other full scores reuse exact input,reference,native,pose and region identities. Global normalization remains development data; no renderer or whole-set approval changes.',
  registrationReproduced: true,
  rendererHash: capture.rendererHash,
  inputHash: hash(raw[0]),
  sources: Object.fromEntries(
    ['inputs', 'native', 'poses', 'registration', 'prior'].map((k, i) => [k, hash(raw[i])]),
  ),
  metricGraph: graph,
  policyGraph: policy,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  summary,
  rows,
});
console.log(summary);
