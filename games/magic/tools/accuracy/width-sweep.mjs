import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
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
import { typographyMetrics } from './typography-metrics.mjs';
const set = process.argv[2] ?? 'mir';
const extras = (process.argv[3] ?? '0,10,12').split(',').map(Number);
if (
  !['mir', 'tmp'].includes(set) ||
  extras.some((v) => ![0, 10, 12].includes(v)) ||
  extras[0] !== 0
)
  throw Error('Use mir/tmp and a width list starting with 0 (0,10,12)');
const out = `${outputRoot}/${set}/width-study`;
const capture = await readJson(`${outputRoot}/${set}/retro-basics/metrics.json`);
const targets = await readJson(`${fixtureRoot}/${set}/typography-retro-type.json`);
const cards = capture.results.filter((c) => targets.cards[c.id] && !/^Basic/.test(c.face.typeLine));
const session = await openBrowser(await readJson(`${cacheRoot}/sets/${set}.json`));
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
            { x, y: y + 4, width: w + extra, height: h - 8 },
            22.5,
            15,
            RETRO_TYPOGRAPHY,
          );
          paintRulesLayout(c, layout, loaded.images, paintHistoricMana);
          values.push({ extra, layout, data: canvas.toDataURL('image/png') });
          canvas.width = canvas.height = 0;
        }
        blank.width = blank.height = 0;
        loaded.dispose();
        return values;
      },
      { face: card.face, extras },
    );
    const beforeBytes = await readFile(
      `${outputRoot}/${set}/retro-basics/${card.images.inspect.file}`,
    );
    assert.equal(hash(beforeBytes), card.images.inspect.sha256);
    const production = PNG.sync.read(beforeBytes);
    const reference = normalize(
      await readPng(`${outputRoot}/${set}/retro-basics/${card.images.reference.file}`),
      card.alignment.transform,
    );
    await savePng(`${out}/${card.collectorNumber}.scan.png`, reference);
    const scores = [];
    for (const v of variants) {
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
      const typography = typographyMetrics(
        targets.cards[card.id],
        { ...card, layout: v.layout },
        image,
      );
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
      inputHash: card.inputHash,
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
  exact: results.filter((c) => c.scores.find((s) => s.extra === extra).typography.exactWrapping)
    .length,
  meanWrap:
    results.reduce(
      (s, c) => s + c.scores.find((v) => v.extra === extra).typography.softBreakF1,
      0,
    ) / results.length,
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
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  baselineRendererHash: capture.rendererHash,
  alignmentHash: capture.alignmentHash,
  scope:
    'Already inspected cards; development/transfer diagnostics, not fresh holdouts. Fixed shared alignment, width-only change. Control matches production pixels. First F1 is historical body ROI; second includes the expanded right edge.',
  extras,
  summary,
  results,
});
console.log(JSON.stringify(summary, null, 2));
