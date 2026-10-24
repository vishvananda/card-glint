// Full ABU native replay for the reviewed flow policy and exact Stasis source corrections.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const [referenceRoot, beforeFile, afterFile, inputProofFile, trialDir, out] = process.argv.slice(2);
assert(out, 'Usage: abu-flow-native.mjs REFERENCE BEFORE AFTER INPUT_PROOF TRIALS OUT');
const bb = await readFile(beforeFile),
  ab = await readFile(afterFile),
  before = JSON.parse(bb),
  after = JSON.parse(ab);
const ipb = await readFile(inputProofFile),
  ip = JSON.parse(ipb);
const parentFile = 'games/magic/fixtures/accuracy/early-through-fourth/abu-art-native.json.gz';
const parentRaw = gunzipSync(await readFile(parentFile)),
  parent = JSON.parse(parentRaw);
const tb = await readFile(path.join(trialDir, 'capture.json')),
  trial = JSON.parse(tb);
assert.equal(before.entries.length, 899);
assert.equal(after.entries.length, 899);
assert.equal(ip.source.beforeInputHash, hash(bb));
assert.equal(ip.source.afterInputHash, hash(ab));
assert.equal(ip.source.closed, true);
assert.equal(parent.source.inputHash, hash(bb));
assert.equal(trial.source.inputHash, hash(bb));
assert.equal(trial.source.rendererHash, parent.source.afterRenderer);
const source = {
  beforeRenderer: await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  afterRenderer: await sourceHash('games/magic/src'),
  beforeInputHash: hash(bb),
  afterInputHash: hash(ab),
  inputProofHash: hash(ipb),
  parentNativeHash: hash(parentRaw),
  prototypeCaptureHash: hash(tb),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  browserHash: await sourceHash('packages/browser/src'),
};
assert.equal(source.beforeRenderer, parent.source.afterRenderer);
assert.equal(source.afterRenderer, ip.source.rendererHash);
assert.equal(
  source.browserHash,
  await sourceHash(path.join(referenceRoot, 'packages/browser/src')),
);
for (const file of ['games/magic/fonts.css', 'games/magic/assets.json'])
  assert.deepEqual(await readFile(file), await readFile(path.join(referenceRoot, file)));
const sourceChangedIds = ip.rows
  .filter((r) => r.changed)
  .map((r) => r.id)
  .sort();
assert.equal(sourceChangedIds.length, 3);
const definitions = {},
  eligible = [];
const ssr = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  await ssr.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { withCardWording } = await ssr.ssrLoadModule('/games/magic/src/index.ts');
  const { earlyTextFlowRevision } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/alpha-typography.ts',
  );
  const { canvasAssetUrls } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  for (const e of after.entries) {
    const b = before.entries.find((v) => v.id === e.id);
    assert(b);
    assert.deepEqual(e.pose, b.pose);
    assert.deepEqual(e.reference, b.reference);
    assert.deepEqual(e.art, b.art);
    const changed = sourceChangedIds.includes(e.id);
    assert.equal(hash(JSON.stringify(e.face)) !== hash(JSON.stringify(b.face)), changed);
    const flow = Boolean(earlyTextFlowRevision(e.face));
    if (!flow && !changed) continue;
    eligible.push({ id: e.id, set: e.set, name: e.name, flow, wording: changed });
    definitions[e.id] = [
      ['original', 'original'],
      ['oracle', 'modern'],
      ['oracle', 'original'],
    ].map(([mode, symbolStyle]) => {
      const faces = {};
      for (const [version, entry] of [
        ['before', b],
        ['after', e],
      ])
        faces[version] =
          mode === 'original'
            ? entry.face
            : withCardWording(
                entry.face,
                {
                  original: entry.face,
                  oracle: {
                    typeLine: entry.card.type_line,
                    rulesText: entry.card.oracle_text ?? '',
                    flavorText: entry.card.flavor_text ?? '',
                  },
                },
                'oracle',
                { rulesAlignment: 'oracle', symbolStyle },
              );
      return { mode, symbolStyle, faces };
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
assert(eligible.length > 30 && eligible.length < 85);
await mkdir(out, { recursive: true });
let rows = [],
  faces = [];
try {
  const checkpoint = JSON.parse(await readFile(path.join(out, 'progress.json')));
  assert.deepEqual(checkpoint.source, source);
  assert.deepEqual(checkpoint.eligible, eligible);
  rows = checkpoint.rows;
  faces = checkpoint.faces;
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
const session = await openBrowser(after, {
  plugins: [
    {
      name: 'flow-reference',
      config() {
        return { server: { fs: { allow: [root, referenceRoot] } } };
      },
    },
  ],
});
const difference = (a, b) => {
  assert.equal(a.width, b.width);
  assert.equal(a.height, b.height);
  let changed = 0,
    alpha = 0,
    outside = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    if (a.data[i + 3] !== b.data[i + 3]) alpha++;
    if ([0, 1, 2, 3].some((k) => a.data[i + k] !== b.data[i + k])) {
      changed++;
      const x = ((i / 4) % 732) / 1.5,
        y = Math.floor(i / 4 / 732) / 1.5;
      if (x < 45 || x > 455 || y < 395 || y > 610) outside++;
    }
  }
  return { changed, alpha, outside };
};
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async (ref) => {
    for (const base of ['', '/@fs' + ref]) {
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager.ts');
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager-wording.ts');
    }
  }, referenceRoot);
  for (const e of after.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    const b = before.entries.find((v) => v.id === e.id),
      binding = eligible.find((v) => v.id === e.id),
      old = parent.rows.find((v) => v.id === e.id);
    assert.equal(old.inputHash, hash(JSON.stringify(b.face)));
    assert.equal(old.referenceHash, e.reference.sha256);
    assert.equal(old.poseHash, hash(JSON.stringify(e.pose)));
    const result = await session.page.evaluate(
      async ({ e, b, defs, ref }) => {
        const before = await import(
            /* @vite-ignore */ '/@fs' + ref + '/games/magic/src/presentation/canvas-face.ts'
          ),
          after = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const choices = defs ?? [
          { mode: 'original', symbolStyle: 'original', faces: { before: b.face, after: e.face } },
        ];
        const lease = await loadAccuracyImages(
            choices.flatMap((d) => Object.values(d.faces).flatMap(canvasAssetUrls)),
            new AbortController().signal,
            e.face.illustration,
          ),
          pairs = [];
        try {
          for (const d of choices) {
            const variants = [
              ['face', {}],
              ['etching', { layer: 'etching' }],
              ...(defs && d.mode === 'original'
                ? [
                    ['printing', { paintLayer: 'printing' }],
                    ['artwork', { paintLayer: 'artwork' }],
                  ]
                : []),
            ];
            const keys = {},
              images = {};
            for (const [version, api] of [
              ['before', before],
              ['after', after],
            ]) {
              keys[version] = {};
              for (const [layer, options] of variants) {
                const input = {
                  face: d.faces[version],
                  printingId: e.id,
                  printedImage: null,
                  ...options,
                };
                keys[version][layer] = api.cardTextureKey(input, 'inspect');
                if (!defs && (version === 'before' || layer !== 'face')) continue;
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
          return pairs;
        } finally {
          lease.dispose();
        }
      },
      { e, b, defs: definitions[e.id], ref: referenceRoot },
    );
    let original;
    for (const pair of result) {
      assert.equal(
        pair.keys.before.etching,
        pair.keys.after.etching,
        'Body edit changed etching identity',
      );
      assert.equal(
        pair.keys.before.face !== pair.keys.after.face,
        Boolean(binding) && pair.mode === 'original',
      );
      if (pair.keys.before.artwork)
        assert.equal(
          pair.keys.before.artwork !== pair.keys.after.artwork,
          Boolean(binding?.wording),
        );
      const hashes = {};
      for (const [key, data] of Object.entries(pair.images)) {
        const bytes = Buffer.from(data, 'base64');
        hashes[key] = hash(bytes);
        if (binding)
          await writeFile(
            path.join(out, e.id + '-' + pair.mode + '-' + pair.symbolStyle + '-' + key + '.png'),
            bytes,
          );
      }
      if (!binding)
        assert.equal(
          hashes['after-face'],
          old.original.hashes['after-face'],
          'Unrelated native pixels changed: ' + e.set + '/' + e.name,
        );
      else {
        for (const layer of Object.keys(pair.keys.before)) {
          const diff = difference(
            PNG.sync.read(Buffer.from(pair.images['before-' + layer], 'base64')),
            PNG.sync.read(Buffer.from(pair.images['after-' + layer], 'base64')),
          );
          assert.equal(diff.alpha, 0);
          assert.equal(diff.outside, 0);
          if (pair.mode === 'oracle' || ['etching', 'artwork'].includes(layer))
            assert.equal(diff.changed, 0, 'Unrelated layer changed');
          faces.push({
            id: e.id,
            set: e.set,
            name: e.name,
            mode: pair.mode,
            symbolStyle: pair.symbolStyle,
            layer,
            beforeHash: hashes['before-' + layer],
            afterHash: hashes['after-' + layer],
            ...diff,
          });
        }
        if (pair.mode === 'original') {
          assert.equal(hashes['before-face'], old.original.hashes['after-face']);
          if (!binding.wording) {
            const expected = trial.rows.find((r) => r.id === e.id && r.trial === 'combined');
            assert(expected);
            assert.equal(
              hashes['after-face'],
              expected.nativeFaceHash,
              'Production flow differs from measured candidate: ' + e.name,
            );
          }
        }
      }
      if (pair.mode === 'original')
        original = {
          keys: Object.fromEntries(
            Object.entries(pair.keys).map(([version, key]) => [
              version,
              Object.fromEntries(Object.entries(key).map(([layer, value]) => [layer, hash(value)])),
            ]),
          ),
          hashes,
        };
    }
    rows.push({
      id: e.id,
      set: e.set,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: old.poseHash,
      beforeInputHash: old.inputHash,
      inputHash: hash(JSON.stringify(e.face)),
      affected: Boolean(binding),
      flow: binding?.flow ?? false,
      wording: binding?.wording ?? false,
      pixelsChanged: original.hashes['after-face'] !== old.original.hashes['after-face'],
      original,
    });
    if (rows.length % 25 === 0) {
      await writeJson(path.join(out, 'progress.json'), { source, eligible, rows, faces });
      console.log(rows.length + '/899');
    }
  }
  assert.equal(rows.length, 899);
  assert.equal(faces.length, eligible.length * 8);
  assert.equal(rows.filter((r) => r.pixelsChanged).length, 33);
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash('games/magic/src'), source.afterRenderer);
  source.closed = true;
  await writeJson(path.join(out, 'proof.json'), {
    schema: 1,
    status: 'complete-native-abu-flow-and-wording-census',
    scope:
      'All899 Original native faces and keys. Scoped original-printing flow cohort plus three exact Stasis wording corrections. Every non-Stasis eligible face matches the frozen refined candidate exactly. Original/Oracle and separate printing/artwork/etching pairs retain silhouettes and outside-rules pixels; Oracle, art and masks remain byte-exact. Unchanged recipe keys and rasters keep their source identities; no scan pose, pigment, artwork or frame adjustment.',
    source,
    eligible,
    sourceChangedIds,
    completed: rows.length,
    rows,
    faces,
    faults: session.faults,
  });
  console.log(
    JSON.stringify({
      completed: rows.length,
      eligible: eligible.length,
      flow: eligible.filter((e) => e.flow).length,
      wording: sourceChangedIds.length,
      changed: rows.filter((r) => r.pixelsChanged).length,
      pairs: faces.length,
    }),
  );
} finally {
  await session.close();
}
