// Fit shared colored land outlines independently of the brown plate.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { root, hash, writeJson } from './common.mjs';
import { sampleColor, center, fitHsb, evaluateHsb, median } from './hsb-color.mjs';
const [nativeDirectory, colorDirectory, out] = process.argv.slice(2);
assert(out, 'Usage: early-land-accent-fit.mjs NATIVE COLOR_DIRECTORY OUTPUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { data: JSON.parse(bytes), bytes };
};
const base = await read(path.join(nativeDirectory, 'capture.json'));
const keys = ['WL', 'UL', 'BL', 'RL', 'GL'];
// Source-space bounds measured on the shared ABU plate, not moved per scan.
const ring = ([l, t, r, b], [il, it, ir, ib]) => ({
  outer: [l / 1500, t / 2100, (r - l) / 1500, (b - t) / 2100],
  inner: [il / 1500, it / 2100, (ir - il) / 1500, (ib - it) / 2100],
});
const rings = [
  ring([83, 96, 1418, 2008], [99, 110, 1400, 1993]),
  ring([143, 191, 1359, 1183], [162, 208, 1340, 1164]),
  ring([187, 1254, 1319, 1868], [208, 1279, 1296, 1843]),
];
const segments = [
  [197, 1320, 197, 1780],
  [1306, 1320, 1306, 1780],
  [300, 1268, 1200, 1268],
  [300, 1855, 1200, 1855],
];
const projected = (frame) =>
  segments.map(([x, y, xx, yy]) => {
    const px = (v) => 732 * (frame[0] + (frame[2] * v) / 1500),
      py = (v) => 1020 * (frame[1] + (frame[3] * v) / 2100);
    return x === xx
      ? [Math.round(px(x)) - 1, Math.ceil(py(y)), 3, Math.floor(py(yy)) - Math.ceil(py(y))]
      : [Math.ceil(px(x)), Math.round(py(y)) - 1, Math.floor(px(xx)) - Math.ceil(px(x)), 3];
  });
const model = {
  neutralSaturation: 0.15,
  hueDegrees: [-70, 70],
  saturationScale: [0, 2],
  brightnessScale: [0.6, 1.6],
};
const server = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true, entries: [] },
  server: { middlewareMode: true, hmr: false },
});
const observations = [];
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  await mkdir(out, { recursive: true });
  for (const key of keys) {
    const def = await read(path.join(colorDirectory, key + '-definition.json'));
    const capture = await read(path.join(colorDirectory, key + '-native/capture.json'));
    assert.equal(capture.data.source.nativeCaptureHash, hash(base.bytes));
    const material = def.data.trials.find((t) => t.id === 'land-color').materials.L;
    const patches = projected(material.frame),
      rows = [];
    for (const r of capture.data.rows) {
      const b = base.data.rows.find((b) => b.id === r.id);
      assert(b);
      for (const k of ['referenceHash', 'poseHash']) assert.equal(r[k], b[k]);
      const files = [
        path.join(colorDirectory, key + '-native/shared-search', r.id + '.png'),
        path.join(colorDirectory, key + '-native/land-color', r.id + '.png'),
        path.join(nativeDirectory, '2ed', r.id + '-scan.png'),
      ];
      const bytes = await Promise.all(files.map((f) => readFile(f)));
      for (const [i, digest] of [
        [0, r.trials['shared-search'].faceHash],
        [1, r.trials['land-color'].faceHash],
        [2, b.scanHash],
      ])
        assert.equal(hash(bytes[i]), digest);
      const samples = bytes.map((b) => {
        const im = PNG.sync.read(b);
        assert.deepEqual([im.width, im.height], [732, 1020]);
        return sampleColor(im, patches, { tileSize: 24 });
      });
      rows.push({
        id: r.id,
        name: r.name,
        referenceHash: r.referenceHash,
        poseHash: r.poseHash,
        renderHashes: bytes.map(hash),
        source: samples[0],
        current: samples[1],
        reference: samples[2],
      });
    }
    const source = {
      rgb: center(rows.map((r) => r.source.rgb)),
      tiles: rows.flatMap((r) => r.source.tiles),
    };
    const fit = fitHsb(
      source,
      rows.map((r) => r.reference),
      model,
      math,
    );
    const mask = {
      rings,
      hueCenter: key === 'UL' ? 205 : key === 'RL' ? 350 : key === 'GL' ? 82 : 0,
      hueRadius: key === 'WL' || key === 'BL' ? 180 : 55,
      hueFeather: key === 'WL' || key === 'BL' ? 1 : 15,
      saturation: [0, 0.001],
    };
    const adjustment = {
      ...material.pigment.adjustment,
      accents: [{ mask, adjustment: fit.adjustment }],
    };
    const definition = {
      schema: 1,
      pigment: true,
      ids: def.data.ids,
      trials: [
        def.data.trials.find((t) => t.id === 'land-color'),
        {
          id: 'land-accents',
          materials: { L: { ...material, pigment: { asset: material.asset, adjustment } } },
        },
      ],
    };
    await writeJson(path.join(out, key + '-definition.json'), definition);
    const evaluated = rows.map((r) => ({
      id: r.id,
      ...evaluateHsb(r.source, r.reference, fit.adjustment, math),
      currentDelta: evaluateHsb(
        r.current,
        r.reference,
        { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
        math,
      ).before,
    }));
    observations.push({
      key,
      definitionHash: hash(def.bytes),
      captureHash: hash(capture.bytes),
      patches,
      fit,
      mask,
      rows,
      evaluated,
    });
    console.log(
      key,
      JSON.stringify({
        adjustment: fit.adjustment,
        before: median(evaluated.map((r) => r.currentDelta)),
        predicted: median(evaluated.map((r) => r.after)),
        flags: fit.flags,
      }),
    );
  }
  await writeJson(path.join(out, 'fit.json'), {
    schema: 1,
    set: '2ed',
    status: 'shared-basic-land-outline-candidate-needs-native-verification',
    scope:
      'Three illustrations of each basic. One source-local outline adjustment per color; measured from fixed projected text-outline strips. Shared bounded rings and hue weights preserve surrounding brown texture and paper. No per-scan geometry or color correction. Development fits, not independent-name validation or complete-set certification.',
    rendererHash: base.data.source.rendererHash,
    nativeCaptureHash: hash(base.bytes),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    dependencies: await Promise.all(
      ['hsb-color.mjs', '../../src/presentation/hsb.ts'].map(async (f) => [
        f,
        hash(await readFile(new URL(f, import.meta.url))),
      ]),
    ),
    rings,
    segments,
    model,
    observations,
  });
} finally {
  await server.close();
}
