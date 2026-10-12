import assert from 'node:assert/strict';
import { measurePlate, plateDifference } from '../games/magic/tools/accuracy/plate-geometry.mjs';

const windows = {
  top: [12, 35],
  bottom: [56, 79],
  spans: [
    [20, 35],
    [73, 35],
    [126, 35],
  ],
  inkX: [15, 165],
};
function sample({
  dy = 0,
  trim = 0,
  bottomTrim = 0,
  shadow = 3,
  brightness = 1,
  gamma = 1,
  noise = 0,
  missing = false,
  competing = false,
} = {}) {
  const width = 180,
    height = 100;
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const yy = y - dy;
      let v = 140;
      if (!missing && x >= 5 && x < 175) {
        if (yy >= 24 + trim && yy < 68 - bottomTrim) v = 220;
        if ((yy >= 22 + trim && yy < 24 + trim) || (yy >= 68 - bottomTrim && yy < 70 - bottomTrim))
          v = 15;
        if (yy >= 70 - bottomTrim && yy < 70 - bottomTrim + shadow) v = 75;
        if (competing && yy >= 29 && yy < 32) v = 15;
        if (yy >= 40 && yy <= 51 && x >= 20 && x < 159 && x % 13 < 4) v = 25;
      }
      v = Math.round(255 * (v / 255) ** gamma * brightness + noise * Math.sin(x * 17 + y * 23));
      data.set([v, v, v, 255], (y * width + x) * 4);
    }
  return { width, height, data };
}
const reference = measurePlate(sample(), windows);
assert.equal(reference.reliable, true);
assert.equal(reference.ink.status, 'measured');
for (const dy of [-4, -2, 0, 2, 4]) {
  const measured = measurePlate(
    sample({ dy, brightness: 0.8, gamma: 1.2, noise: 3, shadow: 8 }),
    windows,
  );
  const delta = plateDifference(reference, measured);
  assert.equal(delta.status, 'measured');
  assert.ok(Math.abs(delta.top - dy) < 0.2);
  assert.ok(Math.abs(delta.bottom - dy) < 0.2);
  assert.ok(Math.abs(delta.height) < 0.2);
  assert.ok(Math.abs(delta.ink.center - dy) <= 0.5);
}
const trimmed = plateDifference(reference, measurePlate(sample({ trim: 1 }), windows));
assert.ok(Math.abs(trimmed.top - 1) < 0.01);
assert.ok(Math.abs(trimmed.bottom) < 0.01);
assert.ok(Math.abs(trimmed.height + 1) < 0.01);
assert.equal(trimmed.ink.center, 0);
const bottomTrimmed = plateDifference(
  reference,
  measurePlate(sample({ bottomTrim: 1, shadow: 4 }), windows),
);
assert.ok(Math.abs(bottomTrimmed.top) < 0.01);
assert.ok(Math.abs(bottomTrimmed.bottom + 1) < 0.01);
assert.ok(Math.abs(bottomTrimmed.height + 1) < 0.01);
assert.equal(bottomTrimmed.ink.center, 0);
const missing = measurePlate(sample({ missing: true }), windows);
assert.equal(missing.reliable, false);
assert.equal(plateDifference(reference, missing).status, 'uncertain');
assert.equal(measurePlate(sample({ competing: true }), windows).reliable, false);
assert.equal(measurePlate(sample({ dy: 11 }), windows).reliable, false);
assert.throws(() => measurePlate(sample(), { ...windows, top: [0, 10] }), /Invalid/);
console.log(
  'Plate landmarks separate translation, height and ink; tone, grain, shadow, ambiguity and missing-edge controls passed.',
);
