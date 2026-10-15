import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/__hologram_fixture__', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Hologram integration test</title>',
    }),
  );
  await page.goto(server.resolvedUrls.local[0] + '__hologram_fixture__');
  const result = await page.evaluate(async () => {
    const { createRenderer, canvas, IDENTITY } = await import('/packages/browser/src/index.ts');
    const size = [244, 340],
      output = canvas(size);
    const renderer = await createRenderer({ canvas: output });
    const color = {
      key: 'hologram-original-fixture-v1',
      size,
      async paint() {
        const c = canvas(size),
          ctx = c.getContext('2d');
        ctx.fillStyle = '#807d78';
        ctx.fillRect(0, 0, ...size);
        ctx.fillStyle = '#bfbbad';
        for (let y = 8; y < 340; y += 12)
          for (let x = 8; x < 244; x += 12) ctx.fillRect(x, y, 6, 6);
        ctx.strokeStyle = '#12171c';
        ctx.lineWidth = 4;
        ctx.strokeRect(3, 3, 238, 334);
        return c;
      },
    };
    let maskPaints = 0;
    const mask = {
      key: 'hologram-ellipse-v1',
      size: [96, 48],
      async paint() {
        maskPaints++;
        const c = canvas([96, 48]),
          ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(48, 24, 43, 19, 0, 0, Math.PI * 2);
        ctx.fill();
        // An asymmetric aperture catches an upside-down local mask.
        ctx.clearRect(0, 0, 48, 24);
        return c;
      },
    };
    const bounds = [0.35, 0.8, 0.3, 0.12];
    let revision = 0;
    let phase = 'initial';
    const documentFor = (hologram) => ({
      id: 1,
      revision: ++revision,
      recipe: {
        pack: 'hologram-test',
        color,
        edges: [],
        artWindows: [],
        cornerRadius: 0,
        regions: [],
        hologram,
      },
    });
    const set = async (hologram) => {
      const d = documentFor(hologram);
      phase = 'prepare revision ' + d.revision;
      renderer.upsertCards([d]);
      await renderer.ready(1, d.revision);
      return d;
    };
    const read = (finish = 'regular', pointer = [0.5, 0.5], normal = [0, 0, 1]) => {
      renderer.updateScene([
        {
          id: 1,
          card: 1,
          finish,
          normal,
          transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
        },
      ]);
      renderer.render({ viewProjection: IDENTITY, pointer, time: 2 });
      const c = canvas(size),
        ctx = c.getContext('2d');
      ctx.drawImage(output, 0, 0);
      const p = ctx.getImageData(0, 0, ...size).data;
      c.width = c.height = 0;
      return p;
    };
    const diff = (a, b) => {
      let inside = 0,
        outside = 0,
        maximum = 0;
      for (let y = 0; y < size[1]; y++)
        for (let x = 0; x < size[0]; x++) {
          const i = (y * size[0] + x) * 4;
          const d = Math.max(...[0, 1, 2].map((k) => Math.abs(a[i + k] - b[i + k])));
          if (!d) continue;
          maximum = Math.max(maximum, d);
          if (
            x < bounds[0] * size[0] ||
            x >= (bounds[0] + bounds[2]) * size[0] ||
            y < bounds[1] * size[1] ||
            y >= (bounds[1] + bounds[3]) * size[1]
          )
            outside++;
          else inside++;
        }
      return { inside, outside, maximum };
    };
    try {
      await set();
      const regular = read(),
        foil = read('prismatic');
      const h = { mask, rect: bounds, strength: 0.8, seed: 48 };
      await set(h);
      const neutral = read(),
        tilted = read('regular', [0.2, 0.75], [0.22, -0.14, 0.96]);
      const foilHolo = read('prismatic');
      const differences = {
        regular: diff(regular, neutral),
        foil: diff(foil, foilHolo),
        angle: diff(neutral, tilted),
      };
      const changedAt = (x, y) => {
        const i = (y * size[0] + x) * 4;
        return [0, 1, 2].some((k) => regular[i + k] !== neutral[i + k]);
      };
      const maskOrientation = !changedAt(112, 282) && changedAt(112, 302);
      const before = renderer.metrics,
        beforePaints = maskPaints;
      let readbacks = 0,
        compilations = 0;
      const readOriginal = CanvasRenderingContext2D.prototype.getImageData;
      const compileOriginal = WebGL2RenderingContext.prototype.compileShader;
      CanvasRenderingContext2D.prototype.getImageData = function (...args) {
        readbacks++;
        return readOriginal.apply(this, args);
      };
      WebGL2RenderingContext.prototype.compileShader = function (...args) {
        compilations++;
        return compileOriginal.apply(this, args);
      };
      const start = performance.now();
      try {
        for (let i = 0; i < 120; i++)
          renderer.render({ viewProjection: IDENTITY, pointer: [i / 120, 0.6], time: i / 60 });
      } finally {
        CanvasRenderingContext2D.prototype.getImageData = readOriginal;
        WebGL2RenderingContext.prototype.compileShader = compileOriginal;
      }
      const submissionMs = (performance.now() - start) / 120;
      const after = renderer.metrics;
      await set({ ...h, seed: 8901, strength: 0.6 });
      const uniformOnly = renderer.metrics;
      phase = 'mask replacement';
      await set({ ...h, mask: { ...mask, key: 'second-mask' } });
      const replacement = renderer.metrics;
      await set(h);
      phase = 'batch isolation';
      const other = { ...documentFor({ ...h, strength: 0 }), id: 2, revision: 1 };
      renderer.upsertCards([other]);
      await renderer.ready(2, 1);
      const side = (id, x) => ({
        id,
        card: id,
        finish: 'regular',
        transform: [1, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, x, 1, 0, 1],
      });
      const drawSides = (instances) => {
        renderer.updateScene(instances);
        renderer.render({ viewProjection: IDENTITY, pointer: [0.5, 0.5] });
        const c = canvas(size),
          ctx = c.getContext('2d');
        ctx.drawImage(output, 0, 0);
        const pixels = ctx.getImageData(0, 0, ...size).data;
        c.width = c.height = 0;
        return pixels;
      };
      const left = side(1, -1),
        right = side(2, 0);
      const combined = drawSides([left, right]);
      const separateDraws = renderer.metrics.draws;
      const leftOnly = drawSides([left]),
        rightOnly = drawSides([right]);
      const separateEqual = combined.every(
        (v, i) => v === ((i / 4) % size[0] < size[0] / 2 ? leftOnly : rightOnly)[i],
      );
      renderer.upsertCards([{ ...other, revision: 2, recipe: { ...other.recipe, hologram: h } }]);
      await renderer.ready(2, 2);
      drawSides([left, right]);
      const sharedDraws = renderer.metrics.draws;
      renderer.releaseCards(new Uint32Array([2]));
      phase = 'over-finish printing';
      const paintOverlay = async (hologram) => {
        const d = {
          ...documentFor(hologram),
          layers: [
            {
              id: 'opaque-printing',
              order: 0,
              stage: 'over-finish',
              raster: {
                key: 'opaque-gray-overlay',
                size,
                async paint() {
                  const c = canvas(size),
                    ctx = c.getContext('2d');
                  ctx.fillStyle = '#878787';
                  ctx.fillRect(0, 0, ...size);
                  return c;
                },
              },
            },
          ],
        };
        renderer.upsertCards([d]);
        await renderer.ready(1, d.revision);
        return read();
      };
      const uncoatedOverlay = await paintOverlay();
      const coatedOverlay = await paintOverlay(h);
      differences.overFinish = diff(uncoatedOverlay, coatedOverlay);
      await set(h);
      const final = read();
      phase = 'export A';
      const exportA = new Uint8Array(
        await (
          await renderer.exportCard(1, {
            revision,
            width: 244,
            pointer: [0.5, 0.5],
            finish: 'regular',
            time: 2,
          })
        ).arrayBuffer(),
      );
      phase = 'export B';
      const exportB = new Uint8Array(
        await (
          await renderer.exportCard(1, {
            revision,
            width: 244,
            pointer: [0.5, 0.5],
            finish: 'regular',
            time: 2,
          })
        ).arrayBuffer(),
      );
      const exportEqual =
        exportA.length === exportB.length && exportA.every((v, i) => v === exportB[i]);
      phase = 'context loss';
      const extension = output.getContext('webgl2').getExtension('WEBGL_lose_context');
      if (!extension) throw Error('Context restore extension unavailable');
      const lost = new Promise((resolve) =>
        output.addEventListener('webglcontextlost', resolve, { once: true }),
      );
      extension.loseContext();
      await lost;
      await new Promise((resolve) => setTimeout(resolve, 100));
      const restored = new Promise((resolve) =>
        output.addEventListener('webglcontextrestored', resolve, { once: true }),
      );
      extension.restoreContext();
      await restored;
      phase = 'context restore';
      await renderer.ready(1, revision);
      const restoredPixels = read();
      const restoredEqual = final.every((v, i) => v === restoredPixels[i]);
      phase = 'failed mask';
      const failed = documentFor({
        ...h,
        mask: {
          ...mask,
          key: 'failed-mask',
          async paint() {
            throw Error('Expected mask failure');
          },
        },
      });
      renderer.upsertCards([failed]);
      let failedMaskRejected = false;
      try {
        await renderer.ready(1, failed.revision);
      } catch {
        failedMaskRejected = true;
      }
      const retained = read();
      const atomic = retained.every((v, i) => v === restoredPixels[i]);
      let invalid = 0;
      for (const bad of [
        { ...h, strength: NaN },
        { ...h, strength: 2 },
        { ...h, seed: -1 },
        { ...h, rect: [0, 0, 0, 1] },
        { ...h, mask: { ...mask, size: [0, 48] } },
      ]) {
        try {
          renderer.upsertCards([documentFor(bad)]);
        } catch {
          invalid++;
        }
      }
      return {
        differences,
        maskOrientation,
        before,
        after,
        uniformOnly,
        replacement,
        separateDraws,
        sharedDraws,
        separateEqual,
        maskPaintsBeforeRestore: beforePaints,
        readbacks,
        compilations,
        submissionMs,
        exportEqual,
        restoredEqual,
        failedMaskRejected,
        atomic,
        invalid,
      };
    } catch (error) {
      throw Error(phase + ': ' + error.message);
    } finally {
      renderer.dispose();
    }
  });
  for (const [kind, d] of Object.entries(result.differences)) {
    assert(d.inside > 200, kind + ' hologram missing');
    assert.equal(d.outside, 0, kind + ' changed protected printing');
  }
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads', 'readbacks']) {
    assert.equal(result.before[key], result.after[key], key + ' rebuilt during motion');
    assert.equal(
      result.before[key],
      result.uniformOnly[key],
      key + ' rebuilt for uniform-only change',
    );
  }
  assert.equal(result.maskPaintsBeforeRestore, 1);
  assert(result.maskOrientation, 'Local alpha mask was flipped');
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'readbacks'])
    assert.equal(
      result.replacement[key],
      result.before[key],
      key + ' rebuilt for mask replacement',
    );
  assert.equal(result.replacement.uploads, result.before.uploads + 1);
  assert.equal(result.separateDraws, 2);
  assert.equal(result.sharedDraws, 1);
  assert(result.separateEqual, 'Batch merged distinct hologram settings');
  assert.equal(result.readbacks, 0);
  assert.equal(result.compilations, 0);
  assert(result.exportEqual && result.restoredEqual && result.failedMaskRejected && result.atomic);
  assert.equal(result.invalid, 5);
  assert.deepEqual(errors, []);
  console.log(
    'PASS local hologram masks, finish independence, angle response, cached motion, deterministic export/restore, atomic failures and validation.',
    JSON.stringify(result),
  );
  console.log('Timing is mean CPU submission per frame; it excludes GPU completion.');
} finally {
  await browser.close();
  await server.close();
}
