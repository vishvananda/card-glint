// Rescore changed production faces; retain exact native/reference/pose/input/metric identities elsewhere.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { abuFlowDelta } from './abu-flow-ancestry.mjs';
const [nativeDir, beforeFile, afterFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-flow-score.mjs NATIVE BEFORE AFTER METRIC OUTPUT_GZ');
const p = await abuFlowDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const nz = await readFile(p.native.file),
  n = JSON.parse(gunzipSync(nz));
assert.equal(hash(nz), p.native.sha256);
const bb = await readFile(beforeFile),
  ab = await readFile(afterFile);
assert.equal(hash(bb), n.source.beforeInputHash);
assert.equal(hash(ab), n.source.afterInputHash);
const before = JSON.parse(bb),
  after = JSON.parse(ab);
const oldZip = await readFile(
  'games/magic/fixtures/accuracy/early-through-fourth/abu-art-current-scores.json.gz',
);
const old = JSON.parse(gunzipSync(oldZip));
assert.equal(old.source.rendererHash, p.beforeRenderer);
assert.equal(old.source.nativeHash, p.parent.contentSha256);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, old.source.metricGraph, 'Do not mix metric revisions');
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const compact = (v) => ({
  score100: 100 * v.structuralScore,
  coverage: v.coverage,
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
});
const rows = [],
  changes = [];
for (const previous of old.rows) {
  const r = n.rows.find((v) => v.id === previous.id);
  const b = before.entries.find((v) => v.id === r.id),
    a = after.entries.find((v) => v.id === r.id);
  assert(b && a);
  assert.equal(r.referenceHash, previous.referenceHash);
  assert.equal(r.referenceHash, b.reference.sha256);
  assert.deepEqual(a.reference, b.reference);
  assert.equal(r.poseHash, previous.poseHash);
  assert.equal(r.poseHash, hash(JSON.stringify(a.pose)));
  assert.deepEqual(a.pose, b.pose);
  assert.equal(r.beforeInputHash, previous.inputHash);
  assert.equal(r.beforeInputHash, hash(JSON.stringify(b.face)));
  assert.equal(r.inputHash, hash(JSON.stringify(a.face)));
  const faceHash = r.original.hashes['after-face'];
  if (!r.pixelsChanged) {
    assert.equal(faceHash, previous.nativeFaceHash);
    assert.equal(r.inputHash, previous.inputHash);
    rows.push(previous);
    continue;
  }
  assert(r.affected);
  assert.equal(r.original.hashes['before-face'], previous.nativeFaceHash);
  const raw = await readFile(objectFile(a.reference));
  assert.equal(hash(raw), r.referenceHash);
  const scan = normalize(PNG.sync.read(raw), a.pose.transform),
    scores = {};
  for (const [version, entry] of [
    ['before', b],
    ['after', a],
  ]) {
    const bytes = await readFile(
      path.join(nativeDir, r.id + '-original-original-' + version + '-face.png'),
    );
    assert.equal(hash(bytes), r.original.hashes[version + '-face']);
    scores[version] = compact(
      scoreRegions(scan, normalize(PNG.sync.read(bytes)), entry.card, entry.face),
    );
  }
  assert.deepEqual(
    scores.before,
    {
      score100: previous.score100,
      coverage: previous.coverage,
      components: previous.components,
    },
    'Previous score must reproduce exactly: ' + r.name,
  );
  assert.equal(scores.after.coverage, previous.coverage);
  for (const [k, c] of Object.entries(scores.after.components)) {
    const old = previous.components[k];
    assert.deepEqual(
      [c.applicable, c.eligible, c.status, c.weight],
      [old.applicable, old.eligible, old.status, old.weight],
    );
  }
  rows.push({ ...previous, ...scores.after, nativeFaceHash: faceHash, inputHash: r.inputHash });
  changes.push({
    id: r.id,
    set: r.set,
    name: r.name,
    wording: r.wording,
    beforeFaceHash: previous.nativeFaceHash,
    afterFaceHash: faceHash,
    ...scores,
    delta100: scores.after.score100 - scores.before.score100,
  });
}
assert.equal(rows.length, 899);
assert.equal(changes.length, 33);
assert.deepEqual(await metricSourceGraph(metricFile), graph);
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((set) => [
    set,
    {
      printings: rows.filter((r) => r.set === set).length,
      before100: mean(old.rows.filter((r) => r.set === set).map((r) => r.score100)),
      mean100: mean(rows.filter((r) => r.set === set).map((r) => r.score100)),
      changedRasters: changes.filter((r) => r.set === set).length,
    },
  ]),
);
const result = {
  schema: 1,
  status: 'complete-current-abu-flow-score-summary',
  scope:
    '899 Original printings;33 physically changed production faces rescored,866 identical native/reference/pose/input/metric tuples reused. Three Stasis inputs use reviewed printed text. Frozen scan transforms and identical metric graph, applicability, eligibility, weights and coverage. All changes including regressions retained. Indices out of100; not completion or publication.',
  source: {
    rendererHash: p.afterRenderer,
    priorRendererHash: p.beforeRenderer,
    nativeHash: p.native.contentSha256,
    beforeInputsHash: hash(bb),
    inputsHash: hash(ab),
    metricGraph: graph,
    priorSummaryHash: hash(oldZip),
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary,
  recomputedPrintings: changes.length,
  reusedPrintings: 899 - changes.length,
  changes,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(
  JSON.stringify({
    summary,
    gains: changes.filter((r) => r.delta100 > 0).length,
    regressions: changes
      .filter((r) => r.delta100 < 0)
      .map((r) => ({ name: r.name, set: r.set, delta: r.delta100 })),
    recomputed: changes.length,
    reused: 899 - changes.length,
  }),
);
