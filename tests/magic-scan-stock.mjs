import assert from 'node:assert/strict';
import { fitScanStockRegistration } from '../games/magic/tools/accuracy/scan-stock-registration.mjs';
const bounds = (positions) => ({
  reliable: true,
  sides: Object.fromEntries(
    Object.entries(positions).map(([key, position]) => [key, { position, reliable: true }]),
  ),
});
const target = bounds({ left: 25, right: 465, top: 26, bottom: 653 });
function scan(transform) {
  return bounds(
    Object.fromEntries(
      Object.entries(target.sides).map(([side, { position }]) => {
        const horizontal = side === 'left' || side === 'right',
          center = horizontal ? 244 : 340;
        return [
          side,
          center +
            (position - center - (horizontal ? transform.tx : transform.ty)) / transform.scale,
        ];
      }),
    ),
  );
}
for (const expected of [
  { scale: 1, tx: 0, ty: 0 },
  { scale: 1.013, tx: 2.4, ty: -1.8 },
  { scale: 0.989, tx: -2.1, ty: 3.7 },
]) {
  const fit = fitScanStockRegistration(scan(expected), target);
  assert.equal(fit.accepted, true);
  for (const key of ['scale', 'tx', 'ty'])
    assert.ok(Math.abs(fit.transform[key] - expected[key]) < 1e-10);
}
assert.equal(
  fitScanStockRegistration(scan({ scale: 1.03, tx: 0, ty: 0 }), target).reason,
  'excessive-scan-pose',
);
assert.equal(
  fitScanStockRegistration(scan({ scale: 1, tx: 8, ty: 0 }), target).reason,
  'excessive-scan-pose',
);
assert.equal(
  fitScanStockRegistration(bounds({ left: 20, right: 470, top: 26, bottom: 653 }), target).reason,
  'frame-aspect-disagreement',
);
const weak = structuredClone(target);
weak.sides.left.reliable = false;
assert.equal(fitScanStockRegistration(weak, target).transform, null);
assert.equal(fitScanStockRegistration(target, weak).transform, null);
assert.equal(fitScanStockRegistration(null, target).transform, null);
console.log(
  'Per-scan stock registration: translation/scale recovery, pose bounds, aspect disagreement and weak-anchor rejection pass.',
);
