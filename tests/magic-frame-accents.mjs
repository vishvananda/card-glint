import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { colorFrame } = await server.ssrLoadModule('/games/magic/src/presentation/frame-hsb.ts');
  const { frameAccentMask } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-accent-mask.ts',
  );
  const { earlyHsbMaterialKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-hsb-material.ts',
  );
  const identity = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
  const mask = {
    rings: [{ outer: [0.1, 0.1, 0.8, 0.8], inner: [0.25, 0.25, 0.5, 0.5] }],
    hueCenter: 55,
    hueRadius: 35,
    hueFeather: 10,
    saturation: [0.35, 0.7],
  };
  const source = { width: 20, height: 20, data: new Uint8ClampedArray(20 * 20 * 4) };
  for (let p = 0; p < 400; p++) source.data.set([190, 210, 220, 255], p * 4);
  const put = (x, y, color) => source.data.set(color, (y * 20 + x) * 4);
  // Equal pigment in the ring, paper and external frame proves spatial isolation.
  for (const [x, y] of [
    [3, 8],
    [8, 8],
    [0, 8],
  ])
    put(x, y, [240, 200, 20, 255]);
  put(3, 9, [8, 7, 1, 255]);
  put(3, 10, [140, 140, 140, 255]);
  put(3, 11, [240, 200, 20, 0]);
  const weights = frameAccentMask(source, mask);
  assert.equal(weights[8 * 20 + 3], 1);
  assert.equal(weights[8 * 20 + 8], 0);
  assert.equal(weights[8 * 20], 0);
  assert.equal(weights[10 * 20 + 3], 0);
  assert.equal(weights[11 * 20 + 3], 0);
  put(3, 12, [120, 100, 10, 255]);
  const highlights = frameAccentMask(source, { ...mask, brightness: [0.65, 0.85] });
  assert.equal(highlights[8 * 20 + 3], 1);
  assert.equal(highlights[12 * 20 + 3], 0, 'Highlight correction must preserve bevel shadows');
  assert.throws(
    () => frameAccentMask(source, { ...mask, brightness: [0.9, 0.6] }),
    /Invalid source pigment/,
  );
  put(3, 12, [190, 210, 220, 255]);
  const profile = {
    frame: identity,
    paper: identity,
    mask: { kind: 'rect', rect: [0.25, 0.25, 0.5, 0.5], feather: 0.01 },
    accents: [{ mask, adjustment: { hueDegrees: 0, saturationScale: 0.5, brightnessScale: 0.8 } }],
  };
  const actual = { ...source, data: source.data.slice() };
  colorFrame(actual, profile);
  assert.deepEqual(
    [...actual.data.slice((8 * 20 + 3) * 4, (8 * 20 + 3) * 4 + 4)],
    [192, 176, 104, 255],
  );
  for (let p = 0; p < 400; p++)
    if (p !== 8 * 20 + 3)
      assert.deepEqual(
        actual.data.slice(p * 4, p * 4 + 4),
        source.data.slice(p * 4, p * 4 + 4),
        'Changed unrelated source pixel ' + p,
      );
  assert.notEqual(
    earlyHsbMaterialKey('source', 20, 20, profile),
    earlyHsbMaterialKey('source', 20, 20, { ...profile, accents: [] }),
  );
  assert.throws(
    () => frameAccentMask(source, { ...mask, hueFeather: 0 }),
    /Invalid source pigment/,
  );
  assert.throws(
    () =>
      frameAccentMask(source, {
        ...mask,
        rings: [{ outer: [0.2, 0.2, 0.2, 0.2], inner: [0, 0, 1, 1] }],
      }),
    /nested positive/,
  );
  console.log(
    'Source pigment masks isolate colored rings, preserve gray bevels, black ink and alpha, and invalidate the derived-material cache.',
  );
} finally {
  await server.close();
}
