import { chromium } from 'playwright';
import { createServer } from 'vite';
import assert from 'node:assert/strict';

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.route('**/host-finish-textures.html', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>GPU preparation</title>',
    }),
  );
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/host-finish-textures.html`);
  const result = await page.evaluate(async () => {
    const { FinishTextures, FinishResources } = await import('/packages/browser/src/finish.ts');
    const { program } = await import('/packages/browser/src/gpu/etcher.js');
    const check = (condition, message) => {
      if (!condition) throw Error(message);
    };
    const rejects = (operation, message) => {
      let rejected = false;
      try {
        operation();
      } catch {
        rejected = true;
      }
      check(rejected, message);
    };
    const waitFor = async (event, label) => {
      let timeout;
      try {
        await Promise.race([
          event,
          new Promise((_, reject) => {
            timeout = setTimeout(() => reject(Error(label + ' timeout')), 10000);
          }),
        ]);
      } finally {
        clearTimeout(timeout);
      }
    };
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { antialias: false });
    check(gl, 'WebGL2');
    const live = Object.fromEntries(
      ['Texture', 'Program', 'Framebuffer', 'VertexArray', 'Sampler'].map((name) => [
        name,
        new Set(),
      ]),
    );
    for (const [kind, objects] of Object.entries(live)) {
      const create = gl[`create${kind}`].bind(gl),
        remove = gl[`delete${kind}`].bind(gl);
      gl[`create${kind}`] = (...args) => {
        const object = create(...args);
        if (object) objects.add(object);
        return object;
      };
      gl[`delete${kind}`] = (object) => {
        objects.delete(object);
        return remove(object);
      };
    }
    const width = 732,
      height = 93;
    const bytes = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        bytes.set([(x * 17) % 256, (y * 13) % 256, (x + y) % 256, [0, 85, 170, 255][x % 4]], i);
      }
    const source = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, source);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.SRGB8_ALPHA8,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      bytes,
    );
    // Host filtering differs deliberately; preparation supplies its own sampler.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const array = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, array);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.SRGB8_ALPHA8, width, height, 2);
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      1,
      width,
      height,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      bytes,
    );
    const snapshotFramebuffer = gl.createFramebuffer();
    const read = (map, level = 0) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, snapshotFramebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        map.texture,
        level,
      );
      check(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE, 'Complete mip');
      const w = Math.max(1, map.width >> level),
        h = Math.max(1, map.height >> level);
      const data = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return data;
    };
    const compare = (actual, expected, message) => {
      check(actual.length === expected.length, message + ' size');
      let maximum = 0;
      actual.forEach((value, i) => (maximum = Math.max(maximum, Math.abs(value - expected[i]))));
      check(maximum === 0, message + ': maximum error ' + maximum);
    };
    const hostProgram = program(
      gl,
      '#version 300 es\nprecision highp float;out vec4 color;void main(){color=vec4(1.);}',
      '#version 300 es\nvoid main(){gl_Position=vec4(0.);}',
    );
    const vao = gl.createVertexArray(),
      readFramebuffer = gl.createFramebuffer(),
      drawFramebuffer = gl.createFramebuffer(),
      sampler = gl.createSampler(),
      unpack = gl.createBuffer();
    const caps = [
      gl.BLEND,
      gl.CULL_FACE,
      gl.DEPTH_TEST,
      gl.DITHER,
      gl.SCISSOR_TEST,
      gl.STENCIL_TEST,
      gl.RASTERIZER_DISCARD,
      gl.SAMPLE_ALPHA_TO_COVERAGE,
      gl.SAMPLE_COVERAGE,
    ];
    const establish = () => {
      gl.useProgram(hostProgram);
      gl.bindVertexArray(vao);
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, readFramebuffer);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, drawFramebuffer);
      gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, unpack);
      gl.viewport(7, 11, 29, 31);
      gl.scissor(3, 5, 13, 17);
      gl.colorMask(false, true, false, true);
      caps.forEach((cap, i) => (i % 2 ? gl.disable(cap) : gl.enable(cap)));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, source);
      gl.bindSampler(0, sampler);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, source);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, array);
    };
    const parameters = [
      gl.ACTIVE_TEXTURE,
      gl.CURRENT_PROGRAM,
      gl.VERTEX_ARRAY_BINDING,
      gl.READ_FRAMEBUFFER_BINDING,
      gl.DRAW_FRAMEBUFFER_BINDING,
      gl.PIXEL_UNPACK_BUFFER_BINDING,
      gl.VIEWPORT,
      gl.SCISSOR_BOX,
      gl.COLOR_WRITEMASK,
      gl.TEXTURE_BINDING_2D,
      gl.TEXTURE_BINDING_2D_ARRAY,
    ];
    const state = () => {
      const values = parameters.map((parameter) => gl.getParameter(parameter));
      values.push(...caps.map((cap) => gl.isEnabled(cap)));
      gl.activeTexture(gl.TEXTURE0);
      values.push(gl.getParameter(gl.TEXTURE_BINDING_2D), gl.getParameter(gl.SAMPLER_BINDING));
      gl.activeTexture(values[0]);
      return values;
    };
    const equalState = (before) => {
      state().forEach((value, i) => {
        const expected = before[i];
        check(
          ArrayBuffer.isView(value) || Array.isArray(value)
            ? String(value) === String(expected)
            : value === expected,
          'Restored GL state ' + i,
        );
      });
    };
    let contextCalls = 0,
      readbacks = 0;
    const getContext = HTMLCanvasElement.prototype.getContext,
      readPixels = gl.readPixels;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      contextCalls++;
      return getContext.apply(this, args);
    };
    gl.readPixels = function (...args) {
      readbacks++;
      return readPixels.apply(this, args);
    };
    establish();
    const before = state();
    const textures = new FinishTextures(gl);
    const results = [];
    try {
      for (const settings of [{ amount: 0 }, {}, { period: 5, amount: 1, artwork: false }]) {
        const windows = [[0.1, 0.2, 0.4, 0.5]];
        const map = textures.printDots({ texture: source, width, height }, settings, windows);
        equalState(before);
        const layerMap = textures.printDots(
          { texture: array, width, height, layer: 1 },
          settings,
          windows,
        );
        equalState(before);
        results.push({ map, layerMap, settings, windows });
      }
      const stock = textures.cardstock();
      check(textures.cardstock() === stock, 'Shared cardstock descriptor');
      equalState(before);
      check(contextCalls === 0 && readbacks === 0, 'No extra contexts or readPixels');
      check(live.Program.size === 3, 'One reusable program per preparation feature');
      const count = Object.values(live).reduce((sum, objects) => sum + objects.size, 0);
      for (const operation of [
        () => textures.printDots({ texture: source, width: 0, height }),
        () => textures.printDots({ texture: source, width, height }, { period: 1 }),
        () => textures.printDots({ texture: source, width, height }, {}, [[0, 0, -1, 1]]),
        () => textures.printDots({ texture: array, width, height, layer: -1 }),
        () => textures.printDots({ texture: null, width, height }),
      ])
        rejects(operation, 'Invalid input');
      check(
        Object.values(live).reduce((sum, objects) => sum + objects.size, 0) === count,
        'Invalid input allocates nothing',
      );
      equalState(before);
      const query = gl.createQuery();
      gl.beginQuery(gl.ANY_SAMPLES_PASSED, query);
      rejects(() => textures.printDots({ texture: source, width, height }), 'Active query');
      equalState(before);
      check(gl.getQuery(gl.ANY_SAMPLES_PASSED, gl.CURRENT_QUERY) === query, 'Host query preserved');
      gl.endQuery(gl.ANY_SAMPLES_PASSED);
      gl.deleteQuery(query);
      rejects(
        () => textures.printDots({ texture: array, width, height, layer: 2 }),
        'Unallocated array layer',
      );
      equalState(before);
      check(
        Object.values(live).reduce((sum, objects) => sum + objects.size, 0) === count,
        'Invalid layer releases scratch resources',
      );
      const drawArrays = gl.drawArrays;
      try {
        gl.drawArrays = () => {
          throw Error('Injected preparation failure');
        };
        rejects(
          () => textures.printDots({ texture: array, width, height, layer: 1 }),
          'Failed preparation',
        );
      } finally {
        gl.drawArrays = drawArrays;
      }
      equalState(before);
      check(
        Object.values(live).reduce((sum, objects) => sum + objects.size, 0) === count,
        'Failed preparation releases textures',
      );
      check(gl.getError() === gl.NO_ERROR, 'Preparation emits no GL errors');
      // Compare against the existing public native pass, including alpha and row orientation.
      HTMLCanvasElement.prototype.getContext = getContext;
      gl.readPixels = readPixels;
      gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);
      caps.forEach((cap) => gl.disable(cap));
      // Canvas premultiplication can round low-alpha RGB: use the exact resident bytes
      // for native parity by calling the same native GPU painter directly.
      const { PrintedInk } = await import('/packages/browser/src/gpu/printed-ink.ts');
      const { printDotValues } = await import('/packages/browser/src/print-settings.ts');
      const ink = new PrintedInk(gl);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindSampler(0, null);
      gl.bindTexture(gl.TEXTURE_2D, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      try {
        for (const { map, layerMap, settings, windows } of results) {
          const native = ink.paint(
            { texture: source, width, height },
            printDotValues(settings),
            windows,
            settings.artwork !== false,
          );
          compare(read(map), read(native), 'Native printing parity');
          compare(read(layerMap), read(map), 'Array-layer parity');
          compare(read(map, 1), read(native, 1), 'Native mip parity');
          compare(read(map, 9), read(native, 9), 'Last mip parity');
          gl.deleteTexture(native.texture);
        }
      } finally {
        ink.dispose();
      }
      const resources = new FinishResources();
      compare(read(stock), resources.cardstock().data, 'Native packed-slope parity');
      resources.dispose();
      textures.dispose();
      textures.dispose();
      check(!gl.isTexture(stock.texture), 'Owner releases shared cardstock');
      for (const { map, layerMap } of results) {
        check(
          gl.isTexture(map.texture) && gl.isTexture(layerMap.texture),
          'Caller owns printing after helper disposal',
        );
        gl.deleteTexture(map.texture);
        gl.deleteTexture(layerMap.texture);
      }
      check(gl.isTexture(source) && gl.isTexture(array), 'Source textures remain host-owned');
      rejects(() => textures.cardstock(), 'Disposed owner');
      gl.deleteProgram(hostProgram);
      gl.deleteVertexArray(vao);
      gl.deleteFramebuffer(readFramebuffer);
      gl.deleteFramebuffer(drawFramebuffer);
      gl.deleteFramebuffer(snapshotFramebuffer);
      gl.deleteSampler(sampler);
      gl.deleteBuffer(unpack);
      gl.deleteTexture(source);
      gl.deleteTexture(array);
      for (const [kind, objects] of Object.entries(live))
        check(objects.size === 0, 'Released ' + kind);
      check(gl.getError() === gl.NO_ERROR, 'No GL errors after validation');
      const recovered = new FinishTextures(gl);
      const extension = gl.getExtension('WEBGL_lose_context');
      check(extension, 'Context loss extension');
      const lost = new Promise((resolve) =>
        canvas.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault();
            resolve();
          },
          { once: true },
        ),
      );
      extension.loseContext();
      rejects(() => recovered.cardstock(), 'Lost context');
      await waitFor(lost, 'Context loss');
      const restored = new Promise((resolve) =>
        canvas.addEventListener('webglcontextrestored', resolve, { once: true }),
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      extension.restoreContext();
      await waitFor(restored, 'Context restoration');
      rejects(() => recovered.cardstock(), 'Restored context requires new owner');
      recovered.dispose();
      const fresh = new FinishTextures(gl);
      check(gl.isTexture(fresh.cardstock().texture), 'Fresh owner works after restoration');
      fresh.dispose();
      return { profiles: results.length, extraContexts: contextCalls, readbacks };
    } finally {
      HTMLCanvasElement.prototype.getContext = getContext;
      gl.readPixels = readPixels;
      textures.dispose();
    }
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(result, { profiles: 3, extraContexts: 0, readbacks: 0 });
  console.log(
    'Host GPU finish textures: native/mip/array parity, state, ownership, failures and context recovery passed.',
  );
} finally {
  await browser.close();
  await server.close();
}
