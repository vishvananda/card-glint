import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { root } from '../games/magic/tools/accuracy/common.mjs';
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const load = await server.ssrLoadModule('/games/magic/src/data/load.ts');
  await load.loadMagicSet('lea');
  assert(!load.loadedMagicSets().includes('8ed'), 'Alpha alone must not download the Eighth donor');
  assert(!load.loadedMagicSets().includes('m21'));
  await load.loadMagicSet('9ed');
  assert(load.loadedMagicSets().includes('8ed'), 'Set-only Eighth-era load needs its donor');
  assert(!load.loadedMagicSets().includes('m21'), 'Eighth frames do not need M21 data');
  const { eighthPrintingProfile: profile } = await server.ssrLoadModule(
    '/games/magic/src/presentation/eighth-printing-profile.ts',
  );
  const { framePlate } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const { printingCalibrationMaterials, calibratedManaTarget } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const { resolvePrintingCalibration, printingCalibrationOptions } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration.ts',
  );
  const { printingCollectorText, printingLegalText } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-footer.ts',
  );
  const { eighthRulesMaximum, eighthCompactRules } = await server.ssrLoadModule(
    '/games/magic/src/presentation/eighth-rules.ts',
  );
  const { printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const base = {
    name: 'Source-family specimen',
    setCode: '8ed',
    frameStyle: 'modern',
    frameAssetFamily: 'eighth',
    typeLine: 'Creature — Wizard',
    colors: ['U'],
    manaSymbols: ['2', 'U'],
    colorCalibration: 'set-hsb-v1',
    collectorNumber: '42',
    power: '2',
    toughness: '3',
  };
  const saved = JSON.stringify(base),
    exact = profile(base);
  assert(exact && !exact.inheritedFrom);
  const inherited = { ...base, setCode: '9ed' };
  assert.equal(profile(inherited).inheritedFrom, '8ed');
  assert.strictEqual(profile(inherited), profile({ ...inherited, name: 'Another name' }));
  assert.deepEqual(profile(inherited).originalRules, {});
  assert.equal(
    profile(inherited).rules.shortCenterLines,
    undefined,
    'A printing centering rule must not become an expansion-frame default',
  );
  assert.equal(profile({ ...inherited, calibration: 'printing' }), undefined);
  for (const change of [
    { frameAssetFamily: 'm15-accurate' },
    { frameStyle: 'retro' },
    { frameTreatment: 'colorshifted' },
    { setCode: 'plc' },
    { frameTemplate: 'future' },
    { layout: 'split' },
    { typeLine: 'Planeswalker — Test' },
    { rulesText: 'Level up {2}' },
    { borderColor: 'silver' },
    { faces: [base] },
  ])
    assert.equal(profile({ ...base, ...change }), undefined, JSON.stringify(change));
  const white = printingCalibrationMaterials(base),
    black = printingCalibrationMaterials({ ...base, borderColor: 'black' });
  assert.equal(white.border, '#ececea');
  assert.equal(black.border, '#181510');
  assert.deepEqual(
    framePlate(base).rects,
    framePlate({ ...base, borderColor: 'black' }).rects,
    'Stock cannot switch the inner geometry',
  );
  assert.equal(
    printingCalibrationMaterials({ ...inherited, calibration: 'source' }).border,
    undefined,
  );
  assert.deepEqual(
    printingCalibrationMaterials({ ...inherited, calibration: 'source' }).materials,
    {},
  );
  const report = resolvePrintingCalibration(inherited);
  assert.equal(report.defaults.profile, '8ed-eighth');
  assert.equal(report.components.frame.status, 'fallback');
  assert.equal(report.components.border.status, 'fallback');
  assert.equal(printingCalibrationOptions(base).find((p) => p.id === '8ed-eighth').supported, true);
  assert.equal(
    printingCalibrationOptions({ ...base, frameAssetFamily: 'm15-accurate' }).find(
      (p) => p.id === '8ed-eighth',
    ).supported,
    false,
  );
  assert.throws(
    () =>
      printingCalibrationMaterials({
        ...base,
        frameAssetFamily: 'm15-accurate',
        calibration: { profile: '8ed-eighth' },
      }),
    /Eighth frame/,
  );
  assert.doesNotThrow(() =>
    printingCalibrationMaterials({ ...base, calibration: { profile: '8ed-eighth' } }),
  );
  assert.equal(printingCollectorText({ ...base, collectorNumber: 'S1' }, false), 'S1/7');
  assert.equal(printingCollectorText({ ...base, collectorNumber: '1★' }, false), '1/350');
  assert.equal(
    printingCollectorText({ ...base, collectorNumber: 'S1', collectorTotal: null }, false),
    'S1',
  );
  assert.equal(printingCollectorText({ ...inherited, collectorNumber: 'S1' }, false), 'S1');
  assert.equal(
    printingLegalText({ ...inherited, legalText: undefined }),
    null,
    'Printing year must not be donated',
  );
  const dense = { ...base, rulesText: 'First paragraph.\nSecond paragraph.\nThird paragraph.' };
  const crowded = { size: 20, overflow: false };
  assert.equal(
    eighthCompactRules(dense, crowded, 1, () => ({ size: 21.5, overflow: false })).size,
    21.5,
  );
  assert.strictEqual(
    eighthCompactRules(dense, crowded, 1, () => ({ size: 20.5, overflow: false })),
    crowded,
    'Very dense copy must not force a new spacing rule',
  );
  assert.strictEqual(
    eighthCompactRules({ ...dense, typeLine: 'Land' }, crowded, 1, () => ({
      size: 22,
      overflow: false,
    })),
    crowded,
  );
  const rule = exact.originalRules['323'];
  const land = {
    ...base,
    name: 'Coastal Tower',
    collectorNumber: '323',
    typeLine: 'Land',
    rulesText: rule.text,
    wordingMode: 'original',
  };
  assert.equal(eighthRulesMaximum(land), 22.5);
  assert.equal(eighthRulesMaximum({ ...land, wordingMode: 'oracle' }), 24.5);
  assert.equal(eighthRulesMaximum({ ...land, rulesText: 'Custom prose.' }), 24.5);
  assert.equal(eighthRulesMaximum({ ...land, setCode: '9ed' }), 24.5);
  const mana = printingManaAdjustment(base),
    moved = printingManaAdjustment({
      ...base,
      symbolAdjustment: { mana: { dx: 0.5, scaleX: 1.1 } },
    });
  assert.equal(moved.dx, mana.dx + 0.5);
  assert.equal(moved.scaleX, mana.scaleX * 1.1);
  assert.deepEqual(calibratedManaTarget(base, 'X'), [185 / 255, 177 / 255, 168 / 255]);
  assert.equal(JSON.stringify(base), saved, 'Resolver mutated host data');
  const { eighthStockRulePixels } = await server.ssrLoadModule(
    '/games/magic/src/presentation/eighth-stock-rule-pixels.ts',
  );
  const image = { width: 12, height: 12, data: new Uint8ClampedArray(12 * 12 * 4) };
  for (let y = 3; y < 9; y++) for (let x = 3; x < 9; x++) image.data[(y * 12 + x) * 4 + 3] = 255;
  eighthStockRulePixels(image, 0.75, [22, 22, 22]);
  assert.equal(image.data[(5 * 12 + 5) * 4 + 3], 0, 'Opaque center must not acquire a rectangle');
  assert.equal(image.data[3], 0, 'Empty surround must remain empty');
  assert(image.data[(3 * 12 + 5) * 4 + 3] > 0);
  assert.equal(image.data[(3 * 12 + 5) * 4 + 3], image.data[(8 * 12 + 5) * 4 + 3]);
  assert.throws(() => eighthStockRulePixels(image, NaN, [22, 22, 22]), RangeError);
  console.log(
    'Eighth defaults: lazy donor, exact/source policies, stock separation, printing exceptions, mana deltas and cached-rule kernel passed',
  );
} finally {
  await server.close();
}
