// Independent analytic source: smooth rectangles transformed in2D before any
// strip extraction. This does not synthesize the fitter own1D profile model.
import assert from 'node:assert/strict';
import { inverseScanMatrix, projectScanPoint } from './scan-transform.mjs';
import { profileMatrix } from './scan-gradient-fit.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import {
  framePatches,
  patchGradient,
  packFramePatches,
  unpackFramePatches,
} from './frame-patch-profiles.mjs';
import { fitModernAffine } from './modern-affine-fit.mjs';
const bounds = { left: [0, 33], right: [455, 487], top: [0, 31], bottom: [625, 634] };
const make = (v, h, b) => ({
  left: ['x', 12, 27, v, 8],
  right: ['x', 460, 476, v, 8],
  top: ['y', 9, 26, h, 8],
  bottom: ['y', 627, 632, b, 8],
});
const windows = [
  make([130, 210, 290], [90, 180, 320], [70, 130, 290]),
  make([155, 235, 315], [120, 210, 350], [90, 150, 310]),
  make([180, 260, 340], [150, 290, 380], [110, 170, 330]),
];
const cases = [
  { label: 'identity', sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 },
  { label: 'translation', sx: 1, sy: 1, tx: 1.3, ty: -1.1, rotation: 0, shear: 0 },
  { label: 'uniform', sx: 1.004, sy: 1.004, tx: 0, ty: 0, rotation: 0, shear: 0 },
  { label: 'rotation', sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0.2, shear: 0 },
  { label: 'shear', sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0.15 },
  { label: 'axis-scale', sx: 0.997, sy: 1.005, tx: 0, ty: 0, rotation: 0, shear: 0 },
  { label: 'combined', sx: 1.003, sy: 0.998, tx: 1.1, ty: -0.8, rotation: 0.15, shear: -0.1 },
];
const edge = (t) => 1 / (1 + Math.exp(-t / 0.65));
function image(m, pigment) {
  const inv = inverseScanMatrix({ matrix: m }),
    data = new Uint8Array(488 * 680 * 4);
  for (let y = 0; y < 680; y++)
    for (let x = 0; x < 488; x++) {
      const u = 244 + inv[0] * (x - 244) + inv[2] * (y - 340) + inv[4],
        v = 340 + inv[1] * (x - 244) + inv[3] * (y - 340) + inv[5];
      const outer = edge(u - 20) * edge(468 - u) * edge(v - 20) * edge(630 - v),
        inner = edge(u - 35) * edge(453 - u) * edge(v - 35) * edge(615 - v);
      const value = Math.round(12 + pigment * outer - (pigment - 7) * inner),
        i = (y * 488 + x) * 4;
      data.set([value, value, value, 255], i);
    }
  return { width: 488, height: 680, data };
}
const safetyImage = image([1, 0, 0, 1, 0, 0], 125);
assert.throws(
  () =>
    framePatches(
      safetyImage,
      { ...windows[0], bottom: ['y', 625, 639, [70, 130, 290], 8] },
      bounds,
    ),
  /Matching interval/,
);
const safetyFields = windows.map((w) => framePatches(safetyImage, w, bounds)),
  packed = packFramePatches(safetyFields);
assert.deepEqual(unpackFramePatches(packed.bytes, packed.description), safetyFields);
const badDescription = structuredClone(packed.description);
badDescription[0][0].offset++;
assert.throws(() => unpackFramePatches(packed.bytes, badDescription), /Invalid frame field/);
let failures = [];
for (const pigment of [50, 125, 225]) {
  const base = image([1, 0, 0, 1, 0, 0], pigment),
    target = windows.map((w) => scanBoundaryProfiles(base, w, bounds));
  const targetPatches = windows.map((w) => framePatches(base, w, bounds)),
    patchTemplates = targetPatches.map((ps) =>
      ps.map((p) => ({ ...p, gradient: patchGradient(p) })),
    );
  for (const c of cases) {
    const m = profileMatrix(c),
      expected = inverseScanMatrix({ matrix: m }),
      raster = image(m, pigment),
      p = windows.map((w) => scanBoundaryProfiles(raster, w, bounds));
    const patches = windows.map((w) => framePatches(raster, w, bounds));
    const fit = fitModernAffine(
      {
        profiles: p[0],
        independentProfiles: p[1],
        patches: patches[0],
        independentPatches: patches[1],
        fit: { proposed: { scale: 1, tx: 0, ty: 0 } },
      },
      {
        template: target[0],
        independentTemplate: target[1],
        patchTemplate: patchTemplates[0],
        independentPatchTemplate: patchTemplates[1],
        search: 'independent-axis-seed-v1',
      },
    );
    assert.equal(fit.model, 'affine-joint-2d');
    const errors = [
      [20, 20],
      [468, 20],
      [20, 630],
      [468, 630],
    ].map(([x, y]) => {
      const a = projectScanPoint(x, y, { matrix: expected }),
        b = projectScanPoint(x, y, fit.transform);
      return Math.hypot(a[0] - b[0], a[1] - b[1]);
    });
    const max = Math.max(...errors);
    console.log(
      JSON.stringify({
        pigment,
        case: c.label,
        max,
        accepted: fit.accepted,
        parameters: fit.parameters,
      }),
    );
    if (!fit.accepted || max > 0.2) failures.push({ pigment, label: c.label, max });
  }
}
assert.deepEqual(failures, [], 'Analytic affine recovery failed');
