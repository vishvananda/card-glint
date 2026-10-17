import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const source = await readFile('packages/browser/src/gpu/print-dots.ts', 'utf8');
const dots = source.match(/export const PRINT_DOTS_GLSL = `([\s\S]*)`;/)[1];
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
});
try {
  const page = await browser.newPage();
  const results = await page.evaluate((dots) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const gl = canvas.getContext('webgl2');
    const program = gl.createProgram();
    const shader = (kind, source) => {
      const s = gl.createShader(kind);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      gl.attachShader(program, s);
      gl.deleteShader(s);
    };
    shader(
      gl.VERTEX_SHADER,
      '#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}',
    );
    shader(
      gl.FRAGMENT_SHADER,
      `#version 300 es
precision highp float;
uniform sampler2D face;
uniform float ink;
uniform bool horizontal;
out vec4 color;
vec3 previewLinear(vec3 c){return c;}
vec3 previewInk(vec3 c){return c;}
${dots.replace('flat in vec4 printDotsInfo;', 'uniform vec4 printDotsInfo;')}
void main(){
 printFootprint=.02;
 float row=floor(gl_FragCoord.y);
 vec2 p=vec2(floor(row/32.)+1.+(gl_FragCoord.x<1.?-.0001:.0001),mod(row,32.)/4.);
 if(horizontal)p=p.yx;
 float value=inkScreen(p,ink,vec2(1.,0.),9.);
 color=vec4(vec3(value),1.);
}`,
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    gl.uniform4f(gl.getUniformLocation(program, 'printDotsInfo'), 1, 12, 1, 0);
    gl.disable(gl.DITHER);
    const results = [];
    for (const ink of [0.25, 0.45, 0.55, 0.75]) {
      for (const horizontal of [false, true]) {
        gl.uniform1f(gl.getUniformLocation(program, 'ink'), ink);
        gl.uniform1i(gl.getUniformLocation(program, 'horizontal'), horizontal ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const data = new Uint8Array(2 * 512 * 4);
        gl.readPixels(0, 0, 2, 512, gl.RGBA, gl.UNSIGNED_BYTE, data);
        let jump = 0;
        for (let row = 0; row < 512; row++)
          jump = Math.max(jump, Math.abs(data[row * 8] - data[row * 8 + 4]));
        results.push({ ink, horizontal, jump });
      }
    }
    gl.deleteProgram(program);
    return results;
  }, dots);
  for (const result of results) assert.ok(result.jump <= 4, JSON.stringify(result));
  console.log('PASS varied ink and hole screens remain continuous across both cell axes', results);
  const base = process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/';
  await page.route(base + 'display-test', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><body>' }),
  );
  await page.goto(base + 'display-test');
  await page.evaluate(async (base) => {
    const api = await import(base + 'presets/browser.js');
    if (api.printSamplingVersion !== 1) throw Error('Sampling capability missing');
    const output = document.createElement('canvas');
    output.width = 732;
    output.height = 1020;
    output.style.cssText = 'width:244px;height:340px';
    document.body.append(output);
    const display = api.createDisplayRaster(output);
    const ink = display.source.getContext('2d');
    ink.fillStyle = '#708090';
    ink.fillRect(0, 0, 732, 1020);
    display.present();
    for (const size of [[0, 100], [-1, 100], [Infinity, 1], []]) {
      let rejected = false;
      try {
        api.createDisplayRaster(document.createElement('canvas'), size);
      } catch {
        rejected = true;
      }
      if (!rejected) throw Error('Invalid native size accepted');
    }
    window.displayTest = { output, display };
  }, base);
  const cdp = await page.context().newCDPSession(page);
  for (const density of [1, 2, 1.25, 1.5, 3, 1]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 800,
      height: 600,
      deviceScaleFactor: density,
      mobile: false,
    });
    await page.waitForFunction((density) => {
      const { output, display } = window.displayTest;
      if (display.source.width !== 732 || display.source.height !== 1020)
        throw Error('Native raster resized');
      return output.width === 244 * density && output.clientWidth === 244;
    }, density);
  }
  // ResizeObserver must follow CSS layout changes as well as display density.
  for (const [width, height, expectedWidth, expectedHeight] of [
    [366, 510, 366, 510],
    [122, 170, 122, 170],
    [976, 1360, 732, 1020],
    [244, 340, 244, 340],
  ]) {
    await page.evaluate(
      ({ width, height }) => {
        window.displayTest.output.style.cssText = `width:${width}px;height:${height}px`;
      },
      { width, height },
    );
    await page.waitForFunction(
      ({ width, height }) => {
        const { output, display } = window.displayTest;
        if (display.source.width !== 732 || display.source.height !== 1020)
          throw Error('CSS resize changed native raster');
        return output.width === width && output.height === height;
      },
      { width: expectedWidth, height: expectedHeight },
    );
  }
  await page.evaluate(() => {
    const { output, display } = window.displayTest;
    const pixel = output.getContext('2d').getImageData(20, 20, 1, 1).data;
    if (String(pixel) !== '112,128,144,255') throw Error('Filtered output changed flat ink');
    display.dispose();
    if (display.source.width !== 0) throw Error('Native raster retained after disposal');
  });
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 800,
    height: 600,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  assert.equal(
    await page.evaluate(() => window.displayTest.output.width),
    244,
    'density listener removed on disposal',
  );
  await cdp.detach();
  console.log(
    'PASS public display sampling preserves native ink, tracks monitor density and releases resources',
  );
} finally {
  await browser.close();
}
