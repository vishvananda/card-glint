// Full-card scoring for frozen native output. No renderer or Chromium is started.
// The supplied metric module owns the score definition; its full import graph is pinned.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, captureFile, posesFile, priorFile, metricsFile, output] = process.argv.slice(2);
assert(
  output,
  'Usage: printing-native-score.mjs INPUTS CAPTURE POSES PRIOR_SCORES METRIC_MODULE NEW_OUTPUT',
);
await writeFile(output, JSON.stringify({ status: 'starting' }), { flag: 'wx' });
const load = async (f) => {
  const bytes = await readFile(f);
  return { bytes, value: JSON.parse(bytes) };
};
const input = await load(inputFile),
  native = await load(captureFile),
  poses = await load(posesFile),
  prior = await load(priorFile),
  graph = await metricSourceGraph(path.resolve(metricsFile)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile)));
const inputs = input.value,
  capture = native.value,
  previous = prior.value;
assert.equal(capture.status, 'complete');
assert(
  inputs.entries.every((e) => e.face.wordingMode === 'original'),
  'Only frozen Original wording may be scored by this audit tool',
);
const provenance = capture.source ?? capture;
assert.equal(provenance.rendererHash, rendererHash);
assert.equal(provenance.inputHash, hash(input.bytes));
assert.equal(previous.inputHash, hash(input.bytes));
assert.equal(previous.posesHash, hash(poses.bytes));
assert.deepEqual(previous.metricGraph, graph, 'Scores require the same metric import graph');
assert.deepEqual(capture.rows.map((r) => r.id).sort(), inputs.entries.map((e) => e.id).sort());
const rows = [];
let reused = 0,
  fresh = 0;
for (const n of capture.rows) {
  const e = inputs.entries.find((e) => e.id === n.id),
    p = poses.value.rows.find((p) => p.id === n.id),
    old = previous.rows.find((r) => r.id === n.id),
    r = n.modes.original;
  assert(p.accepted);
  assert(old);
  assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(old.inputHash, r.inputHash);
  assert.equal(old.referenceHash, n.referenceHash);
  assert.equal(old.poseHash, hash(JSON.stringify(p.transform)));
  const bytes = await readFile(path.join(path.dirname(captureFile), r.file));
  assert.equal(hash(bytes), r.sha256);
  let score;
  const scoreReused = (old.nativeHash ?? old.after) === r.sha256;
  if (scoreReused) {
    score = old.score;
    reused++;
  } else {
    const reference = await readFile(objectFile({ sha256: n.referenceHash }));
    assert.equal(hash(reference), n.referenceHash);
    score = scoreRegions(
      normalize(PNG.sync.read(reference), p.transform),
      normalize(PNG.sync.read(bytes)),
      e.card,
      { ...e.face, typeSource: 'Scan-reviewed type', rulesSource: 'Original printing source' },
    );
    fresh++;
  }
  rows.push({
    id: n.id,
    name: n.name,
    material: e.face.artifact ? 'A' : e.face.land ? 'L' : (e.face.frameColors ?? e.face.colors)[0],
    cohort: p.cohort,
    referenceHash: n.referenceHash,
    inputHash: r.inputHash,
    poseHash: old.poseHash,
    nativeHash: r.sha256,
    score,
    scoreReused,
    beforeScore: old.score,
    delta100: 100 * (score.structuralScore - old.score.structuralScore),
  });
  if (rows.length % 30 === 0)
    console.log('Native full-card scores', rows.length, '/', capture.rows.length);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
  summary = {};
for (const material of ['all', ...new Set(rows.map((r) => r.material))]) {
  const rs = rows.filter((r) => material === 'all' || r.material === material);
  summary[material] = {
    cards: rs.length,
    before100: mean(rs.map((r) => 100 * r.beforeScore.structuralScore)),
    current100: mean(rs.map((r) => 100 * r.score.structuralScore)),
    improved: rs.filter((r) => r.delta100 > 1e-9).length,
    regressed: rs.filter((r) => r.delta100 < -1e-9).length,
  };
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
await writeJson(output, {
  schema: 1,
  set: inputs.set,
  status: 'complete-native-original-whole-card-comparison',
  scope:
    'Fixed original inputs, references, stock poses and complete metric graph. Whole-card structural diagnostic; not component certification.',
  rendererHash,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  inputHash: hash(input.bytes),
  captureHash: hash(native.bytes),
  posesHash: hash(poses.bytes),
  priorHash: hash(prior.bytes),
  metricGraph: graph,
  reuse: { reused, fresh },
  summary,
  rows,
});
console.log(JSON.stringify(summary));
