// Compare explicit public mana-input variants, with exact semantic-plan reuse.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [
  beforeInputFile,
  afterInputFile,
  beforeCaptureFile,
  afterCaptureFile,
  posesFile,
  priorFile,
  metricsFile,
  policyFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: printing-native-input-score.mjs BEFORE_INPUTS AFTER_INPUTS BEFORE_CAPTURE AFTER_CAPTURE POSES PRIOR_SCORES METRICS POLICY NEW_OUTPUT',
);
const files = [
    beforeInputFile,
    afterInputFile,
    beforeCaptureFile,
    afterCaptureFile,
    posesFile,
    priorFile,
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [beforeInputs, afterInputs, before, after, poses, prior] = bytes.map((b) => JSON.parse(b)),
  graph = await metricSourceGraph(path.resolve(metricsFile)),
  policyGraph = await metricSourceGraph(path.resolve(policyFile)),
  { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile))),
  { accuracyRegions } = await import(pathToFileURL(path.resolve(policyFile))),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  scorerFace = (face) => ({
    ...face,
    typeSource: 'Scan-reviewed type',
    rulesSource: 'Original printing source',
  });
assert.deepEqual(graph, prior.metricGraph);
assert.equal(prior.inputHash, hash(bytes[0]));
assert.equal(prior.posesHash, hash(bytes[4]));
assert.equal(before.inputHash, hash(bytes[0]));
assert.equal(after.inputHash, hash(bytes[1]));
assert.equal(before.rendererHash, after.rendererHash);
assert.equal(prior.rendererHash, before.rendererHash);
assert.equal(before.status, 'complete');
assert.equal(after.status, 'complete');
assert.deepEqual(before.faults, []);
assert.deepEqual(after.faults, []);
const ids = beforeInputs.entries.map((e) => e.id).sort();
for (const a of [afterInputs.entries, before.rows, after.rows, prior.rows])
  assert.deepEqual(a.map((r) => r.id).sort(), ids);
assert.equal(beforeInputs.set, afterInputs.set);
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const start = performance.now(),
  rows = [];
let reused = 0,
  fresh = 0;
for (const e of beforeInputs.entries) {
  const next = afterInputs.entries.find((n) => n.id === e.id),
    b = before.rows.find((n) => n.id === e.id),
    a = after.rows.find((n) => n.id === e.id),
    p = poses.rows.find((p) => p.id === e.id),
    old = prior.rows.find((r) => r.id === e.id),
    bf = b.modes.original,
    af = a.modes.original;
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(next.face.wordingMode, 'original');
  assert.deepEqual(next.card, e.card);
  assert.deepEqual(next.reference, e.reference);
  assert.deepEqual(next.art, e.art);
  const { symbolAdjustment: ignoredBefore, ...baseFace } = e.face,
    { symbolAdjustment: ignoredAfter, ...nextFace } = next.face;
  assert.deepEqual(
    nextFace,
    baseFace,
    'This comparison permits mana/set input knobs only,not text/frame/content changes',
  );
  assert(p.accepted);
  assert.equal(old.poseHash, hash(JSON.stringify(p.transform)));
  assert.equal(old.referenceHash, b.referenceHash);
  assert.equal(a.referenceHash, b.referenceHash);
  assert.equal(old.nativeHash ?? old.after, bf.sha256);
  assert.equal(bf.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(af.inputHash, hash(JSON.stringify(next.face)));
  assert.equal(old.inputHash, bf.inputHash);
  const plan = accuracyRegions(e.card, scorerFace(e.face)),
    nextPlan = accuracyRegions(next.card, scorerFace(next.face));
  assert.deepEqual(nextPlan, plan, 'Metric regions changed; old scores cannot be reused');
  const bbytes = await fs.readFile(path.join(path.dirname(beforeCaptureFile), bf.file)),
    abytes = await fs.readFile(path.join(path.dirname(afterCaptureFile), af.file));
  assert.equal(hash(bbytes), bf.sha256);
  assert.equal(hash(abytes), af.sha256);
  const scoreReused = bf.sha256 === af.sha256;
  let score;
  if (scoreReused) {
    score = old.score;
    reused++;
  } else {
    const reference = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(reference), b.referenceHash);
    score = scoreRegions(
      normalize(PNG.sync.read(reference), p.transform),
      normalize(PNG.sync.read(abytes)),
      next.card,
      scorerFace(next.face),
    );
    fresh++;
  }
  rows.push({
    id: e.id,
    name: e.name,
    material: e.face.artifact ? 'A' : e.face.land ? 'L' : (e.face.frameColors ?? e.face.colors)[0],
    cohort: p.cohort,
    referenceHash: b.referenceHash,
    poseHash: old.poseHash,
    beforeInputHash: bf.inputHash,
    inputHash: af.inputHash,
    regionPlanHash: hash(JSON.stringify(plan)),
    beforeNativeHash: bf.sha256,
    nativeHash: af.sha256,
    beforeScore: old.score,
    score,
    scoreReused,
    delta100: 100 * (score.structuralScore - old.score.structuralScore),
  });
  if (rows.length % 30 === 0)
    console.log('Native input comparison scores', rows.length, '/', ids.length);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
assert.deepEqual(await metricSourceGraph(path.resolve(metricsFile)), graph);
assert.deepEqual(await metricSourceGraph(path.resolve(policyFile)), policyGraph);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
await writeJson(output, {
  schema: 1,
  set: beforeInputs.set,
  status: 'complete-native-mana-input-comparison',
  scope:
    'Explicit Original mana/set input controls on a fixed renderer,content,art,references and stock poses. Every input delta is checked; the old/new complete metric region plans are identical. Native files are verified and unchanged rasters alone reuse prior scores under the same full metric graph. Fresh scores use the actual candidate face. This comparison changes no source data or renderer defaults and does not certify a complete set.',
  rendererHash: after.rendererHash,
  beforeInputHash: hash(bytes[0]),
  inputHash: hash(bytes[1]),
  sources: Object.fromEntries(
    ['beforeInputs', 'afterInputs', 'beforeCapture', 'afterCapture', 'poses', 'prior'].map(
      (k, i) => [k, hash(bytes[i])],
    ),
  ),
  toolHash,
  metricGraph: graph,
  policyGraph,
  reuse: { reused, fresh },
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
  elapsedSeconds: (performance.now() - start) / 1000,
});
console.log('Finished input comparison', reused, 'reused', fresh, 'fresh');
