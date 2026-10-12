import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import {
  readJson,
  writeJson,
  atomicWrite,
  hash,
  sourceHash,
  root,
  cacheRoot,
  outputRoot,
  fixtureRoot,
} from './common.mjs';
import { readPng, normalize, cropGray, savePng } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
const sourceRoot = await realpath(process.argv[2] ?? root);
const set = '4ed';
const extras = '0,1,2'.split(',').map(Number);
const out = `${outputRoot}/${set}/text-insets-study`;
const capture = await readJson(`${outputRoot}/${set}/stats-wide/metrics.json`);
const ann = await readJson(`${fixtureRoot}/${set}/annotations-text-insets.json`);
const snapshot = await readJson(`${cacheRoot}/sets/4ed.json`);
const { presentation } = await import('./adapter.mjs');
const cards = capture.results
  .filter((c) => ann.cards[c.id]?.reviewed && c.frame === 'retro-fourth')
  .map((c) => ({
    ...c,
    face: presentation(
      snapshot.entries.find((e) => e.id === c.id),
      ann.cards,
    ).face,
  }));
const session = await openBrowser(await readJson(`${cacheRoot}/sets/${set}.json`), { sourceRoot });
const results = [];
try {
  for (const card of cards) {
    const variants = await session.page.evaluate(
      async ({ face, extras }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { RETRO_TYPOGRAPHY } = await import('/games/magic/src/presentation/retro-rules.ts');
        const { retroRects, retroPx, retroAssets } = await import(
          '/games/magic/src/presentation/retro-frame.ts'
        );
        const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { paintHistoricMana } = await import(
          '/games/magic/src/presentation/retro-details.ts'
        );
        const production = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        const productionData = production.toDataURL('image/png');
        production.width = production.height = 0;
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
        const [x, y, w, h] = retroPx(retroRects(face).rules);
        const values = [];
        for (const extra of extras) {
          const canvas = document.createElement('canvas');
          canvas.width = blank.width;
          canvas.height = blank.height;
          const c = canvas.getContext('2d');
          c.imageSmoothingQuality = 'high';
          c.drawImage(blank, 0, 0);
          c.scale(canvas.width / 488, canvas.height / 680);
          const layout = layoutRules(
            c,
            face.rulesParagraphs,
            {
              x: extra ? 72 : x,
              y: y + (extra === 2 ? 0 : 4),
              width: extra ? 344 : w,
              height: h - 8,
            },
            22.5,
            15,
            extra === 2 ? { ...RETRO_TYPOGRAPHY, paragraphGap: 0, flavorGap: 0 } : RETRO_TYPOGRAPHY,
          );
          paintRulesLayout(c, layout, loaded.images, paintHistoricMana);
          values.push({ extra, layout, data: canvas.toDataURL('image/png') });
          canvas.width = canvas.height = 0;
        }
        blank.width = blank.height = 0;
        loaded.dispose();
        return { values, productionData };
      },
      { face: card.face, extras },
    );
    const beforeBytes = Buffer.from(variants.productionData.split(',')[1], 'base64');
    const production = PNG.sync.read(beforeBytes);
    const reference = normalize(
      await readPng(`${outputRoot}/${set}/stats-wide/${card.images.reference.file}`),
      card.alignment.transform,
    );
    await savePng(`${out}/${card.collectorNumber}.scan.png`, reference);
    const scores = [];
    for (const v of variants.values) {
      const bytes = Buffer.from(v.data.split(',')[1], 'base64');
      const png = PNG.sync.read(bytes);
      if (v.extra === 0)
        assert.ok(png.data.equals(production.data), `Control mismatch ${card.name}`);
      const image = normalize(png);
      const rects = [
        [62, 417, 366, 180],
        [59, 414, 379, 186],
      ];
      const edgeF1 = rects.map((rect) => {
        const a = cropGray(reference, rect),
          b = cropGray(image, rect);
        return compareRegion(a.gray, b.gray, a.width, a.height).edgeF1[1];
      });
      const typography = {};
      const file = `${card.collectorNumber}.${v.extra}.png`;
      await atomicWrite(`${out}/${file}`, bytes);
      scores.push({
        extra: v.extra,
        edgeF1,
        typography,
        layout: v.layout,
        file,
        sha256: hash(bytes),
      });
    }
    results.push({
      id: card.id,
      name: card.name,
      number: card.collectorNumber,
      alignmentUncertain: card.alignment.uncertain,
      inputHash: hash(JSON.stringify(card.face)),
      referenceHash: card.images.reference.sha256,
      scores,
    });
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const summary = extras.map((extra) => ({
  extra,
  medianF1: [0, 1].map((i) =>
    median(results.map((c) => c.scores.find((s) => s.extra === extra).edgeF1[i])),
  ),
  gains: results
    .filter((c) => c.scores.find((s) => s.extra === extra).edgeF1[1] > c.scores[0].edgeF1[1] + 0.02)
    .map((c) => c.name),
  regressions: results
    .filter((c) => c.scores.find((s) => s.extra === extra).edgeF1[1] < c.scores[0].edgeF1[1] - 0.02)
    .map((c) => c.name),
}));
await writeJson(`${out}/sweep.json`, {
  set,
  rendererHash: await sourceHash(path.join(sourceRoot, 'games/magic/src')),
  baselineRendererHash: capture.rendererHash,
  alignmentHash: capture.alignmentHash,
  scope:
    'Eight previously viewed Fourth Edition development examples. Same printed wording for every variant. Fixed shared alignment. Variant 0 is previous layout, 1 is x72/width344, 2 additionally removes paragraph/flavor gaps and moves the box top up 4px. Reproduce against pre-change source root (2b738ef); controls must match its production pixels. First F1 is historical body ROI; second includes the wider inspection window.',
  extras,
  summary,
  results,
});
console.log(JSON.stringify(summary, null, 2));
