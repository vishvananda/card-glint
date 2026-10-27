// Reuse a finite ABU score census only after exact current native/pose/input joins.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import { hash, writeJson } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [
  parentInputsFile,
  inputsFile,
  nativeFile,
  posesFile,
  priorFile,
  metricFile,
  policyFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: printing-archived-baseline-reuse.mjs PARENT_INPUTS INPUTS NATIVE POSES PRIOR_GZ METRIC POLICY NEW_OUTPUT',
);
const files = [parentInputsFile, inputsFile, nativeFile, posesFile, priorFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [parent, inputs, native, poses] = raw.slice(0, 4).map((b) => JSON.parse(b)),
  prior = JSON.parse(gunzipSync(raw[4]));
const graph = await metricSourceGraph(path.resolve(metricFile)),
  policyGraph = await metricSourceGraph(path.resolve(policyFile));
const { accuracyRegions } = await import(pathToFileURL(path.resolve(policyFile)));
assert.deepEqual(graph, prior.source.metricGraph);
for (const source of policyGraph.sources)
  assert(graph.sources.some((s) => JSON.stringify(s) === JSON.stringify(source)));
assert.equal(prior.source.inputsHash, hash(raw[0]));
assert.equal(native.status, 'complete');
assert.deepEqual(native.faults, []);
assert.equal(native.inputHash, hash(raw[1]));
assert.equal(poses.inputHash, native.inputHash);
assert.equal(inputs.set, poses.set);
assert.equal(inputs.entries.length, 302);
assert.equal(native.rows.length, 302);
assert.equal(poses.rows.length, 302);
assert.deepEqual(
  inputs.entries.map((e) => e.id).sort(),
  prior.rows
    .filter((r) => r.set === inputs.set)
    .map((r) => r.id)
    .sort(),
);
const rows = [];
for (const e of inputs.entries) {
  const original = parent.entries.find((p) => p.id === e.id),
    old = prior.rows.find((r) => r.id === e.id),
    n = native.rows.find((r) => r.id === e.id),
    p = poses.rows.find((p) => p.id === e.id);
  assert.deepEqual(e, original);
  assert.equal(e.card.set, inputs.set);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(old.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(n.modes.original.inputHash, old.inputHash);
  assert.equal(n.modes.original.sha256, old.nativeFaceHash);
  const png = await fs.readFile(path.join(path.dirname(nativeFile), n.modes.original.file));
  assert.equal(hash(png), old.nativeFaceHash);
  assert.equal(n.referenceHash, old.referenceHash);
  assert.equal(e.reference.sha256, old.referenceHash);
  assert.equal(hash(JSON.stringify(e.pose)), old.poseHash);
  assert.deepEqual(p, e.pose);
  assert(p.accepted && old.normalizationAccepted);
  const face = {
    ...e.face,
    typeSource: 'Scan-reviewed type',
    rulesSource: 'Original printing source',
  };
  const plan = accuracyRegions(e.card, e.face);
  assert.deepEqual(accuracyRegions(e.card, face), plan);
  const components = Object.fromEntries(
    Object.entries(old.components).map(([k, c]) => [
      k,
      { ...c, score: c.score100 === null ? null : c.score100 / 100 },
    ]),
  );
  rows.push({
    id: e.id,
    name: e.name,
    material: e.material,
    cohort: p.cohort,
    referenceHash: old.referenceHash,
    inputHash: old.inputHash,
    poseHash: hash(JSON.stringify(p.transform)),
    historicalPoseHash: old.poseHash,
    nativeHash: old.nativeFaceHash,
    poseAccepted: true,
    aggregateEligible: old.coverage >= 0.65,
    status: old.coverage >= 0.65 ? 'scored-diagnostic' : 'content-review',
    regionPlanHash: hash(JSON.stringify(plan)),
    score: { structuralScore: old.score100 / 100, coverage: old.coverage, components },
    diagnosticFormat: 'archived-compact',
  });
}
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
await writeJson(output, {
  schema: 1,
  set: inputs.set,
  status: 'complete-byte-verified-archival-baseline-reuse',
  scope:
    'Every current native PNG,input,reference,full historical pose and metric graph matches the archived census. Compact component values are retained;unrecorded diagnostics are not invented. No scan adjustment or fresh score is performed. This is baseline reuse,not complete-set approval.',
  rendererHash: native.rendererHash,
  inputHash: hash(raw[1]),
  posesHash: hash(raw[3]),
  metricGraph: graph,
  policyGraph,
  reuse: { reused: 302, fresh: 0 },
  sources: Object.fromEntries(files.map((_, i) => [i, hash(raw[i])])),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  rows,
});
console.log('Reused302 exact archived native/pose/input/metric scores');
