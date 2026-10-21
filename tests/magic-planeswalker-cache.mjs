import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';

async function probe(base) {
  const { preparePlaneswalkerMaterials } = await import(
    base + '/games/magic/src/presentation/planeswalker-material.ts'
  );
  const { planeswalkerBitmapCache } = await import(
    base + '/games/magic/src/presentation/material-bitmap-cache.ts'
  );
  const { profileAssets } = await import(base + '/games/magic/src/presentation/assets.ts');
  const { resolveCardProfile } = await import(base + '/games/magic/src/presentation/profile.ts');
  const { walkerSources } = await import(
    base + '/games/magic/src/presentation/planeswalker-sources.ts'
  );
  const make = async (color) => {
    const canvas = new OffscreenCanvas(192, 269),
      context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const result = await createImageBitmap(canvas);
    canvas.width = canvas.height = 0;
    return result;
  };
  const hash = async (bitmap) => {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height),
      context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0);
    const bytes = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const result = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('');
    canvas.width = canvas.height = 0;
    return result;
  };
  const rows = [],
    signal = new AbortController().signal;
  for (const large of [false, true]) {
    planeswalkerBitmapCache.clear();
    const face = {
      typeLine: 'Planeswalker',
      colors: ['U'],
      rulesText: Array(large ? 4 : 3)
        .fill('+1: Draw a card.')
        .join('\n'),
    };
    const assets = profileAssets(
      resolveCardProfile(face),
      large ? 'planeswalker-large' : 'planeswalker',
    );
    const source = walkerSources(large, 'U');
    const images = new Map([
      [source.source, await make('#2277cc')],
      [assets.background, await make('#abcdef')],
      [assets.frame, await make('#778899')],
    ]);
    let first, warm;
    try {
      const builds = planeswalkerBitmapCache.stats.builds;
      first = await preparePlaneswalkerMaterials(face, images, signal);
      warm = await preparePlaneswalkerMaterials(face, images, signal);
      if (
        planeswalkerBitmapCache.stats.builds - builds !== 2 ||
        first.images.get(assets.background) !== warm.images.get(assets.background) ||
        first.images.get(assets.frame) !== warm.images.get(assets.frame)
      )
        throw Error('Warm material rebuilt');
      const originalHashes = new Map(
        await Promise.all([...images].map(async ([url, image]) => [url, await hash(image)])),
      );
      for (const [role, url, changedSlot, color] of [
        ['source', source.source, assets.background, '#bb6611'],
        ['mask', assets.background, assets.background, 'rgba(120,120,120,0.5)'],
        ['frame', assets.frame, assets.frame, '#2244dd'],
      ]) {
        const replacement = await make(color),
          modified = new Map(images);
        modified.set(url, replacement);
        let changed;
        try {
          const builds = planeswalkerBitmapCache.stats.builds;
          changed = await preparePlaneswalkerMaterials(face, modified, signal);
          const before = await hash(first.images.get(changedSlot)),
            after = await hash(changed.images.get(changedSlot));
          if (before === after || first.images.get(changedSlot) === changed.images.get(changedSlot))
            throw Error('Same-URL ' + role + ' pixels reused stale material');
          const unchangedSlot = changedSlot === assets.frame ? assets.background : assets.frame;
          if (
            first.images.get(unchangedSlot) !== changed.images.get(unchangedSlot) ||
            planeswalkerBitmapCache.stats.builds - builds !== 1
          )
            throw Error('Unrelated component rebuilt for ' + role);
          rows.push({ large, role, before, after });
        } finally {
          changed?.dispose();
          replacement.close();
        }
      }
      const buildsAfter = planeswalkerBitmapCache.stats.builds;
      const again = await preparePlaneswalkerMaterials(face, images, signal);
      if (
        again.images.get(assets.frame) !== first.images.get(assets.frame) ||
        again.images.get(assets.background) !== first.images.get(assets.background) ||
        planeswalkerBitmapCache.stats.builds !== buildsAfter
      )
        throw Error('Original warm material lost');
      again.dispose();
      for (const [url, image] of images)
        if ((await hash(image)) !== originalHashes.get(url)) throw Error('Borrowed source mutated');
    } finally {
      first?.dispose();
      warm?.dispose();
      planeswalkerBitmapCache.clear();
      for (const image of images.values()) image.close();
    }
    if (planeswalkerBitmapCache.stats.bytes !== 0) throw Error('Material cache lease leaked');
  }
  return rows;
}

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
try {
  await server.listen();
  const address = server.httpServer.address(),
    base = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(base);
  const result = await page.evaluate(
    async ({ source, base }) => {
      const run = (0, eval)('(' + source + ')');
      const browserRows = await run(base);
      const code = `self.onmessage=async({data})=>{try{if(typeof document!=='undefined')throw Error('Worker has document');const run=(${source});self.postMessage({rows:await run(data.base)});}catch(e){self.postMessage({error:e.message});}};`;
      const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
      const worker = new Worker(url, { type: 'module' });
      try {
        const workerRows = await new Promise((resolve, reject) => {
          worker.onmessage = ({ data }) =>
            data.error ? reject(Error(data.error)) : resolve(data.rows);
          worker.onerror = (e) => reject(Error(e.message));
          worker.postMessage({ base });
        });
        return { browserRows, workerRows };
      } finally {
        worker.terminate();
        URL.revokeObjectURL(url);
      }
    },
    { source: probe.toString(), base },
  );
  assert.equal(result.browserRows.length, 6);
  assert.deepEqual(result.browserRows, result.workerRows, 'Browser/worker material pixels differ');
  console.log(
    JSON.stringify({
      scope:
        'Same-URL immutable source/mask/frame replacements; warm reuse, selective rebuilds, borrowed ownership and worker parity',
      ...result,
    }),
  );
} finally {
  await browser?.close();
  await server.close();
}
