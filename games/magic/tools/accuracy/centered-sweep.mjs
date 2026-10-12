import assert from 'node:assert/strict';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readPrintingText } from './printing-text.mjs';
import { presentation } from './adapter.mjs';
import { lineText, wrapping } from './typography-metrics.mjs';
import {
  readJson,
  writeJson,
  atomicWrite,
  hash,
  sourceHash,
  root,
  cacheRoot,
  fixtureRoot,
  outputRoot,
} from './common.mjs';
import { readPng, normalize, cropGray, savePng } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';

const plan = await readJson(path.join(fixtureRoot, 'centered-text-plan.json'));
const set = process.argv[2] ?? '4ed';
const mode = process.argv[3] ?? 'development';
const widthTrial = mode.startsWith('width-');
const transfer = mode.endsWith('transfer');
if (!['development', 'transfer', 'width-development', 'width-transfer'].includes(mode))
  throw Error('Unknown centered trial mode');
if (!['4ed', '3ed', '5ed'].includes(set) || (!transfer && set !== '4ed'))
  throw Error('Use 4ed development or 4ed/3ed/5ed transfer');
if (widthTrial && set !== '4ed') throw Error('The width trial is reserved for Fourth Edition');
const widthPlan = widthTrial
  ? await readJson(path.join(fixtureRoot, '4ed/centered-width-plan.json'))
  : null;
const targets = (await readJson(path.join(fixtureRoot, '4ed/centered-text-targets.json'))).cards;
if (widthTrial && !transfer)
  for (const card of (
    await readJson(path.join(fixtureRoot, 'centered-transfer-review.json'))
  ).reports.find((r) => r.set === '4ed').results)
    targets[card.id] = { lines: card.scanLines };
const base = path.join(
  outputRoot,
  set,
  set === '4ed' ? 'text-insets' : set === '3ed' ? 'stats-wide-before' : 'stats-wide',
);
const out = path.join(
  outputRoot,
  set,
  widthTrial ? `centered-${mode}` : transfer ? 'centered-transfer' : 'centered-study',
);
const capture = await readJson(path.join(base, 'metrics.json'));
const snapshot = await readJson(path.join(cacheRoot, 'sets', `${set}.json`));
const original = await readPrintingText(snapshot);
const selected = widthPlan
  ? transfer
    ? widthPlan.heldOut
    : widthPlan.development
  : transfer
    ? plan.reserved[set].cards
    : plan.development;
const cards = selected.map((t) => {
  const card = capture.results.find((c) => c.id === t.id);
  const value =
    transfer || widthTrial
      ? {
          ...card,
          face: presentation(
            snapshot.entries.find((e) => e.id === t.id),
            {},
            original.cards,
          ).face,
        }
      : card;
  if (widthTrial && t.name === 'Deathgrip') {
    // Scan-reviewed punctuation correction, recorded before the new width trial.
    value.face.rulesText = '{B}{B}: Counter target green spell. Play this ability as an interrupt.';
    value.face.rulesParagraphs = [{ role: 'rules', runs: [{ text: value.face.rulesText }] }];
  }
  return value;
});
const frozen = widthPlan?.frozenCandidate ?? plan.frozenCandidate;
const candidates =
  transfer || widthTrial
    ? [
        { id: 'control' },
        {
          id: frozen.id,
          size: frozen.size,
          width: frozen.width,
          y: frozen.y,
        },
      ]
    : [
        { id: 'control' },
        ...[24, 24.5, 25, 25.5, 26, 26.5, 27].flatMap((size) =>
          [400.556, 402.556, 404.556, 406.556, 408.556, 410.556, 412.556].map((y) => ({
            id: `s${size}-y${y}`,
            size,
            width: 320,
            y,
          })),
        ),
      ];
const session = await openBrowser(snapshot);
const results = [];
try {
  for (const card of cards) {
    const values = await session.page.evaluate(
      async ({ face, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { centeredTrial } = await import(
          '/games/magic/tools/accuracy/centered-trial-layout.mjs'
        );
        const { retroAssets } = await import('/games/magic/src/presentation/retro-frame.ts');
        const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
        const { paintHistoricMana, retroPrintDetails } = await import(
          '/games/magic/src/presentation/retro-details.ts'
        );
        const productionCanvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        const productionData = productionCanvas.toDataURL('image/png');
        productionCanvas.width = productionCanvas.height = 0;
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
        const values = [];
        for (const candidate of candidates) {
          const canvas = document.createElement('canvas');
          canvas.width = blank.width;
          canvas.height = blank.height;
          const c = canvas.getContext('2d');
          c.imageSmoothingQuality = 'high';
          c.drawImage(blank, 0, 0);
          c.scale(1.5, 1.5);
          const layout =
            candidate.id === 'control'
              ? retroTextLayout(c, face)
              : centeredTrial(c, face, candidate);
          paintRulesLayout(
            c,
            layout,
            loaded.images,
            retroPrintDetails(face) ? paintHistoricMana : paintMana,
          );
          const crop = document.createElement('canvas');
          crop.width = 585;
          crop.height = 300;
          crop.getContext('2d').drawImage(canvas, 75, 600, 585, 300, 0, 0, 585, 300);
          values.push({ id: candidate.id, layout, data: crop.toDataURL('image/png') });
          crop.width = crop.height = 0;
          canvas.width = canvas.height = 0;
        }
        loaded.dispose();
        blank.width = blank.height = 0;
        return { values, productionData };
      },
      { face: card.face, candidates },
    );
    const reference = normalize(
      await readPng(path.join(base, card.images.reference.file)),
      card.alignment.transform,
    );
    const production = PNG.sync.read(Buffer.from(values.productionData.split(',')[1], 'base64'));
    await savePng(path.join(out, `${card.collectorNumber}.scan.png`), reference);
    const target = cropGray(reference, [62, 417, 366, 184]);
    const scores = [];
    for (const value of values.values) {
      const bytes = Buffer.from(value.data.split(',')[1], 'base64'),
        crop = PNG.sync.read(bytes);
      if (value.id === 'control')
        for (let y = 0; y < 300; y++)
          assert.ok(
            production.data
              .subarray(((600 + y) * 732 + 75) * 4, ((600 + y) * 732 + 660) * 4)
              .equals(crop.data.subarray(y * 585 * 4, (y + 1) * 585 * 4)),
            `Control mismatch ${card.name}`,
          );
      const full = { width: 732, height: 1020, data: new Uint8Array(732 * 1020 * 4) };
      for (let y = 0; y < 300; y++)
        full.data.set(
          crop.data.subarray(y * 585 * 4, (y + 1) * 585 * 4),
          ((600 + y) * 732 + 75) * 4,
        );
      const rendered = cropGray(normalize(full), [62, 417, 366, 184]);
      const f1 = compareRegion(target.gray, rendered.gray, 366, 184).edgeF1[1];
      const file = `${card.collectorNumber}.${value.id}.png`;
      await atomicWrite(path.join(out, file), bytes);
      const wrappingTarget = targets[card.id];
      scores.push({
        id: value.id,
        edgeF1: f1,
        wrapping: wrappingTarget
          ? wrapping(
              wrappingTarget.lines,
              value.layout.lines.map(lineText),
              card.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join('')),
            )
          : null,
        layout: value.layout,
        file,
        sha256: hash(bytes),
      });
    }
    results.push({
      id: card.id,
      name: card.name,
      number: card.collectorNumber,
      inputHash: hash(JSON.stringify(card.face)),
      face: card.face,
      referenceHash: card.images.reference.sha256,
      alignmentUncertain: card.alignment.uncertain,
      scores,
    });
    console.log(`Measured ${card.name}`);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const summary = candidates
  .map((candidate) => ({
    ...candidate,
    medianF1: median(results.map((r) => r.scores.find((s) => s.id === candidate.id).edgeF1)),
    gains: results.filter(
      (r) => r.scores.find((s) => s.id === candidate.id).edgeF1 > r.scores[0].edgeF1 + 0.02,
    ).length,
    regressions: results
      .filter((r) => r.scores.find((s) => s.id === candidate.id).edgeF1 < r.scores[0].edgeF1 - 0.02)
      .map((r) => r.name),
  }))
  .sort((a, b) => b.medianF1 - a.medianF1);
await writeJson(path.join(out, 'sweep.json'), {
  schemaVersion: 1,
  set,
  transfer,
  mode,
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  experimentHash: await sourceHash(new URL('.', import.meta.url), /^centered.*\.mjs$/),
  alignmentHash: capture.alignmentHash,
  note: `${transfer ? 'Reserved transfer printings, frozen candidate only.' : 'Development printings.'} A single size/y/width candidate applies to every card. Balanced breaks minimize squared unused width at the minimum feasible line count. Existing font/assets/alignment remain unchanged. Control matches production crop pixels.`,
  candidates,
  summary,
  results,
});
console.log(JSON.stringify(summary.slice(0, 8), null, 2));
