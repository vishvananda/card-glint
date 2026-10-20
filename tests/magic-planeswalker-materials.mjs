import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const url = new URL('walker-materials.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Planeswalker material boundaries</title>',
    }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const { preparePlaneswalkerMaterials } = await import(
      '/games/magic/src/presentation/planeswalker-material.ts'
    );
    const { planeswalkerBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const { walkerSources, walkerTypeRect } = await import(
      '/games/magic/src/presentation/planeswalker-sources.ts'
    );
    const { profileAssets } = await import('/games/magic/src/presentation/assets.ts');
    const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
    const signal = new AbortController().signal,
      rows = [];
    let leases = 0;
    for (const large of [false, true])
      for (const palette of ['W', 'U', 'B', 'R', 'G', 'M', 'A']) {
        const face = {
          name: 'Original Walker',
          typeLine: 'Planeswalker',
          colors: palette === 'M' ? ['W', 'G'] : palette === 'A' ? [] : [palette],
          rulesText: Array.from(
            { length: large ? 4 : 3 },
            (_, i) => '+' + i + ': Draw a card.',
          ).join('\n'),
          loyalty: '4',
        };
        const kind = large ? 'planeswalker-large' : 'planeswalker',
          assets = profileAssets(resolveCardProfile(face), kind),
          s = walkerSources(large, palette),
          images = new Map();
        const make = async (w, h, paint) => {
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const x = c.getContext('2d');
          paint(x, w, h);
          return createImageBitmap(c);
        };
        images.set(
          s.source,
          await make(768, 1075, (x, w, h) => {
            x.fillStyle = '#a5b1c8';
            x.fillRect(0, 0, w, h);
          }),
        );
        images.set(
          s.mask,
          await make(768, 1075, (x, w, h) => {
            x.fillStyle = 'white';
            x.beginPath();
            x.roundRect(s.crop[0] * w, s.crop[1] * h, s.crop[2] * w, s.crop[3] * h, 8);
            x.fill();
          }),
        );
        images.set(
          assets.background,
          await make(768, 1049, (x, w, h) => {
            x.fillStyle = palette === 'A' ? 'rgba(120,120,120,0.702)' : '#abc';
            x.fillRect(0, 0, w, h);
          }),
        );
        images.set(
          assets.frame,
          await make(768, 1070, (x, w, h) => {
            x.fillStyle = '#448899';
            x.fillRect(0, 0, w, h);
            const scale = (0.91339 * 488) / w,
              top = (large ? 0.49044 : 0.55793) * 680 + 5;
            x.clearRect(
              (32 - 0.04724 * 488) / scale,
              (top + 5 - 0.02655 * 680) / scale,
              420 / scale,
              28 / scale,
            );
          }),
        );
        const before = planeswalkerBitmapCache.stats.builds;
        const a = await preparePlaneswalkerMaterials(face, images, signal),
          b = await preparePlaneswalkerMaterials(face, images, signal);
        leases += 2;
        if (a.images.planeswalker.type.image !== b.images.planeswalker.type.image)
          throw Error('Warm type rebuilt');
        if (planeswalkerBitmapCache.stats.builds - before !== 3)
          throw Error('Materials must build atomically once');
        if (
          JSON.stringify(a.images.planeswalker.type.rect) !== JSON.stringify(walkerTypeRect(large))
        )
          throw Error('Source contour placement diverged');
        const opening = a.images.planeswalker.opening,
          c = document.createElement('canvas');
        c.width = opening.image.width;
        c.height = opening.image.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(opening.image, 0, 0);
        const p = ctx.getImageData(0, 0, c.width, c.height).data;
        if (p[3] !== 0 || p[(c.width * c.height - 1) * 4 + 3] !== 0)
          throw Error('Aperture fill leaked out of closed hole');
        if (!p.some((v, i) => i % 4 === 3 && v === 255)) throw Error('Aperture remained empty');
        const bg = a.images.get(assets.background);
        c.width = bg.width;
        c.height = bg.height;
        ctx.drawImage(bg, 0, 0);
        const alpha = ctx.getImageData(10, 10, 1, 1).data[3];
        if (alpha !== 255) throw Error('Replacement material retained obsolete opacity');
        a.dispose();
        b.dispose();
        leases -= 2;
        const missing = new Map(images);
        missing.delete(s.mask);
        let rejected = false;
        try {
          await preparePlaneswalkerMaterials(face, missing, signal);
        } catch (e) {
          rejected = e.message.includes('Planeswalker asset unavailable');
        }
        if (!rejected) throw Error('Partial material revision accepted');
        const abort = new AbortController();
        abort.abort();
        let aborted = false;
        try {
          await preparePlaneswalkerMaterials(face, images, abort.signal);
        } catch (e) {
          aborted = e.name === 'AbortError';
        }
        if (!aborted) throw Error('Aborted preparation succeeded');
        for (const image of images.values()) image.close();
        rows.push({ palette, large, alpha });
      }
    planeswalkerBitmapCache.clear();
    if (planeswalkerBitmapCache.stats.bytes !== 0 || leases) throw Error('Material lease leaked');
    return { rows, builds: planeswalkerBitmapCache.stats.builds };
  });
  assert.equal(result.rows.length, 14);
  console.log(JSON.stringify(result));
} finally {
  await browser?.close();
  await server.close();
}
