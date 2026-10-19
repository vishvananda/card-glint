import assert from 'node:assert/strict';
import { projectScanPoint } from '../games/magic/tools/accuracy/scan-transform.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';
import { scanBoundaryProfiles } from '../games/magic/tools/accuracy/scan-boundary-profiles.mjs';
import {
  fitGradientProfiles,
  profileSupport,
  bounded,
} from '../games/magic/tools/accuracy/scan-gradient-fit.mjs';
const bounds = { left: [0, 34], right: [454, 487], top: [0, 30], bottom: [644, 679] };
const windows = (v, h, span) => ({
  left: ['x', 10, 34, v, span],
  right: ['x', 454, 478, v, span],
  top: ['y', 10, 30, h, span],
  bottom: ['y', 644, 671, h, span],
});
const groups = [
  windows([150, 300, 530], [90, 205, 320], 10),
  windows([205, 370, 580], [140, 255, 375], 10),
  windows([250, 440, 490], [165, 285, 405], 8),
];
const base = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) };
for (let y = 0; y < 680; y++)
  for (let x = 0; x < 488; x++) {
    const edge = Math.min(x - 16, 471 - x, y - 21, 658 - y),
      inside = edge >= 0;
    const value = inside ? (edge < 9 ? 42 : 170) : 24;
    base.data.set([value, value, value, 255], (y * 488 + x) * 4);
  }
const templates = groups.map((g) => scanBoundaryProfiles(base, g, bounds));
const modified = { ...base, data: base.data.slice() };
for (let y = 31; y < 644; y++)
  for (let x = 35; x < 454; x++)
    modified.data.set([x % 255, y % 255, (x + y) % 255, 255], (y * 488 + x) * 4);
for (let i = 0; i < 3; i++)
  assert.deepEqual(scanBoundaryProfiles(modified, groups[i], bounds), templates[i]);
for (const transform of [
  { scale: 1.002, tx: 0.8, ty: -0.6 },
  { matrix: [1.002, 0.003, -0.001, 0.999, 1, -1] },
]) {
  const moved = normalize(base, transform),
    profiles = groups.map((g) => scanBoundaryProfiles(moved, g, bounds));
  const result = fitGradientProfiles(
    { profiles: profiles[0], independentProfiles: profiles[1], fit: {} },
    {
      template: templates[0],
      independentTemplate: templates[1],
      search: 'independent-axis-seed-v1',
    },
  );
  assert.ok(result.accepted);
  assert.ok(bounded(result.parameters));
  for (const [x, y] of [
    [40, 40],
    [450, 610],
    [244, 340],
  ]) {
    const movedPoint = projectScanPoint(x, y, transform),
      recovered = projectScanPoint(...movedPoint, result.transform);
    assert.ok(
      Math.hypot(recovered[0] - x, recovered[1] - y) < 0.35,
      'Known scan pose must recover physical control points',
    );
  }
  const certificate = profileSupport(profiles[2], templates[2], result.parameters, {
    residuals: true,
  });
  assert.ok(certificate.accepted);
  assert.ok(certificate.residualRms < 0.4);
  const broken = structuredClone(profiles[1]);
  for (const p of broken) p.gradient.fill(0);
  const rejected = fitGradientProfiles(
    { profiles: profiles[0], independentProfiles: broken, fit: {} },
    { template: templates[0], independentTemplate: templates[1] },
  );
  assert.equal(rejected.accepted, false);
}
assert.equal(bounded({ sx: 1.04, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 }), false);
console.log(
  'Frame-only gradient profiles: interior isolation, independent validation/certification, bounded scan distortion and weak second-border recovery pass.',
);
