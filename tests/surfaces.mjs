import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  const report = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const { api } = window.lab,
      c = document.createElement('canvas');
    c.width = 512;
    c.height = 384;
    const r = await api.createRenderer({ canvas: c });
    const raster = (key, paint) => ({
      key,
      size: [128, 192],
      async paint() {
        const c = api.canvas([128, 192]);
        paint(c.getContext('2d'));
        return c;
      },
    });
    const empty = raster('empty', () => {});
    const exclusion = raster('dry', (ctx) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(8, 16, 32, 48);
    });
    const badge = raster('badge', (ctx) => {
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(54, 86, 20, 20);
    });
    const face = raster('grid', (ctx) => {
      ctx.fillStyle = '#194e77';
      ctx.fillRect(0, 0, 128, 192);
      ctx.fillStyle = '#eed8b7';
      for (let y = 0; y < 192; y += 12)
        for (let x = 0; x < 128; x += 12) if ((x + y) % 24 === 0) ctx.fillRect(x, y, 12, 12);
    });
    const recipe = {
      pack: 'test',
      color: face,
      edges: [],
      artWindows: [],
      cornerRadius: 0.04,
      regions: [],
    };
    r.upsertCards([
      {
        id: 1,
        revision: 1,
        recipe,
        layers: [
          {
            id: 'dry',
            order: 0,
            stage: 'under-finish',
            raster: empty,
            finishCoverage: { exclude: exclusion },
          },
          { id: 'badge', order: 1, stage: 'over-finish', raster: badge },
        ],
      },
    ]);
    await r.ready(1, 1);
    const transform = (x) => [1, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, x, 1, 0, 1];
    const scene = (finish, normal = [0, 0, 1]) => [
      { id: 1, card: 1, finish, normal, transform: transform(-1) },
      { id: 2, card: 1, finish, transform: transform(0) },
    ];
    const gl = c.getContext('webgl2');
    const pixels = () => {
      const bytes = new Uint8Array(c.width * c.height * 4);
      gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      return bytes;
    };
    const render = (time, hover) => {
      r.render({ viewProjection: api.IDENTITY, time, hover });
      return pixels();
    };
    const diff = (a, b, left = 0, right = 512) => {
      let changed = 0;
      for (let y = 0; y < 384; y++)
        for (let x = left; x < right; x++) {
          const i = (y * 512 + x) * 4;
          if (
            Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) >
            6
          )
            changed++;
        }
      return changed;
    };
    const pixel = (data, x, y) => [...data.slice((y * 512 + x) * 4, (y * 512 + x) * 4 + 4)];
    try {
      r.updateScene(scene('regular'));
      const regular = render(0),
        before = r.metrics,
        finishes = {};
      for (const finish of ['rain', 'heat', 'pool']) {
        r.updateScene(scene(finish));
        const a = render(1),
          still = render(1),
          b = render(2);
        finishes[finish] = {
          changed: diff(a, b),
          fixedTimeDiff: diff(a, still),
          badge: pixel(b, 128, 192),
          dry: pixel(b, 40, 320),
          regularDry: pixel(regular, 40, 320),
          corner: pixel(b, 0, 0),
        };
      }
      r.updateScene(scene('pool'));
      const control = render(5.18);
      render(5, { instance: 1, uv: [0.6, 0.4] });
      const ripple = render(5.18);
      const localized = {
        left: diff(control, ripple, 0, 256),
        right: diff(control, ripple, 256, 512),
      };
      const resting = render(10.2);
      r.updateScene(scene('pool', [0.6, 0.25, 1]));
      render(9.95);
      r.updateScene(scene('pool'));
      render(10.05);
      const moving = render(10.2);
      const slosh = { left: diff(resting, moving, 0, 256), right: diff(resting, moving, 256, 512) };
      let rejected = 0;
      for (const frame of [{ time: NaN }, { time: -1 }, { hover: { instance: 1, uv: [2, 0] } }]) {
        try {
          r.render({ viewProjection: api.IDENTITY, ...frame });
        } catch {
          rejected++;
        }
      }
      const image = await r.exportCard(1, { revision: 1, width: 256, finish: 'pool', time: 2 });
      const bitmap = await createImageBitmap(image);
      const exported = [bitmap.width, bitmap.height];
      bitmap.close();
      return {
        finishes,
        localized,
        slosh,
        rejected,
        exported,
        before,
        after: r.metrics,
        glError: gl.getError(),
      };
    } finally {
      r.dispose();
    }
  });
  for (const [finish, result] of Object.entries(report.finishes)) {
    assert.ok(result.changed > 500, finish + ' did not animate');
    assert.equal(result.fixedTimeDiff, 0, finish + ' changed with a fixed clock');
    assert.deepEqual(result.badge, [0, 255, 0, 255], finish + ' warped an over-finish badge');
    assert.deepEqual(result.dry, result.regularDry, finish + ' ignored the exclusion mask');
    assert.equal(result.corner[3], 0, finish + ' escaped the card silhouette');
  }
  assert.ok(report.localized.left > 200, 'Hover did not create a ripple');
  assert.equal(report.localized.right, 0, 'Ripple leaked onto another instance');
  assert.ok(report.slosh.left > 200, 'Motion did not leave damped slosh');
  assert.equal(report.slosh.right, 0, 'Slosh leaked onto another instance');
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads', 'readbacks'])
    assert.equal(report.before[key], report.after[key], key + ' changed during surface animation');
  assert.equal(report.rejected, 3);
  assert.equal(report.glError, 0);
  assert.deepEqual(report.exported, [256, 384]);
  // Verify the showcase really applies pointer tilt and hands back to idle motion.
  await page.evaluate(() => window.lab.pause(false));
  const rect = await page.locator('#scene').boundingBox();
  await page.mouse.move(rect.x + rect.width * 0.26, rect.y + rect.height * 0.34);
  await page.waitForTimeout(350);
  const hover = await page.evaluate(() => ({
    state: window.lab.motionState(),
    matrix: window.lab.instances()[0].transform,
  }));
  assert.equal(hover.state.hover?.instance, 1);
  assert.ok(Math.abs(hover.matrix[3]) + Math.abs(hover.matrix[7]) > 0, 'Missing perspective tilt');
  await page.mouse.move(0, 0);
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => window.lab.motionState().hover), undefined);
  assert.deepEqual(errors, []);
  await writeFile(
    'evidence/surfaces.json',
    JSON.stringify(
      {
        report,
        hover,
        errors,
        scope: 'Chromium software GPU; pixel correctness and cache counters, not hardware FPS',
      },
      null,
      2,
    ) + '\n',
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
