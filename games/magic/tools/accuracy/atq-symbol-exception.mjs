import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  readJson,
  writeJson,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  root,
  hash,
  sourceHash,
  atomicWrite,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { presentation } from './adapter.mjs';
import { fetchComponents } from './components.mjs';
const stage = process.argv[2];
assert.ok(['before', 'after'].includes(stage));
const snapshot = await readJson(`${cacheRoot}/rollout/atq-symbol.json`),
  entry = snapshot.entries.find((e) => e.card.name === 'Reconstruction'),
  base = `${outputRoot}/atq-symbol/printing-exception-${stage}`,
  rendererHash = await sourceHash(`${root}/games/magic/src`),
  session = await openBrowser({
    ...snapshot,
    components: [
      ...snapshot.components,
      ...(await fetchComponents([{ ...entry, card: { ...entry.card, frame: '2015' } }], {
        offline: true,
      })),
    ],
  }),
  rows = [];
try {
  for (const [key, override] of [
    ['original-symbols', {}],
    ['modern-symbols', { symbolStyle: 'modern' }],
    [
      'explicit-symbol',
      {
        setSymbol:
          'https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg/atq.svg',
      },
    ],
    ['modern-frame', { frameStyle: 'modern' }],
  ]) {
    const face = {
        ...presentation(entry).face,
        wordingMode: 'oracle',
        symbolStyle: 'original',
        ...override,
      },
      result = await session.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const images = [];
        for (const tier of ['inspect', 'table']) {
          const c = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
          );
          images.push({ tier, data: c.toDataURL() });
          c.width = c.height = 0;
        }
        return images;
      }, face),
      images = {};
    for (const image of result) {
      const bytes = Buffer.from(image.data.split(',')[1], 'base64'),
        file = `${key}.${image.tier}.png`;
      await atomicWrite(`${base}/${file}`, bytes);
      images[image.tier] = { file, sha256: hash(bytes) };
    }
    rows.push({ key, face, inputHash: hash(JSON.stringify(face)), images });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
  const capture = {
    rendererHash,
    methodHash: hash(await readFile(new URL(import.meta.url))),
    referenceHash: entry.reference.sha256,
    rows,
  };
  await writeJson(`${base}/capture.json`, capture);
  if (stage === 'after') {
    const before = await readJson(
      `${outputRoot}/atq-symbol/printing-exception-before/capture.json`,
    );
    for (const a of rows) {
      const b = before.rows.find((r) => r.key === a.key);
      assert.equal(a.inputHash, b.inputHash);
      for (const tier of ['inspect', 'table']) {
        if (['explicit-symbol', 'modern-frame'].includes(a.key))
          assert.equal(a.images[tier].sha256, b.images[tier].sha256);
        else assert.notEqual(a.images[tier].sha256, b.images[tier].sha256);
      }
    }
    await writeJson(`${fixtureRoot}/atq-symbol-printing-exception.json`, {
      schemaVersion: 1,
      scope:
        'Reconstruction Antiquities reference visibly lacks the expansion symbol. Remove it for either mana/tap symbol style on the original frame, retaining explicit custom symbols and modern-frame behavior. Same Oracle input. Main full-set audit verifies all changed pixels stay in the symbol area.',
      referenceHash: entry.reference.sha256,
      source: 'https://scryfall.com/card/atq/12/reconstruction',
      before,
      after: capture,
    });
  }
} finally {
  await session.close();
}
