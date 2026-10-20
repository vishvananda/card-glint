// Five shared paper-color candidates, using source alpha to label both stripe inks.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { createDualPaperSampler } from './early-dual-paper-samples.mjs';
import { normalize } from './pixels-pure.mjs';
import { center, median, quantile, delta, fitHsb, evaluateHsb } from './hsb-color.mjs';
import { root, hash, writeJson } from './common.mjs';
const [nativeDirectory, sourceDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-dual-paper-fit.mjs NATIVE_CAPTURE CLEAN_SOURCE_DIRECTORY OUTPUT.json');
const captureBytes = await readFile(path.join(sourceDirectory, 'capture.json')),
  capture = JSON.parse(captureBytes);
assert.equal(capture.rows.length, 10);
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes);
assert.equal(hash(nativeBytes), capture.nativeCaptureHash);
const maskBytes = await readFile(path.join(sourceDirectory, 'stripe-mask.png'));
assert(capture.rows.every((r) => r.maskHash === hash(maskBytes)));
const mask = normalize(PNG.sync.read(maskBytes));
const window = [78, 434, 328, 140],
  tileSize = 10,
  erosion = 3;
const sample = createDualPaperSampler(mask, { window, tileSize, erosion });
const rows = [];
for (const r of capture.rows) {
  const b = native.rows.find((x) => x.id === r.id);
  assert(b);
  for (const key of ['referenceHash', 'poseHash', 'scanHash']) assert.equal(r[key], b[key]);
  const sourceBytes = await readFile(path.join(sourceDirectory, r.id + '.png'));
  assert.equal(hash(sourceBytes), r.cleanHash);
  const scanBytes = await readFile(path.join(nativeDirectory, '2ed', r.id + '-scan.png'));
  assert.equal(hash(scanBytes), r.scanHash);
  const source = normalize(PNG.sync.read(sourceBytes)),
    scan = normalize(PNG.sync.read(scanBytes));
  for (const [label, url] of [r.plan.base, r.plan.overlay].entries()) {
    const color = url.match(/\/([wubrg])l\.png$/)?.[1]?.toUpperCase();
    assert(color && r.colors.includes(color));
    rows.push({
      id: r.id,
      name: r.name,
      color,
      cohort: r.cohort,
      label,
      source: sample(source, label),
      reference: sample(scan, label),
    });
  }
}
assert.equal(rows.length, 20);
const server = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const model = {
    neutralSaturation: 0.02,
    hueDegrees: [-60, 60],
    saturationScale: [0, 8],
    brightnessScale: [0.65, 1.35],
  };
  const groups = [];
  for (const color of 'WUBRG') {
    const parts = rows.filter((r) => r.color === color);
    assert.equal(parts.length, 4);
    const source = {
      rgb: center(parts.map((r) => r.source.rgb)),
      tiles: parts.flatMap((r) => r.source.tiles),
    };
    const fit = fitHsb(
      source,
      parts.map((r) => r.reference),
      model,
      math,
    );
    const scores = parts.map((r) => ({
      id: r.id,
      name: r.name,
      ...evaluateHsb(r.source, r.reference, fit.adjustment, math),
    }));
    const summary = {
      color,
      count: 4,
      beforeMedian: median(scores.map((r) => r.before)),
      afterMedian: median(scores.map((r) => r.after)),
      improved: scores.filter((r) => r.after < r.before).length,
      worstRegression: Math.max(0, ...scores.map((r) => r.after - r.before)),
      maximumClipping: Math.max(...scores.map((r) => r.clipping)),
    };
    groups.push({ ...summary, fit, scores });
    console.log(JSON.stringify(summary));
  }
  await writeJson(output, {
    schema: 1,
    set: '2ed',
    status: 'shared-dual-paper-candidates-needs-native-replay',
    scope:
      'Five shared source-paper HSB candidates, each fit to all four corresponding Unlimited dual scans. Source-mask alpha labels each stripe and erodes boundaries by three canonical pixels; no scan-based color classification, per-card geometry, palette or blackpoint is fitted. Fixed normalized Original references and every residual are retained. These are development observations, not held-out validation. Prepared source compositing, outline/pinline palettes, brown texture/blackpoint and complete native card validation remain open.',
    rendererHash: capture.rendererHash,
    captureHash: hash(captureBytes),
    nativeCaptureHash: hash(nativeBytes),
    maskHash: hash(maskBytes),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    dependencies: await Promise.all(
      [
        'hsb-color.mjs',
        'early-dual-paper-samples.mjs',
        'pixels-pure.mjs',
        '../../src/presentation/hsb.ts',
      ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
    ),
    window,
    tileSize,
    erosion,
    model,
    groups,
    rows,
  });
} finally {
  await server.close();
}
