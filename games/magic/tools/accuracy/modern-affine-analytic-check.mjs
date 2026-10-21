// Independent analytic source: smooth rectangles transformed in2D before any
// strip extraction. This does not synthesize the fitter own1D profile model.
import assert from 'node:assert/strict';
import { inverseScanMatrix, projectScanPoint } from './scan-transform.mjs';
import { profileMatrix } from './scan-gradient-fit.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import {
  framePatches,
  sampleFrameField,
  patchGradient,
  packFramePatches,
  unpackFramePatches,
} from './frame-patch-profiles.mjs';
import { nativeFramePatches } from './native-frame-patches.mjs';
import { fitModernAffine } from './modern-affine-fit.mjs';
const bounds = { left: [0, 33], right: [455, 487], top: [0, 31], bottom: [625, 638] };
const make = (v, h, b) => ({
  left: ['x', 12, 27, v, 8],
  right: ['x', 460, 476, v, 8],
  top: ['y', 9, 26, h, 8],
  bottom: ['y', 627, 634, b, 5],
});
const windows = [
  make([130, 210, 290], [90, 180, 320], [127, 151, 290]),
  make([155, 235, 315], [120, 210, 350], [139, 175, 310]),
  make([180, 260, 340], [150, 290, 380], [163, 187, 330]),
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
      { ...windows[0], bottom: ['y', 625, 639, [127, 151, 290], 8] },
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
// Native fields stay floating point through source filtering and affine sampling.
// Their packed format is explicitly little-endian, independent of host order.
const nativeSafety = windows.map((w) => nativeFramePatches(safetyImage, w, bounds)),
  nativePacked = packFramePatches(nativeSafety);
assert.deepEqual(unpackFramePatches(nativePacked.bytes, nativePacked.description), nativeSafety);
const badNative = structuredClone(nativePacked.description);
badNative[0][0].nativeSampling.factor = 0;
assert.throws(() => unpackFramePatches(nativePacked.bytes, badNative), /native frame sampling/);
const nonfinite = nativePacked.bytes.slice();
new DataView(nonfinite.buffer).setFloat32(0, NaN, true);
assert.throws(() => unpackFramePatches(nonfinite, nativePacked.description), /Nonfinite/);
// Independent polynomial reconstruction checks the native bicubic interpolator.
const polynomial = (x, y) => 7 + 3 * x - 2 * y + 0.05 * x * x + 0.03 * x * y - 0.02 * y * y;
const interpolationField = {
  axis: 'x',
  normalLo: 0,
  along: 8,
  span: 8,
  width: 18,
  height: 17,
  nativeSampling: { factor: 1, normalPad: 0, alongPad: 0, normalStart: 0, alongStart: 0 },
  values: Float32Array.from({ length: 18 * 17 }, (_, i) => polynomial(i % 18, Math.floor(i / 18))),
};
for (const [x, y] of [
  [4.3, 6.2],
  [8.1, 3.9],
  [10.75, 12.25],
])
  assert(Math.abs(sampleFrameField(interpolationField, x, y) - polynomial(x, y)) < 1e-5);
assert.equal(
  sampleFrameField(interpolationField, -100, 2),
  sampleFrameField(interpolationField, 0, 2),
);
let failures = [];
for (const pigment of [50, 125, 225]) {
  const base = image([1, 0, 0, 1, 0, 0], pigment),
    target = windows.map((w) => scanBoundaryProfiles(base, w, bounds));
  const targetPatches = windows.map((w) => nativeFramePatches(base, w, bounds)),
    patchTemplates = targetPatches.map((ps) =>
      ps.map((p) => ({ ...p, gradient: patchGradient(p) })),
    );
  for (const gain of [1, 0.75])
    for (const c of cases) {
      const m = profileMatrix(c),
        expected = inverseScanMatrix({ matrix: m }),
        raster = image(m, pigment);
      if (gain !== 1)
        for (let i = 0; i < raster.data.length; i += 4)
          for (let ch = 0; ch < 3; ch++)
            raster.data[i + ch] = Math.round(raster.data[i + ch] * gain + 16);
      const p = windows.map((w) => scanBoundaryProfiles(raster, w, bounds));
      const patches = windows.map((w) => nativeFramePatches(raster, w, bounds));
      const fit = fitModernAffine(
        {
          profiles: p[0].concat(p[1]),
          independentProfiles: p[2],
          patches: patches[0].concat(patches[1]),
          independentPatches: patches[2],
          fit: { proposed: { scale: 1, tx: 0, ty: 0 } },
        },
        {
          template: target[0].concat(target[1]),
          independentTemplate: target[2],
          patchTemplate: patchTemplates[0].concat(patchTemplates[1]),
          independentPatchTemplate: patchTemplates[2],
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
          gain,
          case: c.label,
          max,
          accepted: fit.accepted,
          parameters: fit.parameters,
        }),
      );
      if (!fit.accepted || max > 0.2) failures.push({ pigment, gain, label: c.label, max });
    }
}
assert.deepEqual(failures, [], 'Analytic affine recovery failed');
