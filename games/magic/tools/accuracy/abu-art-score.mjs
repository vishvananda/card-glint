// Reuse measured candidates only after production native identity is proven.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { abuArtDelta } from './abu-art-ancestry.mjs';
const [inputFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-art-score.mjs INPUTS METRIC OUTPUT_GZ');
const p = await abuArtDelta(),
  ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const nz = await readFile(path.join(root, p.native.file)),
  native = JSON.parse(gunzipSync(nz));
assert.equal(hash(ib), native.source.inputHash);
const oldBytes = await readFile(
    'games/magic/fixtures/accuracy/early-through-fourth/abu-flavor-current-scores.json.gz',
  ),
  old = JSON.parse(gunzipSync(oldBytes));
const studyBytes = await readFile(path.join(root, p.study.file)),
  study = JSON.parse(gunzipSync(studyBytes));
assert.equal(old.source.rendererHash, p.beforeRenderer);
assert.equal(hash(oldBytes), study.source.priorScoreHash);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, old.source.metricGraph);
assert.deepEqual(graph, study.source.metricGraph);
const rows = [],
  changes = [];
for (const oldRow of old.rows) {
  const r = native.rows.find((r) => r.id === oldRow.id),
    e = inputs.entries.find((e) => e.id === oldRow.id);
  assert(r && e);
  assert.equal(r.referenceHash, oldRow.referenceHash);
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.poseHash, oldRow.poseHash);
  assert.equal(r.poseHash, hash(JSON.stringify(e.pose)));
  assert.equal(r.inputHash, oldRow.inputHash);
  assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
  const faceHash = r.original.hashes['after-face'];
  if (!r.affected) {
    assert.equal(faceHash, oldRow.nativeFaceHash);
    rows.push(oldRow);
    continue;
  }
  const before = study.rows.find((v) => v.id === r.id && v.trial === 'current'),
    after = study.rows.find((v) => v.id === r.id && v.trial === 'up-2');
  assert(before && after);
  for (const v of [before, after]) {
    assert.equal(v.referenceHash, r.referenceHash);
    assert.equal(v.poseHash, r.poseHash);
    assert.equal(v.inputHash, r.inputHash);
  }
  assert.equal(before.renderHash, oldRow.nativeFaceHash);
  assert.equal(before.score100, oldRow.score100);
  assert.deepEqual(before.components, oldRow.components);
  assert.equal(after.renderHash, faceHash);
  for (const [k, c] of Object.entries(after.components)) {
    const b = oldRow.components[k];
    assert.deepEqual(
      [c.applicable, c.eligible, c.status, c.weight],
      [b.applicable, b.eligible, b.status, b.weight],
    );
  }
  // Coverage depends on applicability, eligibility and weights, all exact above.
  rows.push({
    ...oldRow,
    score100: after.score100,
    components: after.components,
    nativeFaceHash: faceHash,
  });
  changes.push({
    id: r.id,
    set: r.set,
    name: r.name,
    before100: oldRow.score100,
    after100: after.score100,
    delta100: after.delta100,
  });
}
assert.equal(rows.length, 899);
assert.equal(changes.length, 19);
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
assert.deepEqual(await metricSourceGraph(metricFile), graph);
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const result = {
  schema: 1,
  status: 'complete-current-abu-art-height-score-summary',
  scope:
    '899 Original printings. Reuse880 unchanged native/reference/pose/input/metric tuples and19 exact production matches to the frozen measured art-height candidate. Same metric graph, eligibility, applicability and weights; coverage follows those unchanged inputs. No new scan pose or score exclusion. Indices out of100; not set completion or publication.',
  source: {
    rendererHash: p.afterRenderer,
    priorRendererHash: p.beforeRenderer,
    nativeHash: p.native.contentSha256,
    inputsHash: hash(ib),
    metricGraph: graph,
    priorSummaryHash: hash(oldBytes),
    studyHash: hash(studyBytes),
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary,
  priorNativeReused: 880,
  measuredCandidateReused: 19,
  changes,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(JSON.stringify(summary));
