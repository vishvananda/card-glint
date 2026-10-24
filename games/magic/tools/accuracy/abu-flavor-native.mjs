// Native proof for scan-reviewed Original flavor data, without painter changes.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, sourceHash } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const [referenceRoot, beforeInput, afterInput, out] = process.argv.slice(2);
assert(out, 'Usage: abu-flavor-native.mjs REFERENCE BEFORE_INPUTS AFTER_INPUTS OUT');
const beforeBytes = await readFile(beforeInput),
  afterBytes = await readFile(afterInput);
const before = JSON.parse(beforeBytes),
  after = JSON.parse(afterBytes);
const nativeFile = 'games/magic/fixtures/accuracy/early-through-fourth/abu-paper-native.json.gz';
const nativeRaw = gunzipSync(await readFile(nativeFile)),
  prior = JSON.parse(nativeRaw);
const review = JSON.parse(
  await readFile(
    'games/magic/fixtures/accuracy/early-through-fourth/abu-flavor-attribution-source-review.json',
  ),
);
assert.equal(before.entries.length, 899);
assert.equal(after.entries.length, 899);
assert.equal(hash(beforeBytes), prior.source.inputHash);
const affectedIds = review.cards.map((r) => r.id).sort(),
  definitions = {};
const source = {
  beforeRenderer: await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  afterRenderer: await sourceHash(path.join(root, 'games/magic/src')),
  beforeInputHash: hash(beforeBytes),
  afterInputHash: hash(afterBytes),
  priorNativeHash: hash(nativeRaw),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  browserHash: await sourceHash(path.join(root, 'packages/browser/src')),
};
assert.equal(source.beforeRenderer, prior.source.afterRenderer);
assert.equal(
  source.browserHash,
  await sourceHash(path.join(referenceRoot, 'packages/browser/src')),
);
for (const f of ['games/magic/fonts.css', 'games/magic/assets.json'])
  assert.deepEqual(await readFile(f), await readFile(path.join(referenceRoot, f)));
const ssr = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  await ssr.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { withCardWording } = await ssr.ssrLoadModule('/games/magic/src/index.ts');
  const { canvasAssetUrls } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  for (const e of after.entries) {
    const b = before.entries.find((r) => r.id === e.id);
    assert.deepEqual(e.pose, b.pose);
    assert.deepEqual(e.reference, b.reference);
    assert.deepEqual(e.art, b.art);
    const affected = affectedIds.includes(e.id);
    assert.equal(JSON.stringify(e.face) !== JSON.stringify(b.face), affected);
    if (!affected) continue;
    definitions[e.id] = [
      { mode: 'original', symbols: 'original', includeFlavor: false },
      ...[false, true].flatMap((includeFlavor) =>
        ['modern', 'original'].map((symbols) => ({
          mode: 'oracle',
          symbols,
          includeFlavor,
        })),
      ),
    ].map((d) => {
      const faces = {};
      for (const [version, entry] of [
        ['before', b],
        ['after', e],
      ]) {
        faces[version] =
          d.mode === 'original'
            ? entry.face
            : withCardWording(
                entry.face,
                {
                  original: entry.face,
                  oracle: {
                    typeLine: entry.card.type_line,
                    rulesText: entry.card.oracle_text ?? '',
                  },
                },
                'oracle',
                {
                  rulesAlignment: 'oracle',
                  symbolStyle: d.symbols,
                  includeFlavorText: d.includeFlavor,
                },
              );
      }
      return { ...d, faces };
    });
    for (const d of definitions[e.id])
      for (const face of Object.values(d.faces))
        for (const url of canvasAssetUrls(face))
          if (url?.startsWith('https:') && !after.components.some((c) => c.url === url))
            after.components.push(await cachedFetch(url, { offline: true }));
  }
} finally {
  await ssr.close();
}
await mkdir(out, { recursive: true });
const rows = [],
  faces = [];
const checkpoint = async (complete) =>
  writeFile(
    path.join(out, complete ? 'proof.json' : 'progress.json'),
    JSON.stringify(
      {
        schema: 1,
        status: complete ? 'complete-native-flavor-data-census' : 'in-progress',
        scope:
          '899 Original native faces, three exact flavor-break inputs, both Oracle symbol modes with/without Original fallback flavor. Only reviewed Original flavor metadata changes; frozen scan poses, art, font and layout code remain exact. Outside-rules pixels, silhouettes and default etching are checked. Unrelated896 current Original rasters reproduce prior native hashes.',
        source,
        affectedIds,
        completed: rows.length,
        rows,
        faces,
        faults: session.faults,
      },
      null,
      2,
    ) + '\n',
  );
const session = await openBrowser(after, {
  plugins: [
    {
      name: 'flavor-reference',
      config() {
        return { server: { fs: { allow: [root, referenceRoot] } } };
      },
    },
  ],
});
function difference(a, b) {
  assert.equal(a.width, b.width);
  assert.equal(a.height, b.height);
  let changed = 0,
    alpha = 0,
    outside = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    if (a.data[i + 3] !== b.data[i + 3]) alpha++;
    if (
      a.data[i] !== b.data[i] ||
      a.data[i + 1] !== b.data[i + 1] ||
      a.data[i + 2] !== b.data[i + 2] ||
      a.data[i + 3] !== b.data[i + 3]
    ) {
      changed++;
      const p = i / 4,
        x = p % 732,
        y = Math.floor(p / 732);
      if (x < 75 || x > 678 || y < 600 || y > 907) outside++;
    }
  }
  return { changed, alpha, outside };
}
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async (referenceRoot) => {
    for (const base of ['', '/@fs' + referenceRoot]) {
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager.ts');
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager-wording.ts');
    }
  }, referenceRoot);
  for (const e of after.entries) {
    const b = before.entries.find((r) => r.id === e.id),
      old = prior.rows.find((r) => r.id === e.id);
    assert.equal(old.inputHash, hash(JSON.stringify(b.face)));
    const defs = definitions[e.id];
    const values = await session.page.evaluate(
      async ({ e, b, defs, referenceRoot }) => {
        const before = await import(
          /* @vite-ignore */ '/@fs' + referenceRoot + '/games/magic/src/presentation/canvas-face.ts'
        );
        const after = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const choices = defs ?? [
          {
            mode: 'original',
            symbols: 'original',
            includeFlavor: false,
            faces: { before: b.face, after: e.face },
          },
        ];
        const lease = await loadAccuracyImages(
          choices.flatMap((d) => Object.values(d.faces).flatMap(canvasAssetUrls)),
          new AbortController().signal,
          e.face.illustration,
        );
        const values = [];
        try {
          for (const d of choices) {
            const keys = {},
              images = {};
            for (const [version, api] of [
              ['before', before],
              ['after', after],
            ]) {
              keys[version] = {};
              for (const layer of ['face', 'etching']) {
                const input = {
                  face: d.faces[version],
                  printingId: e.id,
                  printedImage: null,
                  layer,
                };
                keys[version][layer] = api.cardTextureKey(input, 'inspect');
                if (!defs && (version === 'before' || layer === 'etching')) continue;
                const c = await api.composeCardTexture(
                  input,
                  'inspect',
                  new AbortController().signal,
                  { loadImages: async () => ({ ...lease, dispose() {} }) },
                );
                try {
                  images[version + '-' + layer] = c.toDataURL().split(',')[1];
                } finally {
                  c.width = c.height = 0;
                }
              }
            }
            values.push({ ...d, keys, images });
          }
        } finally {
          lease.dispose();
        }
        return values;
      },
      { e, b, defs, referenceRoot },
    );
    let original;
    for (const v of values) {
      const hashes = {};
      for (const [key, png] of Object.entries(v.images)) {
        const bytes = Buffer.from(png, 'base64');
        hashes[key] = hash(bytes);
        if (defs)
          await writeFile(
            path.join(
              out,
              e.id + '-' + v.mode + '-' + v.symbols + '-' + v.includeFlavor + '-' + key + '.png',
            ),
            bytes,
          );
      }
      assert.equal(v.keys.before.etching, v.keys.after.etching, 'Changed default etching key');
      const dataChanged = !!defs && (v.mode === 'original' || v.includeFlavor);
      assert.equal(
        v.keys.before.face !== v.keys.after.face,
        dataChanged,
        'Incorrect face invalidation',
      );
      if (!defs) assert.equal(hashes['after-face'], old.original.hashes['after-face']);
      if (defs)
        for (const layer of ['face', 'etching']) {
          const diff = difference(
            PNG.sync.read(Buffer.from(v.images['before-' + layer], 'base64')),
            PNG.sync.read(Buffer.from(v.images['after-' + layer], 'base64')),
          );
          assert.equal(diff.outside, 0);
          assert.equal(diff.alpha, 0);
          if (layer === 'etching' || !dataChanged) assert.equal(diff.changed, 0);
          faces.push({
            id: e.id,
            set: e.set,
            name: e.name,
            mode: v.mode,
            symbols: v.symbols,
            includeFlavor: v.includeFlavor,
            layer,
            beforeHash: hashes['before-' + layer],
            afterHash: hashes['after-' + layer],
            ...diff,
          });
        }
      const keys = Object.fromEntries(
        Object.entries(v.keys).map(([k, layers]) => [
          k,
          Object.fromEntries(Object.entries(layers).map(([l, key]) => [l, hash(key)])),
        ]),
      );
      if (v.mode === 'original') {
        assert.equal(keys.before.face, old.original.keys.after.face);
        if (defs) assert.equal(hashes['before-face'], old.original.hashes['after-face']);
        original = { keys, hashes };
      }
    }
    rows.push({
      id: e.id,
      set: e.set,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(e.pose)),
      beforeInputHash: old.inputHash,
      inputHash: hash(JSON.stringify(e.face)),
      affected: !!defs,
      original,
    });
    if (rows.length % 25 === 0) {
      await checkpoint(false);
      console.log(rows.length + '/899');
    }
  }
  assert.equal(faces.length, 30);
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), source.afterRenderer);
  assert.equal(hash(await readFile(new URL(import.meta.url))), source.toolHash);
  source.closed = true;
  await checkpoint(true);
  console.log(
    JSON.stringify({
      completed: rows.length,
      pairs: faces.length,
      changedOriginal: faces
        .filter((r) => r.mode === 'original' && r.layer === 'face' && r.changed > 0)
        .map((r) => r.set),
      faults: session.faults,
    }),
  );
} finally {
  await session.close();
}
