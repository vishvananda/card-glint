import { readFile } from 'node:fs/promises';
import { modernOrdinaryBaselineStudy } from '../games/magic/tools/accuracy/modern-ordinary-baseline-study.mjs';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { modernOrdinaryPlates, modernPrintingProfileKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/modern-printing-profile.ts',
  );
  const { framePlate } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const { printingCalibrationMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const { FACE_RECTS, FACE_TEXT } = await server.ssrLoadModule(
    '/games/magic/src/presentation/face-layout.ts',
  );
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { modernCostNumeralAsset } = await server.ssrLoadModule(
    '/games/magic/src/presentation/modern-cost-mana.ts',
  );
  const base = {
    name: 'Control',
    typeLine: 'Creature — Dog',
    setCode: 'M21',
    frameStyle: 'modern',
    layout: 'normal',
    colors: ['W'],
    colorCalibration: 'set-hsb-v1',
  };
  const { styledSymbolBounds } = await server.ssrLoadModule(
    '/games/magic/src/presentation/styled-symbol-placement.ts',
  );
  const { faceSetSymbol } = await server.ssrLoadModule('/games/magic/src/presentation/assets.ts');
  const { printingColorSource } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-source.ts',
  );
  assert(printingColorSource(base).key.includes('/m15-accurate/'));
  const key = JSON.stringify(modernPrintingProfileKey(base));
  assert(key.includes('/m15/new/w.png'));
  assert(!key.includes('/m15/new/u.png'));
  assert(
    !JSON.stringify(modernPrintingProfileKey({ ...base, typeLine: 'Land', colors: [] })).includes(
      '/m15/new/',
    ),
  );
  const snapshot = structuredClone(base),
    plate = framePlate(base);
  assert(modernOrdinaryPlates(base));
  assert(plate.frame.endsWith('/m15/new/w.png'));
  assert.deepEqual(plate.rects.rules, FACE_RECTS.rules);
  assert.deepEqual(plate.rects.stats, FACE_RECTS.stats);
  assert.equal(plate.mana.size, FACE_TEXT.manaSize);
  assert.equal(plate.mana.gap, FACE_TEXT.manaGap);
  assert(!plate.pt.includes('/m15/new/'));
  const urls = canvasAssetUrls(base);
  assert(urls.includes(plate.frame));
  assert(urls.includes(plate.border));
  const { calibratedFrameMaterials, hasCalibratedFramePigment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const { colorCalibrationCoverage } = await server.ssrLoadModule(
    '/games/magic/src/presentation/color-calibration-coverage.ts',
  );
  assert(hasCalibratedFramePigment(base));
  assert(colorCalibrationCoverage(base).frame);
  assert.deepEqual(calibratedFrameMaterials(base), modernOrdinaryPlates(base));
  const resolved = printingCalibrationMaterials(base);
  assert.equal(resolved.border, '#16130e');
  for (const calibration of ['auto', 'printing', { profile: 'm21-modern' }]) {
    const policy = printingCalibrationMaterials({ ...base, calibration });
    assert.deepEqual(policy.materials, resolved.materials);
    assert.equal(policy.border, resolved.border);
  }

  assert(resolved.materials[plate.frame]?.outerStockMaskSource === plate.border);
  for (const extra of [{ colorCalibration: undefined }, { calibration: 'source' }])
    assert(!printingCalibrationMaterials({ ...base, ...extra }).materials[plate.frame]);
  assert(modernCostNumeralAsset(base, '2')?.endsWith('/2.svg'));
  const explicit = { ...base, frameAssetFamily: 'm15-accurate' };
  assert.deepEqual(framePlate(explicit), plate);
  const bounds = [390, 390, 50, 25],
    icon = faceSetSymbol(base);
  assert.deepEqual(
    styledSymbolBounds(base, icon, bounds),
    styledSymbolBounds(explicit, icon, bounds),
  );

  assert.equal(modernCostNumeralAsset(explicit, '2'), modernCostNumeralAsset(base, '2'));
  for (const extra of [
    { setCode: 'war' },
    { setCode: '8ed' },
    { frameStyle: 'retro' },
    { frameAssetFamily: 'eighth' },
    { frameTemplate: 'future' },
    { layout: 'transform' },
    { layout: 'planeswalker' },
    { legendary: true },
    { land: true },
    { artifact: true },
    { borderColor: 'white' },
    { borderColor: 'silver' },
    { frameColors: ['R', 'G'] },
    { typeLine: 'Legendary Creature — Dog' },
    { typeLine: 'Land' },
    { typeLine: 'Artifact', colors: ['W'] },
    { colors: ['W', 'U'] },
    { typeLine: 'Vehicle' },
    { typeLine: 'Enchantment — Saga' },
    { rulesText: 'Level up {1}' },
    { colors: [] },
    { faces: [{ name: 'Other' }] },
  ])
    assert.equal(modernOrdinaryPlates({ ...base, ...extra }), undefined, JSON.stringify(extra));
  assert.equal(framePlate({ ...base, setCode: 'war' }), null);
  assert(framePlate({ ...base, typeLine: 'Artifact', colors: [] }).frame.endsWith('/a.png'));
  assert.deepEqual(base, snapshot);
  const materials = Object.values(modernOrdinaryPlates(base));
  assert.equal(materials.length, 6);
  for (const m of materials) {
    assert.equal(m.regions.length, 2);
    assert.equal(m.outerStockMaskSource, plate.border);
    for (const polygon of [m.mask, ...m.regions.map((r) => r.mask)]) {
      assert.equal(polygon.kind, 'polygon');
      assert(polygon.points.every((p) => p.every((v) => v >= 0 && v <= 1)));
    }
  }
} finally {
  await server.close();
}
const file = 'games/magic/src/presentation/modern-printing-profile.ts';
const source = await readFile(file, 'utf8'),
  plugin = modernOrdinaryBaselineStudy();
const disabled = plugin.transform(source, '/' + file);
const marker = 'export function modernOrdinaryPlates(';
assert.equal(
  disabled.code.slice(0, disabled.code.indexOf(marker)),
  source.slice(0, source.indexOf(marker)),
);
assert(disabled.code.endsWith('return undefined; }\n'));
assert.throws(() => plugin.transform(source + '// Changed helper\n', '/' + file));
assert.equal(plugin.transform(source, '/other.ts'), undefined);
// A global asset revision must not silently reuse a calibrated old plate.
const stale = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false },
  plugins: [
    {
      name: 'stale-frame-root-test',
      enforce: 'pre',
      transform(source, id) {
        if (!id.endsWith('/games/magic/assets.json')) return;
        return {
          code: source.replaceAll(
            '33f2547137fe366b40e9e8dba4eb591af190fddf',
            '0000000000000000000000000000000000000000',
          ),
          map: null,
        };
      },
    },
  ],
});
try {
  await stale.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { modernOrdinaryPlates } = await stale.ssrLoadModule(
    '/games/magic/src/presentation/modern-printing-profile.ts',
  );
  const { framePlate } = await stale.ssrLoadModule('/games/magic/src/presentation/frame-plates.ts');
  const face = { name: 'Stale asset', setCode: 'm21', typeLine: 'Creature', colors: ['W'] };
  assert.equal(modernOrdinaryPlates(face), undefined);
  assert.equal(framePlate(face), null);
} finally {
  await stale.close();
}
console.log(
  'M21 ordinary plate source, shared materials, retained controls, source mode and excluded families passed.',
);
