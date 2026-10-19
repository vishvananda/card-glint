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
  const url = new URL('host-print-period.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Physical print period</title>',
    }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const { foilShader, PRINT_DOTS_GLSL, printDotPeriodForWidth, PRINT_DOTS_REFERENCE_WIDTH } =
      await import('/packages/browser/src/finish.ts');
    const c = document.createElement('canvas');
    c.width = 732;
    c.height = 340;
    const gl = c.getContext('webgl2', { antialias: false });
    const p = gl.createProgram();
    const shader = (type, text) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, text);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
      gl.deleteShader(s);
    };
    shader(
      gl.VERTEX_SHADER,
      `#version 300 es
precision highp float;out vec2 uv;
flat out vec2 facePixelSize;flat out float previewKind;flat out float hasMask;flat out float aspect;flat out vec2 pointer;flat out vec4 artBounds;flat out vec4 artBounds2;flat out vec4 printDotsInfo;
void main(){const vec2 corners[6]=vec2[6](vec2(0,0),vec2(1,0),vec2(0,1),vec2(0,1),vec2(1,0),vec2(1,1));uv=corners[gl_VertexID];facePixelSize=vec2(244.,340.)*float(gl_InstanceID+1);previewKind=0.;hasMask=0.;aspect=340./244.;pointer=vec2(.5);artBounds=vec4(0.);artBounds2=vec4(0.);printDotsInfo=vec4(1.,8.,.5,.08);gl_Position=vec4((uv.x+float(gl_InstanceID))*2./3.-1.,uv.y*2.-1.,0.,1.);}`,
    );
    shader(
      gl.FRAGMENT_SHADER,
      `#version 300 es
precision highp float;in vec2 uv;out vec4 color;
vec4 glintSampleFace(vec2 uv){return vec4(.27,.45,.63,1.);}
float glintSampleMask(vec2 uv){return 0.;}
${foilShader({ sampling: 'host', artWindows: 'pair', liquid: false })}
${PRINT_DOTS_GLSL}
void main(){printFootprint=printDotFootprint(uv);color=printFace(uv);}`,
    );
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p));
    gl.useProgram(p);
    gl.disable(gl.DITHER);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 3);
    const b = new Uint8Array(732 * 340 * 4);
    gl.readPixels(0, 0, 732, 340, gl.RGBA, gl.UNSIGNED_BYTE, b);
    let max = 0,
      changed = 0;
    for (let y = 0; y < 340; y++)
      for (let x = 0; x < 244; x++) {
        for (let ch = 0; ch < 3; ch++) {
          const v = b[(y * 732 + x) * 4 + ch];
          for (let layer = 1; layer < 3; layer++)
            max = Math.max(max, Math.abs(v - b[(y * 732 + x + layer * 244) * 4 + ch]));
        }
        if (b[(y * 732 + x) * 4] !== 69) changed++;
      }
    return {
      referenceWidth: PRINT_DOTS_REFERENCE_WIDTH,
      periods: [244, 488, 732].map((w) => printDotPeriodForWidth(w, 6)),
      maxTierDifference: max,
      changed,
      error: gl.getError(),
    };
  });
  assert.equal(result.referenceWidth, 732);
  assert.deepEqual(result.periods, [2, 4, 6]);
  assert.ok(result.maxTierDifference <= 2, JSON.stringify(result));
  assert.ok(result.changed > 1000);
  assert.equal(result.error, 0);
  console.log(JSON.stringify(result));
} finally {
  await browser?.close();
  await server.close();
}
