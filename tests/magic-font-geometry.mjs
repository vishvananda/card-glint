import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fontBytes } from './magic-font-assets.mjs';
import { chromium, webkit, firefox } from 'playwright';
import { createServer } from './magic-vite.mjs';
const fonts = JSON.parse(
  await fs.readFile('games/magic/src/presentation/font-geometry.json', 'utf8'),
);
const cache = process.env.CARD_GLINT_FONT_CACHE || path.join(os.tmpdir(), 'card-glint-fonts');
await fs.mkdir(cache, { recursive: true });
const bytes = new Map();
for (const f of fonts) bytes.set(f.sha256, await fontBytes(f, cache));

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'font-probe',
      configureServer(s) {
        s.middlewares.use((req, res, next) => {
          if (req.url === '/__font-probe') {
            res.setHeader('Content-Type', 'text/html');
            res.end('<!doctype html><title>Font geometry probe</title>');
            return;
          }
          if (req.url?.startsWith('/__font-bytes/')) {
            const value = bytes.get(req.url.split('/').at(-1));
            if (value) {
              res.setHeader('Content-Type', 'application/octet-stream');
              res.end(value);
              return;
            }
          }
          next();
        });
      },
    },
  ],
});
await server.listen();
const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
const referenceFile = 'tests/fixtures/magic-font-geometry-reference.json';
let reference = process.argv.includes('--write-reference')
  ? undefined
  : JSON.parse(await fs.readFile(referenceFile, 'utf8'));
const output = { platform: process.platform, engines: [] };
try {
  const { canvasFontAssets } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-fonts.ts',
  );
  assert.deepEqual(
    fonts.map((f) => [f.family, f.weight, f.style, f.source]),
    canvasFontAssets.map((f) => [f.family, f.weight, f.style, f.url]),
    'Every registered face needs reviewed geometry',
  );
  for (const name of (process.env.FONT_ENGINES || 'chromium,webkit').split(',')) {
    const engine = { chromium, webkit, firefox }[name];
    assert(engine, 'Unknown font test engine');
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
      await page.goto(origin + '/__font-probe');
      const options = {
        fonts,
        moduleURL: origin + '/games/magic/src/presentation/font-geometry.ts',
        assetBase: origin + '/__font-bytes/',
      };
      const actual = await page.evaluate(
        async (options) =>
          (await import('/tests/fixtures/magic-font-geometry-probes.mjs')).fontGeometryProbes(
            options,
          ),
        options,
      );
      if (!reference) {
        reference = actual;
        await fs.writeFile(referenceFile, JSON.stringify(reference, null, 2) + '\n');
      }
      assert.deepEqual(actual.wraps, reference.wraps, 'Platform-dependent wrapping');
      assert.equal(actual.rows.length, reference.rows.length);
      for (const [i, row] of actual.rows.entries()) {
        const expected = reference.rows[i];
        for (const key of ['font', 'style', 'weight', 'size', 'baseline', 'text'])
          assert.equal(row[key], expected[key]);
        for (const key of ['width', 'ascent', 'descent', 'fontAscent', 'fontDescent', 'drawY'])
          assert(
            Math.abs(row[key] - expected[key]) < 0.025,
            JSON.stringify({ engine: name, key, actual: row, expected }),
          );
        if (row.ink !== undefined) {
          assert.equal(row.ink === null, expected.ink === null);
          if (row.ink)
            assert(
              Math.abs((row.ink[0] + row.ink[1] - expected.ink[0] - expected.ink[1]) / 2) <= 1,
              'Glyph ink center moved',
            );
          if (row.ink)
            row.ink.forEach((v, n) =>
              assert(
                Math.abs(v - expected.ink[n]) <= 2,
                'Glyph raster exceeded its two-pixel edge tolerance ' +
                  JSON.stringify({ engine: name, row, expected }),
              ),
            );
        }
      }
      if (name === 'chromium') {
        const workerResult = await page.evaluate(
          (options) =>
            new Promise((resolve, reject) => {
              const worker = new Worker('/tests/fixtures/magic-font-geometry-worker.mjs', {
                type: 'module',
              });
              const timer = setTimeout(() => {
                worker.terminate();
                reject(Error('Font worker timed out'));
              }, 60000);
              worker.onmessage = ({ data }) => {
                clearTimeout(timer);
                worker.terminate();
                if (data.error) reject(Error(data.error));
                else resolve(data.result);
              };
              worker.onerror = (e) => {
                clearTimeout(timer);
                worker.terminate();
                reject(Error(e.message));
              };
              worker.postMessage(options);
            }),
          options,
        );
        assert.deepEqual(workerResult.wraps, actual.wraps, 'Document/worker wrapping differs');
        assert.deepEqual(workerResult.rows, actual.rows, 'Document/worker font geometry differs');
        console.log(
          'Worker FontFaceSet and OffscreenCanvas match all ' +
            actual.rows.length +
            ' document cases',
        );
      }
      output.engines.push({ name, rows: actual.rows.length, wraps: actual.wraps.length });
      console.log(
        name +
          ': ' +
          actual.rows.length +
          ' real-font anchor cases and ' +
          actual.wraps.length +
          ' wrap cases match the frozen reference',
      );
    } finally {
      await browser.close();
    }
  }
} finally {
  await server.close();
}
if (process.env.FONT_GEOMETRY_RECEIPT)
  await fs.writeFile(process.env.FONT_GEOMETRY_RECEIPT, JSON.stringify(output, null, 2) + '\n');
