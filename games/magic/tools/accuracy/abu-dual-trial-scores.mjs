// Score native diagnostic faces with the exact metric used by the frozen census.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [directory, inputFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-dual-trial-scores.mjs TRIALS INPUTS METRIC OUTPUT_GZ');
const cb = await readFile(path.join(directory, 'capture.json')),
  capture = JSON.parse(cb);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(hash(ib), capture.source.inputHash);
const frozenBytes = gunzipSync(
  await readFile(
    'games/magic/fixtures/accuracy/early-through-fourth/abu-fractional-full-score.json.gz',
  ),
);
const frozen = JSON.parse(frozenBytes);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, frozen.source.metricGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const rows = [];
for (const e of inputs.entries.filter((e) => capture.rows.some((r) => r.id === e.id))) {
  const raw = await readFile(objectFile(e.reference));
  assert.equal(hash(raw), e.reference.sha256);
  const scan = normalize(PNG.sync.read(raw), e.pose.transform);
  const old = frozen.rows.find((r) => r.id === e.id);
  const values = [];
  for (const candidate of capture.rows.filter((r) => r.id === e.id)) {
    const b = await readFile(path.join(directory, e.id + '-' + candidate.trial + '.png'));
    assert.equal(hash(b), candidate.renderHash);
    const v = scoreRegions(scan, normalize(PNG.sync.read(b)), e.card, e.face);
    const score = {
      structural100: 100 * v.structuralScore,
      coverage: v.coverage,
      measuredWeight: v.measuredWeight,
      expectedWeight: v.expectedWeight,
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
    };
    if (candidate.trial === 'current')
      assert.deepEqual(score, {
        structural100: old.scores.after.structural100,
        coverage: old.scores.after.coverage,
        measuredWeight: old.scores.after.measuredWeight,
        expectedWeight: old.scores.after.expectedWeight,
        components: old.scores.after.components,
      });
    values.push({ ...candidate, score });
  }
  const base = values.find((v) => v.trial === 'current');
  for (const value of values) {
    for (const [k, c] of Object.entries(base.score.components)) {
      const v = value.score.components[k];
      assert.deepEqual(
        [v.eligible, v.applicable, v.status, v.weight],
        [c.eligible, c.applicable, c.status, c.weight],
        'Metric eligibility changed',
      );
    }
    rows.push({ ...value, delta: value.score.structural100 - base.score.structural100 });
  }
  console.log(e.set, e.name);
}
assert.equal(rows.length, 57);
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = Object.fromEntries(
  capture.trials.map((t) => [
    t.id,
    Object.fromEntries(
      ['lea', 'leb'].map((set) => {
        const r = rows.filter((r) => r.trial === t.id && r.set === set);
        return [
          set,
          {
            n: r.length,
            mean100: mean(r.map((r) => r.score.structural100)),
            delta: mean(r.map((r) => r.delta)),
            gains: r.filter((r) => r.delta > 0.5).length,
            regressions: r.filter((r) => r.delta < -0.5).length,
            worstDelta: Math.min(...r.map((r) => r.delta)),
          },
        ];
      }),
    ),
  ]),
);
await writeFile(
  output,
  gzipSync(
    Buffer.from(
      JSON.stringify({
        schema: 1,
        status: 'native-dual-trial-whole-card-diagnostic',
        scope:
          '19 fixed historical faces; current scores reproduce exactly, identical metric/component eligibility for every trial. Indices are out of 100, not correctness percentages. No experiment is adopted. Artist/legal coverage remains unverified as in the frozen census.',
        source: {
          captureHash: hash(cb),
          inputsHash: hash(ib),
          censusContentHash: hash(frozenBytes),
          metricGraph: graph,
          toolHash: hash(await readFile(new URL(import.meta.url))),
        },
        summary,
        rows,
      }) + '\n',
    ),
    { mtime: 0 },
  ),
);
console.log(JSON.stringify(summary));
