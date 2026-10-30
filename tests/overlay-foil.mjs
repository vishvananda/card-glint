import { chromium } from 'playwright';
import assert from 'node:assert/strict';
// Match the showcase's fully software backend. WebGL-only fallback can lose
// its context on local startup, including with the unmodified released core.
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  const result = await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
    const { createRenderer, canvas, IDENTITY } = window.lab.api;
    const output = canvas([160, 220]);
    const r = await createRenderer({ canvas: output });
    const raster = (printing) => ({
      key: 'foil-fixture-' + printing,
      size: [160, 220],
      async paint() {
        const c = canvas([160, 220]),
          ctx = c.getContext('2d');
        ctx.fillStyle = printing ? '#444f66' : '#337755';
        ctx.fillRect(0, 0, 160, 220);
        if (printing) ctx.clearRect(16, 20, 128, 90);
        else {
          ctx.fillStyle = '#d8bc65';
          for (let x = 20; x < 150; x += 12) ctx.fillRect(x, 25, 3, 80);
        }
        return c;
      },
    });
    let revision = 0;
    const documentFor = (tone, strength = 0.42) => ({
      id: 1,
      revision: ++revision,
      recipe: {
        pack: 'test',
        color: raster(false),
        edges: [],
        artWindows: [[0.1, 20 / 220, 0.8, 90 / 220]],
        cornerRadius: 0,
        regions: [],
        overlayFoil: tone ? { tone, strength } : undefined,
      },
      layers: [{ id: 'printing', order: 0, stage: 'over-finish', raster: raster(true) }],
    });
    const read = async (time, pointer = [0.5, 0.5]) => {
      r.updateScene([
        {
          id: 1,
          card: 1,
          finish: 'heat',
          transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
        },
      ]);
      await r.ready(1, revision);
      r.render({ viewProjection: IDENTITY, time, pointer });
      const c = canvas([160, 220]),
        ctx = c.getContext('2d');
      ctx.drawImage(output, 0, 0);
      return [...ctx.getImageData(70, 175, 1, 1).data];
    };
    const rows = [];
    try {
      for (const tone of [undefined, 'gold', 'silver', 'prismatic']) {
        const doc = documentFor(tone);
        r.upsertCards([doc]);
        await r.ready(1, revision);
        rows.push({
          tone: tone ?? 'none',
          a: await read(1),
          b: await read(3),
          tilted: await read(3, [0.1, 0.7]),
          metrics: r.metrics,
        });
      }
      let rejected = 0;
      for (const bad of [
        { tone: 'heat', strength: 0.3 },
        { tone: 'gold', strength: NaN },
        { tone: 'silver', strength: 2 },
      ]) {
        const d = documentFor('gold');
        d.recipe.overlayFoil = bad;
        try {
          r.upsertCards([d]);
        } catch {
          rejected++;
        }
      }
      return { rows, rejected };
    } finally {
      r.dispose();
    }
  });
  assert.equal(result.rejected, 3);
  for (const row of result.rows) {
    assert.deepEqual(row.a, row.b, 'Printing moved with optical time: ' + row.tone);
    if (row.tone !== 'none') {
      assert.notDeepEqual(row.a, result.rows[0].a, 'Missing ' + row.tone + ' reflection');
      assert.notDeepEqual(row.a, row.tilted, 'Reflection did not follow tilt');
    }
    for (const key of ['compositions', 'edgeBuilds', 'maskBuilds', 'uploads'])
      assert.equal(
        row.metrics[key],
        result.rows[0].metrics[key],
        key + ' changed with foil uniforms',
      );
  }
  console.log('PASS sharp overlay reflection, tone/tilt response, validation and cached textures.');
} finally {
  await browser.close();
}
