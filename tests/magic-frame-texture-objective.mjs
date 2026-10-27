import assert from 'node:assert/strict';
import {
  FrameTexturePatch,
  FrameTextureObjective,
  grayFrameTexturePatch,
} from '../games/magic/tools/accuracy/frame-texture-objective.mjs';
const field = (x, y) =>
  110 + 28 * Math.sin(0.7 * x + 0.13 * y) + 19 * Math.cos(0.41 * y - 0.08 * x);
const values = Array.from({ length: 720 }, (_, i) => field(i % 20, Math.floor(i / 20)));
const patch = new FrameTexturePatch(values),
  objective = new FrameTextureObjective(patch);
assert(Math.abs(objective.score(patch).score - 1) < 1e-12);
const exposure = new FrameTexturePatch(values.map((v) => 17 + 0.8 * v));
assert(Math.abs(objective.score(exposure).score - 1) < 1e-12);
const shifted = new FrameTexturePatch(
  Array.from({ length: 720 }, (_, i) => field((i % 20) - 0.75, Math.floor(i / 20) + 0.5)),
);
const identity = objective.score(shifted).score,
  aligned = objective.score(shifted, 0.75, -0.5).score;
assert(aligned > 0.995);
assert(aligned > identity + 0.02);
let best = { score: -Infinity };
for (let y = -1.5; y <= 1.5; y += 0.25)
  for (let x = -1.5; x <= 1.5; x += 0.25) {
    const r = objective.score(shifted, x, y);
    if (r.score > best.score) best = { ...r, x, y };
  }
assert.deepEqual([best.x, best.y], [0.75, -0.5]);
const flat = new FrameTexturePatch(Array(720).fill(120));
assert.equal(new FrameTextureObjective(flat).score(flat).score, 0);
assert.equal(new FrameTextureObjective(flat).score(flat).templateStd, 0);
const broken = new FrameTexturePatch(values.map((v, i) => (i % 20 < 10 ? v : 80)));
assert(objective.score(broken).score < 0.9);
for (const values of [[], Array(719).fill(0), Array(720).fill(NaN), Array(720)])
  assert.throws(() => new FrameTexturePatch(values), /finite/);
for (const offsets of [
  [3, 0],
  [0, -2.001],
  [Infinity, 0],
  [0, NaN],
])
  assert.throws(() => objective.score(patch, ...offsets), /safe margin/);
assert.throws(() => objective.score(values), /Unprepared/);
assert.throws(
  () => grayFrameTexturePatch({ width: 21, height: 36, data: new Uint8Array(3024) }),
  /RGBA/,
);
const image = { width: 20, height: 36, data: new Uint8Array(2880) };
for (let i = 0; i < 720; i++) image.data.set([90, 120, 180, 255], i * 4);
const gray = grayFrameTexturePatch(image);
assert.equal(gray.length, 720);
assert(gray.every((v) => Math.abs(v - (0.2126 * 90 + 0.7152 * 120 + 0.0722 * 180)) < 1e-5));
console.log(
  'Frame texture: fractional displacement, affine exposure, exact matches, flat/missing texture,and invalid data/margins pass.',
);
