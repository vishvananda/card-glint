import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { root as libraryRoot } from '../common.mjs';
import { createHash } from 'node:crypto';
import { cachedFetch, readObject } from '../cache.mjs';
import { fetchComponents } from '../components.mjs';
import { presentation } from '../adapter.mjs';
import { normalizePrintingText } from '../printing-text.mjs';
import { openBrowser } from '../browser.mjs';
const root = process.argv[2];
if (!root) throw Error('Pass an external experiment directory');
const sourceCommit = execFileSync('git', ['-C', libraryRoot, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
const rendererVersion = JSON.parse(await readFile(libraryRoot + '/package.json')).version;
const rasters = {};
const candidate = process.env.BLUE_WALKER_CANDIDATE;
const candidateData = candidate
  ? {
      background:
        'data:image/png;base64,' +
        (await readFile(candidate + '/planeswalker-bg-U.png')).toString('base64'),
      type:
        'data:image/png;base64,' +
        (await readFile(candidate + '/planeswalker-type-U.png')).toString('base64'),
      rect: JSON.parse(await readFile(candidate + '/parameters.json')).type.rect,
    }
  : null;
const inputs = JSON.parse(await readFile(root + '/inputs.json'));
const sets = {};
const entries = [];
for (const r of inputs.records) {
  const code = r.set.toUpperCase();
  if (!sets[code]) {
    const asset = await cachedFetch('https://mtgjson.com/api/v5/' + code + '.json');
    sets[code] = { asset, data: JSON.parse(await readObject(asset)).data };
  }
  const matches = sets[code].data.cards.filter(
    (c) => c.language === 'English' && c.identifiers?.scryfallId === r.id,
  );
  assert.equal(matches.length, 1, r.name);
  const original = matches[0];
  assert.equal(original.number, r.number);
  assert.equal(typeof original.originalText, 'string');
  assert.equal(typeof original.originalType, 'string');
  const art = await cachedFetch(r.card.image_uris.art_crop);
  const entry = { id: r.id, card: r.card, reference: r.reference, art, category: 'planeswalker' };
  const face = presentation(
    entry,
    {},
    { [r.id]: { originalText: normalizePrintingText(original.originalText) } },
  ).face;
  face.typeLine = original.originalType;
  const typeReview = inputs.printedTypeReviews?.[r.id];
  if (typeReview) {
    assert.equal(typeReview.referenceSha256, r.reference.sha256);
    assert.equal(typeReview.name, r.name);
    face.typeLine = typeReview.typeLine;
  }
  face.frameStyle = 'modern';
  face.legendary = false;
  // Original, printing-specific type label, independent of current errata.
  entry.face = face;
  entry.originalSource = {
    asset: sets[code].asset,
    uuid: original.uuid,
    text: original.originalText,
    type: original.originalType,
  };
  entries.push(entry);
}
const components = await fetchComponents(entries, {}, (e) => e.face);
await writeFile(
  root + '/native-inputs.json',
  JSON.stringify({ entries, components }, null, 2) + '\n',
);
await mkdir(root + '/native', { recursive: true });
const session = await openBrowser(
  { entries, components },
  {
    plugins: [
      {
        name: 'experiment-type-layer',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/presentation/planeswalker-type.ts')) return;
          const needle = '  const [x, y, w, h] = [';
          assert(code.includes(needle));
          return code.replace(
            needle,
            '  if ((globalThis as any).__blueWalkerTypeAsset) { context.drawImage((globalThis as any).__blueWalkerTypeAsset,...(globalThis as any).__blueWalkerTypeRect); return; }\n  if ((globalThis as any).__blueWalkerOmitType) return;\n' +
              needle,
          );
        },
      },
    ],
  },
);
const png = async (name, url) => {
  const bytes = Buffer.from(url.split(',')[1], 'base64');
  rasters[name + '.png'] = createHash('sha256').update(bytes).digest('hex');
  return writeFile(root + '/native/' + name + '.png', bytes);
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
    window.__walkerLoad = loadCanvasImages;
    window.__walkerCompose = (
      await import('/games/magic/src/presentation/canvas-face.ts')
    ).composeCardTexture;
  });
  if (candidateData)
    await session.page.evaluate(async (data) => {
      const bg = await createImageBitmap(await (await fetch(data.background)).blob());
      window.__blueWalkerBackground = await createImageBitmap(bg, {
        resizeWidth: 768,
        resizeHeight: Math.round((bg.height * 768) / bg.width),
        resizeQuality: 'high',
      });
      bg.close();
      window.__blueWalkerTypeAsset = await createImageBitmap(await (await fetch(data.type)).blob());
      window.__blueWalkerTypeRect = data.rect;
    }, candidateData);
  for (const e of entries) {
    const result = await session.page.evaluate(
      async ({ face, bgUrl, first, candidate }) => {
        const signal = new AbortController().signal;
        const paint = async (mode) => {
          window.__blueWalkerOmitType = mode === 'under-type' || mode.startsWith('bg-');
          const image = await window.__walkerCompose(
            { face, printingId: null, printedImage: null },
            'inspect',
            signal,
            mode.startsWith('bg-') || candidate
              ? {
                  loadImages: async (urls, s) => {
                    const loaded = await window.__walkerLoad(urls, s);
                    if (candidate) {
                      const images = Object.assign(new Map(loaded.images), loaded.images);
                      images.set(bgUrl, window.__blueWalkerBackground);
                      return {
                        images,
                        dispose() {
                          loaded.dispose();
                        },
                      };
                    }
                    const original = loaded.images.get(bgUrl);
                    if (!original) throw Error('No blue background');
                    const canvas = document.createElement('canvas');
                    canvas.width = original.width;
                    canvas.height = original.height;
                    const c = canvas.getContext('2d');
                    c.drawImage(original, 0, 0);
                    const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
                    for (let y = 0; y < canvas.height; y++)
                      for (let x = 0; x < canvas.width; x++) {
                        const p = (y * canvas.width + x) * 4;
                        pixels.data[p] =
                          mode === 'bg-uv'
                            ? Math.round((255 * (x + 0.5)) / canvas.width)
                            : mode === 'bg-white'
                              ? 255
                              : 0;
                        pixels.data[p + 1] =
                          mode === 'bg-uv'
                            ? Math.round((255 * (y + 0.5)) / canvas.height)
                            : mode === 'bg-white'
                              ? 255
                              : 0;
                        pixels.data[p + 2] = mode === 'bg-white' ? 255 : 0;
                      }
                    c.putImageData(pixels, 0, 0);
                    const bitmap = await createImageBitmap(canvas);
                    const images = Object.assign(new Map(loaded.images), loaded.images);
                    images.set(bgUrl, bitmap);
                    return {
                      images,
                      dispose() {
                        bitmap.close();
                        loaded.dispose();
                      },
                    };
                  },
                }
              : undefined,
          );
          const c = document.createElement('canvas');
          c.width = image.width;
          c.height = image.height;
          c.getContext('2d').drawImage(image, 0, 0);
          image.close?.();
          return c.toDataURL();
        };
        if (candidate) return { candidate: await paint('candidate') };
        const result = { baseline: await paint('baseline'), underType: await paint('under-type') };
        result.bgBlack = await paint('bg-black');
        result.bgWhite = await paint('bg-white');
        result.bgUV = await paint('bg-uv');
        if (first) {
          window.__blueWalkerOmitType = false;
          const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
          const { paintPlaneswalkerType } = await import(
            '/games/magic/src/presentation/planeswalker-type.ts'
          );
          const { profileAssets } = await import('/games/magic/src/presentation/assets.ts');
          const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
          const assets = profileAssets(resolveCardProfile(face), 'planeswalker');
          const loaded = await window.__walkerLoad([assets.boxes], signal);
          const c = document.createElement('canvas');
          c.width = 732;
          c.height = 1020;
          const ctx = c.getContext('2d');
          ctx.scale(1.5, 1.5);
          paintPlaneswalkerType(ctx, loaded.images.get(assets.boxes), faceRects(face).type);
          result.typeAsset = c.toDataURL();
          loaded.dispose();
        }
        return result;
      },
      {
        face: e.face,
        bgUrl: inputs.assets.planeswalker_bg.url,
        first: e === entries[0],
        candidate: !!candidate,
      },
    );
    for (const [kind, url] of Object.entries(result))
      await png(
        ['baseline', 'underType', 'candidate', 'bgBlack', 'bgWhite', 'bgUV'].includes(kind)
          ? e.id + '-' + kind
          : kind,
        url,
      );
    console.log(
      JSON.stringify({ name: e.card.name, type: e.face.typeLine, width: 732, height: 1020 }),
    );
  }
  assert.deepEqual(session.faults, []);
  await writeFile(
    root + '/native/' + (candidate ? 'candidate-receipt.json' : 'receipt.json'),
    JSON.stringify(
      {
        schema: 1,
        sourceCommit,
        rendererVersion,
        rasters,
        inputSha256: createHash('sha256')
          .update(await readFile(root + '/native-inputs.json'))
          .digest('hex'),
        faults: session.faults,
        records: entries.map((e) => ({ id: e.id, name: e.card.name, type: e.face.typeLine })),
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await session.close();
}
