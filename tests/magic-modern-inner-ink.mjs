import assert from 'node:assert/strict';
import { measureArtRimInk } from '../games/magic/tools/accuracy/modern-inner-ink-audit.mjs';
const image = () => ({
  width: 488,
  height: 680,
  data: new Uint8ClampedArray(488 * 680 * 4).fill(255),
});
const ridge = (im, x, rgb, begin = 90, end = 355) => {
  for (let y = begin; y < end; y++) im.data.set([...rgb, 255], (y * 488 + x) * 4);
};
const exact = image();
ridge(exact, 37, [22, 19, 14]);
ridge(exact, 450, [22, 19, 14]);
const a = measureArtRimInk(exact);
for (const side of ['left', 'right']) {
  assert.equal(a[side].status, 'measured');
  assert.deepEqual(a[side].rgb, [22, 19, 14]);
  assert.equal(a[side].strips.length, 3);
}
const weak = measureArtRimInk(image());
assert.equal(weak.left.status, 'uncertain');
assert.equal(weak.right.rgb, null);
const partial = image();
ridge(partial, 37, [0, 0, 0], 100, 140);
assert.equal(measureArtRimInk(partial).left.status, 'uncertain');
const ambiguous = image();
ridge(ambiguous, 35, [10, 10, 10]);
ridge(ambiguous, 40, [10, 10, 10]);
assert.equal(measureArtRimInk(ambiguous).left.status, 'uncertain');
// Sparse dark print specks must not pull the complete-column median to zero.
const noise = image();
ridge(noise, 37, [22, 19, 14]);
ridge(noise, 450, [22, 19, 14]);
for (let y = 105; y < 345; y += 7) noise.data.set([0, 0, 0, 255], (y * 488 + 38) * 4);
assert.deepEqual(measureArtRimInk(noise).left.rgb, [22, 19, 14]);
// A candidate's weaker contrast cannot shrink the comparison denominator or
// move sampling to a neighboring dark illustration column.
const changed = image();
ridge(changed, 37, [30, 29, 28]);
ridge(changed, 450, [30, 29, 28]);
ridge(changed, 38, [0, 0, 0]);
ridge(changed, 449, [0, 0, 0]);
const frozen = measureArtRimInk(changed, a);
for (const side of ['left', 'right']) {
  assert.equal(frozen[side].status, a[side].status);
  assert.deepEqual(frozen[side].rgb, [30, 29, 28]);
  assert.deepEqual(
    frozen[side].strips.map((s) => s.x),
    a[side].strips.map((s) => s.x),
  );
}
console.log(
  'Modern inner rim measurement: exact, weak, incomplete, ambiguous and print-noise cases pass',
);
