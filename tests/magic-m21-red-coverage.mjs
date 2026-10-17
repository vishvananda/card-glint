import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { applyM21RedColor } from '../games/magic/tools/accuracy/calibration-m21-scope.mjs';
const read = async (f) => JSON.parse(await readFile('games/magic/fixtures/accuracy/' + f));
const receipt = await read('m21-red-color-adoption.json');
const ledger = await read('calibration-progress.json');
for (const g of ledger.sets.find((s) => s.set === 'm21').groups) {
  const rows = receipt.metrics.rows.filter((r) => g.printingIds.includes(r.id));
  if (!rows.length) continue;
  const changed = structuredClone(g);
  applyM21RedColor(changed, receipt.source, receipt, true);
  assert.equal(
    changed.tasks.frameColor.status,
    rows.length === g.printings ? 'validated' : 'partial',
  );
  assert.equal(changed.tasks.frameColor.coveredPrintings, rows.length);
  applyM21RedColor(changed, receipt.source, receipt, false);
  assert.equal(changed.tasks.frameColor.status, 'stale');
  applyM21RedColor(changed, { source: 'replaced-asset' }, receipt, true);
  assert.equal(changed.tasks.frameColor.status, 'stale');
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { ORDINARY_COLOR_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/ordinary-color-profiles.ts',
  );
  const { PRINTING_COLOR_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-profiles.ts',
  );
  const { calibratedFrameMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  assert.deepEqual(ORDINARY_COLOR_PROFILES[receipt.key], receipt.profile);
  const source = receipt.source;
  assert.deepEqual(
    receipt.profile.materials[source.frame].paper,
    PRINTING_COLOR_PROFILES[receipt.key].materials[source.frame].paper,
  );
  const face = {
    name: 'Red probe',
    typeLine: 'Creature',
    colors: ['R'],
    setCode: 'm21',
    colorCalibration: 'set-hsb-v1',
  };
  assert.deepEqual(calibratedFrameMaterials(face), receipt.profile.materials);
  assert.deepEqual(
    calibratedFrameMaterials({ ...face, legendary: true }),
    PRINTING_COLOR_PROFILES[receipt.key].materials,
  );
  assert.deepEqual(calibratedFrameMaterials({ ...face, colorCalibration: undefined }), {});
} finally {
  await server.close();
}
console.log(
  'M21 red: ordinary/legendary material selection, disabled calibration and evidence status transitions passed.',
);
