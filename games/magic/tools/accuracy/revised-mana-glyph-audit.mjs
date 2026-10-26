// Measure glyph shape in physical disc coordinates, independently of cost placement.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph, GLYPH_SIZE } from './mana-glyph-metrics.mjs';
import { median, quantile } from './hsb-color.mjs';

const [inputFile, poseFile, nativeDirectory, ringFile, outputFile] = process.argv.slice(2);
assert(
  outputFile,
  'Usage: revised-mana-glyph-audit.mjs INPUTS POSES NATIVE_DIRECTORY RINGS NEW_OUTPUT',
);
const files = [inputFile, poseFile, path.join(nativeDirectory, 'capture.json'), ringFile],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, ring] = bytes.map((b) => JSON.parse(b)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  tools = [
    'mana-glyph-metrics.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'edges.mjs',
    'metrics.mjs',
    'hsb-color.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        tools.map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  rows = [],
  thresholds = [0.38, 0.48, 0.58];
assert.equal(ring.status, 'diagnostic-circles-not-adopted');
assert.equal(ring.rendererHash, rendererHash);
assert.equal(capture.rendererHash, rendererHash);
assert.deepEqual(
  [ring.sources.inputs, ring.sources.poses, ring.sources.capture],
  bytes.slice(0, 3).map(hash),
);
assert.equal(capture.inputHash, hash(bytes[0]));
await fs.writeFile(outputFile, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const start = performance.now();
function describe(mask, radius) {
  if (mask.status !== 'measured') return { status: mask.status };
  let x = 0,
    y = 0,
    count = 0;
  for (let i = 0; i < mask.ink.length; i++)
    if (mask.ink[i]) {
      x += i % GLYPH_SIZE;
      y += Math.floor(i / GLYPH_SIZE);
      count++;
    }
  return {
    status: mask.status,
    maskHash: hash(mask.ink),
    bounds: mask.bounds,
    discRatio: mask.discRatio,
    occupancy: mask.occupancy,
    contrast: mask.contrast,
    center: [
      ((x / count - GLYPH_SIZE / 2) * 2 * radius) / (GLYPH_SIZE - 4),
      ((y / count - GLYPH_SIZE / 2) * 2 * radius) / (GLYPH_SIZE - 4),
    ],
  };
}
// Interior color is reported separately and never enters the shape objective.
function paperSample(image, circle, fraction) {
  const pixels = [];
  for (let y = Math.ceil(circle.y - circle.radius); y <= circle.y + circle.radius; y++)
    for (let x = Math.ceil(circle.x - circle.radius); x <= circle.x + circle.radius; x++) {
      if (Math.hypot(x - circle.x, y - circle.y) > circle.radius * 0.82) continue;
      const at = (y * image.width + x) * 4;
      if (image.data[at + 3] < 250) continue;
      const rgb = Array.from(image.data.subarray(at, at + 3));
      pixels.push({ rgb, luma: rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 });
    }
  const luminance = pixels.map((p) => p.luma),
    low = quantile(luminance, 0.12),
    high = quantile(luminance, 0.88),
    selected = pixels.filter((p) => p.luma >= low + (high - low) * fraction);
  return {
    rgb: [0, 1, 2].map((c) => median(selected.map((p) => p.rgb[c]))),
    pixels: selected.length,
    total: pixels.length,
  };
}
for (const r of ring.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    p = Object.values(poses.groups)
      .flatMap((g) => g.rows)
      .find((p) => p.id === r.id),
    n = capture.rows.find((n) => n.id === r.id);
  assert(p.accepted);
  assert.equal(r.poseHash, hash(JSON.stringify(p.transform)));
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.nativeHash, n.modes.original.sha256);
  const sb = await fs.readFile(objectFile(e.reference)),
    nb = await fs.readFile(path.join(nativeDirectory, n.modes.original.file));
  assert.equal(hash(sb), r.referenceHash);
  assert.equal(hash(nb), r.nativeHash);
  const images = {
    scan: normalize(PNG.sync.read(sb), p.transform),
    render: normalize(PNG.sync.read(nb)),
  };
  for (const d of r.discs) {
    const row = {
      id: r.id,
      name: r.name,
      material: r.material,
      cohort: r.cohort,
      index: d.index,
      symbol: d.symbol,
      referenceHash: r.referenceHash,
      nativeHash: r.nativeHash,
      poseHash: r.poseHash,
      ringAccepted: d.accepted,
    };
    if (!d.accepted) {
      rows.push({ ...row, accepted: false, reason: 'perimeter-rejected' });
      continue;
    }
    const measurements = thresholds.map((thresholdFraction) => {
      const masks = Object.fromEntries(
          Object.entries(images).map(([k, image]) => [
            k,
            manaGlyphMask(image, d.circles[k], false, {
              normalizeBounds: false,
              thresholdFraction,
            }),
          ]),
        ),
        accepted = Object.values(masks).every((m) => m.status === 'measured');
      return {
        thresholdFraction,
        accepted,
        ...Object.fromEntries(
          Object.entries(masks).map(([k, m]) => [k, describe(m, d.circles[k].radius)]),
        ),
        ...(accepted ? { comparison: compareManaGlyph(masks.scan.ink, masks.render.ink) } : {}),
      };
    });
    rows.push({
      ...row,
      accepted: measurements.every((m) => m.accepted),
      measurements,
      paper: [0.5, 0.6, 0.7].map((fraction) => ({
        fraction,
        scan: paperSample(images.scan, d.circles.scan, fraction),
        render: paperSample(images.render, d.circles.render, fraction),
      })),
    });
  }
}
function summary(a) {
  const accepted = a.filter((r) => r.accepted);
  if (!accepted.length) return { count: a.length, accepted: 0 };
  const scores = accepted.map((r) => median(r.measurements.map((m) => m.comparison.score)) * 100);
  return {
    count: a.length,
    accepted: accepted.length,
    scoreMean: scores.reduce((a, b) => a + b, 0) / scores.length,
    scoreMedian: median(scores),
    scoreP10: quantile(scores, 0.1),
    widthRatio: median(
      accepted.map((r) =>
        median(r.measurements.map((m) => m.scan.discRatio[0] / m.render.discRatio[0])),
      ),
    ),
    heightRatio: median(
      accepted.map((r) =>
        median(r.measurements.map((m) => m.scan.discRatio[1] / m.render.discRatio[1])),
      ),
    ),
    dx: median(
      accepted.map((r) => median(r.measurements.map((m) => m.scan.center[0] - m.render.center[0]))),
    ),
    dy: median(
      accepted.map((r) => median(r.measurements.map((m) => m.scan.center[1] - m.render.center[1]))),
    ),
  };
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
assert.deepEqual(await identities(), modules);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
await writeJson(outputFile, {
  schema: 1,
  set: '3ed',
  status: 'glyph-shape-diagnostic-not-adopted',
  scope:
    'Actual Original native cost glyphs compared with original scans in independently measured disc coordinates. Ink bounds are not normalized. Three relative thresholds separate glyph shape from pigment/saturation. Perimeter and mask rejections remain explicit. This is a diagnostic of existing glyphs, not new renderer geometry, a selected native candidate, a pigment fit, or a complete mana certification. Validation names are reused development data.',
  rendererHash,
  sources: {
    inputs: hash(bytes[0]),
    poses: hash(bytes[1]),
    capture: hash(bytes[2]),
    rings: hash(bytes[3]),
    toolHash,
    modules,
  },
  thresholds,
  paperScope:
    'Eroded-disc median RGB after three relative dark-ink rejection thresholds. Diagnostic only: scan print dots and low circle/frame contrast can bias estimates. No color candidate is adopted from these probes.',
  paperGroups: Object.fromEntries(
    ['W', 'U', 'B', 'R', 'G', 'N'].flatMap((symbol) =>
      ['all', 'calibration', 'validation'].map((cohort) => {
        const a = rows.filter(
          (r) =>
            r.paper &&
            (cohort === 'all' || r.cohort === cohort) &&
            (symbol === 'N' ? !/^[WUBRG]$/.test(r.symbol) : r.symbol === symbol),
        );
        return [
          symbol + '/' + cohort,
          {
            count: a.length,
            variants: [0.5, 0.6, 0.7].map((fraction, i) => ({
              fraction,
              ...Object.fromEntries(
                ['scan', 'render'].map((key) => [
                  key,
                  a.length
                    ? [0, 1, 2].map((c) => median(a.map((r) => r.paper[i][key].rgb[c])))
                    : null,
                ]),
              ),
            })),
          },
        ];
      }),
    ),
  ),
  groups: Object.fromEntries(
    [
      ['all', rows],
      ...['calibration', 'validation'].map((c) => [c, rows.filter((r) => r.cohort === c)]),
      ...['W', 'U', 'B', 'R', 'G', 'N'].map((s) => [
        'symbol/' + s,
        rows.filter((r) => (s === 'N' ? !/^[WUBRG]$/.test(r.symbol) : r.symbol === s)),
      ]),
      ...[...new Set(rows.filter((r) => !/^[WUBRG]$/.test(r.symbol)).map((r) => r.symbol))]
        .sort()
        .map((s) => ['numeral/' + s, rows.filter((r) => r.symbol === s)]),
    ].map(([k, a]) => [k, summary(a)]),
  ),
  elapsedSeconds: (performance.now() - start) / 1000,
  rows,
});
console.log(
  'Glyph audit saved',
  rows.length,
  'symbols',
  Math.round((performance.now() - start) / 1000),
  'seconds',
);
