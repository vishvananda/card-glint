import assert from 'node:assert/strict';
import { sagaRegistration } from '../games/magic/tools/accuracy/saga-registration.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';
import {
  projectScanPoint,
  inverseScanMatrix,
} from '../games/magic/tools/accuracy/scan-transform.mjs';
const width = 488,
  height = 680,
  data = new Uint8Array(width * height * 4);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const inside = x >= 20 && x < 469 && y >= 20 && y < 618;
    data.set(inside ? [190, 175, 165, 255] : [8, 8, 8, 255], (y * width + x) * 4);
  }
const template = { width, height, data };
for (const transform of [
  { tx: 1.5, ty: -1.5, scale: 1.004 },
  { rotation: 0.003, scale: 0.998, tx: -1, ty: 1 },
]) {
  const reference = normalize(template, transform),
    fit = sagaRegistration(reference, template);
  assert.equal(fit.accepted, true, JSON.stringify(fit));
  for (const [x, y] of [
    [30, 30],
    [450, 600],
  ]) {
    const observed = projectScanPoint(x, y, transform),
      restored = projectScanPoint(...observed, fit.transform);
    assert.ok(
      Math.hypot(restored[0] - x, restored[1] - y) < 0.6,
      JSON.stringify({ restored, x, y }),
    );
  }
  // Alter all artwork and rule pixels. Registration must be unchanged.
  for (let y = 85; y < 565; y++)
    for (let x = 60; x < 450; x++)
      reference.data.set([x % 255, y % 255, 0, 255], (y * width + x) * 4);
  assert.deepEqual(sagaRegistration(reference, template).transform, fit.transform);
}
assert.equal(sagaRegistration(normalize(template, { tx: 20 }), template).accepted, false);
const missing = { width, height, data: new Uint8Array(width * height * 4) };
assert.equal(sagaRegistration(missing, template).accepted, false);
console.log(
  'Saga registration recovers scale/rotation, ignores content and rejects missing/out-of-range frames',
);
