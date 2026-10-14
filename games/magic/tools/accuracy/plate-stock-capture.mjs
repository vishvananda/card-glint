import { PNG } from 'pngjs';
import { cachedFetch, readObject } from './cache.mjs';
import { readJson, writeJson, cacheRoot, hash, atomicWrite } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { plateStockMaskProof, plateStockTarget } from './plate-stock-target.mjs';
const manifest = await readJson(new URL('../../assets.json', import.meta.url));
const root = manifest.CONJURER_ROOT + '/img/frames/8th/';
const directory = cacheRoot + '/rollout/eighth-stock-targets-v0214';
const mask = await cachedFetch(root + 'border.png'),
  nativeMask = PNG.sync.read(await readObject(mask));
const session = await openBrowser({ entries: [], components: [mask] }, { fonts: false });
const rows = [];
try {
  for (const material of ['w', 'u', 'b', 'r', 'g', 'a', 'l', 'wl', 'ul', 'bl', 'rl', 'gl', 'm']) {
    const asset = await cachedFetch(root + material + '.png');
    session.addAssets([asset]);
    const proof = plateStockMaskProof(PNG.sync.read(await readObject(asset)), nativeMask);
    for (const border of ['white', 'black']) {
      const encoded = await session.page.evaluate(
        async ({ url, border }) => {
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const loaded = await loadCanvasImages([url], new AbortController().signal);
          try {
            const c = document.createElement('canvas');
            c.width = 732;
            c.height = 1020;
            const ctx = c.getContext('2d');
            ctx.drawImage(loaded.images.get(url), 0, 0, 732, 1020);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = border === 'white' ? '#eeedeb' : '#090806';
            ctx.fillRect(0, 0, 732, 1020);
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = border === 'white' ? '#444' : '#bbb';
            ctx.fillRect(0, 0, 732, 1020);
            const result = c.toDataURL();
            c.width = c.height = 0;
            return result;
          } finally {
            loaded.dispose();
          }
        },
        { url: mask.url, border },
      );
      const bytes = Buffer.from(encoded.split(',')[1], 'base64'),
        file = border + '-geometry.png';
      await atomicWrite(directory + '/' + file, bytes);
      const target = plateStockTarget(normalize(PNG.sync.read(bytes)), proof, border);
      rows.push({ material, border, asset, mask, geometry: { file, sha256: hash(bytes) }, target });
      console.log(
        material,
        border,
        target.reliable,
        Object.values(proof.sides).map((s) => s.matching),
      );
    }
  }
} finally {
  await session.close();
}
await writeJson(directory + '/targets.json', {
  schemaVersion: 1,
  scope: 'Exact 8th source plate/mask proof; scan fits remain independently validated.',
  rows,
});
