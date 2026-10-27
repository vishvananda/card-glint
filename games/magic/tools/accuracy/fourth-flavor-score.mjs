// Whole-card measurement with exact reuse, using unchanged normalized references.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [
  inputsFile,
  beforeFile,
  afterFile,
  posesFile,
  priorFile,
  nativeFile,
  metricsFile,
  policyFile,
  out,
] = process.argv.slice(2);
assert(
  out,
  'Usage: fourth-flavor-score.mjs INPUTS BEFORE AFTER POSES PRIOR_SCORES NATIVE_PROOF METRICS POLICY OUTPUT',
);
const files = [inputsFile, beforeFile, afterFile, posesFile, priorFile, nativeFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, before, after, poses, prior, native] = raw.map((b) => JSON.parse(b));
assert.equal(after.status, 'complete');
assert.equal(native.status, 'complete-native-flavor-isolation');
assert.equal(after.rendererHash, await sourceHash('games/magic/src'));
assert.equal(native.afterRenderer, after.rendererHash);
assert.equal(native.beforeRenderer, before.rendererHash);
assert.equal(native.sources.inputs, hash(raw[0]));
assert.equal(native.sources.before, hash(raw[1]));
assert.equal(native.sources.after, hash(raw[2]));
assert.equal(after.inputHash, hash(raw[0]));
const graph = await metricSourceGraph(path.resolve(metricsFile)),
  policy = await metricSourceGraph(path.resolve(policyFile));
assert.deepEqual(graph, prior.metricGraph);
assert.deepEqual(policy, prior.policyGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile)));
const { accuracyRegions } = await import(pathToFileURL(path.resolve(policyFile)));
const entries = inputs.entries.filter((e) => e.card.set === '4ed');
assert.equal(entries.length, 378);
assert.equal(prior.rows.length, 378);
const rows = [];
let fresh = 0;
const compare = (a, b) => {
  assert(
    Math.abs(a.structuralScore - b.structuralScore) < 1e-12,
    'Previous whole metric no longer reproduces',
  );
  for (const key of Object.keys(a.components)) {
    const x = a.components[key]?.score,
      y = b.components[key]?.score;
    if (x == null || y == null) assert.equal(x, y);
    else assert(Math.abs(x - y) < 1e-12, 'Previous component no longer reproduces ' + key);
  }
};
for (const e of entries) {
  const old = prior.rows.find((r) => r.id === e.id),
    b = before.rows.find((r) => r.id === e.id).modes.original,
    a = after.rows.find((r) => r.id === e.id).modes.original;
  const pose = poses.rows.find((p) => p.id === e.id),
    n = native.rows.find((r) => r.id === e.id).modes.original;
  assert(pose.accepted);
  assert.equal(pose.referenceHash, e.reference.sha256);
  assert.equal(old.referenceHash, e.reference.sha256);
  assert.equal(old.poseHash, hash(JSON.stringify(pose.transform)));
  assert.equal(old.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(a.inputHash, old.inputHash);
  assert.equal(b.inputHash, old.inputHash);
  assert.equal(old.nativeHash, b.sha256);
  assert.equal(n.before, b.sha256);
  assert.equal(n.after, a.sha256);
  const face = {
    ...e.face,
    typeSource: 'Scan-reviewed type',
    rulesSource: 'Original printing source',
  };
  assert.equal(hash(JSON.stringify(accuracyRegions(e.card, face))), old.regionPlanHash);
  const next = await fs.readFile(path.join(path.dirname(afterFile), a.file));
  assert.equal(hash(next), a.sha256);
  let score = old.score;
  if (a.sha256 !== b.sha256) {
    const original = await fs.readFile(path.join(path.dirname(beforeFile), b.file));
    assert.equal(hash(original), b.sha256);
    const reference = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(reference), e.reference.sha256);
    const scan = normalize(PNG.sync.read(reference), pose.transform);
    compare(scoreRegions(scan, normalize(PNG.sync.read(original)), e.card, face), old.score);
    score = scoreRegions(scan, normalize(PNG.sync.read(next)), e.card, face);
    fresh++;
  }
  rows.push({
    ...old,
    beforeNativeHash: b.sha256,
    beforeInputHash: old.inputHash,
    nativeHash: a.sha256,
    beforeScore: old.score,
    score,
    scoreReused: a.sha256 === b.sha256,
    reusedFrom: a.sha256 === b.sha256 ? 'exact-parent-native' : 'fresh-fixed-pose-comparison',
    delta100: 100 * (score.structuralScore - old.score.structuralScore),
  });
}
assert.equal(fresh, 16);
const mean = (key) => (100 * rows.reduce((s, r) => s + r[key].structuralScore, 0)) / rows.length;
const summary = {
  cards: 378,
  fresh,
  reused: 378 - fresh,
  before100: mean('beforeScore'),
  current100: mean('score'),
  improved: rows.filter((r) => r.delta100 > 0).length,
  regressed: rows.filter((r) => r.delta100 < 0).length,
};
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  raw.map(hash),
);
assert.deepEqual(await metricSourceGraph(path.resolve(metricsFile)), graph);
assert.deepEqual(await metricSourceGraph(path.resolve(policyFile)), policy);
await writeJson(out, {
  schema: 1,
  set: '4ed',
  status: 'complete-current-native-flavor-scores',
  scope:
    'All378 Fourth Originals. Exact references,wording,poses,region plans and complete metric/policy graphs stay fixed. Changed16 pairs are rescored,including reproduction of previous metrics. Other362 native images retain exact bytes and reuse scores. Development normalization remains awaiting visual review; no set-completion claim.',
  rendererHash: after.rendererHash,
  inputHash: hash(raw[0]),
  sources: Object.fromEntries(
    ['inputs', 'before', 'after', 'poses', 'prior', 'native'].map((k, i) => [k, hash(raw[i])]),
  ),
  metricGraph: graph,
  policyGraph: policy,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  summary,
  rows,
});
console.log(summary);
