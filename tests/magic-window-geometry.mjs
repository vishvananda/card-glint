import assert from 'node:assert/strict';
import {
  measureWindows,
  windowDifference,
} from '../games/magic/tools/accuracy/window-geometry.mjs';
const frame = ({ shift = 0, inset = 0, tone = 1, grain = 0, missing = false } = {}) => {
  const width = 488,
    height = 680,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const xx = x - shift;
      let v = 70;
      if (!missing && y > 80 && y < 375) {
        v = 150;
        if (Math.abs(xx - (37 + inset)) < 1 || Math.abs(xx - (451 - inset)) < 1) v = 10;
      }
      if (!missing && y > 425 && y < 630 && xx >= 35 + inset && xx < 452 - inset) v = 230;
      v = Math.max(0, Math.min(255, v * tone + grain * Math.sin(x * 17 + y * 23)));
      data.set([v, v, v, 255], (y * width + x) * 4);
    }
  return { width, height, data };
};
const base = measureWindows(frame());
for (const shift of [-1, 0, 1])
  for (const inset of [0, 1]) {
    const delta = windowDifference(
      base,
      measureWindows(frame({ shift, inset, tone: 0.75, grain: 3 })),
    );
    for (const component of ['art', 'rules']) {
      assert.equal(delta[component].status, 'measured');
      assert.ok(Math.abs(delta[component].center - shift) < 0.1);
      assert.ok(Math.abs(delta[component].width + 2 * inset) < 0.1);
    }
  }
assert.equal(
  windowDifference(base, measureWindows(frame({ missing: true }))).rules.status,
  'uncertain',
);
assert.throws(() => measureWindows({ width: 1, height: 1 }), /canonical/);
console.log(
  'Window measurements separate translation from width, tolerate tone/grain, and reject missing edges.',
);
