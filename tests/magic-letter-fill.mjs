import assert from 'node:assert/strict';
import {
  box,
  titleShape,
  compareTitleShape,
} from '../games/magic/tools/accuracy/letter-fill-metrics.mjs';
const w = 180,
  h = 48;
// Three glyph-like shapes, including open counters, against a textured field.
const mask = Uint8Array.from({ length: w * h }, (_, i) => {
  const x = i % w,
    y = Math.floor(i / w);
  return (x >= 20 && x < 26 && y >= 9 && y < 37) ||
    (x >= 20 && x < 44 && ((y >= 9 && y < 15) || (y >= 22 && y < 27))) ||
    (x >= 58 && x < 64 && y >= 9 && y < 37) ||
    (x >= 58 && x < 84 && y >= 31 && y < 37) ||
    (x >= 98 && x < 126 && y >= 9 && y < 37 && !(x >= 104 && x < 120 && y >= 15 && y < 31))
    ? 1
    : 0;
});
const ring = mask.map((v, i) => (v && [-1, 1, -w, w].some((d) => !mask[i + d]) ? 1 : 0));
const raster = (m, ink = 194) =>
  Float32Array.from(m, (v, i) => (v ? ink : 74 + 4 * Math.sin(i * 0.17)));
const target = box(raster(mask), w, h, 1),
  solid = titleShape(target, w, h),
  outline = raster(ring, 250);
const report = [];
for (const [name, scale, offset, noise] of [
  ['identity', 1, 0, 0],
  ['darker', 0.6, 35, 0],
  ['lighter', 0.8, 50, 0],
  ['scan-noise', 0.75, 26, 3],
]) {
  const perturb = (values) =>
    Float32Array.from(values, (v, i) => scale * v + offset + noise * Math.sin(i * 1.74));
  const a = compareTitleShape(solid, titleShape(perturb(target), w, h)),
    b = compareTitleShape(solid, titleShape(perturb(outline), w, h));
  assert.ok(a.contrast > b.contrast + 0.1, name);
  assert.ok(a.filledArea > b.filledArea + 0.1, name);
  assert.ok(a.strokeWidthError < b.strokeWidthError, name);
  if (!noise) {
    assert.ok(a.contrast > 0.999999);
    assert.equal(a.filledArea, 1);
  }
  report.push({ name, solid: a, hollow: b });
}
assert.equal(titleShape(new Float32Array(w * h).fill(100), w, h).status, 'empty');
console.log(
  JSON.stringify(
    {
      status: 'pass',
      policy:
        'Filled strokes win against sharper hollow outlines under brightness, contrast and deterministic scan noise. Stroke-width is an independent diagnostic.',
      report,
    },
    null,
    2,
  ),
);
