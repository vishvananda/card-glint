import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  cacheRoot,
  fixtureRoot,
  outputRoot,
  root,
  readJson,
  writeJson,
  hash,
  sourceHash,
  atomicWrite,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { presentation } from './adapter.mjs';

const snapshot = await readJson(`${cacheRoot}/rollout/ice-symbol.json`),
  plan = await readJson(`${fixtureRoot}/ice-symbol-plan.json`),
  base = `${outputRoot}/ice-symbol/templates`,
  rendererHash = await sourceHash(`${root}/games/magic/src`),
  session = await openBrowser(snapshot),
  rows = [];
try {
  for (const e of snapshot.entries.filter((e) => e.cohort === 'calibration')) {
    const face = presentation(e).face;
    const rendered = await session.page.evaluate(async (face) => {
      const { loadCanvasImages, canvasAssetUrls } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const { retroSetSymbol } = await import('/games/magic/src/presentation/retro-frame.ts');
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal),
        url = retroSetSymbol(face),
        out = [];
      try {
        const bitmap = loaded.images.get(url);
        if (!bitmap) throw Error(`Missing symbol: ${url}`);
        const blank = document.createElement('canvas');
        blank.width = bitmap.width;
        blank.height = bitmap.height;
        loaded.images.set(url, await createImageBitmap(blank));
        bitmap.close();
        blank.width = blank.height = 0;
        const c = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
          { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
        );
        out.push({ tier: 'inspect', data: c.toDataURL() });
        c.width = c.height = 0;
        return out;
      } finally {
        loaded.dispose();
      }
    }, face);
    const images = {};
    for (const r of rendered) {
      const bytes = Buffer.from(r.data.split(',')[1], 'base64'),
        file = `${e.id}.${r.tier}.png`;
      await atomicWrite(`${base}/${file}`, bytes);
      images[r.tier] = { file, sha256: hash(bytes) };
    }
    rows.push({ id: e.id, set: e.card.set, name: e.card.name, images });
  }
  const variants = await session.page.evaluate(async () => {
      const { decodeCanvasImage } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const result = [];
      for (const key of ['ice', 'ice2']) {
        const url = `https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg/${key}.svg`,
          blob = await (await fetch(url)).blob();
        const sources = [[key, blob]];
        if (key === 'ice2') {
          for (const [suffix, indices] of [
            ['plate', [0]],
            ['star', [3]],
          ]) {
            const doc = new DOMParser().parseFromString(await blob.text(), 'image/svg+xml'),
              p = doc.querySelector('path'),
              parts = p.getAttribute('d').match(/M[^M]*/g);
            if (parts.length !== 16 || parts.some((s) => /m/.test(s) || !/[zZ]\s*$/.test(s)))
              throw Error('Unexpected pinned snowflake');
            p.setAttribute('d', indices.map((i) => parts[i]).join(''));
            p.setAttribute('fill', '#fff');
            sources.push([
              suffix,
              new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' }),
            ]);
          }
        }
        for (const [name, source] of sources) {
          const bitmap = await decodeCanvasImage(source, new AbortController().signal),
            c = document.createElement('canvas');
          c.width = bitmap.width;
          c.height = bitmap.height;
          c.getContext('2d').drawImage(bitmap, 0, 0);
          result.push({ name, data: c.toDataURL() });
          bitmap.close();
          c.width = c.height = 0;
        }
      }
      return result;
    }),
    stencils = {};
  for (const { name, data } of variants) {
    const bytes = Buffer.from(data.split(',')[1], 'base64'),
      file = name + '.png';
    await atomicWrite(`${base}/${file}`, bytes);
    stencils[name] = { file, sha256: hash(bytes) };
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
  await writeJson(`${base}/capture.json`, {
    rendererHash,
    planHash: hash(JSON.stringify(plan)),
    methodHash: hash(await readFile(new URL(import.meta.url))),
    rows,
    stencils,
  });
} finally {
  await session.close();
}
console.log('Prepared blank backgrounds and original/white stencils:', rows.length);
