import assert from 'node:assert/strict';
import {
  frameProfiles,
  stockBounds,
  sharedRegistration,
  PROFILE_WINDOWS,
} from '../games/magic/tools/accuracy/frame-family-metrics.mjs';
import {
  scoreOpaqueFamily,
  opaqueSupport,
} from '../games/magic/tools/accuracy/frame-family-score.mjs';
const line = (inside = 128, offset = 0) =>
  Array.from({ length: 36 }, (_, x) => (x < 10 + offset ? 160 : x < 13 + offset ? 10 : inside));
const profiles = () =>
  Object.fromEntries(
    Object.keys(PROFILE_WINDOWS).map((k) => [
      k,
      [0, 1, 2].map(() =>
        k.endsWith('Right') || k.endsWith('Bottom') ? [...line()].reverse() : line(),
      ),
    ]),
  );
const a = profiles(),
  b = structuredClone(a);
const support = Object.fromEntries(
  Object.keys(a).map((k) => [
    k,
    !k.startsWith('art')
      ? [0, 36]
      : k.endsWith('Right') || k.endsWith('Bottom')
        ? [23, 36]
        : [0, 13],
  ]),
);
for (const k of Object.keys(b))
  for (const p of b[k]) {
    if (!k.startsWith('art')) {
      for (let i = 0; i < p.length; i++) p[i] = p[i] * 0.7 + 20;
      continue;
    }
    const [lo, hi] = support[k];
    for (let i = 0; i < p.length; i++) if (i < lo || i >= hi) p[i] = i % 5 ? 255 : 0;
  }
// Extreme internal artwork edges cannot change a frame-only comparison.
assert.ok(scoreOpaqueFamily(a, b, support).score > 0.999);
const weak = structuredClone(a);
weak.rulesLeft = weak.rulesLeft.map((p) => p.map(() => 128));
assert.equal(scoreOpaqueFamily(a, weak, support).regions.rulesLeft.score, 0);
assert.ok(scoreOpaqueFamily(a, weak, support).score < scoreOpaqueFamily(a, a, support).score);
const moved = structuredClone(a);
moved.artLeft = moved.artLeft.map(() => line(128, 4));
assert.ok(
  scoreOpaqueFamily(a, moved, support).score < scoreOpaqueFamily(a, a, support).score - 0.05,
);
const width = 488,
  height = 680,
  data = new Uint8Array(width * height * 4);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    let v = x >= 24 && x < 464 && y >= 28 && y < 653 ? 170 : 8;
    data.set([v, v, v, 255], (y * width + x) * 4);
  }
const measured = stockBounds({ width, height, data }, 'black');
assert.ok(measured.reliable);
assert.ok(Math.abs(measured.width - 440) < 1);
const samples = Array.from({ length: 12 }, (_, i) => ({
  cohort: i < 8 ? 'calibration' : 'validation',
  material: 'WUBG'[i % 4],
  bounds: measured,
}));
const registration = sharedRegistration(samples);
assert.equal(registration.status, 'accepted');
assert.ok(Math.abs(registration.transform.scale - 1) < 0.003);
assert.equal(frameProfiles({ width, height, data }).artLeft.length, 3);
const plate = { width, height, data: new Uint8Array(data).fill(255) };
for (let y = 0; y < height; y++)
  for (let x = 60; x < 430; x++) plate.data[(y * width + x) * 4 + 3] = 0;
const mask = opaqueSupport([plate]);
// Expanding/moving an aperture must reduce the shared comparison support.
// Otherwise a source transform can turn illustration detail into frame evidence.
const wider = { width, height, data: new Uint8Array(data).fill(255) };
for (let y = 0; y < height; y++)
  for (let x = 55; x < 435; x++) wider.data[(y * width + x) * 4 + 3] = 0;
const intersection = opaqueSupport([plate, wider]);
assert.ok(intersection.artLeft[1] < mask.artLeft[1]);
assert.ok(intersection.artRight[0] > mask.artRight[0]);
assert.deepEqual(opaqueSupport([wider, plate]), intersection);
assert.deepEqual(mask.artLeft, [0, 15]); // 43..57; two-pixel erosion from alpha edge.
console.log(
  'Frame-family metrics: art exclusion, color shifts, fixed support, displaced borders and shared registration pass.',
);
