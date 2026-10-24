// Verify raster selection boundaries against real native faces and scoped cache keys.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const [referenceRoot, inputFile, priorNative, output] = process.argv.slice(2);
assert(output, 'Usage: abu-raster-native.mjs REFERENCE INPUTS PRIOR_NATIVE OUT');
const inputBytes = await readFile(inputFile),
  snapshot = JSON.parse(inputBytes);
assert.equal(snapshot.entries.length, 899);
const priorBytes = await readFile(path.join(priorNative, 'proof.json')),
  prior = JSON.parse(priorBytes);
let affected;
const modes = [
  ['original', 'original'],
  ['oracle', 'modern'],
  ['oracle', 'original'],
];
const definitions = {};
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { withCardWording } = await server.ssrLoadModule('/games/magic/src/index.ts');
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { retroDualFrameRevision } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-dual-frame.ts',
  );
  affected = snapshot.entries.filter((e) => retroDualFrameRevision(e.face));
  assert(affected.length >= 19 && affected.length <= 29);
  for (const e of affected) {
    definitions[e.id] = modes.map(([mode, symbolStyle]) => ({
      mode,
      symbolStyle,
      face:
        mode === 'original'
          ? e.face
          : withCardWording(
              e.face,
              {
                original: e.face,
                oracle: {
                  typeLine: e.card.type_line,
                  rulesText: e.card.oracle_text ?? '',
                  flavorText: e.card.flavor_text ?? '',
                },
              },
              'oracle',
              { rulesAlignment: 'oracle', symbolStyle },
            ),
    }));
    for (const d of definitions[e.id])
      for (const url of canvasAssetUrls(d.face))
        if (url?.startsWith('https:') && !snapshot.components.some((c) => c.url === url))
          snapshot.components.push(await cachedFetch(url, { offline: true }));
  }
} finally {
  await server.close();
}
const source = {
  beforeRenderer: await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  afterRenderer: await sourceHash(path.join(root, 'games/magic/src')),
  browserHash: await sourceHash(path.join(root, 'packages/browser/src')),
  inputHash: hash(inputBytes),
  priorNativeHash: hash(priorBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  components: snapshot.components.map((c) => [c.url, c.sha256]),
};
assert.equal(
  source.beforeRenderer,
  '5bc07ea356594f3386911fa717fa4d481e2fcfc04100b509dc1da815fc86ac66',
);
assert.equal(
  source.browserHash,
  await sourceHash(path.join(referenceRoot, 'packages/browser/src')),
);
for (const file of ['games/magic/fonts.css', 'games/magic/assets.json'])
  assert.deepEqual(
    await readFile(path.join(referenceRoot, file)),
    await readFile(path.join(root, file)),
  );
await mkdir(output, { recursive: true });
let rows = [],
  faces = [];
try {
  const checkpoint = JSON.parse(await readFile(path.join(output, 'progress.json')));
  assert.deepEqual(checkpoint.source, source, 'New source requires a new native output directory');
  rows = checkpoint.rows;
  faces = checkpoint.faces;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const session = await openBrowser(snapshot, {
  plugins: [
    {
      name: 'perimeter-reference',
      config() {
        return { server: { fs: { allow: [root, referenceRoot] } } };
      },
    },
  ],
});
const pixelDifference = (a, b) => {
  assert.equal(a.width, b.width);
  assert.equal(a.height, b.height);
  let changed = 0,
    alpha = 0,
    interior = 0;
  for (let y = 0; y < a.height; y++)
    for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4;
      if (a.data[i + 3] !== b.data[i + 3]) alpha++;
      if ([0, 1, 2, 3].some((k) => a.data[i + k] !== b.data[i + k])) {
        changed++;
        if (x >= 68 && x < 664 && y >= 68 && y < 948) interior++;
      }
    }
  return { changed, alpha, interior };
};
try {
  await session.page.evaluate(async (referenceRoot) => {
    for (const base of ['', '/@fs' + referenceRoot]) {
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager.ts');
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager-wording.ts');
    }
  }, referenceRoot);
  for (const e of snapshot.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    const isAffected = Boolean(definitions[e.id]);
    const result = await session.page.evaluate(
      async ({ e, definitions, referenceRoot }) => {
        const before = await import(
          /* @vite-ignore */ '/@fs' + referenceRoot + '/games/magic/src/presentation/canvas-face.ts'
        );
        const after = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const choices = definitions ?? [
          { mode: 'original', symbolStyle: 'original', face: e.face },
        ];
        const lease = await loadAccuracyImages(
          choices.flatMap((d) => canvasAssetUrls(d.face)),
          new AbortController().signal,
          e.face.illustration,
        );
        const pairs = [];
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
                const input = { face: d.face, printingId: e.id, printedImage: null, layer };
                keys[version][layer] = api.cardTextureKey(input, 'inspect');
                if (!definitions && (version === 'before' || layer === 'etching')) continue;
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
            pairs.push({ mode: d.mode, symbolStyle: d.symbolStyle, keys, images });
          }
        } finally {
          lease.dispose();
        }
        return pairs;
      },
      { e, definitions: definitions[e.id], referenceRoot },
    );
    const baseline = prior.rows.find((r) => r.id === e.id);
    assert.equal(baseline.referenceHash, e.reference.sha256);
    assert.equal(baseline.poseHash, hash(JSON.stringify(e.pose)));
    let original;
    for (const p of result) {
      assert.equal(
        p.keys.before.etching,
        p.keys.after.etching,
        'Changed default etching cache identity',
      );
      assert.equal(
        p.keys.before.face !== p.keys.after.face,
        isAffected,
        'Incorrect face invalidation scope',
      );
      const hashes = {};
      for (const [key, png] of Object.entries(p.images)) {
        const b = Buffer.from(png, 'base64');
        hashes[key] = hash(b);
        if (isAffected)
          await writeFile(
            path.join(output, e.id + '-' + p.mode + '-' + p.symbolStyle + '-' + key + '.png'),
            b,
          );
      }
      if (!isAffected)
        assert.equal(
          hashes['after-face'],
          baseline.original.hashes['after-face'],
          'Unrelated face changed: ' + e.name,
        );
      if (isAffected) {
        for (const layer of ['face', 'etching']) {
          const diff = pixelDifference(
            PNG.sync.read(Buffer.from(p.images['before-' + layer], 'base64')),
            PNG.sync.read(Buffer.from(p.images['after-' + layer], 'base64')),
          );
          assert.equal(diff.alpha, 0);
          // Clip-selection coverage may change at a boundary; the physical
          // silhouette and default etching must remain exact.
          if (layer === 'etching') assert.equal(diff.changed, 0);
          faces.push({
            id: e.id,
            set: e.set,
            name: e.name,
            mode: p.mode,
            symbolStyle: p.symbolStyle,
            layer,
            beforeHash: hashes['before-' + layer],
            afterHash: hashes['after-' + layer],
            ...diff,
          });
        }
        if (p.mode === 'original') {
          const expected = baseline.original.hashes['after-face'];
          assert.equal(
            hashes['before-face'],
            expected,
            'Before face no longer matches the current reviewed baseline',
          );
        }
      }
      const value = {
        mode: p.mode,
        symbolStyle: p.symbolStyle,
        keys: Object.fromEntries(
          Object.entries(p.keys).map(([k, v]) => [
            k,
            Object.fromEntries(Object.entries(v).map(([layer, key]) => [layer, hash(key)])),
          ]),
        ),
        hashes,
      };
      if (p.mode === 'original') original = value;
    }
    rows.push({
      id: e.id,
      set: e.set,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: baseline.poseHash,
      inputHash: hash(JSON.stringify(e.face)),
      affected: isAffected,
      original,
    });
    if (rows.length % 25 === 0) {
      await writeJson(path.join(output, 'progress.json'), { source, rows, faces });
      console.log(rows.length + '/899');
    }
  }
  assert.equal(rows.length, 899);
  assert.equal(faces.length, affected.length * 6);
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), source.afterRenderer);
  await writeJson(path.join(output, 'proof.json'), {
    schema: 1,
    status: 'complete-native-raster-selection-census',
    scope:
      'All899 current reviewed Original faces and keys. Affected historical duals are paired before/after with Original and both Oracle symbol modes, including default etching. Unrelated face pixels and keys, all silhouettes and default etching remain exact. Only raster material-selection coverage changes; artwork, wording, scan poses, palette, and physical frame geometry are fixed.',
    source,
    affectedIds: affected.map((e) => e.id).sort(),
    completed: rows.length,
    rows,
    faces,
    faults: session.faults,
  });
  console.log(
    JSON.stringify({
      completed: rows.length,
      affected: affected.length,
      pairedLayers: faces.length,
      faults: session.faults,
    }),
  );
} finally {
  await session.close();
}
