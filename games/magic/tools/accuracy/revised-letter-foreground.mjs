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
  readJson,
  writeJson,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  hash,
  sourceHash,
  root,
} from './common.mjs';

const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'letter-fill-plan.json'));
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), plan.baselineRendererHash);
const base = path.join(outputRoot, '3ed', plan.sourceRun);
const captureBytes = await readFile(path.join(base, 'capture.json'));
assert.equal(hash(captureBytes), plan.captureHash);
const capture = JSON.parse(captureBytes);
const directory = path.join(outputRoot, '3ed/letter-fill-development-neutral');
const trial = await readJson(path.join(directory, 'trial.json'));
const session = await openBrowser(await readJson(path.join(cacheRoot, 'sets/3ed.json')));
const results = [];
try {
  for (const selected of plan.development) {
    const card = capture.results.find((c) => c.id === selected.id);
    assert.equal(card.inputHash, selected.inputHash);
    assert.equal(hash(JSON.stringify(selected.face)), selected.inputHash);
    const probe = await session.page.evaluate(async (face) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const original = CanvasRenderingContext2D.prototype.fillText;
      const regions = {};
      try {
        CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
          const role =
            text === face.name && this.font.includes('Goudy')
              ? 'title'
              : text.startsWith('Illus. © ') && this.font.startsWith('22px')
                ? 'footer'
                : text === `${face.power}/${face.toughness}` && this.font.startsWith('26px')
                  ? 'stats'
                  : null;
          if (
            role &&
            this.globalCompositeOperation === 'source-over' &&
            this.fillStyle === '#f2eee3'
          ) {
            const m = this.measureText(text),
              scale = Math.min(1, maxWidth / m.width);
            const offset = role === 'title' ? 1 : 1.25;
            // One fixed horizontal halo covers wider reference glyphs and the
            // diagnostic shift range; never tailor a window to an individual scan.
            const left = Math.floor(x - m.actualBoundingBoxLeft * scale - 12);
            const top = Math.floor(y - m.actualBoundingBoxAscent - 4);
            const right = Math.ceil(x + m.actualBoundingBoxRight * scale + offset + 12);
            const bottom = Math.ceil(y + m.actualBoundingBoxDescent + offset + 4);
            regions[role] = {
              text,
              font: this.font,
              textAlign: this.textAlign,
              textBaseline: this.textBaseline,
              x,
              y,
              maxWidth,
              rect: [left, top, right - left, bottom - top],
            };
          }
          return original.call(this, text, x, y, maxWidth);
        };
        const canvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        const data = canvas.toDataURL('image/png');
        canvas.width = canvas.height = 0;
        return { data, regions };
      } finally {
        CanvasRenderingContext2D.prototype.fillText = original;
      }
    }, selected.face);
    assert.equal(hash(Buffer.from(probe.data.split(',')[1], 'base64')), card.images.inspect.sha256);
    const sourceBytes = await readFile(path.join(base, card.images.reference.file));
    assert.equal(hash(sourceBytes), selected.referenceHash);
    const reference = normalize(PNG.sync.read(sourceBytes));
    const scores = [],
      shifts = [];
    for (const item of trial.results.find((r) => r.id === selected.id).scores) {
      const bytes = await readFile(path.join(directory, item.file));
      assert.equal(hash(bytes), item.sha256);
      const rendered = normalize(PNG.sync.read(bytes));
      const regions = Object.entries(probe.regions).map(([id, geometry]) => {
        const a = cropGray(reference, geometry.rect),
          b = cropGray(rendered, geometry.rect);
        if (item.candidate === 'control' && item.tier === 'inspect')
          for (let dy = -3; dy <= 3; dy++)
            for (let dx = -3; dx <= 3; dx++) {
              const [x, y, w, h] = geometry.rect;
              const shifted = cropGray(rendered, [x - dx, y - dy, w, h]);
              shifts.push({
                region: id,
                dx,
                dy,
                contrast: letteringContrast(a.gray, shifted.gray, w, h),
              });
            }
        return {
          id,
          rect: geometry.rect,
          ...compareLettering(a.gray, b.gray, a.width, a.height),
          contrastCorrelation: letteringContrast(a.gray, b.gray, a.width, a.height),
        };
      });
      scores.push({ candidate: item.candidate, tier: item.tier, sha256: item.sha256, regions });
    }
    results.push({
      id: card.id,
      name: card.name,
      number: card.collectorNumber,
      inputHash: card.inputHash,
      referenceHash: selected.referenceHash,
      geometry: probe.regions,
      scores,
      shifts,
    });
    console.log(`Measured foreground: ${card.name}`);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const summary = trial.candidates.flatMap((c) =>
  ['inspect', 'table'].flatMap((tier) =>
    ['title', 'footer', 'stats'].map((region) => {
      const rows = results.flatMap((r) =>
        r.scores
          .find((s) => s.candidate === c.id && s.tier === tier)
          .regions.filter((w) => w.id === region),
      );
      return {
        candidate: c.id,
        tier,
        region,
        count: rows.length,
        medianF1: median(rows.map((r) => r.edgeF1)),
        medianContrast: median(rows.map((r) => r.contrastCorrelation)),
        medianCensus: median(rows.map((r) => r.censusSimilarity)),
      };
    }),
  ),
);
const sharedShifts = ['title', 'footer', 'stats'].map((region) => {
  const values = [];
  for (let dy = -3; dy <= 3; dy++)
    for (let dx = -3; dx <= 3; dx++) {
      const rows = results.flatMap((r) =>
        r.shifts.filter((s) => s.region === region && s.dx === dx && s.dy === dy),
      );
      values.push({
        dx,
        dy,
        count: rows.length,
        medianContrast: median(rows.map((r) => r.contrast)),
      });
    }
  return {
    region,
    zero: values.find((v) => v.dx === 0 && v.dy === 0),
    ranked: values.sort((a, b) => b.medianContrast - a.medianContrast),
  };
});
const output = {
  schemaVersion: 1,
  baselineRendererHash: plan.baselineRendererHash,
  captureHash: plan.captureHash,
  experimentHash: hash(await readFile(new URL(import.meta.url))),
  inputTrialHash: hash(await readFile(path.join(directory, 'trial.json'))),
  policy:
    'Font-measured glyph bounds plus fixed horizontal 12px and vertical 4px halos, including the existing edge offset. The initial horizontal 4px halo nearly clipped wider reference titles; widened uniformly after development-only visual inspection. Canonical windows come from unchanged renderer commands, never from per-scan fitting. Paired edge, Census and local-contrast scores remain separate.',
  note: 'Development-only diagnostic. Neutral fill previously failed reserved transfer and is not adopted. Shared translations are hypotheses for a future frozen study; no card or scan is repositioned.',
  summary,
  sharedShifts,
  results,
};
await writeJson(path.join(fixture, 'letter-foreground-development.json'), output);
console.log(
  JSON.stringify(
    {
      summary: summary.filter((s) => ['control', 'gray96-a1'].includes(s.candidate)),
      shifts: sharedShifts.map((s) => ({ region: s.region, zero: s.zero, best: s.ranked[0] })),
    },
    null,
    2,
  ),
);
