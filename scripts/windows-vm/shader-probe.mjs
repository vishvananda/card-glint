import { createServer, request as httpRequest } from 'node:http';
import { platform, release, arch, freemem, totalmem } from 'node:os';
import { chromium, firefox } from 'playwright';

const [backend = 'default', quality = 'auto', engine = 'msedge'] = process.argv.slice(2);
const stress = process.env.GLINT_PROBE_STRESS === '1';
const stressProfile = process.env.GLINT_STRESS_PROFILE || 'mixed';
if (!['mixed', 'regular', 'bare'].includes(stressProfile)) throw Error('Invalid stress profile');
const evaluationBudgetMs = stress
  ? backend === 'warp'
    ? 540000
    : 300000
  : backend === 'warp'
    ? 450000
    : 150000;
if (
  !['default', 'warp', 'swiftshader'].includes(backend) ||
  !['auto', 'full', 'reduced'].includes(quality) ||
  !['msedge', 'chromium', 'firefox'].includes(engine)
)
  throw Error('Invalid probe selection');
if (engine === 'firefox' && backend === 'swiftshader')
  throw Error('Firefox probe supports default or WARP; SwiftShader is a Chromium backend');
const upstream = new URL(process.env.GLINT_CONTROL_BASE),
  token = process.env.GLINT_CONTROL_TOKEN;
if (!token) throw Error('Missing private test transport token');
const report = {
  schema: 1,
  startedAt: new Date().toISOString(),
  os: { platform: platform(), release: release(), arch: arch() },
  backend,
  quality,
  engine,
  mode: stress ? 'stress' : 'finishes',
  stressProfile: stress ? stressProfile : undefined,
  scope:
    'Browser probe; OS, adapter and headless fields define coverage. readyMs waits for resources/materials; submitMs is CPU render-call time, not GPU completion. captureMs includes explicit export/readback. This is not physical GPU validation.',
  rows: [],
  errors: [],
  console: [],
  guestMemory: { totalBytes: totalmem(), minAvailableBytes: freemem() },
};
const memoryTimer = setInterval(() => {
  report.guestMemory.minAvailableBytes = Math.min(report.guestMemory.minAvailableBytes, freemem());
}, 1000);
memoryTimer.unref();
async function progress(phase, details = {}) {
  const event = { stage: 'probe-progress', jobId: process.env.GLINT_JOB_ID, phase, ...details };
  console.log(JSON.stringify(event));
  try {
    await fetch(new URL('/event', upstream), {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    /* Local stdout still records the last reached stage. */
  }
}
const server = createServer((req, res) => {
  if (req.url === '/probe.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      '<!doctype html><title>Card renderer Windows shader probe</title><h1>Windows shader probe</h1><p id="status">Preparing…</p>',
    );
    return;
  }
  if (!req.url?.startsWith('/sdk/') && req.url !== '/payload/stress-scene.mjs') {
    res.writeHead(404);
    res.end();
    return;
  }
  const proxy = httpRequest(
    new URL(req.url, upstream),
    { headers: { Authorization: 'Bearer ' + token } },
    (response) => {
      res.writeHead(response.statusCode, {
        'Content-Type': response.headers['content-type'] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      response.pipe(res);
    },
  );
  proxy.on('error', () => {
    res.writeHead(502);
    res.end('VM asset transport unavailable');
  });
  proxy.end();
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const flags =
  backend === 'warp'
    ? ['--use-gl=angle', '--use-angle=d3d11-warp', '--enable-features=AllowD3D11WarpFallback']
    : backend === 'swiftshader'
      ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
      : [];
let browser, timer;
try {
  await progress('launch');
  const started = Date.now();
  browser = await (engine === 'firefox' ? firefox : chromium).launch({
    headless: process.env.GLINT_PROBE_HEADLESS === '1',
    ...(engine === 'msedge' ? { channel: 'msedge' } : {}),
    ...(engine === 'firefox'
      ? {
          firefoxUserPrefs:
            backend === 'warp'
              ? { 'webgl.force-enabled': true, 'webgl.angle.force-warp': true }
              : {},
        }
      : { args: flags, chromiumSandbox: platform() === 'win32' }),
    timeout: 60000,
  });
  report.launchMs = Date.now() - started;
  report.browserVersion = browser.version();
  report.headless = process.env.GLINT_PROBE_HEADLESS === '1';
  report.chromiumSandboxRequested = engine !== 'firefox' && platform() === 'win32';
  await progress('browser-launched', { browserVersion: report.browserVersion });
  if (engine !== 'firefox') {
    const session = await browser.newBrowserCDPSession();
    try {
      await progress('query-gpu-info');
      const info = await session.send('SystemInfo.getInfo');
      report.gpuInfo = {
        devices: info.gpu.devices,
        renderer: info.gpu.auxAttributes?.glRenderer,
        gpuProcessSandboxed: info.gpu.auxAttributes?.sandboxed ?? null,
        featureStatus: info.gpu.featureStatus,
      };
    } finally {
      await session.detach();
    }
  }
  const page = await browser.newPage({ viewport: { width: 900, height: 850 } });
  page.on('pageerror', (error) => report.errors.push(error.message));
  page.on('console', (message) => {
    if (['warning', 'error'].includes(message.type()) && report.console.length < 40)
      report.console.push({ type: message.type(), text: message.text().slice(0, 2000) });
  });
  page.on('crash', () => report.errors.push('Browser page crashed'));
  await page.exposeFunction('recordStep', async (row) => {
    report.rows.push(row);
    await progress('finish', row);
  });
  await page.exposeFunction('recordAdapter', (identity) => {
    if (identity.renderer) {
      const expected = backend === 'warp' ? /basic render driver|warp/i : /swiftshader/i;
      if (backend !== 'default' && !expected.test(identity.renderer))
        throw Error('Requested software backend was not selected: ' + identity.renderer);
    }
    return progress('adapter', identity);
  });
  await page.goto(base + '/probe.html');
  await progress('page-evaluation');
  const run = page.evaluate(
    async ({ quality, stress, stressProfile }) => {
      const probe = document.createElement('canvas'),
        gl = probe.getContext('webgl2');
      if (!gl) return { supported: false };
      const debug = gl.getExtension('WEBGL_debug_renderer_info'),
        identity = {
          renderer: debug
            ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER),
          vendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
          version: gl.getParameter(gl.VERSION),
          parallelCompile: Boolean(gl.getExtension('KHR_parallel_shader_compile')),
        };
      await window.recordAdapter(identity);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      const { createRenderer, IDENTITY } = await import('/sdk/browser.js');
      if (stress) {
        const { runStress } = await import('/payload/stress-scene.mjs');
        return {
          supported: true,
          identity,
          ...(await runStress({ createRenderer, IDENTITY }, quality, stressProfile)),
        };
      }
      const canvas = document.createElement('canvas');
      canvas.width = 244;
      canvas.height = 340;
      document.body.append(canvas);
      const renderer = await createRenderer({
          canvas,
          wasmUrl: '/sdk/renderer_bg.wasm',
          finishQuality: quality,
          etching: 'rust',
        }),
        transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
      try {
        renderer.upsertCards([
          {
            id: 1,
            revision: 1,
            recipe: {
              pack: 'windows-shader-probe',
              color: {
                key: 'original-gradient-v1',
                size: [244, 340],
                async paint() {
                  const c = document.createElement('canvas');
                  c.width = 244;
                  c.height = 340;
                  const p = c.getContext('2d'),
                    g = p.createLinearGradient(0, 0, 244, 340);
                  g.addColorStop(0, '#124080');
                  g.addColorStop(1, '#e8b851');
                  p.fillStyle = g;
                  p.fillRect(0, 0, 244, 340);
                  p.fillStyle = '#ece4cd';
                  p.fillRect(20, 180, 204, 130);
                  p.fillStyle = '#17212b';
                  p.font = '16px sans-serif';
                  p.fillText('Shader test', 28, 210);
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
        for (const finish of [
          'regular',
          'gloss',
          'etched',
          'prismatic',
          'cold',
          'holofoil',
          'opal',
          'rain',
          'heat',
          'pool',
        ]) {
          document.querySelector('#status').textContent = 'Preparing ' + finish;
          const instance = {
            id: 1,
            card: 1,
            transform,
            normal: [0, 0, 1],
            finish,
            printDots: { amount: 0.35, artwork: false },
            cardstock: { amount: 0.2 },
          };
          const start = performance.now();
          renderer.updateScene([instance]);
          await renderer.ready(1, 1);
          const prepared = performance.now();
          renderer.render({ viewProjection: IDENTITY, lighting: 'studio', time: 0.2 });
          const submitted = performance.now();
          const before = renderer.metrics;
          for (const time of [0.3, 0.4])
            renderer.render({ viewProjection: IDENTITY, lighting: 'studio', time });
          const after = renderer.metrics;
          if (
            after.compositions !== before.compositions ||
            after.maskBuilds !== before.maskBuilds ||
            after.uploads !== before.uploads
          )
            throw Error('Static resources rebuilt during motion: ' + finish);
          const captureStart = performance.now(),
            blob = await renderer.exportCard(1, {
              revision: 1,
              width: 244,
              finish,
              lighting: 'studio',
              normal: [0, 0, 1],
              printDots: instance.printDots,
              cardstock: instance.cardstock,
            });
          const bitmap = await createImageBitmap(blob),
            capture = document.createElement('canvas');
          capture.width = bitmap.width;
          capture.height = bitmap.height;
          capture.getContext('2d').drawImage(bitmap, 0, 0);
          bitmap.close();
          const bytes = capture
            .getContext('2d')
            .getImageData(0, 0, capture.width, capture.height).data;
          let opaque = 0;
          for (let i = 3; i < bytes.length; i += 4) if (bytes[i] > 240) opaque++;
          if (opaque < capture.width * capture.height * 0.8)
            throw Error('Incomplete exported card: ' + finish);
          const row = {
            finish,
            selectedQuality: renderer.finishQuality,
            readyMs: prepared - start,
            submitMs: submitted - prepared,
            captureMs: performance.now() - captureStart,
            opaquePixels: opaque,
            compositions: after.compositions,
            maskBuilds: after.maskBuilds,
            pending: after.pending,
            gpuBytes: after.gpu.bytes,
          };
          capture.width = capture.height = 0;
          await window.recordStep(row);
        }
        document.querySelector('#status').textContent = 'All finish checks completed';
        return { supported: true, identity, selectedQuality: renderer.finishQuality };
      } finally {
        renderer.dispose();
      }
    },
    { quality, stress, stressProfile },
  );
  const result = await Promise.race([
    run,
    new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(Error('Probe exceeded its evaluation deadline')),
        evaluationBudgetMs,
      );
    }),
  ]);
  Object.assign(report, result);
  if (!result.supported) process.exitCode = 2;
  if (report.errors.length) process.exitCode = 1;
} catch (error) {
  report.error = error.message;
  process.exitCode = 1;
} finally {
  clearInterval(memoryTimer);
  clearTimeout(timer);
  console.log(
    JSON.stringify({ stage: 'report', ...report, completedAt: new Date().toISOString() }),
  );
  await progress('report', { report });
  if (browser) {
    await progress('closing-browser');
    await browser.close();
    await progress('browser-closed');
  }
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  await progress('probe-complete');
}
