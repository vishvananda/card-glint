import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
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
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  const url = new URL('host-printing-regression.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Host printing</title>',
    }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const { FinishResources, PRINT_DOTS_GLSL, CARDSTOCK_GLSL } = await import(
      '/packages/browser/src/finish.ts'
    );
    const check = (condition, label) => {
      if (!condition) throw Error(label);
    };
    const compare = (actual, expected, tolerance, label) => {
      check(actual.length === expected.length, `${label}: byte length`);
      let max = 0;
      for (let i = 0; i < actual.length; i++) {
        max = Math.max(max, Math.abs(actual[i] - expected[i]));
        if (max > tolerance)
          throw Error(`${label}: byte ${i}, actual ${actual[i]}, expected ${expected[i]}`);
      }
      return max;
    };
    const rejects = (action, label) => {
      let rejected = false;
      try {
        action();
      } catch {
        rejected = true;
      }
      check(rejected, `${label}: must reject`);
    };
    const source = document.createElement('canvas');
    source.width = 63;
    source.height = 47;
    const context = source.getContext('2d');
    const fixture = context.createImageData(source.width, source.height);
    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        const i = (y * source.width + x) * 4;
        fixture.data.set(
          [
            (x * 7 + y * 3) % 256,
            (x * 3 + y * 11) % 256,
            (x * 13 + y) % 256,
            [0, 85, 170, 255][Math.floor(x / 9) % 4],
          ],
          i,
        );
      }
    }
    context.putImageData(fixture, 0, 0);
    const resources = new FinishResources();
    const live = {
      Texture: new Set(),
      Framebuffer: new Set(),
      Program: new Set(),
      VertexArray: new Set(),
    };
    const original = [];
    for (const [kind, objects] of Object.entries(live)) {
      for (const verb of ['create', 'delete']) {
        const name = `${verb}${kind}`;
        const method = WebGL2RenderingContext.prototype[name];
        original.push([name, method]);
        WebGL2RenderingContext.prototype[name] = function (...args) {
          const value = method.apply(this, args);
          if (verb === 'create') objects.add(value);
          else objects.delete(args[0]);
          return value;
        };
      }
    }
    let printed, stock;
    const invalidProfiles = [
      null,
      undefined,
      { artwork: 'no' },
      { amount: NaN },
      { amount: Infinity },
      { amount: -0.1 },
      { amount: 1.1 },
      { amount: 1, period: 1.9 },
      { amount: 1, period: 16.1 },
      { amount: 1, period: NaN },
      { amount: 1, variation: -0.1 },
      { amount: 1, variation: 1.1 },
      { amount: 1, variation: Infinity },
      { amount: 1, inset: -0.1 },
      { amount: 1, inset: 0.21 },
      { amount: 1, inset: NaN },
    ];
    try {
      for (const profile of invalidProfiles)
        rejects(() => resources.printDots(source, source.width, source.height, profile), 'profile');
      for (const [width, height] of [
        [0, 47],
        [63, 0],
        [-1, 47],
        [63.5, 47],
        [63, NaN],
        [Infinity, 47],
        [62, 47],
        [63, 46],
        [4096, 2048],
        [2147483647, 1],
      ])
        rejects(() => resources.printDots(source, width, height, { amount: 1 }), 'dimensions');
      for (const objects of Object.values(live))
        check(objects.size === 0, 'Invalid input allocates nothing');
      printed = resources.printDots(source, source.width, source.height, { amount: 0 });
      check(live.Texture.size === 0, 'One-shot printing retains no input or output textures');
      const readPixels = WebGL2RenderingContext.prototype.readPixels;
      const framebufferCount = live.Framebuffer.size;
      try {
        WebGL2RenderingContext.prototype.readPixels = function () {
          throw Error('Injected snapshot failure');
        };
        rejects(
          () => resources.printDots(source, source.width, source.height, { amount: 1 }),
          'Failed snapshot',
        );
      } finally {
        WebGL2RenderingContext.prototype.readPixels = readPixels;
      }
      check(live.Texture.size === 0, 'Failed snapshot releases temporary textures');
      check(live.Framebuffer.size === framebufferCount, 'Failed snapshot releases its framebuffer');
      resources.printDots(source, source.width, source.height, { amount: 1 });
      check(live.Texture.size === 0, 'Printing recovers after a failed snapshot');
      stock = resources.cardstock();
      check(resources.cardstock() === stock, 'Cardstock returns the same prepared object');
      check(resources.cardstock().data === stock.data, 'Cardstock reuses the same bytes');
      check(live.Texture.size === 1, 'Only the reusable cardstock texture remains');
    } finally {
      resources.dispose();
      resources.dispose();
      for (const [name, method] of original) WebGL2RenderingContext.prototype[name] = method;
    }
    for (const objects of Object.values(live))
      check(objects.size === 0, 'Disposal releases GPU objects');
    rejects(
      () => resources.printDots(source, source.width, source.height, { amount: 1 }),
      'Disposed printing',
    );
    rejects(() => resources.cardstock(), 'Disposed cardstock');
    check(
      printed.width === source.width && printed.height === source.height,
      'Printing dimensions',
    );
    const straight = context.getImageData(0, 0, source.width, source.height).data;
    const bottomUp = new Uint8Array(straight.length);
    for (let y = 0; y < source.height; y++)
      bottomUp.set(
        straight.subarray(y * source.width * 4, (y + 1) * source.width * 4),
        (source.height - y - 1) * source.width * 4,
      );
    const zeroError = compare(
      printed.data,
      bottomUp,
      1,
      'Amount zero preserves orientation, sRGB and straight alpha',
    );
    check(
      !performance.getEntriesByType('resource').some((entry) => /\.wasm(?:\?|$)/.test(entry.name)),
      'Standalone printDots/cardstock must not initialize WASM',
    );

    // Native TextureStore needs WASM, but only after the standalone API checks above.
    const { initializeRenderer } = await import('/packages/browser/src/renderer.ts');
    const { TextureStore } = await import('/packages/browser/src/gpu/textures.ts');
    const { PrintedInk } = await import('/packages/browser/src/gpu/printed-ink.ts');
    const { Cardstock } = await import('/packages/browser/src/gpu/cardstock.ts');
    await initializeRenderer();
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { antialias: false });
    check(gl, 'WebGL2 native reference');
    const textures = new TextureStore(gl, 16 * 1024 * 1024, 8 * 1024 * 1024);
    const ink = new PrintedInk(gl);
    const cardstock = new Cardstock(gl);
    const hostResources = new FinishResources();
    const bitmap = await createImageBitmap(source);
    const framebuffer = gl.createFramebuffer();
    const vao = gl.createVertexArray();
    const read = (texture, width, height) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      check(
        gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE,
        'Read framebuffer',
      );
      const bytes = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return bytes;
    };
    const upload = (map, srgb) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        srgb ? gl.SRGB8_ALPHA8 : gl.RGBA8,
        map.width,
        map.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        map.data,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      return texture;
    };
    const vertex = `#version 300 es
out vec2 uv;flat out vec4 printDotsInfo;flat out float cardstockAmount;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;
printDotsInfo=vec4(0.,5.,.5,0.);cardstockAmount=.35;gl_Position=vec4(p*2.-1.,0.,1.);}`;
    const fragment = `#version 300 es
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;uniform vec2 pointer;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${PRINT_DOTS_GLSL}
${CARDSTOCK_GLSL}
void main(){printFootprint=1./5.;vec4 ink=printFace(uv);
color=vec4(cardstockGloss(uv,ink.rgb,ink.rgb*.6+vec3(.15)),ink.a);}`;
    const program = gl.createProgram();
    const shaders = [];
    try {
      for (const [kind, text] of [
        [gl.VERTEX_SHADER, vertex],
        [gl.FRAGMENT_SHADER, fragment],
      ]) {
        const shader = gl.createShader(kind);
        shaders.push(shader);
        gl.shaderSource(shader, text);
        gl.compileShader(shader);
        check(gl.getShaderParameter(shader, gl.COMPILE_STATUS), gl.getShaderInfoLog(shader));
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      check(gl.getProgramParameter(program, gl.LINK_STATUS), gl.getProgramInfoLog(program));
      const render = (face, stockTexture, width, height) => {
        const target = gl.createTexture();
        try {
          gl.bindTexture(gl.TEXTURE_2D, target);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA8,
            width,
            height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
          );
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target, 0);
          check(
            gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE,
            'Host framebuffer',
          );
          gl.useProgram(program);
          gl.bindVertexArray(vao);
          gl.viewport(0, 0, width, height);
          gl.disable(gl.BLEND);
          gl.disable(gl.DITHER);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, face);
          gl.uniform1i(gl.getUniformLocation(program, 'face'), 0);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, stockTexture);
          gl.uniform1i(gl.getUniformLocation(program, 'cardstockMap'), 1);
          gl.uniform2f(gl.getUniformLocation(program, 'pointer'), 0.23, 0.71);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          return read(target, width, height);
        } finally {
          gl.deleteTexture(target);
        }
      };
      cardstock.prepare();
      check(
        stock.width === cardstock.width && stock.height === cardstock.height,
        'Cardstock native dimensions',
      );
      compare(
        stock.data,
        read(cardstock.map, stock.width, stock.height),
        0,
        'All four native slope bytes',
      );
      check(
        stock.data.some((value, i) => i % 4 === 3 && value < 250),
        'Slope alpha contains data',
      );
      compare(hostResources.cardstock().data, stock.data, 0, 'Cardstock across contexts');
      const hostStock = upload(stock, false);
      let comparisons = 0;
      try {
        for (const [name, input] of [
          ['canvas', source],
          ['bitmap', bitmap],
        ]) {
          const lease = textures.upload(name, input);
          try {
            for (const profile of [
              { amount: 0 },
              { amount: 0.7, period: 2 },
              { amount: 1, period: 3.5, variation: 1 },
              { amount: 0.6 },
              { amount: 1, period: 16, variation: 0, inset: 0.2 },
            ]) {
              const native = ink.prepare(lease.value, undefined, profile);
              const passes = ink.passes;
              check(
                ink.prepare(lease.value, undefined, profile) === native && ink.passes === passes,
                'Native printing cache remains reusable',
              );
              const map = hostResources.printDots(input, source.width, source.height, profile);
              compare(
                map.data,
                read(native.face.texture, source.width, source.height),
                0,
                `${name}, ${JSON.stringify(profile)} native preparation`,
              );
              if (profile.amount > 0 && ((profile.period ?? 2) * source.width) / 732 > 1 / 0.9)
                check(
                  map.data.some((value, i) => i % 4 !== 3 && value !== printed.data[i]),
                  'Nonzero printing changes the asymmetric color fixture',
                );
              for (let i = 3; i < map.data.length; i += 4)
                check(map.data[i] === bottomUp[i], 'Printing preserves nonopaque alpha');
              const hostFace = upload(map, true);
              try {
                for (const [width, height] of [
                  [63, 47],
                  [13, 9],
                ]) {
                  compare(
                    render(hostFace, hostStock, width, height),
                    render(native.face.texture, cardstock.map, width, height),
                    0,
                    `${name}, period ${profile.period ?? 5}, host shader ${width}x${height}`,
                  );
                  comparisons++;
                }
              } finally {
                gl.deleteTexture(hostFace);
              }
            }
          } finally {
            lease.release();
          }
        }
      } finally {
        gl.deleteTexture(hostStock);
      }
      check(gl.getError() === gl.NO_ERROR, 'No WebGL errors');
      return {
        zeroError,
        comparisons,
        invalidProfiles: invalidProfiles.length,
        stockBytes: stock.data.length,
      };
    } finally {
      for (const shader of shaders) gl.deleteShader(shader);
      gl.deleteProgram(program);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteVertexArray(vao);
      bitmap.close();
      hostResources.dispose();
      ink.dispose();
      cardstock.dispose();
      textures.dispose();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  assert.deepEqual(errors, [], 'Unexpected browser errors');
  console.log(
    'PASS host printing native pixels, fine-screen filtering, raw cardstock reuse, GLSL and lifecycle.',
    result,
  );
} finally {
  try {
    await browser?.close();
  } finally {
    await server.close();
  }
}
