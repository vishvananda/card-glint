import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-colors.json'),
);
const identity = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { earlyExpansionFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-frame.ts',
  );
  const { earlyExpansionColors } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-colors.ts',
  );
  const { EARLY_EXPANSION_COLORS } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-color-values.ts',
  );
  const { calibratedFrameMaterials, calibratedPrintingStock } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  assert.equal(Object.keys(EARLY_EXPANSION_COLORS).length, 18);
  for (const [key, profile] of Object.entries(EARLY_EXPANSION_COLORS)) {
    const [setCode, material] = key.split('/');
    const face = {
      name: 'Shared material probe',
      setCode,
      colors: /^[WUBRG]$/.test(material) ? [material] : [],
      typeLine: material === 'L' ? 'Land' : material === 'A' ? 'Mono Artifact' : 'Summon Goblins',
      colorCalibration: 'set-hsb-v1',
    };
    const frame = earlyExpansionFrame(face);
    assert.equal(profile.source, JSON.stringify([frame.asset, frame.frame]));
    const record = evidence.groups[key];
    assert.deepEqual(profile, record.profile);
    const result = earlyExpansionColors(face);
    assert.deepEqual(result, {
      materials: { [frame.asset]: profile.adjustment },
      stock: '#181510',
    });
    assert.deepEqual(calibratedFrameMaterials(face), result.materials);
    assert.equal(calibratedPrintingStock(face), result.stock);
    assert.equal(profile.adjustment.blackPoint, undefined, 'No obsolete source ink curve');
    assert.equal(profile.adjustment.outerStock, undefined, 'Stock is recut independently');
    for (const component of ['frame', 'paper']) {
      const c = record.components[component];
      if (!c.selected) {
        assert.deepEqual(profile.adjustment[component], identity, 'Rejected fit must stay raw');
      }
    }
    // Custom layouts, opt-out, unrelated sets and explicit stock must not
    // inherit a calibration from an ordinary black-border source.
    for (const override of [
      { colorCalibration: undefined },
      { colorCalibration: 'early-hsb-v1' },
      { borderColor: 'white' },
      { borderColor: 'silver' },
      { frameStyle: 'modern' },
      { frameTemplate: 'future' },
      { layout: 'split' },
      { setCode: 'leg' },
      { setCode: 'lea' },
      { setCode: 'leb' },
      { setCode: '2ed' },
      { setCode: '3ed' },
    ])
      assert.equal(earlyExpansionColors({ ...face, ...override }), undefined);
    const source = profile.source;
    try {
      profile.source += '?unreviewed';
      assert.equal(earlyExpansionColors(face), undefined, 'Stale source/geometry must fail shut');
    } finally {
      profile.source = source;
    }
  }
  for (const face of [
    { setCode: 'arn', name: 'Mountain', typeLine: 'Land' },
    { setCode: 'drk', typeLine: 'Land' },
    { setCode: 'atq', typeLine: 'Summon', colors: ['R'] },
    { setCode: 'drk', typeLine: 'Summon', colors: ['R'] },
    { setCode: 'drk', typeLine: 'Summon', colors: ['G', 'R'] },
  ])
    assert.equal(earlyExpansionColors({ ...face, colorCalibration: 'set-hsb-v1' }), undefined);
  console.log('Early color material bindings, rejected fits and opt-out scope pass.');
} finally {
  await server.close();
}
