// Score the isolated semantic-details proposal; this is not production certification.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputsFile, captureFile, posesFile, priorFile, studyFile, metricsFile, policyFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: fourth-detail-classification-score.mjs INPUTS NATIVE POSES PRIOR_SCORES STUDY METRICS POLICY NEW_OUTPUT',
);
const files = [inputsFile, captureFile, posesFile, priorFile, studyFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, capture, poses, prior, study] = raw.map((b) => JSON.parse(b));
assert.equal(study.status, 'complete-exploratory');
assert.equal(study.inputHash, hash(raw[0]));
assert.equal(study.baselineHash, hash(raw[1]));
assert.equal(study.posesHash, hash(raw[2]));
assert.equal(prior.inputHash, hash(raw[0]));
assert.equal(prior.sources.poses, hash(raw[2]));
assert.equal(prior.rendererHash, study.rendererHash);
assert.equal(capture.rendererHash, study.rendererHash);
const graph = await metricSourceGraph(path.resolve(metricsFile)),
  policy = await metricSourceGraph(path.resolve(policyFile));
assert.deepEqual(graph, prior.metricGraph);
assert.deepEqual(policy, prior.policyGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile))),
  { accuracyRegions } = await import(pathToFileURL(path.resolve(policyFile)));
assert.equal(inputs.set, '4ed');
assert.equal(inputs.entries.length, 378);
assert.deepEqual(
  study.rows.map((r) => r.id),
  inputs.entries.map((e) => e.id),
);
const rows = [];
for (const r of study.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    old = prior.rows.find((o) => o.id === r.id),
    n = capture.rows.find((n) => n.id === r.id).modes.original,
    p = poses.rows.find((p) => p.id === r.id);
  assert.equal(e.face.wordingMode, 'original');
  assert(p.accepted);
  assert.equal(r.before, old.nativeHash);
  assert.equal(r.before, n.sha256);
  assert.equal(old.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(r.inputHash, old.inputHash);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.equal(r.poseHash, old.poseHash);
  assert.equal(r.poseHash, hash(JSON.stringify(p.transform)));
  const face = {
    ...e.face,
    typeSource: 'Scan-reviewed type',
    rulesSource: 'Original printing source',
  };
  assert.equal(hash(JSON.stringify(accuracyRegions(e.card, face))), old.regionPlanHash);
  const native = await fs.readFile(path.join(path.dirname(captureFile), n.file));
  assert.equal(hash(native), r.before);
  let score = old.score;
  if (r.changed) {
    const reference = await fs.readFile(objectFile(e.reference)),
      next = await fs.readFile(path.join(path.dirname(studyFile), r.id + '.png'));
    assert.equal(hash(reference), r.referenceHash);
    assert.equal(hash(next), r.after);
    score = scoreRegions(
      normalize(PNG.sync.read(reference), p.transform),
      normalize(PNG.sync.read(next)),
      e.card,
      face,
    );
  } else assert.equal(r.after, r.before);
  rows.push({
    id: r.id,
    name: r.name,
    changed: r.changed,
    referenceHash: r.referenceHash,
    inputHash: r.inputHash,
    poseHash: r.poseHash,
    beforeNativeHash: r.before,
    nativeHash: r.after,
    beforeScore: old.score,
    score,
    delta100: 100 * (score.structuralScore - old.score.structuralScore),
  });
}
const mean = (a) => a.reduce((s, r) => s + r, 0) / a.length,
  changed = rows.filter((r) => r.changed);
const summary = {
  cards: 378,
  fresh: changed.length,
  reused: 378 - changed.length,
  before100: 100 * mean(rows.map((r) => r.beforeScore.structuralScore)),
  current100: 100 * mean(rows.map((r) => r.score.structuralScore)),
  improved: rows.filter((r) => r.delta100 > 0).length,
  regressed: rows.filter((r) => r.delta100 < 0).length,
  changedManaBefore100: 100 * mean(changed.map((r) => r.beforeScore.components.mana.score)),
  changedManaCurrent100: 100 * mean(changed.map((r) => r.score.components.mana.score)),
};
assert.equal(changed.length, 7);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  raw.map(hash),
);
assert.deepEqual(await metricSourceGraph(path.resolve(metricsFile)), graph);
assert.deepEqual(await metricSourceGraph(path.resolve(policyFile)), policy);
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'complete-exploratory-semantic-details-score',
  scope:
    'Seven Original Enchant Land cards use the ordinary Fourth detail policy. All378 baseline controls replay exactly;371 unchanged PNGs reuse exact prior metric values. Frozen poses,inputs and score regions are unchanged. Prototype evidence,not a shipped renderer or full-set approval.',
  rendererHash: study.rendererHash,
  sources: Object.fromEntries(
    ['inputs', 'capture', 'poses', 'prior', 'study'].map((k, i) => [k, hash(raw[i])]),
  ),
  metricGraph: graph,
  policyGraph: policy,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  summary,
  rows,
});
console.log(summary);
