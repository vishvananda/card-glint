import assert from 'node:assert/strict';
import {
  peerProfiles,
  peerTemplate,
  fitPeerProfiles,
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
  p = peerProfiles(base);
const template = peerTemplate([
  p,
  p,
  peerProfiles(image(0, 0, 0.85)),
  peerProfiles(image(0, 0, 1.1)),
  p,
]);
const same = fitPeerProfiles(p, template);
assert(same.accepted);
assert(Math.abs(same.parameters.tx) < 0.1 && Math.abs(same.parameters.ty) < 0.1);
const shifted = fitPeerProfiles(peerProfiles(image(2, -1.5, 0.8)), template);
assert(shifted.accepted);
assert(Math.abs(shifted.parameters.tx + 2) < 0.15);
assert(Math.abs(shifted.parameters.ty - 1.5) < 0.15);
const rotated = fitPeerProfiles(peerProfiles(image(1, -1, 0.9, 0.2)), template);
assert(rotated.accepted);
assert(Math.abs(rotated.parameters.rotationDegrees + 0.2) < 0.04);
const isolated = { ...base, data: new Uint8Array(base.data.length) };
for (let i = 0; i < isolated.data.length; i++) isolated.data[i] = (i * 73 + 31) % 256;
for (const [side, spec] of Object.entries(PEER_WINDOWS))
  for (let n = 0; n < spec.count; n++) {
    const along = spec.start + n * spec.step;
    for (let normal = PEER_SAMPLE_BOUNDS[side][0]; normal <= PEER_SAMPLE_BOUNDS[side][1]; normal++)
      for (let a = along - 5; a <= along + 5; a++) {
        const at = ((spec.axis === 'x' ? a : normal) * 488 + (spec.axis === 'x' ? normal : a)) * 4;
        isolated.data.set(base.data.subarray(at, at + 4), at);
      }
  }
assert.deepEqual(peerProfiles(isolated), p, 'Non-frame pixels changed profile extraction');
const broken = structuredClone(p);
for (const v of broken.filter((v) => v.cohort === 'validation' && v.side === 'left'))
  v.gradient.fill(0);
assert.equal(
  fitPeerProfiles(broken, template).accepted,
  false,
  'Missing independent side support was accepted',
);
assert.throws(() => peerTemplate([p]), /three/);
assert.throws(() => peerProfiles({ width: 244, height: 340 }), /488/);
console.log(
  'Peer-gradient registration recovers translation and rotation under brightness changes, ignores all pixels outside frozen frame strips, and rejects missing validation support.',
);
