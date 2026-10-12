import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
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
assert.ok(['development', 'validation'].includes(phase));
const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'mana-plan.json'));
const base = path.join(outputRoot, '3ed', plan.sourceRun);
const captureBytes = await readFile(path.join(base, 'capture.json'));
assert.equal(hash(captureBytes), plan.captureHash);
const capture = JSON.parse(captureBytes);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), plan.baselineRendererHash);
const experimentHash = await sourceHash(
  new URL('.', import.meta.url),
  /^revised-mana(?:-painter)?\.mjs$/,
);
const metricHash = await sourceHash(
  new URL('.', import.meta.url),
  /^(?:metrics|lettering-contrast|edges|pixels)\.mjs$/,
);
const frozen =
  phase === 'validation' ? await readJson(path.join(fixture, 'mana-candidate.json')) : null;
if (frozen) {
  assert.equal(frozen.experimentHash, experimentHash);
  assert.equal(frozen.metricHash, metricHash);
  assert.equal(frozen.planHash, hash(await readFile(path.join(fixture, 'mana-plan.json'))));
}
const candidates = [
  { id: 'control' },
  ...(frozen
    ? [frozen.candidate]
    : [433, 434, 435, 436, 437].flatMap((right) =>
        [43.5, 44.5, 45.5].flatMap((centerY) =>
          [26, 27, 28].map((pitch) => ({
            id: `x${right}-y${centerY}-p${pitch}`,
            right,
            centerY,
            pitch,
            size: 23.4,
            whiteSize: 21,
          })),
        ),
      )),
];
const selected = phase === 'development' ? plan.development : plan.reserved;
const out = path.join(outputRoot, '3ed', `mana-${phase}`);
const session = await openBrowser(await readJson(path.join(cacheRoot, 'sets/3ed.json')));
const results = [];
try {
  for (const selection of selected) {
    const card = capture.results.find((c) => c.id === selection.id);
    assert.equal(card.inputHash, selection.inputHash);
    assert.equal(hash(JSON.stringify(selection.face)), selection.inputHash);
    const source = await readFile(path.join(base, card.images.reference.file));
    assert.equal(hash(source), selection.referenceHash);
    const reference = normalize(PNG.sync.read(source));
    // Fixed shared nominal windows, excluding the horizontal outer frame line.
    const left = Math.floor(436 - (selection.face.manaSymbols.length - 1) * 27 - 18);
    const windows = [
      { id: 'row', rect: [left, 31, 454 - left, 31] },
      ...selection.face.manaSymbols.map((symbol, i) => ({
        id: `symbol-${i}-${symbol}`,
        rect: [Math.floor(436 - (selection.face.manaSymbols.length - 1 - i) * 27 - 16), 31, 32, 31],
      })),
    ];
    const scores = [];
    for (const tier of ['inspect', 'table']) {
      const images = await session.page.evaluate(
        async ({ face, tier, candidates }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { retroRects, retroPx, retroAssets } = await import(
            '/games/magic/src/presentation/retro-frame.ts'
          );
          const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
          const { paintManaCandidate } = await import(
            '/games/magic/tools/accuracy/revised-mana-painter.mjs'
          );
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const { manaSymbolAsset } = await import('/games/magic/src/presentation/assets.ts');
          const signal = new AbortController().signal;
          const loaded = await loadCanvasImages(retroAssets(face), signal);
          const [x, y, w, h] = retroPx(retroRects(face).title);
          const size = 23.4,
            pitch = 25.1,
            top = y + h / 2 - size / 2,
            left = x + w - face.manaSymbols.length * pitch;
          const arc = CanvasRenderingContext2D.prototype.arc;
          const draw = CanvasRenderingContext2D.prototype.drawImage;
          const output = [];
          let nested = false;
          try {
            for (const candidate of candidates) {
              let hits = 0;
              CanvasRenderingContext2D.prototype.arc = function (...args) {
                if (
                  candidate.id !== 'control' &&
                  !nested &&
                  Math.abs(args[1] - (top + size / 2)) < 0.0001 &&
                  Math.abs(args[2] - size / 2) < 0.0001
                )
                  return;
                return arc.apply(this, args);
              };
              CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
                const index = face.manaSymbols.findIndex(
                  (s, i) =>
                    image === loaded.images.get(manaSymbolAsset(s)) &&
                    Math.abs(args[0] - (left + i * pitch)) < 0.0001,
                );
                if (
                  candidate.id !== 'control' &&
                  !nested &&
                  args.length === 4 &&
                  Math.abs(args[1] - top) < 0.0001 &&
                  args[2] === size &&
                  args[3] === size &&
                  index >= 0
                ) {
                  hits++;
                  nested = true;
                  try {
                    paintManaCandidate(
                      this,
                      face.manaSymbols[index],
                      candidate.right -
                        (face.manaSymbols.length - 1 - index) * candidate.pitch -
                        candidate.size / 2,
                      candidate.centerY - candidate.size / 2,
                      candidate.size,
                      loaded.images,
                      paintMana,
                      candidate.whiteSize,
                    );
                  } finally {
                    nested = false;
                  }
                  return;
                }
                return draw.call(this, image, ...args);
              };
              const canvas = await composeCardTexture(
                { face, printingId: null, printedImage: null },
                tier,
                signal,
                { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
              );
              if (candidate.id !== 'control' && hits !== face.manaSymbols.length)
                throw Error(`Header interception mismatch: ${hits}`);
              output.push({ candidate: candidate.id, data: canvas.toDataURL('image/png') });
              canvas.width = canvas.height = 0;
            }
          } finally {
            CanvasRenderingContext2D.prototype.arc = arc;
            CanvasRenderingContext2D.prototype.drawImage = draw;
            loaded.dispose();
          }
          return output;
        },
        { face: selection.face, tier, candidates },
      );
      for (const item of images) {
        const bytes = Buffer.from(item.data.split(',')[1], 'base64');
        if (item.candidate === 'control')
          assert.equal(hash(bytes), card.images[tier].sha256, `Control mismatch: ${card.name}`);
        const file = `${selection.number}.${tier}.${item.candidate}.png`;
        await atomicWrite(path.join(out, file), bytes);
        const rendered = normalize(PNG.sync.read(bytes));
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
            contrastCorrelation: letteringContrast(a.gray, b.gray, a.width, a.height),
          };
        });
        scores.push({ candidate: item.candidate, tier, file, sha256: hash(bytes), regions });
      }
    }
    results.push({
      id: card.id,
      name: card.name,
      number: selection.number,
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
const summary = candidates.flatMap((candidate) =>
  ['inspect', 'table'].map((tier) => {
    const rows = results.map((r) => {
      const get = (id) =>
        r.scores
          .find((s) => s.candidate === id && s.tier === tier)
          .regions.find((w) => w.id === 'row');
      return {
        name: r.name,
        ...get(candidate.id),
        delta: get(candidate.id).edgeF1 - get('control').edgeF1,
      };
    });
    return {
      candidate: candidate.id,
      tier,
      count: rows.length,
      medianF1: median(rows.map((r) => r.edgeF1)),
      medianContrast: median(rows.map((r) => r.contrastCorrelation)),
      medianCensus: median(rows.map((r) => r.censusSimilarity)),
      medianDelta: median(rows.map((r) => r.delta)),
      gains: rows.filter((r) => r.delta > 0.02).map((r) => r.name),
      regressions: rows.filter((r) => r.delta < -0.02).map((r) => r.name),
    };
  }),
);
await writeJson(path.join(out, 'trial.json'), {
  schemaVersion: 1,
  phase,
  baselineRendererHash: plan.baselineRendererHash,
  captureHash: plan.captureHash,
  experimentHash,
  metricHash,
  candidates,
  summary,
  results,
});
console.log(
  JSON.stringify(
    summary
      .filter((s) => s.tier === 'inspect')
      .sort((a, b) => b.medianDelta - a.medianDelta)
      .slice(0, 8),
    null,
    2,
  ),
);
