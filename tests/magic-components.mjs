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
assert.deepEqual([shifted.overlapPeak.dx, shifted.overlapPeak.dy], [-5, 3]);
assert.equal(shifted.overlapPeak.edgeF1, 1);
assert.equal(shifted.objectiveDisagreementPx, 0);
assert.equal(shifted.search.evaluatedOffsets, 441);
const recolored = componentOffset(a, shape(5, -3, 150, 65), width, height);
assert.deepEqual([recolored.dx, recolored.dy], [-5, 3]);
assert.equal(recolored.diagnosticEdgeF1, shifted.diagnosticEdgeF1);
assert.deepEqual(recolored.overlapPeak, shifted.overlapPeak);
assert.equal(
  componentOffset(a, new Float32Array(width * height).fill(200), width, height).status,
  'missing-ink',
);
assert.equal(componentOffset(a, shape(14, 0), width, height).status, 'search-boundary');
assert.ok(componentOffset(a, shape(0, 0, 200, 30, true), width, height).diagnosticEdgeF1 < 0.65);
const tinySearch = componentOffset(a, a, width, height, false, 1);
assert.equal(tinySearch.search.evaluatedOffsets, 9);
assert.equal(tinySearch.overlapPeak.edgeF1, 1);
assert.equal(tinySearch.margin, null);
assert.equal(tinySearch.overlapPeak.margin, null);
assert.equal(tinySearch.overlapPeak.ambiguous, true);

// Stationary marks can pull minimum distance away from the true foreground shift.
// Retain the stronger overlap peak and expose disagreement instead of hiding it.
function contaminatedShape(dx = 0, dy = 0) {
  const w = 90,
    h = 80,
    gray = new Float32Array(w * h).fill(200);
  for (let y = 25; y < 46; y++)
    for (let x = 32; x < 56; x++)
      if (x < 37 || y > 40 || (x > 46 && y < 33)) gray[(y + dy) * w + x + dx] = 30;
  for (let j = 0; j < 3; j++) for (let x = 3; x < 5; x++) gray[(4 + j * 5) * w + x] = 30;
  return gray;
}
const competing = componentOffset(contaminatedShape(), contaminatedShape(7, -6), 90, 80);
assert.deepEqual([competing.overlapPeak.dx, competing.overlapPeak.dy], [-7, 6]);
assert.ok(competing.overlapPeak.edgeF1 > competing.diagnosticEdgeF1 + 0.3);
assert.ok(competing.objectiveDisagreementPx > 5);
assert.equal(competing.status, 'ambiguous');
console.log(
  'Component diagnostics: displacement, contrast, missing ink, search limits, competing peaks and wrong shape passed',
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

// An unchanged rightmost disc cannot conceal a compressed cost row.
const { manaRowLandmarks } = await import('../games/magic/tools/accuracy/mana-landmark.mjs');
function row(pitch, base = 55, ink = 200) {
  const width = 130,
    height = 64;
  const gray = new Float32Array(width * height).fill(base);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if ([0, 1, 2].some((i) => Math.hypot(x - (96 - i * pitch), y - 32) < 11.5))
        gray[y * width + x] = ink;
      if (y === 6) gray[y * width + x] = 255;
    }
  return manaRowLandmarks(gray, width, height, {
    count: 3,
    rightX: 96,
    y: 32,
    pitch: 27,
    range: 6,
  });
}
const referenceRow = row(27),
  compressedRow = row(25),
  recoloredRow = row(25, 85, 175);
for (const result of [referenceRow, compressedRow, recoloredRow])
  assert.equal(result.status, 'measured');
assert.equal(referenceRow.circles[0].x, compressedRow.circles[0].x);
assert.equal(referenceRow.pitch, 27);
assert.equal(compressedRow.pitch, 25);
assert.equal(recoloredRow.pitch, 25);
assert.equal(compressedRow.circles[2].x - referenceRow.circles[2].x, 4);
console.log('Whole-row landmarks detect spacing errors hidden by the rightmost disc');

assert.equal(
  componentOffset(a, new Float32Array(width * height).fill(200), width, height).rawEdgeF1,
  0,
);
