import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { printingManaDefaults, printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const { earlyReprintManaInk } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-mana.ts',
  );
  const face = {
    name: 'ATQ cost regression',
    setCode: 'atq',
    frameStyle: 'retro',
    borderColor: 'black',
    typeLine: 'Creature',
    colors: ['U'],
    manaSymbols: ['2', 'U'],
    calibration: 'auto',
    colorCalibration: 'set-hsb-v1',
    wordingMode: 'oracle',
  };
  const original = printingManaDefaults({ ...face, symbolStyle: 'original' }),
    modern = printingManaDefaults({ ...face, symbolStyle: 'modern' });
  assert.equal(original.dy, -7.75);
  assert.equal(modern.dy, -7.75);
  assert.equal(modern.dx, 5.25);
  assert.equal(modern.spacing, original.spacing);
  assert.equal(modern.glyphs, undefined);
  assert.equal(modern.numberScale, undefined);
  assert.equal(earlyReprintManaInk({ ...face, symbolStyle: 'modern' }), undefined);
  assert.deepEqual(
    printingManaDefaults(face),
    modern,
    'Implicit Oracle symbols use the same frame geometry',
  );
  const deltas = { dy: 0.5, numberDy: 0.25, glyphs: { U: { dx: 1 } } },
    before = JSON.stringify(deltas);
  const adjusted = printingManaAdjustment({
    ...face,
    symbolStyle: 'modern',
    symbolAdjustment: { mana: deltas },
  });
  assert.equal(adjusted.dy, -7.25);
  assert.equal(adjusted.numberDy, 0.25);
  assert.equal(adjusted.glyphs.U.dx, 1);
  assert.equal(JSON.stringify(deltas), before);
  for (const setCode of ['drk', 'fem', '4ed', 'mir', 'ons', '7ed']) {
    const f = {
      ...face,
      setCode,
      borderColor: ['4ed', '7ed'].includes(setCode) ? 'white' : 'black',
    };
    const a = printingManaDefaults({ ...f, symbolStyle: 'original' }),
      b = printingManaDefaults({ ...f, symbolStyle: 'modern' });
    for (const key of ['dx', 'dy', 'scaleX', 'scaleY', 'spacing'])
      assert.equal(b?.[key], a?.[key], setCode + '/' + key);
  }
  const { cardTextureKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  const key = (f, layer = 'face') =>
    cardTextureKey({ face: f, printingId: 'placement-control', layer }, 'small');
  assert(key({ ...face, symbolStyle: 'modern' }).includes('modern-retro-cost-geometry-v1'));
  assert(!key({ ...face, symbolStyle: 'original' }).includes('modern-retro-cost-geometry-v1'));
  assert(
    !key({ ...face, symbolStyle: 'modern' }, 'etching').includes('modern-retro-cost-geometry-v1'),
  );
  // Modern and custom frames must keep their existing dedicated defaults.
  for (const f of [
    { ...face, frameStyle: 'modern' },
    { ...face, frameTemplate: 'future' },
    { ...face, setCode: 'm21', frameStyle: 'modern' },
  ]) {
    const a = printingManaDefaults({ ...f, symbolStyle: 'modern' });
    assert.notEqual(a?.dy, -7.75);
  }
  console.log(
    'Modern cost glyphs retain historical frame geometry, preserve caller controls and exclude vintage pigment/numeral fits.',
  );
} finally {
  await server.close();
}
