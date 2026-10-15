import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { isRevisedLand, revisedLandColors, REVISED_LAND_ASSET } = await server.ssrLoadModule(
    '/games/magic/src/presentation/revised-land-frame.ts',
  );
  const { colorRevisedLand } = await server.ssrLoadModule(
    '/games/magic/src/presentation/revised-land-pixels.ts',
  );
  const { colorCalibrationCoverage } = await server.ssrLoadModule(
    '/games/magic/src/presentation/color-calibration-coverage.ts',
  );
  const { printingColorSource } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-source.ts',
  );
  const { retroAssets, retroFrameAsset } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const face = {
    name: 'Land',
    setCode: '3ed',
    typeLine: 'Land',
    land: true,
    frameColors: ['B', 'G'],
  };
  assert.equal(isRevisedLand(face), true);
  for (const override of [
    { setCode: '4ed' },
    { setCode: 'leb' },
    { frameStyle: 'modern' },
    { layout: 'split' },
    { frameTemplate: 'future' },
    { typeLine: 'Enchantment Land — Saga' },
    { land: false, typeLine: 'Enchant Land' },
  ])
    assert.equal(isRevisedLand({ ...face, ...override }), false);
  for (const [colors, expected] of [
    ['BG', 'BG'],
    ['WG', 'WG'],
    ['RG', 'RG'],
    ['UB', 'BU'],
    ['WU', 'WU'],
    ['UR', 'RU'],
    ['WB', 'BW'],
    ['BR', 'RB'],
    ['WR', 'RW'],
    ['UG', 'UG'],
  ]) {
    const original = { ...face, frameColors: colors.split('') };
    const oracle = { ...original, wordingMode: 'oracle', typeLine: 'Land — Swamp Forest' };
    assert.equal(revisedLandColors(original).join(''), expected);
    assert.deepEqual(revisedLandColors(original), revisedLandColors(oracle));
    assert.equal(retroFrameAsset(original), REVISED_LAND_ASSET);
    assert.equal(retroFrameAsset(oracle), REVISED_LAND_ASSET);
    assert.ok(
      !retroAssets(original).some((url) => /border(?:Black|White)\.png$/.test(url)),
      'Revised crops its own outer edge; a Fourth border mask must not cover the fitted frame',
    );
    assert.equal(
      printingColorSource(original),
      undefined,
      'Composite color regions cannot inherit a single neutral-land profile',
    );
    assert.equal(colorCalibrationCoverage(original).frame, false);
    assert.equal(
      colorCalibrationCoverage({ ...original, colorCalibration: 'set-hsb-v1' }).frame,
      true,
    );
    assert.equal(
      colorCalibrationCoverage({ ...original, colorCalibration: 'early-hsb-v1' }).frame,
      true,
    );
  }
  const bitmap = () => {
    const data = new Uint8ClampedArray(150 * 210 * 4);
    for (let i = 0; i < data.length; i += 4) data.set([228, 198, 130, 255], i);
    data.set([0, 0, 0, 255], (150 * 150 + 25) * 4);
    data.set([81, 93, 105, 0], 0);
    return { width: 150, height: 210, data };
  };
  const pixel = (p, x, y) =>
    Array.from(p.data.slice((y * p.width + x) * 4, (y * p.width + x) * 4 + 4));
  for (const calibrated of [false, true]) {
    const single = {};
    for (const color of 'WUBRG') {
      single[color] = bitmap();
      colorRevisedLand(single[color], [color], calibrated);
      assert.deepEqual(
        pixel(single[color], 25, 150),
        [0, 0, 0, 255],
        'Preserve dark printed detail',
      );
      assert.deepEqual(
        pixel(single[color], 0, 0),
        [81, 93, 105, 0],
        'Preserve transparent art aperture',
      );
    }
    assert.equal(new Set(Object.values(single).map((p) => pixel(p, 20, 149).join(','))).size, 5);
    const dual = bitmap();
    colorRevisedLand(dual, ['B', 'G'], calibrated);
    assert.deepEqual(pixel(dual, 20, 149), pixel(single.B, 20, 149));
    assert.deepEqual(pixel(dual, 25, 149), pixel(single.G, 25, 149));
  }
  const raw = bitmap(),
    calibrated = bitmap();
  colorRevisedLand(raw, ['R'], false);
  colorRevisedLand(calibrated, ['R'], true);
  assert.notDeepEqual(
    pixel(raw, 20, 149),
    pixel(calibrated, 20, 149),
    'Printing HSB remains an explicit option',
  );
  const empty = bitmap(),
    before = empty.data.slice();
  colorRevisedLand(empty, [], true);
  assert.deepEqual(empty.data, before);
  console.log(
    'Revised land source guards, semantic palettes, stripes, optional calibration and alpha/ink preservation passed.',
  );
} finally {
  await server.close();
}
