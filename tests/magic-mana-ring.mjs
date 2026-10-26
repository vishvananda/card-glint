import assert from 'node:assert/strict';
import { outerManaCircle } from '../games/magic/tools/accuracy/abu-mana-ring.mjs';

// A known physical perimeter must be recovered even when glyph coverage and
// paper/frame colors vary. Supersampling supplies independent antialiasing.
function image({ x, y, radius, paper, frame, glyph = false }) {
  const width = 488,
    height = 90,
    data = new Uint8Array(width * height * 4);
  for (let py = 0; py < height; py++)
    for (let px = 0; px < width; px++) {
      let sum = 0;
      for (let sy = 0; sy < 8; sy++)
        for (let sx = 0; sx < 8; sx++) {
          const dx = px + (sx + 0.5) / 8 - 0.5 - x,
            dy = py + (sy + 0.5) / 8 - 0.5 - y;
          let value = Math.hypot(dx, dy) < radius ? paper : frame;
          if (glyph && Math.abs(dx) < 3 && Math.abs(dy) < 7) value = 10;
          sum += value;
        }
      data.set([sum / 64, sum / 64, sum / 64, 255], (py * width + px) * 4);
    }
  return { width, height, data };
}
for (const spec of [
  { x: 435, y: 44, radius: 11.75, paper: 220, frame: 100 },
  {
    x: 434.625,
    y: 44.125,
    radius: 11.75,
    paper: 180,
    frame: 240,
    polarity: 'dark-on-light',
    glyph: true,
  },
  { x: 434.375, y: 44.625, radius: 12.125, paper: 190, frame: 130, glyph: true },
  { x: 435.625, y: 43.875, radius: 11.5, paper: 240, frame: 225, glyph: true },
]) {
  const actual = outerManaCircle(image(spec), {
    x: 435,
    y: 44.5,
    range: 4,
    radiusRange: [9, 14],
    polarity: spec.polarity ?? 'light-on-dark',
  });
  assert.equal(actual.status, 'measured');
  assert(Math.hypot(actual.x - spec.x, actual.y - spec.y) <= 0.3, JSON.stringify(actual));
  assert(Math.abs(actual.radius - spec.radius) <= 0.3, JSON.stringify(actual));
}
const flat = image({ x: 435, y: 44.5, radius: 11.75, paper: 100, frame: 100 });
assert.notEqual(outerManaCircle(flat, { x: 435, y: 44.5 }).status, 'measured');
assert.throws(
  () => outerManaCircle(flat, { polarity: 'unknown' }),
  /Unknown mana perimeter polarity/,
);
const outside = image({ x: 440, y: 44.5, radius: 11.75, paper: 240, frame: 80 });
assert.notEqual(outerManaCircle(outside, { x: 435, y: 44.5, range: 2 }).status, 'measured');
console.log(
  'Outer mana perimeter recovers known subpixel centers/radii across contrast and glyph changes; flat/boundary controls reject.',
);
