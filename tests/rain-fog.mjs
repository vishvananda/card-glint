import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4290/card-glint/');
  const report = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const api = window.lab.api;
    const width = 244,
      height = 340,
      canvas = api.canvas([width, height]),
      renderer = await api.createRenderer({ canvas }),
      gl = canvas.getContext('webgl2');
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
      frame = { viewProjection: api.IDENTITY, pointer: [0.5, 0.5], time: 2 };
    const pixels = () => {
      const data = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      return data;
    };
    const difference = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;
    const draw = (rainFog, finish = 'rain') => {
      renderer.updateScene([{ id: 17, card: 1, finish, transform, rainFog }]);
      renderer.render(frame);
      return pixels();
    };
    try {
      renderer.upsertCards([
        {
          id: 1,
          revision: 1,
          recipe: {
            pack: 'rain-fog-test',
            edges: [],
            artWindows: [],
            cornerRadius: 0,
            regions: [],
            color: {
              key: 'rain-fog-test-grid',
              size: [width, height],
              async paint() {
                const c = api.canvas([width, height]),
                  ctx = c.getContext('2d');
                ctx.fillStyle = '#243a4b';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = '#c99052';
                for (let y = 0; y < height; y += 20)
                  for (let x = 0; x < width; x += 20)
                    if ((x + y) % 40 === 0) ctx.fillRect(x, y, 20, 20);
                return c;
              },
            },
          },
        },
      ]);
      await renderer.ready(1, 1);
      const original = draw(undefined),
        identity = draw(1),
        low = draw(0.7),
        high = draw(1.3),
        clear = draw(0),
        heavy = draw(2),
        warm = renderer.metrics;
      const unrelated = [];
      for (const finish of [
        'regular',
        'gloss',
        'etched',
        'prismatic',
        'cold',
        'opal',
        'heat',
        'pool',
      ])
        unrelated.push({ finish, difference: difference(draw(0, finish), draw(2, finish)) });
      let rejected = 0,
        atomic = true;
      draw(0.7);
      for (const value of [-0.01, 2.01, NaN, Infinity]) {
        try {
          draw(value);
        } catch {
          rejected++;
        }
        renderer.render(frame);
        atomic &&= difference(low, pixels()) === 0;
      }
      for (let i = 0; i < 10; i++) draw((i % 3) * 0.5);
      const cached = renderer.metrics;
      draw(0.7);
      const blob = await renderer.exportCard(1, {
          revision: 1,
          width,
          finish: 'rain',
          rainFog: 0.7,
          instanceId: 17,
          pointer: frame.pointer,
          time: 2,
        }),
        bitmap = await createImageBitmap(blob),
        copy = api.canvas([width, height]),
        ctx = copy.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      const exported = ctx.getImageData(0, 0, width, height).data,
        flipped = new Uint8Array(exported.length);
      for (let y = 0; y < height; y++)
        flipped.set(
          exported.subarray(y * width * 4, (y + 1) * width * 4),
          (height - y - 1) * width * 4,
        );
      return {
        apiVersion: api.rainFogVersion,
        identityDifference: difference(original, identity),
        lowDifference: difference(identity, low),
        highDifference: difference(identity, high),
        clearHeavyDifference: difference(clear, heavy),
        repeatDifference: difference(low, draw(0.7)),
        exportDifference: difference(low, flipped),
        unrelated,
        rejected,
        atomic,
        warm,
        cached,
      };
    } finally {
      renderer.dispose();
    }
  });
  assert.equal(report.apiVersion, 1);
  assert.equal(report.identityDifference, 0);
  assert.ok(report.lowDifference > 0.1);
  assert.ok(report.highDifference > 0.1);
  assert.ok(report.clearHeavyDifference > 1);
  assert.equal(report.repeatDifference, 0);
  assert.equal(report.exportDifference, 0);
  assert.equal(report.rejected, 4);
  assert.ok(report.atomic);
  for (const row of report.unrelated) assert.equal(row.difference, 0, row.finish);
  for (const key of ['preparations', 'edgeBuilds', 'uploads', 'readbacks'])
    assert.equal(report.warm[key], report.cached[key], key);
  assert.deepEqual(errors, []);
  await mkdir('evidence', { recursive: true });
  await writeFile(
    'evidence/rain-fog.json',
    JSON.stringify(
      {
        report,
        errors,
        scope:
          'Linux Chromium / SwiftShader, deterministic pixels and preparation counters; no physical GPU/device or performance claim.',
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    'PASS optional rain fog: unchanged default, independent density, unrelated finishes unchanged, cached preparation, atomic validation and PNG export parity',
  );
} finally {
  await browser.close();
}
