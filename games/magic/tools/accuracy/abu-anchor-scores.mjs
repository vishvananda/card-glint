// Score only after independent source-anchor selection, using unchanged faces.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [directory, inputFile, nativeDirectory, perimeterDirectory, metricFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: abu-anchor-scores.mjs PROPOSALS INPUTS OLD_NATIVE PERIMETER_NATIVE METRIC OUT',
);
const pb = await readFile(path.join(directory, 'proposals.json')),
  proposal = JSON.parse(pb);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(hash(ib), proposal.source.inputHash);
const summaryFile =
    'games/magic/fixtures/accuracy/early-through-fourth/abu-current-score-summary.json.gz',
  sb = await readFile(summaryFile),
  current = JSON.parse(gunzipSync(sb));
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, current.source.metricGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const compact = (v) => ({
  score100: v.structuralScore === null ? null : 100 * v.structuralScore,
  coverage: v.coverage,
  components: Object.fromEntries(
    Object.entries(v.components).map(([k, c]) => [
      k,
      {
        score100: c.score === null ? null : 100 * c.score,
        eligible: c.eligible,
        applicable: c.applicable,
        status: c.status,
        weight: c.weight,
      },
    ]),
  ),
});
const rows = [];
for (const p of proposal.rows) {
  const e = inputs.entries.find((e) => e.id === p.id),
    old = current.rows.find((r) => r.id === e.id);
  const isDual = ['lea', 'leb'].includes(e.set) && e.face.frameColors?.length === 2;
  const rendererFile = isDual
    ? path.join(perimeterDirectory, e.id + '-original-original-after-face.png')
    : path.join(nativeDirectory, e.id + '.png');
  const rb = await readFile(rendererFile);
  assert.equal(hash(rb), old.nativeFaceHash);
  const renderer = normalize(PNG.sync.read(rb)),
    scores = {};
  for (const version of ['before', 'after']) {
    const scan = PNG.sync.read(
      await readFile(path.join(directory, e.id + '-' + version + '-scan.png')),
    );
    scores[version] = compact(scoreRegions(scan, renderer, e.card, e.face));
  }
  assert.equal(scores.before.score100, old.score100);
  assert.deepEqual(scores.before.components, old.components);
  for (const [k, c] of Object.entries(scores.after.components)) {
    const prev = scores.before.components[k];
    assert.deepEqual(
      [c.eligible, c.applicable, c.status, c.weight],
      [prev.eligible, prev.applicable, prev.status, prev.weight],
    );
  }
  rows.push({
    id: e.id,
    proposalStatus: p.status,
    set: e.set,
    name: e.name,
    referenceHash: p.referenceHash,
    priorPoseHash: p.priorPoseHash,
    proposedTransform: p.proposal.transform,
    nativeFaceHash: old.nativeFaceHash,
    scores,
    delta100: scores.after.score100 - scores.before.score100,
  });
}
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const result = {
  schema: 1,
  status: 'anchor-proposal-score-evaluation-not-normalization-adoption',
  scope:
    'Only source scan scale/translation change after independent anchor fitting. Renderer pixels and Original words stay fixed. Prior scores reproduce exactly; metric eligibility is unchanged. Metrics do not choose the proposed transforms.',
  source: {
    proposalHash: hash(pb),
    currentSummaryHash: hash(sb),
    metricGraph: graph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(
  rows.map((r) => ({
    set: r.set,
    name: r.name,
    before: r.scores.before.score100,
    after: r.scores.after.score100,
    delta: r.delta100,
  })),
);
