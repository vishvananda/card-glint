import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
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
  await page.route('**/gpu-readiness.html', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>GPU readiness</title>' }),
  );
  await page.goto(new URL('gpu-readiness.html', server.resolvedUrls.local[0]).href);
  const result = await page.evaluate(async () => {
    const { createRenderer, IDENTITY } = await import('/packages/browser/src/index.ts');
    const check = (ok, m) => {
      if (!ok) throw Error(m);
    };
    const rejected = async (p, label) => {
      try {
        await p;
      } catch (e) {
        check(e.name === 'AbortError', label + ' reason: ' + e);
        return;
      }
      throw Error(label + ' resolved');
    };
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 44;
    let invalidations = 0;
    const renderer = await createRenderer({ canvas, invalidate: () => invalidations++ });
    const gl = canvas.getContext('webgl2'),
      originalExtension = gl.getExtension.bind(gl),
      originalParameter = gl.getProgramParameter.bind(gl);
    let allow = false,
      polls = 0,
      links = 0;
    gl.getExtension = (name) =>
      name === 'KHR_parallel_shader_compile'
        ? { COMPLETION_STATUS_KHR: 0x91b1 }
        : originalExtension(name);
    gl.getProgramParameter = (p, key) => {
      if (key === 0x91b1) {
        polls++;
        return allow;
      }
      if (key === gl.LINK_STATUS) {
        check(allow, 'Link queried before readiness');
        links++;
      }
      return originalParameter(p, key);
    };
    const doc = (revision) => ({
      id: 1,
      revision,
      recipe: {
        pack: 'readiness',
        color: {
          key: 'readiness-color',
          size: [32, 44],
          async paint() {
            const c = document.createElement('canvas');
            c.width = 32;
            c.height = 44;
            const g = c.getContext('2d');
            g.fillStyle = '#69839a';
            g.fillRect(0, 0, 32, 44);
            return c;
          },
        },
        edges: [],
        artWindows: [],
        cornerRadius: 0.04,
        regions: [],
      },
    });
    const instance = (finish) => ({
      id: 1,
      card: 1,
      finish,
      transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
    });
    const waitPoll = async () => {
      const deadline = performance.now() + 10000,
        start = polls;
      while (polls === start) {
        check(performance.now() < deadline, 'Compiler poll timeout');
        await new Promise((r) => setTimeout(r, 2));
      }
    };
    try {
      renderer.upsertCards([doc(1)]);
      const aborted = new AbortController();
      aborted.abort();
      await rejected(renderer.ready(1, 1, aborted.signal), 'Already aborted caller');
      renderer.updateScene([instance('gloss')]);
      const wait = renderer.ready(1, 1);
      await waitPoll();
      renderer.updateScene([instance('heat')]);
      allow = true;
      await wait;
      check(links >= 2, 'Readiness ignored a scene change during compilation');
      check(
        renderer.render({ viewProjection: IDENTITY, time: 1 }).draws === 1,
        'Latest scene not ready',
      );
      allow = false;
      renderer.updateScene([instance('prismatic')]);
      const caller = new AbortController();
      const canceled = renderer.ready(1, 1, caller.signal);
      const caught = rejected(canceled, 'Caller cancellation');
      await waitPoll();
      caller.abort();
      await caught;
      allow = true;
      await renderer.ready(1, 1);
      allow = false;
      renderer.updateScene([instance('cold')]);
      const superseded = rejected(renderer.ready(1, 1), 'Revision replacement');
      await waitPoll();
      renderer.upsertCards([doc(2)]);
      await superseded;
      allow = true;
      await renderer.ready(1, 2);
      allow = false;
      renderer.updateScene([instance('opal')]);
      const disposed = rejected(renderer.ready(1, 2), 'Renderer disposal');
      await waitPoll();
      renderer.dispose();
      await disposed;
      const before = invalidations;
      allow = true;
      await new Promise((r) => setTimeout(r, 20));
      check(before === invalidations, 'Disposed device invalidated host');
      return { polls, links, invalidations };
    } finally {
      renderer.dispose();
    }
  });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
  await server.close();
}
