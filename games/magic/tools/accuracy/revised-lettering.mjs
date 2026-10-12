import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { median } from './metrics.mjs';
import { compareLettering } from './lettering-metrics.mjs';
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

const phase = process.argv[2] ?? 'development',
  stage = process.argv[3] ?? 'style';
assert.ok(['development', 'validation'].includes(phase));
const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'lettering-plan.json'));
const base = path.join(outputRoot, '3ed', plan.sourceRun);
const captureBytes = await readFile(path.join(base, 'capture.json'));
assert.equal(hash(captureBytes), plan.captureHash);
const capture = JSON.parse(captureBytes);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, plan.baselineRendererHash, 'Run on the baseline renderer');
const experimentHash = hash(await readFile(new URL(import.meta.url)));
const metricHash = await sourceHash(
  new URL('.', import.meta.url),
  /^(?:lettering-metrics|metrics|edges|pixels)\.mjs$/,
);
const frozen =
  phase === 'validation' ? await readJson(path.join(fixture, 'lettering-candidate.json')) : null;
if (frozen) {
  assert.equal(experimentHash, frozen.experimentHash);
  assert.equal(metricHash, frozen.metricHash);
  assert.equal(hash(await readFile(path.join(fixture, 'lettering-plan.json'))), frozen.planHash);
}
const candidates = [
  { id: 'control' },
  ...(frozen
    ? [frozen.candidate]
    : (plan.stageCandidates?.[stage] ??
      plan.stages[stage].map((p) => ({ ...plan.baseCandidate, ...p })))),
];
const selected = phase === 'validation' ? plan.reserved : plan.development;
const out = path.join(outputRoot, '3ed', `lettering-${phase}${frozen ? '' : `-${stage}`}`);
const session = await openBrowser(await readJson(path.join(cacheRoot, 'sets/3ed.json')));
const results = [];
try {
  for (const selection of selected) {
    const card = capture.results.find((r) => r.id === selection.id);
    assert.equal(card.inputHash, selection.inputHash);
    assert.equal(hash(JSON.stringify(selection.face)), selection.inputHash);
    const source = await readFile(path.join(base, card.images.reference.file));
    assert.equal(hash(source), selection.referenceHash);
    const reference = normalize(PNG.sync.read(source));
    const windows = [
      { id: 'title', rect: [32, 25, Math.floor(445 - card.face.manaSymbols.length * 25) - 32, 40] },
      { id: 'footer', rect: [40, 613, 350, 38] },
      ...(card.face.power != null && !selection.statsWarning
        ? [{ id: 'stats', rect: [326, 607, 134, 43] }]
        : []),
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
                    : text === face.typeLine && this.font.startsWith('21.7px')
                      ? 'type'
                      : text === `${face.power}/${face.toughness}` && this.font.startsWith('27.8px')
                        ? 'stats'
                        : text.startsWith('Illus. ') && this.font.startsWith('15.6px')
                          ? 'footer'
                          : null;
                if (!role || candidate.id === 'control')
                  return native.call(this, text, x, y, maxWidth);
                hits[role] = (hits[role] ?? 0) + 1;
                if (role === 'type' && candidate.keepType)
                  return native.call(this, text, x, y, maxWidth);
                this.save();
                this.shadowColor = 'transparent';
                this.shadowOffsetX = this.shadowOffsetY = 0;
                this.fillStyle = '#17140f';
                this.strokeStyle = '#f2eee3';
                this.lineWidth = candidate.outline;
                this.lineJoin = 'round';
                if (role === 'title') {
                  maxWidth += x - candidate.titleX;
                  x = candidate.titleX;
                  y += candidate.titleDY;
                  this.font = `${candidate.titleSize}px "CardRenderer MTG Goudy", Georgia`;
                } else if (role === 'type') {
                  x = candidate.typeX;
                } else if (role === 'stats') {
                  this.textAlign = 'right';
                  x = candidate.statsRight;
                  y += candidate.statsDY;
                  maxWidth = candidate.statsWidth;
                  if (candidate.statsSize)
                    this.font = `${candidate.statsSize}px "CardRenderer MTG ${candidate.statsFont ?? 'MPlantin'}", Georgia`;
                } else {
                  this.textAlign = 'left';
                  this.textBaseline = 'alphabetic';
                  this.font = `${candidate.artistSize}px "CardRenderer MTG MPlantin", Georgia`;
                  text = `Illus. © ${face.artist}`;
                  x = candidate.artistX;
                  y = candidate.artistBaseline;
                  maxWidth = 338;
                }
                const mode = candidate[`${role}Mode`] ?? candidate.mode ?? 'outline-dark';
                if (mode === 'bevel') {
                  // Difference of two translated glyph masks: the frame remains
                  // visible through the interior. No pixel readback or new font.
                  const layer = document.createElement('canvas');
                  layer.width = this.canvas.width;
                  layer.height = this.canvas.height;
                  const ink = layer.getContext('2d');
                  const matrix = this.getTransform();
                  ink.font = this.font;
                  ink.textAlign = this.textAlign;
                  ink.textBaseline = this.textBaseline;
                  ink.letterSpacing = this.letterSpacing;
                  const offset = candidate[`${role}Offset`] ?? candidate.offset;
                  if (candidate.bevelFill) {
                    this.globalAlpha *= candidate.bevelFill;
                    this.fillStyle = '#f2eee3';
                    native.call(this, text, x, y, maxWidth);
                    this.globalAlpha /= candidate.bevelFill;
                  }
                  this.setTransform(1, 0, 0, 1, 0, 0);
                  for (const [shift, subtract, color] of [
                    [0, offset, '#f2eee3'],
                    [offset, 0, '#17140f'],
                  ]) {
                    ink.resetTransform();
                    ink.clearRect(0, 0, layer.width, layer.height);
                    ink.setTransform(matrix);
                    ink.globalCompositeOperation = 'source-over';
                    ink.fillStyle = color;
                    native.call(ink, text, x + shift, y + shift, maxWidth);
                    ink.globalCompositeOperation = 'destination-out';
                    native.call(ink, text, x + subtract, y + subtract, maxWidth);
                    this.drawImage(layer, 0, 0);
                  }
                  layer.width = layer.height = 0;
                  this.restore();
                  return;
                }
                if (mode === 'light-shadow' || mode === 'dark-highlight') {
                  const light = mode === 'light-shadow';
                  this.fillStyle = light ? '#f2eee3' : '#17140f';
                  this.shadowColor = light ? '#17140f' : '#f2eee3';
                  this.shadowOffsetX = this.shadowOffsetY =
                    (light ? 1 : -1) *
                    (candidate[`${role}Offset`] ?? candidate.offset) *
                    this.getTransform().a;
                } else if (mode === 'outline-light' || mode === 'inner-edge') {
                  this.fillStyle = '#f2eee3';
                  this.strokeStyle = '#17140f';
                }
                if (candidate.outline > 0 && ['outline-dark', 'outline-light'].includes(mode))
                  this.strokeText(text, x, y, maxWidth);
                native.call(this, text, x, y, maxWidth);
                if (mode === 'inner-edge') this.strokeText(text, x, y, maxWidth);
                this.restore();
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
        { face: selection.face, tier, candidates },
      );
      for (const item of images) {
        const bytes = Buffer.from(item.data.split(',')[1], 'base64');
        if (item.candidate === 'control')
          assert.equal(hash(bytes), card.images[tier].sha256, `${card.name} ${tier} control`);
        else {
          assert.equal(item.hits.title, 1);
          assert.equal(item.hits.type, 1);
          assert.equal(item.hits.footer, 1);
          assert.equal(item.hits.stats ?? 0, card.face.power == null ? 0 : 1);
        }
        const file = `${card.collectorNumber}.${tier}.${item.candidate}.png`;
        await atomicWrite(path.join(out, file), bytes);
        const rendered = normalize(PNG.sync.read(bytes));
        const regions = windows.map(({ id, rect }) => {
          const a = cropGray(reference, rect),
            b = cropGray(rendered, rect);
          const m = compareLettering(a.gray, b.gray, a.width, a.height);
          return {
            id,
            rect,
            ...m,
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
      referenceHash: selection.referenceHash,
      statsWarning: selection.statsWarning ?? null,
      scores,
    });
    console.log(`Measured ${card.name}`);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const summary = candidates.flatMap((candidate) =>
  ['inspect', 'table'].flatMap((tier) =>
    ['title', 'footer', 'stats'].map((region) => {
      const rows = results
        .map((r) => ({
          name: r.name,
          before: r.scores
            .find((s) => s.tier === tier && s.candidate === 'control')
            .regions.find((w) => w.id === region),
          after: r.scores
            .find((s) => s.tier === tier && s.candidate === candidate.id)
            .regions.find((w) => w.id === region),
        }))
        .filter((r) => r.before && r.after);
      return {
        candidate: candidate.id,
        tier,
        region,
        count: rows.length,
        medianF1: median(rows.map((r) => r.after.edgeF1)),
        medianCensus: median(rows.map((r) => r.after.censusSimilarity).filter((v) => v !== null)),
        medianDelta: median(rows.map((r) => r.after.edgeF1 - r.before.edgeF1)),
        gains: rows.filter((r) => r.after.edgeF1 > r.before.edgeF1 + 0.02).map((r) => r.name),
        regressions: rows.filter((r) => r.after.edgeF1 < r.before.edgeF1 - 0.02).map((r) => r.name),
      };
    }),
  ),
);
await writeJson(path.join(out, 'trial.json'), {
  schemaVersion: 1,
  phase,
  stage,
  rendererHash,
  experimentHash,
  metricHash,
  metric: 'mean of separate dark/light boundary F1; paired census retains polarity',
  captureHash: plan.captureHash,
  candidates,
  summary,
  results,
});
console.log(
  JSON.stringify(
    summary.filter((s) => s.tier === 'inspect'),
    null,
    2,
  ),
);
