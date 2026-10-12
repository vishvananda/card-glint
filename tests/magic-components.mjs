import assert from 'node:assert/strict';
import { componentOffset } from '../games/magic/tools/accuracy/component-offset.mjs';
const width = 70,
  height = 55;
function shape(dx = 0, dy = 0, base = 200, ink = 30, different = false) {
  const gray = new Float32Array(width * height).fill(base);
  for (let y = 15; y < 36; y++)
    for (let x = 22; x < 46; x++) {
      if (different ? Math.hypot(x - 33, y - 25) < 8 : x < 27 || y > 30 || (x > 36 && y < 23))
        gray[(y + dy) * width + x + dx] = ink;
    }
  return gray;
}
const a = shape(),
  shifted = componentOffset(a, shape(5, -3), width, height);
assert.equal(shifted.status, 'placement');
assert.deepEqual([shifted.dx, shifted.dy], [-5, 3]);
assert.ok(shifted.diagnosticEdgeF1 > 0.99);
assert.ok(shifted.rawEdgeF1 < 0.7);
const recolored = componentOffset(a, shape(5, -3, 150, 65), width, height);
assert.deepEqual([recolored.dx, recolored.dy], [-5, 3]);
assert.equal(recolored.diagnosticEdgeF1, shifted.diagnosticEdgeF1);
assert.equal(
  componentOffset(a, new Float32Array(width * height).fill(200), width, height).status,
  'missing-ink',
);
assert.equal(componentOffset(a, shape(14, 0), width, height).status, 'search-boundary');
assert.ok(componentOffset(a, shape(0, 0, 200, 30, true), width, height).diagnosticEdgeF1 < 0.65);
console.log(
  'Component diagnostics: known displacement, contrast, missing ink, range limit and wrong shape passed',
);

// A frame line is shared by both candidates: it must not hide a displaced cost disc.
const { manaLandmark } = await import('../games/magic/tools/accuracy/mana-landmark.mjs');
function circle(cx, cy, base = 60, ink = 190) {
  const w = 53,
    h = 45,
    a = new Float32Array(w * h).fill(base);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (Math.hypot(x - cx, y - cy) < 11.5) a[y * w + x] = ink;
      if (y === 4 || x === 3) a[y * w + x] = 255;
    }
  return a;
}
for (const [x, y, base, ink] of [
  [27, 21, 60, 190],
  [22, 24, 60, 190],
  [22, 24, 90, 170],
]) {
  const found = manaLandmark(circle(x, y, base, ink), 53, 45, { x: 27, y: 21, range: 9 });
  assert.equal(found.status, 'measured');
  assert.deepEqual([found.x, found.y], [x, y]);
}
console.log('Independent mana landmarks reject shared frame-line distraction');

assert.equal(
  componentOffset(a, new Float32Array(width * height).fill(200), width, height).rawEdgeF1,
  0,
);
