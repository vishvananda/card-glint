import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { openBrowser } from '../browser.mjs';
const [study, variantFile, output] = process.argv.slice(2);
if (!study || !variantFile || !output)
  throw Error('Pass study, variant manifest and external output');
const snapshot = JSON.parse(await readFile(study + '/native-inputs.json'));
const variants = JSON.parse(await readFile(variantFile));
assert(Array.isArray(variants) && variants.length > 0);
await mkdir(output, { recursive: true });
const session = await openBrowser(snapshot);
const receipt = {
  schema: 1,
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  scope: 'Background bitmap replacement only; native painter and all other components unchanged',
  variants: [],
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const variant of variants) {
    assert.match(variant.id, /^[a-z0-9-]+$/);
    const bytes = await readFile(variant.file);
    await session.page.evaluate(
      async (url) => {
        const bg = await createImageBitmap(await (await fetch(url)).blob());
        window.__backgroundTrial = await createImageBitmap(bg, {
          resizeWidth: 768,
          resizeHeight: Math.round((bg.height * 768) / bg.width),
          resizeQuality: 'high',
        });
        bg.close();
      },
      'data:image/png;base64,' + bytes.toString('base64'),
    );
    const record = {
      id: variant.id,
      assetSha256: createHash('sha256').update(bytes).digest('hex'),
      rasters: {},
    };
    for (const e of snapshot.entries) {
      const url = await session.page.evaluate(
        async ({ face, bgUrl }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const image = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            'inspect',
            new AbortController().signal,
            {
              loadImages: async (urls, s) => {
                const loaded = await loadCanvasImages(urls, s);
                const images = Object.assign(new Map(loaded.images), loaded.images);
                images.set(bgUrl, window.__backgroundTrial);
                return {
                  images,
                  dispose() {
                    loaded.dispose();
                  },
                };
              },
            },
          );
          const c = document.createElement('canvas');
          c.width = image.width;
          c.height = image.height;
          c.getContext('2d').drawImage(image, 0, 0);
          image.close?.();
          return c.toDataURL();
        },
        {
          face: e.face,
          bgUrl: snapshot.components.find((c) => c.url.includes('/planeswalker_bg/')).url,
        },
      );
      const png = Buffer.from(url.split(',')[1], 'base64'),
        file = e.id + '-' + variant.id + '.png';
      await writeFile(output + '/' + file, png);
      record.rasters[file] = createHash('sha256').update(png).digest('hex');
    }
    receipt.variants.push(record);
    await session.page.evaluate(() => {
      window.__backgroundTrial.close();
      window.__backgroundTrial = null;
    });
    console.log(variant.id);
  }
  assert.deepEqual(session.faults, []);
  await writeFile(output + '/background-capture.json', JSON.stringify(receipt, null, 2) + '\n');
} finally {
  await session.close();
}
