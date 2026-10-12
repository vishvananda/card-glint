import assert from 'node:assert/strict';
import {
  measureLowerFrame,
  lowerFrameDifference,
} from '../games/magic/tools/accuracy/lower-frame-geometry.mjs';

const windows = {
  top: 20,
  bottom: 58,
  spans: [
    [10, 15],
    [40, 15],
    [70, 15],
  ],
};
function fixture({
  shift = 0,
  scale = 1,
  lift = 0,
  gamma = 1,
  grain = 0,
  missing = false,
  extra = false,
} = {}) {
  const width = 100,
    height = 80,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const inner = 33 + shift,
        outer = 46 + shift;
      let value = y < inner ? 225 : y < inner + 3 ? 30 : y < outer ? (missing ? 30 : 145) : 15;
      if (extra && y >= 25 && y < 28) value = 30;
      value = Math.max(
        0,
        Math.min(
          255,
          255 * (value / 255) ** gamma * scale + lift + (((x * 13 + y * 7) % 7) - 3) * grain,
        ),
      );
      const p = (y * width + x) * 4;
      data[p] = value;
      data[p + 1] = value;
      data[p + 2] = value;
      data[p + 3] = 255;
    }
  return { width, height, data };
}
const reference = measureLowerFrame(fixture(), windows);
assert.ok(reference.every((r) => r.status === 'measured'));
for (const shift of [-4, 0, 4])
  for (const tone of [{}, { scale: 0.7, lift: 25 }, { gamma: 1.4 }, { grain: 2 }]) {
    const result = lowerFrameDifference(
      reference,
      measureLowerFrame(fixture({ shift, ...tone }), windows),
    );
    assert.ok(
      result.every(
        (r) =>
          r.status === 'measured' &&
          Math.abs(r.inner - shift) < 0.3 &&
          Math.abs(r.outer - shift) < 0.3,
      ),
    );
  }
assert.ok(
  measureLowerFrame(fixture({ missing: true }), windows).every(
    (r) => r.status !== 'measured' && r.outer === null,
  ),
);
assert.ok(
  measureLowerFrame(fixture({ extra: true }), windows).every((r) => r.status === 'ambiguous'),
);
assert.ok(measureLowerFrame(fixture({ shift: 12 }), windows).every((r) => r.status !== 'measured'));
assert.throws(() => measureLowerFrame(fixture(), { ...windows, top: -1 }), /windows/);
console.log(
  'Lower-frame landmarks separate inner/outer transitions and reject missing, competing or boundary edges.',
);
