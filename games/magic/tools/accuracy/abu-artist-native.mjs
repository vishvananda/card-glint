// Exact-printing artist replay; no scan or layout fitting.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
const [referenceRoot, inputFile, priorNative, out] = process.argv.slice(2);
assert(out, 'Usage: abu-artist-native.mjs REFERENCE INPUTS PRIOR_NATIVE OUT');
const tool = hash(await readFile(new URL(import.meta.url)));
const snapshot = JSON.parse(await readFile(inputFile));
const entry = snapshot.entries.find((e) => e.set === 'lea' && e.name === 'Tropical Island');
assert(entry);
const beforeRenderer = await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  afterRenderer = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(beforeRenderer, '7bb81fb0e88196808650a809057bf19df0935ce9ac1eab6164b7c9c139aee7ef');
const prior = JSON.parse(await readFile(path.join(priorNative, 'proof.json'))).rows.find(
  (r) => r.id === entry.id,
);
const definitions = [];
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false, fs: { allow: [root, referenceRoot] } },
});
try {
  for (const [version, base] of [
    ['before', '/@fs' + referenceRoot],
    ['after', ''],
  ]) {
    await server.ssrLoadModule(base + '/games/magic/src/data/eager.ts');
    await server.ssrLoadModule(base + '/games/magic/src/data/eager-wording.ts');
    const api = await server.ssrLoadModule(base + '/games/magic/src/index.ts');
    const assets = await server.ssrLoadModule(
      base + '/games/magic/src/presentation/canvas-assets.ts',
    );
    const artist = api.resolvePrintingArtist(entry.id, entry.face.artist, {
      referenceSha256: entry.reference.sha256,
    });
    assert.equal(artist.artist, version === 'before' ? 'Jesper Myrfors' : 'Mark Poole');
    const wrong = api.resolvePrintingArtist(entry.id, entry.face.artist, {
      referenceSha256: '0'.repeat(64),
    });
    if (version === 'after') {
      assert.equal(wrong.provenance.status, 'reference-mismatch');
      assert.equal(wrong.artist, entry.face.artist);
    }
    for (const [mode, symbolStyle] of [
      ['original', 'original'],
      ['oracle', 'modern'],
      ['oracle', 'original'],
    ]) {
      const face =
        mode === 'original'
          ? { ...entry.face, artist: artist.artist }
          : api.withCardWording(
              { ...entry.face, artist: artist.artist },
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
      definitions.push({ version, mode, symbolStyle, face, provenance: artist.provenance });
      for (const url of assets.canvasAssetUrls(face))
        if (url?.startsWith('https:') && !snapshot.components.some((a) => a.url === url))
          snapshot.components.push(await cachedFetch(url, { offline: true }));
    }
  }
} finally {
  await server.close();
}
await mkdir(out, { recursive: true });
await writeJson(path.join(out, 'inputs.json'), {
  entry,
  definitions,
  components: snapshot.components,
});
const session = await openBrowser(
  { ...snapshot, entries: [entry] },
  {
    plugins: [
      {
        name: 'artist-reference',
        config() {
          return { server: { fs: { allow: [root, referenceRoot] } } };
        },
      },
    ],
  },
);
const rows = [];
try {
  for (const d of definitions) {
    const result = await session.page.evaluate(
      async ({ d, entry, referenceRoot }) => {
        const base = d.version === 'before' ? '/@fs' + referenceRoot : '';
        await import(/* @vite-ignore */ base + '/games/magic/src/data/eager.ts');
        await import(/* @vite-ignore */ base + '/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture, cardTextureKey } = await import(
          /* @vite-ignore */ base + '/games/magic/src/presentation/canvas-face.ts'
        );
        const { canvasAssetUrls } = await import(
          /* @vite-ignore */ base + '/games/magic/src/presentation/canvas-assets.ts'
        );
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(d.face), signal, d.face.illustration);
        try {
          const outputs = [];
          for (const layer of ['face', 'etching']) {
            const input = { face: d.face, printingId: entry.id, printedImage: null, layer };
            const c = await composeCardTexture(input, 'inspect', signal, {
              loadImages: async () => ({ ...lease, dispose() {} }),
            });
            try {
              outputs.push({
                layer,
                key: cardTextureKey(input, 'inspect'),
                png: c.toDataURL().split(',')[1],
              });
            } finally {
              c.width = c.height = 0;
            }
          }
          return outputs;
        } finally {
          lease.dispose();
        }
      },
      { d, entry, referenceRoot },
    );
    for (const r of result) {
      const bytes = Buffer.from(r.png, 'base64'),
        file = [d.version, d.mode, d.symbolStyle, r.layer].join('-') + '.png';
      await writeFile(path.join(out, file), bytes);
      rows.push({
        version: d.version,
        mode: d.mode,
        symbolStyle: d.symbolStyle,
        layer: r.layer,
        file,
        sha256: hash(bytes),
        key: r.key,
      });
    }
  }
  const comparisons = [];
  for (const mode of ['original', 'oracle-modern', 'oracle-original']) {
    const [wording, symbol] = mode === 'original' ? ['original', 'original'] : mode.split('-');
    for (const layer of ['face', 'etching']) {
      const a = rows.find(
          (r) =>
            r.version === 'before' &&
            r.mode === wording &&
            r.symbolStyle === symbol &&
            r.layer === layer,
        ),
        b = rows.find(
          (r) =>
            r.version === 'after' &&
            r.mode === wording &&
            r.symbolStyle === symbol &&
            r.layer === layer,
        );
      const x = PNG.sync.read(await readFile(path.join(out, a.file))),
        y = PNG.sync.read(await readFile(path.join(out, b.file)));
      let changed = 0,
        outside = 0,
        alpha = 0;
      for (let row = 0; row < x.height; row++)
        for (let col = 0; col < x.width; col++) {
          const p = (row * x.width + col) * 4;
          if (x.data[p + 3] !== y.data[p + 3]) alpha++;
          if ([0, 1, 2, 3].some((k) => x.data[p + k] !== y.data[p + k])) {
            changed++;
            if (col / 1.5 < 25 || col / 1.5 > 455 || row / 1.5 < 605 || row / 1.5 > 650) outside++;
          }
        }
      assert.equal(outside, 0);
      assert.equal(alpha, 0);
      if (layer === 'face') assert(changed > 0);
      comparisons.push({
        mode,
        layer,
        before: a.sha256,
        after: b.sha256,
        changed,
        outside,
        alpha,
        keyChanged: a.key !== b.key,
      });
    }
  }
  assert.equal(
    rows.find((r) => r.version === 'before' && r.mode === 'original' && r.layer === 'face').sha256,
    prior.afterFaceHash,
  );
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(referenceRoot, 'games/magic/src')), beforeRenderer);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), afterRenderer);
  assert.equal(hash(await readFile(new URL(import.meta.url))), tool);
  await writeJson(path.join(out, 'proof.json'), {
    schema: 1,
    id: entry.id,
    set: entry.set,
    name: entry.name,
    referenceHash: entry.reference.sha256,
    poseHash: hash(JSON.stringify(entry.pose)),
    beforeRenderer,
    afterRenderer,
    tool,
    browser: session.browser.version(),
    sourceInputHash: hash(await readFile(inputFile)),
    definitions: definitions.map(({ version, mode, symbolStyle, face, provenance }) => ({
      version,
      mode,
      symbolStyle,
      artist: face.artist,
      faceHash: hash(JSON.stringify(face)),
      provenance,
    })),
    comparisons,
    rows,
    faults: session.faults,
    scope:
      'One physical artist correction, applied independently of wording/symbol choice. Exact prior Original face match; every changed native pixel stays in the artist strip. No scan, geometry, font or other printing changes.',
  });
  console.log(
    JSON.stringify(
      comparisons.map(({ mode, layer, changed, outside }) => ({ mode, layer, changed, outside })),
    ),
  );
} finally {
  await session.close();
}
