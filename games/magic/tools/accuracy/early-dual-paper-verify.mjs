import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize } from './pixels-pure.mjs';
import { createDualPaperSampler } from './early-dual-paper-samples.mjs';
import { delta, median } from './hsb-color.mjs';
import { hash, writeJson } from './common.mjs';
const [nativeDirectory, sourceDirectory, fitFile, replayDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-dual-paper-verify.mjs NATIVE CLEAN_SOURCE FIT REPLAY OUTPUT');
const read = async (f) => {
  const bytes = await readFile(f);
  return { bytes, data: JSON.parse(bytes) };
};
const native = await read(path.join(nativeDirectory, 'capture.json')),
  source = await read(path.join(sourceDirectory, 'capture.json')),
  fit = await read(fitFile),
  replay = await read(path.join(replayDirectory, 'capture.json')),
  definition = await read(path.join(replayDirectory, 'definition.json'));
for (const value of [source.data, fit.data, replay.data.source]) {
  assert.equal(value.rendererHash, native.data.source.rendererHash);
  assert.equal(value.nativeCaptureHash, hash(native.bytes));
}
assert.equal(replay.data.source.definitionHash, hash(definition.bytes));
assert.equal(replay.data.rows.length, 10);
assert.equal(fit.data.rows.length, 20);
const maskBytes = await readFile(path.join(sourceDirectory, 'stripe-mask.png'));
assert.equal(hash(maskBytes), fit.data.maskHash);
const sample = createDualPaperSampler(normalize(PNG.sync.read(maskBytes)), fit.data);
const proposed = definition.data.trials.find((t) => t.id === 'shared-paper').materials.L;
for (const g of fit.data.groups) {
  const entries = Object.entries(proposed.pigments).filter(([url]) =>
    url.endsWith('/' + g.color.toLowerCase() + 'l.png'),
  );
  assert.equal(entries.length, 1);
  assert.deepEqual(entries[0][1].paper, g.fit.adjustment);
}
const rows = [],
  isolation = [];
for (const r of replay.data.rows) {
  const s = source.data.rows.find((x) => x.id === r.id),
    n = native.data.rows.find((x) => x.id === r.id);
  assert(s && n && r.baselineParity);
  for (const key of ['referenceHash', 'poseHash']) assert.equal(r[key], s[key]);
  assert.equal(
    r.trials['shared-paper'].appliedMaterialHash,
    hash(JSON.stringify(proposed.pigments)),
  );
  const paths = [
    path.join(nativeDirectory, '2ed', r.id + '-scan.png'),
    path.join(replayDirectory, 'shared-geometry', r.id + '.png'),
    path.join(replayDirectory, 'shared-paper', r.id + '.png'),
  ];
  const bytes = await Promise.all(paths.map((f) => readFile(f)));
  for (const [i, h] of [
    [0, s.scanHash],
    [1, r.trials['shared-geometry'].faceHash],
    [2, r.trials['shared-paper'].faceHash],
  ])
    assert.equal(hash(bytes[i]), h);
  const full = bytes.map((b) => PNG.sync.read(b)),
    images = full.map((im) => normalize(im));
  let alphaChanged = 0,
    upperCardChanged = 0,
    changed = 0;
  for (let y = 0; y < 1020; y++)
    for (let x = 0; x < 732; x++) {
      const i = (y * 732 + x) * 4;
      if (full[1].data[i + 3] !== full[2].data[i + 3]) alphaChanged++;
      const diff = [0, 1, 2, 3].some((k) => full[1].data[i + k] !== full[2].data[i + k]);
      if (diff) {
        changed++;
        if (y < 590) upperCardChanged++;
      }
    }
  assert.equal(alphaChanged, 0);
  assert.equal(upperCardChanged, 0);
  assert(changed > 0);
  assert.equal(r.trials['shared-geometry'].etchingHash, r.trials['shared-paper'].etchingHash);
  isolation.push({
    id: r.id,
    name: r.name,
    alphaChanged,
    upperCardChanged,
    changed,
    etchingChanged: false,
  });
  for (const [label, url] of [s.plan.base, s.plan.overlay].entries()) {
    const color = url.match(/\/([wubrg])l\.png$/)[1].toUpperCase();
    const [reference, before, after] = images.map((im) => sample(im, label));
    const predicted = fit.data.groups
      .find((g) => g.color === color)
      .scores.find((x) => x.id === r.id);
    rows.push({
      id: r.id,
      name: r.name,
      color,
      before: delta(before.rgb, reference.rgb),
      after: delta(after.rgb, reference.rgb),
      predictedAfter: predicted.after,
      predictionError: Math.abs(delta(after.rgb, reference.rgb) - predicted.after),
      beforeRgb: before.rgb,
      afterRgb: after.rgb,
      referenceRgb: reference.rgb,
      sourceTiles: before.tiles.length,
      referenceTiles: reference.tiles.length,
      rejectedFraction: reference.rejectedFraction,
    });
  }
}
const groups = [...'WUBRG'].map((color) => {
  const r = rows.filter((x) => x.color === color);
  assert.equal(r.length, 4);
  return {
    color,
    count: 4,
    beforeMedian: median(r.map((x) => x.before)),
    afterMedian: median(r.map((x) => x.after)),
    improved: r.filter((x) => x.after < x.before).length,
    worstRegression: Math.max(0, ...r.map((x) => x.after - x.before)),
    maxPredictionError: Math.max(...r.map((x) => x.predictionError)),
  };
});
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'shared-dual-paper-native-verified-with-outliers-not-adopted',
  scope:
    'Actual native full-card Original replay for all ten Unlimited duals. Five shared source-paper HSB values use the production cached material preparation before composition. Exact prior control PNGs, original wording and fixed scan poses are retained. Source alpha classifies stripe colors; three-pixel erosion and symmetric dark-ink rejection protect color measurements. Alpha, the upper 590 native pixel rows and default etching are unchanged between the shared geometry and paper trials. Every color residual remains reported. These development observations do not complete pinline/outline palettes, brown texture blackpoint or whole-card/profile validation.',
  nativeCaptureHash: hash(native.bytes),
  sourceCaptureHash: hash(source.bytes),
  fitHash: hash(fit.bytes),
  replayHash: hash(replay.bytes),
  definitionHash: hash(definition.bytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    ['early-dual-paper-samples.mjs', 'pixels-pure.mjs', 'hsb-color.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  groups,
  isolation,
  rows,
});
console.log(
  JSON.stringify({
    groups,
    total: rows.length,
    improved: rows.filter((r) => r.after < r.before).length,
    regressed: rows.filter((r) => r.after > r.before).length,
  }),
);
