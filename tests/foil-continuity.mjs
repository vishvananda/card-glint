import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage(),
    errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/__foil_continuity__', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Foil continuity</title>',
    }),
  );
  await page.goto(server.resolvedUrls.local[0] + '__foil_continuity__');
  const report = await page.evaluate(async (reference) => {
    const { FOIL_REFLECTION_GLSL } = await import(
      '/packages/browser/src/gpu/foil-reflection-shader.ts'
    );
    const probe = document.createElement('canvas');
    probe.width = probe.height = 129;
    const gl = probe.getContext('webgl2'),
      program = gl.createProgram();
    gl.disable(gl.DITHER); // Preserve the packed 16-bit measurements exactly.
    const compile = (type, code) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      `#version 300 es
      void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`,
    );
    const helper = reference
      ? FOIL_REFLECTION_GLSL.replace('dot(delta, delta) * 2.', 'dot(delta, delta) * 180.')
      : FOIL_REFLECTION_GLSL;
    const fragment = compile(
      gl.FRAGMENT_SHADER,
      `#version 300 es
      precision highp float;vec2 pointer;const float aspect=1.4;
      ${helper}
      out vec4 color;
      void main(){pointer=vec2(.5)+(gl_FragCoord.xy-vec2(.5))/128.*.4-.2;
        uvec2 p=uvec2(round(foilPointer(vec3(0.,0.,1.))*65535.));
        color=vec4(float(p.x>>8),float(p.x&255u),float(p.y>>8),float(p.y&255u))/255.;}`,
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    gl.bindVertexArray(gl.createVertexArray());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const bytes = new Uint8Array(129 * 129 * 4);
    gl.readPixels(0, 0, 129, 129, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
    const point = (x, y) => {
      const i = (y * 129 + x) * 4;
      return [(bytes[i] * 256 + bytes[i + 1]) / 65535, (bytes[i + 2] * 256 + bytes[i + 3]) / 65535];
    };
    let minForward = Infinity,
      maxGain = 0;
    const step = 0.4 / 128;
    for (let y = 0; y < 128; y++)
      for (let x = 0; x < 128; x++)
        for (const axis of [0, 1]) {
          const a = point(x, y),
            b = point(x + (axis === 0 ? 1 : 0), y + (axis === 1 ? 1 : 0)),
            delta = b.map((v, i) => (v - a[i]) / step);
          // Pointer Y is CSS-down; the helper's lighting Y is texture-up.
          minForward = Math.min(minForward, delta[axis] * (axis === 0 ? 1 : -1));
          maxGain = Math.max(maxGain, Math.hypot(...delta));
        }
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteProgram(program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (reference) return { reference, minForward, maxGain };
    const { createRenderer, canvas, IDENTITY } = await import('/packages/browser/src/index.ts');
    const output = canvas([128, 180]),
      renderer = await createRenderer({ canvas: output }),
      gpu = output.getContext('webgl2');
    const raster = {
      key: 'continuity-ink',
      size: [128, 180],
      async paint() {
        const c = canvas([128, 180]),
          ctx = c.getContext('2d');
        ctx.fillStyle = '#55616a';
        ctx.fillRect(0, 0, 128, 180);
        ctx.strokeStyle = '#242a36';
        for (let y = 10; y < 180; y += 20) {
          ctx.beginPath();
          ctx.arc(64, y, 18, 0, Math.PI * 2);
          ctx.stroke();
        }
        return c;
      },
    };
    const mask = {
      key: 'continuity-emblem',
      size: [32, 32],
      async paint() {
        const c = canvas([32, 32]);
        c.getContext('2d').fillRect(0, 0, 32, 32);
        return c;
      },
    };
    renderer.upsertCards([
      {
        id: 1,
        revision: 1,
        recipe: {
          pack: 'continuity-test',
          color: raster,
          edges: [],
          artWindows: [[0.1, 0.1, 0.8, 0.6]],
          cornerRadius: 0,
          regions: [],
          hologram: { mask, rect: [0.25, 0.75, 0.5, 0.15], strength: 0.7, seed: 1 },
        },
      },
    ]);
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
      finishes = [];
    try {
      await renderer.ready(1, 1);
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
      ]) {
        let maxMeanChange = 0;
        for (const normalMotion of [false, true])
          for (const center of [-0.09, -0.05, 0, 0.05, 0.09])
            for (const axis of [0, 1]) {
              const draw = async (offset) => {
                const pointer = [0.5, 0.5];
                pointer[axis] += center + offset;
                const rx = normalMotion ? (pointer[1] - 0.5) * 0.3 : 0,
                  ry = normalMotion ? (pointer[0] - 0.5) * 0.38 : 0;
                renderer.updateScene([
                  {
                    id: 17,
                    card: 1,
                    finish,
                    transform,
                    normal: [
                      Math.sin(ry),
                      Math.sin(rx) * Math.cos(ry),
                      Math.cos(rx) * Math.cos(ry),
                    ],
                  },
                ]);
                await renderer.ready(1, 1);
                renderer.render({ viewProjection: IDENTITY, pointer, time: 1 });
                const b = new Uint8Array(128 * 180 * 4);
                gpu.readPixels(0, 0, 128, 180, gpu.RGBA, gpu.UNSIGNED_BYTE, b);
                return b;
              };
              const a = await draw(-1 / 1024),
                b = await draw(1 / 1024);
              let change = 0;
              for (let i = 0; i < a.length; i += 4)
                change +=
                  Math.abs(a[i] - b[i]) +
                  Math.abs(a[i + 1] - b[i + 1]) +
                  Math.abs(a[i + 2] - b[i + 2]);
              maxMeanChange = Math.max(maxMeanChange, change / (128 * 180 * 3));
            }
        finishes.push({ finish, maxMeanChange });
      }
      return { reference, minForward, maxGain, finishes, glError: gpu.getError() };
    } finally {
      renderer.dispose();
      gpu.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }, process.env.FOIL_REFERENCE_NARROW === '1');
  report.errors = errors;
  report.browser = `${process.platform} Chromium ${browser.version()} / SwiftShader; GPU readback completion; no physical GPU validation`;
  await writeFile(
    process.env.FOIL_CONTINUITY_OUTPUT ?? 'evidence/foil-continuity.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report, null, 2));
  assert.ok(report.minForward > 0.65, 'light direction must not reverse near flat');
  assert.ok(report.maxGain < 1.35, 'small pointer changes must not accelerate the light sharply');
  assert.equal(report.glError, 0);
  assert.deepEqual(errors, []);
  for (const sample of report.finishes)
    assert.ok(sample.maxMeanChange < 1.5, sample.finish + ' jumped with subpixel motion');
} finally {
  await browser.close();
  await server.close();
}
