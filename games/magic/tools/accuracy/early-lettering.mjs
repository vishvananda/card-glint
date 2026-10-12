import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { median } from './metrics.mjs';
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
const stage = process.argv[3] ?? 'style';
assert.ok(['development', 'validation'].includes(phase));
const planFile = path.join(fixtureRoot, 'early-lettering-plan.json');
const planBytes = await readFile(planFile);
const plan = JSON.parse(planBytes);
const planHash = hash(planBytes);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, plan.rendererHash, 'Run on the frozen baseline renderer');
const experimentHash = await sourceHash(
  new URL('.', import.meta.url),
  /^early-lettering(?:-painter)?\.mjs$/,
);
const metricHash = await sourceHash(
  new URL('.', import.meta.url),
  /^(?:lettering-metrics|lettering-contrast|metrics|edges|pixels)\.mjs$/,
);
const frozen =
  phase === 'validation'
    ? await readJson(path.join(fixtureRoot, 'early-lettering-candidate.json'))
    : null;
if (frozen) {
  assert.equal(frozen.experimentHash, experimentHash);
  assert.equal(frozen.metricHash, metricHash);
  assert.equal(frozen.planHash, planHash);
}
const candidates = [{ id: 'control' }, ...(frozen ? [frozen.candidate] : plan.stages[stage])];
assert.ok(candidates.length > 1);
const out = path.join(
  outputRoot,
  'early-lettering',
  phase === 'validation' ? phase : `${phase}-${stage}`,
);
const results = [];
for (const set of plan.sets) {
  const run = phase === 'validation' ? 'early-fields-reserved' : 'early-fields';
  const base = path.join(outputRoot, set.code, run);
  const captureBytes = await readFile(path.join(base, 'capture.json'));
  const capture = JSON.parse(captureBytes);
  if (!frozen) assert.equal(hash(captureBytes), set.captureHash);
  assert.equal(capture.rendererHash, rendererHash);
  const selected = phase === 'validation' ? set.reserved : set.development;
  const session = await openBrowser(
    await readJson(path.join(cacheRoot, 'sets', `${set.code}.json`)),
  );
  try {
    for (const selection of selected) {
      const card = capture.results.find((c) => c.id === selection.id);
      assert.ok(card);
      assert.equal(card.inputHash, selection.inputHash);
      const bytes = await readFile(path.join(base, card.images.reference.file));
      assert.equal(hash(bytes), selection.referenceHash);
      const reference = normalize(PNG.sync.read(bytes));
      const windows = [
        {
          id: 'title',
          rect: [28, 27, Math.floor(444 - card.face.manaSymbols.length * 25) - 28, 36],
        },
        { id: 'footer', rect: [42, 607, 347, 38] },
      ];
      const scores = [];
      for (const tier of ['inspect', 'table']) {
        const images = await session.page.evaluate(
          async ({ face, tier, candidates }) => {
            const { composeCardTexture } = await import(
              '/games/magic/src/presentation/canvas-face.ts'
            );
            const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
            const { canvasAssetUrls, loadCanvasImages, loadCanvasFonts } = await import(
              '/games/magic/src/presentation/canvas-assets.ts'
            );
            const { paintEarlyTrial } = await import(
              '/games/magic/tools/accuracy/early-lettering-painter.mjs'
            );
            await Promise.all([loadCanvasFonts(), loadRetroFont()]);
            const signal = new AbortController().signal;
            const loaded = await loadCanvasImages(canvasAssetUrls(face), signal);
            const native = CanvasRenderingContext2D.prototype.fillText;
            const output = [];
            try {
              for (const candidate of candidates) {
                const hits = {};
                CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
                  const role =
                    text === face.name && this.font.includes('Goudy')
                      ? 'title'
                      : text.startsWith('Illus. ') && this.font.startsWith('15.6px')
                        ? 'footer'
                        : null;
                  if (!role || !candidate[role]) return native.call(this, text, x, y, maxWidth);
                  hits[role] = (hits[role] ?? 0) + 1;
                  paintEarlyTrial(this, native, text, x, y, maxWidth, candidate, role, face);
                };
                const canvas = await composeCardTexture(
                  { face, printingId: null, printedImage: null },
                  tier,
                  signal,
                  {
                    loadImages: async () => ({ images: loaded.images, dispose() {} }),
                    loadFonts: async () => {},
                    loadRetroFont: async () => {},
                  },
                );
                output.push({ candidate: candidate.id, hits, data: canvas.toDataURL('image/png') });
                canvas.width = canvas.height = 0;
              }
            } finally {
              CanvasRenderingContext2D.prototype.fillText = native;
              loaded.dispose();
            }
            return output;
          },
          { face: card.face, tier, candidates },
        );
        for (const item of images) {
          const bytes = Buffer.from(item.data.split(',')[1], 'base64');
          if (item.candidate === 'control') assert.equal(hash(bytes), card.images[tier].sha256);
          else
            for (const role of ['title', 'footer'])
              assert.equal(
                item.hits[role] ?? 0,
                candidates.find((c) => c.id === item.candidate)[role] ? 1 : 0,
              );
          const file = `${set.code}-${card.collectorNumber}.${tier}.${item.candidate}.png`;
          await atomicWrite(path.join(out, file), bytes);
          const rendered = normalize(PNG.sync.read(bytes));
          const regions = windows.map(({ id, rect }) => {
            const a = cropGray(reference, rect),
              b = cropGray(rendered, rect);
            return {
              id,
              rect,
              ...compareLettering(a.gray, b.gray, a.width, a.height),
              contrast: letteringContrast(a.gray, b.gray, a.width, a.height),
            };
          });
          scores.push({ candidate: item.candidate, tier, file, sha256: hash(bytes), regions });
        }
      }
      results.push({
        set: set.code,
        id: card.id,
        number: card.collectorNumber,
        name: card.name,
        sourceRun: run,
        inputHash: card.inputHash,
        referenceHash: selection.referenceHash,
        referenceFile: path.relative(outputRoot, path.join(base, card.images.reference.file)),
        artist: card.face.artist,
        scores,
      });
      console.log(`Measured ${set.code} ${card.name}`);
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
}
const summary = candidates.flatMap((candidate) =>
  ['all', 'lea', '2ed'].flatMap((set) =>
    ['inspect', 'table'].flatMap((tier) =>
      ['title', 'footer'].map((region) => {
        const rows = results
          .filter((r) => set === 'all' || r.set === set)
          .map((r) => ({
            name: `${r.set} ${r.name}`,
            before: r.scores
              .find((s) => s.tier === tier && s.candidate === 'control')
              .regions.find((w) => w.id === region),
            after: r.scores
              .find((s) => s.tier === tier && s.candidate === candidate.id)
              .regions.find((w) => w.id === region),
          }));
        return {
          candidate: candidate.id,
          set,
          tier,
          region,
          count: rows.length,
          medianF1: median(rows.map((r) => r.after.edgeF1)),
          medianDelta: median(rows.map((r) => r.after.edgeF1 - r.before.edgeF1)),
          medianContrast: median(rows.map((r) => r.after.contrast)),
          medianCensus: median(rows.map((r) => r.after.censusSimilarity)),
          gains: rows.filter((r) => r.after.edgeF1 > r.before.edgeF1 + 0.02).map((r) => r.name),
          regressions: rows
            .filter((r) => r.after.edgeF1 < r.before.edgeF1 - 0.02)
            .map((r) => r.name),
        };
      }),
    ),
  ),
);
await writeJson(path.join(out, 'trial.json'), {
  schemaVersion: 1,
  phase,
  stage,
  rendererHash,
  experimentHash,
  metricHash,
  planHash,
  alignment: plan.alignment,
  candidates,
  summary,
  results,
});
console.log(JSON.stringify(summary.filter((s) => s.set === 'all' && s.tier === 'inspect')));
