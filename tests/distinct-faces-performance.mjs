import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
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
    args:
      process.env.PERF_GPU === 'native'
        ? ['--no-sandbox']
        : ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  const page = await browser.newPage();
  const url = new URL('distinct-faces-performance.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Distinct faces performance</title>',
    }),
  );
  await page.goto(url);
  const report = await page.evaluate(async (defaults) => {
    const { createRenderer, IDENTITY, canvas } = await import('/packages/browser/src/index.ts');
    const count = 400,
      width = 96,
      height = 134,
      target = canvas([960, 1340]),
      start = performance.now();
    const renderer = await createRenderer({ canvas: target });
    const documents = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      revision: 1,
      recipe: {
        pack: 'distinct-original-performance',
        color: {
          key: 'unique-face-' + i,
          size: [width, height],
          async paint() {
            const c = canvas([width, height]),
              ctx = c.getContext('2d');
            ctx.fillStyle = `rgb(${50 + (i % 16) * 10},${50 + (Math.floor(i / 16) % 16) * 10},${50 + Math.floor(i / 256) * 40})`;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#ddd';
            ctx.fillRect(6, 12, 84, 60);
            ctx.fillStyle = '#222';
            ctx.font = '12px monospace';
            ctx.fillText(String(i + 1), 10, 95);
            return c;
          },
        },
        stamp: {
          key: 'mask-' + (i % 8),
          size: [width, height],
          async paint() {
            const c = canvas([width, height]),
              ctx = c.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(8 + (i % 8), 18, 70, 50);
            return c;
          },
        },
        edges: [],
        artWindows: [[0.05, 0.1, 0.9, 0.7]],
        cornerRadius: 0.045,
        regions: [],
      },
    }));
    const finishes = ['etched', 'prismatic', 'cold', 'opal', 'gloss', 'holofoil'];
    try {
      renderer.upsertCards(documents);
      await Promise.all(documents.map((d) => renderer.ready(d.id, d.revision)));
      const preparedMs = performance.now() - start;
      const instances = documents.map((d, i) => ({
        id: d.id,
        card: d.id,
        finish: finishes[i % finishes.length],
        cardstock: { amount: 0.35 },
        printDots: defaults ? {} : { amount: 0.35, period: 16 },
        transform: [
          0.1,
          0,
          0,
          0,
          0,
          0.1,
          0,
          0,
          0,
          0,
          1,
          0,
          -1 + (i % 20) * 0.1,
          -1 + Math.floor(i / 20) * 0.1,
          0,
          1,
        ],
        normal: [0.1, 0.15, 0.9836158],
      }));
      renderer.updateScene(instances);
      const gl = target.getContext('webgl2');
      const first = performance.now();
      renderer.render({ viewProjection: IDENTITY, time: 1 });
      const firstSubmissionMs = performance.now() - first;
      gl.finish();
      renderer.render({ viewProjection: IDENTITY, time: 2 });
      gl.finish();
      const before = renderer.metrics,
        calls = {};
      const methods = [
        'getUniformLocation',
        'compileShader',
        'texSubImage2D',
        'readPixels',
        'drawArrays',
        'generateMipmap',
      ];
      const originals = new Map();
      for (const name of methods) {
        const method = gl[name].bind(gl);
        originals.set(name, method);
        gl[name] = (...args) => {
          calls[name] = (calls[name] ?? 0) + 1;
          return method(...args);
        };
      }
      const cpu = [],
        gpu = [],
        ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
      try {
        for (let i = 0; i < 5; i++) {
          let query;
          if (ext) {
            query = gl.createQuery();
            gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
          }
          const t = performance.now();
          renderer.render({
            viewProjection: IDENTITY,
            time: 3 + i,
            pointer: [0.45 + i * 0.02, 0.5],
          });
          cpu.push(performance.now() - t);
          if (query) {
            gl.endQuery(ext.TIME_ELAPSED_EXT);
            gl.flush();
            const deadline = performance.now() + 30000;
            while (
              !gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE) &&
              performance.now() < deadline
            )
              await new Promise((r) => setTimeout(r, 10));
            if (
              gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE) &&
              !gl.getParameter(ext.GPU_DISJOINT_EXT)
            )
              gpu.push(gl.getQueryParameter(query, gl.QUERY_RESULT) / 1e6);
            gl.deleteQuery(query);
          } else gl.finish();
        }
      } finally {
        for (const [name, method] of originals) gl[name] = method;
      }
      const after = renderer.metrics;
      cpu.sort((a, b) => a - b);
      gpu.sort((a, b) => a - b);
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        gpuRenderer: debug
          ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
          : gl.getParameter(gl.RENDERER),
        scope:
          '400 distinct original Canvas faces, 96x134, 960x1340 target, six static finishes including full holofoil, shared eight mask geometries, cardstock and printing. CPU submission is not completed GPU time. SwiftShader is software GPU evidence.',
        printing: defaults ? 'library-defaults' : 'large-period-stress',
        count,
        sourceSize: [width, height],
        targetSize: [960, 1340],
        preparedMs,
        firstSubmissionMs,
        warmCpuMedianMs: cpu[2],
        warmCpuP95Ms: cpu[4],
        gpuTimerAvailable: !!ext,
        completedGpuMedianMs: gpu.length ? gpu[Math.floor(gpu.length / 2)] : null,
        before,
        after,
        warmGlCalls: calls,
        glError: gl.getError(),
      };
    } finally {
      renderer.dispose();
      glCleanup(target);
    }
    function glCleanup(c) {
      c.getContext('webgl2').getExtension('WEBGL_lose_context')?.loseContext();
    }
  }, process.env.PERF_PRINT_DEFAULTS === '1');
  assert.equal(report.glError, 0);
  assert.equal(report.after.visible, 400);
  assert.equal(report.after.compositions, 400);
  for (const key of ['compositions', 'uploads', 'maskBuilds', 'edgeBuilds', 'readbacks'])
    assert.equal(report.after[key], report.before[key], key + ' rebuilt in warm draws');
  if (process.env.PERF_BASELINE !== '1') {
    assert.equal(
      report.after.surfacePasses,
      report.before.surfacePasses,
      'Warm view must not rebuild printing',
    );
    assert.equal(
      report.warmGlCalls.getUniformLocation ?? 0,
      0,
      'Warm frames must reuse uniform locations',
    );
    assert.equal(report.warmGlCalls.compileShader ?? 0, 0);
    assert.equal(report.warmGlCalls.readPixels ?? 0, 0);
  }
  const output = process.env.PERF_OUTPUT ?? 'evidence/distinct-faces-performance.json';
  await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser?.close();
  await server.close();
}
