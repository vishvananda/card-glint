import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  root: process.cwd(),
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'saga-test',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/__saga') {
            res.setHeader('Content-Type', 'text/html');
            res.end('<!doctype html><title>Saga test</title>');
          } else next();
        });
      },
    },
  ],
});
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__saga`);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { sagaRuleLayout } = await import('/games/magic/src/presentation/saga-rules.ts');
    const { paintSagaFace } = await import('/games/magic/src/presentation/saga-paint.ts');
    const { sagaAssets, SAGA_RECTS, SAGA_CHAPTER } = await import(
      '/games/magic/src/presentation/saga-frame.ts'
    );
    const { canvasAssetWidth, canvasAssetUrls } = await import(
      '/games/magic/src/presentation/canvas-assets.ts'
    );
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const face = {
      name: 'Chapter test',
      colors: ['W'],
      typeLine: 'Enchantment — Saga',
      layout: 'saga',
      rulesText:
        '(A reminder with a fixed space.)\nI, II — Draw a card.\nIII — Return target creature to its owner’s hand.',
    };
    const c = document.createElement('canvas');
    c.width = 488;
    c.height = 680;
    const ctx = c.getContext('2d');
    const a = sagaRuleLayout(ctx, face),
      b = sagaRuleLayout(ctx, {
        ...face,
        rulesText: face.rulesText.replace('Draw a card.', 'Draw a card. '.repeat(40)),
      });
    const impossible = {
      ...face,
      rulesText: 'I — ' + 'An extraordinarily long rule. '.repeat(1000),
    };
    let rejects = false;
    try {
      sagaRuleLayout(ctx, impossible);
    } catch {
      rejects = true;
    }
    const art = document.createElement('canvas');
    art.width = 10;
    art.height = 10;
    art.getContext('2d').fillStyle = '#00ff00';
    art.getContext('2d').fillRect(0, 0, 10, 10);
    const frame = document.createElement('canvas');
    frame.width = 10;
    frame.height = 10;
    frame.getContext('2d').fillStyle = '#ff0000';
    frame.getContext('2d').fillRect(0, 0, 10, 10);
    const images = new Map(sagaAssets(face).map((url) => [url, frame]));
    images.set('art', art);
    paintSagaFace(ctx, { ...face, illustration: 'art' }, images, undefined, 'printing');
    const alpha = ctx.getImageData(300, 300, 1, 1).data[3],
      outside = Array.from(ctx.getImageData(460, 300, 1, 1).data);
    const key = (f) => cardTextureKey({ face: f, printingId: null, printedImage: null }, 'inspect');
    return {
      openingStable: a.rows[0].top === b.rows[0].top,
      shrink: b.size < a.size,
      fits: b.rows.every((r) => !r.layout.overflow && r.top + r.height <= 569.01),
      rejects,
      alpha,
      outside,
      nativeBadge: canvasAssetWidth(SAGA_CHAPTER) === undefined,
      fullPlate: canvasAssetUrls(face).some((u) => u?.includes('/data/images/cardImages/saga/')),
      noOldComponents: canvasAssetUrls(face).every((u) => !u?.includes('/saga_textboxes/')),
      layoutKey: key(face) !== key({ ...face, layout: 'transform' }),
      reverseKey: key(face) !== key({ ...face, reverseStats: { power: '2', toughness: '2' } }),
      artBounds: SAGA_RECTS.art,
    };
  });
  for (const flag of [
    'openingStable',
    'shrink',
    'fits',
    'rejects',
    'nativeBadge',
    'fullPlate',
    'noOldComponents',
    'layoutKey',
    'reverseKey',
  ])
    assert.equal(result[flag], true, flag);
  assert.equal(result.alpha, 0, 'Printing layer must leave the native art aperture transparent');
  assert.deepEqual(result.outside, [255, 0, 0, 255], 'Artwork clearing must not cut the frame');
  console.log(
    'Saga measured layout, overflow, preparation assets, layer aperture and cache keys passed',
  );
} finally {
  await browser.close();
  await server.close();
}
