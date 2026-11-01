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
const deadline = setTimeout(() => void browser.close(), 120000);
try {
  const page = await browser.newPage(),
    errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/printing-programs.html', (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Printing programs</title>',
    }),
  );
  await page.goto(new URL('printing-programs.html', server.resolvedUrls.local[0]).href);
  const result = await page.evaluate(async () => {
    const { Device } = await import('/packages/browser/src/gpu/device.ts');
    const { invisiblePrinting } = await import('/packages/browser/src/gpu/printed-ink.ts');
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 88;
    const device = new Device(canvas, undefined, undefined, 'reduced'),
      gl = device.gl;
    const sources = [],
      deleted = [];
    const shaderSource = gl.shaderSource.bind(gl);
    gl.shaderSource = (shader, source) => {
      sources.push(source);
      shaderSource(shader, source);
    };
    const deleteTexture = gl.deleteTexture.bind(gl);
    gl.deleteTexture = (t) => {
      deleted.push(t);
      deleteTexture(t);
    };
    const makeTexture = (width, height) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      return { texture, width, height, mipmapped: true };
    };
    const face = makeTexture(122, 170),
      mask = makeTexture(1, 1),
      overlay = makeTexture(488, 680);
    const recipe = {
      pack: 'printing-probe',
      color: { key: 'unused', size: [122, 170], paint: async () => canvas },
      edges: [],
      artWindows: [],
      regions: [],
      cornerRadius: 0.045,
    };
    const material = { face, mask, recipe, hologramSettings: '' };
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    const frame = { viewProjection: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] };
    const instance = {
      id: 1,
      card: 1,
      transform,
      finish: 'prismatic',
      printDots: { amount: 0.35, period: 2 },
    };
    const check = (ok, message) => {
      if (!ok) throw Error(message);
    };
    const draw = (list) => {
      device.begin(frame);
      device.draw(material, frame, list);
      check(gl.getError() === gl.NO_ERROR, 'GL error');
    };
    try {
      check(
        invisiblePrinting(face, undefined, instance.printDots),
        'Small screen should be invisible',
      );
      check(
        !invisiblePrinting(face, overlay, instance.printDots),
        'Larger overlay still needs printing',
      );
      check(
        !invisiblePrinting({ ...face, mipmapped: false }, undefined, instance.printDots),
        'Unfiltered source cannot borrow a mip chain',
      );
      await device.prepare(material, [instance]);
      draw([instance]);
      check(sources.length === 2, 'Invisible printing compiled extra shaders');
      check(!device.printedInk, 'Invisible printing allocated an ink helper');
      check(
        ![...device.programs.keys()].some((k) => k.endsWith(':true')),
        'Invisible printing selected procedural material',
      );
      const visible = { ...instance, printDots: { amount: 0.35, period: 7 } };
      await device.prepare(material, [visible]);
      draw([visible]);
      const ink = device.printedInk,
        passes = ink.passes,
        compiles = sources.length;
      check(passes === 1, 'Visible printing was not cached');
      check(
        !device.programs.has('prismatic:false:true'),
        'Cached printing eagerly compiled an analytic fallback',
      );
      const plain = device.programs.get('prismatic:false:false').value;
      check(
        gl.getParameter(gl.CURRENT_PROGRAM) === plain,
        'Baked printing still uses procedural shader',
      );
      for (let i = 0; i < 4; i++) draw([visible]);
      check(
        ink.passes === passes && sources.length === compiles,
        'Warm printing did preparation work',
      );
      const mixed = [visible, { ...visible, id: 2, printDots: { amount: 0.35, period: 8 } }];
      await device.prepare(material, mixed);
      const mixedCompiles = sources.length;
      draw(mixed);
      check(
        gl.getParameter(gl.CURRENT_PROGRAM) === device.programs.get('prismatic:false:true').value,
        'Mixed printing lost its prepared fallback',
      );
      check(
        ink.passes === passes && sources.length === mixedCompiles,
        'Mixed printing thrashed the cache or compiled during draw',
      );
      // One printing can serve several finishes. An inactive entry must remain
      // protected if any of those finishes has no prepared fallback yet.
      const gloss = { ...visible, finish: 'gloss' };
      await device.prepare(material, [gloss]);
      const pressureCompiles = sources.length;
      check(!device.programs.has('gloss:false:true'), 'Cached second finish compiled a fallback');
      for (let i = 0; i < 3; i++) device.begin(frame);
      // A real working set larger than the 16 MiB printing cache must retain
      // its active entries, falling back without rebaking them on the next frame.
      const large = Array.from({ length: 10 }, () => ({
        ...material,
        face: makeTexture(488, 680),
      }));
      try {
        for (const m of large) await device.prepare(m, [visible]);
        const batch = () => {
          device.begin(frame);
          device.draw(material, frame, [gloss]);
          for (const m of large) device.draw(m, frame, [visible]);
          check(
            device.draws === large.length + 1,
            'Eviction skipped a ready face while compiling a fallback',
          );
        };
        batch();
        check(
          gl.getParameter(gl.CURRENT_PROGRAM) === device.programs.get('prismatic:false:true').value,
          'Cache pressure lost the prepared fallback',
        );
        const overflowPasses = ink.passes;
        batch();
        check(
          ink.passes === overflowPasses && sources.length === pressureCompiles,
          'Active printing working set thrashed under pressure',
        );
        check(gl.getError() === gl.NO_ERROR, 'Cache pressure GL error');
      } finally {
        for (const m of large) deleteTexture(m.face.texture);
      }
      device.dispose();
      check(!deleted.includes(face.texture), 'Borrowed printing source was deleted');
      return {
        invisibleShaderStages: 2,
        visiblePasses: passes,
        warmCompiles: sources.length - pressureCompiles,
      };
    } finally {
      device.dispose();
      for (const t of [face, mask, overlay]) deleteTexture(t.texture);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  assert.deepEqual(errors, []);
  assert.equal(result.warmCompiles, 0);
  console.log(JSON.stringify(result));
} finally {
  clearTimeout(deadline);
  await browser.close();
  await server.close();
}
