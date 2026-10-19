import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage(),
    errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const { createRenderer, canvas, IDENTITY, normalLightingVersion } = await import(
      '/packages/browser/src/index.ts'
    );
    const width = 216,
      height = 300,
      output = canvas([width, height]),
      renderer = await createRenderer({ canvas: output });
    const color = {
      key: 'normal-light-neutral',
      size: [width, height],
      async paint() {
        const c = canvas([width, height]),
          g = c.getContext('2d');
        g.fillStyle = '#777';
        g.fillRect(0, 0, width, height);
        return c;
      },
    };
    renderer.upsertCards([
      {
        id: 1,
        revision: 1,
        recipe: {
          pack: 'normal-light-test',
          color,
          edges: [],
          artWindows: [],
          cornerRadius: 0,
          regions: [],
          finishCoverageBase: 1,
        },
      },
    ]);
    await renderer.ready(1, 1);
    const quad = [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
      normal = (x) => [Math.sin(x), 0, Math.cos(x)],
      copy = canvas([width, height]),
      g = copy.getContext('2d', { willReadFrequently: true });
    const pixels = () => {
      g.clearRect(0, 0, width, height);
      g.drawImage(output, 0, 0);
      return g.getImageData(0, 0, width, height).data.slice();
    };
    const difference = (a, b) => {
      let n = 0;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++;
      return n;
    };
    function draw(finish, n, pointer, lighting, stock = false) {
      renderer.updateScene([
        {
          id: 1,
          card: 1,
          finish,
          normal: n,
          transform: quad,
          ...(stock
            ? { cardstock: { amount: 0.2 }, printDots: { amount: 0.15, period: 3, variation: 1 } }
            : {}),
        },
      ]);
      renderer.render({
        viewProjection: IDENTITY,
        pointer,
        time: 2,
        ...(lighting ? { lighting } : {}),
      });
      return pixels();
    }
    const checks = [];
    try {
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
        'holofoil',
      ]) {
        const n = normal(-0.08),
          first = draw(finish, n, [0.1, 0.9], 'studio'),
          other = draw(finish, n, [0.9, 0.1], 'studio');
        const pointerChanges = difference(first, other),
          posed = draw(finish, normal(0.14), [0.1, 0.9], 'studio'),
          poseChanges = difference(first, posed);
        const legacy = draw(finish, n, [0.2, 0.8]),
          explicit = draw(finish, n, [0.2, 0.8], 'pointer'),
          defaultChanges = difference(legacy, explicit);
        checks.push({ finish, pointerChanges, poseChanges, defaultChanges });
        if (pointerChanges)
          throw Error(finish + ' responds to pointer in studio mode: ' + pointerChanges);
        if (finish !== 'regular' && poseChanges < 1000)
          throw Error(finish + ' does not respond to surface pose: ' + poseChanges);
        if (defaultChanges) throw Error(finish + ' changed its default mode');
      }
      const stockA = draw('gloss', normal(-0.08), [0, 1], 'studio', true),
        stockB = draw('gloss', normal(-0.08), [1, 0], 'studio', true);
      if (difference(stockA, stockB)) throw Error('Printed coating still responds to pointer');
      const centroids = [];
      for (const finish of ['gloss', 'prismatic'])
        for (const angle of [-0.08, 0, 0.08]) {
          const data = draw(finish, normal(angle), [0.5, 0.5], 'studio');
          let sx = 0,
            sy = 0,
            total = 0;
          for (let y = 0; y < height; y++)
            for (let x = 0; x < width; x++) {
              const i = (y * width + x) * 4,
                luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2],
                w = Math.max(0, luma - 119) ** 2;
              sx += x * w;
              sy += y * w;
              total += w;
            }
          centroids.push({
            finish,
            angle,
            x: total ? sx / total / width : null,
            y: total ? sy / total / height : null,
          });
        }
      for (const finish of ['gloss', 'prismatic']) {
        const row = centroids.filter((p) => p.finish === finish);
        if (!row.every((p) => p.x !== null) || row[0].x - row[2].x < 0.05)
          throw Error(
            finish +
              ' highlight does not move left as the normal turns right: ' +
              JSON.stringify(row),
          );
      }
      const live = draw('prismatic', normal(-0.08), [0.5, 0.5], 'studio'),
        png = await renderer.exportCard(1, {
          revision: 1,
          width,
          finish: 'prismatic',
          normal: normal(-0.08),
          lighting: 'studio',
          pointer: [0.9, 0.1],
          time: 2,
        });
      const image = await createImageBitmap(png);
      g.clearRect(0, 0, width, height);
      g.drawImage(image, 0, 0);
      image.close();
      const exported = g.getImageData(0, 0, width, height).data,
        exportChanges = difference(live, exported);
      if (exportChanges) throw Error('PNG disagrees with live normal lighting: ' + exportChanges);
      const before = JSON.stringify(renderer.metrics);
      for (let i = 0; i < 20; i++) draw('prismatic', normal(i * 0.01), [0.5, 0.5], 'studio');
      const warm = JSON.parse(before);
      for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads', 'readbacks'])
        if (renderer.metrics[key] !== warm[key]) throw Error(key + ' changed during warm motion');
      return {
        normalLightingVersion,
        checks,
        centroids,
        exportChanges,
        before: JSON.parse(before),
        after: renderer.metrics,
      };
    } finally {
      renderer.dispose();
    }
  });
  assert.deepEqual(errors, []);
  assert.equal(result.normalLightingVersion, 1);
  await mkdir('test-results/normal-lighting', { recursive: true });
  await writeFile(
    'test-results/normal-lighting/receipt.json',
    JSON.stringify(
      {
        ...result,
        errors,
        scope:
          'Linux Chromium / SwiftShader; native GPU output, no physical device. CPU submission metrics are not GPU completion timings.',
      },
      null,
      2,
    ) + '\n',
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
  await server.close();
}
