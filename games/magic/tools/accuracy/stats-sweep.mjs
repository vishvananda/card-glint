import assert from 'node:assert/strict';
import path from 'node:path';
import { PNG } from 'pngjs';
import {
  readJson,
  writeJson,
  outputRoot,
  cacheRoot,
  fixtureRoot,
  atomicWrite,
  sourceHash,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';

// Development experiment only. The centered control must reproduce production pixels.
const baseDir = path.join(outputRoot, '4ed/fourth-details-all');
const trialDir = path.join(outputRoot, '4ed/stats-placement');
const out = path.join(outputRoot, '4ed/stats-anchor-development');
const before = await readJson(path.join(baseDir, 'metrics.json'));
const trial = await readJson(path.join(trialDir, 'capture.json'));
const cohort = await readJson(path.join(fixtureRoot, '4ed/cohorts-fourth-stats.json'));
const selected = before.results.filter((c) =>
  [...cohort.calibration, '3', '80', '345'].includes(c.collectorNumber),
);
const candidates = [
  { id: 'center-control', right: null },
  ...[449.5, 450, 450.5, 451, 451.5].map((right) => ({ id: `right-${right}`, right })),
];
const session = await openBrowser(await readJson(path.join(cacheRoot, 'sets/4ed.json')));
const results = [];
try {
  for (const card of selected) {
    const output = await session.page.evaluate(
      async ({ face, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { retroRects, retroPx, retroInk } = await import(
          '/games/magic/src/presentation/retro-frame.ts'
        );
        const blank = await composeCardTexture(
          { face: { ...face, power: null, toughness: null }, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        const [x, y, w, h] = retroPx(retroRects(face).stats),
          scale = blank.width / 488;
        const rows = [];
        for (const candidate of candidates) {
          const canvas = document.createElement('canvas');
          canvas.width = blank.width;
          canvas.height = blank.height;
          const c = canvas.getContext('2d');
          c.drawImage(blank, 0, 0);
          c.scale(scale, scale);
          c.font = '27.8px "CardRenderer MTG MPlantin", Georgia';
          c.textBaseline = 'middle';
          c.fillStyle = retroInk(face);
          c.shadowColor = '#000b';
          c.shadowOffsetX = c.shadowOffsetY = scale;
          let toughness = face.toughness;
          if (candidate.right != null && /^\d+-\*$/.test(toughness)) toughness = `(${toughness})`;
          c.textAlign = candidate.right == null ? 'center' : 'right';
          c.fillText(
            `${face.power}/${toughness}`,
            candidate.right ?? x + w / 2 + 4,
            y + h / 2 + 3,
            candidate.right == null ? w : 130,
          );
          const crop = document.createElement('canvas');
          crop.width = 231;
          crop.height = 78;
          crop.getContext('2d').drawImage(canvas, 480, 894, 231, 78, 0, 0, 231, 78);
          rows.push({ id: candidate.id, data: crop.toDataURL('image/png') });
          canvas.width = canvas.height = 0;
          crop.width = crop.height = 0;
        }
        blank.width = blank.height = 0;
        return rows;
      },
      { face: card.face, candidates },
    );
    const production = await readPng(
      path.join(trialDir, trial.results.find((c) => c.id === card.id).images.inspect.file),
    );
    const reference = normalize(
      await readPng(path.join(baseDir, card.images.reference.file)),
      card.alignment.transform,
    );
    const wide = `${card.face.power}/${card.face.toughness}`.length > 3;
    const rect = wide ? [326, 607, 134, 33] : [393, 607, 67, 33];
    const target = cropGray(reference, rect),
      scores = [];
    for (const candidate of output) {
      const bytes = Buffer.from(candidate.data.split(',')[1], 'base64'),
        crop = PNG.sync.read(bytes);
      if (candidate.id === 'center-control')
        for (let y = 0; y < 78; y++)
          assert.ok(
            production.data
              .subarray(((894 + y) * 732 + 480) * 4, ((894 + y) * 732 + 711) * 4)
              .equals(crop.data.subarray(y * 231 * 4, (y + 1) * 231 * 4)),
            `Control does not match production: ${card.name}`,
          );
      const image = { width: 732, height: 1020, data: new Uint8Array(732 * 1020 * 4) };
      for (let y = 0; y < 78; y++)
        image.data.set(
          crop.data.subarray(y * 231 * 4, (y + 1) * 231 * 4),
          ((894 + y) * 732 + 480) * 4,
        );
      const c = cropGray(normalize(image), rect),
        score = compareRegion(target.gray, c.gray, c.width, c.height, true).edgeF1[1];
      const file = `${card.collectorNumber}.${candidate.id}.png`;
      await atomicWrite(path.join(out, file), bytes);
      scores.push({ id: candidate.id, edgeF1: score, file });
    }
    results.push({
      id: card.id,
      name: card.name,
      collectorNumber: card.collectorNumber,
      wide,
      rect,
      scores,
    });
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
} finally {
  await session.close();
}
const summary = candidates.map((c) => ({
  id: c.id,
  median: median(results.map((r) => r.scores.find((s) => s.id === c.id).edgeF1)),
  wideMedian: median(
    results.filter((r) => r.wide).map((r) => r.scores.find((s) => s.id === c.id).edgeF1),
  ),
  regressions: results
    .filter((r) => r.scores.find((s) => s.id === c.id).edgeF1 < r.scores[0].edgeF1 - 0.02)
    .map((r) => r.name),
}));
await writeJson(path.join(out, 'sweep.json'), {
  schemaVersion: 1,
  rendererHash: await sourceHash('games/magic/src'),
  baselineRendererHash: before.rendererHash,
  alignmentHash: before.alignmentHash,
  referenceIdentity: before.referenceIdentity,
  scope:
    '18 Fourth Edition development cards, including all three wide expressions. Right anchor and full expression width; parenthesized subtractive toughness for Fourth Edition. Center control matches production crop bytes. This is not fresh holdout evidence.',
  candidates,
  summary,
  results,
});
console.log(JSON.stringify(summary, null, 2));
