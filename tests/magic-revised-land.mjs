import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
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
  const { DUAL_BOX, revisedDualPinline } = await server.ssrLoadModule(
    '/games/magic/src/presentation/revised-land-pinline.ts',
  );
  // Integrate each straight edge at several source decode resolutions. Even a
  // subpixel outline must retain its coverage, and all four sides must have
  // equal physical widths after the frame's non-square source transform.
  const axes = { x: ((488 * 0.984) / 1500) * 1.001, y: ((680 * 0.99) / 2100) * 1.001 };
  const saturated = [
    [1, 0, 0],
    [0, 1, 0],
  ];
  const areas = [];
  for (const size of [150, 488, 750, 1500]) {
    const pw = 1500 / size,
      ph = 2100 / Math.round(size * 1.4);
    for (const side of ['left', 'right', 'top', 'bottom']) {
      const horizontal = side === 'left' || side === 'right';
      const step = horizontal ? pw : ph;
      const total = [0, 0, 0, 0];
      const edge = DUAL_BOX[side];
      for (let n = Math.floor((edge - 40) / step); n <= Math.ceil((edge + 40) / step); n++) {
        const point = (n + 0.5) * step;
        const result = revisedDualPinline(
          horizontal ? point : 750,
          horizontal ? 1500 : point,
          pw,
          ph,
          saturated,
        );
        if (!result) continue;
        const weight = result.alpha * step * axes[horizontal ? 'x' : 'y'];
        total[0] += weight;
        for (let k = 0; k < 3; k++) total[k + 1] += weight * result.color[k];
      }
      areas.push(total);
    }
  }
  for (const measured of areas)
    for (let k = 0; k < 4; k++)
      assert.ok(
        Math.abs(measured[k] - areas[0][k]) < 1e-8,
        'Band coverage must match on every side and at every decode resolution',
      );
  const dark = areas[0][3] / 0.17;
  const firstColor = areas[0][1] - dark * 0.18;
  const secondColor = areas[0][2] - dark * 0.18;
  assert.ok(dark > 0, 'Subpixel edge lines cannot disappear');
  assert.ok(
    Math.abs(firstColor - 2 * secondColor) < 1e-8,
    'Three equal color bands retain the same area per band',
  );
  const sequence = [];
  for (let x = DUAL_BOX.left - 1; x < DUAL_BOX.left + 35; x += 0.02) {
    const result = revisedDualPinline(x, 1500, 0.001, 0.001, saturated);
    if (!result) continue;
    const kind =
      result.color[2] > 0.04 ? 'edge' : result.color[0] > result.color[1] ? 'first' : 'second';
    if (sequence.at(-1) !== kind) sequence.push(kind);
  }
  assert.deepEqual(sequence, ['edge', 'first', 'second', 'first', 'edge']);
  const { colorAbuDualPinline } = await server.ssrLoadModule(
    '/games/magic/src/presentation/abu-dual-pinline.ts',
  );
  for (const size of [150, 488, 750]) {
    const height = Math.round(size * 1.4);
    const data = new Uint8ClampedArray(size * height * 4).fill(128);
    for (let i = 3; i < data.length; i += 4) data[i] = 255;
    const original = data.slice();
    const p = { width: size, height, data };
    colorAbuDualPinline(p, ['G']);
    assert.deepEqual(data, original, 'Single-color lands are unchanged');
    colorAbuDualPinline(p, ['B', 'G']);
    assert.notDeepEqual(data, original, 'ABU dual border is restored');
    const reversed = { width: size, height, data: original.slice() };
    colorAbuDualPinline(reversed, ['G', 'B']);
    assert.deepEqual(data, reversed.data, 'Border order is independent of caller color order');
    for (let y = 0; y < height; y++)
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        assert.equal(data[i + 3], original[i + 3], 'Preserve alpha');
        if (x / size < 0.12 || x / size > 0.89 || y / height < 0.59 || y / height > 0.9)
          assert.deepEqual(
            data.subarray(i, i + 4),
            original.subarray(i, i + 4),
            'Do not change other frame parts',
          );
      }
  }
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
    'Revised land source guards, semantic palettes, stripes, optional calibration, alpha/ink preservation and uniform border coverage passed.',
  );
} finally {
  await server.close();
}
