// Shared physical disc fit; glyph overlap cannot choose disc size or position.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { median } from './hsb-color.mjs';
const [nativeDirectory, auditFile, colorDefinitionFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-mana-disc-fit.mjs NATIVE AUDIT COLOR_DEFINITION OUTPUT');
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    auditFile,
    colorDefinitionFile,
  ].map((f) => readFile(f)),
);
const [capture, inputs, audit, sample] = raw.map((b) => JSON.parse(b));
for (const d of [audit, sample]) {
  assert.equal(d.nativeCaptureHash, hash(raw[0]));
  assert.equal(d.nativeInputsHash, hash(raw[1]));
}
assert.equal(sample.auditHash, hash(raw[2]));
assert(audit.rows.every((r) => r.accepted));
const pairs = [];
for (const e of inputs.entries.filter(
  (e) => sample.ids.includes(e.id) && e.face.manaSymbols.length >= 2,
)) {
  assert(!e.face.symbolAdjustment?.mana, 'Provided cost has a manual override');
  const r = audit.rows.find((r) => r.id === e.id),
    c = capture.rows.find((r) => r.id === e.id);
  assert.equal(r.poseHash, c.poseHash);
  assert.equal(r.faceHash, c.renderHash);
  const bytes = await Promise.all(
    ['.png', '-scan.png'].map((s) => readFile(path.join(nativeDirectory, e.set, e.id + s))),
  );
  assert.equal(hash(bytes[0]), r.faceHash);
  assert.equal(hash(bytes[1]), r.scanHash);
  const measured = bytes.map((b, i) => {
    const last = (i ? r.scan : r.render).circle;
    const previous = outerManaCircle(normalize(PNG.sync.read(b)), {
      x: last.x - 27,
      y: last.y,
      range: 5,
      radiusRange: [9.5, 14],
    });
    return { last, previous, pitch: last.x - previous.x };
  });
  pairs.push({
    id: e.id,
    name: e.name,
    symbol: r.symbol,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    render: measured[0],
    scan: measured[1],
    accepted: measured.every((m) => m.previous.status === 'measured'),
  });
  if (pairs.length % 10 === 0) console.log('Pitch measurements', pairs.length);
}
const cal = audit.rows.filter((r) => r.cohort === 'calibration'),
  val = audit.rows.filter((r) => r.cohort === 'validation');
const balanced = (fn) =>
  median(
    ['W', 'U', 'B', 'R', 'G', 'N'].map((s) => median(cal.filter((r) => r.symbol === s).map(fn))),
  );
const quant = (v, step) => Math.round(v / step) * step;
const scale = quant(
    balanced((r) => r.scan.circle.radius / r.render.circle.radius),
    0.0025,
  ),
  right = 432 + 23.9 / 2,
  cy = 46;
const dx = quant(
  balanced((r) => r.scan.circle.x - (right + (r.render.circle.x - right) * scale)),
  0.125,
);
const dy = quant(
  balanced((r) => r.scan.circle.y - (cy + (r.render.circle.y - cy) * scale)),
  0.125,
);
const spacingRows = pairs.filter((r) => r.accepted && r.cohort === 'calibration');
assert(spacingRows.length >= 10);
const rawSpacing = median(spacingRows.map((r) => r.scan.pitch / scale - r.render.pitch));
const spacingCandidates = [
  ...new Set([0, ...[-0.25, -0.125, 0, 0.125, 0.25].map((d) => quant(rawSpacing + d, 0.125))]),
];
const spacing = spacingCandidates
  .map((value) => ({
    value,
    error:
      spacingRows.reduce(
        (sum, r) => sum + Math.abs((r.render.pitch + value) * scale - r.scan.pitch),
        0,
      ) / spacingRows.length,
  }))
  .sort((a, b) => a.error - b.error || Math.abs(a.value) - Math.abs(b.value))[0].value;
const geometry = { dx, dy, scaleX: scale, scaleY: scale, spacing };
assert(scale >= 0.94 && scale <= 1.02);
assert(Math.abs(dx) <= 3 && Math.abs(dy) <= 3 && Math.abs(spacing) <= 2);
const rows = audit.rows.map((r) => {
  const before = r.render.circle,
    target = r.scan.circle,
    after = {
      x: right + (before.x - right) * scale + dx,
      y: cy + (before.y - cy) * scale + dy,
      radius: before.radius * scale,
    };
  const errors = (c) => ({
    center: Math.hypot(c.x - target.x, c.y - target.y),
    radius: Math.abs(c.radius - target.radius),
    x: Math.abs(c.x - target.x),
    y: Math.abs(c.y - target.y),
  });
  return {
    id: r.id,
    name: r.name,
    symbol: r.symbol,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    before,
    target,
    after,
    beforeError: errors(before),
    afterError: errors(after),
  };
});
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = (a) => ({
  count: a.length,
  beforeCenterMedian: median(a.map((r) => r.beforeError.center)),
  afterCenterMedian: median(a.map((r) => r.afterError.center)),
  beforeRadiusMedian: median(a.map((r) => r.beforeError.radius)),
  afterRadiusMedian: median(a.map((r) => r.afterError.radius)),
  beforeCenterMean: mean(a.map((r) => r.beforeError.center)),
  afterCenterMean: mean(a.map((r) => r.afterError.center)),
  centerImproved: a.filter((r) => r.afterError.center < r.beforeError.center).length,
  worstCenterRegression: Math.max(0, ...a.map((r) => r.afterError.center - r.beforeError.center)),
});
const groups = Object.fromEntries(
  [
    'all',
    'calibration',
    'validation',
    ...['W', 'U', 'B', 'R', 'G', 'N'].map((s) => 'symbol/' + s),
  ].map((k) => [
    k,
    summary(rows.filter((r) => k === 'all' || r.cohort === k || k === 'symbol/' + r.symbol)),
  ]),
);
const pitches = Object.fromEntries(
  ['calibration', 'validation'].map((k) => {
    const a = pairs.filter((r) => r.accepted && r.cohort === k);
    return [
      k,
      {
        count: a.length,
        rejected: pairs.filter((r) => !r.accepted && r.cohort === k).length,
        beforeMedianPitch: median(a.map((r) => r.render.pitch)),
        referenceMedianPitch: median(a.map((r) => r.scan.pitch)),
        afterMedianPitch: median(a.map((r) => (r.render.pitch + spacing) * scale)),
        beforeMeanAbsoluteError: mean(a.map((r) => Math.abs(r.render.pitch - r.scan.pitch))),
        afterMeanAbsoluteError: mean(
          a.map((r) => Math.abs((r.render.pitch + spacing) * scale - r.scan.pitch)),
        ),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'shared-disc-geometry-candidate-needs-native-and-glyph-verification',
  scope:
    'One set-level physical circle transform, fitted from calibration perimeter measurements with equal color-family weight. Circle coordinates never change scan poses or per-card rendering. Fixed reference-space right-edge anchoring matches the painter; source radius and center phases remain explicit. Pitch uses the predeclared color sample and retains rejected previous-circle measurements. Values are quantized to 1/8px and 0.0025 scale. Reused development validation is separate. Analytic disc geometry is not native pixel, glyph/numeral or whole-card certification.',
  rendererHash: capture.source.rendererHash,
  sources: {
    nativeCapture: hash(raw[0]),
    nativeInputs: hash(raw[1]),
    audit: hash(raw[2]),
    sample: hash(raw[3]),
  },
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    [
      'abu-mana-ring.mjs',
      'pixels-pure.mjs',
      'hsb-color.mjs',
      '../../src/presentation/symbol-adjustment.ts',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  geometry,
  rawSpacing,
  spacingCandidates,
  groups,
  pitches,
  rows,
  pairs,
});
console.log(JSON.stringify({ geometry, groups, pitches }));
