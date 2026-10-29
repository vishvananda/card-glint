import assert from 'node:assert/strict';
import {
  chromaticProfiles,
  chromaticTemplate,
  fitChromaticProfiles,
  CHROMATIC_WINDOWS,
} from '../games/magic/tools/accuracy/old-frame-chromatic-profiles.mjs';
import {
  PEER_WINDOWS,
  PEER_SAMPLE_BOUNDS,
} from '../games/magic/tools/accuracy/old-frame-peer-profiles.mjs';

function image(tx = 0, ty = 0, gain = 1, rotation = 0) {
  const data = new Uint8Array(488 * 680 * 4),
    c = Math.cos((rotation * Math.PI) / 180),
    s = Math.sin((rotation * Math.PI) / 180);
  const step = (v) => 1 / (1 + Math.exp(-v * 2));
  for (let y = 0; y < 680; y++)
    for (let x = 0; x < 488; x++) {
      const px = c * (x - 244 - tx) + s * (y - 340 - ty) + 244;
      const py = -s * (x - 244 - tx) + c * (y - 340 - ty) + 340;
      const inside = step(px - 24) * step(464 - px) * step(py - 26) * step(653 - py);
      // A second, stronger inner bevel must not replace the outer boundary.
      const inner = step(px - 28) * step(460 - px) * step(py - 30) * step(649 - py);
      const v = gain * (12 + 45 * inside + 55 * inner);
      const at = (y * 488 + x) * 4;
      data.set([v, v, v, 255], at);
    }
  return { width: 488, height: 680, data };
}
const base = image(),
  p = chromaticProfiles(base);
const template = chromaticTemplate([
  p,
  p,
  chromaticProfiles(image(0, 0, 0.85)),
  chromaticProfiles(image(0, 0, 1.1)),
  p,
]);
const same = fitChromaticProfiles(p, template);
assert(same.accepted);
assert(Math.abs(same.parameters.tx) < 0.1 && Math.abs(same.parameters.ty) < 0.1);
const shifted = fitChromaticProfiles(chromaticProfiles(image(2, -1.5, 0.8)), template);
assert(shifted.accepted);
assert(Math.abs(shifted.parameters.tx + 2) < 0.15);
assert(Math.abs(shifted.parameters.ty - 1.5) < 0.15);
const rotated = fitChromaticProfiles(chromaticProfiles(image(1, -1, 0.9, 0.2)), template);
assert(rotated.accepted);
assert(Math.abs(rotated.parameters.rotationDegrees + 0.2) < 0.04);
const isolated = { ...base, data: new Uint8Array(base.data.length) };
for (let i = 0; i < isolated.data.length; i++) isolated.data[i] = (i * 73 + 31) % 256;
for (const [side, spec] of Object.entries(CHROMATIC_WINDOWS))
  for (let n = 0; n < spec.count; n++) {
    const along = spec.start + n * spec.step;
    for (let normal = PEER_SAMPLE_BOUNDS[side][0]; normal <= PEER_SAMPLE_BOUNDS[side][1]; normal++)
      for (
        let a = along - (spec.axis === 'x' ? 9 : 6);
        a <= along + (spec.axis === 'x' ? 9 : 6);
        a++
      ) {
        const at = ((spec.axis === 'x' ? a : normal) * 488 + (spec.axis === 'x' ? normal : a)) * 4;
        isolated.data.set(base.data.subarray(at, at + 4), at);
      }
  }
assert.deepEqual(chromaticProfiles(isolated), p, 'Non-frame pixels changed profile extraction');
const broken = structuredClone(p);
for (const v of broken.filter((v) => v.cohort === 'validation' && v.side === 'left'))
  for (const channel of v.gradient) channel.fill(0);
assert.equal(
  fitChromaticProfiles(broken, template).accepted,
  false,
  'Missing independent side support was accepted',
);
assert.throws(() => chromaticTemplate([p]), { name: 'AssertionError' });
assert.throws(() => chromaticProfiles({ width: 244, height: 340 }), /488/);
console.log(
  'RGB-gradient registration recovers translation and rotation under brightness changes, ignores all pixels outside frozen frame strips, and rejects missing validation support.',
);

// Exposure changes must not turn a supported edge into missing frame geometry.
const dim = fitChromaticProfiles(chromaticProfiles(image(2, -1.5, 0.1)), template);
assert(dim.accepted, 'Dim but coherent frame edges were rejected');
assert(Math.abs(dim.parameters.tx + 2) < 0.25 && Math.abs(dim.parameters.ty - 1.5) < 0.25);
const flat = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4).fill(127) };
assert.equal(fitChromaticProfiles(chromaticProfiles(flat), template).accepted, false);
for (let seed = 1; seed <= 16; seed++) {
  let state = seed;
  const data = new Uint8Array(488 * 680 * 4);
  for (let i = 0; i < data.length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    data[i] = i % 4 === 3 ? 255 : 80 + (state >>> 28);
  }
  assert.equal(
    fitChromaticProfiles(chromaticProfiles({ width: 488, height: 680, data }), template).accepted,
    false,
    'Noise-only frame ' + seed + ' accepted',
  );
}
console.log(
  'Chromatic low-pass edges retain dim positive controls and reject flat/noise-only frames under unchanged geometric gates.',
);

// Fit and validation strips cannot share any image pixel, including denoising support.
for (const spec of Object.values(CHROMATIC_WINDOWS)) {
  const radius = spec.axis === 'x' ? 9 : 6;
  assert(spec.step > 2 * radius);
}
// A color change without appreciable luminance contrast still has a coherent RGB boundary.
const chromatic = image();
for (let i = 0; i < chromatic.data.length; i += 4) {
  const v = chromatic.data[i],
    t = (v - 12) / 100;
  chromatic.data[i] = 30 + 90 * t;
  chromatic.data[i + 1] = 99 - 27 * t;
  chromatic.data[i + 2] = 68 + 2 * t;
}
const cp = chromaticProfiles(chromatic);
assert(fitChromaticProfiles(cp, chromaticTemplate([cp, cp, cp])).accepted);
console.log(
  'RGB extraction keeps alternating footprints disjoint and detects coherent low-luminance-contrast color edges.',
);
