// Paired printing, illustration and host-supplied etching checks for the shared aperture.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash } from './common.mjs';
import { openBrowser } from './browser.mjs';
const [referenceRoot, inputFile, out] = process.argv.slice(2);
assert(out, 'Usage: abu-art-layers.mjs REFERENCE INPUTS OUT');
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
const entries = inputs.entries.filter(
  (e) => ['lea', 'leb'].includes(e.set) && e.face.frameColors?.length === 2,
);
assert.equal(entries.length, 19);
const source = {
  beforeRenderer: await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  afterRenderer: await sourceHash('games/magic/src'),
  inputHash: hash(ib),
  toolHash: hash(await readFile(new URL(import.meta.url))),
};
await mkdir(out, { recursive: true });
const session = await openBrowser(
  { ...inputs, entries },
  {
    plugins: [
      {
        name: 'art-layer-reference',
        config() {
          return { server: { fs: { allow: [root, referenceRoot] } } };
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async (referenceRoot) => {
    for (const base of ['', '/@fs' + referenceRoot]) {
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager.ts');
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager-wording.ts');
    }
  }, referenceRoot);
  for (const e of entries) {
    const result = await session.page.evaluate(
      async ({ e, referenceRoot }) => {
        const urls = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
          urls.canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        ctx.fillStyle = 'white';
        for (let y = 0; y < 128; y += 16)
          for (let x = 0; x < 128; x += 16) if ((x + y) % 32 === 0) ctx.fillRect(x, y, 16, 16);
        const bitmap = await createImageBitmap(c),
          maskUrl = '/__synthetic-art-etch';
        const images = new Map(lease.images);
        images.set(maskUrl, bitmap);
        const data = {};
        try {
          for (const [version, base] of [
            ['before', '/@fs' + referenceRoot],
            ['after', ''],
          ]) {
            const { composeCardTexture, cardTextureKey } = await import(
              /* @vite-ignore */ base + '/games/magic/src/presentation/canvas-face.ts'
            );
            const { faceRects } = await import(
              /* @vite-ignore */ base + '/games/magic/src/presentation/special-frames.ts'
            );
            const { faceArtBounds } = await import(
              /* @vite-ignore */ base + '/games/magic/src/presentation/art-apertures.ts'
            );
            data[version] = {
              art: faceRects(e.face).art,
              bounds: faceArtBounds(e.face),
              layers: {},
            };
            for (const layer of ['printing', 'artwork', 'custom-etching']) {
              const input = {
                face: e.face,
                printingId: e.id,
                printedImage: null,
                ...(layer === 'custom-etching' ? { layer: 'etching' } : { paintLayer: layer }),
              };
              const output = await composeCardTexture(
                input,
                'inspect',
                new AbortController().signal,
                {
                  loadImages: async () => ({ images, dispose() {} }),
                  ...(layer === 'custom-etching' ? { resolveEtching: async () => maskUrl } : {}),
                },
              );
              try {
                data[version].layers[layer] = {
                  key: cardTextureKey(input, 'inspect'),
                  png: output.toDataURL().split(',')[1],
                };
              } finally {
                output.width = output.height = 0;
              }
            }
          }
          return data;
        } finally {
          lease.dispose();
          bitmap.close();
          c.width = c.height = 0;
        }
      },
      { e, referenceRoot },
    );
    assert.deepEqual(result.before.art.slice(0, 3), result.after.art.slice(0, 3));
    assert.equal(result.after.art[3], result.before.art[3] - 2 / 680);
    const uv = ([x, y, w, h]) => [x, 1 - y - h, x + w, 1 - y];
    assert.deepEqual(result.after.bounds, [uv(result.after.art), [0, 0, 0, 0]]);
    for (const layer of ['printing', 'artwork', 'custom-etching']) {
      const b = result.before.layers[layer],
        a = result.after.layers[layer];
      assert.notEqual(b.key, a.key);
      const images = {};
      const hashes = {};
      for (const [version, v] of [
        ['before', b],
        ['after', a],
      ]) {
        const bytes = Buffer.from(v.png, 'base64');
        hashes[version] = hash(bytes);
        images[version] = PNG.sync.read(bytes);
        await writeFile(path.join(out, e.id + '-' + layer + '-' + version + '.png'), bytes);
      }
      const before = images.before,
        after = images.after;
      assert.equal(before.width, 732);
      assert.equal(before.height, 1020);
      assert.equal(after.width, before.width);
      assert.equal(after.height, before.height);
      let changed = 0,
        outside = 0;
      for (let i = 0; i < after.data.length; i += 4) {
        if ([0, 1, 2, 3].some((k) => after.data[i + k] !== before.data[i + k])) {
          changed++;
          const x = ((i / 4) % 732) / 1.5,
            y = Math.floor(i / 4 / 732) / 1.5;
          if (x < 45 || x > 443 || y < 63 || y > 387) outside++;
        }
      }
      assert.equal(outside, 0);
      assert(changed > 0);
      rows.push({
        id: e.id,
        set: e.set,
        name: e.name,
        layer,
        beforeHash: hashes.before,
        afterHash: hashes.after,
        beforeKey: hash(b.key),
        afterKey: hash(a.key),
        beforeArt: result.before.art,
        afterArt: result.after.art,
        afterBounds: result.after.bounds,
        changed,
        outside,
      });
    }
    console.log(e.set, e.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash('games/magic/src'), source.afterRenderer);
  source.closed = true;
  await writeFile(
    path.join(out, 'proof.json'),
    JSON.stringify(
      {
        schema: 1,
        status: 'complete-native-art-height-layer-pairs',
        scope:
          '19 affected Original faces, paired printing/illustration and synthetic host etching layers. Rectangles and public shader UV bounds agree, only intended art/frame pixels change, scoped cache keys invalidate. Frozen scan poses and color preparation remain unchanged.',
        source,
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
