/** Produce the byte-verified native surveys used by build-font-geometry.py. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit, firefox } from 'playwright';
import { createServer } from '../../../tests/magic-vite.mjs';
import { fontBytes } from '../../../tests/magic-font-assets.mjs';
const directory = process.argv[2];
if (!directory) throw Error('Usage: node games/magic/tools/font-audit.mjs <output-directory>');
await fs.mkdir(path.join(directory, 'fonts'), { recursive: true });
const byteCache = new Map();
const server = await createServer({
  plugins: [
    {
      name: 'font-survey',
      configureServer(s) {
        s.middlewares.use((req, res, next) => {
          const v = req.url?.startsWith('/__survey-font/')
            ? byteCache.get(path.basename(req.url))
            : undefined;
          if (v) {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.end(v);
          } else next();
        });
      },
    },
  ],
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
try {
  const { canvasFontAssets } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-fonts.ts',
  );
  const catalog = JSON.parse(await fs.readFile('games/magic/src/presentation/font-geometry.json'));
  const fonts = [];
  for (const asset of canvasFontAssets) {
    const entry = catalog.find(
      (f) =>
        f.family === asset.family &&
        f.style === asset.style &&
        f.weight === asset.weight &&
        f.source === asset.url,
    );
    if (!entry) throw Error('Review and pin the new source SHA before surveying: ' + asset.family);
    byteCache.set(entry.sha256, await fontBytes(entry, path.join(directory, 'fonts')));
    fonts.push({ ...asset, sha256: entry.sha256, local: 'fonts/' + entry.sha256 });
  }
  await fs.writeFile(path.join(directory, 'fonts.json'), JSON.stringify(fonts, null, 2) + '\n');
  const base = 'http://127.0.0.1:' + server.httpServer.address().port;
  // Use a byte URL on the survey origin; no browser CDN/fallback ambiguity.
  for (const name of (process.env.FONT_ENGINES || 'chromium').split(',')) {
    const engine = { chromium, webkit, firefox }[name];
    if (!engine) throw Error('Unknown engine: ' + name);
    const browser = await engine.launch({
      headless: true,
      ...(name === 'chromium'
        ? {
            args: ['--no-sandbox'],
            ...(process.env.FONT_CHROME_EXECUTABLE
              ? { executablePath: process.env.FONT_CHROME_EXECUTABLE }
              : {}),
          }
        : {}),
    });
    try {
      const page = await browser.newPage();
      await page.goto(base);
      const result = await page.evaluate(
        async (options) => {
          const { rawFontSurvey } = await import('/tests/fixtures/magic-font-geometry-probes.mjs');
          return rawFontSurvey(options);
        },
        { fonts, assetBase: base + '/__survey-font/' },
      );
      const platform = process.platform === 'darwin' ? 'mac' : process.platform;
      await fs.writeFile(
        path.join(directory, platform + '-' + name + '-precise-font-audit.json'),
        JSON.stringify(result, null, 2) + '\n',
      );
      console.log(platform + '/' + name + ': surveyed ' + fonts.length + ' real faces');
    } finally {
      await browser.close();
    }
  }
} finally {
  await server.close();
}
