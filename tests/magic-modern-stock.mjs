import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  const { printingCalibrationMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const { resolvePrintingCalibration } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration.ts',
  );
  const { printingCalibrationProfiles } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-types.ts',
  );
  const profile = printingCalibrationProfiles.find((p) => p.id === 'm21-modern');
  assert.equal(profile.revision, 15);
  const signature = (p) => ({
    materials: p.materials,
    border: p.border,
    fallbackStock: p.fallbackStock,
    fallbackAssets: [...p.fallbackAssets].sort(),
  });
  let roles = 0;
  for (const colors of [[], ['W'], ['U'], ['B'], ['R'], ['G'], ['U', 'R']])
    for (const typeLine of [
      'Creature — Wizard',
      'Legendary Creature — Wizard',
      'Legendary Planeswalker — Fixture',
      'Land',
    ]) {
      const face = {
        name: 'Original local stock fixture',
        setCode: 'm21',
        frameStyle: 'modern',
        typeLine,
        colors,
        frameColors: colors,
        manaSymbols: ['2', 'U'],
        rulesText: typeLine.includes('Planeswalker')
          ? '+1: Draw a card.\n−2: Draw a card.'
          : 'Draw a card.',
        artist: 'Fixture Artist',
        collectorNumber: '42',
        colorCalibration: 'set-hsb-v1',
      };
      const implicit = printingCalibrationMaterials(face);
      assert.equal(implicit.border, '#16130e');
      assert.equal(implicit.fallbackStock, false);
      for (const calibration of ['auto', 'printing', { profile: 'm21-modern' }])
        assert.deepEqual(
          signature(printingCalibrationMaterials({ ...face, calibration })),
          signature(implicit),
          typeLine + '/' + colors + '/' + JSON.stringify(calibration),
        );
      assert.equal(resolvePrintingCalibration(face).components.border.revision, 15);
      for (const extra of [
        { calibration: 'source' },
        { colorCalibration: undefined },
        { borderColor: 'white' },
      ])
        assert.equal(printingCalibrationMaterials({ ...face, ...extra }).border, undefined);
      const other = { ...face, setCode: 'qst' };
      const inherited = printingCalibrationMaterials(other);
      assert.equal(inherited.border, '#16130e');
      assert.equal(inherited.fallbackStock, true);
      const report = resolvePrintingCalibration(other);
      assert.equal(report.components.border.status, 'fallback');
      assert.equal(report.components.border.revision, 15);
      assert.equal(report.defaults.revision, 15);
      assert.deepEqual(
        signature(
          printingCalibrationMaterials({ ...other, calibration: { profile: 'm21-modern' } }),
        ),
        signature(inherited),
      );
      assert.equal(
        printingCalibrationMaterials({ ...other, calibration: 'printing' }).border,
        undefined,
      );
      roles++;
    }
  console.log(
    JSON.stringify({
      roles,
      policies: 4,
      revision: profile.revision,
      scope:
        'Shared modern stock and complete named source-compatible material fits; source/white/raw and independent-printing policies remain explicit.',
    }),
  );
} finally {
  await server.close();
}
