import assert from 'node:assert/strict';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readPrintingText } from './printing-text.mjs';
import { presentation } from './adapter.mjs';
import { compareRegion } from './metrics.mjs';
import { normalize, cropGray } from './pixels.mjs';
import {
  readJson,
  writeJson,
  atomicWrite,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  hash,
  objectFile,
  sourceHash,
  root,
} from './common.mjs';
import { readFile } from 'node:fs/promises';

const snapshot = await readJson(path.join(cacheRoot, 'sets/lea.json'));
const annotations = (await readJson(path.join(fixtureRoot, 'lea/annotations.json'))).cards;
const printing = await readPrintingText(snapshot);
const names = [
  'Benalish Hero',
  'Northern Paladin',
  'Serra Angel',
  'Lightning Bolt',
  'Dark Ritual',
  'Giant Growth',
  'Howling Mine',
  'Terror',
];
const entries = snapshot.entries.filter((e) => names.includes(e.card.name));
assert.equal(entries.length, names.length);
const out = path.join(outputRoot, 'lea/ink-inset-trial');
const candidates = [0, 0.008, 0.012, 0.016];
const browser = await openBrowser(snapshot);
const results = [];
try {
  for (const entry of entries) {
    const original = presentation(entry, annotations, printing.cards).face;
    const oracle = presentation(entry).face;
    oracle.rulesParagraphs = [
      ...oracle.rulesParagraphs.filter((p) => p.role !== 'flavor'),
      ...original.rulesParagraphs.filter((p) => p.role === 'flavor'),
    ];
    const targetBytes = await readFile(objectFile(entry.reference));
    assert.equal(hash(targetBytes), entry.reference.sha256);
    const target = cropGray(normalize(PNG.sync.read(targetBytes)), [54, 409, 380, 194]);
    const captures = await browser.page.evaluate(
      async ({ original, oracle, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { originalRulesSymbols } = await import(
          '/games/magic/src/presentation/retro-details.ts'
        );
        const { withCardWording } = await import('/games/magic/src/presentation/wording.ts');
        const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { retroAssets } = await import('/games/magic/src/presentation/retro-frame.ts');
        const captures = [];
        for (const mode of ['original', 'oracle']) {
          const face = withCardWording(original, { original, oracle }, mode, {
            symbolStyle: 'original',
          });
          const blank = await composeCardTexture(
            {
              face: { ...face, rulesText: '', rulesParagraphs: [] },
              printingId: null,
              printedImage: null,
            },
            'inspect',
            new AbortController().signal,
          );
          const loaded = await loadCanvasImages(retroAssets(face), new AbortController().signal);
          const ctx = blank.getContext('2d');
          const layout = retroTextLayout(ctx, face);
          for (const inset of candidates) {
            const canvas = document.createElement('canvas');
            canvas.width = blank.width;
            canvas.height = blank.height;
            const c = canvas.getContext('2d');
            c.drawImage(blank, 0, 0);
            c.scale(1.5, 1.5);
            paintRulesLayout(c, layout, loaded.images, originalRulesSymbols(face.setCode), inset);
            captures.push({ mode, inset, layout, data: canvas.toDataURL('image/png') });
            canvas.width = canvas.height = 0;
          }
          loaded.dispose();
          blank.width = blank.height = 0;
        }
        return captures;
      },
      { original, oracle, candidates },
    );
    const rows = [];
    for (const { data, ...capture } of captures) {
      const bytes = Buffer.from(data.split(',')[1], 'base64');
      const file = `${entry.card.collector_number}.${capture.mode}.${capture.inset}.png`;
      await atomicWrite(path.join(out, file), bytes);
      const p = cropGray(normalize(PNG.sync.read(bytes)), [54, 409, 380, 194]);
      const score =
        capture.mode === 'original' ? compareRegion(target.gray, p.gray, p.width, p.height) : null;
      rows.push({
        ...capture,
        file,
        sha256: hash(bytes),
        edgeF1: score?.edgeF1?.[1] ?? null,
        exactEdgeF1: score?.edgeF1?.[0] ?? null,
        census: score?.censusSimilarity ?? null,
      });
    }
    results.push({
      id: entry.id,
      name: entry.card.name,
      number: entry.card.collector_number,
      referenceHash: entry.reference.sha256,
      rows,
    });
    console.log(entry.card.name);
  }
  assert.deepEqual(browser.faults, []);
} finally {
  await browser.close();
}
await writeJson(path.join(out, 'trial.json'), {
  schemaVersion: 1,
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  candidates,
  scope:
    'Alpha development-only optical weight trial after enforcing shared 428..590 ink limits. Oracle rows are fit diagnostics, never compared with original wording.',
  results,
});
