import assert from 'node:assert/strict';
import { reflowAbuPaperPanel } from '../games/magic/tools/accuracy/abu-paper-panel-pixels.mjs';
const width = 488,
  height = 680;
const make = () => ({
  width,
  height,
  data: Uint8ClampedArray.from({ length: width * height * 4 }, (_, i) => {
    const pixel = Math.floor(i / 4),
      x = pixel % width,
      y = Math.floor(pixel / width);
    return [y % 256, x % 256, 77, (x + y) % 256][i % 4];
  }),
});
const original = make(),
  image = make();
reflowAbuPaperPanel(image, { bottomUp: 0 });
assert.deepEqual(image, original);
reflowAbuPaperPanel(image, { bottomUp: 6, pad: 2 });
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    assert.equal(image.data[i + 3], original.data[i + 3]);
    if (x < 59 || x > 430 || y < 402 || y > 608)
      assert.deepEqual(image.data.subarray(i, i + 4), original.data.subarray(i, i + 4));
    assert.equal(image.data[i + 2], 77, 'Constant channels cannot gain seams');
  }
const at = (im, x, y, k = 0) => im.data[(y * width + x) * 4 + k];
assert.equal(at(image, 244, 405), at(original, 244, 405), 'Top cap is fixed');
assert.equal(at(image, 244, 595), at(original, 244, 601), 'Bottom cap translates without scaling');
assert.equal(
  at(image, 244, 604),
  at(original, 244, 610),
  'Exposed stock comes from adjacent prepared stock',
);
const bars = { width, height, data: new Uint8ClampedArray(width * height * 4) };
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    if (x >= 70 && x < 420 && ((y >= 405 && y < 411) || (y >= 600 && y < 606))) bars.data[i] = 255;
    if (x >= 61 && x < 63 && y >= 412 && y < 590) bars.data[i + 1] = 255;
    bars.data[i + 3] = 255;
  }
reflowAbuPaperPanel(bars, { bottomUp: 6, pad: 2 });
const redRows = Array.from({ length: height }, (_, y) => y).filter((y) => at(bars, 244, y) > 250);
assert.deepEqual(redRows, [405, 406, 407, 408, 409, 410, 594, 595, 596, 597, 598, 599]);
for (const y of [450, 500, 550]) {
  const cols = Array.from({ length: width }, (_, x) => x).filter((x) => at(bars, x, y, 1) > 250);
  assert.deepEqual(cols, [61, 62], 'Side width is independent of vertical reflow');
}
for (const bottomUp of [-1, 13, NaN, Infinity])
  assert.throws(() => reflowAbuPaperPanel(make(), { bottomUp }), /Invalid paper-panel trial/);
assert.throws(
  () => reflowAbuPaperPanel({ width, height, data: [] }, { bottomUp: 6 }),
  /Invalid paper-panel raster/,
);
console.log(
  'Paper panel trial: fixed cap/side widths, adjacent-stock restoration, exact identity/alpha/outside pixels, constant-channel seams and invalid inputs pass.',
);
