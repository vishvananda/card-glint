import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  const report = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const api = window.lab.api,
      c = api.canvas([640, 640]);
    c.style.width = c.style.height = '640px';
    document.body.append(c);
    const r = await api.createRenderer({ canvas: c });
    const raster = (key, color, rect = [0, 0, 240, 360]) => ({
      key,
      size: [240, 360],
      async paint() {
        const c = api.canvas([240, 360]),
          ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(...rect);
        return c;
      },
    });
    const recipe = (color) => ({
      pack: 'deformation-test',
      color,
      edges: [],
      artWindows: [],
      cornerRadius: 0.04,
      regions: [{ id: 'badge', rect: [0.4, 0.4, 0.2, 0.2] }],
    });
    r.upsertCards([
      {
        id: 1,
        revision: 1,
        recipe: recipe(raster('red-face', '#b52916')),
        layers: [
          {
            id: 'badge',
            order: 0,
            stage: 'over-finish',
            raster: raster('green-badge', '#00ff00', [96, 144, 48, 72]),
          },
        ],
      },
      { id: 2, revision: 1, recipe: recipe(raster('blue-face', '#122fa0')) },
    ]);
    await Promise.all([r.ready(1, 1), r.ready(2, 1)]);
    const front = {
      id: 17,
      card: 1,
      finish: 'regular',
      deformation: { kind: 'heat', amount: 0.02 },
      transform: [1.125, 0, 0, 0, 0, -1.6875, 0, 0, 0, 0, 1, 0, -0.5625, 0.84375, -0.2, 1],
    };
    const back = {
      id: 18,
      card: 2,
      transform: [1.25, 0, 0, 0, 0, -1.8125, 0, 0, 0, 0, 1, 0, -0.625, 0.90625, 0.2, 1],
    };
    const gl = c.getContext('webgl2');
    const capture = (time) => {
      r.render({ viewProjection: api.IDENTITY, time });
      const data = new Uint8Array(c.width * c.height * 4);
      gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      return data;
    };
    const at = (data, x, y, channel = 3) => data[((639 - y) * 640 + x) * 4 + channel];
    let compared = 0,
      mismatches = 0,
      bulges = 0,
      cutouts = 0,
      badgeChecked = 0;
    const before = r.metrics;
    try {
      for (const time of [0, 1.3, 3.1, 7.7]) {
        r.updateScene([front]);
        const mask = capture(time);
        // Discard antialias boundary pixels. Compare independently rasterized GPU
        // silhouette against Rust perspective picking, including background hits.
        r.updateScene([back, front]);
        const combined = capture(time);
        for (let y = 42; y < 598; y += 2)
          for (let x = 130; x < 510; x += 2) {
            const alpha = at(mask, x, y);
            if (
              ![0, 255].includes(alpha) ||
              [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
              ].some(([dx, dy]) => at(mask, x + dx, y + dy) !== alpha)
            )
              continue;
            const hit = r.hitTest(x + 0.5, y + 0.5);
            compared++;
            if (hit?.instance !== (alpha === 255 ? 17 : 18)) mismatches++;
            if (alpha === 255 && (x < 140 || x >= 500 || y < 50 || y >= 590)) bulges++;
            if (alpha === 0 && x >= 140 && x < 500 && y > 70 && y < 570) cutouts++;
            if (at(combined, x, y, 1) === 255 && at(combined, x, y, 0) === 0) {
              badgeChecked++;
              if (hit?.part !== 'badge') mismatches++;
            }
          }
      }
      r.updateScene([front]);
      const a = capture(2),
        same = capture(2),
        b = capture(3);
      let animated = 0,
        stationary = 0;
      for (let i = 3; i < a.length; i += 4) {
        if (a[i] !== b[i]) animated++;
        if (a[i] !== same[i]) stationary++;
      }
      const perspective = { ...front, transform: [...front.transform] };
      perspective.transform[3] = 0.12;
      perspective.transform[7] = -0.08;
      r.updateScene([perspective]);
      const angled = capture(2);
      let perspectiveChecks = 0;
      for (let y = 40; y < 610; y += 3)
        for (let x = 125; x < 530; x += 3) {
          const alpha = at(angled, x, y);
          if (
            ![0, 255].includes(alpha) ||
            [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ].some(([dx, dy]) => at(angled, x + dx, y + dy) !== alpha)
          )
            continue;
          perspectiveChecks++;
          if (!!r.hitTest(x + 0.5, y + 0.5) !== (alpha === 255)) mismatches++;
        }
      await r.setSceneLayers([
        {
          id: 'hud',
          stage: 'hud',
          depth: 'ignore',
          order: 0,
          raster: raster('hud-green', '#00ff00'),
          transform: [0.2, 0, 0, 0, 0, -0.2, 0, 0, 0, 0, 1, 0, -0.1, 0.1, 0, 1],
        },
      ]);
      const hud = capture(2);
      const hudPixel = [0, 1, 2, 3].map((ch) => at(hud, 320, 320, ch));
      await r.setSceneLayers([]);
      let rejected = 0;
      for (const deformation of [
        { kind: 'heat', amount: -0.1 },
        { kind: 'heat', amount: NaN },
        { kind: 'heat', amount: 0.03 },
        { kind: 'other', amount: 0.01 },
      ]) {
        try {
          r.updateScene([{ ...front, deformation }]);
        } catch {
          rejected++;
        }
      }
      const warm = r.metrics;
      for (let tick = 0; tick < 10; tick++) capture(tick / 10);
      const after = r.metrics;
      const blob = await r.exportCard(1, {
        revision: 1,
        width: 360,
        finish: 'heat',
        deformation: front.deformation,
        instanceId: front.id,
        time: 2,
      });
      const image = await createImageBitmap(blob),
        out = api.canvas([image.width, image.height]),
        ctx = out.getContext('2d');
      ctx.drawImage(image, 0, 0);
      image.close();
      const pixels = ctx.getImageData(0, 0, out.width, out.height).data;
      let boundary = 0;
      for (let x = 0; x < out.width; x++)
        boundary += pixels[x * 4 + 3] + pixels[((out.height - 1) * out.width + x) * 4 + 3];
      for (let y = 0; y < out.height; y++)
        boundary += pixels[y * out.width * 4 + 3] + pixels[(y * out.width + out.width - 1) * 4 + 3];
      return {
        compared,
        perspectiveChecks,
        mismatches,
        bulges,
        cutouts,
        badgeChecked,
        animated,
        stationary,
        hudPixel,
        rejected,
        warm,
        after,
        before,
        exported: [out.width, out.height],
        boundary,
        glError: gl.getError(),
      };
    } finally {
      r.dispose();
      c.remove();
    }
  });
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.mismatches, 0);
  assert.ok(report.compared > 10000);
  assert.ok(report.perspectiveChecks > 10000);
  assert.ok(report.bulges > 100);
  assert.ok(report.cutouts > 100);
  assert.ok(report.badgeChecked > 100);
  assert.ok(report.animated > 100);
  assert.equal(report.stationary, 0);
  assert.deepEqual(report.hudPixel, [0, 255, 0, 255]);
  assert.equal(report.rejected, 4);
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads', 'readbacks'])
    assert.equal(report.warm[key], report.after[key], key);
  assert.deepEqual(report.exported, [360, 540]);
  assert.equal(report.boundary, 0);
  assert.equal(report.glError, 0);
  assert.deepEqual(errors, []);
  // Public showcase only enables silhouette changes in Full card mode.
  await page.locator('#finish').selectOption('heat');
  assert.ok(
    await page.evaluate(() => window.lab.instances().every((i) => i.deformation?.amount > 0)),
  );
  await page.locator('#scope').click();
  await page.waitForFunction(() => !document.querySelector('#scope').disabled);
  assert.ok(await page.evaluate(() => window.lab.instances().every((i) => !i.deformation)));
  await writeFile(
    'evidence/deformation.json',
    JSON.stringify(
      {
        report,
        errors,
        scope:
          'Chromium software GPU; silhouette pixels versus Rust picking, layering and cache reuse, not hardware FPS.',
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
}
