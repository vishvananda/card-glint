import assert from 'node:assert/strict';
import {
  measureWhiteFrame,
  boundaryDifference,
} from '../games/magic/tools/accuracy/frame-boundaries.mjs';
import { alignmentDiagnostic } from '../games/magic/tools/accuracy/alignment.mjs';

// A pale textured frame with a thin keyline and much stronger inner bevels.
// A known movement must stay observable despite brightness, grain and content.
function sample({ dx = 0, dy = 0, growY = 0, brightness = 1, noise = 0, blank = false } = {}) {
  const image = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) };
  for (let y = 0; y < 680; y++)
    for (let x = 0; x < 488; x++) {
      const xx = x - dx,
        yy = y - dy;
      const inside = !blank && xx >= 24 && xx < 464 && yy >= 28 - growY && yy < 652 + growY;
      const keyline =
        inside && (xx === 24 || xx === 463 || yy === 28 - growY || yy === 651 + growY);
      const bevel =
        inside &&
        (Math.abs(xx - 47) < 3 ||
          Math.abs(xx - 437) < 3 ||
          Math.abs(yy - 63) < 3 ||
          Math.abs(yy - 375) < 3);
      const value = keyline
        ? 100
        : bevel
          ? 20
          : inside
            ? 200 + 10 * Math.sin(xx * 0.31 + yy * 0.47)
            : 240;
      const p = (y * 488 + x) * 4;
      const v = Math.round(value * brightness + noise * Math.sin(x * 17 + y * 23));
      image.data.set([v, Math.round(v * 0.97), Math.round(v * 0.92), 255], p);
    }
  return image;
}
const original = measureWhiteFrame(sample());
const face = { setCode: '3ed', borderColor: 'white' };
assert.equal(original.filter((p) => p.detected !== null).length, 12);
for (const [dx, dy] of [
  [0, 0],
  [4, 0],
  [-4, 0],
  [0, 4],
  [0, -4],
  [2, -2],
]) {
  const measured = measureWhiteFrame(sample({ dx, dy, brightness: 0.75, noise: 4 }));
  const result = boundaryDifference(original, measured);
  assert.ok(result.complete && result.coherent);
  assert.ok(Math.abs(result.centerDelta[0] - dx) < 0.2);
  assert.ok(Math.abs(result.centerDelta[1] - dy) < 0.2);
  assert.ok(result.sizeDelta.every((v) => Math.abs(v) < 0.2));
  const diagnostic = alignmentDiagnostic(sample(), sample({ dx, dy }), 'retro-fourth', face);
  assert.equal(
    diagnostic.uncertain,
    Math.max(Math.abs(dx), Math.abs(dy)) > 3,
    'A shift on either axis must be flagged even when the other two sides agree',
  );
}
const absent = measureWhiteFrame(sample({ blank: true }));
const sizeMismatch = alignmentDiagnostic(sample(), sample({ growY: 2 }), 'retro-fourth', face);
assert.equal(
  sizeMismatch.uncertain,
  false,
  'A centered size mismatch is not an uncertain translation',
);
assert.equal(sizeMismatch.geometryMismatch, true);
assert.ok(absent.every((p) => p.detected === null));
assert.equal(boundaryDifference(original, absent).complete, false);
assert.equal(boundaryDifference(original, absent).medianResidualPx, null);
assert.equal(
  alignmentDiagnostic(sample(), sample({ blank: true }), 'retro-fourth', face).uncertain,
  true,
);
for (const context of [{ ...face, setCode: '4ed' }, { ...face, borderColor: 'black' }, {}]) {
  assert.deepEqual(
    alignmentDiagnostic(sample(), sample(), 'retro-fourth', context),
    alignmentDiagnostic(sample(), sample(), 'retro-fourth'),
    'Other scopes keep their existing diagnostic',
  );
}
assert.throws(() => measureWhiteFrame({ width: 10, height: 10 }), /canonical/);
console.log(
  'Outer frame detector: known translations, brightness, grain, competing inner bevels and missing boundaries passed.',
);
