import assert from 'node:assert/strict';
import { splitRegistration } from '../games/magic/tools/accuracy/split-registration.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';
import { projectScanPoint } from '../games/magic/tools/accuracy/scan-transform.mjs';
const width = 488,
  height = 680,
  data = new Uint8Array(width * height * 4);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const inside = x >= 23 && x < 464 && y >= 23 && y < 657 && (y < 336 || y > 351);
    data.set(inside ? [190, 175, 165, 255] : [8, 8, 8, 255], (y * width + x) * 4);
  }
const template = { width, height, data };
for (const transform of [
  { tx: 1.5, ty: -1.5, scale: 1.004 },
  { rotation: 0.003, scale: 0.998, tx: -1, ty: 1 },
]) {
  const reference = normalize(template, transform),
    fit = splitRegistration(reference, template);
  assert.ok(fit.accepted, JSON.stringify(fit));
  for (const [x, y] of [
    [30, 30],
    [450, 600],
  ]) {
    const observed = projectScanPoint(x, y, transform),
      restored = projectScanPoint(...observed, fit.transform);
    assert.ok(Math.hypot(restored[0] - x, restored[1] - y) < 0.6);
  }
  for (let y = 40; y < 630; y++)
    for (let x = 35; x < 450; x++)
      reference.data.set([x % 255, y % 255, 0, 255], (y * width + x) * 4);
  assert.deepEqual(
    splitRegistration(reference, template).transform,
    fit.transform,
    'Art and text cannot influence scan registration',
  );
}
assert.equal(splitRegistration(normalize(template, { tx: 20 }), template).accepted, false);
assert.equal(
  splitRegistration({ width, height, data: new Uint8Array(width * height * 4) }, template).accepted,
  false,
);
const modern = { width, height, data: Uint8Array.from(data) };
for (let y = 628; y < height; y++)
  for (let x = 0; x < width; x++) modern.data.set([8, 8, 8, 255], (y * width + x) * 4);
const scan = normalize(modern, { tx: 1, ty: -1, scale: 1.002 }),
  clean = splitRegistration(scan, modern, true);
assert.ok(clean.accepted, JSON.stringify(clean));
for (let y = 610; y < 650; y++)
  for (let x = 212; x <= 278; x++)
    scan.data.set([x % 255, y % 255, (x * y) % 255, 255], (y * width + x) * 4);
assert.deepEqual(
  splitRegistration(scan, modern, true),
  clean,
  'Modern split registration excludes the entire authenticity-stamp footprint',
);
console.log(
  'Split frame-only registration recovers scale/rotation and rejects absent or out-of-range frames',
);
