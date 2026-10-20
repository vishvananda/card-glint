// Verify source-material candidates through the native painter, not an RGB filter.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';

const [nativeDirectory, geometryDirectory, colorDirectory, output] = process.argv.slice(2);
assert(
  output,
  'Usage: early-land-color-verify.mjs NATIVE_CAPTURE BASIC_GEOMETRY_DIRECTORY COLOR_DIRECTORY OUTPUT',
);
const keys = ['WL', 'UL', 'BL', 'RL', 'GL'];
const read = async (file) => {
  const raw = await readFile(file);
  return { raw, data: JSON.parse(raw) };
};
const native = await read(path.join(nativeDirectory, 'capture.json'));
const fit = await read(path.join(colorDirectory, 'fit.json'));
assert.equal(fit.data.nativeCaptureHash, hash(native.raw));
assert.equal(fit.data.rendererHash, native.data.source.rendererHash);
const rows = [],
  sources = {};
for (const key of keys) {
  const geometry = await read(path.join(geometryDirectory, key + '-native/capture.json'));
  const color = await read(path.join(colorDirectory, key + '-native/capture.json'));
  const definition = await read(path.join(colorDirectory, key + '-definition.json'));
  const audit = await read(path.join(colorDirectory, key + '-audit.json'));
  const observation = fit.data.observations.find((o) => o.key === key);
  assert.equal(hash(audit.raw), observation.auditHash);
  assert.equal(hash(definition.raw), color.data.source.definitionHash);
  assert.equal(color.data.rows.length, 3);
  assert.equal(geometry.data.rows.length, 3);
  for (const report of [geometry, color]) {
    assert.equal(report.data.source.nativeCaptureHash, hash(native.raw));
    assert.equal(report.data.source.rendererHash, native.data.source.rendererHash);
  }
  for (const [field, file] of [
    ['toolHash', 'early-frame-trial-replay.mjs'],
    ['colorPluginHash', 'early-color-trial-plugin.mjs'],
  ])
    assert.equal(color.data.source[field], hash(await readFile(new URL(file, import.meta.url))));
  assert.deepEqual(
    definition.data.trials[1].materials.L.pigment,
    fit.data.materials[key] && {
      asset: fit.data.materials[key].asset,
      adjustment: fit.data.materials[key].adjustment,
    },
  );
  sources[key] = {
    geometryCapture: hash(geometry.raw),
    colorCapture: hash(color.raw),
    definition: hash(definition.raw),
    audit: hash(audit.raw),
  };
  for (const r of color.data.rows) {
    const g = geometry.data.rows.find((g) => g.id === r.id);
    const n = native.data.rows.find((n) => n.id === r.id);
    const a = audit.data.rows.find((a) => a.id === r.id);
    assert(g && n && a && r.baselineParity && g.baselineParity);
    for (const value of [g, n, a])
      for (const field of ['referenceHash', 'poseHash']) assert.equal(r[field], value[field]);
    assert.equal(r.trials.current.faceHash, n.renderHash);
    assert.equal(r.trials['shared-search'].faceHash, g.trials['shared-search'].faceHash);
    assert.equal(a.renderHash, r.trials['shared-search'].faceHash);
    const before = r.trials['shared-search'],
      after = r.trials['land-color'];
    assert.equal(before.etchingHash, after.etchingHash);
    assert.equal(
      after.appliedMaterialHash,
      hash(JSON.stringify(fit.data.materials[key].adjustment)),
    );
    const raw = await Promise.all(
      ['shared-search', 'land-color'].map((t) =>
        readFile(path.join(colorDirectory, key + '-native', t, r.id + '.png')),
      ),
    );
    const images = raw.map((bytes, i) => {
      assert.equal(hash(bytes), i ? after.faceHash : before.faceHash);
      return PNG.sync.read(bytes);
    });
    for (const image of images) assert.deepEqual([image.width, image.height], [732, 1020]);
    let alphaChanged = 0,
      artCoreChanged = 0;
    for (let p = 0; p < 732 * 1020; p++) {
      const i = p * 4,
        x = p % 732,
        y = Math.floor(p / 732);
      if (images[0].data[i + 3] !== images[1].data[i + 3]) alphaChanged++;
      if (
        x >= 105 &&
        x < 622 &&
        y >= 128 &&
        y < 532 &&
        [0, 1, 2, 3].some((k) => images[0].data[i + k] !== images[1].data[i + k])
      )
        artCoreChanged++;
    }
    assert.equal(alphaChanged, 0, r.name + ' silhouette changed');
    assert.equal(artCoreChanged, 0, r.name + ' art changed');
    for (const [trial, expected] of [
      ['shared-search', before],
      ['land-color', after],
    ])
      assert.equal(
        hash(
          await readFile(path.join(colorDirectory, key + '-native', trial, r.id + '-etching.png')),
        ),
        expected.etchingHash,
      );
    const scanBytes = await readFile(path.join(nativeDirectory, '2ed', r.id + '-scan.png'));
    assert.equal(hash(scanBytes), n.scanHash);
    const render = images.map(normalize),
      reference = normalize(PNG.sync.read(scanBytes));
    const components = Object.fromEntries(
      Object.entries(audit.data.patches).map(([component, patches]) => {
        const options = { paper: component === 'paper', tileSize: component === 'stock' ? 5 : 10 };
        const ref = sampleColor(reference, patches, options),
          rgb = render.map((image) => sampleColor(image, patches, options).rgb);
        const values = rgb.map((value) => delta(value, ref.rgb));
        assert(Math.abs(values[0] - a.components[component].deltaE) < 1e-10);
        const prediction = observation.diagnostics[component]?.rows.find(
          (q) => q.id === r.id,
        )?.after;
        if (component === 'stock') assert.deepEqual(rgb[0], rgb[1], 'White stock changed');
        return [
          component,
          {
            before: values[0],
            after: values[1],
            delta: values[1] - values[0],
            beforeRgb: rgb[0],
            afterRgb: rgb[1],
            referenceRgb: ref.rgb,
            ...(prediction === undefined
              ? {}
              : { prediction, predictionError: Math.abs(values[1] - prediction) }),
          },
        ];
      }),
    );
    rows.push({
      key,
      id: r.id,
      name: r.name,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
      beforeFaceHash: before.faceHash,
      afterFaceHash: after.faceHash,
      alphaChanged,
      artCoreChanged,
      components,
    });
  }
}
const groups = Object.fromEntries(
  keys.map((key) => [
    key,
    Object.fromEntries(
      ['frame', 'paper'].map((component) => {
        const all = rows.filter((r) => r.key === key).map((r) => r.components[component]);
        return [
          component,
          {
            count: all.length,
            before: median(all.map((r) => r.before)),
            after: median(all.map((r) => r.after)),
            improved: all.filter((r) => r.delta < 0).length,
            worstRegression: Math.max(...all.map((r) => r.delta)),
            maximumPredictionError: Math.max(...all.map((r) => r.predictionError)),
          },
        ];
      }),
    ),
  ]),
);
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'native-development-land-color-candidates-not-runtime-adopted',
  scope:
    'Fifteen original basic land printings with their fixed independent scan poses and verified shared per-color geometry. Shared brown-frame adjustment, separate paper adjustments. Three illustrations per name are development evidence, not independent-name validation. Actual cached-source materials match the predictions. Every art-core, white-stock and face-alpha check passes; empty etching hashes match. Disconnected colored rim accents, source contrast and derived dual-land pinline colors remain open. Individual scan-palette outliers are retained; no per-scan color fit or full-card certification.',
  rendererHash: fit.data.rendererHash,
  nativeCaptureHash: hash(native.raw),
  fitHash: hash(fit.raw),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    ['pixels-pure.mjs', 'hsb-color.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  sources,
  total: rows.length,
  alphaChanged: 0,
  artCoreChanged: 0,
  groups,
  rows,
});
console.log(JSON.stringify({ total: rows.length, alphaChanged: 0, artCoreChanged: 0, groups }));
