import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { earlyReprintManaProof } from './magic-early-reprint-mana-source-guard.mjs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
try {
  const { setCalibrationProfile } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  const { printingManaDefaults, printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const { earlyReprintManaInk } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-mana.ts',
  );
  const { calibratedManaTarget } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const { historicalManaPaperSample } = await server.ssrLoadModule(
    '/games/magic/src/presentation/historical-mana.ts',
  );
  const { recolorManaInkPixels } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-ink-material.ts',
  );
  await earlyReprintManaProof();
  const evidence = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/early-reprint-mana.json'),
  );
  for (const setCode of ['fem', '4ed', 'chr']) {
    const face = {
      name: 'Probe',
      setCode,
      colors: ['B'],
      typeLine: 'Summon Wizard',
      wordingMode: 'original',
      symbolStyle: 'original',
      colorCalibration: 'set-hsb-v1',
    };
    const base = printingManaDefaults(face);
    assert.ok(base);
    assert.deepEqual(base, setCalibrationProfile(setCode).mana.geometry);
    if (setCalibrationProfile(setCode).revision === 1)
      assert.deepEqual(base, evidence.geometry[setCode]);
    assert.deepEqual(earlyReprintManaInk(face), setCalibrationProfile(setCode).mana.ink);
    for (const color of ['W', 'U', 'B', 'R', 'G', 'N'])
      assert.deepEqual(
        calibratedManaTarget(face, color),
        setCalibrationProfile(setCode).mana.paper[color],
      );
    assert.deepEqual(
      printingManaDefaults({ ...face, wordingMode: 'oracle', typeLine: 'Creature — Wizard' }),
      base,
    );
    assert.deepEqual(printingManaDefaults({ ...face, setCode: setCode.toUpperCase() }), base);
    assert.equal(historicalManaPaperSample(face, 'B'), 'opaque-percentile');
    assert.deepEqual(calibratedManaTarget(face, 'X'), calibratedManaTarget(face, 'N'));
    assert.ok(earlyReprintManaInk(face));
    assert.equal(earlyReprintManaInk({ ...face, calibration: 'source' }), undefined);
    assert.equal(calibratedManaTarget({ ...face, calibration: 'source' }, 'B'), undefined);
    for (const override of [
      { frameStyle: 'modern' },
      { frameTemplate: 'future' },
      { frameAssetFamily: 'eighth' },
      { layout: 'split' },
      { borderColor: setCode === 'fem' ? 'white' : 'black' },
      { symbolStyle: 'modern' },
      { symbolStyle: undefined, wordingMode: 'oracle' },
    ]) {
      assert.equal(earlyReprintManaInk({ ...face, ...override }), undefined);
      assert.equal(historicalManaPaperSample({ ...face, ...override }, 'B'), undefined);
    }
    const user = {
      dx: 0.5,
      scaleX: 1.1,
      spacing: -0.25,
      numberDy: 0.75,
      glyphs: { B: { scale: 1.05, dx: 0.25, dy: -0.5 } },
    };
    const snapshot = JSON.stringify(user),
      a = printingManaAdjustment({ ...face, symbolAdjustment: { mana: user } });
    assert.equal(a.dx, base.dx + 0.5);
    assert.equal(a.scaleX, base.scaleX * 1.1);
    assert.equal(a.spacing, base.spacing - 0.25);
    assert.equal(a.numberDy, base.numberDy + 0.75);
    assert.deepEqual(a.glyphs.B, {
      scale: base.glyphs.B.scale * 1.05,
      dx: base.glyphs.B.dx + 0.25,
      dy: base.glyphs.B.dy - 0.5,
    });
    assert.equal(JSON.stringify(user), snapshot);
  }
  assert.ok(
    printingManaDefaults({
      name: 'Chronicles legend',
      setCode: 'chr',
      colors: ['U', 'B', 'R'],
      typeLine: 'Legendary Creature',
      symbolStyle: 'original',
    }),
  );
  for (const setCode of [
    'lea',
    'leb',
    '2ed',
    '3ed',
    'arn',
    'atq',
    'leg',
    'drk',
    'ice',
    '8ed',
    'm21',
  ])
    assert.equal(
      earlyReprintManaInk({
        name: 'Other printing',
        setCode,
        colors: ['U'],
        typeLine: 'Creature',
        colorCalibration: 'set-hsb-v1',
      }),
      undefined,
    );
  const tone = {
    paper: [200 / 255, 180 / 255, 160 / 255],
    sourceInk: [10 / 255, 10 / 255, 10 / 255],
    inkTarget: [40 / 255, 45 / 255, 50 / 255],
  };
  const pixels = new Uint8ClampedArray([
    10, 10, 10, 255, 200, 180, 160, 255, 105, 95, 85, 255, 10, 10, 10, 127, 7, 8, 9, 0,
  ]);
  recolorManaInkPixels(pixels, tone);
  assert.deepEqual(
    [...pixels],
    [40, 45, 50, 255, 200, 180, 160, 255, 120, 113, 105, 255, 10, 10, 10, 127, 7, 8, 9, 0],
  );
  assert.throws(
    () => recolorManaInkPixels(pixels, { ...tone, paper: tone.sourceInk }),
    /contrasting/,
  );

  await server.listen();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage(),
    faults = [];
  page.on('pageerror', (e) => faults.push(String(e)));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/`);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { prepareEarlyHsb } = await import('/games/magic/src/presentation/early-hsb-material.ts');
    const { prepareManaNumerals } = await import('/games/magic/src/presentation/mana-numeral.ts');
    const { historicalManaAsset } = await import(
      '/games/magic/src/presentation/historical-mana.ts'
    );
    const { manaSymbolAsset } = await import('/games/magic/src/presentation/assets.ts');
    const { clearEarlyHsbBitmaps } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const face = {
      name: 'Cache probe',
      setCode: '4ed',
      typeLine: 'Summon Wizard',
      colors: ['B'],
      manaSymbols: ['2', 'B', 'X'],
      symbolStyle: 'original',
      colorCalibration: 'set-hsb-v1',
    };
    const images = new Map();
    for (const symbol of face.manaSymbols) {
      const source = historicalManaAsset(face, symbol),
        url = source?.url ?? manaSymbolAsset(symbol);
      const c = document.createElement('canvas');
      c.width = c.height = 32;
      const ctx = c.getContext('2d');
      ctx.fillStyle = source?.discColor ?? '#cac5c0';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = source?.inkColor ?? '#0d0f0f';
      ctx.fillRect(12, 7, 8, 18);
      images.set(url, await createImageBitmap(c));
      c.width = c.height = 0;
    }
    const read = CanvasRenderingContext2D.prototype.getImageData;
    let reads = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      reads++;
      return read.apply(this, args);
    };
    const signal = new AbortController().signal;
    try {
      const cold = await prepareEarlyHsb(face, images, signal),
        glyphs = await prepareManaNumerals(face, cold.images, signal),
        coldReads = reads;
      const originalKey = historicalManaAsset(face, 'B').url,
        first = cold.images.get(originalKey),
        metadata = glyphs.images.manaInkColor;
      glyphs.dispose();
      cold.dispose();
      reads = 0;
      const warm = await prepareEarlyHsb(face, images, signal),
        warmGlyphs = await prepareManaNumerals(face, warm.images, signal);
      const result = {
        coldReads,
        warmReads: reads,
        sameBitmap: first === warm.images.get(originalKey),
        sameGlyph:
          glyphs.images.manaGlyphs.get('B').image === warmGlyphs.images.manaGlyphs.get('B').image,
        metadata,
        metadataRetained: metadata === warmGlyphs.images.manaInkColor,
      };
      warmGlyphs.dispose();
      warm.dispose();
      const other = await prepareEarlyHsb({ ...face, setCode: 'chr' }, images, signal);
      result.distinctTone = other.images.get(originalKey) !== first;
      other.dispose();
      return result;
    } finally {
      CanvasRenderingContext2D.prototype.getImageData = read;
      clearEarlyHsbBitmaps();
      for (const im of images.values()) im.close();
    }
  });
  assert.ok(result.coldReads > 0);
  assert.equal(result.warmReads, 0);
  assert.equal(result.sameBitmap, true);
  assert.equal(result.sameGlyph, true);
  assert.equal(result.metadata, 'rgb(57 64 54)');
  assert.equal(result.metadataRetained, true);
  assert.equal(result.distinctTone, true);
  assert.deepEqual(faults, []);
  console.log(
    'Early-reprint mana: scoped defaults, original/Oracle modes, editor deltas, alpha/paper preservation and zero-readback warm preparation pass.',
  );
} finally {
  await browser?.close();
  await server.close();
}
