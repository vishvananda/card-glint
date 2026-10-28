import assert from 'node:assert/strict';
import { oldFrameManaDisc } from '../games/magic/tools/accuracy/old-frame-mana-disc.mjs';
function raster({
  cx = 49.3,
  cy = 50.4,
  radius = 12,
  paper = 210,
  back = 75,
  glyph = false,
  noise = false,
  absent = false,
} = {}) {
  const data = new Uint8Array(100 * 100 * 4);
  let seed = 971;
  for (let y = 0; y < 100; y++)
    for (let x = 0; x < 100; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      let v = absent ? back : back + (paper - back) * Math.max(0, Math.min(1, radius + 0.5 - d));
      if (glyph && d < 8.5) v = 10;
      if (noise) {
        seed = (1664525 * seed + 1013904223) >>> 0;
        v += (seed / 4294967296 - 0.5) * 16;
      }
      const i = (y * 100 + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = Math.round(v);
      data[i + 3] = 255;
    }
  return { width: 100, height: 100, data };
}
const prior = { x: 50, y: 50, radius: 12, range: 4, radiusTolerance: 1 };
for (const glyph of [false, true])
  for (const noise of [false, true]) {
    const c = oldFrameManaDisc(raster({ glyph, noise }), prior);
    assert.equal(c.status, 'measured');
    assert(Math.abs(c.x - 48.8) < 0.5 && Math.abs(c.y - 49.9) < 0.5);
    assert(Math.abs(c.radius - 12) < 0.5);
  }
for (const options of [
  { absent: true },
  { absent: true, noise: true },
  { paper: 75 },
  { paper: 40, back: 210 },
  { cx: 55 },
])
  assert.equal(oldFrameManaDisc(raster(options), prior).status, 'unresolved');
assert.throws(() => oldFrameManaDisc(raster(), { ...prior, radius: NaN }));
assert.throws(() => oldFrameManaDisc(raster(), { ...prior, x: 0 }));
console.log(
  'Light-paper mana rims retain the physical circle despite a stronger inner glyph; flat, noisy, inverted and out-of-range controls are rejected.',
);
