import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  const deadline = setTimeout(() => void browser.close(), 120000);
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  const report = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const api = window.lab.api,
      c = api.canvas([732, 1020]),
      r = await api.createRenderer({ canvas: c });
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
      gl = c.getContext('webgl2');
    const pixels = () => {
      const a = new Uint8Array(c.width * c.height * 4);
      gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, a);
      return a;
    };
    const difference = (a, b) => a.reduce((n, v, i) => n + Math.abs(v - b[i]), 0) / a.length;
    const frame = { viewProjection: api.IDENTITY, pointer: [0.88, 0.15], time: 0 };
    const draw = (amount, finish = 'gloss', options = {}) => {
      r.updateScene([
        {
          id: 17,
          card: 1,
          transform,
          finish,
          cardstock: amount === undefined ? undefined : { amount },
          ...options,
        },
      ]);
      r.render(frame);
      return pixels();
    };
    try {
      r.upsertCards([
        {
          id: 1,
          revision: 1,
          recipe: {
            pack: 'coating-test',
            color: {
              key: 'coating-test-ink',
              size: [732, 1020],
              async paint() {
                const ink = api.canvas([732, 1020]),
                  ctx = ink.getContext('2d');
                ctx.fillStyle = '#263445';
                ctx.fillRect(0, 0, 732, 1020);
                ctx.fillStyle = '#9d6842';
                ctx.fillRect(40, 100, 652, 550);
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
      const original = draw(),
        zero = draw(0),
        initial = r.metrics;
      const medium = draw(0.2),
        allocated = r.metrics,
        strong = draw(1);
      const regular0 = draw(0, 'regular'),
        regular1 = draw(1, 'regular');
      const foil0 = draw(0, 'prismatic'),
        foil1 = draw(1, 'prismatic');
      frame.time = 100;
      const later = draw(0.2);
      frame.time = 0;
      const spec = { amount: 0.2 };
      r.updateScene([{ id: 17, card: 1, transform, finish: 'gloss', cardstock: spec }]);
      spec.amount = 1;
      r.render(frame);
      const isolated = pixels();
      frame.pointer = [0.1, 0.7];
      const tilted = draw(0.2);
      frame.pointer = [0.88, 0.15];
      let rejected = 0;
      for (const amount of [-1, 1.01, NaN, Infinity])
        try {
          draw(amount);
        } catch {
          rejected++;
        }
      draw(0.2);
      const png = await r.exportCard(1, {
        revision: 1,
        width: 732,
        finish: 'gloss',
        pointer: frame.pointer,
        cardstock: { amount: 0.2 },
      });
      const image = await createImageBitmap(png),
        copy = api.canvas([732, 1020]),
        ctx = copy.getContext('2d');
      ctx.drawImage(image, 0, 0);
      image.close();
      // WebGL readback is bottom-up; Canvas pixels are top-down.
      const exported = ctx.getImageData(0, 0, 732, 1020).data,
        flipped = new Uint8Array(exported.length);
      for (let y = 0; y < 1020; y++)
        flipped.set(exported.subarray(y * 732 * 4, (y + 1) * 732 * 4), (1019 - y) * 732 * 4);
      const exportDifference = difference(medium, flipped);
      // A second textured instance and animated intensity must reuse the map.
      for (let i = 0; i < 8; i++) draw(i / 8, 'gloss', { id: 18 });
      const warm = r.metrics;
      c.width = 73;
      c.height = 102;
      const tiny0 = draw(0),
        tiny1 = draw(0.2),
        tinyDifference = difference(tiny0, tiny1);
      c.width = 732;
      c.height = 1020;
      // Resources are recreated by the renderer's existing context lifecycle.
      const extension = gl.getExtension('WEBGL_lose_context');
      const lost = new Promise((resolve) =>
        c.addEventListener('webglcontextlost', resolve, { once: true }),
      );
      extension.loseContext();
      await lost;
      const restored = new Promise((resolve) =>
        c.addEventListener('webglcontextrestored', resolve, { once: true }),
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      extension.restoreContext();
      await restored;
      await r.ready(1, 1);
      const restoredPixels = draw(0.2);
      return {
        zeroDifference: difference(original, zero),
        mediumDifference: difference(original, medium),
        strongDifference: difference(original, strong),
        timeDifference: difference(medium, later),
        mutationDifference: difference(medium, isolated),
        tiltDifference: difference(medium, tilted),
        regularDifference: difference(regular0, regular1),
        foilDifference: difference(foil0, foil1),
        rejected,
        exportDifference,
        tinyDifference,
        restoredDifference: difference(medium, restoredPixels),
        initial,
        allocated,
        warm,
        restored: r.metrics,
        glError: gl.getError(),
      };
    } finally {
      r.dispose();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  clearTimeout(deadline);
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.zeroDifference, 0);
  assert.ok(report.mediumDifference > 0.1);
  assert.ok(report.strongDifference > report.mediumDifference * 4);
  assert.equal(report.timeDifference, 0);
  assert.equal(report.mutationDifference, 0);
  assert.ok(report.tiltDifference > 0.1);
  assert.equal(report.regularDifference, 0);
  assert.equal(report.foilDifference, 0);
  assert.equal(report.rejected, 4);
  assert.equal(report.exportDifference, 0);
  assert.ok(report.tinyDifference < report.mediumDifference * 0.2);
  assert.equal(report.restoredDifference, 0);
  assert.equal(report.glError, 0);
  assert.equal(report.allocated.surfacePasses, report.initial.surfacePasses + 1);
  assert.ok(report.allocated.surfaceBytes > report.initial.surfaceBytes + 3000000);
  for (const key of [
    'surfacePasses',
    'surfaceBytes',
    'compositions',
    'maskBuilds',
    'edgeBuilds',
    'uploads',
    'readbacks',
  ])
    assert.equal(report.warm[key], report.allocated[key], key + ' changed after warmup');
  assert.deepEqual(errors, []);
  await mkdir('evidence', { recursive: true });
  await writeFile(
    'evidence/cardstock.json',
    JSON.stringify(
      {
        report,
        errors,
        scope: 'Linux Chromium SwiftShader; pixel/caching checks, no hardware performance claim',
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    'PASS cardstock levels, stable relief, lighting, defaults, export parity, mip filtering, cache reuse and context restoration',
  );
} finally {
  await browser.close();
}
