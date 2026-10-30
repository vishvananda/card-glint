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
  const url = new URL('host-mask-data.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Host R8 coverage</title>' }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const { FinishResources } = await import('/packages/browser/src/finish.ts');
    const resources = new FinishResources(),
      size = [4, 3],
      values = [0, 64, 128, 255, 255, 128, 64, 0, 17, 31, 79, 203];
    const raster = (key, alpha) => ({
      key,
      size,
      async paint() {
        const c = document.createElement('canvas');
        [c.width, c.height] = size;
        const ctx = c.getContext('2d'),
          p = ctx.createImageData(...size);
        alpha.forEach((v, i) => p.data.set([255, 255, 255, v], i * 4));
        ctx.putImageData(p, 0, 0);
        return c;
      },
    });
    const doc = {
      id: 1,
      revision: 1,
      recipe: {
        pack: 'original-mask-data-test',
        color: raster('color', values),
        stamp: raster('stamp', values),
        edges: [],
        artWindows: [],
        cornerRadius: 0,
        regions: [],
      },
    };
    const host = {
        async images() {
          throw Error('No image leases expected');
        },
      },
      signal = new AbortController().signal;
    try {
      const canvas = await resources.documentMask(doc, host, signal),
        rgba = canvas.getContext('2d').getImageData(0, 0, ...size).data;
      canvas.width = canvas.height = 0;
      const old = CanvasRenderingContext2D.prototype.getImageData;
      let map;
      try {
        CanvasRenderingContext2D.prototype.getImageData = () => {
          throw Error('R8 snapshot must not read a Canvas');
        };
        const prototype = WebGL2RenderingContext.prototype;
        const methods = [
          'readPixels',
          'fenceSync',
          'clientWaitSync',
          'getBufferSubData',
          'deleteBuffer',
          'deleteSync',
        ];
        const original = Object.fromEntries(methods.map((name) => [name, prototype[name]]));
        let fence,
          signaled = false,
          submitted = 0,
          copied = 0,
          deletedBuffers = 0,
          deletedFences = 0;
        let cancel,
          blocking = false;
        prototype.readPixels = function (...args) {
          if (typeof args[6] !== 'number' || !this.getParameter(this.PIXEL_PACK_BUFFER_BINDING))
            throw Error('Mask readback must target a PBO, not CPU memory');
          submitted++;
          if (cancel) setTimeout(() => cancel.abort(), 0);
          return original.readPixels.apply(this, args);
        };
        prototype.fenceSync = function (...args) {
          signaled = false;
          return (fence = original.fenceSync.apply(this, args));
        };
        prototype.clientWaitSync = function (...args) {
          if (args[2] !== 0) throw Error('Mask readback blocks on a GPU fence');
          if (blocking) return this.TIMEOUT_EXPIRED;
          const status = original.clientWaitSync.apply(this, args);
          if (
            args[0] === fence &&
            (status === this.ALREADY_SIGNALED || status === this.CONDITION_SATISFIED)
          )
            signaled = true;
          return status;
        };
        prototype.getBufferSubData = function (...args) {
          if (!signaled) throw Error('Mask bytes copied before fence completion');
          copied++;
          return original.getBufferSubData.apply(this, args);
        };
        prototype.deleteBuffer = function (...args) {
          deletedBuffers++;
          return original.deleteBuffer.apply(this, args);
        };
        prototype.deleteSync = function (...args) {
          deletedFences++;
          return original.deleteSync.apply(this, args);
        };
        try {
          map = await resources.documentMaskData(doc, host, signal);
          if (submitted !== 1 || copied !== 1 || deletedBuffers !== 1 || deletedFences !== 1)
            throw Error('Successful PBO readback leaks or repeats work');
          blocking = true;
          cancel = new AbortController();
          let rejected = false;
          try {
            await resources.documentMaskData(doc, host, cancel.signal);
          } catch (error) {
            rejected = error.name === 'AbortError';
          }
          if (!rejected || copied !== 1 || deletedBuffers !== 2 || deletedFences !== 2)
            throw Error('Aborted PBO readback copied bytes or leaked resources');
          blocking = false;
          cancel = undefined;
          const retry = await resources.documentMaskData(doc, host, signal);
          if (String(retry.data) !== String(map.data) || submitted !== 3 || copied !== 2)
            throw Error('Readback queue did not recover after cancellation');
        } finally {
          for (const name of methods) prototype[name] = original[name];
        }
      } finally {
        CanvasRenderingContext2D.prototype.getImageData = old;
      }
      const expected = [];
      for (let y = 2; y >= 0; y--) for (let x = 0; x < 4; x++) expected.push(rgba[(y * 4 + x) * 4]);
      const c = window.document.createElement('canvas');
      c.width = 4;
      c.height = 3;
      const gl = c.getContext('webgl2', { antialias: false }),
        p = gl.createProgram();
      const shader = (type, source) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
        gl.attachShader(p, s);
        gl.deleteShader(s);
      };
      shader(
        gl.VERTEX_SHADER,
        '#version 300 es\nout vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}',
      );
      shader(
        gl.FRAGMENT_SHADER,
        '#version 300 es\nprecision highp float;in vec2 uv;out vec4 color;uniform sampler2D mask;void main(){color=vec4(vec3(texture(mask,uv).r),1.);}',
      );
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p));
      gl.useProgram(p);
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 4, 3, 0, gl.RED, gl.UNSIGNED_BYTE, map.data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const pixels = new Uint8Array(48);
      gl.readPixels(0, 0, 4, 3, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      const uploaded = Array.from({ length: 12 }, (_, i) => pixels[i * 4]),
        error = gl.getError();
      gl.deleteTexture(t);
      gl.deleteProgram(p);
      return {
        rowOrder: map.rowOrder,
        width: map.width,
        height: map.height,
        data: Array.from(map.data),
        expected,
        uploaded,
        error,
      };
    } finally {
      resources.dispose();
    }
  });
  assert.equal(result.rowOrder, 'bottom-up');
  assert.deepEqual(result.data, result.expected);
  assert.deepEqual(result.uploaded, result.data);
  assert.equal(result.error, 0);
  assert.ok(result.data.some((v) => v > 0 && v < 255));
  console.log(JSON.stringify(result));
} finally {
  await browser?.close();
  await server.close();
}
