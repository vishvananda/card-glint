// Actual native shared art-height candidates. Scan normalization remains frozen.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { root, hash, sourceHash } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { printingFlavorDelta } from './printing-flavor-data-ancestry.mjs';
import { abuDualArtTrialPlugin } from './abu-dual-art-trial-plugin.mjs';
const [inputFile, out] = process.argv.slice(2);
assert(out, 'Usage: abu-dual-art-trials.mjs INPUTS OUT');
const p = await printingFlavorDelta(),
  ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
const native = JSON.parse(gunzipSync(await readFile(p.native.file)));
assert.equal(hash(ib), native.source.afterInputHash);
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const entries = inputs.entries.filter(
  (e) => ['lea', 'leb'].includes(e.set) && e.face.frameColors?.length === 2,
);
assert.equal(entries.length, 19);
const trials = [
  { id: 'current', bottomUp: null },
  { id: 'control', bottomUp: 0 },
  ...[1.5, 2, 2.25, 2.5, 3].map((bottomUp) => ({ id: 'up-' + bottomUp, bottomUp })),
];
const transformed = {},
  rows = [];
const source = {
  rendererHash: p.afterRenderer,
  inputHash: hash(ib),
  nativeHash: p.native.contentSha256,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  pluginHash: hash(await readFile(new URL('./abu-dual-art-trial-plugin.mjs', import.meta.url))),
  kernelHash: hash(await readFile(new URL('./abu-dual-art-pixels.mjs', import.meta.url))),
};
await mkdir(out, { recursive: true });
const session = await openBrowser(
  { ...inputs, entries },
  { plugins: [abuDualArtTrialPlugin(transformed)] },
);
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__artCompose = (
      await import('/games/magic/src/presentation/canvas-face.ts')
    ).composeCardTexture;
    globalThis.__artUrls = (
      await import('/games/magic/src/presentation/canvas-assets.ts')
    ).canvasAssetUrls;
    globalThis.__artAssets = await import('/games/magic/tools/accuracy/abu-assets.mjs');
    globalThis.__artRects = (
      await import('/games/magic/src/presentation/retro-frame.ts')
    ).retroRects;
  });
  for (const e of entries) {
    const result = await session.page.evaluate(
      async ({ e, trials }) => {
        const signal = new AbortController().signal;
        const lease = await globalThis.__artAssets.loadAccuracyImages(
          globalThis.__artUrls(e.face),
          signal,
          e.face.illustration,
        );
        const values = [];
        try {
          for (const t of trials) {
            globalThis.__abuArtBottom = t.bottomUp;
            const c = await globalThis.__artCompose(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              values.push({
                id: t.id,
                png: c.toDataURL().split(',')[1],
                art: globalThis.__artRects(e.face).art,
              });
            } finally {
              c.width = c.height = 0;
            }
          }
        } finally {
          lease.dispose();
          globalThis.__abuArtBottom = null;
        }
        return values;
      },
      { e, trials },
    );
    const baseline = PNG.sync.read(Buffer.from(result[0].png, 'base64'));
    const current = native.rows.find((r) => r.id === e.id);
    assert.equal(hash(Buffer.from(result[0].png, 'base64')), current.original.hashes['after-face']);
    assert.equal(result[0].png, result[1].png, 'Explicit zero reflow differs');
    for (const t of result) {
      const bytes = Buffer.from(t.png, 'base64'),
        image = PNG.sync.read(bytes);
      let changed = 0,
        outside = 0,
        alpha = 0;
      const bounds = [Infinity, Infinity, -Infinity, -Infinity];
      for (let i = 0; i < image.data.length; i += 4) {
        if (image.data[i + 3] !== baseline.data[i + 3]) alpha++;
        if (
          image.data[i] !== baseline.data[i] ||
          image.data[i + 1] !== baseline.data[i + 1] ||
          image.data[i + 2] !== baseline.data[i + 2] ||
          image.data[i + 3] !== baseline.data[i + 3]
        ) {
          changed++;
          const v = i / 4,
            x = v % 732,
            y = Math.floor(v / 732);
          bounds[0] = Math.min(bounds[0], x);
          bounds[1] = Math.min(bounds[1], y);
          bounds[2] = Math.max(bounds[2], x);
          bounds[3] = Math.max(bounds[3], y);
          if (x / 1.5 < 45 || x / 1.5 > 443 || y / 1.5 < 63 || y / 1.5 > 387) outside++;
        }
      }
      assert.equal(alpha, 0);
      assert.equal(outside, 0, 'Art study escaped declared art/frame region');
      await writeFile(path.join(out, e.id + '-' + t.id + '.png'), bytes);
      rows.push({
        id: e.id,
        name: e.name,
        set: e.set,
        referenceHash: current.referenceHash,
        poseHash: current.poseHash,
        inputHash: current.inputHash,
        trial: t.id,
        art: t.art,
        renderHash: hash(bytes),
        changed,
        outside,
        alpha,
        bounds: changed ? bounds : null,
      });
    }
    console.log(e.set, e.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash('games/magic/src'), source.rendererHash);
  source.closed = true;
  await writeFile(
    path.join(out, 'capture.json'),
    JSON.stringify(
      {
        schema: 1,
        status: 'complete-native-art-height-trials-not-adopted',
        scope:
          'All19 Alpha/Beta duals, frozen scan transforms. Art bottom alone is shortened, with fixed source-color preparation and constant border caps. Glyphs, paper panel, top/outer edges and all positions outside declared art/frame region remain untouched. Actual native current and explicit-zero controls match the current899 census. No per-card transform or parameter is adopted.',
        source,
        transformed,
        trials,
        rows,
        faults: session.faults,
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await session.close();
}
