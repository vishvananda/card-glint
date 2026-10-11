import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const url = process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/';
const browser = await chromium.launch({
  headless: true,
  // Match the showcase test's deterministic software backend.
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 1250 } }),
  errors = [],
  http = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('response', (response) => {
  if (response.status() >= 400) http.push([response.status(), response.url()]);
});
try {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const initial = await page.evaluate(async () => {
    const renderer = await window.lab.ready;
    window.lab.pause();
    return renderer.render({ viewProjection: window.lab.api.IDENTITY });
  });
  assert.equal(initial.visible, 3);
  assert.equal(initial.draws, 3);
  assert.equal(initial.readbacks, 0);
  await page.screenshot({ path: 'evidence/standalone.png', fullPage: true });
  const layouts = await page.evaluate(() => {
    const { layoutCards, sceneSize, documents } = window.lab;
    const results = [];
    for (const width of [360, 390, 768, 1350])
      for (const count of [3, 100, 2000])
        for (const overlap of [false, true]) {
          const { height } = sceneSize(width, count);
          const cards = layoutCards(documents, width, height, count, 'regular', overlap, 0);
          for (const card of cards) {
            const [nativeWidth, nativeHeight] = documents.find((d) => d.id === card.card).recipe
              .color.size;
            const m = card.transform;
            const ratio = (Math.hypot(m[0], m[2]) * width) / (Math.abs(m[5]) * height);
            if (Math.abs(ratio - nativeWidth / nativeHeight) > 1e-9)
              throw Error('Aspect ratio changed at ' + JSON.stringify({ width, count, overlap }));
          }
          results.push({ width, height, count, overlap });
        }
    return results;
  });
  const warm = await page.evaluate(async () => {
    const r = await window.lab.ready,
      before = r.metrics;
    for (let i = 0; i < 5; i++)
      await Promise.all(window.lab.documents.map((d) => r.ready(d.id, d.revision)));
    r.render({ viewProjection: window.lab.api.IDENTITY });
    return { before, after: r.metrics };
  });
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads'])
    assert.equal(warm.after[key], warm.before[key], key + ' rebuilt on hit');
  const edits = await page.evaluate(async () => {
    const { api, showcase } = window.lab,
      surface = document.createElement('canvas');
    surface.width = 244;
    surface.height = 340;
    const r = await api.createRenderer({ canvas: surface }),
      face = { ...window.lab.faces[0], name: 'First name' };
    try {
      r.upsertCards([{ id: 1, revision: 1, recipe: showcase.describe(face, 'table') }]);
      await r.ready(1, 1);
      const before = r.metrics;
      r.upsertCards([
        {
          id: 1,
          revision: 2,
          recipe: showcase.describe({ ...face, name: 'Second name' }, 'table'),
        },
      ]);
      await r.ready(1, 2);
      const renamed = r.metrics;
      let invalid = false;
      try {
        r.updateScene([{ id: 1.5, card: 1, transform: [...api.IDENTITY] }]);
      } catch {
        invalid = true;
      }
      let resolve;
      const raster = {
        key: 'delayed',
        size: [32, 32],
        paint: () =>
          new Promise((r) => {
            resolve = r;
          }),
      };
      r.upsertCards([
        {
          id: 2,
          revision: 1,
          recipe: {
            pack: 'test',
            color: raster,
            edges: [],
            artWindows: [],
            cornerRadius: 0,
            regions: [],
          },
        },
      ]);
      const stale = r.ready(2, 1).then(
        () => false,
        () => true,
      );
      await new Promise((r) => setTimeout(r, 0));
      r.resetEpoch(1);
      resolve(api.canvas([32, 32]));
      const canceled = await stale;
      await new Promise((r) => setTimeout(r, 20));
      return { before, renamed, invalid, canceled, reset: r.metrics };
    } finally {
      r.dispose();
      surface.getContext('webgl2').getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  assert.equal(edits.renamed.compositions, edits.before.compositions + 1);
  assert.equal(edits.renamed.edgeBuilds, edits.before.edgeBuilds);
  assert.equal(edits.renamed.maskBuilds, edits.before.maskBuilds);
  assert.equal(edits.invalid, true);
  assert.equal(edits.canceled, true);
  assert.equal(edits.reset.gpu.bytes, 0);
  assert.equal(edits.reset.cpu.bytes, 0);
  const layered = await page.evaluate(async () => {
    const { api } = window.lab;
    const surface = document.createElement('canvas');
    surface.width = surface.height = 128;
    const r = await api.createRenderer({ canvas: surface });
    const raster = (key, color) => ({
      key,
      size: [64, 64],
      async paint() {
        const c = api.canvas([64, 64]),
          ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 64, 64);
        return c;
      },
    });
    const recipe = (key, color) => ({
      pack: 'test',
      color: raster(key, color),
      edges: [],
      artWindows: [],
      cornerRadius: 0,
      regions: [{ id: 'body', rect: [0, 0, 1, 1] }],
    });
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    const pixels = () => {
      const gl = surface.getContext('webgl2'),
        out = new Uint8Array(4);
      gl.readPixels(64, 64, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, out);
      if (gl.getError() !== gl.NO_ERROR) throw Error('GL error');
      return [...out];
    };
    try {
      const docs = [
        { id: 1, revision: 1, recipe: recipe('red', '#ff0000') },
        { id: 2, revision: 1, recipe: recipe('blue', '#0000ff') },
      ];
      r.upsertCards(docs);
      await Promise.all(docs.map((d) => r.ready(d.id, 1)));
      r.updateScene([
        { id: 1, card: 1, transform, finish: 'opal' },
        { id: 2, card: 2, transform: [...transform.slice(0, 14), -0.3, 1], finish: 'regular' },
      ]);
      r.render({ viewProjection: api.IDENTITY });
      const overlapping = pixels();
      const badge = {
        id: 'badge',
        order: 0,
        stage: 'over-finish',
        raster: raster('badge', '#00ff00'),
      };
      r.upsertCards([{ ...docs[0], revision: 2, layers: [badge] }]);
      const before = r.metrics;
      await r.ready(1, 2);
      const after = r.metrics;
      r.updateScene([{ id: 1, card: 1, transform, finish: 'opal' }]);
      r.render({ viewProjection: api.IDENTITY });
      const overFoil = pixels();
      r.upsertCards([
        {
          ...docs[0],
          revision: 3,
          layers: [
            {
              ...badge,
              stage: 'under-finish',
              raster: raster('empty', 'transparent'),
              finishCoverage: { exclude: raster('exclude', '#ffffff') },
            },
          ],
        },
      ]);
      await r.ready(1, 3);
      r.render({ viewProjection: api.IDENTITY });
      const excluded = pixels();
      await r.setSceneLayers([
        {
          id: 'world',
          order: 0,
          stage: 'world-interleaved',
          depth: 'test-readonly',
          raster: raster('blue', '#0000ff'),
          transform: [...transform.slice(0, 14), 0.2, 1],
        },
      ]);
      r.render({ viewProjection: api.IDENTITY });
      const behind = pixels();
      await r.setSceneLayers([
        {
          id: 'world',
          order: 0,
          stage: 'world-interleaved',
          depth: 'test-readonly',
          raster: raster('blue', '#0000ff'),
          transform: [...transform.slice(0, 14), -0.2, 1],
        },
      ]);
      r.render({ viewProjection: api.IDENTITY });
      const inFront = pixels();
      const blob = await r.exportCard(1, { revision: 3, width: 128, finish: 'opal' }),
        image = await createImageBitmap(blob),
        exported = [image.width, image.height];
      image.close();
      r.resetEpoch(1);
      const reset = r.metrics;
      return { overlapping, overFoil, excluded, behind, inFront, before, after, exported, reset };
    } finally {
      r.dispose();
      surface.getContext('webgl2').getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  assert.deepEqual(layered.overlapping, [0, 0, 255, 255]);
  assert.deepEqual(layered.overFoil, [0, 255, 0, 255]);
  assert.deepEqual(layered.excluded, [255, 0, 0, 255]);
  assert.deepEqual(layered.behind, [255, 0, 0, 255]);
  assert.deepEqual(layered.inFront, [0, 0, 255, 255]);
  assert.equal(layered.before.maskBuilds, layered.after.maskBuilds);
  assert.equal(layered.before.compositions, layered.after.compositions);
  assert.deepEqual(layered.exported, [128, 128]);
  assert.equal(layered.reset.gpu.bytes, 0);
  const recovery = await page.evaluate(async () => {
    const { api } = window.lab,
      surface = document.createElement('canvas');
    surface.width = surface.height = 32;
    let layerPaints = 0,
      failures = 0;
    const r = await api.createRenderer({
      canvas: surface,
      budgets: { gpuBytes: 12288 },
      onError: () => {},
    });
    const transform = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
    const raster = (key, color) => ({
      key,
      size: [32, 32],
      async paint() {
        if (key === 'world') layerPaints++;
        const c = api.canvas([32, 32]),
          ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 32, 32);
        return c;
      },
    });
    const recipe = (color) => ({
      pack: 'test',
      color,
      edges: [],
      artWindows: [],
      cornerRadius: 0,
      regions: [],
    });
    try {
      await r.setSceneLayers([
        {
          id: 'world',
          order: 0,
          stage: 'hud',
          depth: 'ignore',
          transform,
          raster: raster('world', '#0000ff'),
        },
      ]);
      for (const id of [1, 2]) {
        r.upsertCards([{ id, revision: 1, recipe: recipe(raster('card' + id, '#ff0000')) }]);
        await r.ready(id, 1);
      }
      const evictions = r.metrics.gpu.evictions;
      r.releaseCards(new Uint32Array([1, 2]));
      r.render({ viewProjection: api.IDENTITY });
      await new Promise((resolve) => setTimeout(resolve, 20));
      r.render({ viewProjection: api.IDENTITY });
      const gl = surface.getContext('webgl2'),
        pixels = new Uint8Array(4);
      gl.readPixels(16, 16, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      await r.setSceneLayers([]);
      r.upsertCards([
        {
          id: 3,
          revision: 1,
          recipe: recipe({
            key: 'failure',
            size: [32, 32],
            async paint() {
              failures++;
              throw Error('Unavailable');
            },
          }),
        },
      ]);
      r.updateScene([{ id: 3, card: 3, transform }]);
      for (let i = 0; i < 3; i++) {
        r.render({ viewProjection: api.IDENTITY });
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      const automaticAttempts = failures;
      await r.ready(3, 1).catch(() => {});
      return {
        evictions,
        layerPaints,
        pixels: [...pixels],
        automaticAttempts,
        explicitAttempts: failures,
      };
    } finally {
      r.dispose();
      surface.getContext('webgl2').getExtension('WEBGL_lose_context')?.loseContext();
    }
  });
  assert.ok(recovery.evictions > 0);
  assert.equal(recovery.layerPaints, 2);
  assert.deepEqual(recovery.pixels, [0, 0, 255, 255]);
  assert.equal(recovery.automaticAttempts, 1);
  assert.equal(recovery.explicitAttempts, 2);
  const scene = await page.evaluate(async () => {
    const r = await window.lab.ready,
      { api } = window.lab,
      before = r.metrics;
    const count = 2000,
      cols = 50,
      rows = 40;
    r.updateScene(
      Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        card: 1 + Math.min(2, Math.floor(i / (count / 3))),
        finish: 'opal',
        transform: [
          1.9 / cols,
          0,
          0,
          0,
          0,
          -1.9 / rows,
          0,
          0,
          0,
          0,
          1,
          0,
          -0.95 + ((i % cols) * 1.9) / cols,
          0.95 - (Math.floor(i / cols) * 1.9) / rows,
          0,
          1,
        ],
      })),
    );
    const times = [];
    for (let i = 0; i < 12; i++) {
      const start = performance.now();
      r.render({ viewProjection: api.IDENTITY });
      if (i >= 2) times.push(performance.now() - start);
    }
    return { before, after: r.metrics, submissionMs: times };
  });
  assert.equal(scene.after.visible, 2000);
  assert.equal(scene.after.draws, 3);
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads'])
    assert.equal(scene.before[key], scene.after[key], key + ' rebuilt during animation');
  const context = await page.evaluate(async () => {
    const r = await window.lab.ready,
      surface = document.querySelector('#scene'),
      gl = surface.getContext('webgl2'),
      extension = gl.getExtension('WEBGL_lose_context');
    if (!extension) return { available: false };
    const lost = new Promise((resolve) =>
      surface.addEventListener('webglcontextlost', resolve, { once: true }),
    );
    extension.loseContext();
    await lost;
    await new Promise((resolve) => setTimeout(resolve, 100));
    const restored = new Promise((resolve) =>
      surface.addEventListener('webglcontextrestored', resolve, { once: true }),
    );
    extension.restoreContext();
    await restored;
    await Promise.all(window.lab.documents.map((d) => r.ready(d.id, d.revision)));
    r.render({ viewProjection: window.lab.api.IDENTITY });
    return { available: true, metrics: r.metrics, error: gl.getError() };
  });
  if (context.available) {
    assert.equal(context.error, 0);
    assert.equal(context.metrics.visible, 2000);
    assert.equal(context.metrics.draws, 3);
  }
  const cache = await page.evaluate(() =>
    window.lab.benchmarkCaches(window.lab.documents[0].recipe.edges[0].asset.url),
  );
  assert.equal(cache.byteExact, true);
  for (const mode of ['rust', 'gpu']) {
    assert.equal(cache.paths[mode].hot.edgeBuilds, 0);
    assert.equal(cache.paths[mode].hot.uploads, 0);
    assert.equal(cache.paths[mode].fitted.edgeBuilds, 0);
    assert.equal(cache.paths[mode].pressure.evictions, 20);
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(http, []);
  const report = {
    url,
    browser: 'Chromium / SwiftShader',
    initial,
    layouts,
    warm,
    layered,
    recovery,
    edits,
    scene,
    context,
    cache,
    errors,
    http,
  };
  await writeFile('evidence/browser.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ initial, scene: scene.after, cache }, null, 2));
} catch (error) {
  await page.screenshot({ path: 'evidence/failure.png', fullPage: true }).catch(() => {});
  console.error({ errors, http });
  throw error;
} finally {
  await browser.close();
}
