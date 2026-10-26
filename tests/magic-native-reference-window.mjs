import assert from 'node:assert/strict';
import { nativeReferenceWindow } from '../games/magic/tools/accuracy/native-reference-window.mjs';
import { normalizedRgbaRegion } from '../games/magic/tools/accuracy/normalized-rgba-region.mjs';
const width = 732,
  height = 1020,
  data = new Uint8Array(width * height * 4);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++)
    data.set([x % 251, y % 241, (x + y) % 239, 255], (y * width + x) * 4);
const image = { width, height, data },
  rect = [42, 614, 346, 40],
  native = nativeReferenceWindow(image, rect);
assert.equal(native.width, 519);
assert.equal(native.height, 60);
for (let y = 0; y < native.height; y++)
  for (let x = 0; x < native.width; x++)
    assert.deepEqual(
      native.data.subarray((y * native.width + x) * 4, (y * native.width + x) * 4 + 4),
      data.subarray(((y + 921) * width + x + 63) * 4, ((y + 921) * width + x + 63) * 4 + 4),
    );
for (const transform of [{}, { matrix: [1.002, 0.003, -0.001, 0.998, 0.5, -0.25] }]) {
  const a = nativeReferenceWindow(image, [38, 610, 58, 42], transform, 1),
    b = normalizedRgbaRegion(image, [38, 610, 58, 42], transform);
  assert.deepEqual(a, b);
}
const moved = nativeReferenceWindow(image, [42, 614, 12, 10], { matrix: [1, 0, 0, 1, 2, -2] }, 1.5);
for (let y = 0; y < moved.height; y++)
  for (let x = 0; x < moved.width; x++) {
    const p = (y * moved.width + x) * 4,
      q = ((y + 924) * width + x + 60) * 4;
    assert.deepEqual(moved.data.subarray(p, p + 4), data.subarray(q, q + 4));
  }
assert.throws(() => nativeReferenceWindow(image, [0, 0, 500, 20]));
assert.throws(() => nativeReferenceWindow(image, [42, 614, 12, 10], {}, 0));
console.log(
  'Native scan windows preserve source pixels and top-down channels at732px,match the canonical sampler at488px,and recover known affine translations without a double resample.',
);
