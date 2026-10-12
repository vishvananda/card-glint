import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
import { readJson, writeJson, outputRoot, fixtureRoot, hash, sourceHash } from './common.mjs';

const base = path.join(outputRoot, '3ed');
const fixture = path.join(fixtureRoot, '3ed');
const before = await readJson(path.join(base, 'revised-dense/capture.json'));
const after = await readJson(path.join(base, 'revised-lettering/capture.json'));
const plan = await readJson(path.join(fixture, 'lettering-plan.json'));
const check = await readJson(path.join(fixture, 'lettering-capture-check.json'));
assert.equal(check.rendererHash, after.rendererHash);
const reviewed = new Map([...plan.development, ...plan.reserved].map((c) => [c.id, c]));
const pairs = [];
const started = performance.now();
async function image(run, asset) {
  const bytes = await readFile(path.join(base, run, asset.file));
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes));
}
for (const card of after.results) {
  const old = before.results.find((r) => r.id === card.id);
  assert.equal(card.inputHash, old.inputHash);
  const changed = card.images.inspect.sha256 !== old.images.inspect.sha256;
  if (!changed) continue;
  const selection = reviewed.get(card.id);
  const statsWarning = plan.development.find((r) => r.id === card.id)?.statsWarning ?? null;
  const reference = await image('revised-dense', old.images.reference);
  const windows = [
    { id: 'title', rect: [32, 25, Math.floor(445 - card.face.manaSymbols.length * 25) - 32, 40] },
    { id: 'footer', rect: [40, 613, 350, 38] },
    ...(card.face.power != null && !statsWarning
      ? [{ id: 'stats', rect: [326, 607, 134, 43] }]
      : []),
  ];
  const tiers = [];
  for (const tier of ['inspect', 'table']) {
    const a = await image('revised-dense', old.images[tier]);
    const b = await image('revised-lettering', card.images[tier]);
    const regions = windows.map(({ id, rect }) => {
      const target = cropGray(reference, rect),
        x = cropGray(a, rect),
        y = cropGray(b, rect);
      return {
        id,
        rect,
        before: compareLettering(target.gray, x.gray, x.width, x.height),
        after: compareLettering(target.gray, y.gray, y.width, y.height),
      };
    });
    tiers.push({
      tier,
      beforeHash: old.images[tier].sha256,
      afterHash: card.images[tier].sha256,
      regions,
    });
  }
  pairs.push({
    id: card.id,
    name: card.name,
    number: card.collectorNumber,
    inputHash: card.inputHash,
    referenceHash: card.images.reference.sha256,
    color: card.face.colors.join('') || 'artifact',
    letteringReviewed: !!selection,
    statsWarning,
    tiers,
  });
  if (pairs.length % 25 === 0) console.log(`Measured ${pairs.length}/${check.changed}`);
}
assert.equal(pairs.length, check.changed);
const summary = ['all-diagnostic', 'reviewed-components'].flatMap((scope) =>
  ['inspect', 'table'].flatMap((tier) =>
    ['title', 'footer', 'stats'].map((region) => {
      const rows = pairs
        .filter((p) => scope === 'all-diagnostic' || p.letteringReviewed)
        .map((p) => ({
          ...p,
          score: p.tiers.find((t) => t.tier === tier).regions.find((r) => r.id === region),
        }))
        .filter((p) => p.score);
      const regressions = rows
        .filter((p) => p.score.after.edgeF1 < p.score.before.edgeF1 - 0.02)
        .map((p) => ({
          id: p.id,
          name: p.name,
          number: p.number,
          delta: p.score.after.edgeF1 - p.score.before.edgeF1,
        }));
      return {
        scope,
        tier,
        region,
        count: rows.length,
        beforeF1: median(rows.map((p) => p.score.before.edgeF1)),
        afterF1: median(rows.map((p) => p.score.after.edgeF1)),
        beforeCensus: median(
          rows.map((p) => p.score.before.censusSimilarity).filter((v) => v !== null),
        ),
        afterCensus: median(
          rows.map((p) => p.score.after.censusSimilarity).filter((v) => v !== null),
        ),
        gains: rows.filter((p) => p.score.after.edgeF1 > p.score.before.edgeF1 + 0.02).length,
        regressions,
        censusRegressions: rows
          .filter((p) => p.score.after.censusSimilarity < p.score.before.censusSimilarity - 0.02)
          .map((p) => p.name),
      };
    }),
  ),
);
const result = {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  baselineRendererHash: before.rendererHash,
  measurementSourceHash: hash(await readFile(new URL(import.meta.url))),
  metricHash: await sourceHash(
    new URL('.', import.meta.url),
    /^(?:lettering-metrics|metrics|edges|pixels)\.mjs$/,
  ),
  captureCheck: check,
  seconds: (performance.now() - started) / 1000,
  scope:
    'Node PNG decode, normalization and paired lettering metrics for all 281 changed cards at both tiers. No browser, per-scan alignment, GPU timing or rendering in this measurement.',
  limitations: [
    'Only the 19 development/reserved title and credit fields and their 10 matching stats have been visually checked in this study. Other scores are corpus diagnostics, not certified printing accuracy.',
    'Vesuvan Doppelganger stats are excluded because the cached input disagrees with the scan. Other undiscovered printing-field differences may remain.',
    'The fixed windows include frame texture. Paired edge and census measures need direct glyph-shape review; neither alone certifies the correct fill treatment.',
  ],
  summary,
  pairs,
};
await writeJson(path.join(fixture, 'lettering-measurement.json'), result);
console.log(JSON.stringify({ seconds: result.seconds, summary }, null, 2));
