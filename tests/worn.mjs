import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1664, height: 1100 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(
    (process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/') + '?finish=gloss&wear=heavy',
  );
  await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
  });
  assert.equal(await page.locator('#finish').inputValue(), 'gloss');
  assert.equal(await page.locator('#wear').inputValue(), 'heavy');
  assert.deepEqual(
    await page.evaluate(() => window.lab.instances().map((i) => i.wear.amount)),
    [1, 1, 1, 1],
  );
  const report = await page.evaluate(async () => {
    const { api } = window.lab;
    const c = api.canvas([384, 536]);
    const r = await api.createRenderer({ canvas: c });
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    const gl = c.getContext('webgl2');
    const pixels = () => {
      const data = new Uint8Array(c.width * c.height * 4);
      gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      return data;
    };
    const difference = (a, b) => a.reduce((n, v, i) => n + Math.abs(v - b[i]), 0) / a.length;
    try {
      r.upsertCards([
        {
          id: 1,
          revision: 1,
          recipe: {
            pack: 'wear-test',
            color: {
              key: 'wear-test-ink',
              size: [384, 536],
              async paint() {
                const ink = api.canvas([384, 536]);
                const ctx = ink.getContext('2d');
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
      const draw = async ({
        id = 17,
        time = 0,
        pointer = [0.5, 0.5],
        finish = 'gloss',
        amount = 1,
        seed,
        deformation,
      } = {}) => {
        r.updateScene([
          {
            id,
            card: 1,
            transform,
            finish,
            wear: amount === undefined ? undefined : { amount, seed },
            deformation,
          },
        ]);
        await r.ready(1, 1);
        r.render({ viewProjection: api.IDENTITY, time, pointer });
        return pixels();
      };
      const first = await draw(),
        later = await draw({ time: 200 }),
        alternate = await draw({ id: 18 }),
        persisted = await draw({ id: 18, seed: 17 });
      const light = await draw({ pointer: [0.22, 0.64] });
      let invalid = 0;
      for (const wear of [
        { amount: -1 },
        { amount: 1.1 },
        { amount: NaN },
        { amount: 1, seed: -1 },
        { amount: 1, seed: 1.5 },
        { amount: 1, seed: 2 ** 32 },
      ]) {
        try {
          r.updateScene([{ id: 17, card: 1, transform, wear }]);
        } catch {
          invalid++;
        }
      }
      const layered = {};
      for (const finish of [
        'regular',
        'gloss',
        'etched',
        'prismatic',
        'cold',
        'opal',
        'rain',
        'heat',
        'pool',
      ]) {
        const fresh = await draw({ finish, amount: 0 }),
          light = await draw({ finish, amount: 0.25 }),
          played = await draw({ finish, amount: 0.6 }),
          heavy = await draw({ finish });
        layered[finish] = {
          light: difference(fresh, light),
          played: difference(fresh, played),
          heavy: difference(fresh, heavy),
        };
      }
      const fresh = await draw({ amount: 0 });
      r.updateScene([{ id: 17, card: 1, transform, finish: 'gloss' }]);
      await r.ready(1, 1);
      r.render({ viewProjection: api.IDENTITY, time: 0 });
      const freshDifference = difference(fresh, pixels());
      const gain = { edge: 0, interior: 0 },
        count = { edge: 0, interior: 0 };
      let bright = 0,
        dark = 0;
      for (let y = 15; y < c.height - 15; y++)
        for (let x = 0; x < c.width; x++) {
          const i = (y * c.width + x) * 4;
          if (!first[i + 3]) continue;
          const zone =
            x < 3 || x >= c.width - 3
              ? 'edge'
              : x > 80 && x < 300 && y > 80 && y < 450
                ? 'interior'
                : null;
          if (zone) {
            gain[zone] += first[i] - fresh[i];
            count[zone]++;
          }
          if (zone === 'edge') {
            if (first[i] > 140) bright++;
            if (first[i] < 90) dark++;
          }
        }
      const before = r.metrics;
      for (let i = 0; i < 8; i++)
        await draw({ time: i, pointer: [i / 8, 0.5], finish: 'prismatic', amount: i / 8 });
      const after = r.metrics;
      const exported = async (id, time, seed) => {
        const blob = await r.exportCard(1, {
          revision: 1,
          width: 384,
          finish: 'prismatic',
          instanceId: id,
          time,
          wear: { amount: 1, seed },
        });
        return new Uint8Array(await blob.arrayBuffer());
      };
      const exportFirst = await exported(17, 0),
        exportLater = await exported(17, 99),
        exportOther = await exported(18, 0),
        exportPersisted = await exported(18, 0, 17);
      const equal = (a, b) => a.length === b.length && difference(a, b) === 0;
      const deformed = async (seed) =>
        (await draw({ seed, time: 2, deformation: { kind: 'heat', amount: 0.012 } })).filter(
          (_, i) => i % 4 === 3,
        );
      const silhouetteDifference = difference(await deformed(17), await deformed(18));
      return {
        timeDifference: difference(first, later),
        freshDifference,
        seedDifference: difference(first, alternate),
        persistedDifference: difference(first, persisted),
        invalid,
        lightDifference: difference(first, light),
        silhouetteDifference,
        layered,
        edgeGain: gain.edge / count.edge,
        interiorGain: gain.interior / count.interior,
        brightEdgePixels: bright,
        darkEdgePixels: dark,
        exportTimeEqual: equal(exportFirst, exportLater),
        exportSeedEqual: equal(exportFirst, exportOther),
        exportPersistedEqual: equal(exportFirst, exportPersisted),
        before,
        after,
        glError: gl.getError(),
      };
    } finally {
      r.dispose();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.timeDifference, 0, 'Wear crawled over time');
  assert.equal(report.freshDifference, 0, 'Zero wear changed the original finish');
  assert.ok(report.seedDifference > 1, 'Different instances share identical wear');
  assert.equal(report.persistedDifference, 0, 'Explicit seed changed with instance ID');
  assert.equal(report.invalid, 6, 'Invalid wear settings accepted');
  assert.equal(report.silhouetteDifference, 0, 'Wear changed deformation geometry');
  assert.ok(report.lightDifference > 1, 'Intact gloss did not respond to lighting');
  assert.ok(
    report.edgeGain > report.interiorGain + 20,
    'Wear is not concentrated on the perimeter',
  );
  assert.ok(
    report.brightEdgePixels > 100 && report.darkEdgePixels > 100,
    'Edge wear must be broken',
  );
  for (const [finish, levels] of Object.entries(report.layered)) {
    assert.ok(levels.light > 0.1, finish + ' has no light wear');
    assert.ok(
      levels.played > levels.light && levels.heavy > levels.played,
      finish + ' wear levels did not progress',
    );
  }
  assert.equal(report.exportTimeEqual, true, 'Export wear changed over time');
  assert.equal(report.exportSeedEqual, false, 'Export ignored instance seed');
  assert.equal(report.exportPersistedEqual, true, 'Export ignored explicit seed');
  for (const key of [
    'compositions',
    'maskBuilds',
    'edgeBuilds',
    'uploads',
    'readbacks',
    'surfacePasses',
  ])
    assert.equal(report.before[key], report.after[key], key + ' changed during tilt/wear');
  assert.equal(report.glError, 0);
  assert.deepEqual(errors, []);
  await page.locator('#scene').screenshot({ path: 'evidence/worn.png' });
  await page.locator('#scope').click();
  await page.waitForFunction(() => !document.querySelector('#scope').disabled);
  const coverage = await page.evaluate(async () => {
    const r = await window.lab.ready,
      card = window.lab.documents[0];
    const image = async (finish, wear) => {
      const blob = await r.exportCard(card.id, {
        revision: card.revision,
        width: 384,
        finish,
        wear,
      });
      const bitmap = await createImageBitmap(blob),
        canvas = window.lab.api.canvas([bitmap.width, bitmap.height]);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    const base = await image('regular'),
      actual = await image('prismatic', { amount: 1, seed: 17 });
    let inside = 0,
      outside = 0;
    for (let y = 5; y < base.height - 5; y++)
      for (let x = 5; x < base.width - 5; x++) {
        const i = (y * base.width + x) * 4;
        if (!base.data[i + 3]) continue;
        const changed = [0, 1, 2].some((c) => Math.abs(base.data[i + c] - actual.data[i + c]) > 2);
        if (!changed) continue;
        const art = card.recipe.artWindows.some(
          ([l, t, w, h]) =>
            x / base.width > l &&
            x / base.width < l + w &&
            y / base.height > t &&
            y / base.height < t + h,
        );
        const boundary = card.recipe.artWindows.some(
          ([l, t, w, h]) =>
            Math.min(
              Math.abs(x / base.width - l),
              Math.abs(x / base.width - l - w),
              Math.abs(y / base.height - t),
              Math.abs(y / base.height - t - h),
            ) < 0.01,
        );
        if (!boundary) {
          if (art) inside++;
          else outside++;
        }
      }
    return { inside, outside };
  });
  assert.ok(coverage.inside > 100, 'Worn foil missing from artwork');
  assert.equal(coverage.outside, 0, 'Wear escaped coverage or damaged protected printing');
  await writeFile(
    'evidence/worn.json',
    JSON.stringify(
      {
        report,
        coverage,
        errors,
        scope: 'Chromium software GPU; pixel and cache checks, not GPU completion timing',
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
}
