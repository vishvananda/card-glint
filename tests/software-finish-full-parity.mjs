import assert from 'node:assert/strict';
import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { softwareFinishProof } from '../games/magic/tools/accuracy/software-finish-ancestry.mjs';

// Exercise the actual historical runtime, rather than replacing shader strings.
const directory = await mkdtemp('tests/.software-finish-reference-');
let server, browser, deadline;
try {
  await cp('packages/browser', directory, { recursive: true });
  for (const [file, e] of Object.entries((await softwareFinishProof()).files))
    await writeFile(directory + file.slice('packages/browser'.length), e.beforeSource);
  server = await createServer({
    configFile: false,
    root: process.cwd(),
    server: { host: '127.0.0.1', port: 0, hmr: false },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  await server.listen();
  browser = await chromium.launch({
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  deadline = setTimeout(() => void browser.close(), 120000);
  const page = await browser.newPage(),
    errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/software-finish-parity.html', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Finish parity</title>' }),
  );
  await page.goto(new URL('software-finish-parity.html', server.resolvedUrls.local[0]).href);
  const result = await page.evaluate(async (directory) => {
    const current = await import('/packages/browser/src/index.ts'),
      baseline = await import('/' + directory + '/src/index.ts');
    const rows = [],
      transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    for (const [label, api, quality] of [
      ['baseline', baseline],
      ['default', current],
      ['full', current, 'full'],
    ]) {
      const canvas = document.createElement('canvas');
      canvas.width = 122;
      canvas.height = 170;
      const r = await api.createRenderer({ canvas, finishQuality: quality }),
        gl = canvas.getContext('webgl2');
      try {
        r.upsertCards([
          {
            id: 1,
            revision: 1,
            recipe: {
              pack: 'finish-parity',
              color: {
                key: 'synthetic',
                size: [244, 340],
                async paint() {
                  const c = document.createElement('canvas');
                  c.width = 244;
                  c.height = 340;
                  const p = c.getContext('2d'),
                    gradient = p.createLinearGradient(0, 0, 244, 340);
                  gradient.addColorStop(0, '#24366a');
                  gradient.addColorStop(1, '#ddb260');
                  p.fillStyle = gradient;
                  p.fillRect(0, 0, 244, 340);
                  p.fillStyle = '#ede4ce';
                  p.fillRect(20, 180, 204, 125);
                  p.fillStyle = '#17120c';
                  p.fillRect(28, 200, 155, 4);
                  return c;
                },
              },
              edges: [],
              artWindows: [[0.1, 0.1, 0.8, 0.35]],
              cornerRadius: 0.045,
              regions: [],
            },
          },
        ]);
        for (const finish of ['regular', 'gloss', 'prismatic']) {
          r.updateScene([
            {
              id: 1,
              card: 1,
              transform,
              finish,
              printDots: { amount: 0.35, period: 7, artwork: false },
              cardstock: { amount: 0.2 },
            },
          ]);
          await r.ready(1, 1);
          r.render({ viewProjection: api.IDENTITY, pointer: [0.2, 0.8], time: 0 });
          const pixels = new Uint8Array(122 * 170 * 4);
          gl.readPixels(0, 0, 122, 170, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', pixels))]
            .map((v) => v.toString(16).padStart(2, '0'))
            .join('');
          rows.push({ label, finish, hash });
        }
      } finally {
        r.dispose();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    }
    return rows;
  }, directory);
  for (const row of result.filter((r) => r.label !== 'baseline'))
    assert.equal(
      row.hash,
      result.find((r) => r.label === 'baseline' && r.finish === row.finish).hash,
      row.label + ':' + row.finish,
    );
  assert.deepEqual(errors, []);
  await writeFile(
    process.env.FINISH_PARITY_EVIDENCE ?? '/tmp/glint-software-full-parity.json',
    JSON.stringify(
      {
        scope:
          'Synthetic 244x340 source, 122x170 completed Chromium/SwiftShader pixels, printing and cardstock enabled, fixed pose/time. Historical 0.7.10, current default, explicit full; no hardware performance claim.',
        browser: browser.version(),
        platform: process.platform,
        rows: result,
        errors,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    'Default and explicit full match 0.7.10 pixels for regular, gloss and prismatic with printing/cardstock.',
  );
} finally {
  clearTimeout(deadline);
  await browser?.close();
  await server?.close();
  await rm(directory, { recursive: true, force: true });
}
