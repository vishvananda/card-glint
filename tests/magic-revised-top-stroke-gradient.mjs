import assert from 'node:assert/strict';
import { revisedTopStrokeGradient } from '../games/magic/tools/accuracy/revised-top-stroke-gradient.mjs';
import { medianDarkeningGradient } from '../games/magic/tools/accuracy/directed-frame-gradient.mjs';
import { bestGradientShift } from '../games/magic/tools/accuracy/frame-edge-measure.mjs';
const rect = [0, 0, 110, 25, 'y'];
function raster(art, shift = 0) {
  const width = 110,
    height = 25,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      // Native stroke has an antialiased leading edge,then a bright inner bevel.
      const coverage = Math.max(0, Math.min(1, y - 8.75 - shift + 0.5));
      let v = 220 - 160 * coverage;
      if (y >= 13) v = 180;
      if (y >= 16) v = art + 5 * Math.sin(x * 0.2 + y);
      data.set([v, v, v, 255], (y * width + x) * 4);
    }
  return { width, height, data };
}
const heading = raster(0);
for (let y = 0; y < 4; y++)
  for (let x = 0; x < heading.width; x++)
    heading.data.set([x % 3 ? 20 : 250, 20, 60, 255], (y * heading.width + x) * 4);
assert.deepEqual(
  revisedTopStrokeGradient(heading, rect),
  revisedTopStrokeGradient(raster(0), rect),
  'Heading pixels in the smoothing margin must not become frame geometry',
);
const baseline = revisedTopStrokeGradient(raster(0), rect);
for (const color of [0, 40, 100, 180, 250])
  assert.deepEqual(
    revisedTopStrokeGradient(raster(color), rect),
    baseline,
    'Illustration brightness must not change the fixed frame-stroke profile',
  );
assert.notDeepEqual(
  medianDarkeningGradient(raster(0), rect),
  medianDarkeningGradient(raster(250), rect),
  'Control must exercise the original art contamination',
);
for (const shift of [-0.5, -0.25, 0.25, 0.5]) {
  const fit = bestGradientShift(baseline, revisedTopStrokeGradient(raster(250, shift), rect));
  assert(Math.abs(fit.shift - shift) <= 0.125, JSON.stringify({ shift, fit }));
  assert(fit.score > 97);
}
const bottom = { width: 110, height: 26, data: new Uint8Array(110 * 26 * 4) };
assert.deepEqual(
  revisedTopStrokeGradient(bottom, [0, 0, 110, 26, 'y']),
  medianDarkeningGradient(bottom, [0, 0, 110, 26, 'y']),
);
console.log(
  'Experimental Revised top-stroke profiles preserve subpixel shifts while rejecting illustration changes before smoothing;other strips retain the existing gradient.',
);
