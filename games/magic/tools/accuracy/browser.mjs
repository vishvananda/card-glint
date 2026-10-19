import { createServer } from 'vite';
import { realpath } from 'node:fs/promises';
import { chromium } from 'playwright';
import { readObject } from './cache.mjs';
import { root } from './common.mjs';

/** Local source runner: snapshots supply all external bytes; capture never downloads. */
export async function openBrowser(
  snapshot,
  { fonts = true, sourceRoot = root, plugins = [] } = {},
) {
  // Vite otherwise serves untransformed TS from symlinked roots (macOS /tmp).
  sourceRoot = await realpath(sourceRoot);
  const assets = [
    ...(snapshot.components ?? []),
    ...snapshot.entries.flatMap((e) => [e.reference, e.art]).filter(Boolean),
  ];
  const byHash = new Map(assets.map((a) => [a.sha256, a]));
  const byUrl = new Map(assets.map((a) => [a.url, a]));
  const faults = [];
  const server = await createServer({
    configFile: false,
    root: sourceRoot,
    optimizeDeps: { noDiscovery: true },
    server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [
      ...plugins,
      {
        name: 'accuracy-local',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/__accuracy') {
              res.setHeader('Content-Type', 'text/html');
              res.end(
                `<!doctype html><meta charset="utf-8">${fonts ? '<link rel="stylesheet" href="/games/magic/fonts.css">' : ''}<title>Local Magic accuracy</title>`,
              );
            } else if (req.url.startsWith('/__accuracy/object/')) {
              const asset = byHash.get(req.url.slice('/__accuracy/object/'.length));
              try {
                if (!asset) throw Error('Object absent from snapshot');
                res.setHeader('Content-Type', asset.mime);
                res.end(await readObject(asset));
              } catch (error) {
                faults.push(String(error));
                res.writeHead(404).end(String(error));
              }
            } else next();
          });
        },
      },
    ],
  });
  await server.listen();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage({
      viewport: { width: 1100, height: 1100 },
      deviceScaleFactor: 1,
      locale: 'en-US',
    });
    await page.route('https://**/*', async (route) => {
      const url = route.request().url();
      try {
        const asset = byUrl.get(url);
        if (!asset)
          throw Error(`External URL absent from snapshot: ${url}; run magic:reference:fetch`);
        await route.fulfill({
          body: await readObject(asset),
          contentType: asset.mime,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
      } catch (error) {
        faults.push(String(error));
        await route.abort();
      }
    });
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__accuracy`);
    return {
      page,
      browser,
      faults,
      // Batch studies extend a frozen, content-addressed allowlist while using
      // one browser. The route still refuses every uncached external request.
      addAssets(assets) {
        for (const asset of assets) {
          const prior = byUrl.get(asset.url);
          if (prior && prior.sha256 !== asset.sha256)
            throw Error(`Batch asset identity changed: ${asset.url}`);
          byHash.set(asset.sha256, asset);
          byUrl.set(asset.url, asset);
        }
      },
      close: async () => {
        await browser.close();
        await server.close();
      },
    };
  } catch (error) {
    await browser?.close();
    await server.close();
    throw error;
  }
}
