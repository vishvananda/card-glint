// Actual native art-height evidence; source poses and the whole-card metric stay fixed.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { medianFrameGradient, gradientOverlap, bestGradientShift } from './frame-edge-measure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [dir, inputFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-dual-art-report.mjs TRIALS INPUTS METRIC OUTPUT_GZ');
const cb = await readFile(path.join(dir, 'capture.json')),
  capture = JSON.parse(cb);
assert.equal(capture.status, 'complete-native-art-height-trials-not-adopted');
assert.equal(capture.source.closed, true);
assert.equal(await sourceHash('games/magic/src'), capture.source.rendererHash);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(hash(ib), capture.source.inputHash);
const priorFile =
  'games/magic/fixtures/accuracy/early-through-fourth/abu-flavor-current-scores.json.gz';
const oldZip = await readFile(priorFile),
  prior = JSON.parse(gunzipSync(oldZip));
assert.equal(prior.source.rendererHash, capture.source.rendererHash);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, prior.source.metricGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const rects = {
  artLeft: [44, 125, 34, 200, 'x'],
  artRight: [408, 125, 36, 200, 'x'],
  artTop: [110, 60, 275, 30, 'y'],
  artBottom: [110, 350, 275, 40, 'y'],
  paperTop: [110, 392, 275, 40, 'y'],
  paperBottom: [110, 583, 275, 40, 'y'],
};
const rows = [];
const ids = [...new Set(capture.rows.map((r) => r.id))];
assert.equal(ids.length, 19);
for (const id of ids) {
  const e = inputs.entries.find((e) => e.id === id),
    old = prior.rows.find((r) => r.id === id);
  const scanBytes = await readFile(objectFile(e.reference));
  assert.equal(hash(scanBytes), e.reference.sha256);
  const reference = normalize(PNG.sync.read(scanBytes), e.pose.transform);
  const referenceEdges = Object.fromEntries(
    Object.entries(rects).map(([k, r]) => [k, medianFrameGradient(reference, r)]),
  );
  const related = capture.rows.filter((r) => r.id === id);
  assert.equal(related.length, 7);
  for (const v of related) {
    assert.equal(v.referenceHash, old.referenceHash);
    assert.equal(v.poseHash, old.poseHash);
    const png = await readFile(path.join(dir, id + '-' + v.trial + '.png'));
    assert.equal(hash(png), v.renderHash);
    const image = normalize(PNG.sync.read(png));
    const edges = Object.fromEntries(
      Object.entries(rects).map(([k, r]) => {
        const gradient = medianFrameGradient(image, r),
          ref = referenceEdges[k];
        return [
          k,
          {
            samePosition100: gradientOverlap(gradient, ref),
            best: bestGradientShift(gradient, ref),
          },
        ];
      }),
    );
    const score = scoreRegions(reference, image, e.card, e.face);
    const components = Object.fromEntries(
      Object.entries(score.components).map(([k, c]) => [
        k,
        {
          score100: c.score === null ? null : 100 * c.score,
          eligible: c.eligible,
          applicable: c.applicable,
          status: c.status,
          weight: c.weight,
        },
      ]),
    );
    if (v.trial === 'current') {
      assert.equal(v.renderHash, old.nativeFaceHash);
      assert.equal(100 * score.structuralScore, old.score100);
      assert.deepEqual(components, old.components);
    }
    for (const [k, c] of Object.entries(components)) {
      const p = old.components[k];
      assert.deepEqual(
        [c.eligible, c.applicable, c.status, c.weight],
        [p.eligible, p.applicable, p.status, p.weight],
      );
    }
    rows.push({
      ...v,
      edges,
      heightResidual: edges.artBottom.best.shift - edges.artTop.best.shift,
      score100: 100 * score.structuralScore,
      delta100: 100 * score.structuralScore - old.score100,
      components,
    });
  }
  console.log(e.set, e.name);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const median = (a) => a.toSorted((a, b) => a - b)[Math.floor(a.length / 2)];
const summary = Object.fromEntries(
  capture.trials.map((t) => {
    const a = rows.filter((r) => r.trial === t.id);
    return [
      t.id,
      {
        fullMean100: mean(a.map((r) => r.score100)),
        fullDelta100: mean(a.map((r) => r.delta100)),
        gains: a.filter((r) => r.delta100 > 0.5).length,
        regressions: a.filter((r) => r.delta100 < -0.5).length,
        worstDelta100: Math.min(...a.map((r) => r.delta100)),
        meanAbsoluteHeightResidual: mean(a.map((r) => Math.abs(r.heightResidual))),
        medianHeightResidual: median(a.map((r) => r.heightResidual)),
        edgeMean100: Object.fromEntries(
          Object.keys(rects).map((k) => [k, mean(a.map((r) => r.edges[k].samePosition100))]),
        ),
      },
    ];
  }),
);
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const result = {
  schema: 1,
  status: 'native-art-height-trials-not-adopted',
  scope:
    'All19 physical Alpha/Beta duals, actual native printing with fixed scan transforms. Current scores reproduce exactly and metric eligibility/weights stay fixed. Frame RGB-gradient profiles are separate diagnostics; relative top/bottom displacement measures height while exposing translation residuals. Savannah remains included; no per-card pose or rendering exception is introduced. Source palette and existing HSB stay fixed.',
  source: {
    captureHash: hash(cb),
    inputsHash: hash(ib),
    priorScoreHash: hash(oldZip),
    metricGraph: graph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    edgeMethodHash: hash(await readFile(new URL('./frame-edge-measure.mjs', import.meta.url))),
  },
  methods: await Promise.all(
    [
      'abu-dual-art-pixels.mjs',
      'abu-dual-art-trial-plugin.mjs',
      'abu-dual-art-trials.mjs',
      'frame-edge-measure.mjs',
      'abu-dual-art-report.mjs',
    ].map(async (file) => {
      const text = await readFile(new URL('./' + file, import.meta.url), 'utf8');
      return { file: 'games/magic/tools/accuracy/' + file, sha256: hash(text), text };
    }),
  ),
  capture,
  summary,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(JSON.stringify(summary));
