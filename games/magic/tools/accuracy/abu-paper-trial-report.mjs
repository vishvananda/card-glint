// Edge and whole-card evidence for the native lower-paper trials.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [directory, inputFile, referenceFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-paper-trial-report.mjs TRIALS INPUTS FRAME_RECHECK METRIC OUTPUT_GZ');
const cb = await readFile(path.join(directory, 'capture.json')),
  capture = JSON.parse(cb);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(hash(ib), capture.source.inputHash);
const rb = await readFile(referenceFile),
  reference = JSON.parse(rb);
const currentFile =
  'games/magic/fixtures/accuracy/early-through-fourth/abu-current-score-summary.json.gz';
const currentBytes = await readFile(currentFile),
  current = JSON.parse(gunzipSync(currentBytes));
assert.equal(current.source.rendererHash, capture.source.rendererHash);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, current.source.metricGraph);
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const median = (a) => {
  const b = [...a].sort((a, b) => a - b);
  return (b[Math.floor((b.length - 1) / 2)] + b[Math.ceil((b.length - 1) / 2)]) / 2;
};
function edge(image, [x, y, w, h, axis]) {
  const n = axis === 'x' ? w : h,
    along = axis === 'x' ? h : w;
  let rgb = Array.from({ length: n }, (_, i) =>
    [0, 1, 2].map((k) =>
      median(
        Array.from(
          { length: along },
          (_, j) =>
            image.data[((y + (axis === 'x' ? j : i)) * 488 + x + (axis === 'x' ? i : j)) * 4 + k],
        ),
      ),
    ),
  );
  for (let pass = 0; pass < 2; pass++)
    rgb = rgb.map((v, i) =>
      v.map((_, k) => (rgb[Math.max(0, i - 1)][k] + 2 * v[k] + rgb[Math.min(n - 1, i + 1)][k]) / 4),
    );
  return rgb.slice(1).map((v, i) => Math.hypot(...v.map((c, k) => c - rgb[i][k])));
}
function cosine(a, b) {
  let xy = 0,
    aa = 0,
    bb = 0;
  for (let i = 4; i < a.length - 4; i++) {
    xy += a[i] * b[i];
    aa += a[i] * a[i];
    bb += b[i] * b[i];
  }
  assert(aa && bb);
  return (100 * xy) / Math.sqrt(aa * bb);
}
const compact = (v) =>
  Object.fromEntries(
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
  );
const rows = [];
for (const ref of reference.rows) {
  const e = inputs.entries.find((e) => e.id === ref.id),
    old = current.rows.find((r) => r.id === ref.id);
  const related = capture.rows.filter((r) => r.id === ref.id);
  assert.equal(related.length, capture.trials.length);
  assert.equal(e.reference.sha256, ref.referenceHash);
  // The recheck archives the same immutable, fixed-pose canonical scan pixels.
  const scanBytes = await readFile(path.join(path.dirname(referenceFile), e.id + '-scan.png'));
  assert.equal(hash(scanBytes), ref.scanPreviewHash);
  const scan = PNG.sync.read(scanBytes);
  for (const row of related) {
    assert.equal(row.referenceHash, ref.referenceHash);
    assert.equal(row.poseHash, ref.poseHash);
    const b = await readFile(path.join(directory, e.id + '-' + row.trial + '.png'));
    assert.equal(hash(b), row.renderHash);
    const image = normalize(PNG.sync.read(b)),
      edges = {};
    for (const [side, rect] of Object.entries(reference.strips))
      edges[side] = cosine(ref.sides[side].reference.edge, edge(image, rect));
    const score = scoreRegions(scan, image, e.card, e.face),
      components = compact(score);
    if (row.trial === 'current') {
      assert.equal(row.renderHash, old.nativeFaceHash);
      assert.equal(100 * score.structuralScore, old.score100);
      assert.deepEqual(components, old.components);
    }
    for (const [k, c] of Object.entries(components)) {
      const prev = old.components[k];
      assert.deepEqual(
        [c.eligible, c.applicable, c.status, c.weight],
        [prev.eligible, prev.applicable, prev.status, prev.weight],
      );
    }
    rows.push({
      ...row,
      edges,
      score100: 100 * score.structuralScore,
      delta100: 100 * score.structuralScore - old.score100,
      coverage: score.coverage,
      components,
    });
  }
  console.log(e.set, e.name);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summaries = Object.fromEntries(
  capture.trials.map((t) => {
    const r = rows.filter((r) => r.trial === t.id),
      delta = r.map((r) => r.delta100);
    return [
      t.id,
      {
        fullMean100: mean(r.map((r) => r.score100)),
        fullDelta100: mean(delta),
        gains: delta.filter((v) => v > 0.5).length,
        regressions: delta.filter((v) => v < -0.5).length,
        worstDelta100: Math.min(...delta),
        edgeMean100: Object.fromEntries(
          ['outer', 'art', 'paper'].map((g, i) => [
            g,
            mean(
              r.flatMap((r) =>
                Object.entries(r.edges)
                  .filter(([k]) =>
                    i === 0 ? !k.startsWith('art') && !k.startsWith('paper') : k.startsWith(g),
                  )
                  .map(([, v]) => v),
              ),
            ),
          ]),
        ),
        paperBottom100: mean(r.map((r) => r.edges.paperBottom)),
      },
    ];
  }),
);
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const value = {
  schema: 1,
  status: 'native-paper-pinline-trials-not-adopted',
  scope:
    'Nineteen fixed-pose Original references and actual native faces. RGB-gradient profile overlap measures paper geometry independently from whole-card scores. Current scores reproduce exactly; metric eligibility is unchanged. All candidates use the same physical line widths and source palette. A numerical mean gain alone cannot approve a new border treatment.',
  source: {
    captureHash: hash(cb),
    inputHash: hash(ib),
    referenceReportHash: hash(rb),
    currentSummaryHash: hash(currentBytes),
    metricGraph: graph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary: summaries,
  capture,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(value) + '\n'), { mtime: 0 }));
console.log(JSON.stringify(summaries));
