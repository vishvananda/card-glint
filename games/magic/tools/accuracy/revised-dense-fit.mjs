import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { lineText, wrapping } from './typography-metrics.mjs';
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
const plan = await readJson(path.join(fixture, 'dense-fit-plan.json'));
const directory = path.join(outputRoot, '3ed', plan.sourceRun);
const captureBytes = await readFile(path.join(directory, 'capture.json'));
assert.equal(hash(captureBytes), plan.captureHash);
const capture = JSON.parse(captureBytes);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, plan.baselineRendererHash, 'Run before changing production');
const experimentHash = hash(await readFile(new URL(import.meta.url)));
const frozen =
  phase === 'validation' ? await readJson(path.join(fixture, 'dense-fit-candidate.json')) : null;
if (frozen) assert.equal(experimentHash, frozen.experimentHash);
const candidates = [{ id: 'control' }, ...(frozen ? [frozen.candidate] : plan.candidates)];
const out = path.join(outputRoot, '3ed', `dense-fit-${phase}`);
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
    assert.equal(hash(scanBytes), selection.referenceHash);
    const reference = normalize(PNG.sync.read(scanBytes));
    const target = cropGray(reference, [62, 417, 366, 184]);
    const scores = [];
    for (const tier of tiers) {
      const images = await session.page.evaluate(
        async ({ face, tier, candidates }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { retroTextLayout, RETRO_TYPOGRAPHY } = await import(
            '/games/magic/src/presentation/retro-rules.ts'
          );
          const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
          const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
          const { paintRevisedMana } = await import(
            '/games/magic/src/presentation/retro-details.ts'
          );
          const { retroAssets, retroRects, retroPx } = await import(
            '/games/magic/src/presentation/retro-frame.ts'
          );
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
          const [, y, , height] = retroPx(retroRects(face).rules);
          const output = [];
          for (const candidate of candidates) {
            const canvas = document.createElement('canvas');
            canvas.width = blank.width;
            canvas.height = blank.height;
            const c = canvas.getContext('2d');
            c.imageSmoothingQuality = 'high';
            c.drawImage(blank, 0, 0);
            c.scale(scale, scale);
            const regular = retroTextLayout(c, face);
            const layout =
              candidate.id === 'control' || regular.size >= candidate.regularSizeBelow
                ? regular
                : layoutRules(
                    c,
                    face.rulesParagraphs,
                    {
                      x: 70,
                      y: y + candidate.y,
                      width: 346,
                      height: height + candidate.height,
                    },
                    candidate.size,
                    15,
                    {
                      ...RETRO_TYPOGRAPHY,
                      leading: candidate.leading,
                      paragraphGap: 0,
                      flavorGap: 0,
                      centerOffset: candidate.centerOffset,
                    },
                  );
            paintRulesLayout(c, layout, loaded.images, paintRevisedMana);
            output.push({ candidate: candidate.id, layout, data: canvas.toDataURL('image/png') });
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
          assert.equal(
            hash(bytes),
            card.images[tier].sha256,
            `Control mismatch: ${card.name} ${tier}`,
          );
        const file = `${card.collectorNumber}.${tier}.${item.candidate}.png`;
        await atomicWrite(path.join(out, file), bytes);
        const rendered = cropGray(normalize(PNG.sync.read(bytes)), [62, 417, 366, 184]);
        const metrics = compareRegion(target.gray, rendered.gray, 366, 184);
        scores.push({
          candidate: item.candidate,
          tier,
          file,
          sha256: hash(bytes),
          edgeF1: metrics.edgeF1[1],
          meanDistance: metrics.meanDistance,
          censusSimilarity: metrics.censusSimilarity,
          layout: item.layout,
          wrapping: selection.scanLines
            ? wrapping(
                selection.scanLines,
                item.layout.lines.map(lineText),
                selection.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join('')),
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
      referenceHash: selection.referenceHash,
      scores,
    });
    console.log(`Measured ${card.name}`);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const summary = candidates
  .flatMap((candidate) =>
    tiers.map((tier) => {
      const pairs = results.map((r) => ({
        name: r.name,
        value: r.scores.find((s) => s.candidate === candidate.id && s.tier === tier),
        control: r.scores.find((s) => s.candidate === 'control' && s.tier === tier),
      }));
      return {
        ...candidate,
        tier,
        medianF1: median(pairs.map((r) => r.value.edgeF1)),
        medianDelta: median(pairs.map((r) => r.value.edgeF1 - r.control.edgeF1)),
        medianDistance: median(pairs.map((r) => r.value.meanDistance)),
        gains: pairs.filter((r) => r.value.edgeF1 > r.control.edgeF1 + 0.02).map((r) => r.name),
        regressions: pairs
          .filter((r) => r.value.edgeF1 < r.control.edgeF1 - 0.02)
          .map((r) => r.name),
        exactWraps: pairs.filter((r) => r.value.wrapping?.exactWrapping).length,
        overflow: pairs.filter((r) => r.value.layout.overflow).map((r) => r.name),
      };
    }),
  )
  .sort((a, b) => b.medianF1 - a.medianF1);
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
console.log(JSON.stringify(summary.slice(0, 10), null, 2));
