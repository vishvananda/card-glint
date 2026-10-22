import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { modernOrdinaryPlates } = await server.ssrLoadModule(
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
  const resolved = printingCalibrationMaterials(base);
  assert.equal(resolved.border, '#16130e');
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
console.log(
  'M21 ordinary plate source, shared materials, retained controls, source mode and excluded families passed.',
);
