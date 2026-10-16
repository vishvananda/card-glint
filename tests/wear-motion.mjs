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
    const { api } = window.lab,
      c = api.canvas([384, 536]),
      r = await api.createRenderer({ canvas: c }),
      gl = c.getContext('webgl2');
    try {
      r.upsertCards([
        {
          id: 1,
          revision: 1,
          recipe: {
            pack: 'motion-test',
            color: {
              key: 'motion-ink',
              size: [384, 536],
              async paint() {
                const ink = api.canvas([384, 536]),
                  ctx = ink.getContext('2d');
                ctx.fillStyle = '#263445';
                ctx.fillRect(0, 0, 384, 536);
                return ink;
              },
            },
            edges: [],
            artWindows: [],
            cornerRadius: 0.035,
            regions: [],
          },
        },
      ]);
      await r.ready(1, 1);
      const samples = [];
      for (const scale of [1, 0.35]) {
        const render = (dx) => {
          r.updateScene([
            {
              id: 17,
              card: 1,
              finish: 'regular',
              wear: { amount: 1 },
              transform: [
                2 * scale,
                0,
                0,
                0,
                0,
                -2,
                0,
                0,
                0,
                0,
                1,
                0,
                -scale + (2 * dx) / c.width,
                1,
                0,
                1,
              ],
            },
          ]);
          r.render({ viewProjection: api.IDENTITY });
          const pixels = new Uint8Array(c.width * c.height * 4);
          gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          return pixels;
        };
        const base = render(0);
        let error = 0,
          high = 0,
          count = 0;
        for (const dx of [0.125, 0.25, 0.5]) {
          const moved = render(dx);
          for (let y = 24; y < c.height - 24; y++)
            for (
              let x = Math.ceil(((1 - scale) * c.width) / 2) + 6;
              x < ((1 + scale) * c.width) / 2 - 6;
              x++
            ) {
              const i = (y * c.width + x) * 4;
              const expected = base[i] * (1 - dx) + base[i - 4] * dx;
              const residual = Math.abs(moved[i] - expected);
              error += residual;
              if (residual > 8) high++;
              count++;
            }
        }
        samples.push({ scale, meanResidual: error / count, unstableFraction: high / count });
      }
      return { samples, glError: gl.getError() };
    } finally {
      r.dispose();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.glError, 0);
  for (const sample of report.samples) {
    assert.ok(sample.meanResidual < 1.5, 'Subpixel motion changed resolved wear');
    assert.ok(sample.unstableFraction < 0.025, 'Wear flickered during foreshortening');
  }
  await writeFile(
    process.env.WEAR_MOTION_OUTPUT ?? 'evidence/wear-motion.json',
    JSON.stringify(report, null, 2) + '\n',
  );
} finally {
  await browser.close();
}
