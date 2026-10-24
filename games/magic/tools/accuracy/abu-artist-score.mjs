// Recompute one corrected printing; retain the other 898 native scores.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, writeJson, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { printingArtistDelta } from './printing-artist-data-ancestry.mjs';
const [nativeDir, inputFile, metricFile, out] = process.argv.slice(2);
assert(out, 'Usage: abu-artist-score.mjs NATIVE INPUTS METRIC OUT');
const p = await printingArtistDelta(),
  raw = gunzipSync(
    await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/abu-fractional-full-score.json.gz',
    ),
  ),
  full = JSON.parse(raw);
const n = JSON.parse(await readFile(path.join(nativeDir, 'proof.json')));
assert.equal(hash(await readFile(path.join(nativeDir, 'proof.json'))), p.native.contentSha256);
const inputs = JSON.parse(await readFile(inputFile)),
  e = inputs.entries.find((r) => r.id === p.id);
assert.equal(hash(await readFile(inputFile)), n.sourceInputHash);
assert.equal(e.reference.sha256, p.referenceHash);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, full.source.metricGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const b = await readFile(objectFile(e.reference));
assert.equal(hash(b), e.reference.sha256);
const scan = normalize(PNG.sync.read(b), e.pose.transform);
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
const scores = {};
for (const version of ['before', 'after']) {
  const row = n.rows.find(
    (r) => r.version === version && r.mode === 'original' && r.layer === 'face',
  );
  const bytes = await readFile(path.join(nativeDir, row.file));
  assert.equal(hash(bytes), row.sha256);
  scores[version] = compact(
    scoreRegions(scan, normalize(PNG.sync.read(bytes)), e.card, {
      ...e.face,
      artist: version === 'before' ? p.previousArtist : p.artist,
    }),
  );
}
const previous = full.rows.find((r) => r.id === p.id);
assert.deepEqual(
  scores.before,
  previous.scores.after,
  'Existing full-score metric is not exactly reproducible',
);
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const rows = full.rows.map((r) =>
  r.id === p.id
    ? {
        ...r,
        afterFaceHash: n.rows.find(
          (r) => r.version === 'after' && r.mode === 'original' && r.layer === 'face',
        ).sha256,
        scores: { ...r.scores, after: scores.after },
      }
    : r,
);
const summary = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((set) => {
    const a = rows.filter((r) => r.set === set && r.accepted);
    const common = a.map((r) => {
      const keys = Object.keys(r.scores.before.components).filter(
          (k) => r.scores.before.components[k].eligible && r.scores.after.components[k].eligible,
        ),
        weight = keys.reduce((s, k) => s + r.scores.before.components[k].weight, 0);
      const average = (v) =>
        keys.reduce(
          (s, k) => s + r.scores[v].components[k].weight * r.scores[v].components[k].score100,
          0,
        ) / weight;
      return [average('before'), average('after')];
    });
    return [
      set,
      {
        paired: a.length,
        before100: common.reduce((s, r) => s + r[0], 0) / a.length,
        after100: common.reduce((s, r) => s + r[1], 0) / a.length,
      },
    ];
  }),
);
await writeJson(out, {
  schema: 1,
  status: 'printing-scoped-score-update',
  id: p.id,
  referenceHash: p.referenceHash,
  poseHash: hash(JSON.stringify(e.pose)),
  source: {
    reusedCensusHash: hash(raw),
    nativeHash: p.native.contentSha256,
    beforeRenderer: p.beforeRenderer,
    afterRenderer: p.afterRenderer,
    metricGraph: graph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  reusedPrintings: 898,
  recomputedPrintings: 1,
  previousAfterFaceHash: previous.afterFaceHash,
  afterFaceHash: rows.find((r) => r.id === p.id).afterFaceHash,
  scores,
  sets: summary,
  scope:
    'One physical artist correction. The old current-face score is reproduced exactly before updating it. Other 898 rows retain their recorded raster/source identities and scores. This is a scoped score update, not a relabeled new 899-card capture.',
});
console.log(
  JSON.stringify({
    before: scores.before.structural100,
    after: scores.after.structural100,
    artistBefore: scores.before.components.credits,
    artistAfter: scores.after.components.credits,
    sets: summary,
  }),
);
