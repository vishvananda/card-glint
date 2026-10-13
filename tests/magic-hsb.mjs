import assert from 'node:assert/strict';
import { createServer } from 'vite';
import {
  sampleColor,
  fitHsb,
  evaluateHsb,
  oklab,
  delta,
} from '../games/magic/tools/accuracy/hsb-color.mjs';
import { fitSharedHsb, manaDiscColor } from '../games/magic/tools/accuracy/hsb-shared-color.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const material = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-hsb-material.ts',
  );
  const { cardTextureKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  for (const rgb of [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0.3, 0.7, 0.5],
    [0.01, 0.04, 0.9],
  ]) {
    assert.ok(
      Math.max(...math.hsbToRgb(...math.rgbToHsb(rgb)).map((c, i) => Math.abs(c - rgb[i]))) < 1e-10,
    );
    assert.ok(delta(rgb, math.adjustHsb(rgb, math.IDENTITY_HSB)) < 1e-8);
  }
  assert.ok(delta([1, 0, 0], math.hsbToRgb(360, 1, 1)) < 1e-8);
  assert.deepEqual(
    math.adjustHsb([0.5, 0.5, 0.5], { hueDegrees: 80, saturationScale: 2, brightnessScale: 3 }),
    [1, 1, 1],
  );
  assert.ok(Math.abs(oklab([1, 1, 1])[0] - 1) < 1e-7);
  const adjustment = { hueDegrees: 18, saturationScale: 0.75, brightnessScale: 1.12 };
  function fixture(change, ink = false, shift = 0) {
    const width = 120,
      height = 120,
      data = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        let rgb = math.hsbToRgb(170, 0.5, 0.6 + ((x + y) % 10) * 0.003);
        if (change) rgb = math.adjustHsb(rgb, change);
        if (ink && y % 20 < 3 && (x + shift) % 30 < 23) rgb = [0.025, 0.025, 0.025];
        const i = (y * width + x) * 4;
        rgb.forEach((v, c) => (data[i + c] = Math.round(v * 255)));
        data[i + 3] = 255;
      }
    return { width, height, data };
  }
  const source = sampleColor(fixture(), [[10, 10, 100, 100]], { paper: true });
  const reference = sampleColor(fixture(adjustment, true), [[10, 10, 100, 100]], { paper: true });
  const model = {
    hueDegrees: [-60, 60],
    saturationScale: [0.35, 1.75],
    brightnessScale: [0.65, 1.4],
    neutralSaturation: 0.06,
  };
  const fit = fitHsb(source, [reference, reference, reference], model, math);
  assert.ok(Math.abs(fit.adjustment.hueDegrees - 18) < 1);
  assert.ok(Math.abs(fit.adjustment.saturationScale - 0.75) < 0.02);
  assert.ok(Math.abs(fit.adjustment.brightnessScale - 1.12) < 0.02);
  const validation = sampleColor(fixture(adjustment, true, 3), [[10, 10, 100, 100]], {
    paper: true,
    dx: 2,
  });
  const heldOutError = evaluateHsb(source, validation, fit.adjustment, math).after;
  // A sub-byte texture shift changes the median after 8-bit quantization.
  assert.ok(heldOutError < 0.4);
  const neutral = { rgb: [0.5, 0.5, 0.5], tiles: [[0.5, 0.5, 0.5]], spread: 0 };
  assert.equal(
    fitHsb(neutral, [{ ...neutral, rgb: [0.6, 0.61, 0.6] }], model, math).adjustment.hueDegrees,
    0,
  );
  assert.ok(
    evaluateHsb(
      { ...source, tiles: [[0.9, 0.8, 0.7]] },
      reference,
      { hueDegrees: 0, saturationScale: 1, brightnessScale: 1.4 },
      math,
    ).clipping === 1,
  );
  // A single shared transform must recover two distinct material colors.
  const pairs = [
    [0.3, 0.6, 0.45],
    [0.7, 0.5, 0.25],
  ].map((rgb) => ({
    source: { rgb, tiles: [rgb], spread: 0 },
    references: [{ rgb: math.adjustHsb(rgb, adjustment) }],
  }));
  const shared = fitSharedHsb(pairs, model, math);
  for (const p of pairs)
    assert.ok(delta(math.adjustHsb(p.source.rgb, shared.adjustment), p.references[0].rgb) < 0.05);
  // Dense historical glyphs occupy most of the disc. A median or tied quantile
  // would measure the black ink instead of the colored background.
  const disc = fixture();
  for (let y = 0; y < 120; y++)
    for (let x = 0; x < 120; x++) {
      const rgb = x % 4 === 0 ? [0.7, 0.8, 0.9] : [0.03, 0.03, 0.03];
      rgb.forEach((v, c) => (disc.data[(y * 120 + x) * 4 + c] = Math.round(255 * v)));
    }
  assert.ok(delta(manaDiscColor(disc, 60, 60).rgb, [0.7, 0.8, 0.9]) < 0.2);
  const pixels = fixture(),
    alpha = pixels.data.filter((_, i) => i % 4 === 3);
  material.colorEarlyFrame(pixels, adjustment);
  assert.deepEqual(
    pixels.data.filter((_, i) => i % 4 === 3),
    alpha,
  );
  const face = { name: 'Test', typeLine: 'Creature', colors: ['G'], setCode: 'lea' };
  assert.equal(material.earlyHsbProfile(face), undefined);
  assert.equal(
    material.earlyHsbProfile({ ...face, setCode: 'm21', colorCalibration: 'early-hsb-v1' }),
    undefined,
  );
  const input = { face, printingId: null, printedImage: null };
  assert.notEqual(
    cardTextureKey(input, 'inspect'),
    cardTextureKey({ ...input, face: { ...face, colorCalibration: 'early-hsb-v1' } }, 'inspect'),
  );
  assert.equal(
    cardTextureKey({ ...input, layer: 'etching' }, 'inspect'),
    cardTextureKey(
      { ...input, layer: 'etching', face: { ...face, colorCalibration: 'early-hsb-v1' } },
      'inspect',
    ),
  );
  // No DOM work or ownership changes on the default path.
  const images = new Map(),
    result = await material.prepareEarlyHsb(face, images, new AbortController().signal);
  assert.equal(result.images, images);
  result.dispose();
  console.log(
    'HSB: known color recovery, dark-text/offset robustness, neutral hue, clipping, alpha, opt-in cache isolation and unchanged default ownership pass.',
  );
} finally {
  await server.close();
}
