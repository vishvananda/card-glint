import assert from 'node:assert/strict';
import { nativeTextWindow } from '../games/magic/tools/accuracy/native-text-window.mjs';
import { nativeGrayCrop } from '../games/magic/tools/accuracy/abu-type-objective.mjs';

let seed = 124553;
const noise = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed >>> 24;
};
for (const [rect, origin, size] of [
  [
    [54, 405, 390, 197],
    [0, 0],
    [732, 1020],
  ],
  [
    [29, 33, 387, 34],
    [27, 33],
    [615, 85],
  ],
  [
    [29, 378, 417, 25],
    [27, 551],
    [660, 72],
  ],
  [
    [36, 607, 350, 39],
    [38, 894],
    [559, 93],
  ],
  [
    [11.25, 14.5, 30, 40],
    [0, 0],
    [100, 100],
  ],
]) {
  const [width, height] = size;
  const data = Uint8ClampedArray.from({ length: width * height * 4 }, noise);
  const full = { width, height, data };
  const window = nativeTextWindow(rect, origin, size);
  const crop = {
    width: window.width,
    height: window.height,
    data: new Uint8ClampedArray(window.width * window.height * 4),
  };
  for (let y = 0; y < window.height; y++)
    crop.data.set(
      data.subarray(
        ((window.y + y) * width + window.x) * 4,
        ((window.y + y) * width + window.x + window.width) * 4,
      ),
      y * window.width * 4,
    );
  assert.deepEqual(nativeGrayCrop(crop, rect, window.origin), nativeGrayCrop(full, rect, origin));
  assert(window.width * window.height < width * height);
}
for (const args of [
  [
    [-1, 0, 4, 4],
    [0, 0],
    [10, 10],
  ],
  [
    [5, 5, 0, 3],
    [0, 0],
    [10, 10],
  ],
  [
    [5, 5, 3.5, 3],
    [0, 0],
    [10, 10],
  ],
  [
    [5, 5, 3, 3],
    [0, 0],
    [10, 10],
  ],
  [
    [NaN, 5, 3, 3],
    [0, 0],
    [100, 100],
  ],
])
  assert.throws(() => nativeTextWindow(...args), RangeError);
console.log(
  'Native typography crop readback matches full readback exactly, including translated and fractional sampling.',
);
