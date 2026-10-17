import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const source = await readFile('packages/browser/src/gpu/pool-shader.ts', 'utf8');
// Exercise the actual ripple shader kernel, including its physical aspect metric.
const kernel = source.slice(
  source.indexOf('vec3 rippleCapsule'),
  source.indexOf('const vec2 sunHorizontal'),
);
assert.match(source, /rippleWake\(uv,wakeDrag\)/, 'Ambient slopes must not warp wave propagation');
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage();
  const result = await page.evaluate((kernel) => {
    const gl = document.createElement('canvas').getContext('webgl2');
    const shader = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      return s;
    };
    const program = gl.createProgram();
    gl.attachShader(
      program,
      shader(
        gl.VERTEX_SHADER,
        '#version 300 es\nvoid main(){gl_Position=vec4(gl_VertexID==1?3.:-1.,gl_VertexID==2?3.:-1.,0.,1.);}',
      ),
    );
    gl.attachShader(
      program,
      shader(
        gl.FRAGMENT_SHADER,
        `#version 300 es
precision highp float;
uniform vec2 probe;
uniform float surfaceTime,aspect;
const vec4 ripple0=vec4(.5,.5,0.,1025.5),ripple1=vec4(0.),ripple2=vec4(0.),ripple3=vec4(0.);
${kernel}
out vec4 color;
void main(){vec2 drag;vec3 r=rippleWake(probe,drag);color=vec4(length(r.xy)*4.,r.z*.5+.5,0.,1.);}`,
      ),
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    gl.viewport(0, 0, 1, 1);
    gl.uniform1f(gl.getUniformLocation(program, 'surfaceTime'), 0.4);
    const rows = [];
    for (const aspect of [1, 1.4, 0.7]) {
      gl.uniform1f(gl.getUniformLocation(program, 'aspect'), aspect);
      const samples = [];
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        gl.uniform2f(
          gl.getUniformLocation(program, 'probe'),
          0.5 + Math.cos(a) * 0.108,
          0.5 + (Math.sin(a) * 0.108) / aspect,
        );
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const pixel = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        samples.push([...pixel]);
      }
      rows.push({ aspect, samples });
    }
    return { rows, error: gl.getError() };
  }, kernel);
  assert.equal(result.error, 0);
  for (const { samples } of result.rows) {
    assert.ok(
      samples.some((s) => s[0] > 0 || Math.abs(s[1] - 128) > 2),
      'A visible wave was sampled',
    );
    for (const channel of [0, 1])
      assert.ok(
        Math.max(...samples.map((s) => s[channel])) - Math.min(...samples.map((s) => s[channel])) <=
          3,
        'Tap rings have equal height/slope around the physical radius',
      );
  }
  console.log(
    'PASS flat tap rings remain circular across card aspect ratios (Linux Chromium / SwiftShader)',
  );
} finally {
  await browser.close();
}
