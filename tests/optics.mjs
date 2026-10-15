import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  const report = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const api = window.lab.api,
      c = api.canvas([256, 384]);
    const r = await api.createRenderer({ canvas: c });
    r.upsertCards([
      {
        id: 1,
        revision: 1,
        recipe: {
          pack: 'optics-test',
          edges: [],
          artWindows: [],
          cornerRadius: 0,
          regions: [],
          color: {
            key: 'flat-gray',
            size: [64, 96],
            async paint() {
              const c = api.canvas([64, 96]),
                ctx = c.getContext('2d');
              ctx.fillStyle = '#555';
              ctx.fillRect(0, 0, 64, 96);
              return c;
            },
          },
        },
      },
    ]);
    try {
      await r.ready(1, 1);
      r.updateScene([
        {
          id: 1,
          card: 1,
          finish: 'pool',
          transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
        },
      ]);
      const gl = c.getContext('webgl2');
      const frame = (time) => {
        r.render({ viewProjection: api.IDENTITY, time });
        const bytes = new Uint8Array(256 * 384 * 4);
        gl.readPixels(0, 0, 256, 384, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
        return bytes;
      };
      const correlation = (a, b, dx, dy) => {
        let x = 0,
          y = 0,
          xx = 0,
          yy = 0,
          xy = 0,
          n = 0;
        for (let row = 24; row < 360; row += 3)
          for (let col = 24; col < 232; col += 3) {
            const av = a[(row * 256 + col) * 4],
              bv = b[((row + dy) * 256 + col + dx) * 4];
            x += av;
            y += bv;
            xx += av * av;
            yy += bv * bv;
            xy += av * bv;
            n++;
          }
        return (xy - (x * y) / n) / Math.sqrt((xx - (x * x) / n) * (yy - (y * y) / n));
      };
      const samples = [];
      for (const time of [2, 5, 9]) {
        const a = frame(time),
          b = frame(time + 0.6);
        const stationary = correlation(a, b, 0, 0);
        let best = { correlation: -1, dx: 0, dy: 0 };
        for (let dy = -16; dy <= 16; dy++)
          for (let dx = -16; dx <= 16; dx++) {
            const value = correlation(a, b, dx, dy);
            if (value > best.correlation) best = { correlation: value, dx, dy };
          }
        samples.push({ time, seconds: 0.6, stationary, best });
      }
      return {
        samples,
        scope:
          'Image-space correlation on a flat gray face; tests in-place undulating pool caustics without directional conveyor-belt drift.',
      };
    } finally {
      r.dispose();
    }
  });
  console.log(JSON.stringify(report, null, 2));
  for (const sample of report.samples) {
    assert.ok(sample.stationary < 0.92, 'Caustics remained static instead of undulating');
    assert.ok(
      Math.hypot(sample.best.dx, sample.best.dy) <= 4,
      'Caustics drifted like a conveyor belt instead of undulating in place',
    );
  }
  await writeFile('evidence/optics.json', JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser.close();
}
