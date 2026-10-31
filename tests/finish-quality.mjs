import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const built = await build({
  entryPoints: ['packages/browser/src/finish-quality.ts'],
  bundle: true,
  write: false,
  format: 'esm',
});
const { finishQuality } = await import(
  'data:text/javascript;base64,' + Buffer.from(built.outputFiles[0].contents).toString('base64')
);
const driver = (name, masked = name) => ({
  RENDERER: 1,
  getParameter: (p) => (p === 1 ? masked : name),
  getExtension: () => ({ UNMASKED_RENDERER_WEBGL: 2 }),
});
for (const name of [
  'llvmpipe (LLVM 20)',
  'ANGLE (SwiftShader Device)',
  'softpipe',
  'Microsoft Basic Render Driver',
]) {
  assert.equal(finishQuality(driver(name), 'auto'), 'reduced');
  assert.equal(finishQuality(driver(name), 'full'), 'full');
}
for (const name of [
  'AMD Radeon RX 6600',
  'Apple M3',
  'ANGLE (Intel UHD Graphics)',
  'Mesa Intel Iris',
  'WebGL',
])
  assert.equal(finishQuality(driver(name), 'auto'), 'full');
assert.equal(finishQuality(driver('llvmpipe', 'WebKit WebGL'), 'auto'), 'reduced');
const privateGL = { RENDERER: 1, getParameter: () => 'WebGL', getExtension: () => null };
assert.equal(finishQuality(privateGL, 'auto'), 'full');
assert.equal(
  finishQuality(
    {
      getParameter() {
        throw Error('Unnecessary fingerprint');
      },
    },
    'full',
  ),
  'full',
);
assert.throws(() => finishQuality(privateGL, 'invalid'), /Invalid finish quality/);

const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  const report = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const api = window.lab.api;
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
      result = [];
    const document = {
      id: 1,
      revision: 1,
      recipe: {
        pack: 'quality-control',
        color: {
          key: 'quality-control-v1',
          size: [244, 340],
          async paint() {
            const c = api.canvas([244, 340]),
              p = c.getContext('2d');
            p.fillStyle = '#63906a';
            p.fillRect(0, 0, 244, 340);
            p.fillStyle = '#e9dfca';
            p.fillRect(20, 180, 204, 130);
            p.fillStyle = '#17140f';
            p.fillRect(28, 200, 160, 4);
            return c;
          },
        },
        edges: [],
        artWindows: [[0.1, 0.1, 0.8, 0.35]],
        cornerRadius: 0.045,
        regions: [],
      },
    };
    for (const preference of [undefined, 'full', 'auto', 'reduced']) {
      const canvas = api.canvas([244, 340]),
        r = await api.createRenderer({ canvas, finishQuality: preference });
      const gl = canvas.getContext('webgl2'),
        pixels = () => {
          const p = new Uint8Array(244 * 340 * 4);
          gl.readPixels(0, 0, 244, 340, gl.RGBA, gl.UNSIGNED_BYTE, p);
          return p;
        };
      try {
        r.upsertCards([document]);
        r.updateScene([{ id: 1, card: 1, transform, finish: 'regular' }]);
        await r.ready(1, 1);
        r.render({ viewProjection: api.IDENTITY });
        const plain = pixels();
        r.updateScene([
          {
            id: 1,
            card: 1,
            transform,
            finish: 'prismatic',
            printDots: { amount: 0.35, period: 7, artwork: false },
            cardstock: { amount: 0.2 },
          },
        ]);
        const start = performance.now();
        await r.ready(1, 1);
        r.render({ viewProjection: api.IDENTITY, pointer: [0.2, 0.8] });
        const finished = pixels(),
          firstMs = performance.now() - start,
          before = r.metrics;
        for (let i = 0; i < 4; i++) {
          r.render({ viewProjection: api.IDENTITY, pointer: [0.2 + i * 0.1, 0.8] });
          pixels();
        }
        const after = r.metrics;
        result.push({
          preference: preference ?? 'default',
          quality: r.finishQuality,
          plain: [...plain],
          changed: finished.some((v, i) => v !== plain[i]),
          firstCompletedMs: firstMs,
          before,
          after,
        });
      } finally {
        r.dispose();
      }
    }
    return result;
  });
  assert.equal(report[0].quality, 'full');
  assert.equal(report[1].quality, 'full');
  assert.equal(report[2].quality, 'reduced');
  assert.equal(report[3].quality, 'reduced');
  for (const r of report) {
    assert.deepEqual(r.plain, report[0].plain, 'Quality never changes unshaded card content');
    assert(r.changed, 'Foil and printing remain active');
    for (const k of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads', 'printPasses'])
      if (k in r.before) assert.equal(r.before[k], r.after[k], k + ' is cached through tilt');
    delete r.plain;
  }
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      report.map(({ preference, quality, firstCompletedMs }) => ({
        preference,
        quality,
        firstCompletedMs,
      })),
    ),
  );
  await writeFile(
    process.env.FINISH_EVIDENCE ?? '/tmp/glint-finish-quality.json',
    JSON.stringify(
      {
        scope:
          'Linux Chromium/SwiftShader. Completed wall time includes CPU submission and a test-only readback; not hardware GPU timing or FPS.',
        report,
        errors,
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
}
console.log(
  'Finish quality: driver selection, exact unshaded content, retained effects and warm cache checks passed.',
);
