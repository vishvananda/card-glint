import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const fixture = await readFile(new URL('./fixtures/gpu-material-078.json.gz', import.meta.url));
assert.equal(
  createHash('sha256').update(fixture).digest('hex'),
  'fb0fb6183e77a8c4bc6b267355c3efadb203286058d600a53deba46a5db38b65',
);
const baseline = JSON.parse(gunzipSync(fixture));
const server = await createServer({
  configFile: false,
  root: process.cwd(),
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
await server.listen();
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage(),
    errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/gpu-material-parity.html', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Material parity</title>' }),
  );
  await page.goto(new URL('gpu-material-parity.html', server.resolvedUrls.local[0]).href);
  const result = await page.evaluate(async (baseline) => {
    const { createRenderer, IDENTITY } = await import('/packages/browser/src/index.ts');
    const check = (ok, m) => {
      if (!ok) throw Error(m);
    };
    const size = [64, 88],
      transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    const makeRaster = (key, mask = false) => ({
      key,
      size,
      async paint() {
        const c = document.createElement('canvas');
        [c.width, c.height] = size;
        const g = c.getContext('2d'),
          p = g.createImageData(...size);
        for (let y = 0; y < size[1]; y++)
          for (let x = 0; x < size[0]; x++) {
            const alpha = mask ? (x > 8 && x < 55 && y > 12 && y < 75 ? 255 : 0) : 255;
            p.data.set(
              mask ? [255, 255, 255, alpha] : [35 + x * 3, 45 + y * 2, 60 + ((x + y) % 150), 255],
              (y * size[0] + x) * 4,
            );
          }
        g.putImageData(p, 0, 0);
        return c;
      },
    });
    const color = makeRaster('parity-color'),
      coating = makeRaster('parity-coating', true);
    const create = async (reference) => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = size;
      const gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      });
      let compiles = 0,
        materials = 0;
      const source = gl.shaderSource.bind(gl);
      gl.shaderSource = (shader, text) => {
        compiles++;
        if (text.includes('in vec2 v_uv;in vec3 v_normal;flat in vec2 wearInfo;')) materials++;
        if (reference && text.includes('in vec2 v_uv;in vec3 v_normal;flat in vec2 wearInfo;')) {
          const holo = text.includes('#define LOCAL_HOLOGRAM'),
            dots = text.includes('#define PROCEDURAL_PRINT');
          text =
            baseline[
              holo
                ? dots
                  ? 'proceduralHologramFragment'
                  : 'hologramFragment'
                : dots
                  ? 'proceduralFragment'
                  : 'fragment'
            ];
        }
        source(shader, text);
      };
      const renderer = await createRenderer({ canvas });
      // The 0.7.8 shader selected finishes per instance. Reuse its four programs,
      // rather than recompiling identical reference GLSL for every new cache key.
      if (reference)
        renderer.device.key = (recipe, _finish, procedural) =>
          'reference:' + Boolean(recipe.hologram?.strength) + ':' + procedural;
      const copy = document.createElement('canvas');
      [copy.width, copy.height] = size;
      const g = copy.getContext('2d', { willReadFrequently: true });
      return {
        renderer,
        gl,
        canvas,
        compiles: () => compiles,
        materials: () => materials,
        pixels: () => {
          g.clearRect(0, 0, ...size);
          g.drawImage(canvas, 0, 0);
          return g.getImageData(0, 0, ...size).data.slice();
        },
      };
    };
    const reference = await create(true),
      candidate = await create(false),
      rows = [];
    try {
      check(candidate.materials() === 0, 'Device eagerly compiled material programs');
      for (const hologram of [false, true]) {
        const doc = {
          id: 1,
          revision: hologram ? 2 : 1,
          recipe: {
            pack: 'gpu-parity',
            color,
            edges: [],
            artWindows: [[0.1, 0.15, 0.7, 0.35]],
            cornerRadius: 0.045,
            regions: [],
            ...(hologram
              ? {
                  hologram: {
                    mask: coating,
                    rect: [0.2, 0.25, 0.4, 0.25],
                    strength: 0.7,
                    seed: 7,
                  },
                }
              : {}),
          },
        };
        for (const r of [reference, candidate]) r.renderer.upsertCards([doc]);
        for (const print of [false, true])
          for (const finish of [
            'regular',
            'gloss',
            'etched',
            'prismatic',
            'cold',
            'opal',
            'rain',
            'heat',
            'pool',
            'holofoil',
          ]) {
            const instance = {
              id: 8,
              card: 1,
              transform,
              finish,
              normal: [0.1, 0.06, Math.sqrt(1 - 0.01 - 0.0036)],
              ...(print ? { printDots: { amount: 0.35 }, cardstock: { amount: 0.12 } } : {}),
            };
            for (const r of [reference, candidate]) {
              r.renderer.updateScene([instance]);
              await r.renderer.ready(1, doc.revision);
              r.renderer.render({
                viewProjection: IDENTITY,
                pointer: [0.27, 0.61],
                time: 1.25,
                lighting: 'studio',
              });
            }
            const a = reference.pixels(),
              b = candidate.pixels();
            let max = 0,
              changed = 0,
              over2 = 0,
              sum = 0;
            for (let i = 0; i < a.length; i++) {
              const d = Math.abs(a[i] - b[i]);
              max = Math.max(max, d);
              sum += d;
              if (d) changed++;
              if (d > 2) over2++;
            }
            rows.push({ hologram, print, finish, max, changed, over2, mean: sum / a.length });
            check(max === 0, 'Material changed: ' + JSON.stringify(rows.at(-1)));
            check(candidate.gl.getError() === candidate.gl.NO_ERROR, 'Candidate GL error');
          }
      }
      const before = candidate.compiles();
      for (let i = 0; i < 5; i++)
        candidate.renderer.render({ viewProjection: IDENTITY, time: 1.25, lighting: 'studio' });
      check(candidate.compiles() === before, 'Warm frame compiled shaders');
      const png = await candidate.renderer.exportCard(1, {
        revision: 2,
        width: 64,
        finish: 'gloss',
      });
      check(png.size > 0, 'Alternate finish export empty');
      return { rows, compiles: candidate.compiles(), warmCompiles: candidate.compiles() - before };
    } finally {
      reference.renderer.dispose();
      candidate.renderer.dispose();
    }
  }, baseline);
  assert.deepEqual(errors, []);
  assert.equal(result.rows.length, 40);
  await mkdir('evidence', { recursive: true });
  await writeFile(
    'evidence/gpu-material-parity.json',
    JSON.stringify(
      {
        schema: 1,
        referenceCommit: '8097bfa8b37b52c4ef19eec5f1c9ac8e475db687',
        referenceShaderSha256: createHash('sha256').update(fixture).digest('hex'),
        scope:
          'Deterministic software WebGL pixel comparison; not GPU completion performance or Windows driver validation.',
        ...result,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
  await server.close();
}
