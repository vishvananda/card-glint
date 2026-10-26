import assert from 'node:assert/strict';
import { nativeRgbaCrop } from '../games/magic/tools/accuracy/native-rgba-crop.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';
const width = 732,
  height = 1020,
  data = new Uint8Array(width * height * 4);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++)
    data.set([x % 251, y % 239, (x * 3 + y) % 241, (x + y) % 253], (y * width + x) * 4);
const image = { width, height, data },
  canonical = normalize(image);
for (const rect of [
  [418, 29, 32, 32],
  [391, 29, 32, 32],
  [40, 610, 20, 22],
]) {
  const origin = [Math.floor(rect[0] * 1.5) - 1, Math.floor(rect[1] * 1.5) - 1],
    w = Math.ceil((rect[0] + rect[2]) * 1.5) + 1 - origin[0],
    h = Math.ceil((rect[1] + rect[3]) * 1.5) + 1 - origin[1],
    local = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const at = ((y + origin[1]) * width + x + origin[0]) * 4;
      local.set(data.subarray(at, at + 4), (y * w + x) * 4);
    }
  const full = nativeRgbaCrop(image, rect),
    crop = nativeRgbaCrop({ width: w, height: h, data: local }, rect, origin);
  assert.deepEqual(full, crop);
  for (let y = 0; y < rect[3]; y++)
    for (let x = 0; x < rect[2]; x++) {
      const at = ((rect[1] + y) * 488 + rect[0] + x) * 4;
      assert.deepEqual(
        crop.data.subarray((y * rect[2] + x) * 4, (y * rect[2] + x + 1) * 4),
        canonical.data.subarray(at, at + 4),
      );
    }
}
assert.throws(() => nativeRgbaCrop(image, [0, 0, 0, 1]));
assert.throws(() => nativeRgbaCrop(image, [1, 1, 2, 2], [0, 0], 0));
assert.throws(() => nativeRgbaCrop(image, [0, 0, 2, 2], [2, 2]));
console.log(
  'Native regional RGBA sampling matches full-card normalization exactly across both native origins,including alpha; invalid/padding controls reject.',
);
