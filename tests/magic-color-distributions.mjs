import assert from 'node:assert/strict';
import { textureMetrics } from '../games/magic/tools/accuracy/hsb-texture.mjs';
import {
  oldFrameTarget,
  normalizeOldFrame,
} from '../games/magic/tools/accuracy/old-frame-normalization.mjs';
// Identical mean does not imply matching shadows or contrast.
const neutral = Array.from({ length: 10 }, (_, i) => Array(3).fill(0.55 + i * 0.025));
const excessive = neutral.map((p, i) => p.map((v) => v + (i - 4.5) * 0.02));
const brownShadows = neutral.map((p, i) => (i < 3 ? [p[0] + 0.07, p[1], p[2] - 0.07] : p));
assert.equal(textureMetrics(neutral, neutral).contrastError, 0);
assert.ok(textureMetrics(excessive, neutral).contrastError > 4);
assert.ok(textureMetrics(brownShadows, neutral).shadowChroma > 2);
assert.ok(textureMetrics(brownShadows, neutral).chroma < 1e-6);
// Weak dark textures can use the exact source mask only when two visible
// boundaries agree; a misplaced mask must not manufacture a target.
function raster(left = 26, right = 466, top = 26, bottom = 654, darkLeft = false) {
  const data = new Uint8ClampedArray(488 * 680 * 4);
  for (let y = 0; y < 680; y++)
    for (let x = 0; x < 488; x++) {
      const inside = x >= left && x < right && y >= top && y < bottom;
      let v = inside ? 150 : 8;
      if (darkLeft && x < 40 && y > 50) v = 8;
      data.set([v, v, v, 255], (y * 488 + x) * 4);
    }
  return { width: 488, height: 680, data };
}
const geometry = raster(),
  weak = raster(26, 466, 26, 654, true),
  target = oldFrameTarget(weak, geometry, 'black');
assert.equal(target.reliable, true);
assert.equal(target.source, 'verified-source-stock-mask');
assert.equal(oldFrameTarget(weak, raster(26, 462, 26, 654), 'black').reliable, false);
const fit = normalizeOldFrame(raster(28, 468, 27, 655), target, 'black');
assert.equal(fit.accepted, true);
assert.ok(fit.validation.rms < 0.1);
console.log(
  'Distribution checks catch hidden shadow tint/contrast; mask fallback requires agreeing geometry and independent scan validation.',
);
