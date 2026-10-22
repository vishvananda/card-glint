import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const module = (name) => server.ssrLoadModule('/games/magic/src/presentation/' + name + '.ts');
  const { MODERN_PRINTING_PROFILES } = await module('modern-printing-profiles');
  const { printingManaDefaults, printingManaAdjustment } = await module('printing-mana-adjustment');
  const { modernCostMana, modernCostNumeralAsset } = await module('modern-cost-mana');
  const { calibratedManaTarget, calibratedFrameMaterials } = await module('calibration-profiles');
  const { printingCalibrationMaterials } = await module('printing-calibration-materials');
  const { canvasAssetUrls } = await module('canvas-assets');
  const { modernWalkerFrameRepaint } = await module('modern-printing-profile');
  const { profileAssets } = await module('assets');
  const { resolveCardProfile } = await module('profile');
  const { faceFrame } = await module('special-frames');
  const { specialPaperColor } = await module('special-rule-paint');
  const profile = MODERN_PRINTING_PROFILES.m21;
  const base = {
    name: '',
    setCode: 'm21',
    typeLine: 'Creature',
    colors: ['U'],
    manaSymbols: ['2', 'U'],
    colorCalibration: 'set-hsb-v1',
  };
  const walker = { ...base, typeLine: 'Legendary Planeswalker — Teferi', layout: 'planeswalker' };
  for (const face of [base, walker]) {
    const fit = face === walker ? profile.mana.walker : profile.mana.normal;
    assert.deepEqual(printingManaDefaults(face), fit);
    const edited = printingManaAdjustment({
      ...face,
      symbolAdjustment: {
        mana: {
          dx: 0.5,
          scaleX: 1.1,
          glyphs: { U: { dx: 0.25, scale: 1.02 } },
        },
      },
    });
    assert.equal(edited.dx, fit.dx + 0.5);
    assert.equal(edited.scaleX, fit.scaleX * 1.1);
    assert.equal(edited.glyphs.U.dx, fit.glyphs.U.dx + 0.25);
    assert.equal(edited.glyphs.U.scale, fit.glyphs.U.scale * 1.02);
    assert.deepEqual(modernCostMana(face).shadow, profile.mana.shadow);
    assert.deepEqual(modernCostMana(face).paper, [206, 195, 195]);
    assert.deepEqual(modernCostMana({ ...face, calibration: 'source' }).paper, [202, 197, 192]);
    for (const color of 'WUBRG')
      assert.deepEqual(
        calibratedManaTarget(face, color),
        profile.mana.paperTargets[color].map((v) => v / 255),
      );
    assert(modernCostNumeralAsset(face, '8').endsWith('/8.svg'));
    assert.deepEqual(
      printingCalibrationMaterials({ ...face, calibration: 'source' }).materials,
      {},
    );
  }
  const tall = {
    ...walker,
    rulesText: 'A static ability.\n+1: Draw a card.\n-3: Return a card.\n-10: Win the game.',
  };
  assert.equal(faceFrame(tall), 'planeswalker-large');
  for (const face of [walker, tall]) {
    const assets = profileAssets(resolveCardProfile(face), faceFrame(face));
    const materials = calibratedFrameMaterials(face);
    assert.deepEqual(Object.keys(materials).sort(), [assets.frame, assets.boxes].sort());
    assert(Object.keys(materials).every((url) => canvasAssetUrls(face).includes(url)));
    for (const url of Object.keys(materials))
      assert.deepEqual(materials[url], profile.componentMaterials[url]);
    assert.deepEqual(
      printingCalibrationMaterials({ ...face, calibration: 'source' }).materials,
      {},
    );
  }
  assert.equal(modernWalkerFrameRepaint(walker, 'Colourless'), 0.7);
  for (const face of [
    base,
    { ...walker, setCode: 'war' },
    { ...walker, calibration: 'source' },
    { ...walker, colorCalibration: undefined },
    { ...walker, frameStyle: 'retro' },
  ])
    assert.equal(modernWalkerFrameRepaint(face, 'Colourless'), 0);
  assert.equal(modernWalkerFrameRepaint(walker, 'U'), 0);
  assert.equal(specialPaperColor(walker), '#dfdfe2f0');
  assert.equal(specialPaperColor({ ...walker, collectorNumber: '324' }), '#d3e4ecf0');
  assert.equal(specialPaperColor({ ...walker, calibration: 'source' }), '#d3e4ecf0');
  assert.equal(specialPaperColor({ ...walker, setCode: 'war' }), '#d3e4ecf0');
  for (const extra of [
    { typeLine: 'Legendary Creature', legendary: true },
    { colors: ['U', 'R'] },
    { typeLine: 'Legendary Artifact', legendary: true, colors: [] },
  ]) {
    const face = { ...base, ...extra },
      urls = new Set(canvasAssetUrls(face));
    const materials = calibratedFrameMaterials(face);
    assert(Object.keys(materials).length > 0 && Object.keys(materials).length <= 5);
    assert(
      Object.keys(materials).every((url) => urls.has(url)),
      'No unused material URL downloads',
    );
    for (const [url, value] of Object.entries(materials))
      assert.deepEqual(value, profile.componentMaterials[url], JSON.stringify([extra, url]));
  }
  for (const face of [base, { ...base, typeLine: 'Land', land: true, colors: [] }])
    assert(Object.keys(calibratedFrameMaterials(face)).every((url) => url.includes('/m15/new/')));
  for (const extra of [{ setCode: 'war' }, { frameStyle: 'retro' }, { frameTemplate: 'future' }])
    assert.notDeepEqual(printingManaDefaults({ ...base, ...extra }), profile.mana.normal);
} finally {
  await server.close();
}
console.log(
  'M21 adopted controls, source policy, editor deltas, walker paper and selected asset dependencies passed.',
);
