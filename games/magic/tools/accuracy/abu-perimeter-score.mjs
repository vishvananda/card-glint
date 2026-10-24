// Recompute the changed perimeter faces and retain all other measured scores.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { abuPerimeterDelta } from './abu-perimeter-ancestry.mjs';
const [nativeDir, inputFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-perimeter-score.mjs NATIVE INPUTS METRIC OUTPUT_GZ');
const p = await abuPerimeterDelta();
const nb = await readFile(path.join(nativeDir, 'proof.json')),
  n = JSON.parse(nb);
assert.equal(hash(nb), p.native.contentSha256);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(hash(ib), n.source.inputHash);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const fb = gunzipSync(await readFile(base + 'abu-fractional-full-score.json.gz')),
  full = JSON.parse(fb);
const ab = gunzipSync(await readFile(base + 'abu-tropical-artist-score.json.gz')),
  artist = JSON.parse(ab);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, full.source.metricGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
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
const changes = [];
for (const m of p.members) {
  const e = inputs.entries.find((e) => e.id === m.id);
  assert.equal(hash(JSON.stringify(e.face)), m.inputHash);
  const rb = await readFile(objectFile(e.reference));
  assert.equal(hash(rb), e.reference.sha256);
  const scan = normalize(PNG.sync.read(rb), e.pose.transform),
    scores = {};
  for (const version of ['before', 'after']) {
    const filename = e.id + '-original-original-' + version + '-face.png';
    const b = await readFile(path.join(nativeDir, filename));
    const pair = n.faces.find((r) => r.id === e.id && r.mode === 'original' && r.layer === 'face');
    assert.equal(hash(b), pair[version + 'Hash']);
    scores[version] = compact(scoreRegions(scan, normalize(PNG.sync.read(b)), e.card, e.face));
  }
  const old = full.rows.find((r) => r.id === e.id);
  assert.deepEqual(
    scores.before,
    e.id === artist.id ? artist.scores.after : old.scores.after,
    'Prior current score must reproduce',
  );
  for (const [k, c] of Object.entries(scores.before.components)) {
    const a = scores.after.components[k];
    assert.deepEqual(
      [a.eligible, a.applicable, a.status, a.weight],
      [c.eligible, c.applicable, c.status, c.weight],
    );
  }
  changes.push({
    id: e.id,
    set: e.set,
    name: e.name,
    referenceHash: e.reference.sha256,
    poseHash: m.poseHash,
    beforeFaceHash: m.original.hashes['before-face'],
    afterFaceHash: m.original.hashes['after-face'],
    scores,
    delta: scores.after.structural100 - scores.before.structural100,
  });
}
assert.equal(changes.length, 19);
assert(changes.every((r) => r.delta > 0.5));
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const rows = full.rows.map((r) => {
  const patch = changes.find((c) => c.id === r.id);
  const current = r.id === artist.id ? artist.scores.after : r.scores.after;
  return { ...r, current: patch ? patch.scores.after : current, previousCurrent: current };
});
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const sets = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((set) => {
    const rr = rows.filter((r) => r.set === set && r.accepted);
    return [
      set,
      {
        n: rr.length,
        before100: mean(rr.map((r) => r.previousCurrent.structural100)),
        after100: mean(rr.map((r) => r.current.structural100)),
      },
    ];
  }),
);
const result = {
  schema: 1,
  status: 'scoped-current-perimeter-score-update',
  scope:
    '19 actual reviewed Original face scores recomputed on fixed scans and unchanged metric/component eligibility.880 other current scores retain their exact native identities; the prior one-printing artist correction is retained before applying this patch. No Oracle score census or new normalization is claimed. Whole-card indices are out of100, not correctness percentages.',
  source: {
    nativeHash: hash(nb),
    beforeRenderer: p.beforeRenderer,
    afterRenderer: p.afterRenderer,
    inputsHash: hash(ib),
    censusContentHash: hash(fb),
    artistScoreContentHash: hash(ab),
    metricGraph: graph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  recomputedPrintings: 19,
  reusedPrintings: 880,
  sets,
  changes,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(
  JSON.stringify({
    sets,
    duals: Object.fromEntries(
      ['lea', 'leb'].map((set) => {
        const r = changes.filter((c) => c.set === set);
        return [
          set,
          {
            n: r.length,
            before100: mean(r.map((c) => c.scores.before.structural100)),
            after100: mean(r.map((c) => c.scores.after.structural100)),
            worstDelta: Math.min(...r.map((c) => c.delta)),
          },
        ];
      }),
    ),
  }),
);
