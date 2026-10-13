import assert from 'node:assert/strict';
import { readJson, writeJson, cacheRoot, outputRoot, hash, atomicWrite } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const templates = await readJson(cacheRoot + '/rollout/old-frame-templates.json');
const components = new Map(templates.rows.map((t) => [t.url, t.asset]));
for (const t of templates.rows) {
  const prefix = t.url.split('/img/frames/')[0];
  t.borderUrl =
    prefix +
    '/img/frames/' +
    (t.family === 'fourth'
      ? 'old/fourth/borderBlack.png'
      : t.family === 'abu'
        ? 'old/abu/border.svg'
        : 'seventh/regular/border.svg');
  if (!components.has(t.borderUrl)) components.set(t.borderUrl, await cachedFetch(t.borderUrl));
}
const session = await openBrowser(
    { entries: [], components: [...components.values()] },
    { fonts: false },
  ),
  rows = [];
try {
  for (const t of templates.rows)
    for (const border of ['black', 'white']) {
      const images = await session.page.evaluate(
        async ({ t, border }) => {
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const loaded = await loadCanvasImages([t.url, t.borderUrl], new AbortController().signal);
          try {
            const c = document.createElement('canvas');
            c.width = 732;
            c.height = 1020;
            const ctx = c.getContext('2d');
            ctx.scale(1.5, 1.5);
            const stock = border === 'white' ? '#eeedeb' : '#080808';
            ctx.fillStyle = stock;
            ctx.fillRect(0, 0, 488, 680);
            ctx.drawImage(
              loaded.images.get(t.url),
              ...t.rect.map((v, i) => v * (i % 2 ? 680 : 488)),
            );
            if (border !== 'black' || t.family === 'fourth') {
              const m = document.createElement('canvas');
              m.width = 732;
              m.height = 1020;
              const mc = m.getContext('2d');
              mc.drawImage(loaded.images.get(t.borderUrl), 0, 0, 732, 1020);
              mc.globalCompositeOperation = 'source-in';
              mc.fillStyle = stock;
              mc.fillRect(0, 0, 732, 1020);
              ctx.drawImage(m, ...t.rect.map((v, i) => v * (i % 2 ? 680 : 488)));
              m.width = m.height = 0;
            }
            const png = c.toDataURL();
            // Isolate the pinned stock mask to expose geometry even on a dark
            // frame. It is usable only when strong RGB sides agree below.
            ctx.clearRect(0, 0, 488, 680);
            ctx.fillStyle = border === 'white' ? '#444' : '#bbb';
            ctx.fillRect(0, 0, 488, 680);
            const mask = document.createElement('canvas');
            mask.width = 732;
            mask.height = 1020;
            const mc = mask.getContext('2d');
            mc.drawImage(loaded.images.get(t.borderUrl), 0, 0, 732, 1020);
            mc.globalCompositeOperation = 'source-in';
            mc.fillStyle = stock;
            mc.fillRect(0, 0, 732, 1020);
            ctx.drawImage(mask, ...t.rect.map((v, i) => v * (i % 2 ? 680 : 488)));
            const geometry = c.toDataURL();
            mask.width = mask.height = c.width = c.height = 0;
            return { png, geometry };
          } finally {
            loaded.dispose();
          }
        },
        { t, border },
      );
      const bytes = Buffer.from(images.png.split(',')[1], 'base64'),
        file = t.key.replace('/', '-') + '-' + border + '.png';
      await atomicWrite(outputRoot + '/old-dual-hsb/templates/' + file, bytes);
      const geometryBytes = Buffer.from(images.geometry.split(',')[1], 'base64'),
        geometryFile = file.replace('.png', '-geometry.png');
      await atomicWrite(outputRoot + '/old-dual-hsb/templates/' + geometryFile, geometryBytes);
      rows.push({
        geometryFile,
        geometryHash: hash(geometryBytes),
        key: t.key,
        border,
        file,
        sha256: hash(bytes),
        frameHash: t.asset.sha256,
        borderHash: components.get(t.borderUrl).sha256,
        rect: t.rect,
      });
    }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
await writeJson(cacheRoot + '/rollout/old-dual-hsb-templates.json', {
  sourceHash: hash(JSON.stringify(templates)),
  rows,
});
console.log('Prepared', rows.length, 'stock-correct normalization targets');
