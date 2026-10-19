import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0]);
  const results = await page.evaluate(async () => {
    const { createRenderer, canvas } = await import('/packages/browser/src/index.ts');
    const output = canvas([216, 300]);
    const renderer = await createRenderer({ canvas: output });
    const face = {
      key: 'softbox-neutral',
      size: [216, 300],
      async paint() {
        const c = canvas([216, 300]);
        const g = c.getContext('2d');
        g.fillStyle = '#777';
        g.fillRect(0, 0, 216, 300);
        return c;
      },
    };
    renderer.upsertCards([
      {
        id: 1,
        revision: 1,
        recipe: {
          pack: 'studio-test',
          color: face,
          edges: [],
          artWindows: [],
          cornerRadius: 0,
          regions: [],
          finishCoverageBase: 1,
        },
      },
    ]);
    await renderer.ready(1, 1);
    const gl = output.getContext('webgl2');
    const d = 2.1,
      aspect = 0.72;
    const projection = [2 / aspect, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0.12 / d, -1 / d, 0, 0, 0, 1];
    function pose(rx, ry) {
      const sx = Math.sin(rx),
        cx = Math.cos(rx),
        sy = Math.sin(ry),
        cy = Math.cos(ry);
      const right = [aspect * cy, aspect * sx * sy, -aspect * cx * sy, 0],
        down = [0, -cx, -sx, 0];
      return {
        transform: [
          ...right,
          ...down,
          sy,
          -sx * cy,
          cx * cy,
          0,
          ...[0, 0, 0, 1].map((v, i) => v - (right[i] + down[i]) / 2),
        ],
        normal: [sy, -sx * cy, cx * cy],
      };
    }
    function draw(rx, ry, finish = 'gloss', pointer = [0.5, 0.5], time = 0, roll = 0) {
      const p = pose(rx, ry),
        c = Math.cos(roll),
        s = Math.sin(roll);
      for (let i = 0; i < 16; i += 4) {
        const x = p.transform[i],
          y = p.transform[i + 1];
        p.transform[i] = c * x - s * y;
        p.transform[i + 1] = s * x + c * y;
      }
      const [nx, ny, nz] = p.normal;
      p.normal = [c * nx - s * ny, s * nx + c * ny, nz];
      renderer.updateScene([{ id: 1, card: 1, finish, ...p }]);
      renderer.render({ viewProjection: projection, pointer, time, clear: [0, 0, 0, 0] });
      const bytes = new Uint8Array(output.width * output.height * 4);
      gl.readPixels(0, 0, output.width, output.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      return bytes;
    }
    const a = draw(0, -0.12),
      fixed = draw(0, -0.12, 'gloss', [0.95, 0.05], 55);
    let pointerChanges = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== fixed[i]) pointerChanges++;
    // Rotating a uniform planar card in its own plane must leave the light
    // fixed in the scene wherever the two silhouettes overlap.
    const flat = draw(0, 0),
      rolled = draw(0, 0, 'gloss', [0.5, 0.5], 0, 0.4);
    let rollCompared = 0,
      rollError = 0;
    for (let i = 0; i < flat.length; i += 4)
      if (flat[i + 3] === 255 && rolled[i + 3] === 255) {
        rollCompared++;
        for (let k = 0; k < 3; k++)
          rollError = Math.max(rollError, Math.abs(flat[i + k] - rolled[i + k]));
      }
    const samples = [];
    for (const angle of [-0.45, -0.25, -0.12, 0, 0.25, 0.45]) {
      const ink = draw(0, angle, 'regular'),
        coat = draw(0, angle);
      let sum = 0,
        max = 0,
        count = 0,
        x = 0;
      for (let i = 0; i < ink.length; i += 4) {
        if (ink[i + 3] !== 255 || coat[i + 3] !== 255) continue;
        const delta = Math.max(0, coat[i] - ink[i]);
        sum += delta;
        max = Math.max(max, delta);
        count++;
        x += delta * ((i / 4) % output.width);
      }
      samples.push({
        angle,
        meanAddedSrgb255: sum / count,
        maxAddedSrgb255: max,
        centroidX: sum ? x / sum : null,
        added: sum,
      });
    }
    const { IDENTITY } = await import('/packages/browser/src/index.ts');
    function billboard(normal, pointer, time = 0) {
      renderer.updateScene([
        {
          id: 1,
          card: 1,
          finish: 'gloss',
          normal,
          transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
        },
      ]);
      renderer.render({ viewProjection: IDENTITY, pointer, time, clear: [0, 0, 0, 0] });
      const bytes = new Uint8Array(output.width * output.height * 4);
      gl.readPixels(0, 0, output.width, output.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      return bytes;
    }
    const twoD = billboard([0, 0, 1], [0.5, 0.5]),
      twoDFixed = billboard([0, 0, 1], [0.9, 0.1], 50);
    const turned = billboard(pose(0, -0.12).normal, [0.5, 0.5]);
    let twoDPointerChanges = 0,
      twoDPoseChanges = 0;
    for (let i = 0; i < twoD.length; i++) {
      if (twoD[i] !== twoDFixed[i]) twoDPointerChanges++;
      if (twoD[i] !== turned[i]) twoDPoseChanges++;
    }
    // Settling the pose does not cause per-frame preparation/readback work.
    const before = renderer.metrics;
    for (let i = 0; i < 10; i++)
      renderer.render({ viewProjection: projection, pointer: [i / 10, 0.2], time: i });
    const after = renderer.metrics;
    renderer.dispose();
    return {
      pointerChanges,
      rollCompared,
      rollError,
      twoDPointerChanges,
      twoDPoseChanges,
      samples,
      before,
      after,
    };
  });
  assert.equal(results.pointerChanges, 0, 'A fixed pose must ignore cursor/time');
  assert.equal(results.twoDPointerChanges, 0, '2D hosts must share fixed-light behavior');
  assert.ok(results.twoDPoseChanges > 1000, '2D gloss must follow the supplied normal');
  assert.ok(results.rollCompared > 10000);
  assert.ok(results.rollError <= 1, 'Softbox rotates with the printed face');
  const samples = results.samples;
  assert.ok(
    samples.some((r) => r.maxAddedSrgb255 > 5),
    'Softbox should catch the varnish',
  );
  assert.ok(
    samples.every((r) => r.maxAddedSrgb255 <= 18),
    'Pack-fresh sheen is too strong',
  );
  assert.ok(
    samples.every((r) => r.meanAddedSrgb255 < 6),
    'Broad glare overwhelms the ink',
  );
  assert.ok(samples.at(-1).added < samples[2].added * 0.05, 'Reflection should leave the card');
  assert.ok(
    samples[1].centroidX > samples[2].centroidX + 15,
    'Reflection should travel under tilt',
  );
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads', 'readbacks']) {
    assert.ok(Number.isFinite(results.before[key]), 'Missing metric: ' + key);
    assert.equal(results.before[key], results.after[key], 'Warm lighting allocated: ' + key);
  }
  assert.deepEqual(errors, []);
  await mkdir('test-results/studio-gloss', { recursive: true });
  await writeFile('test-results/studio-gloss/lighting.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ pointerChanges: results.pointerChanges, samples, errors }));
} finally {
  await browser.close();
  await server.close();
}
