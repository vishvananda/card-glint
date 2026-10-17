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
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
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
uniform vec4 ripple0;
const vec4 ripple1=vec4(0.),ripple2=vec4(0.),ripple3=vec4(0.);
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
    gl.uniform4f(gl.getUniformLocation(program, 'ripple0'), 0.5, 0.5, 0, 1025.5);
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
    // A slight pointer movement turns a tap into a short stroke. Both rounded
    // ends must still emit: previously a directional taper erased the rear cap.
    gl.uniform1f(gl.getUniformLocation(program, 'aspect'), 1);
    const caps = [];
    for (const direction of [-1, 1]) {
      const qx = Math.round(((direction * 0.025) / 0.24 + 0.5) * 2047);
      const seg = (qx / 2047 - 0.5) * 0.24;
      gl.uniform4f(gl.getUniformLocation(program, 'ripple0'), 0.5, 0.5, 0, 1 + qx + 0.5);
      for (const end of [-1, 1]) {
        const localAge = 0.4 - (end * Math.min(0.14, Math.abs(seg) * 1.5)) / 2;
        const radius = Math.sqrt((0.016 + localAge * 0.23) ** 2 - 0.014 ** 2);
        gl.uniform2f(
          gl.getUniformLocation(program, 'probe'),
          0.5 + end * seg + end * direction * radius,
          0.5,
        );
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const pixel = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        caps.push({ direction, end, pixel: [...pixel] });
      }
    }
    return { rows, caps, error: gl.getError() };
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
  for (const cap of result.caps)
    assert.ok(cap.pixel[0] > 10, `Complete stroke cap: ${JSON.stringify(cap)}`);
  console.log(
    `PASS flat tap rings remain circular and both stroke end caps survive in either direction (${process.platform} Chromium / SwiftShader)`,
  );
} finally {
  await browser.close();
}
