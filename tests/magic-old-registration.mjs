import assert from 'node:assert/strict';
import { fitSharedStockRegistration } from '../games/magic/tools/accuracy/old-frame-registration.mjs';
import { stockBounds } from '../games/magic/tools/accuracy/frame-family-metrics.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels.mjs';

const bounds = (cx, cy, width, height) => ({
  reliable: true,
  width,
  height,
  sides: Object.fromEntries(
    Object.entries({
      left: cx - width / 2,
      right: cx + width / 2,
      top: cy - height / 2,
      bottom: cy + height / 2,
    }).map(([side, position]) => [side, { position, reliable: true, count: 3, spread: 0 }]),
  ),
});
const targets = Object.fromEntries(
  ['W', 'U', 'B'].map((material, i) => [
    material,
    bounds(242.5 + i / 10, 339 - i / 10, 440 + i / 4, 629 + i / 4),
  ]),
);
const expected = { scale: 1.011, tx: -1.7, ty: 2.1 };
const rows = [];
for (const cohort of ['calibration', 'validation'])
  for (const [material, target] of Object.entries(targets))
    for (const noise of [-0.2, 0, 0.2]) {
      const cx = (target.sides.left.position + target.sides.right.position) / 2;
      const cy = (target.sides.top.position + target.sides.bottom.position) / 2;
      rows.push({
        id: `${cohort}-${material}-${noise}`,
        cohort,
        material,
        bounds: bounds(
          244 + (cx - 244 - expected.tx) / expected.scale + noise,
          340 + (cy - 340 - expected.ty) / expected.scale - noise,
          target.width / expected.scale,
          target.height / expected.scale,
        ),
      });
    }
const fit = fitSharedStockRegistration(rows, targets);
assert.equal(fit.status, 'accepted');
for (const key of Object.keys(expected))
  assert.ok(Math.abs(fit.transform[key] - expected[key]) < 1e-10);
assert.ok(fit.validation.afterRms < fit.validation.beforeRms / 5);

// Held-out displacement rejects a frozen fit instead of refitting it. There is
// still exactly one proposed transform, independent of held-out pixels.
const changed = structuredClone(rows);
for (const row of changed.filter((r) => r.cohort === 'validation'))
  for (const side of ['left', 'right']) row.bounds.sides[side].position += 9;
const rejected = fitSharedStockRegistration(changed, targets);
assert.deepEqual(rejected.proposed, fit.proposed);
assert.equal(rejected.accepted, false);
assert.equal(rejected.transform, null);
assert.ok(rejected.flags.includes('validation-excessive-residual'));

// Coherent source aspect mismatch is reported separately. We never stretch x
// and y independently merely to make all four sides appear coincident.
const mismatchTargets = Object.fromEntries(
  ['W', 'U', 'B'].map((m) => [m, bounds(242.6, 338.8, 440.8, 629.6)]),
);
const mismatchRows = rows.map((r) => ({ ...r, bounds: bounds(243.55, 339.65, 442.1, 625.4) }));
const mismatch = fitSharedStockRegistration(mismatchRows, mismatchTargets);
assert.equal(mismatch.accepted, true);
assert.deepEqual(mismatch.geometryFlags, ['remaining-opposed-stock-residual']);
assert.ok(mismatch.validation.afterRms < mismatch.validation.beforeRms);
assert.ok(mismatch.validation.residuals.left < -1 && mismatch.validation.residuals.right > 1);
assert.deepEqual(Object.keys(mismatch.transform).sort(), ['scale', 'tx', 'ty']);

// Missing, weak and sparse material anchors cannot silently become identity.
const sparse = fitSharedStockRegistration(
  rows.filter((r) => r.material !== 'B'),
  targets,
);
assert.equal(sparse.status, 'insufficient-outer-anchors');
assert.equal(sparse.transform, null);
const weak = rows.map((r) => ({ ...r, bounds: { ...r.bounds, reliable: false } }));
assert.equal(fitSharedStockRegistration(weak, targets).accepted, false);

// Over-representing a color does not change the shared material-balanced fit.
assert.deepEqual(
  fitSharedStockRegistration([...rows, ...rows.filter((r) => r.material === 'W')], targets)
    .proposed,
  fit.proposed,
);

// The profile's transform convention must agree with the actual resampler,
// including its centered scale and subpixel translation (not origin scaling).
const pixels = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) };
for (let y = 0; y < 680; y++)
  for (let x = 0; x < 488; x++) {
    const value = x >= 24 && x < 464 && y >= 28 && y < 653 ? 80 : 240;
    pixels.data.set([value, value, value, 255], (y * 488 + x) * 4);
  }
const raw = stockBounds(pixels, 'white'),
  transform = { scale: 1.011, tx: -1.25, ty: 0.5 },
  aligned = stockBounds(normalize(pixels, transform), 'white');
assert.ok(raw.reliable && aligned.reliable);
for (const side of ['left', 'right', 'top', 'bottom']) {
  const x = side === 'left' || side === 'right';
  const origin = x ? 244 : 340;
  const expected =
    origin +
    transform.scale * (raw.sides[side].position - origin) +
    (x ? transform.tx : transform.ty);
  assert.ok(Math.abs(aligned.sides[side].position - expected) < 0.15, side);
}
console.log(
  'Old-frame registration: known scale/translation, frozen held-out validation, aspect diagnostics and material balance pass.',
);
