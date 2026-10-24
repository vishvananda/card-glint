// Score frozen before/after native ABU faces with an explicit host metric.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { abuFractionalAncestry } from './abu-fractional-ancestry.mjs';
const [nativeDir, baselineDir, inputFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-fractional-full-score.mjs NATIVE BASELINE INPUTS METRIC OUTPUT');
const toolHash = hash(await readFile(new URL(import.meta.url)));
const p = await abuFractionalAncestry(),
  nativeBytes = await readFile(path.join(nativeDir, 'proof.json')),
  native = JSON.parse(nativeBytes);
assert.equal(hash(nativeBytes), p.evidence.native.contentSha256);
const inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes);
assert.equal(hash(inputBytes), native.source.inputsHash);
const baselineBytes = await readFile(path.join(baselineDir, 'study.json')),
  baseline = JSON.parse(baselineBytes);
assert.equal(baseline.source.rendererHash, p.beforeRenderer);
assert.equal(baseline.source.inputsHash, hash(JSON.stringify(inputs)));
assert.equal(baseline.completed, 899);
assert.equal(native.completed, 899);
assert.equal(inputs.entries.length, 899);
assert.deepEqual(native.faults, []);
assert.deepEqual(baseline.faults, []);
const graph = await metricSourceGraph(metricFile),
  { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile))),
  rows = [];
const compact = (v) => ({
  structural100: v.structuralScore === null ? null : 100 * v.structuralScore,
  coverage: v.coverage,
  expectedWeight: v.expectedWeight,
  measuredWeight: v.measuredWeight,
  components: Object.fromEntries(
    Object.entries(v.components).map(([k, c]) => [
      k,
      {
        score100: c.score === null ? null : 100 * c.score,
        applicable: c.applicable,
        eligible: c.eligible,
        status: c.status,
        weight: c.weight,
      },
    ]),
  ),
  weakest: v.weakest,
  color: v.color,
});
for (const e of inputs.entries) {
  assert.equal(e.face.wordingMode, 'original');
  const n = native.rows.find((r) => r.id === e.id),
    b = baseline.rows.find((r) => r.id === e.id);
  assert(n && b);
  assert.equal(n.referenceHash, e.reference.sha256);
  assert.equal(n.poseHash, hash(JSON.stringify(e.pose)));
  assert.equal(b.variants[0].renderHash, n.beforeFaceHash);
  assert(n.sourceBound && !n.prototypeMatch);
  assert.equal(n.outside, 0);
  assert.equal(n.alpha, 0);
  const raw = await readFile(objectFile(e.reference));
  assert.equal(hash(raw), e.reference.sha256);
  const scan = normalize(PNG.sync.read(raw), e.pose.transform),
    scores = {};
  for (const variant of ['before', 'after']) {
    const file =
      variant === 'before'
        ? path.join(baselineDir, e.set, e.id, 'current.png')
        : path.join(nativeDir, e.id + '.png');
    const bytes = await readFile(file);
    assert.equal(hash(bytes), variant === 'before' ? n.beforeFaceHash : n.afterFaceHash);
    const image = normalize(PNG.sync.read(bytes));
    scores[variant] = compact(scoreRegions(scan, image, e.card, e.face));
  }
  rows.push({
    id: e.id,
    set: e.set,
    name: e.name,
    material: e.material,
    accepted: e.pose.accepted,
    referenceHash: e.reference.sha256,
    poseHash: n.poseHash,
    beforeFaceHash: n.beforeFaceHash,
    afterFaceHash: n.afterFaceHash,
    scores,
  });
  if (rows.length % 25 === 0 || rows.length === 899)
    console.log('Full-card regional metric ' + rows.length + '/899');
}
assert.deepEqual(await metricSourceGraph(metricFile), graph, 'Metric changed during scoring');
assert.equal(
  hash(await readFile(new URL(import.meta.url))),
  toolHash,
  'Scorer tool changed during scoring',
);
const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null);
const q = (a, p) => {
  if (!a.length) return null;
  const s = [...a].sort((a, b) => a - b),
    i = (s.length - 1) * p;
  return s[Math.floor(i)] + (s[Math.ceil(i)] - s[Math.floor(i)]) * (i - Math.floor(i));
};
function summarize(items) {
  const accepted = items.filter((r) => r.accepted);
  const components = {};
  for (const key of ['structural100', ...Object.keys(rows[0].scores.before.components)]) {
    const value = (r, v) =>
      key === 'structural100'
        ? r.scores[v].structural100
        : r.scores[v].components[key]?.eligible
          ? r.scores[v].components[key].score100
          : null;
    const paired = accepted.filter(
      (r) => value(r, 'before') !== null && value(r, 'after') !== null,
    );
    const before = paired.map((r) => value(r, 'before')),
      after = paired.map((r) => value(r, 'after')),
      d = after.map((x, i) => x - before[i]);
    components[key] = {
      paired: paired.length,
      before100: mean(before),
      after100: mean(after),
      medianBefore100: q(before, 0.5),
      medianAfter100: q(after, 0.5),
      p10Before100: q(before, 0.1),
      p10After100: q(after, 0.1),
      gainsAboveHalfPoint: d.filter((x) => x > 0.5).length,
      regressionsAboveHalfPoint: d.filter((x) => x < -0.5).length,
    };
  }
  return {
    inventory: items.length,
    accepted: accepted.length,
    rejectedDiagnostics: items.filter((r) => !r.accepted).map((r) => ({ id: r.id, name: r.name })),
    components,
  };
}
await writeJson(output, {
  schema: 1,
  status: 'paired-native-development-census',
  scope:
    '899 Original before/after faces and identical frozen independent scan poses. All regional components are recomputed directly with the supplied metric. Paired accepted means retain three historical rejected Alpha poses as diagnostics. Eligibility/coverage remain explicit; these are indices out of 100, not percentages, full-set certifications, or published Lab scores. No scan refit, color normalization, art replacement, or per-card renderer offsets.',
  source: {
    nativeHash: hash(nativeBytes),
    baselineHash: hash(baselineBytes),
    inputsHash: hash(inputBytes),
    beforeRenderer: p.beforeRenderer,
    capturedRenderer: p.capturedRenderer,
    afterRenderer: p.afterRenderer,
    metricGraph: graph,
    toolHash,
  },
  summary: summarize(rows),
  sets: Object.fromEntries(
    ['lea', 'leb', '2ed'].map((s) => [s, summarize(rows.filter((r) => r.set === s))]),
  ),
  rows,
});
console.log(
  JSON.stringify(
    Object.fromEntries(
      ['lea', 'leb', '2ed'].map((s) => [
        s,
        summarize(rows.filter((r) => r.set === s)).components.structural100,
      ]),
    ),
  ),
);
