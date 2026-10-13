import assert from 'node:assert/strict';
import { normalize } from '../games/magic/tools/accuracy/pixels.mjs';
import {
  plateProfiles,
  fitScanResidual,
  composeScanTransform,
} from '../games/magic/tools/accuracy/printed-plate-registration.mjs';
const reference = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) };
for (let y = 0; y < 680; y++)
  for (let x = 0; x < 488; x++) {
    const inside = x >= 27 && x < 462 && y >= 29 && y < 650;
    const bevel = inside && (x < 29 || x >= 460 || y < 31 || y >= 648);
    const v = bevel ? 150 : inside ? 95 : 25;
    reference.data.set([v, v, v, 255], (y * 488 + x) * 4);
  }
const expected = { scale: 1.003, tx: 1.2, ty: -0.6 };
const displaced = normalize(reference, {
  scale: 1 / expected.scale,
  tx: -expected.tx / expected.scale,
  ty: -expected.ty / expected.scale,
});
for (let i = 0; i < displaced.data.length; i += 4)
  for (let c = 0; c < 3; c++) displaced.data[i + c] = 30 + displaced.data[i + c] * 0.7;
const target = plateProfiles(reference),
  result = fitScanResidual(plateProfiles(displaced), target);
assert.equal(result.accepted, true);
assert.ok(Math.abs(result.transform.scale - expected.scale) < 0.0007);
assert.ok(Math.abs(result.transform.tx - expected.tx) < 0.15);
assert.ok(Math.abs(result.transform.ty - expected.ty) < 0.15);
const edited = structuredClone(displaced);
for (let y = 410; y < 610; y++)
  for (let x = 55; x < 435; x++)
    edited.data.fill((x + y) % 255, (y * 488 + x) * 4, (y * 488 + x) * 4 + 3);
assert.deepEqual(
  plateProfiles(edited),
  plateProfiles(displaced),
  'Rules edits cannot influence scan alignment',
);
const extreme = normalize(reference, { tx: 6 });
assert.equal(fitScanResidual(plateProfiles(extreme), target).accepted, false);
assert.equal(
  fitScanResidual(
    target.map((p) => ({ ...p, gradient: p.gradient.map(() => 0) })),
    target,
  ).accepted,
  false,
);
const shared = { scale: 1.005, tx: -0.5, ty: 0.75 },
  composed = composeScanTransform(shared, result.transform);
for (const [p, center, axis] of [
  [28, 244, 'x'],
  [651, 340, 'y'],
]) {
  const sequential =
    center +
    shared.scale * (result.transform.scale * (p - center) + result.transform['t' + axis]) +
    shared['t' + axis];
  const direct = center + composed.scale * (p - center) + composed['t' + axis];
  assert.ok(Math.abs(sequential - direct) < 1e-9);
}
console.log(
  'Plate registration: subpixel scale/translation, brightness invariance, text isolation, bounded rejection and transform composition pass.',
);
