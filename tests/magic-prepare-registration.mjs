import assert from 'node:assert/strict';
import { prepareRegistration } from '../games/magic/tools/accuracy/prepare-registration.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';
import { projectScanPoint } from '../games/magic/tools/accuracy/scan-transform.mjs';
const width = 488,
  height = 680,
  data = new Uint8Array(width * height * 4);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++)
    data.set(
      x >= 20 && x < 469 && y >= 20 && y < 630 ? [190, 175, 165, 255] : [8, 8, 8, 255],
      (y * width + x) * 4,
    );
const template = { width, height, data };
for (const transform of [
  { tx: 1.5, ty: -1.5, scale: 1.004 },
  { rotation: 0.003, scale: 0.998, tx: -1, ty: 1 },
]) {
  const reference = normalize(template, transform),
    fit = prepareRegistration(reference, template);
  assert.ok(fit.accepted, JSON.stringify(fit));
  for (const [x, y] of [
    [30, 30],
    [450, 600],
  ]) {
    const observed = projectScanPoint(x, y, transform),
      restored = projectScanPoint(...observed, fit.transform);
    assert.ok(Math.hypot(restored[0] - x, restored[1] - y) < 0.6);
  }
  for (let y = 40; y < 610; y++)
    for (let x = 35; x < 450; x++)
      reference.data.set([x % 255, y % 255, 0, 255], (y * width + x) * 4);
  for (let y = 620; y < 640; y++)
    for (let x = 212; x < 278; x++) reference.data.set([255, 255, 255, 255], (y * width + x) * 4);
  assert.deepEqual(
    prepareRegistration(reference, template).transform,
    fit.transform,
    'Art, rules and authenticity stamp cannot move the frame fit',
  );
}
assert.equal(prepareRegistration(normalize(template, { tx: 20 }), template).accepted, false);
assert.equal(
  prepareRegistration({ width, height, data: new Uint8Array(width * height * 4) }, template)
    .accepted,
  false,
);
console.log(
  'Prepared frame registration recovers scale/rotation, excludes content and rejects unsupported scans',
);
