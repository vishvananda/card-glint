import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  const report = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const api = window.lab.api,
      c = api.canvas([400, 600]);
    const r = await api.createRenderer({ canvas: c });
    const raster = (key, color, mark = false, offset = false) => ({
      key,
      size: [200, 300],
      async paint() {
        const c = api.canvas([200, 300]),
          ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 200, 300);
        if (mark) {
          ctx.fillStyle = '#f00';
          if (offset) ctx.fillRect(133, 100, 14, 100);
          else ctx.fillRect(97, 0, 6, 300);
        }
        return c;
      },
    });
    const recipe = (color) => ({
      pack: 'depth-test',
      color,
      edges: [],
      artWindows: [],
      cornerRadius: 0,
      regions: [],
    });
    r.upsertCards([
      { id: 1, revision: 1, recipe: recipe(raster('depth-marker', '#222', true)) },
      { id: 2, revision: 1, recipe: recipe(raster('gray-2', '#555')) },
      { id: 3, revision: 1, recipe: recipe(raster('gray-3', '#777')) },
      { id: 4, revision: 1, recipe: recipe(raster('offset-marker', '#222', true, true)) },
    ]);
    await Promise.all([1, 2, 3, 4].map((id) => r.ready(id, 1)));
    const gl = c.getContext('webgl2'),
      transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    const pixels = () => {
      const p = new Uint8Array(400 * 600 * 4);
      gl.readPixels(0, 0, 400, 600, gl.RGBA, gl.UNSIGNED_BYTE, p);
      return p;
    };
    const frame = (time) => r.render({ viewProjection: api.IDENTITY, time });
    const centroid = (data) => {
      let sum = 0,
        weight = 0;
      for (let y = 50; y < 550; y++)
        for (let x = 100; x < 300; x++) {
          const i = (y * 400 + x) * 4,
            w = Math.max(0, data[i] - Math.max(data[i + 1], data[i + 2]) - 45);
          sum += x * w;
          weight += w;
        }
      return sum / weight;
    };
    try {
      const parallax = {};
      for (const finish of ['rain', 'pool']) {
        const centers = [];
        for (const x of [-0.35, 0, 0.35]) {
          r.updateScene([{ id: 1, card: 1, finish, normal: [x, 0, 1], transform }]);
          await r.ready(finish === 'regular' ? 4 : 1, 1);
          frame(2);
          centers.push(centroid(pixels()));
        }
        parallax[finish] = centers;
      }
      // A real turning pane/basin, not just a lighting-normal change. Track a scene
      // feature away from the pivot: rain and pool keep their recessed plane
      // approximately anchored behind the turning front surface.
      const anchored = {};
      for (const finish of ['regular', 'rain', 'pool']) {
        const centers = [];
        for (const angle of [-0.5, 0, 0.5]) {
          const s = Math.sin(angle),
            c = Math.cos(angle),
            w = s / 3.5;
          const turn = [1.6 * c, 0, 0, w, 0, -1.6, 0, 0, 0, 0, 1, 0, -0.8 * c, 0.8, 0, 1 - w / 2];
          r.updateScene([{ id: 1, card: 4, finish, normal: [s, 0, c], transform: turn }]);
          await r.ready(4, 1);
          frame(2);
          centers.push(centroid(pixels()));
        }
        anchored[finish] = centers;
      }
      r.updateScene([{ id: 1, card: 2, finish: 'pool', transform }]);
      await r.ready(2, 1);
      frame(2);
      const data = pixels(),
        values = [];
      for (let y = 20; y < 580; y += 2)
        for (let x = 20; x < 380; x += 2) values.push(data[(y * 400 + x) * 4 + 1]);
      values.sort((a, b) => a - b);
      const intensity = {
        p10: values[Math.floor(values.length * 0.1)],
        median: values[Math.floor(values.length * 0.5)],
        p90: values[Math.floor(values.length * 0.9)],
        p99: values[Math.floor(values.length * 0.99)],
      };
      // Many materials/instances share one field per time, no per-card light maps.
      r.updateScene(
        Array.from({ length: 24 }, (_, i) => ({
          id: i,
          card: (i % 3) + 1,
          finish: 'pool',
          transform,
        })),
      );
      const before = r.metrics;
      frame(3);
      const moved = r.metrics;
      frame(3);
      const cached = r.metrics;
      frame(4);
      const next = r.metrics;
      return { parallax, anchored, intensity, before, moved, cached, next, glError: gl.getError() };
    } finally {
      r.dispose();
    }
  });
  console.log(JSON.stringify(report, null, 2));
  for (const centers of Object.values(report.parallax)) {
    assert.ok(centers.every(Number.isFinite));
    assert.ok(
      Math.max(...centers) - Math.min(...centers) < 3,
      'Tilt panned the whole illustration',
    );
  }
  const { regular, rain, pool } = report.anchored;
  const travel = (centers) => Math.max(...centers.map((x) => Math.abs(x - centers[1])));
  assert.ok(travel(regular) > 6, 'Test pose did not move the printed feature');
  assert.ok(travel(rain) < travel(regular) * 0.45, 'Window scene followed the turning glass');
  assert.ok(travel(pool) < travel(regular) * 0.45, 'Pool floor followed the turning water surface');
  assert.ok(report.intensity.p10 < 80, 'Missing diverging/darker floor light');
  assert.ok(report.intensity.p90 > 95, 'Missing focused/brighter floor light');
  assert.ok(report.intensity.p99 > 120, 'Missing concentrated caustic bands');
  assert.equal(report.moved.surfacePasses, report.before.surfacePasses + 1);
  assert.equal(report.cached.surfacePasses, report.moved.surfacePasses);
  assert.equal(report.next.surfacePasses, report.moved.surfacePasses + 1);
  for (const key of [
    'compositions',
    'maskBuilds',
    'edgeBuilds',
    'uploads',
    'readbacks',
    'surfaceBytes',
  ])
    assert.equal(report.next[key], report.before[key], key);
  assert.ok(report.next.surfaceBytes < 1024 * 1024);
  assert.equal(report.glError, 0);
  assert.deepEqual(errors, []);
  await writeFile(
    'evidence/parallax.json',
    JSON.stringify(
      {
        report,
        errors,
        scope:
          'Chromium software GPU; feature displacement, floor light contrast and shared-pass/cache counts, not hardware FPS.',
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
}
