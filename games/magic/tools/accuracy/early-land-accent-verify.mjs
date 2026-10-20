// Verify source-local outline color changes from actual native painter outputs.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';
const [nativeDirectory, colorDirectory, accentDirectory, output] = process.argv.slice(2);
assert(
  output,
  'Usage: early-land-accent-verify.mjs NATIVE COLOR_DIRECTORY ACCENT_DIRECTORY OUTPUT',
);
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const base = await read(path.join(nativeDirectory, 'capture.json')),
  fit = await read(path.join(accentDirectory, 'fit.json'));
assert.equal(fit.data.nativeCaptureHash, hash(base.bytes));
for (const [file, digest] of fit.data.dependencies)
  assert.equal(hash(await readFile(new URL(file, import.meta.url))), digest);
assert.equal(
  fit.data.toolHash,
  hash(await readFile(new URL('./early-land-accent-fit.mjs', import.meta.url))),
);
const all = [];
for (const o of fit.data.observations) {
  const capture = await read(path.join(accentDirectory, o.key + '-native/capture.json'));
  const parent = await read(path.join(colorDirectory, o.key + '-native/capture.json'));
  const definition = await read(path.join(accentDirectory, o.key + '-definition.json'));
  assert.equal(hash(parent.bytes), o.captureHash);
  assert.equal(capture.data.source.nativeCaptureHash, hash(base.bytes));
  assert.equal(capture.data.source.rendererHash, base.data.source.rendererHash);
  assert.equal(capture.data.source.definitionHash, hash(definition.bytes));
  for (const [file, key] of [
    ['early-frame-trial-replay.mjs', 'toolHash'],
    ['early-frame-trial-plugin.mjs', 'pluginHash'],
    ['early-color-trial-plugin.mjs', 'colorPluginHash'],
  ])
    assert.equal(capture.data.source[key], hash(await readFile(new URL(file, import.meta.url))));
  const material = definition.data.trials.find((t) => t.id === 'land-accents').materials.L;
  const frame = material.frame;
  for (const r of capture.data.rows) {
    const prior = parent.data.rows.find((x) => x.id === r.id),
      b = base.data.rows.find((x) => x.id === r.id);
    for (const k of ['referenceHash', 'poseHash']) assert.equal(r[k], b[k]);
    assert.equal(r.trials['land-color'].faceHash, prior.trials['land-color'].faceHash);
    for (const t of Object.values(r.trials))
      assert.equal(t.etchingHash, r.trials.current.etchingHash);
    for (const trial of ['current', 'land-color', 'land-accents']) {
      const etching = await readFile(
        path.join(accentDirectory, o.key + '-native', trial, r.id + '-etching.png'),
      );
      assert.equal(hash(etching), r.trials[trial].etchingHash);
    }
    const bytes = await Promise.all(
      [
        path.join(accentDirectory, o.key + '-native/land-color', r.id + '.png'),
        path.join(accentDirectory, o.key + '-native/land-accents', r.id + '.png'),
        path.join(nativeDirectory, '2ed', r.id + '-scan.png'),
      ].map((f) => readFile(f)),
    );
    for (const [i, d] of [
      [0, r.trials['land-color'].faceHash],
      [1, r.trials['land-accents'].faceHash],
      [2, b.scanHash],
    ])
      assert.equal(hash(bytes[i]), d);
    const [before, after, scan] = bytes.map((b) => PNG.sync.read(b));
    for (const im of [before, after, scan]) assert.deepEqual([im.width, im.height], [732, 1020]);
    let changed = 0,
      outside = 0,
      alphaChanged = 0,
      artChanged = 0,
      paperChanged = 0;
    const mx = 2 / (732 * frame[2]),
      my = 2 / (1020 * frame[3]);
    const inside = (r, x, y) => x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];
    for (let p = 0; p < 732 * 1020; p++) {
      const at = p * 4,
        x = p % 732,
        y = Math.floor(p / 732);
      if (before.data[at + 3] !== after.data[at + 3]) alphaChanged++;
      if (![0, 1, 2, 3].some((c) => before.data[at + c] !== after.data[at + c])) continue;
      changed++;
      const sx = ((x + 0.5) / 732 - frame[0]) / frame[2],
        sy = ((y + 0.5) / 1020 - frame[1]) / frame[3];
      const inRing = fit.data.rings.some(
        (r) =>
          inside(
            [r.outer[0] - mx, r.outer[1] - my, r.outer[2] + 2 * mx, r.outer[3] + 2 * my],
            sx,
            sy,
          ) &&
          !inside(
            [r.inner[0] + mx, r.inner[1] + my, r.inner[2] - 2 * mx, r.inner[3] - 2 * my],
            sx,
            sy,
          ),
      );
      if (!inRing) outside++;
      if (inside([72 * 1.5, 90 * 1.5, 340 * 1.5, 265 * 1.5], x, y)) artChanged++;
      if (inside([76 * 1.5, 435 * 1.5, 330 * 1.5, 140 * 1.5], x, y)) paperChanged++;
    }
    for (const [key, value] of Object.entries({ outside, alphaChanged, artChanged, paperChanged }))
      assert.equal(value, 0, r.name + ' ' + key);
    assert(changed > 0);
    const colors = [before, after, scan].map((im) => sampleColor(im, o.patches, { tileSize: 24 }));
    const prediction = o.evaluated.find((e) => e.id === r.id);
    all.push({
      key: o.key,
      id: r.id,
      name: r.name,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
      faceHashes: bytes.slice(0, 2).map(hash),
      etchingHash: r.trials['land-accents'].etchingHash,
      captureHash: hash(capture.bytes),
      definitionHash: hash(definition.bytes),
      changed,
      outside,
      alphaChanged,
      artChanged,
      paperChanged,
      beforeDeltaE: delta(colors[0].rgb, colors[2].rgb),
      afterDeltaE: delta(colors[1].rgb, colors[2].rgb),
      predictedDeltaE: prediction.after,
      predictionError: Math.abs(delta(colors[1].rgb, colors[2].rgb) - prediction.after),
      colors: colors.map((c) => c.rgb),
    });
  }
}
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const groups = Object.fromEntries(
  [...new Set(all.map((r) => r.key))].map((k) => {
    const rr = all.filter((r) => r.key === k);
    return [
      k,
      {
        count: rr.length,
        beforeMedianDeltaE: median(rr.map((r) => r.beforeDeltaE)),
        afterMedianDeltaE: median(rr.map((r) => r.afterDeltaE)),
        beforeMeanDeltaE: mean(rr.map((r) => r.beforeDeltaE)),
        afterMeanDeltaE: mean(rr.map((r) => r.afterDeltaE)),
        improved: rr.filter((r) => r.afterDeltaE < r.beforeDeltaE).length,
        worstRegression: Math.max(0, ...rr.map((r) => r.afterDeltaE - r.beforeDeltaE)),
        maxPredictionError: Math.max(...rr.map((r) => r.predictionError)),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'native-basic-land-outline-candidate-verified-not-adopted',
  scope:
    'Fifteen actual native faces, three illustrations per color. Compared with the same color/geometry painter before adding source-local colored outlines. Every changed pixel is in a shared source ring with a two-native-pixel resampling footprint. Art core, paper/rules core, face alpha and default etching remain unchanged. Color errors and illustration residuals remain explicit; no independent-name or complete-set certification.',
  rendererHash: base.data.source.rendererHash,
  nativeCaptureHash: hash(base.bytes),
  fitHash: hash(fit.bytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    [
      'hsb-color.mjs',
      '../../src/presentation/frame-accent-mask.ts',
      '../../src/presentation/frame-hsb.ts',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  groups,
  rows: all,
});
console.log(JSON.stringify(groups));
