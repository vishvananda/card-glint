import assert from 'node:assert/strict';
import {
  measureRetroBevel,
  compareRetroBevelShadow,
} from '../games/magic/tools/accuracy/retro-bevel-ink.mjs';
function fixture({
  reversed = false,
  offset = 0,
  tone = 0,
  gain = 1,
  grain = 0,
  missing = false,
} = {}) {
  const width = 488,
    height = 680,
    data = Buffer.alloc(width * height * 4),
    left = 51 + offset,
    right = 438 + offset,
    top = 407 + offset,
    bottom = 603 + offset;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      let l = 100;
      if (x >= left && x <= right && y >= top && y <= bottom) {
        l = 170;
        if (x === left || x === right || y === top || y === bottom) l = 20;
        else if (x < left + 6 || y > bottom - 6) l = reversed ? 130 : 210;
        else if (x > right - 6 || y < top + 6) l = reversed ? 210 : 130;
      }
      if (missing) l = 170;
      l = Math.min(255, Math.max(0, l * gain + tone + (((x * 17 + y * 31) % 13) - 6) * grain));
      const i = (y * width + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = l;
      data[i + 3] = 255;
    }
  return { width, height, data };
}
for (const options of [{}, { offset: 2 }, { offset: -2 }, { tone: 20, gain: 0.7, grain: 1 }])
  assert.ok(
    Object.values(measureRetroBevel(fixture(options))).every((s) => s.status === 'matches'),
  );
assert.ok(
  Object.values(measureRetroBevel(fixture({ reversed: true }))).every(
    (s) => s.status === 'reversed',
  ),
);
assert.ok(
  Object.values(measureRetroBevel(fixture({ missing: true }))).every(
    (s) => s.status.endsWith('uncertain') || s.status.startsWith('weak-'),
  ),
);
function shadow({ gain = 1, white = 0, shift = 0 } = {}) {
  const image = fixture();
  for (let y = 0; y < image.height; y++) {
    const sourceY = y - shift;
    const value = (sourceY > 470 && sourceY < 510 ? 45 : 155) + 8 * Math.sin(sourceY / 12);
    const result = Math.min(255, Math.max(0, value * gain * (1 - white) + 255 * white));
    const i = (y * image.width + 55) * 4;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = result;
  }
  return image;
}
assert.equal(compareRetroBevelShadow(shadow(), shadow({ gain: 1.35 })).status, 'preserved');
assert.equal(compareRetroBevelShadow(shadow(), shadow({ white: 0.5 })).status, 'texture-changed');
assert.equal(compareRetroBevelShadow(shadow(), shadow({ shift: 15 })).status, 'texture-changed');
assert.equal(compareRetroBevelShadow(fixture(), fixture()).status, 'weak-texture');
console.log(
  'Retro bevel polarity tolerates tone/grain/translation; shadow profiles reject shifted or washed-out texture and retain multiplicative lighting.',
);
