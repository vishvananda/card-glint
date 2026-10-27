import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const load = await server.ssrLoadModule('/games/magic/src/data/load.ts');
  const { calibrationForFace, usesFourthDefaults } = await server.ssrLoadModule(
    '/games/magic/src/calibration/selection.ts',
  );
  const { setCalibrationProfile } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  const face = {
    name: 'Ice probe',
    setCode: 'ICE',
    typeLine: 'Summon Wizard',
    creature: true,
    land: false,
    artifact: false,
    colors: ['U'],
    manaSymbols: ['2', 'U'],
    frameStyle: 'retro',
    wordingMode: 'original',
    symbolStyle: 'original',
    colorCalibration: 'set-hsb-v1',
  };
  await load.prepareMagicCards([face]);
  const loaded = load.loadedMagicSets();
  assert(loaded.includes('ice') && loaded.includes('4ed'));
  assert(!loaded.includes('m21'));
  const donor = setCalibrationProfile('4ed'),
    before = JSON.stringify(donor);
  const inherited = calibrationForFace(face);
  assert.equal(inherited.set, 'ice');
  assert.equal(inherited.border, 'black');
  assert.equal(inherited.frames, donor.frames);
  assert.equal(inherited.title, donor.title);
  assert.equal(inherited.body, donor.body);
  assert.equal(calibrationForFace(face), inherited);
  const { earlyReprintFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-frame.ts',
  );
  const { earlyReprintColors } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-colors.ts',
  );
  const { earlyReprintManaTarget, earlyReprintManaInk, earlyReprintManaDefaults } =
    await server.ssrLoadModule('/games/magic/src/presentation/early-reprint-mana.ts');
  const { retroPrintDetails, originalRulesSymbols, paintHistoricMana } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-details.ts',
  );
  for (const color of ['W', 'U', 'B', 'R', 'G']) {
    const probe = { ...face, colors: [color] };
    const frame = earlyReprintFrame(probe);
    assert.equal(frame.family, 'fourth');
    assert.equal(earlyReprintColors(probe).stock, '#080808');
    assert.deepEqual(earlyReprintManaDefaults(probe), donor.mana.geometry);
    assert.equal(earlyReprintManaTarget(probe, color), undefined);
    assert.equal(earlyReprintManaInk(probe), undefined);
    assert.equal(retroPrintDetails(probe).manaTop, 27.5);
    assert.equal(retroPrintDetails(probe).setRight, undefined);
  }
  assert.equal(originalRulesSymbols('ice'), paintHistoricMana);
  for (const extra of [
    { colors: ['U', 'R'] },
    { setCode: 'mir' },
    { setCode: 'ons' },
    { setCode: 'usg' },
    { calibration: 'printing' },
    { frameStyle: 'modern' },
    { layout: 'saga' },
    { frameTemplate: 'custom' },
    { frameAssetFamily: 'custom' },
    { borderColor: 'white' },
  ]) {
    assert.equal(usesFourthDefaults({ ...face, ...extra }), false);
    assert.equal(calibrationForFace({ ...face, ...extra }), undefined);
  }
  assert.equal(
    earlyReprintFrame({ ...face, colors: ['U', 'R'] }),
    undefined,
    'No invented gold Fourth asset',
  );
  assert.equal(
    earlyReprintFrame({ ...face, typeLine: 'Land', land: true, colors: [], frameColors: ['U'] })
      .family,
    'abu',
  );
  const { resolvePrintingCalibration } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration.ts',
  );
  const report = resolvePrintingCalibration(face);
  assert.equal(report.components.frame.status, 'fallback');
  assert.equal(report.components.frame.profile, 'printing:4ed');
  assert(report.notices.some((n) => n.includes('not been independently calibrated')));
  assert.equal(
    earlyReprintColors({ ...face, calibration: 'source', colorCalibration: undefined }),
    undefined,
  );
  assert.equal(JSON.stringify(donor), before, 'Donor remains immutable');
  await load.loadMagicSet('ICE');
  assert.equal(calibrationForFace({ ...face, setCode: 'ice' }), inherited);
  console.log(
    'Ice Age: lazy Fourth dependency, shared profile tables, black stock, own symbols/palette, source/exact/custom scope and honest inherited provenance pass.',
  );
} finally {
  await server.close();
}
