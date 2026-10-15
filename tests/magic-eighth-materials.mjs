import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const { eighthBasicProfile } = await server.ssrLoadModule(
    '/games/magic/src/presentation/eighth-basic-profile.ts',
  );
  const { colorEighthBasicFrame, colorEighthBasicGlyph } = await server.ssrLoadModule(
    '/games/magic/src/presentation/eighth-basic-pixels.ts',
  );
  const { colorCalibrationCoverage } = await server.ssrLoadModule(
    '/games/magic/src/presentation/color-calibration-coverage.ts',
  );
  const base = {
    name: 'Basic',
    setCode: '8ed',
    frameAssetFamily: 'eighth',
    borderColor: 'white',
    colorCalibration: 'set-hsb-v1',
  };
  for (const [name, color] of [
    ['Plains', 'W'],
    ['Island', 'U'],
    ['Swamp', 'B'],
    ['Mountain', 'R'],
    ['Forest', 'G'],
  ]) {
    const face = { ...base, typeLine: `Basic Land — ${name}`, rulesText: color };
    const p = eighthBasicProfile(face);
    assert.equal(p.color, color);
    assert.equal(colorCalibrationCoverage(face).frame, true);
    assert(colorCalibrationCoverage(face).manaSymbols.includes(color));
    for (const override of [
      { setCode: '9ed' },
      { borderColor: 'black' },
      { frameTemplate: 'future' },
      { layout: 'transform' },
      { frameColors: ['U', 'B'] },
      { colorCalibration: undefined },
    ])
      assert.equal(eighthBasicProfile({ ...face, ...override }), undefined);
    assert.equal(eighthBasicProfile({ ...face, rulesText: 'Custom text' }).glyph, null);
    const frame = { width: 488, height: 680, data: new Uint8ClampedArray(488 * 680 * 4) };
    for (let i = 0; i < frame.data.length; i += 4) frame.data.set([180, 150, 120, 255], i);
    frame.data.set([12, 11, 13, 255], (50 * 488 + 50) * 4);
    frame.data.set([141, 75, 132, 0], (200 * 488 + 200) * 4);
    const alpha = frame.data.filter((_, i) => i % 4 === 3);
    colorEighthBasicFrame(frame, p.palette);
    assert.deepEqual(
      frame.data.filter((_, i) => i % 4 === 3),
      alpha,
    );
    assert.deepEqual(
      [...frame.data.slice((50 * 488 + 50) * 4, (50 * 488 + 50) * 4 + 4)],
      [12, 11, 13, 255],
    );
    assert.deepEqual(
      [...frame.data.slice((200 * 488 + 200) * 4, (200 * 488 + 200) * 4 + 4)],
      [141, 75, 132, 0],
    );
    const glyph = {
      width: 5,
      height: 1,
      data: new Uint8ClampedArray([
        0,
        0,
        0,
        255,
        128,
        128,
        128,
        255,
        255,
        255,
        255,
        255,
        ...p.palette.glyph.source.map((v) => Math.round(v * 255)),
        193,
        90,
        80,
        70,
        0,
      ]),
    };
    const original = glyph.data.slice();
    colorEighthBasicGlyph(glyph, p.palette.glyph);
    assert.deepEqual(
      glyph.data.slice(0, 12),
      original.slice(0, 12),
      'Neutral shadow and bevel anchors changed',
    );
    assert.deepEqual(glyph.data.slice(16), original.slice(16), 'Transparent RGB changed');
    assert.equal(glyph.data[15], 193);
    p.palette.glyph.target.forEach((v, c) =>
      assert(Math.abs(glyph.data[12 + c] - v * 255) < 2, 'Source fill missed its target'),
    );
  }
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const { eighthBasicProfile } = await import(
      '/games/magic/src/presentation/eighth-basic-profile.ts'
    );
    const { prepareEarlyHsb } = await import('/games/magic/src/presentation/early-hsb-material.ts');
    const { clearEarlyHsbBitmaps, earlyHsbBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const face = {
      name: 'Island',
      typeLine: 'Basic Land — Island',
      rulesText: 'U',
      setCode: '8ed',
      frameAssetFamily: 'eighth',
      colorCalibration: 'set-hsb-v1',
    };
    const p = eighthBasicProfile(face),
      images = new Map();
    for (const url of [p.frame, p.glyph]) {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 180;
      const context = c.getContext('2d');
      context.fillStyle = '#90b0c0';
      context.fillRect(0, 0, 128, 180);
      images.set(url, await createImageBitmap(c));
      c.width = c.height = 0;
    }
    clearEarlyHsbBitmaps();
    const prototype = CanvasRenderingContext2D.prototype,
      original = prototype.getImageData;
    let reads = 0;
    prototype.getImageData = function (...args) {
      reads++;
      return original.apply(this, args);
    };
    try {
      const signal = new AbortController().signal;
      const a = await prepareEarlyHsb(face, images, signal),
        cold = reads;
      if (
        a.images.get(p.frame) === images.get(p.frame) ||
        a.images.get(p.glyph) === images.get(p.glyph)
      )
        throw Error('Missing prepared materials');
      const bitmaps = [a.images.get(p.frame), a.images.get(p.glyph)];
      a.dispose();
      const b = await prepareEarlyHsb(face, images, signal),
        warm = reads - cold;
      if (b.images.get(p.frame) !== bitmaps[0] || b.images.get(p.glyph) !== bitmaps[1])
        throw Error('Warm material not reused');
      b.dispose();
      const untouched = await prepareEarlyHsb(
        { ...face, colorCalibration: undefined },
        images,
        signal,
      );
      if (untouched.images !== images) throw Error('Color opt-in leaked into default rendering');
      untouched.dispose();
      return { cold, warm, bytes: earlyHsbBitmapCache.stats.bytes };
    } finally {
      prototype.getImageData = original;
      clearEarlyHsbBitmaps();
      for (const bitmap of images.values()) bitmap.close();
    }
  });
  assert.equal(result.cold, 2);
  assert.equal(result.warm, 0);
  assert.equal(result.bytes, 128 * 180 * 4 * 2);
  console.log(
    'Eighth basic materials: guarded sources, alpha/ink/neutral preservation and bounded warm cache reuse pass.',
    result,
  );
} finally {
  await browser.close();
  await server.close();
}
