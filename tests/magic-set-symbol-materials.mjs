import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
await server.listen();
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage(),
    errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/__material-order-test', (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Material order test</title>',
    }),
  );
  await page.route('https://**', (r) => r.abort());
  const symbol =
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="white"/><path fill="black" fill-rule="evenodd" d="M4 4h56v56H4ZM12 12v40h40V12Z"/><path d="M30 12h4v40h-4Z" fill="black"/></svg>';
  await page.route('**/img/setSymbols/official/plc-c.svg', (r) =>
    r.fulfill({
      contentType: 'image/svg+xml',
      body: symbol,
      headers: { 'Access-Control-Allow-Origin': '*' },
    }),
  );
  await page.route('**/ink-source.svg', (r) =>
    r.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="96"><rect width="128" height="96" fill="#ada3aa"/><path d="M10 30h105M50 0v96" stroke="#171717" stroke-width="5"/></svg>',
    }),
  );
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__material-order-test`);
  const results = await page.evaluate(async () => {
    const { createRenderer, IDENTITY } = await import('/dist/lib/browser.js'),
      { magic } = await import('/dist/lib/magic.js');
    const output = [],
      transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
      frame = { viewProjection: IDENTITY, pointer: [0.88, 0.15], time: 0 };
    const original = CanvasRenderingContext2D.prototype.getImageData;
    let sourceReads = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      sourceReads++;
      return original.apply(this, args);
    };
    try {
      for (const etching of ['gpu', 'rust']) {
        const c = document.createElement('canvas');
        c.width = 244;
        c.height = 340;
        const renderer = await createRenderer({
            canvas: c,
            wasmUrl: '/dist/lib/renderer_bg.wasm',
            etching,
          }),
          gl = c.getContext('webgl2');
        try {
          const face = {
              name: 'Original material fixture',
              setCode: 'PLC',
              typeLine: 'Instant',
              illustration: new URL('/ink-source.svg', location.href).href,
            },
            base = magic.describe(face, 'table');
          const color = {
            key: 'material-order-original-v1',
            size: base.color.size,
            async paint() {
              const a = document.createElement('canvas');
              [a.width, a.height] = base.color.size;
              const x = a.getContext('2d');
              x.fillStyle = '#897f82';
              x.fillRect(0, 0, a.width, a.height);
              return a;
            },
          };
          renderer.upsertCards([
            { id: 1, revision: 1, recipe: { ...base, color } },
            {
              id: 2,
              revision: 1,
              recipe: { ...magic.describe({ ...face, setSymbolMask: 'alpha' }, 'table'), color },
            },
          ]);
          await Promise.all([renderer.ready(1, 1), renderer.ready(2, 1)]);
          const take = () => {
            const a = new Uint8Array(c.width * c.height * 4);
            gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, a);
            return a;
          };
          const draw = (card, finish, extra = {}) => {
            renderer.updateScene([{ id: 17, card, finish, transform, ...extra }]);
            renderer.render(frame);
            return take();
          };
          const difference = (a, b) =>
            a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0) / a.length;
          const initial = { ...renderer.metrics },
            preparedReads = sourceReads,
            finishes = [];
          for (const finish of ['etched', 'opal']) {
            const ink = draw(1, finish),
              solid = draw(2, finish);
            const changed = difference(ink, solid);
            if (changed <= 0.01) throw Error(finish + ' still renders the solid silhouette');
            const extras = {
                cardstock: { amount: 0.2 },
                printDots: { amount: 0.15, period: 3, variation: 1 },
              },
              textured = draw(1, finish, extras);
            if (difference(ink, textured) <= 0.01)
              throw Error('Printing/stock effects did not reach the final material');
            const options = {
                revision: 1,
                width: 244,
                finish,
                pointer: frame.pointer,
                time: 0,
                ...extras,
              },
              blob = await renderer.exportCard(1, options),
              bitmap = await createImageBitmap(blob),
              copy = document.createElement('canvas');
            copy.width = 244;
            copy.height = 340;
            const ctx = copy.getContext('2d');
            ctx.drawImage(bitmap, 0, 0);
            bitmap.close();
            const exported = original.call(ctx, 0, 0, 244, 340).data,
              flipped = new Uint8Array(exported.length);
            for (let y = 0; y < 340; y++)
              flipped.set(exported.subarray(y * 244 * 4, (y + 1) * 244 * 4), (339 - y) * 244 * 4);
            if (difference(textured, flipped) !== 0)
              throw Error(finish + ' export differs from preview');
            const warm = renderer.metrics;
            for (const key of ['maskBuilds', 'edgeBuilds', 'compositions', 'uploads', 'readbacks'])
              if (initial[key] !== warm[key])
                throw Error(key + ' changed when enabling printed effects');
            if (preparedReads !== sourceReads)
              throw Error('Material toggles reread symbol/art pixels');
            for (let i = 0; i < 3; i++) draw(1, finish, extras);
            finishes.push({ finish, changed, previewExportDifference: 0 });
          }
          if (gl.getError() !== 0) throw Error('WebGL error');
          output.push({
            etching,
            finishes,
            maskBuilds: initial.maskBuilds,
            edgeBuilds: initial.edgeBuilds,
            readbacks: initial.readbacks,
            sourceReadsDuringEffects: sourceReads - preparedReads,
          });
        } finally {
          renderer.dispose();
          magic.dispose();
        }
      }
    } finally {
      CanvasRenderingContext2D.prototype.getImageData = original;
    }
    return output;
  });
  assert.deepEqual(errors, []);
  await mkdir('evidence', { recursive: true });
  await writeFile(
    'evidence/set-symbol-materials.json',
    JSON.stringify(
      {
        scope:
          'Linux Chromium / SwiftShader; source and material cache checks, not GPU completion timing or physical hardware validation',
        results,
        errors,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    'PASS Etched/Opal symbol detail, print/stock mask isolation, warm reuse and exact preview/PNG parity for GPU and Rust etching',
    results,
  );
} finally {
  await browser.close();
  await server.close();
}
