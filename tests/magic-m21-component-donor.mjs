import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { modernOrdinaryBaselineStudy } from '../games/magic/tools/accuracy/modern-ordinary-baseline-study.mjs';
const options = { configFile: false, server: { middlewareMode: true, hmr: false, ws: false } };
const current = await createServer(options);
const legacy = await createServer({
  ...options,
  plugins: [
    modernOrdinaryBaselineStudy(),
    {
      name: 'prior-m21-component-materials',
      enforce: 'pre',
      transform(source, id) {
        if (!id.endsWith('/presentation/calibration-profiles.ts')) return;
        const needle = `  const modern = modernComponentMaterials(face);
  return modernPrintingProfile(face)?.inheritedFrom
    ? { ...modern, ...materials }
    : { ...materials, ...modern };`;
        assert.equal(source.split(needle).length, 2);
        return { code: source.replace(needle, '  return materials;'), map: null };
      },
    },
  ],
});
try {
  for (const server of [current, legacy])
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const now = await current.ssrLoadModule('/games/magic/src/presentation/calibration-profiles.ts');
  const before = await legacy.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const { printingCalibrationMaterials } = await current.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const variants = [
    ...['W', 'U', 'B', 'R', 'G'].map((c) => ({ typeLine: 'Creature', colors: [c] })),
    { typeLine: 'Artifact', colors: [] },
    { typeLine: 'Artifact', colors: ['W'] },
    { typeLine: 'Creature', colors: ['W', 'U'] },
    { typeLine: 'Legendary Creature', legendary: true, colors: ['G'] },
    { typeLine: 'Land', land: true, colors: [], frameColors: [] },
    { typeLine: 'Land', land: true, colors: [], frameColors: ['W', 'U'] },
  ];
  let existingComponents = 0;
  for (const v of variants) {
    const donor = {
      name: '',
      setCode: 'M21',
      frameStyle: 'modern',
      layout: 'normal',
      colorCalibration: 'set-hsb-v1',
      ...v,
    };
    assert.deepEqual(
      now.calibratedComponentDonorMaterials(donor),
      before.calibratedFrameMaterials(donor),
      JSON.stringify(v),
    );
    const face = { ...donor, setCode: 'qzz', calibration: 'auto' };
    const resolved = printingCalibrationMaterials(face);
    const measured = printingCalibrationMaterials(donor);
    existingComponents += resolved.fallbackAssets.length;
    for (const url of resolved.fallbackAssets)
      assert.deepEqual(
        resolved.materials[url],
        measured.materials[url],
        'Inherited material differs from the same exact M21 source',
      );
  }
  assert(existingComponents > 0, 'No pre-existing component fallback was exercised');
  const source = printingCalibrationMaterials({
    name: '',
    setCode: 'qzz',
    typeLine: 'Creature',
    colors: ['B'],
    calibration: 'source',
  });
  assert.deepEqual(source.materials, {});
  console.log(
    'M21 donor:11 source-local legacy material lookups remain unchanged; current inherited materials match the same exact M21 sources.',
  );
} finally {
  await Promise.all([current.close(), legacy.close()]);
}
