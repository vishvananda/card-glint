import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { coverImage } from '../dist/lib/browser.js';
import {
  resolvePrintingPreset,
  resolveArtPlacement,
  artPlacementSupport,
  artworkGeometry,
  printingPresetApiVersion,
} from '../dist/lib/magic.js';
assert.equal(printingPresetApiVersion, 1);
const source = {
  name: 'Placement probe',
  typeLine: 'Creature',
  colors: ['U'],
  setCode: 'FUT',
  frameTemplate: 'future',
  illustration: '/source',
  illustrationPlacement: [0.2, 0.1, 0.5, 0.4],
};
const input = structuredClone(source),
  art = { mode: 'behind-text', focalPoint: [0.25, 0.75], zoom: 1.5, paperOpacity: 0.65 };
const face = resolvePrintingPreset(source, { preset: 'fut', art });
assert.deepEqual(source, input);
assert.equal(face.illustrationPlacement, undefined);
assert.equal(face.frameTemplate, 'future');
assert.equal(face.futureTreatment, undefined);
assert.equal(
  resolvePrintingPreset(source, { preset: 'm21' }).illustrationPlacement,
  undefined,
  'Imported frame positioning cannot leak into another frame',
);
assert.deepEqual(artPlacementSupport(face).modes, ['window', 'behind-text']);
assert.throws(() => resolvePrintingPreset(source, { preset: 'm21', art }), /does not support/);
for (const bad of [
  { mode: 'invalid' },
  { mode: 'window', zoom: 0 },
  { mode: 'window', focalPoint: [-1, 0.5] },
  { mode: 'window', focalPoint: [0, Infinity] },
  { mode: 'window', paperOpacity: 0.5 },
  { mode: 'behind-text', paperOpacity: 2 },
  { mode: 'window', unknown: true },
])
  assert.throws(() => resolveArtPlacement(source, bad));
const rect = coverImage(400, 1000, [32, 83, 433, 297], { zoom: 1.5, focalPoint: [0.25, 0.75] });
assert.ok(rect[0] <= 32 && rect[1] <= 83);
assert.ok(rect[0] + rect[2] >= 465 && rect[1] + rect[3] >= 380);
const geometry = artworkGeometry(
  resolveArtPlacement(source, { mode: 'window', zoom: 1.5, focalPoint: [0.25, 0.75] }),
  400,
  1000,
);
const pixel = geometry.destination.map((v, i) => v * (i % 2 ? 680 : 488));
pixel.forEach((v, i) =>
  assert.ok(Math.abs(v - rect[i]) < 1e-9, 'Public UI geometry must use physical card aspect ratio'),
);
const symbol = resolvePrintingPreset(source, {
  preset: 'lea',
  overrides: { setSymbolCode: 'MIR' },
});
assert.equal(symbol.setCode, 'LEA');
assert.ok(symbol.setSymbol.includes('mir'));
assert.throws(
  () =>
    resolvePrintingPreset(source, {
      preset: 'lea',
      overrides: { setSymbolCode: 'MIR', setSymbol: '/x' },
    }),
  /not both/,
);
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  const result = await page.evaluate(async () => {
    const { paintIllustration } = await import(
      '/games/magic/src/presentation/illustration-paint.ts'
    );
    const { paintEtchingMask } = await import('/games/magic/src/presentation/canvas-etching.ts');
    const { futureGeometry } = await import('/games/magic/src/presentation/future-frame.ts');
    const { prepareFutureFrame } = await import(
      '/games/magic/src/presentation/future-frame-paint.ts'
    );
    const { paintFutureTemplate } = await import(
      '/games/magic/src/presentation/future-template-paint.ts'
    );
    const { loadCanvasImages, canvasAssetUrls } = await import(
      '/games/magic/src/presentation/canvas-assets.ts'
    );
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { magic } = await import('/games/magic/src/index.ts');
    const canvas = (w = 488, h = 680) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    };
    const image = canvas(400, 1000),
      c = image.getContext('2d');
    c.fillStyle = '#123456';
    c.fillRect(0, 0, 400, 1000);
    c.fillStyle = 'white';
    c.fillRect(130, 620, 35, 35);
    const bitmap = await createImageBitmap(image);
    c.clearRect(0, 0, 400, 1000);
    c.fillStyle = 'white';
    c.fillRect(130, 620, 35, 35);
    const mask = await createImageBitmap(image);
    const base = {
      name: 'Probe',
      typeLine: 'Creature',
      colors: ['U'],
      setCode: 'FUT',
      frameTemplate: 'future',
      illustration: '/source',
      manaSymbols: [],
      artPlacement: { mode: 'window', zoom: 1.8, focalPoint: [0.3, 0.65] },
    };
    const painted = canvas(),
      etched = canvas();
    paintIllustration(
      painted.getContext('2d'),
      base,
      new Map([['/source', bitmap]]),
      futureGeometry(base).art,
      'artwork',
    );
    await paintEtchingMask(
      etched.getContext('2d'),
      base,
      null,
      new AbortController().signal,
      20,
      undefined,
      async () => ({
        images: new Map([
          ['/source', bitmap],
          ['/mask', mask],
        ]),
        dispose() {},
      }),
      async () => '/mask',
    );
    let maskPixels = 0,
      mismatch = 0;
    const a = painted.getContext('2d').getImageData(0, 0, 488, 680).data,
      b = etched.getContext('2d').getImageData(0, 0, 488, 680).data;
    for (let y = 85; y < 378; y++)
      for (let x = 34; x < 463; x++) {
        const i = (y * 488 + x) * 4;
        if (b[i + 3] > 240) {
          maskPixels++;
          if (a[i] < 240 || a[i + 1] < 240 || a[i + 2] < 240) mismatch++;
        }
      }
    const recipe = magic.describe(base, 'inspect');
    const stampFace = { name: 'Stamp control', setCode: 'M21', typeLine: 'Instant' };
    const movedStampFace = { ...stampFace, printingElements: { setSymbol: { offset: [10, 8] } } };
    const stamp = canvas(),
      movedStamp = canvas(),
      stampIcon = canvas(16, 16);
    stampIcon.getContext('2d').fillRect(0, 0, 16, 16);
    const stampLoader = async (urls) => ({
      images: new Map(urls.map((url) => [url, stampIcon])),
      dispose() {},
    });
    for (const [target, f] of [
      [stamp, stampFace],
      [movedStamp, movedStampFace],
    ])
      await paintEtchingMask(
        target.getContext('2d'),
        f,
        null,
        new AbortController().signal,
        undefined,
        undefined,
        stampLoader,
      );
    const sa = stamp.getContext('2d').getImageData(0, 0, 488, 680).data,
      sb = movedStamp.getContext('2d').getImageData(0, 0, 488, 680).data;
    let stampInk = 0,
      stampMismatch = 0;
    for (let y = 0; y < 672; y++)
      for (let x = 0; x < 478; x++) {
        const alpha = sa[(y * 488 + x) * 4 + 3];
        if (alpha) stampInk++;
        if (alpha !== sb[((y + 8) * 488 + x + 10) * 4 + 3]) stampMismatch++;
      }
    // Real pinned frame assets: blue and colorless exercise CC and MSE backings.
    const transparency = [];
    for (const colors of [['U'], []]) {
      const red = canvas(400, 1000);
      red.getContext('2d').fillStyle = '#e00000';
      red.getContext('2d').fillRect(0, 0, 400, 1000);
      const url = red.toDataURL(),
        normal = { ...base, colors, illustration: url, artPlacement: undefined },
        extended = { ...normal, artPlacement: { mode: 'behind-text', paperOpacity: 0.6 } };
      const loaded = await loadCanvasImages(
        [...new Set([...canvasAssetUrls(normal), ...canvasAssetUrls(extended)])],
        new AbortController().signal,
      );
      const n = canvas(),
        e = canvas();
      paintFutureTemplate(n.getContext('2d'), normal, loaded.images);
      paintFutureTemplate(e.getContext('2d'), extended, loaded.images);
      const pixel = (im, x, y) => [...im.getContext('2d').getImageData(x, y, 1, 1).data];
      transparency.push({
        colors,
        normal: pixel(n, 240, 520),
        extended: pixel(e, 240, 520),
        rimBefore: pixel(n, 20, 500),
        rimAfter: pixel(e, 20, 500),
        paperAlpha: (() => {
          const frame = prepareFutureFrame(extended, loaded.images);
          try {
            return [pixel(frame, 480, 900)[3], pixel(frame, 480, 1040)[3]];
          } finally {
            frame.width = frame.height = 0;
          }
        })(),
      });
      loaded.dispose();
    }
    const key = (f, layer = 'face') => cardTextureKey({ face: f, layer }, 'inspect');
    return {
      stampInk,
      stampMismatch,
      stampCache:
        magic.describe(stampFace, 'inspect').stamp.key !==
        magic.describe(movedStampFace, 'inspect').stamp.key,
      stampRasterCache: key(stampFace, 'etching') !== key(movedStampFace, 'etching'),
      maskPixels,
      mismatch,
      fit: recipe.edges[0].fit,
      transparency,
      cache: key(base) !== key({ ...base, artPlacement: { ...base.artPlacement, zoom: 2 } }),
      maskCache:
        key(base, 'etching') !==
        key({ ...base, artPlacement: { ...base.artPlacement, zoom: 2 } }, 'etching'),
    };
  });
  assert.ok(result.maskPixels > 100);
  assert.ok(result.stampInk > 100);
  assert.equal(result.stampMismatch, 0, 'Set mark etching follows the same explicit translation');
  assert.ok(
    result.stampCache && result.stampRasterCache,
    'Both stamp cache paths include positioning',
  );
  assert.equal(result.mismatch, 0, 'CPU art and etching must share crop/pan/zoom');
  assert.deepEqual(result.fit, { zoom: 1.8, focalPoint: [0.3, 0.65] });
  assert.ok(result.cache && result.maskCache);
  for (const item of result.transparency) {
    assert.ok(
      item.extended[1] < item.normal[1] - 10,
      'Portrait art must show through the actual rules paper',
    );
    assert.ok(
      Math.abs(item.paperAlpha[0] - 153) < 2 && Math.abs(item.paperAlpha[1] - 153) < 2,
      'Paper opacity stays uniform across the imported source backing',
    );
    assert.deepEqual(item.rimBefore, item.rimAfter, 'Frame rim stays opaque');
  }
  console.log(
    'Artwork API v1: physical-aspect fitting, source isolation, bounded inputs, independent symbol choice, CPU art/etch alignment, GPU fit recipe/cache identity and real CC/MSE paper transparency pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
