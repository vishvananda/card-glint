// Update scores only when a native raster changed, preserving metric and scan identity.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { abuPaperDelta } from './abu-paper-ancestry.mjs';
const [nativeDir, inputFile, metricFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-paper-score.mjs NATIVE INPUTS METRIC OUTPUT_GZ');
const p = await abuPaperDelta(),
  base = 'games/magic/fixtures/accuracy/early-through-fourth/';
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const oldZip = await readFile(base + 'abu-raster-current-scores.json.gz'),
  old = JSON.parse(gunzipSync(oldZip));
const nb = await readFile(path.join(nativeDir, 'proof.json')),
  n = JSON.parse(nb);
assert.equal(hash(nb), p.native.contentSha256);
assert.equal(old.source.rendererHash, p.beforeRenderer);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(hash(ib), n.source.inputHash);
const graph = await metricSourceGraph(metricFile);
assert.deepEqual(graph, old.source.metricGraph);
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
const colorChecks = [];
const rows = [],
  changes = [],
  footprints = [];
for (const oldRow of old.rows) {
  const e = inputs.entries.find((e) => e.id === oldRow.id),
    r = n.rows.find((r) => r.id === oldRow.id);
  assert(e && r);
  assert.equal(r.referenceHash, oldRow.referenceHash);
  assert.equal(r.poseHash, oldRow.poseHash);
  assert.equal(r.inputHash, oldRow.inputHash);
  const faceHash = r.original.hashes['after-face'];
  if (oldRow.nativeFaceHash === faceHash) {
    rows.push({ ...oldRow, nativeFaceHash: faceHash });
    continue;
  }
  assert(r.affected, 'Unrelated native face changed');
  const rawScan = await readFile(objectFile(e.reference));
  assert.equal(hash(rawScan), r.referenceHash);
  const scan = normalize(PNG.sync.read(rawScan), e.pose.transform),
    scores = {},
    images = {};
  for (const version of ['before', 'after']) {
    const bytes = await readFile(
      path.join(nativeDir, e.id + '-original-original-' + version + '-face.png'),
    );
    assert.equal(hash(bytes), r.original.hashes[version + '-face']);
    images[version] = PNG.sync.read(bytes);
    scores[version] = compact(scoreRegions(scan, normalize(images[version]), e.card, e.face));
  }
  assert.equal(r.original.hashes['before-face'], oldRow.nativeFaceHash);
  assert.deepEqual(
    scores.before,
    { score100: oldRow.score100, coverage: oldRow.coverage, components: oldRow.components },
    'Previous score must reproduce',
  );
  const referenceColor = sampleColor(scan, [[78, 434, 328, 140]], { paper: true, tileSize: 10 });
  const color = {};
  for (const version of ['before', 'after']) {
    const sampled = sampleColor(normalize(images[version]), [[78, 434, 328, 140]], {
      paper: true,
      tileSize: 10,
    });
    color[version] = {
      rgb: sampled.rgb,
      spread: sampled.spread,
      deltaE: delta(sampled.rgb, referenceColor.rgb),
    };
  }
  colorChecks.push({
    id: e.id,
    set: e.set,
    name: e.name,
    referenceRgb: referenceColor.rgb,
    ...color,
    regression: color.after.deltaE - color.before.deltaE,
  });
  let changed = 0,
    outsidePaper = 0;
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];
  const before = images.before,
    after = images.after;
  for (let y = 0; y < before.height; y++)
    for (let x = 0; x < before.width; x++) {
      const i = (y * before.width + x) * 4;
      assert.equal(before.data[i + 3], after.data[i + 3]);
      if (![0, 1, 2].some((k) => before.data[i + k] !== after.data[i + k])) continue;
      changed++;
      bounds[0] = Math.min(bounds[0], x);
      bounds[1] = Math.min(bounds[1], y);
      bounds[2] = Math.max(bounds[2], x);
      bounds[3] = Math.max(bounds[3], y);
      // Both material selectors are outside the artwork and lettering.
      if (x < 80 || x > 660 || y < 600 || y > 930) outsidePaper++;
    }
  assert.equal(outsidePaper, 0, 'Paper reflow must not change pixels outside its declared panel');
  footprints.push({ id: e.id, name: e.name, set: e.set, changed, bounds, outsidePaper });
  changes.push({
    id: e.id,
    name: e.name,
    set: e.set,
    beforeFaceHash: oldRow.nativeFaceHash,
    afterFaceHash: faceHash,
    scores,
    delta: scores.after.score100 - scores.before.score100,
  });
  rows.push({ ...oldRow, ...scores.after, nativeFaceHash: faceHash });
}
assert.equal(rows.length, 899);
assert.deepEqual(await metricSourceGraph(metricFile), graph);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((set) => {
    const rr = rows.filter((r) => r.set === set),
      previous = old.rows.filter((r) => r.set === set);
    return [
      set,
      {
        nativeFaces: rr.length,
        scored: rr.length,
        mean100: mean(rr.map((r) => r.score100)),
        before100: mean(previous.map((r) => r.score100)),
        changedFaces: changes.filter((r) => r.set === set).length,
      },
    ];
  }),
);
const result = {
  schema: 1,
  status: 'complete-current-abu-paper-score-summary',
  scope:
    'All899 reviewed Original faces. Only19 shared paper panels are rescored using identical references, poses, semantic inputs, metric graph and component weights;880 other scores reuse exact native identities. Source palette and HSB parameters stay fixed; a fresh eroded paper-color sample tests existing tolerances. Savannah remains a retained regression. Scan-position proposals are not adopted and geometry/text/texture residuals remain explicit. Indices are out of100.',
  source: {
    colorMethod: Object.fromEntries(
      await Promise.all(
        ['hsb-color.mjs', 'pixels-pure.mjs'].map(async (name) => [
          'games/magic/tools/accuracy/' + name,
          hash(await readFile(new URL('./' + name, import.meta.url))),
        ]),
      ),
    ),
    rendererHash: p.afterRenderer,
    priorRendererHash: p.beforeRenderer,
    nativeHash: hash(nb),
    inputsHash: hash(ib),
    metricGraph: graph,
    priorSummaryHash: hash(oldZip),
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary,
  paperColorReview: {
    patches: [[78, 434, 328, 140]],
    method:
      'Existing ABU eroded paper sampler, ten-pixel tiles and local dark-ink rejection. No color parameters refitted.',
    thresholds: { medianRegression: 0.25, individualRegression: 2 },
    medianBefore: median(colorChecks.map((r) => r.before.deltaE)),
    medianAfter: median(colorChecks.map((r) => r.after.deltaE)),
    worstRegression: Math.max(...colorChecks.map((r) => r.regression)),
    currentPigmentsSupported:
      median(colorChecks.map((r) => r.after.deltaE)) <=
        median(colorChecks.map((r) => r.before.deltaE)) + 0.25 &&
      colorChecks.every((r) => r.regression <= 2),
    rows: colorChecks,
  },
  recomputedPrintings: changes.length,
  reusedPrintings: 899 - changes.length,
  changes,
  footprints,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(
  JSON.stringify({
    summary,
    paperColor: result.paperColorReview,
    recomputed: changes.length,
    reused: 899 - changes.length,
    worstDelta: Math.min(...changes.map((r) => r.delta)),
    bestDelta: Math.max(...changes.map((r) => r.delta)),
  }),
);
