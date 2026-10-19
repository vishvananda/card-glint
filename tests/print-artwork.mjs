import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const server = await createServer({
  configFile: false,
  root: process.cwd(),
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
  page.on('pageerror', (e) => errors.push(String(e)));
  const url = new URL('printing-test.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Print artwork</title>' }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const { createRenderer, IDENTITY, DEFAULT_PRINT_DOTS } = await import(
      '/packages/browser/src/index.ts'
    );
    const { FinishResources } = await import('/packages/browser/src/finish.ts');
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 192;
    const renderer = await createRenderer({ canvas });
    const source = document.createElement('canvas');
    source.width = 128;
    source.height = 192;
    const c = source.getContext('2d');
    c.fillStyle = '#b0a77f';
    c.fillRect(0, 0, 128, 192);
    const windows = [[0.125, 0.125, 0.5, 0.25]];
    const recipe = {
      pack: 'print-test',
      color: {
        key: 'artwork-test',
        size: [128, 192],
        async paint() {
          const copy = document.createElement('canvas');
          copy.width = source.width;
          copy.height = source.height;
          copy.getContext('2d').drawImage(source, 0, 0);
          return copy;
        },
      },
      edges: [],
      artWindows: windows,
      cornerRadius: 0,
      regions: [],
    };
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    const frame = { viewProjection: IDENTITY };
    const gl = canvas.getContext('webgl2');
    const pixels = () => {
      const data = new Uint8Array(128 * 192 * 4);
      gl.readPixels(0, 0, 128, 192, gl.RGBA, gl.UNSIGNED_BYTE, data);
      return data;
    };
    const draw = (printDots, mixed = false) => {
      const instance = { id: 1, card: 1, transform, printDots };
      renderer.updateScene(
        mixed
          ? [
              instance,
              {
                ...instance,
                id: 2,
                transform: [...transform.slice(0, 14), 0.5, 1],
                printDots: { amount: 0.01 },
              },
            ]
          : [instance],
      );
      renderer.render(frame);
      return pixels();
    };
    const diff = (a, b, inside) => {
      let sum = 0,
        n = 0,
        max = 0;
      for (let y = 4; y < 188; y++)
        for (let x = 4; x < 124; x++) {
          const art = x > 18 && x < 78 && y > 122 && y < 166;
          const outside = x < 12 || x > 84 || y < 116 || y > 172;
          if (inside ? !art : !outside) continue;
          const i = (y * 128 + x) * 4;
          for (let k = 0; k < 3; k++) {
            const d = Math.abs(a[i + k] - b[i + k]);
            sum += d;
            n++;
            max = Math.max(max, d);
          }
        }
      return { mean: sum / n, max };
    };
    try {
      renderer.upsertCards([{ id: 1, revision: 1, recipe }]);
      await renderer.ready(1, 1);
      // Default physical dots are unresolved at this thumbnail tier and must fade.
      // Use a resolvable physical period for the independent artwork-mask checks.
      const visibleSettings = { ...DEFAULT_PRINT_DOTS, period: 12 };
      const off = draw(),
        defaults = draw({}),
        explicit = draw(DEFAULT_PRINT_DOTS),
        visible = draw(visibleSettings),
        excluded = draw({ ...visibleSettings, artwork: false });
      const prepared = renderer.metrics.surfacePasses;
      const repeat = draw({ ...visibleSettings, artwork: false });
      const repeated = renderer.metrics.surfacePasses;
      const mixed = draw({ ...visibleSettings, artwork: false }, true);
      const out = await renderer.exportCard(1, {
        revision: 1,
        width: 128,
        printDots: { ...visibleSettings, artwork: false },
      });
      const blob = out instanceof Blob ? out : out.blob;
      const bitmap = await createImageBitmap(blob);
      const exported = document.createElement('canvas');
      exported.width = 128;
      exported.height = 192;
      exported.getContext('2d').drawImage(bitmap, 0, 0);
      bitmap.close();
      const top = exported.getContext('2d').getImageData(0, 0, 128, 192).data,
        bottom = new Uint8Array(top.length);
      for (let y = 0; y < 192; y++)
        bottom.set(top.subarray(y * 512, (y + 1) * 512), (191 - y) * 512);
      const resources = new FinishResources();
      try {
        const hostOff = resources.printDots(source, 128, 192, { amount: 0 }).data;
        const hostExcluded = resources.printDots(
          source,
          128,
          192,
          { ...visibleSettings, artwork: false },
          windows,
        ).data;
        return {
          defaultParity: diff(defaults, explicit, true),
          defaultFade: diff(off, defaults, true),
          artAdded: diff(off, visible, true),
          artExcluded: diff(off, excluded, true),
          frameAdded: diff(off, excluded, false),
          mixedArt: diff(off, mixed, true),
          mixedFrame: diff(off, mixed, false),
          repeat: diff(repeat, excluded, false),
          prepared,
          repeated,
          exportArt: diff(off, bottom, true),
          exportFrame: diff(excluded, bottom, false),
          hostArt: diff(hostOff, hostExcluded, true),
          hostFrame: diff(hostOff, hostExcluded, false),
        };
      } finally {
        resources.dispose();
      }
    } finally {
      renderer.dispose();
    }
  });
  assert.deepEqual(errors, []);
  for (const key of [
    'defaultParity',
    'defaultFade',
    'artExcluded',
    'mixedArt',
    'repeat',
    'exportArt',
    'exportFrame',
    'hostArt',
  ])
    assert.ok(result[key].max <= 1, `${key}: ${JSON.stringify(result[key])}`);
  for (const key of ['artAdded', 'frameAdded', 'mixedFrame', 'hostFrame'])
    assert.ok(result[key].mean > 0.05, `${key}: no dots`);
  assert.equal(result.prepared, result.repeated);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser?.close();
  await server.close();
}
