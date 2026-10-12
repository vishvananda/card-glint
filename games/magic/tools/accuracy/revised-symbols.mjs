import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import {
  root,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  readJson,
  writeJson,
  hash,
  sourceHash,
  atomicWrite,
} from './common.mjs';

const phase = process.argv[2] ?? 'development';
if (!['development', 'validation'].includes(phase)) throw Error('Invalid phase');
const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'inline-symbols-plan.json'));
const directory = path.join(outputRoot, '3ed', plan.sourceRun);
const captureBytes = await readFile(path.join(directory, 'capture.json'));
assert.equal(hash(captureBytes), plan.captureHash);
const capture = JSON.parse(captureBytes);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, plan.baselineRendererHash, 'Run before changing production');
const experimentHash = hash(await readFile(new URL(import.meta.url)));
const frozen =
  phase === 'validation'
    ? await readJson(path.join(fixture, 'inline-symbols-candidate.json'))
    : null;
if (frozen) assert.equal(experimentHash, frozen.experimentHash);
const candidates = [
  { id: 'control' },
  ...(frozen
    ? [frozen.candidate]
    : plan.developmentGrid.glyphScale.flatMap((scale) =>
        plan.developmentGrid.dy.map((dy) => ({ id: `scale${scale}-dy${dy}`, scale, dy })),
      )),
];
const out = path.join(outputRoot, '3ed', `inline-symbols-${phase}`);
const selected = phase === 'development' ? plan.development : plan.reserved;
const tiers = ['inspect', 'table'];
const snapshot = await readJson(path.join(cacheRoot, 'sets/3ed.json'));
const session = await openBrowser(snapshot);
const results = [];
try {
  for (const selection of selected) {
    const card = capture.results.find((c) => c.id === selection.id);
    assert.equal(hash(JSON.stringify(selection.face)), card.inputHash);
    const scanBytes = await readFile(path.join(directory, card.images.reference.file));
    assert.equal(hash(scanBytes), card.images.reference.sha256);
    const reference = normalize(await readPng(path.join(directory, card.images.reference.file)));
    const windows = [
      { id: 'body', rect: [62, 417, 366, 184] },
      ...(selection.tapWindows ?? []).map((rect, i) => ({ id: `tap-${i}`, rect })),
    ];
    const scores = [];
    for (const tier of tiers) {
      const images = await session.page.evaluate(
        async ({ face, tier, candidates }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
          const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
          const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
          const { retroAssets } = await import('/games/magic/src/presentation/retro-frame.ts');
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const blank = await composeCardTexture(
            {
              face: { ...face, rulesText: '', rulesParagraphs: [] },
              printingId: null,
              printedImage: null,
            },
            tier,
            new AbortController().signal,
          );
          const loaded = await loadCanvasImages(retroAssets(face), new AbortController().signal);
          const scale = tier === 'inspect' ? 1.5 : 0.5;
          const output = [];
          for (const candidate of candidates) {
            const canvas = document.createElement('canvas');
            canvas.width = blank.width;
            canvas.height = blank.height;
            const c = canvas.getContext('2d');
            c.imageSmoothingQuality = 'high';
            c.drawImage(blank, 0, 0);
            c.scale(scale, scale);
            const paint = (c, symbol, x, y, size, images) => {
              if (symbol !== 'T' || candidate.id === 'control')
                return paintMana(c, symbol, x, y, size, images);
              c.save();
              c.shadowColor = 'transparent';
              c.shadowOffsetX = c.shadowOffsetY = 0;
              c.fillStyle = '#c9c4be';
              c.beginPath();
              c.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
              c.fill();
              c.fillStyle = '#0d0f0f';
              c.font = `${size * candidate.scale}px "CardRenderer MTG Historic Symbols"`;
              c.textAlign = 'left';
              c.textBaseline = 'alphabetic';
              const glyph = '\ue61c';
              const m = c.measureText(glyph);
              c.fillText(
                glyph,
                x + (size + m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
                y +
                  (size + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 +
                  candidate.dy,
              );
              c.restore();
            };
            const layout = retroTextLayout(c, face);
            paintRulesLayout(c, layout, loaded.images, paint);
            output.push({ candidate: candidate.id, data: canvas.toDataURL('image/png') });
            canvas.width = canvas.height = 0;
          }
          blank.width = blank.height = 0;
          loaded.dispose();
          return output;
        },
        { face: selection.face, tier, candidates },
      );
      for (const item of images) {
        const bytes = Buffer.from(item.data.split(',')[1], 'base64');
        if (item.candidate === 'control')
          assert.equal(hash(bytes), card.images[tier].sha256, `Control mismatch: ${card.name}`);
        const file = `${card.collectorNumber}.${tier}.${item.candidate}.png`;
        await atomicWrite(path.join(out, file), bytes);
        const rendered = normalize(await readPng(path.join(out, file)));
        const regions = windows.map(({ id, rect }) => {
          const a = cropGray(reference, rect),
            b = cropGray(rendered, rect);
          const m = compareRegion(a.gray, b.gray, a.width, a.height);
          return {
            id,
            rect,
            edgeF1: m.edgeF1[1],
            meanDistance: m.meanDistance,
            censusSimilarity: m.censusSimilarity,
          };
        });
        scores.push({ candidate: item.candidate, tier, file, sha256: hash(bytes), regions });
      }
    }
    results.push({
      id: card.id,
      name: card.name,
      number: card.collectorNumber,
      inputHash: card.inputHash,
      referenceHash: card.images.reference.sha256,
      scores,
    });
    console.log(`Measured ${card.name}`);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const summary = candidates.flatMap((candidate) =>
  tiers.map((tier) => {
    const values = results.flatMap((r) =>
      r.scores
        .find((s) => s.candidate === candidate.id && s.tier === tier)
        .regions.filter((r) => r.id.startsWith('tap-')),
    );
    return {
      ...candidate,
      tier,
      count: values.length,
      medianF1: median(values.map((v) => v.edgeF1)),
      medianDistance: median(values.map((v) => v.meanDistance)),
    };
  }),
);
await writeJson(path.join(out, 'trial.json'), {
  schemaVersion: 1,
  phase,
  rendererHash,
  experimentHash,
  captureHash: plan.captureHash,
  candidates,
  summary,
  results,
});
console.log(JSON.stringify(summary, null, 2));
