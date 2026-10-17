import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL('..', import.meta.url)),
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  const url = new URL('finish-material-regression.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Finish mask pack isolation</title>',
    }),
  );
  await page.goto(url);
  const results = await page.evaluate(async () => {
    const { FinishResources } = await import('/packages/browser/src/finish-material.ts');
    const { AssetStore } = await import('/packages/browser/src/assets.ts');
    const { initializeRenderer } = await import('/packages/browser/src/renderer.ts');
    await initializeRenderer();
    const size = [16, 12];
    const raster = (key, opaque) => ({
      key,
      size,
      async paint(_host, signal) {
        signal.throwIfAborted();
        const canvas = document.createElement('canvas');
        [canvas.width, canvas.height] = size;
        if (opaque) {
          const context = canvas.getContext('2d');
          context.fillStyle = '#fff';
          context.fillRect(0, 0, ...size);
        }
        return canvas;
      },
    });
    const card = (pack, opaque) => ({
      id: 1,
      revision: 1,
      recipe: {
        pack,
        color: raster('shared-color-v1', false),
        edges: [],
        artWindows: [],
        cornerRadius: 0,
        regions: [],
      },
      layers: [
        {
          id: 'shared-coverage',
          stage: 'under-finish',
          order: 0,
          raster: raster('shared-layer-v1', false),
          etchCoverage: { add: raster('shared-etch-coverage-v1', opaque) },
        },
      ],
    });
    const cards = { A: card('finish-test-pack-a', true), B: card('finish-test-pack-b', false) };
    const host = new AssetStore(1024 * 1024);
    const controller = new AbortController();
    try {
      const results = [];
      for (const order of [
        ['A', 'B', 'A'],
        ['B', 'A', 'B'],
      ]) {
        const resources = new FinishResources();
        try {
          const masks = [];
          for (const pack of order) {
            const mask = await resources.documentMask(cards[pack], host, controller.signal);
            try {
              masks.push({
                pack,
                width: mask.width,
                height: mask.height,
                pixels: Array.from(mask.getContext('2d').getImageData(0, 0, ...size).data),
              });
            } finally {
              mask.width = mask.height = 0;
            }
          }
          results.push(masks);
        } finally {
          resources.dispose();
        }
      }
      return results;
    } finally {
      controller.abort();
      host.dispose();
    }
  });
  for (const masks of results) {
    const order = masks.map((mask) => mask.pack).join(' -> ');
    for (const [index, mask] of masks.entries()) {
      const label = `${order}, call ${index + 1}, pack ${mask.pack}`;
      assert.deepEqual([mask.width, mask.height], [16, 12], `${label}: mask dimensions`);
      const value = mask.pack === 'A' ? 255 : 0;
      const expected = Array.from({ length: 16 * 12 }, () => [value, value, value, 255]).flat();
      assert.deepEqual(mask.pixels, expected, `${label}: full/empty GPU mask pixels`);
    }
    assert.deepEqual(masks[2].pixels, masks[0].pixels, `${order}: returning to a cached pack`);
  }
  assert.deepEqual(errors, [], 'Unexpected browser errors');
  console.log(
    'PASS standalone finish mask pack isolation and reuse in A -> B -> A and B -> A -> B.',
  );
} finally {
  try {
    await browser?.close();
  } finally {
    await server.close();
  }
}
