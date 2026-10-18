import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL('..', import.meta.url)),
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  const url = new URL('finish-material-regression.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Finish mask pack isolation</title>',
    }),
  );
  await page.goto(url);
  const results = await page.evaluate(async () => {
    const { FinishResources } = await import('/packages/browser/src/finish-material.ts');
    const { AssetStore } = await import('/packages/browser/src/assets.ts');
    const { initializeRenderer } = await import('/packages/browser/src/renderer.ts');
    await initializeRenderer();
    const size = [16, 12];
    const raster = (key, opaque) => ({
      key,
      size,
      async paint(_host, signal) {
        signal.throwIfAborted();
        const canvas = document.createElement('canvas');
        [canvas.width, canvas.height] = size;
        if (opaque) {
          const context = canvas.getContext('2d');
          context.fillStyle = '#fff';
          context.fillRect(0, 0, ...size);
        }
        return canvas;
      },
    });
    const card = (pack, opaque) => ({
      id: 1,
      revision: 1,
      recipe: {
        pack,
        color: raster('shared-color-v1', false),
        edges: [],
        artWindows: [],
        cornerRadius: 0,
        regions: [],
      },
      layers: [
        {
          id: 'shared-coverage',
          stage: 'under-finish',
          order: 0,
          raster: raster('shared-layer-v1', false),
          etchCoverage: { add: raster('shared-etch-coverage-v1', opaque) },
        },
      ],
    });
    const cards = { A: card('finish-test-pack-a', true), B: card('finish-test-pack-b', false) };
    const host = new AssetStore(1024 * 1024);
    const controller = new AbortController();
    try {
      const results = [];
      for (const order of [
        ['A', 'B', 'A'],
        ['B', 'A', 'B'],
      ]) {
        const resources = new FinishResources();
        try {
          const masks = [];
          for (const pack of order) {
            const mask = await resources.documentMask(cards[pack], host, controller.signal);
            try {
              masks.push({
                pack,
                width: mask.width,
                height: mask.height,
                pixels: Array.from(mask.getContext('2d').getImageData(0, 0, ...size).data),
              });
            } finally {
              mask.width = mask.height = 0;
            }
          }
          results.push(masks);
        } finally {
          resources.dispose();
        }
      }
      return results;
    } finally {
      controller.abort();
      host.dispose();
    }
  });
  for (const masks of results) {
    const order = masks.map((mask) => mask.pack).join(' -> ');
    for (const [index, mask] of masks.entries()) {
      const label = `${order}, call ${index + 1}, pack ${mask.pack}`;
      assert.deepEqual([mask.width, mask.height], [16, 12], `${label}: mask dimensions`);
      const value = mask.pack === 'A' ? 255 : 0;
      const expected = Array.from({ length: 16 * 12 }, () => [value, value, value, 255]).flat();
      assert.deepEqual(mask.pixels, expected, `${label}: full/empty GPU mask pixels`);
    }
    assert.deepEqual(masks[2].pixels, masks[0].pixels, `${order}: returning to a cached pack`);
  }
  const coverage = await page.evaluate(async () => {
    const { FinishResources } = await import('/packages/browser/src/finish.ts');
    const size = [4, 3];
    const painted = [];
    const forbidden = [];
    const unused = (key) => ({
      key,
      size,
      async paint() {
        forbidden.push(key);
        throw Error(`Coverage-only preparation painted ${key}`);
      },
    });
    const host = {
      async images() {
        forbidden.push('images');
        throw Error('Coverage-only preparation loaded an etch asset');
      },
    };
    const raster = (key, alpha) => ({
      key,
      size,
      async paint(_host, signal) {
        signal.throwIfAborted();
        const canvas = document.createElement('canvas');
        [canvas.width, canvas.height] = size;
        painted.push(canvas);
        const context = canvas.getContext('2d');
        const image = context.createImageData(...size);
        for (let i = 0; i < alpha.length; i++) {
          image.data.set([31, 157, 223, alpha[i]], i * 4);
        }
        context.putImageData(image, 0, 0);
        return canvas;
      },
    });
    const solid = (key, value) => raster(key, Array(12).fill(value));
    const layer = (id, finishCoverage, clip) => ({
      id,
      stage: 'under-finish',
      order: 0,
      raster: unused(`${id}-printing`),
      finishCoverage,
      clip,
    });
    const card = (pack, base, layers = [], revision = 1) => ({
      id: 2,
      revision,
      recipe: {
        pack,
        color: unused('face-color'),
        stamp: unused('etch-stamp'),
        edges: [
          {
            key: 'etch-edge',
            asset: { url: '/coverage-must-not-load.png' },
            crop: [0, 0, 1, 1],
            destination: [0, 0, 1, 1],
            clip: [0, 0, 1, 1],
            threshold: 128,
          },
        ],
        artWindows: [[0.25, 0.25, 0.5, 0.5]],
        cornerRadius: 0.5,
        regions: [],
        finishCoverageBase: base,
      },
      layers,
    });
    const pixels = (canvas) => Array.from(canvas.getContext('2d').getImageData(0, 0, ...size).data);
    const release = (canvas) => {
      canvas.width = canvas.height = 0;
    };
    const signal = new AbortController().signal;
    const resources = new FinishResources();
    const outputs = [];
    const capture = async (document) => {
      const canvas = await resources.documentCoverage(document, host, signal);
      outputs.push(canvas);
      return { width: canvas.width, height: canvas.height, pixels: pixels(canvas) };
    };
    try {
      const fractional = await capture(card('coverage-base', 0.25));
      const defaultBase = await capture(card('coverage-default', undefined));
      const combined = await capture(
        card('coverage-combined', 0.2, [
          {
            ...layer('first', {
              add: raster('add-first', [0, 64, 128, 255, 32, 192, 0, 0, 255, 0, 96, 16]),
              exclude: raster('exclude-first', [0, 0, 64, 255, 0, 128, 0, 0, 0, 0, 0, 0]),
            }),
            etchCoverage: { add: unused('mixed-etch-add'), exclude: unused('mixed-etch-exclude') },
          },
          layer('second', {
            add: raster('add-second', [0, 128, 64, 0, 0, 64, 0, 0, 128, 0, 0, 0]),
            exclude: raster('exclude-second', [0, 0, 128, 0, 0, 64, 0, 0, 0, 255, 0, 0]),
          }),
          layer('clipped-add', { add: solid('clipped-add-mask', 255) }, [0.5, 1 / 3, 0.5, 1 / 3]),
          layer('clipped-exclude', { exclude: solid('clipped-exclude-mask', 255) }, [
            0,
            2 / 3,
            0.25,
            1 / 3,
          ]),
          {
            ...layer('etch-only'),
            contributesToEtch: true,
            etchCoverage: { add: unused('etch-only-add'), exclude: unused('etch-only-exclude') },
          },
        ]),
      );
      const etchOnly = await capture(
        card('coverage-etch-only', 0.25, [
          {
            ...layer('etch'),
            contributesToEtch: true,
            etchCoverage: {
              add: unused('independent-etch-add'),
              exclude: unused('independent-etch-exclude'),
            },
          },
        ]),
      );
      const packs = {
        A: card('coverage-pack-a', 0, [layer('shared-mask', { add: solid('shared-mask-v1', 32) })]),
        B: card('coverage-pack-b', 0, [
          layer('shared-mask', { add: solid('shared-mask-v1', 224) }),
        ]),
        A2: card(
          'coverage-pack-a',
          0,
          [
            layer('shared-mask', {
              add: solid('shared-mask-v2', 128),
              exclude: solid('shared-exclude-v2', 64),
            }),
          ],
          2,
        ),
      };
      const sequence = [];
      const retained = await resources.documentCoverage(packs.A, host, signal);
      outputs.push(retained);
      sequence.push(pixels(retained));
      for (const pack of ['B', 'A2']) {
        sequence.push((await capture(packs[pack])).pixels);
      }
      const retainedAfterCalls = {
        width: retained.width,
        height: retained.height,
        pixels: pixels(retained),
      };
      retained.getContext('2d').clearRect(0, 0, ...size);
      const afterMutation = await capture(packs.A);
      release(retained);
      const afterRelease = await capture(packs.A);

      let start;
      let resume;
      const started = new Promise((resolve) => (start = resolve));
      const resumed = new Promise((resolve) => (resume = resolve));
      let abortedCanvas;
      const delayed = {
        key: 'delayed-exclude',
        size,
        async paint() {
          abortedCanvas = document.createElement('canvas');
          [abortedCanvas.width, abortedCanvas.height] = size;
          painted.push(abortedCanvas);
          start();
          await resumed;
          return abortedCanvas;
        },
      };
      const controller = new AbortController();
      const aborted = resources
        .documentCoverage(
          card('coverage-aborted', 0, [
            layer('partial', { add: solid('partial-add', 255), exclude: delayed }),
          ]),
          host,
          controller.signal,
        )
        .then(
          (canvas) => {
            outputs.push(canvas);
            return 'published';
          },
          (error) => error.name,
        );
      await started;
      controller.abort();
      const successful = resources.documentCoverage(packs.B, host, signal);
      resume();
      const abortResult = await aborted;
      const recovered = await successful;
      outputs.push(recovered);
      const afterAbort = pixels(recovered);
      const abortedSize = [abortedCanvas.width, abortedCanvas.height];
      const paintedBeforePreAbort = painted.length;
      const preAborted = new AbortController();
      preAborted.abort();
      const preAbortResult = await resources
        .documentCoverage(packs.A, host, preAborted.signal)
        .then(
          (canvas) => {
            outputs.push(canvas);
            return 'published';
          },
          (error) => error.name,
        );
      const preAbortPaints = painted.length - paintedBeforePreAbort;
      resources.dispose();
      return {
        fractional,
        defaultBase,
        combined,
        etchOnly,
        sequence,
        retainedAfterCalls,
        afterMutation,
        afterRelease,
        abortResult,
        afterAbort,
        abortedSize,
        preAbortResult,
        preAbortPaints,
        forbidden,
        distinctOutputs: new Set(outputs).size === outputs.length,
        retainedAfterDispose: pixels(recovered),
        intermediatesReleased: painted.every((canvas) => canvas.width === 0 && canvas.height === 0),
      };
    } finally {
      resources.dispose();
      outputs.forEach(release);
    }
  });
  const rgba = (values) => values.flatMap((value) => [value, value, value, 255]);
  const uniform = (value) => rgba(Array(12).fill(value));
  const checkCoverage = (actual, expected, label) => {
    assert.deepEqual([actual.width, actual.height], [4, 3], `${label}: dimensions`);
    assert.deepEqual(actual.pixels, expected, `${label}: opaque grayscale coverage`);
  };
  checkCoverage(
    coverage.fractional,
    uniform(64),
    'fractional base without artwork/silhouette clipping',
  );
  checkCoverage(coverage.defaultBase, uniform(255), 'default base');
  checkCoverage(
    coverage.combined,
    rgba([51, 128, 64, 0, 51, 96, 255, 255, 0, 0, 96, 51]),
    'maximum alpha, exclusion precedence, clipped masks and top-left orientation',
  );
  checkCoverage(coverage.etchOnly, uniform(64), 'etch-only masks do not affect finish coverage');
  assert.deepEqual(
    coverage.sequence,
    [32, 224, 96].map(uniform),
    'pack and revision changes resolve their own mask content',
  );
  checkCoverage(
    coverage.retainedAfterCalls,
    uniform(32),
    'returned canvas remains owned by caller',
  );
  checkCoverage(
    coverage.afterMutation,
    uniform(32),
    'caller mutation does not affect another result',
  );
  checkCoverage(
    coverage.afterRelease,
    uniform(32),
    'caller release does not affect another result',
  );
  assert.equal(coverage.distinctOutputs, true, 'each returned canvas has independent ownership');
  assert.equal(
    coverage.abortResult,
    'AbortError',
    'aborted preparation publishes no partial result',
  );
  assert.deepEqual(coverage.abortedSize, [0, 0], 'aborted raster canvas is released');
  assert.deepEqual(coverage.afterAbort, uniform(224), 'successful request after an abort');
  assert.equal(coverage.preAbortResult, 'AbortError', 'already-aborted request rejects');
  assert.equal(coverage.preAbortPaints, 0, 'already-aborted request paints no assets');
  assert.deepEqual(coverage.forbidden, [], 'coverage does not paint color or prepare etch assets');
  assert.equal(coverage.intermediatesReleased, true, 'all mask raster canvases are released');
  assert.deepEqual(
    coverage.retainedAfterDispose,
    uniform(224),
    'resource disposal preserves caller canvas',
  );
  assert.deepEqual(errors, [], 'Unexpected browser errors');
  console.log(
    'PASS standalone finish mask pack isolation and document finish coverage pixels, ownership and abort recovery.',
  );
} finally {
  try {
    await browser?.close();
  } finally {
    await server.close();
  }
}
