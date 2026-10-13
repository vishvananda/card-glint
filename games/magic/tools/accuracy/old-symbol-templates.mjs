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

const snapshot = await readJson(`${cacheRoot}/rollout/old-symbol-material.json`),
  plan = await readJson(`${fixtureRoot}/old-symbol-material-plan.json`),
  base = `${outputRoot}/old-symbol-material/templates`,
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
      const { historicalBackingKey } = await import(
        '/games/magic/src/presentation/historical-symbol-backing.ts'
      );
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal),
        url = retroSetSymbol(face),
        out = [];
      try {
        for (const [tier, key] of [
          ['stencil', url],
          ['backing', historicalBackingKey(url)],
        ]) {
          const bitmap = loaded.images.get(key);
          if (!bitmap) throw Error(`Missing ${tier}: ${url}`);
          const c = document.createElement('canvas');
          c.width = bitmap.width;
          c.height = bitmap.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(bitmap, 0, 0);
          out.push({ tier, data: c.toDataURL() });
          ctx.clearRect(0, 0, c.width, c.height);
          loaded.images.set(key, await createImageBitmap(c));
          bitmap.close();
          c.width = c.height = 0;
        }
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
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
  await writeJson(`${base}/capture.json`, {
    rendererHash,
    planHash: hash(JSON.stringify(plan)),
    methodHash: hash(await readFile(new URL(import.meta.url))),
    rows,
  });
} finally {
  await session.close();
}
console.log('Prepared blank backgrounds and original/white stencils:', rows.length);
