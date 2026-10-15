import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  server: { port: 0 },
  optimizeDeps: { noDiscovery: true },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const { foilShader } = await import('/packages/browser/src/finish.ts');
    const source = foilShader({ artWindows: 'pair' });
    const start = source.indexOf('float artWindow(');
    const body = source.slice(start, source.indexOf('\n  }', start) + 4);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const gl = canvas.getContext('webgl2');
    if (!gl) throw Error('WebGL2 unavailable');
    const compile = (type, code) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      '#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}',
    );
    const fragment = compile(
      gl.FRAGMENT_SHADER,
      '#version 300 es\nprecision highp float;uniform vec4 artBounds;uniform vec4 artBounds2;out vec4 color;\n' +
        body +
        '\nvoid main(){color=vec4(vec3(artWindow(gl_FragCoord.xy/64.)),1.);}',
    );
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    gl.uniform4f(gl.getUniformLocation(program, 'artBounds'), 0.1, 0.1, 0.4, 0.4);
    gl.uniform4f(gl.getUniformLocation(program, 'artBounds2'), 0.6, 0.55, 0.9, 0.8);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const pixels = new Uint8Array(64 * 64 * 4);
    gl.readPixels(0, 0, 64, 64, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const samples = [
      [16, 16],
      [48, 42],
      [48, 58],
      [16, 38],
      [48, 25],
    ].map(([x, y]) => pixels[(y * 64 + x) * 4]);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return samples;
  });
  assert.deepEqual(
    result,
    [255, 255, 0, 0, 0],
    'Both art windows must stop at their own top and bottom bounds',
  );
  console.log('PASS two-window foil coverage; no leakage past either artwork rectangle.');
} finally {
  await browser.close();
  await server.close();
}
