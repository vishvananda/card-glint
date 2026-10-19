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
  const url = new URL('host-sampling-check.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Host sampling contract</title>',
    }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const { foilShader, PRINT_DOTS_GLSL, CARDSTOCK_GLSL, SURFACE_GLSL } = await import(
      '/packages/browser/src/finish.ts'
    );
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
    if (!gl) throw Error('WebGL2 required');
    const shader = (type, text) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, text);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      return s;
    };
    const programs = [];
    for (const windows of ['pair', 'array']) {
      const bounds =
        windows === 'pair'
          ? 'flat out vec4 artBounds;flat out vec4 artBounds2;'
          : 'flat out vec4 artBounds[8];';
      const assign =
        windows === 'pair'
          ? 'artBounds=vec4(.1,.1,.9,.9);artBounds2=vec4(0.);'
          : 'for(int i=0;i<8;i++)artBounds[i]=i==0?vec4(.1,.1,.9,.9):vec4(0.);';
      const vertex = `#version 300 es
precision highp float;precision highp int;
out vec2 uv;flat out float layer;flat out vec2 facePixelSize;flat out float previewKind;flat out float hasMask;flat out float aspect;flat out vec2 pointer;
flat out vec4 printDotsInfo;flat out float cardstockAmount;
${bounds}
uniform float finishKind;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;layer=float(gl_InstanceID);facePixelSize=vec2(64.,64.);previewKind=finishKind;hasMask=1.;aspect=1.;pointer=vec2(.5);printDotsInfo=vec4(0.,5.,.5,0.);cardstockAmount=0.;${assign}gl_Position=vec4((p.x+float(gl_InstanceID))*.5-1.,p.y*2.-1.,0.,1.);}`;
      const fragment = `#version 300 es
precision highp float;precision highp int;precision highp sampler2DArray;
in vec2 uv;flat in float layer;out vec4 color;
uniform sampler2DArray faces;uniform sampler2DArray masks;
vec4 glintSampleFace(vec2 uv){return texture(faces,vec3(uv,layer));}
float glintSampleMask(vec2 uv){return texture(masks,vec3(uv,layer)).r;}
${foilShader({ sampling: 'host', artWindows: windows, liquid: false })}
${PRINT_DOTS_GLSL}
${CARDSTOCK_GLSL}
void main(){if(any(greaterThan(uv,vec2(1.))))discard;vec3 ink=previewInk(printFace(uv).rgb);vec3 finish=previewFoil(uv,normalize(vec3(.1,.15,1.)),vec3(0.,0.,1.));color=vec4(cardstockGloss(uv,ink,finish),1.);}`;
      const vs = shader(gl.VERTEX_SHADER, vertex),
        fs = shader(gl.FRAGMENT_SHADER, fragment),
        p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p));
      programs.push(p);
    }
    const colors = [
        [32, 64, 128, 255],
        [128, 32, 64, 255],
        [64, 128, 32, 255],
        [96, 96, 96, 255],
      ],
      textures = [];
    for (const [unit, isMask] of [
      [0, false],
      [1, true],
    ]) {
      const t = gl.createTexture();
      textures.push(t);
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, t);
      gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, 64, 64, 4);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      for (let layer = 0; layer < 4; layer++) {
        const b = new Uint8Array(64 * 64 * 4);
        for (let y = 0; y < 64; y++)
          for (let x = 0; x < 64; x++)
            b.set(isMask ? [x < 32 ? 255 : 0, 0, 0, 255] : colors[layer], (y * 64 + x) * 4);
        gl.texSubImage3D(
          gl.TEXTURE_2D_ARRAY,
          0,
          0,
          0,
          layer,
          64,
          64,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          b,
        );
      }
    }
    const stock = gl.createTexture();
    textures.push(stock);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, stock);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([128, 0, 128, 0]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const runs = [];
    for (const p of programs) {
      gl.useProgram(p);
      gl.uniform1i(gl.getUniformLocation(p, 'faces'), 0);
      gl.uniform1i(gl.getUniformLocation(p, 'masks'), 1);
      gl.uniform1i(gl.getUniformLocation(p, 'cardstockMap'), 2);
      for (const kind of [0, 1, 2, 3, 4, 8, 9]) {
        gl.uniform1f(gl.getUniformLocation(p, 'finishKind'), kind);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 4);
        const b = new Uint8Array(256 * 64 * 4);
        gl.readPixels(0, 0, 256, 64, gl.RGBA, gl.UNSIGNED_BYTE, b);
        const samples = colors.map((_, i) =>
          Array.from(b.slice((32 * 256 + i * 64 + 32) * 4, (32 * 256 + i * 64 + 32) * 4 + 4)),
        );
        runs.push({ kind, samples, error: gl.getError() });
      }
    }
    // Surface functions also compile with the same host bindings and no 2D face sampler.
    const surface =
      foilShader({ sampling: 'host', artWindows: 'pair', liquid: false }) + SURFACE_GLSL;
    const fs = shader(
      gl.FRAGMENT_SHADER,
      `#version 300 es
precision highp float;precision highp int;
in vec2 uv;out vec4 color;uniform float finishBase;
vec4 glintSampleFace(vec2 uv){return vec4(uv,.5,1.);}
float glintSampleMask(vec2 uv){return 0.;}
${surface}
void main(){color=vec4(animatedSurface(uv,vec3(0.,0.,1.)),1.);}`,
    );
    gl.deleteShader(fs);
    for (const p of programs) gl.deleteProgram(p);
    for (const t of textures) gl.deleteTexture(t);
    return { runs, renderer: gl.getParameter(gl.RENDERER) };
  });
  assert.equal(result.runs.length, 14);
  for (const r of result.runs) {
    assert.equal(r.error, 0);
    assert.equal(
      new Set(r.samples.map((s) => s.join(','))).size,
      4,
      'Each instance samples its own face layer',
    );
    for (const s of r.samples) assert.equal(s[3], 255);
  }
  assert.deepEqual(
    result.runs.slice(0, 7),
    result.runs.slice(7),
    'Pair and array windows retain the same finish pixels',
  );
  console.log(JSON.stringify(result));
} finally {
  await browser?.close();
  await server.close();
}
