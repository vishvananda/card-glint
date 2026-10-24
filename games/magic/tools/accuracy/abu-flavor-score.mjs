// Recompute changed flavor inputs; reuse only exact native/reference/pose identities.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { printingFlavorDelta } from './printing-flavor-data-ancestry.mjs';
const [nativeDirectory, beforeFile, afterFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-flavor-score.mjs NATIVE BEFORE_INPUTS AFTER_INPUTS METRIC OUTPUT_GZ');
const p = await printingFlavorDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const raw = await readFile(path.join(nativeDirectory, 'proof.json')),
  native = JSON.parse(raw);
assert.equal(hash(raw), p.native.contentSha256);
const ib = await readFile(afterFile),
  bb = await readFile(beforeFile);
assert.equal(hash(ib), native.source.afterInputHash);
assert.equal(hash(bb), native.source.beforeInputHash);
const after = JSON.parse(ib),
  before = JSON.parse(bb);
const oldZip = await readFile(
  'games/magic/fixtures/accuracy/early-through-fourth/abu-paper-current-scores.json.gz',
);
const old = JSON.parse(gunzipSync(oldZip));
assert.equal(old.source.rendererHash, p.beforeRenderer);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, old.source.metricGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const compact = (s) => ({
  score100: 100 * s.structuralScore,
  coverage: s.coverage,
  components: Object.fromEntries(
    Object.entries(s.components).map(([k, c]) => [
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
});
const rows = [],
  changes = [];
for (const prev of old.rows) {
  const r = native.rows.find((r) => r.id === prev.id),
    e = after.entries.find((e) => e.id === prev.id),
    b = before.entries.find((e) => e.id === prev.id);
  assert.equal(r.referenceHash, prev.referenceHash);
  assert.equal(r.poseHash, prev.poseHash);
  assert.equal(r.beforeInputHash, prev.inputHash);
  const faceHash = r.original.hashes['after-face'];
  if (!r.affected) {
    assert.equal(r.inputHash, prev.inputHash);
    assert.equal(faceHash, prev.nativeFaceHash);
    rows.push(prev);
    continue;
  }
  const referenceBytes = await readFile(objectFile(e.reference));
  assert.equal(hash(referenceBytes), r.referenceHash);
  const reference = normalize(PNG.sync.read(referenceBytes), e.pose.transform),
    scores = {};
  for (const [version, entry] of [
    ['before', b],
    ['after', e],
  ]) {
    const bytes = await readFile(
      path.join(nativeDirectory, e.id + '-original-original-false-' + version + '-face.png'),
    );
    assert.equal(hash(bytes), r.original.hashes[version + '-face']);
    scores[version] = compact(
      scoreRegions(reference, normalize(PNG.sync.read(bytes)), entry.card, entry.face),
    );
  }
  assert.equal(r.original.hashes['before-face'], prev.nativeFaceHash);
  assert.deepEqual(scores.before, {
    score100: prev.score100,
    coverage: prev.coverage,
    components: prev.components,
  });
  for (const [k, c] of Object.entries(scores.after.components)) {
    const old = scores.before.components[k];
    assert.deepEqual(
      [c.applicable, c.eligible, c.status, c.weight],
      [old.applicable, old.eligible, old.status, old.weight],
    );
  }
  changes.push({
    id: e.id,
    set: e.set,
    name: e.name,
    scores,
    delta100: scores.after.score100 - scores.before.score100,
    rasterChanged: faceHash !== prev.nativeFaceHash,
  });
  rows.push({ ...prev, ...scores.after, inputHash: r.inputHash, nativeFaceHash: faceHash });
}
assert.equal(rows.length, 899);
assert.equal(changes.length, 3);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((set) => [
    set,
    {
      printings: rows.filter((r) => r.set === set).length,
      before100: mean(old.rows.filter((r) => r.set === set).map((r) => r.score100)),
      mean100: mean(rows.filter((r) => r.set === set).map((r) => r.score100)),
      changedRasters: changes.filter((r) => r.set === set && r.rasterChanged).length,
    },
  ]),
);
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const result = {
  schema: 1,
  status: 'complete-current-abu-flavor-score-summary',
  scope:
    '899 Original printings; three flavor attribution inputs recomputed and896 exact native/reference/pose/input tuples reused. Only two native rasters change. Same metric graph, reference transforms and component eligibility/weights. Indices out of100, not a completed-set declaration.',
  source: {
    rendererHash: p.afterRenderer,
    priorRendererHash: p.beforeRenderer,
    nativeHash: hash(raw),
    inputsHash: hash(ib),
    beforeInputsHash: hash(bb),
    metricGraph: graph,
    priorSummaryHash: hash(oldZip),
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary,
  recomputedPrintings: 3,
  reusedPrintings: 896,
  changedRasters: changes.filter((r) => r.rasterChanged).length,
  changes,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(JSON.stringify({ summary, changes }));
