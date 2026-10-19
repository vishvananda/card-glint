import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const dots = (await readFile('packages/browser/src/gpu/print-dots.ts', 'utf8')).match(
  /export const PRINT_DOTS_GLSL = `([\s\S]*)`;/,
)[1];
const fragment = (await readFile('packages/browser/src/gpu/printed-ink.ts', 'utf8'))
  .match(/const fragment = `([\s\S]*?)`;\nconst limit/)[1]
  .replace(
    /\$\{PRINT_DOTS_GLSL.replace\([^\n]*\)\}/,
    dots.replace('flat in vec4 printDotsInfo;', 'uniform vec4 printDotsInfo;'),
  );
assert.ok(
  fragment.includes('if(printDotPeriodTexels()<4.)'),
  'Update the area-reference fixture when the integration branch changes',
);
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage();
  const rows = await page.evaluate(
    ({ fragment }) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const gl = canvas.getContext('webgl2'),
        vertex =
          '#version 300 es\nout vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}';
      const program = (source) => {
        const p = gl.createProgram();
        for (const [type, text] of [
          [gl.VERTEX_SHADER, vertex],
          [gl.FRAGMENT_SHADER, source],
        ]) {
          const s = gl.createShader(type);
          gl.shaderSource(s, text);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
          gl.attachShader(p, s);
          gl.deleteShader(s);
        }
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p));
        return p;
      };
      const centered = fragment.replace(
        /void main\(\)\{[\s\S]*$/,
        'void main(){printFootprint=1./printDotPeriodTexels();color=printFace(uv);}',
      );
      const dense = fragment
        .replace('if(printDotPeriodTexels()<4.)', 'if(true)')
        .replaceAll('y<2', 'y<8')
        .replaceAll('x<2', 'x<8')
        .replace('(vec2(float(x),float(y))-.5)*.5', '(vec2(float(x),float(y))-3.5)/8.')
        .replace('sum*.25', 'sum/64.');
      const programs = [program(centered), program(fragment), program(dense)];
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      const data = new Uint8Array(128 * 128 * 4);
      for (let y = 0; y < 128; y++)
        for (let x = 0; x < 128; x++) {
          const i = (y * 128 + x) * 4;
          data.set(x < 64 ? [225, 221, 207, 173] : [103, 132, 166, 255], i);
          if (x === 64) data.set([0, 0, 0, 255], i);
        }
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.SRGB8_ALPHA8,
        128,
        128,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data,
      );
      gl.disable(gl.DITHER);
      const draw = (p, period, amount) => {
        gl.useProgram(p);
        gl.uniform1i(gl.getUniformLocation(p, 'face'), 0);
        // Test periods are face texels; the public uniform uses the 732px card reference.
        gl.uniform4f(gl.getUniformLocation(p, 'printDotsInfo'), amount, (period * 732) / 128, 1, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const d = new Uint8Array(data.length);
        gl.readPixels(0, 0, 128, 128, gl.RGBA, gl.UNSIGNED_BYTE, d);
        return d;
      };
      const mse = (a, b) => {
        let sum = 0,
          n = 0;
        for (let y = 4; y < 124; y++)
          for (let x = 4; x < 124; x++) {
            if (x > 60 && x < 68) continue;
            const i = (y * 128 + x) * 4;
            for (let k = 0; k < 3; k++) {
              sum += (a[i + k] - b[i + k]) ** 2;
              n++;
            }
          }
        return sum / n;
      };
      const rows = [];
      for (const period of [2, 3, 7]) {
        const [center, area, reference] = programs.map((p) => draw(p, period, 0.15));
        rows.push({
          period,
          centerError: mse(center, reference),
          areaError: mse(area, reference),
          coarseDifference: mse(center, area),
        });
        for (let i = 3; i < data.length; i += 4)
          if (area[i] !== data[i]) throw Error('Alpha changed');
        for (let y = 0; y < 128; y++) {
          const i = (y * 128 + 64) * 4;
          if (area[i] || area[i + 1] || area[i + 2]) throw Error('Source lettering softened');
        }
      }
      const zero = programs.map((p) => draw(p, 3, 0));
      if (mse(zero[0], zero[1])) throw Error('Zero amount changed');
      for (const p of programs) gl.deleteProgram(p);
      gl.deleteTexture(texture);
      return rows;
    },
    { fragment },
  );
  for (const row of rows)
    if (row.period < 4) assert.ok(row.areaError < row.centerError * 0.4, JSON.stringify(row));
    else assert.equal(row.coarseDifference, 0);
  console.log(
    'PASS fine print screens integrate pixel area, preserve alpha/lettering and leave coarse screens unchanged',
    rows,
  );
} finally {
  await browser.close();
}
