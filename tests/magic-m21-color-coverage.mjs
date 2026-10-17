import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { applyM21Evidence } from '../games/magic/tools/accuracy/calibration-m21-evidence.mjs';
const read = async (file) => JSON.parse(await readFile('games/magic/fixtures/accuracy/' + file));
const evidence = await read('m21-normal-color-adoption.json'),
  normal = await read('m21-normal-boundaries.json');

const ledger = await read('calibration-progress.json'),
  m21 = ledger.sets.find((s) => s.set === 'm21');
const scorn = m21.groups.find((g) =>
  g.printingIds.includes(evidence.normalization.unresolved[0].id),
);
const current = structuredClone(scorn);
applyM21Evidence(
  current,
  { key: evidence.key, source: evidence.profile.source },
  evidence,
  normal,
  true,
);
assert.equal(current.tasks.normalization.status, 'partial');
assert.equal(current.tasks.frameColor.status, 'partial');
const stale = structuredClone(scorn);
applyM21Evidence(
  stale,
  { key: evidence.key, source: evidence.profile.source },
  evidence,
  normal,
  false,
);
assert.equal(stale.tasks.frameColor.status, 'stale');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { PRINTING_COLOR_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-profiles.ts',
  );
  const { calibratedFrameMaterials, hasCalibratedFramePigment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  assert.deepEqual(PRINTING_COLOR_PROFILES[evidence.key], evidence.profile);
  const face = {
    name: 'Scope probe',
    setCode: 'm21',
    colors: ['B'],
    typeLine: 'Creature',
    colorCalibration: 'set-hsb-v1',
  };
  const pigment = Object.fromEntries(
    Object.entries(calibratedFrameMaterials(face)).map(
      ([url, { blackPoint, outerStock, outerStockMaskSource, ...value }]) => [url, value],
    ),
  );
  assert.deepEqual(pigment, evidence.profile.materials);
  assert.equal(hasCalibratedFramePigment(face), true);
  for (const excluded of [
    { typeLine: 'Legendary Creature' },
    { typeLine: 'Artifact' },
    { typeLine: 'Planeswalker' },
    { typeLine: 'Land', colors: [] },
    { setCode: 'unmeasured' },
    { colorCalibration: undefined },
    { frameAssetFamily: 'm15-accurate' },
    { borderColor: 'white' },
    { layout: 'token' },
  ])
    assert.equal(
      hasCalibratedFramePigment({ ...face, ...excluded }),
      false,
      JSON.stringify(excluded),
    );
  assert.ok(!Object.keys(pigment).some((url) => url.includes('/legendary_crowns/')));
} finally {
  await server.close();
}
console.log(
  'M21: normal-black material selection, excluded scopes and evidence status transitions passed.',
);
