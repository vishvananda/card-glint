import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { modernOrdinaryBaselineStudy } from '../games/magic/tools/accuracy/modern-ordinary-baseline-study.mjs';
const options = { configFile: false, server: { middlewareMode: true, hmr: false, ws: false } };
const current = await createServer(options);
const legacy = await createServer({ ...options, plugins: [modernOrdinaryBaselineStudy()] });
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
    assert(
      !Object.keys(resolved.materials).some((url) => url.includes('/m15/new/')),
      'New source leaked into component fallback',
    );
    existingComponents += resolved.fallbackAssets.length;
    for (const url of resolved.fallbackAssets)
      assert.deepEqual(resolved.materials[url], before.calibratedFrameMaterials(donor)[url]);
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
    'M21 component donor:11 frame/color variants exactly retain previous materials, black point and fallback sources.',
  );
} finally {
  await Promise.all([current.close(), legacy.close()]);
}
