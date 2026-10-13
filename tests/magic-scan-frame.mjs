import assert from 'node:assert/strict';
import { fitScanFrame } from '../games/magic/tools/accuracy/scan-frame-fit.mjs';
import {
  scanFrameAnchors,
  SCAN_ANCHOR_WINDOWS,
} from '../games/magic/tools/accuracy/scan-frame-anchors.mjs';
import {
  inverseScanMatrix,
  projectScanPoint,
  scanMatrix,
} from '../games/magic/tools/accuracy/scan-transform.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';

const positions = { left: 26, right: 464, top: 28, bottom: 652 },
  target = {
    reliable: true,
    sides: Object.fromEntries(
      Object.entries(positions).map(([side, position]) => [side, { reliable: true, position }]),
    ),
  };
function observed(transform, noise = 0) {
  const inverse = { matrix: inverseScanMatrix(transform) },
    points = [];
  for (const [side, spec] of Object.entries(SCAN_ANCHOR_WINDOWS))
    for (let index = 0; index < spec.count; index++) {
      const along = spec.start + spec.step * index,
        h = spec.axis === 'x',
        jitter = noise * Math.sin(index * 2.31);
      const [x, y] = projectScanPoint(
        h ? positions[side] + jitter : along,
        h ? along : positions[side] + jitter,
        inverse,
      );
      points.push({ side, index, cohort: index % 2 ? 'validation' : 'fit', along, x, y });
    }
  return { points };
}
for (const [transform, model] of [
  [{ scale: 1.003, tx: 1.2, ty: -2 }, 'translation-scale'],
  [{ scale: 0.998, rotation: 0.004, tx: -1, ty: 2 }, 'rotation'],
  [{ matrix: [1.002, 0.004, 0.002, 1.002, 1, -2] }, 'rotation-skew'],
]) {
  const result = fitScanFrame(observed(transform, 0.025), target);
  assert.equal(result.accepted, true);
  assert.equal(result.model, model);
  for (const [x, y] of [
    [30, 30],
    [450, 650],
    [420, 390],
  ]) {
    const expected = projectScanPoint(x, y, transform),
      actual = projectScanPoint(x, y, result.transform);
    assert.ok(Math.hypot(actual[0] - expected[0], actual[1] - expected[1]) < 0.02);
    const original = projectScanPoint(...actual, { matrix: result.inverse });
    assert.ok(Math.hypot(original[0] - x, original[1] - y) < 1e-8);
  }
}
// Tiny rotation below the independent improvement gate stays in the simple model.
assert.equal(fitScanFrame(observed({ rotation: 0.0001 }, 0.04), target).model, 'translation-scale');
assert.equal(fitScanFrame(observed({ scale: 1.08 }), target).accepted, false);
assert.equal(fitScanFrame(observed({ rotation: 0.04 }), target).accepted, false);
assert.equal(fitScanFrame(observed({ rotation: 0.01 }), target).model, 'rotation');
assert.equal(fitScanFrame(observed({ matrix: [1, 0.04, 0.04, 1, 0, 0] }), target).accepted, false);
// Axis-specific stretch must not be mistaken for scan skew or remove asset error.
assert.equal(
  fitScanFrame(observed({ matrix: [1.008, 0, 0, 0.992, 0, 0] }), target).accepted,
  false,
);
assert.equal(
  fitScanFrame({ points: observed({}).points.filter((p) => p.side !== 'left') }, target).accepted,
  false,
);
assert.equal(
  fitScanFrame(observed({}), { ...target, reliable: false }).reason,
  'frame-template-unvalidated',
);
// Fit and validation disagree: a flexible model cannot use validation as training.
const inconsistent = observed({ rotation: 0.004 });
for (const p of inconsistent.points) if (p.cohort === 'validation') p.x += 4;
assert.equal(fitScanFrame(inconsistent, target).accepted, false);
// Sporadic training outliers can be rejected, while validation remains untouched.
const outliers = observed({ rotation: 0.004 });
for (const p of outliers.points)
  if (p.index === 4) {
    p.x += 7;
    p.y += 7;
  }
assert.equal(fitScanFrame(outliers, target).accepted, true);
assert.throws(() => scanMatrix({ matrix: [1, 0, 0, 1, 0, 0], tx: 1 }));
assert.throws(() => scanMatrix({ matrix: [1, 0, 0, -1, 0, 0] }));

// Raster path: outer frame only, with texture/art/text regions absent. Round-trip
// tests the detector and fitter together, including disjoint sampling strips.
const data = new Uint8Array(488 * 680 * 4);
for (let y = 0; y < 680; y++)
  for (let x = 0; x < 488; x++) {
    const inside = x >= 26 && x <= 463 && y >= 28 && y <= 651,
      p = (y * 488 + x) * 4;
    data[p] = data[p + 1] = data[p + 2] = inside ? 175 : 15;
    data[p + 3] = 255;
  }
const image = { width: 488, height: 680, data },
  reference = scanFrameAnchors(image, 'black');
const rasterTarget = {
  reliable: true,
  sides: Object.fromEntries(
    Object.keys(positions).map((side) => {
      const points = reference.points.filter((p) => p.side === side),
        h = side === 'left' || side === 'right';
      return [
        side,
        {
          reliable: true,
          position: points.reduce((s, p) => s + (h ? p.x : p.y), 0) / points.length,
        },
      ];
    }),
  ),
};
const moved = normalize(image, { scale: 0.999, rotation: 0.004, tx: 1.5, ty: -1 });
const rasterFit = fitScanFrame(scanFrameAnchors(moved, 'black'), rasterTarget);
assert.equal(rasterFit.accepted, true);
assert.equal(rasterFit.model, 'rotation');
assert.ok(rasterFit.validation.rms < 0.1);
console.log(
  'Independent frame fits: translation, scale, rotation, bounded skew, model selection, rejected distortion and raster extraction pass.',
);
