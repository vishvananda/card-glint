import assert from 'node:assert/strict';
import {
  nativeFrameProfiles,
  nativeOpaqueSupport,
} from '../games/magic/tools/accuracy/frame-native-profiles.mjs';
import { frameProfiles } from '../games/magic/tools/accuracy/frame-family-metrics.mjs';
import { opaqueSupport } from '../games/magic/tools/accuracy/frame-family-score.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';
const image = { width: 732, height: 1020, data: new Uint8ClampedArray(732 * 1020 * 4) };
for (let y = 0; y < 1020; y++)
  for (let x = 0; x < 732; x++) {
    const i = (y * 732 + x) * 4;
    image.data.set(
      [(x * 7 + y * 3) % 256, (x * 3 + y * 11) % 256, (x * 13 + y * 5) % 256, (x + y) % 256],
      i,
    );
  }
assert.deepEqual(nativeOpaqueSupport(image), opaqueSupport([normalize(image)]));
const full = frameProfiles(normalize(image)),
  strips = nativeFrameProfiles(image);
const differences = Object.keys(full).flatMap((k) =>
  full[k].flatMap((p, i) => p.map((v, j) => Math.abs(v - strips[k][i][j]))),
);
assert.equal(
  Math.max(...differences),
  0,
  'Thin-strip resampling differs from full native normalization',
);
assert.throws(() => nativeFrameProfiles({ ...image, width: 488 }), /732x1020/);
assert.throws(() => nativeFrameProfiles({ ...image, data: image.data.subarray(4) }), /732x1020/);
console.log(
  'Native frame strips match full normalization exactly on textured RGBA; dimensions are checked.',
);

for (let y = 0; y < 1020; y++)
  for (let x = 0; x < 732; x++) {
    const i = (y * 732 + x) * 4 + 3;
    const distance = Math.min(x - 85, 645 - x, y - 108, 558 - y);
    image.data[i] = distance > 1 ? 0 : distance >= 0 ? 128 : distance === -1 ? 254 : 255;
  }
assert.deepEqual(
  nativeOpaqueSupport(image),
  opaqueSupport([normalize(image)]),
  'Native opacity differs at antialiased aperture edges',
);
