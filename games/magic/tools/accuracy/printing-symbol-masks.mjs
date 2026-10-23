// Isolated official-symbol raster and actual painter bounds, no scan fitting.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
const [inputFile, out] = process.argv.slice(2);
assert(out, 'Usage: printing-symbol-masks.mjs INPUTS OUT');
const raw = await readFile(inputFile),
  inputs = JSON.parse(raw);
await mkdir(out, { recursive: true });
const rendererHash = await sourceHash(root + '/games/magic/src');
const session = await openBrowser(inputs, { fonts: false }),
  rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
  });
  for (const e of inputs.entries) {
    const r = await session.page.evaluate(async (e) => {
      const { framePlate } = await import('/games/magic/src/presentation/frame-plates.ts');
      const { faceSetSymbol } = await import('/games/magic/src/presentation/assets.ts');
      const { setSymbolCrop } = await import('/games/magic/src/presentation/set-symbols.ts');
      const { styledSymbolBounds } = await import(
        '/games/magic/src/presentation/styled-symbol-placement.ts'
      );
      const { isStyledSetSymbol } = await import(
        '/games/magic/src/presentation/styled-set-symbols.ts'
      );
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
      const p = framePlate(e.face),
        url = faceSetSymbol(e.face),
        crop = setSymbolCrop(e.face);
      if (!p || !isStyledSetSymbol(url))
        throw Error('This probe needs an official replacement-frame symbol');
      const lease = await loadAccuracyImages([url], new AbortController().signal);
      const image = lease.images.get(url),
        cvs = document.createElement('canvas');
      cvs.width = 732;
      cvs.height = 1020;
      try {
        const f = Math.min(
          (p.symbol.width * 488) / (image.width * crop[2]),
          (p.symbol.height * 680) / (image.height * crop[3]),
        );
        const w = image.width * crop[2] * f,
          h = image.height * crop[3] * f;
        const bounds = styledSymbolBounds(e.face, url, [
          p.symbol.right * 488 - w,
          p.symbol.center * 680 - h / 2,
          w,
          h,
        ]);
        const c = cvs.getContext('2d');
        c.scale(1.5, 1.5);
        c.drawImage(image, ...bounds);
        return { url, bounds, png: cvs.toDataURL().split(',')[1] };
      } finally {
        cvs.width = cvs.height = 0;
        lease.dispose();
      }
    }, e);
    const bytes = Buffer.from(r.png, 'base64'),
      file = e.id + '.png';
    await writeFile(path.join(out, file), bytes);
    rows.push({
      id: e.id,
      name: e.card.name,
      rarity: e.face.rarity,
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      url: r.url,
      bounds: r.bounds,
      file,
      sha256: hash(bytes),
    });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
  await writeJson(path.join(out, 'masks.json'), {
    schema: 1,
    source: {
      inputsHash: hash(raw),
      rendererHash,
      toolHash: hash(await readFile(new URL(import.meta.url))),
    },
    rows,
  });
  console.log('symbol masks', rows.length);
} finally {
  await session.close();
}
