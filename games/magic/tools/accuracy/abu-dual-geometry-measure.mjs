// Compare bounded native trials with frozen scan-derived edge profiles.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { normalize } from './pixels-pure.mjs';
import { hash } from './common.mjs';
const [directory, referenceFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-dual-geometry-measure.mjs TRIALS FROZEN_RECHECK OUTPUT_GZ');
const cb = await readFile(path.join(directory, 'capture.json')),
  capture = JSON.parse(cb);
const rb = await readFile(referenceFile),
  reference = JSON.parse(rb);
const median = (a) => {
  const b = [...a].sort((a, b) => a - b);
  return (b[Math.floor((b.length - 1) / 2)] + b[Math.ceil((b.length - 1) / 2)]) / 2;
};
function edgeProfile(image, [x, y, w, h, axis]) {
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
  for (let p = 0; p < 2; p++)
    rgb = rgb.map((v, i) =>
      v.map((_, k) => (rgb[Math.max(0, i - 1)][k] + 2 * v[k] + rgb[Math.min(n - 1, i + 1)][k]) / 4),
    );
  return { rgb, edge: rgb.slice(1).map((v, i) => Math.hypot(...v.map((c, k) => c - rgb[i][k]))) };
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
  return aa && bb ? (100 * xy) / Math.sqrt(aa * bb) : null;
}
const rows = [];
for (const prior of reference.rows) {
  const related = capture.rows.filter((r) => r.id === prior.id);
  assert.equal(related.length, 3);
  const images = new Map();
  for (const row of related) {
    assert.equal(row.referenceHash, prior.referenceHash);
    assert.equal(row.poseHash, prior.poseHash);
    const bytes = await readFile(path.join(directory, row.id + '-' + row.trial + '.png'));
    assert.equal(hash(bytes), row.renderHash);
    images.set(row.trial, PNG.sync.read(bytes));
  }
  assert.equal(related.find((r) => r.trial === 'current').renderHash, prior.renderHash);
  const original = images.get('current');
  for (const row of related) {
    const image = images.get(row.trial),
      normalized = normalize(image),
      sides = {};
    assert.equal(image.width, original.width);
    assert.equal(image.height, original.height);
    let alphaChanged = 0;
    for (let i = 3; i < image.data.length; i += 4)
      if (image.data[i] !== original.data[i]) alphaChanged++;
    assert.equal(alphaChanged, 0, 'Stock/silhouette changed');
    for (const [side, rect] of Object.entries(reference.strips)) {
      const profile = edgeProfile(normalized, rect);
      const score = cosine(prior.sides[side].reference.edge, profile.edge);
      if (row.trial === 'current') {
        assert.deepEqual(profile, prior.sides[side].rendered);
        assert(Math.abs(score - prior.sides[side].edgeCosine100) < 1e-10);
      }
      sides[side] = { score100: score, delta: score - prior.sides[side].edgeCosine100 };
    }
    rows.push({ ...row, alphaChanged, sides });
  }
}
const groups = {
  outer: ['left', 'right', 'top', 'bottom'],
  art: ['artLeft', 'artRight', 'artTop', 'artBottom'],
  paper: ['paperLeft', 'paperRight', 'paperTop', 'paperBottom'],
};
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = Object.fromEntries(
  capture.trials.map((t) => [
    t.id,
    Object.fromEntries(
      Object.entries(groups).map(([g, keys]) => [
        g,
        {
          mean100: mean(
            rows
              .filter((r) => r.trial === t.id)
              .flatMap((r) => keys.map((k) => r.sides[k].score100)),
          ),
          delta: mean(
            rows.filter((r) => r.trial === t.id).flatMap((r) => keys.map((k) => r.sides[k].delta)),
          ),
          gains: rows
            .filter((r) => r.trial === t.id)
            .flatMap((r) => keys.map((k) => r.sides[k].delta))
            .filter((v) => v > 0.5).length,
          regressions: rows
            .filter((r) => r.trial === t.id)
            .flatMap((r) => keys.map((k) => r.sides[k].delta))
            .filter((v) => v < -0.5).length,
        },
      ]),
    ),
  ]),
);
const result = {
  schema: 1,
  status: 'bounded-shared-native-geometry-diagnostic',
  scope:
    '19 historical Original face inputs, fixed scan poses and RGB-gradient magnitudes. All 19 default rasters and 228 profiles reproduce exactly. Regional indices are out of 100, not whole-card scores. Both experiments move the entire source plate/art and may trade off independently aligned windows. No values are promoted by a mean gain.',
  source: {
    captureHash: hash(cb),
    referenceReportHash: hash(rb),
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary,
  capture,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(JSON.stringify(summary));
