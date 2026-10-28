// Shared pigment proposals from native source controls and frozen scan cohorts.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { hash, root, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, fitHsb, evaluateHsb, center } from './hsb-color.mjs';
const [exportedDirectory, nativeDirectory, out] = process.argv.slice(2);
assert(out, 'Use EXPORTED_DIRECTORY NATIVE_DIRECTORY NEW_OUTPUT');
await fs.access(out).then(
  () => {
    throw Error('Output exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const eb = await fs.readFile(path.join(exportedDirectory, 'inputs.json')),
  data = JSON.parse(eb);
const nb = await fs.readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nb);
assert(native.complete && !native.faults.length);
assert.equal(native.source.exportedHash, hash(eb));
const windows = {
  frame: [
    [34, 110, 10, 50],
    [34, 210, 10, 50],
    [34, 310, 10, 40],
    [444, 110, 10, 50],
    [444, 210, 10, 50],
    [444, 310, 10, 40],
  ],
  paper: [[80, 435, 328, 140]],
  stock: [
    [6, 140, 5, 100],
    [477, 140, 5, 100],
    [130, 668, 100, 5],
  ],
};
const sample = (image) =>
  Object.fromEntries(
    Object.entries(windows).map(([key, boxes]) => [
      key,
      sampleColor(image, boxes, { tileSize: key === 'stock' ? 5 : 10, paper: key === 'paper' }),
    ]),
  );
const refs = new Map();
for (const r of data.rows.filter((r) => r.accepted)) {
  const b = await fs.readFile(path.join(exportedDirectory, r.id + '.png'));
  assert.equal(hash(b), r.normalizedHash);
  refs.set(r.id, sample(PNG.sync.read(b)));
}
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
const results = [];
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const model = {
    hueDegrees: [-180, 180],
    saturationScale: [0.05, 3],
    brightnessScale: [0.3, 2],
    neutralSaturation: 0.02,
  };
  for (const key of new Set(native.rows.map((r) => r.key))) {
    const group = data.rows.filter((r) => r.accepted && r.key === key);
    const training = group.filter((r) => r.cohort === 'calibration');
    const developmentOnly = training.length < 3;
    const fitRows = developmentOnly ? group : training;
    for (const family of new Set(native.rows.filter((r) => r.key === key).map((r) => r.family))) {
      const controls = native.rows.filter((r) => r.key === key && r.family === family);
      const control = controls.find((r) => r.cohort === 'calibration') ?? controls[0];
      const b = await fs.readFile(path.join(nativeDirectory, control.file));
      assert.equal(hash(b), control.sha256);
      const src = sample(normalize(PNG.sync.read(b))),
        parts = {};
      for (const part of ['frame', 'paper']) {
        const fit = fitHsb(
          src[part],
          fitRows.map((r) => refs.get(r.id)[part]),
          model,
          math,
        );
        const evaluation = group.map((r) => ({
          id: r.id,
          cohort: r.cohort,
          ...evaluateHsb(src[part], refs.get(r.id)[part], fit.adjustment, math),
        }));
        const summary = {};
        for (const cohort of ['calibration', 'validation', 'development']) {
          const rr = evaluation.filter((r) => r.cohort === cohort),
            mean = (key) => (rr.length ? rr.reduce((s, r) => s + r[key], 0) / rr.length : null);
          summary[cohort] = {
            count: rr.length,
            before: mean('before'),
            after: mean('after'),
            clipping: mean('clipping'),
            sourceSpread: src[part].spread,
            afterSpread: mean('afterSpread'),
            referenceSpread: mean('referenceSpread'),
          };
        }
        parts[part] = { ...fit, summary };
      }
      results.push({
        key,
        family,
        developmentOnly,
        profileHash: control.profileHash,
        sourceControl: control.id,
        parts,
      });
      console.log(
        data.set,
        key,
        family,
        JSON.stringify(Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, v.summary]))),
      );
    }
  }
  const train = data.rows.filter((r) => r.accepted && r.cohort === 'calibration');
  const stock = center(train.map((r) => refs.get(r.id).stock.rgb));
  await writeJson(out, {
    schema: 1,
    status: 'pigment-proposals-not-adopted',
    set: data.set,
    source: {
      exportedHash: hash(eb),
      nativeHash: hash(nb),
      toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    },
    windows,
    model,
    stock,
    scope:
      'Calibration names only select shared per-material/family HSB. Frozen validation names remain separate. Native neutral-color controls include the production art cutout and paper/bevel repairs. Tile medians reject dark lettering; results are pigment diagnostics, not full-card or contrast certification. Paper masks and native replay are required before adopting independent frame/paper adjustments.',
    results,
  });
} finally {
  await server.close();
}
