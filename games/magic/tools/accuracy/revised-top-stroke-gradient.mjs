// Calibration-only experiment: keep the dark stroke below the name box,
// excluding the adjacent illustration from the two fixed Revised top strips.
import assert from 'node:assert/strict';
import { medianDarkeningGradient } from './directed-frame-gradient.mjs';
export function revisedTopStrokeGradient(image, rect) {
  const [x, y, w, h, axis] = rect;
  if (w !== 110 || h !== 25 || axis !== 'y') return medianDarkeningGradient(image, rect);
  assert(
    x === 0 && y === 0 && image.width === w && image.height === h,
    'Revised stroke experiment requires a prepared top-strip window',
  );
  assert.equal(image.data.length, w * h * 4);
  const data = new Uint8Array(image.data);
  // Extend the first safe row(y55) upward so name descenders cannot enter
  // the smoothing margin. The frame stroke remains sampled at its true phase.
  for (let row = 0; row < 4; row++) data.set(data.subarray(4 * w * 4, 5 * w * 4), row * w * 4);
  // The window begins at canonical y51. Extend y64 through its unused tail,
  // before the illustration begins. This removes art transitions before the
  // gradient smoothing step, preserving the source sampling phase.
  for (let row = 14; row < h; row++) data.set(data.subarray(13 * w * 4, 14 * w * 4), row * w * 4);
  return medianDarkeningGradient({ ...image, data }, rect);
}
