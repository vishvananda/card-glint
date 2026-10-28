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
  captureFile,
  poseFile,
  refinementFile,
  priorFile,
  prototypeFile,
  metricsFile,
  policyFile,
  out,
] = process.argv.slice(2);
assert(out, 'Use INPUTS CAPTURE POSES REFINEMENT PRIOR_SCORES PROTOTYPE METRICS POLICY OUTPUT');
const files = [inputFile, captureFile, poseFile, refinementFile, priorFile, prototypeFile];
const raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [input, capture, poses, refinement, prior, prototype] = raw.map((b) => JSON.parse(b));
for (const r of [capture, prior, prototype]) assert.equal(r.inputHash, hash(raw[0]));
assert.equal(capture.rendererHash, prior.rendererHash);
assert.equal(capture.rendererHash, prototype.rendererHash);
assert.equal(prior.sources.native, hash(raw[1]));
assert.equal(prior.status, 'current-native-basic-word-scores');
assert.equal(prototype.captureHash, hash(raw[1]));
const metricGraph = await metricSourceGraph(metricsFile),
  policyGraph = await metricSourceGraph(policyFile);
assert.deepEqual(metricGraph, prior.metricGraph);
assert.deepEqual(policyGraph, prior.policyGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile)));
const { accuracyRegions } = await import(pathToFileURL(path.resolve(policyFile)));
const entries = input.entries.filter((e) => e.card.set === '4ed');
assert.equal(entries.length, 378);
const rows = [];
for (const e of entries) {
  const p = poses.rows.find((p) => p.id === e.id),
    old = prior.rows.find((r) => r.id === e.id),
    native = capture.rows.find((r) => r.id === e.id).modes.original;
  assert(p?.accepted && old);
  assert.equal(p.referenceHash, e.reference.sha256);
  const transform =
    refinement.rows.find((r) => r.id === e.id && r.acceptedExperimental)?.transform ?? p.transform;
  assert.equal(hash(JSON.stringify(transform)), old.poseHash);
  assert.equal(native.sha256, old.nativeHash);
  assert.equal(hash(JSON.stringify(e.face)), old.inputHash);
  assert.equal(old.referenceHash, e.reference.sha256);
  const face = {
    ...e.face,
    typeSource: 'Scan-reviewed type',
    rulesSource: 'Original printing source',
  };
  assert.equal(hash(JSON.stringify(accuracyRegions(e.card, face))), old.regionPlanHash);
  const change = prototype.rows.find((r) => r.id === e.id);
  let score = old.score,
    nativeHash = old.nativeHash;
  if (change) {
    assert.equal(change.modes.current.sha256, old.nativeHash);
    const ref = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(ref), e.reference.sha256);
    const before = await fs.readFile(
      path.join(path.dirname(prototypeFile), change.modes.current.file),
    );
    const after = await fs.readFile(
      path.join(path.dirname(prototypeFile), change.modes.shared.file),
    );
    assert.equal(hash(before), change.modes.current.sha256);
    assert.equal(hash(after), change.modes.shared.sha256);
    const scan = normalize(PNG.sync.read(ref), transform);
    const repeated = scoreRegions(scan, normalize(PNG.sync.read(before)), e.card, face);
    assert(
      Math.abs(repeated.structuralScore - old.score.structuralScore) < 1e-12,
      'Baseline score drift',
    );
    for (const [key, v] of Object.entries(repeated.components)) {
      const expected = old.score.components[key].score;
      if (v.score == null || expected == null) assert.equal(v.score, expected);
      else assert(Math.abs(v.score - expected) < 1e-12, 'Baseline component drift');
    }
    score = scoreRegions(scan, normalize(PNG.sync.read(after)), e.card, face);
    nativeHash = hash(after);
  }
  rows.push({
    ...old,
    beforeScore: old.score,
    score,
    beforeNativeHash: old.nativeHash,
    nativeHash,
    scoreReused: !change,
    delta100: (score.structuralScore - old.score.structuralScore) * 100,
    reusedFrom: change
      ? 'fresh-native-shared-symbol-prototype'
      : 'exact-native-input-reference-pose-regions-and-metric',
  });
}
const mean = (key) => (rows.reduce((s, r) => s + r[key].structuralScore, 0) / rows.length) * 100;
const changed = rows.filter((r) => !r.scoreReused);
await writeJson(out, {
  schema: 1,
  set: '4ed',
  status: 'whole-card-shared-symbol-prototype-scores',
  rendererHash: capture.rendererHash,
  inputHash: hash(raw[0]),
  sources: Object.fromEntries(
    ['inputs', 'native', 'poses', 'refinement', 'prior', 'prototype'].map((key, i) => [
      key,
      hash(raw[i]),
    ]),
  ),
  metricGraph,
  policyGraph,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  summary: {
    cards: 378,
    fresh: changed.length,
    reused: rows.length - changed.length,
    before100: mean('beforeScore'),
    current100: mean('score'),
    gains: changed.filter((r) => r.delta100 > 1e-9).length,
    losses: changed.filter((r) => r.delta100 < -1e-9).length,
    changedMeanBefore100:
      (changed.reduce((n, r) => n + r.beforeScore.structuralScore, 0) / changed.length) * 100,
    changedMeanAfter100:
      (changed.reduce((n, r) => n + r.score.structuralScore, 0) / changed.length) * 100,
  },
  rows,
});
console.log(
  rows.filter((r) => !r.scoreReused).map((r) => ({ name: r.name, delta100: r.delta100 })),
);
