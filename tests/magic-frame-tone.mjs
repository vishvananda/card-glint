import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const { colorFrame } = await server.ssrLoadModule('/games/magic/src/presentation/frame-hsb.ts');
  const { earlyHsbMaterialKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-hsb-material.ts',
  );
  const identity = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
  // Dense RGB cube: omitted/identity tone must retain the existing HSV formula.
  let legacyCases = 0;
  for (let r = 0; r <= 255; r += 17)
    for (let g = 0; g <= 255; g += 17)
      for (let b = 0; b <= 255; b += 17)
        for (const adjustment of [
          identity,
          { hueDegrees: -39, saturationScale: 0.65, brightnessScale: 1.2 },
          { hueDegrees: 55, saturationScale: 1.4, brightnessScale: 0.8 },
        ]) {
          const rgb = [r / 255, g / 255, b / 255],
            [h, s, v] = math.rgbToHsb(rgb),
            expected = math.hsbToRgb(
              h + adjustment.hueDegrees,
              Math.min(1, s * adjustment.saturationScale),
              Math.min(1, v * adjustment.brightnessScale),
            );
          assert.deepEqual(math.adjustHsb(rgb, adjustment), expected);
          assert.deepEqual(math.adjustHsb(rgb, { ...adjustment, valueGamma: 1 }), expected);
          legacyCases++;
        }
  for (const gamma of [0.5, 0.75, 1, 1.25, 2]) {
    let previous = -1;
    for (let v = 0; v <= 255; v++) {
      const rgb = math.adjustHsb([v / 255, v / 255, v / 255], { ...identity, valueGamma: gamma });
      assert.ok(rgb[0] >= previous && rgb.every((x) => x >= 0 && x <= 1));
      assert.equal(rgb[0], rgb[1]);
      assert.equal(rgb[1], rgb[2]);
      previous = rgb[0];
    }
    for (const endpoint of [0, 1])
      assert.deepEqual(
        math.adjustHsb([endpoint, endpoint, endpoint], { ...identity, valueGamma: gamma }),
        [endpoint, endpoint, endpoint],
      );
  }
  const pixels = {
    width: 32,
    height: 32,
    data: new Uint8ClampedArray(32 * 32 * 4),
  };
  for (let i = 0; i < pixels.data.length; i += 4)
    pixels.data.set(i % 64 === 0 ? [5, 8, 9, 255] : [80, 100, 120, i % 28 ? 255 : 0], i);
  const before = pixels.data.slice();
  const adjustment = {
    frame: { ...identity, valueGamma: 0.75 },
    paper: identity,
    mask: { kind: 'rect', rect: [0.25, 0.25, 0.5, 0.5], feather: 0.01 },
  };
  colorFrame(pixels, adjustment);
  let changed = 0;
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const i = (y * 32 + x) * 4;
      assert.equal(pixels.data[i + 3], before[i + 3]);
      if (!before[i + 3] || before[i] === 5 || (x > 8 && x < 24 && y > 8 && y < 24))
        assert.deepEqual(pixels.data.slice(i, i + 4), before.slice(i, i + 4));
      else if (pixels.data[i] !== before[i]) changed++;
    }
  assert.ok(changed > 300, 'Frame curve must change the intended material');
  for (const valueGamma of [NaN, Infinity, -1, 0, 0.49, 2.01]) {
    for (const profile of [
      { ...identity, valueGamma },
      { ...adjustment, paper: { ...identity, valueGamma } },
      {
        ...adjustment,
        regions: [{ mask: adjustment.mask, adjustment: { ...identity, valueGamma } }],
      },
    ]) {
      const probe = { ...pixels, data: before.slice() };
      assert.throws(() => colorFrame(probe, profile), /exponent/);
      assert.deepEqual(probe.data, before, 'Invalid profiles must fail before mutating pixels');
    }
  }
  assert.notEqual(
    earlyHsbMaterialKey('source', 32, 32, identity),
    earlyHsbMaterialKey('source', 32, 32, { ...identity, valueGamma: 0.75 }),
  );
  console.log(
    `${legacyCases} legacy HSV cases stay exact; tone monotonicity, endpoints, material/ink/alpha isolation and cache identity pass.`,
  );
} finally {
  await server.close();
}
