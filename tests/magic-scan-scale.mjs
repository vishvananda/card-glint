import assert from 'node:assert/strict';
import { estimateScanScale, frameDimensions } from '../games/magic/tools/accuracy/scan-scale.mjs';
import { scanTranslation } from '../games/magic/tools/accuracy/scan-translation.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels.mjs';
const anchors = [
  ['artTop', 'y', 67],
  ['artBottom', 'y', 381],
  ['outerLeft', 'x', 19],
  ['outerRight', 'x', 468],
  ['rulesBottom', 'y', 628],
];
const template = anchors.flatMap(([group, axis, position]) =>
  Array.from({ length: 3 }, () => ({ group, axis, position, status: 'measured' })),
);
function samples(scale = 1, verticalScale = scale, missing = false) {
  return ['U', 'B', 'R', 'G'].flatMap((bucket, b) =>
    Array.from({ length: 3 }, (_, i) => {
      const dx = b - 1,
        dy = i - 1;
      const landmarks = template.map((p) => ({
        ...p,
        position:
          (p.position - (p.axis === 'x' ? 244 : 340)) * (p.axis === 'x' ? scale : verticalScale) +
          (p.axis === 'x' ? 244 + dx : 340 + dy),
        status: missing ? 'missing' : 'measured',
      }));
      return {
        id: `${bucket}${i}`,
        bucket,
        cohort: i < 2 ? 'calibration' : 'validation',
        dimensions: frameDimensions(landmarks),
        landmarks,
      };
    }),
  );
}
for (const scale of [0.992, 1, 1.008]) {
  const input = samples(scale),
    profile = estimateScanScale(input, template);
  assert.equal(profile.status, 'accepted');
  assert.ok(Math.abs(profile.scale - 1 / scale) < 1e-10);
  for (const row of input) {
    const scaled = row.landmarks.map((p) => ({
      ...p,
      position:
        (p.position - (p.axis === 'x' ? 244 : 340)) * profile.scale + (p.axis === 'x' ? 244 : 340),
    }));
    const translation = scanTranslation(scaled, template);
    for (const axis of ['x', 'y']) assert.equal(translation.axes[axis].status, 'accepted');
  }
}
// Horizontal stretching must not be mislabeled a uniform scan zoom.
assert.equal(
  estimateScanScale(samples(1.008, 1), template).status,
  'inconsistent-vertical-geometry',
);
assert.equal(estimateScanScale(samples(1.04), template).status, 'scale-out-of-bounds');
assert.equal(estimateScanScale(samples(1, 1, true), template).status, 'insufficient-landmarks');
const badValidation = samples();
for (const row of badValidation.filter((r) => r.cohort === 'validation'))
  row.dimensions.outerWidth += 4;
assert.equal(estimateScanScale(badValidation, template).status, 'inconsistent-scale');
// The final image transform combines zoom and offset in a single resampling pass.
const data = new Uint8Array(488 * 680 * 4);
for (let y = 90; y < 150; y++)
  for (let x = 70; x < 100; x++) data.set([255, 255, 255, 255], (y * 488 + x) * 4);
const transformed = normalize({ width: 488, height: 680, data }, { scale: 1.01, tx: 2, ty: -1 });
const center = (axis) => {
  let total = 0,
    weighted = 0;
  for (let y = 0; y < 680; y++)
    for (let x = 0; x < 488; x++) {
      const v = transformed.data[(y * 488 + x) * 4 + 3];
      total += v;
      weighted += v * (axis === 'x' ? x : y);
    }
  return weighted / total;
};
assert.ok(Math.abs(center('x') - ((84.5 - 244) * 1.01 + 244 + 2)) < 0.1);
assert.ok(Math.abs(center('y') - ((119.5 - 340) * 1.01 + 340 - 1)) < 0.1);
console.log(
  'Shared scan scale: known zoom/translation, held-out rejection, aspect conflict, missing anchors and single-pass transform passed.',
);
