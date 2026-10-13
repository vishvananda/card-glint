import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  cacheRoot,
  hash,
  mapLimit,
  readJson,
  writeJson,
  root,
  sourceHash,
  atomicWrite,
} from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';
import { calibrationGroups } from './major-calibration-groups.mjs';

const plan = await readJson(`${cacheRoot}/rollout/major-calibration-plan.json`);
const directory = `${cacheRoot}/rollout/major-calibration`;
const rendererHash = await sourceHash(`${root}/games/magic/src`);
const filter = process.argv.slice(2);
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const session = await openBrowser({ entries: [], components: [] });
try {
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { RETRO_FONT, RETRO_SYMBOL_FONT } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const css = await readFile(`${root}/games/magic/fonts.css`, 'utf8');
  const fonts = await mapLimit(
    [
      ...new Set(
        [...css.matchAll(/url\('([^']+)'\)/g)]
          .map((m) => m[1])
          .concat(RETRO_FONT, RETRO_SYMBOL_FONT),
      ),
    ],
    3,
    (url) => cachedFetch(url),
  );
  session.addAssets(fonts);
  let count = 0;
  for (const group of calibrationGroups(plan.rows, filter)) {
    const key = group.key.replaceAll('/', '-');
    const groupHash = hash(JSON.stringify(group));
    let prior;
    try {
      prior = await readJson(`${directory}/${key}.json`);
      if (
        prior.rendererHash === rendererHash &&
        prior.groupHash === groupHash &&
        !prior.samples.some((s) => s.issue)
      ) {
        console.log('cached', key);
        continue;
      }
      if (prior.rendererHash !== rendererHash)
        throw Error(`Stale capture ${key}; use a new capture revision`);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    const samples = [];
    // Fetch a small group ahead of rasterization. Scryfall API requests remain
    // serialized by cache.mjs; these are immutable image-host URLs. Failed
    // samples are recorded individually by the capture loop below.
    await mapLimit(group.samples, 2, async ({ card }) => {
      await Promise.allSettled([
        cachedFetch(card.image_uris.png),
        cachedFetch(card.image_uris.art_crop),
      ]);
    });
    for (const sample of group.samples) {
      const card = sample.card;
      try {
        const [reference, art] = await Promise.all([
          cachedFetch(card.image_uris.png),
          cachedFetch(card.image_uris.art_crop),
        ]);
        const face = {
          ...presentation({ card, reference, art }).face,
          ...sample.face,
          illustration: `/__accuracy/object/${art.sha256}`,
        };
        const reusable = prior?.samples.find((s) => s.id === card.id && !s.issue);
        if (
          reusable &&
          JSON.stringify(reusable.face) === JSON.stringify(face) &&
          reusable.reference.sha256 === reference.sha256 &&
          reusable.art.sha256 === art.sha256 &&
          reusable.symbol === sample.symbol
        ) {
          for (const asset of Object.values(reusable.images))
            if (hash(await readFile(`${directory}/${asset.file}`)) !== asset.sha256)
              throw Error('Cached capture artifact changed');
          samples.push({ ...reusable, cohort: sample.cohort, material: sample.material });
          continue;
        }
        const components = await mapLimit(
          canvasAssetUrls(face).filter((u) => u?.startsWith('https://')),
          3,
          (url) => cachedFetch(url),
        );
        session.addAssets([reference, art, ...components]);
        const captured = await session.page.evaluate(
          async ({ face, symbol }) => {
            const { composeCardTexture, cardTextureKey } = await import(
              '/games/magic/src/presentation/canvas-face.ts'
            );
            const { loadCanvasImages, canvasAssetUrls } = await import(
              '/games/magic/src/presentation/canvas-assets.ts'
            );
            const loaded = await loadCanvasImages(
              canvasAssetUrls(face),
              new AbortController().signal,
            );
            const icon = loaded.images.get(symbol),
              proto = CanvasRenderingContext2D.prototype,
              original = proto.drawImage;
            let bounds = null;
            // Capture the actual painter's symbol placement. Keep all surrounding
            // pixels in the blank plate; search later is entirely CPU raster work.
            proto.drawImage = function (image, ...args) {
              if (icon && image === icon && args.length === 4) {
                bounds = args;
                return;
              }
              return original.call(this, image, ...args);
            };
            let canvas;
            try {
              canvas = await composeCardTexture(
                { face, printingId: null, printedImage: null },
                'inspect',
                new AbortController().signal,
                { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
              );
            } finally {
              proto.drawImage = original;
            }
            try {
              const small = document.createElement('canvas');
              small.width = 488;
              small.height = 680;
              small.getContext('2d').drawImage(canvas, 0, 0, 488, 680);
              const blank = small.toDataURL();
              small.width = small.height = 0;
              let stencil = null;
              if (icon && bounds) {
                const tile = document.createElement('canvas');
                tile.width = 256;
                tile.height = Math.max(1, Math.round((256 * icon.height) / icon.width));
                tile.getContext('2d').drawImage(icon, 0, 0, tile.width, tile.height);
                stencil = tile.toDataURL();
                tile.width = tile.height = 0;
              }
              return {
                blank,
                stencil,
                bounds,
                renderKey: cardTextureKey(
                  { face, printingId: null, printedImage: null },
                  'inspect',
                ),
              };
            } finally {
              canvas.width = canvas.height = 0;
              loaded.dispose();
            }
          },
          { face, symbol: sample.symbol },
        );
        const slug = `${key}-${card.id}`;
        const images = {};
        for (const kind of ['blank', 'stencil'])
          if (captured[kind]) {
            const bytes = Buffer.from(captured[kind].split(',')[1], 'base64');
            const file = `${slug}-${kind}.png`;
            await atomicWrite(`${directory}/${file}`, bytes);
            images[kind] = { file, sha256: hash(bytes) };
          }
        samples.push({
          id: card.id,
          name: card.name,
          rarity: card.rarity,
          source: card.scryfall_uri,
          material: sample.material,
          cohort: sample.cohort,
          face,
          reference,
          art,
          components,
          images,
          bounds: captured.bounds,
          symbol: sample.symbol,
          renderKey: captured.renderKey,
        });
      } catch (error) {
        samples.push({ id: card.id, name: card.name, cohort: sample.cohort, issue: String(error) });
      }
    }
    await writeJson(`${directory}/${key}.json`, {
      schemaVersion: 1,
      rendererHash,
      groupHash,
      key: group.key,
      family: group.family,
      border: group.border,
      set: group.set,
      samples,
    });
    console.log(
      ++count,
      key,
      samples.length,
      'captures',
      samples.filter((s) => s.issue).map((s) => s.issue),
    );
  }
  if ((await sourceHash(`${root}/games/magic/src`)) !== rendererHash)
    throw Error('Renderer changed during capture');
} finally {
  await session.close();
  await server.close();
}
