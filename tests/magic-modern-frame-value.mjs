import assert from 'node:assert/strict';
import {
  frameValue,
  modernValueFramePatches,
} from '../games/magic/tools/accuracy/modern-frame-value.mjs';
import { nativeFramePatches } from '../games/magic/tools/accuracy/native-frame-patches.mjs';
import { luminance } from '../games/magic/tools/accuracy/pixels-pure.mjs';
const width = 146,
  height = 204;
const image = { width, height, data: new Uint8Array(width * height * 4) };
const changed = { width, height, data: new Uint8Array(width * height * 4) };
const controlled = { width, height, data: new Uint8Array(width * height * 4) };
const expected = new Float32Array(width * height);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const p = y * width + x,
      v = 40 + ((x * 3 + y * 7) % 160);
    expected[p] = v;
    const rgb = [v, Math.round(v * 0.55), Math.round(v * 0.2)],
      rotation = (x + y) % 3;
    image.data.set([...rgb.slice(rotation), ...rgb.slice(0, rotation), 255], p * 4);
    changed.data.set([v, v, Math.round(v * 0.8), 255], p * 4);
    const value = Math.round(0.75 * v + 13);
    controlled.data.set([value, Math.round(value * 0.7), Math.round(value * 0.6), 255], p * 4);
  }
assert.deepEqual(frameValue(image), expected);
assert.deepEqual(
  frameValue(changed),
  expected,
  'Changing hue/saturation must not move the frame value field',
);
const changedGray = luminance(changed);
assert(luminance(image).some((v, i) => Math.abs(v - changedGray[i]) > 25));
const windows = { left: ['x', 12, 27, [130, 210, 290], 8] };
const bounds = { left: [0, 33] };
const a = modernValueFramePatches(image, windows, bounds),
  b = modernValueFramePatches(changed, windows, bounds),
  c = modernValueFramePatches(controlled, windows, bounds);
assert.deepEqual(a, b, 'Hue/saturation invariance must hold before the native filter');
for (let k = 0; k < a.length; k++)
  for (let i = 0; i < a[k].values.length; i++)
    assert(
      Math.abs(c[k].values[i] - (a[k].values[i] * 0.75 + 13)) <= 0.5001,
      'Linear filtering must retain affine value gain/offset within input quantization',
    );
const gray = { ...image, data: image.data.slice() };
for (let p = 0; p < expected.length; p++)
  gray.data.set([expected[p], expected[p], expected[p], 255], p * 4);
const old = nativeFramePatches(gray, windows, bounds),
  same = modernValueFramePatches(gray, windows, bounds);
for (let k = 0; k < old.length; k++)
  for (let i = 0; i < old[k].values.length; i++)
    assert(Math.abs(old[k].values[i] - same[k].values[i]) < 1e-4);
assert.throws(() => frameValue({ ...image, data: new Uint8Array(1) }), /complete RGBA/);
console.log(
  'Frame-value channel: independent hue/saturation controls, affine-value filter covariance, gray-channel parity and malformed-size rejection pass.',
);
