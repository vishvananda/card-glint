// Reuse only exact raster scores, with explicit prior/current recipe identities.
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [
  inputFile,
  prototypeInputsFile,
  nativeDirectory,
  prototypeDirectory,
  sourceScoreFile,
  baselineScoreFile,
  posesFile,
  policyFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-score-reuse.mjs INPUTS PROTOTYPE_INPUTS NATIVE PROTOTYPE SOURCE_SCORES BASELINE_SCORES POSES POLICY NEW_OUTPUT',
);
const files = [
    inputFile,
    prototypeInputsFile,
    path.join(nativeDirectory, 'capture.json'),
    path.join(prototypeDirectory, 'capture.json'),
    sourceScoreFile,
    baselineScoreFile,
    posesFile,
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, prototypeInputs, native, prototype, scores, baseline, poses] = bytes.map((b) =>
    JSON.parse(b),
  ),
  policyGraph = await metricSourceGraph(path.resolve(policyFile)),
  { accuracyRegions } = await import(pathToFileURL(path.resolve(policyFile))),
  scorerFace = (face) => ({
    ...face,
    typeSource: 'Scan-reviewed type',
    rulesSource: 'Original printing source',
  });
assert.equal(native.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.equal(native.status, 'complete');
assert.equal(prototype.status, 'complete');
assert.equal(scores.status, 'complete-experimental-native-palette-comparison');
assert.equal(scores.inputHash, hash(bytes[1]));
assert.equal(baseline.inputHash, hash(bytes[0]));
assert.equal(native.inputHash, hash(bytes[0]));
assert.equal(prototype.inputHash, hash(bytes[1]));
assert.deepEqual(scores.metricGraph, baseline.metricGraph);
assert.deepEqual(scores.policyGraph, policyGraph);
assert.equal(scores.sources.poses, hash(bytes[6]));
assert.equal(baseline.posesHash, hash(bytes[6]));
assert.deepEqual(native.faults, []);
assert.equal(inputs.entries.length, 306);
for (const rs of [
  native.rows,
  prototype.rows,
  scores.rows,
  baseline.rows,
  prototypeInputs.entries,
  poses.rows,
])
  assert.deepEqual(rs.map((r) => r.id).sort(), inputs.entries.map((e) => e.id).sort());
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const rows = [];
for (const e of inputs.entries) {
  const p = prototypeInputs.entries.find((p) => p.id === e.id),
    n = native.rows.find((n) => n.id === e.id),
    t = prototype.rows.find((t) => t.id === e.id),
    s = scores.rows.find((s) => s.id === e.id),
    b = baseline.rows.find((b) => b.id === e.id),
    pose = poses.rows.find((p) => p.id === e.id),
    actual = n.modes.original,
    prior = t.modes.original,
    { symbolAdjustment: ignored, ...next } = p.face;
  assert.deepEqual(next, e.face);
  assert.deepEqual(p.card, e.card);
  assert.deepEqual(p.reference, e.reference);
  assert.deepEqual(p.art, e.art);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(p.face.wordingMode, 'original');
  assert.equal(actual.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(prior.inputHash, hash(JSON.stringify(p.face)));
  assert.equal(s.inputHash, prior.inputHash);
  assert.equal(b.inputHash, actual.inputHash);
  assert.equal(s.nativeHash, prior.sha256);
  assert.equal(actual.sha256, prior.sha256);
  assert.equal(s.referenceHash, n.referenceHash);
  assert.equal(s.referenceHash, t.referenceHash);
  assert.equal(s.referenceHash, b.referenceHash);
  assert(pose.accepted);
  assert.equal(s.poseHash, hash(JSON.stringify(pose.transform)));
  assert.equal(s.poseHash, b.poseHash);
  const plan = accuracyRegions(e.card, scorerFace(e.face)),
    oldPlan = accuracyRegions(p.card, scorerFace(p.face));
  assert.deepEqual(plan, oldPlan);
  assert.equal(s.regionPlanHash, hash(JSON.stringify(plan)));
  const raster = await fs.readFile(path.join(nativeDirectory, actual.file)),
    previous = await fs.readFile(path.join(prototypeDirectory, prior.file));
  assert.equal(hash(raster), actual.sha256);
  assert.equal(hash(previous), prior.sha256);
  rows.push({
    id: e.id,
    name: e.name,
    material: b.material,
    cohort: b.cohort,
    inputHash: actual.inputHash,
    priorInputHash: prior.inputHash,
    regionPlanHash: s.regionPlanHash,
    nativeHash: actual.sha256,
    priorNativeHash: prior.sha256,
    referenceHash: s.referenceHash,
    poseHash: s.poseHash,
    score: s.score,
    beforeScore: b.score,
    scoreReused: true,
    delta100: 100 * (s.score.structuralScore - b.score.structuralScore),
  });
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
await writeJson(output, {
  schema: 1,
  set: '3ed',
  status: 'exact-adopted-native-score-reuse',
  scope:
    'All306 Original rasters exactly match the reviewed experimental palette+public-geometry prototype. Current and prior recipe hashes remain distinct; complete semantic metric regions,reference,pose and metric graphs match. Scores are copied only under these exact joins. Not complete-set certification.',
  rendererHash: native.rendererHash,
  inputHash: hash(bytes[0]),
  priorInputHash: hash(bytes[1]),
  sources: Object.fromEntries(
    ['inputs', 'prototypeInputs', 'native', 'prototype', 'scores', 'baseline', 'poses'].map(
      (k, i) => [k, hash(bytes[i])],
    ),
  ),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  metricGraph: scores.metricGraph,
  policyGraph,
  posesHash: hash(bytes[6]),
  reuse: { reused: 306, fresh: 0 },
  summary: Object.fromEntries(
    ['all', ...new Set(rows.map((r) => r.material))].map((k) => {
      const a = rows.filter((r) => k === 'all' || r.material === k);
      return [
        k,
        {
          cards: a.length,
          before100: mean(a.map((r) => 100 * r.beforeScore.structuralScore)),
          current100: mean(a.map((r) => 100 * r.score.structuralScore)),
          improved: a.filter((r) => r.delta100 > 1e-9).length,
          regressed: a.filter((r) => r.delta100 < -1e-9).length,
        },
      ];
    }),
  ),
  rows,
});
console.log('306 exact raster/region/pose/reference joins reused; no fresh scoring.');
