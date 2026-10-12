import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readPng, normalize, cropGray, savePng } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { lineText, wrapping } from './typography-metrics.mjs';
import {
  cacheRoot,
  fixtureRoot,
  outputRoot,
  root,
  hash,
  atomicWrite,
  readJson,
  writeJson,
  sourceHash,
} from './common.mjs';

const phase = process.argv[2] ?? 'development';
if (!['development', 'validation'].includes(phase)) throw Error('Invalid phase');
const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'centered-width-plan.json'));
const base = path.join(outputRoot, '3ed', plan.sourceRun);
const captureBytes = await readFile(path.join(base, 'capture.json'));
assert.equal(hash(captureBytes), plan.captureHash, 'Frozen typography baseline changed');
const capture = JSON.parse(captureBytes);
const snapshot = await readJson(path.join(cacheRoot, 'sets/3ed.json'));
const out = path.join(outputRoot, '3ed', `centered-width-${phase}-revised`);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, capture.rendererHash, 'Run the frozen trial before changing production');
const frozen =
  phase === 'validation'
    ? await readJson(path.join(fixture, 'centered-width-candidate.json'))
    : null;
const experimentHash = hash(await readFile(new URL(import.meta.url)));
if (frozen)
  assert.equal(frozen.experimentHash, experimentHash, 'Trial changed after candidate freeze');
const selected = phase === 'development' ? plan.development : plan.reserved;
const grid = plan.developmentGrid;
const candidates = [
  { id: 'control' },
  ...(frozen
    ? [frozen.candidate]
    : [
        ...grid.sizes.flatMap((size) =>
          grid.leading.flatMap((leading) =>
            grid.widths.flatMap((width) =>
              grid.y.map((y) => ({
                id: `s${size}-l${leading}-w${width}-y${y}`,
                size,
                leading,
                width,
                y,
              })),
            ),
          ),
        ),
      ]),
];
const tiers = phase === 'development' ? ['inspect'] : ['inspect', 'table'];
const session = await openBrowser(snapshot);
const results = [];
try {
  for (const selectedCard of selected) {
    const card = capture.results.find((c) => c.id === selectedCard.id);
    assert.equal(hash(JSON.stringify(selectedCard.face)), card.inputHash);
    const referenceBytes = await readFile(path.join(base, card.images.reference.file));
    assert.equal(hash(referenceBytes), card.images.reference.sha256);
    const reference = normalize(PNG.sync.read(referenceBytes));
    const target = cropGray(reference, [62, 417, 366, 184]);
    const scanCrop = new PNG({ width: 390, height: 200 });
    for (let y = 0; y < 200; y++)
      scanCrop.data.set(
        reference.data.subarray(((400 + y) * 488 + 50) * 4, ((400 + y) * 488 + 440) * 4),
        y * 390 * 4,
      );
    await savePng(path.join(out, `${card.collectorNumber}.scan.png`), scanCrop);
    const scores = [];
    for (const tier of tiers) {
      const values = await session.page.evaluate(
        async ({ face, candidates, tier }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { retroTextLayout, RETRO_TYPOGRAPHY } = await import(
            '/games/magic/src/presentation/retro-rules.ts'
          );
          const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
          const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
          const { retroAssets } = await import('/games/magic/src/presentation/retro-frame.ts');
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
          const { paintHistoricMana, retroPrintDetails } = await import(
            '/games/magic/src/presentation/retro-details.ts'
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
          const values = [];
          for (const candidate of candidates) {
            const canvas = document.createElement('canvas');
            canvas.width = blank.width;
            canvas.height = blank.height;
            const c = canvas.getContext('2d');
            c.imageSmoothingQuality = 'high';
            c.drawImage(blank, 0, 0);
            c.scale(scale, scale);
            const layout =
              candidate.id === 'control'
                ? retroTextLayout(c, face)
                : layoutRules(
                    c,
                    face.rulesParagraphs.map((p) => ({ ...p, align: 'center' })),
                    {
                      x: 244 - candidate.width / 2,
                      y: candidate.y,
                      width: candidate.width,
                      height: 177.232,
                    },
                    candidate.size,
                    candidate.size,
                    { ...RETRO_TYPOGRAPHY, leading: candidate.leading, balanceLines: true },
                  );
            paintRulesLayout(
              c,
              layout,
              loaded.images,
              retroPrintDetails(face) ? paintHistoricMana : paintMana,
            );
            const crop = document.createElement('canvas');
            crop.width = 390 * scale;
            crop.height = 200 * scale;
            crop
              .getContext('2d')
              .drawImage(
                canvas,
                50 * scale,
                400 * scale,
                390 * scale,
                200 * scale,
                0,
                0,
                390 * scale,
                200 * scale,
              );
            values.push({ id: candidate.id, layout, data: crop.toDataURL('image/png') });
            crop.width = crop.height = 0;
            canvas.width = canvas.height = 0;
          }
          loaded.dispose();
          blank.width = blank.height = 0;
          return values;
        },
        { face: selectedCard.face, candidates, tier },
      );
      const scale = tier === 'inspect' ? 1.5 : 0.5;
      const baseline = await readPng(path.join(base, card.images[tier].file));
      for (const value of values) {
        const bytes = Buffer.from(value.data.split(',')[1], 'base64');
        const crop = PNG.sync.read(bytes);
        if (value.id === 'control')
          for (let y = 0; y < crop.height; y++)
            assert.ok(
              baseline.data
                .subarray(
                  ((400 * scale + y) * baseline.width + 50 * scale) * 4,
                  ((400 * scale + y) * baseline.width + 440 * scale) * 4,
                )
                .equals(crop.data.subarray(y * crop.width * 4, (y + 1) * crop.width * 4)),
              `Control mismatch: ${card.name} ${tier}`,
            );
        const full = {
          width: baseline.width,
          height: baseline.height,
          data: new Uint8Array(baseline.width * baseline.height * 4),
        };
        for (let y = 0; y < crop.height; y++)
          full.data.set(
            crop.data.subarray(y * crop.width * 4, (y + 1) * crop.width * 4),
            ((400 * scale + y) * full.width + 50 * scale) * 4,
          );
        const rendered = cropGray(normalize(full), [62, 417, 366, 184]);
        const metrics = compareRegion(target.gray, rendered.gray, 366, 184);
        const file = `${card.collectorNumber}.${tier}.${value.id}.png`;
        await atomicWrite(path.join(out, file), bytes);
        scores.push({
          id: value.id,
          tier,
          file,
          sha256: hash(bytes),
          edgeF1: metrics.edgeF1[1],
          meanDistance: metrics.meanDistance,
          censusSimilarity: metrics.censusSimilarity,
          layout: value.layout,
          wrapping: selectedCard.scanLines
            ? wrapping(
                selectedCard.scanLines,
                value.layout.lines.map(lineText),
                selectedCard.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join('')),
              )
            : null,
        });
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
const summary = candidates
  .flatMap((c) =>
    tiers.map((tier) => {
      const matched = results.map((r) => ({
        name: r.name,
        actual: r.scores.find((s) => s.id === c.id && s.tier === tier),
        control: r.scores.find((s) => s.id === 'control' && s.tier === tier),
      }));
      return {
        ...c,
        tier,
        medianF1: median(matched.map((r) => r.actual.edgeF1)),
        medianDistance: median(matched.map((r) => r.actual.meanDistance)),
        gains: matched.filter((r) => r.actual.edgeF1 > r.control.edgeF1 + 0.02).length,
        regressions: matched
          .filter((r) => r.actual.edgeF1 < r.control.edgeF1 - 0.02)
          .map((r) => r.name),
        exactWraps: matched.filter((r) => r.actual.wrapping?.exactWrapping).length,
      };
    }),
  )
  .sort((a, b) => b.medianF1 - a.medianF1);
await writeJson(path.join(out, 'sweep.json'), {
  schemaVersion: 1,
  phase,
  rendererHash,
  experimentHash,
  captureHash: plan.captureHash,
  candidates,
  summary,
  results,
});
console.log(JSON.stringify(summary.slice(0, 10), null, 2));
