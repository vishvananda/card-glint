import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  cacheRoot,
  fixtureRoot,
  outputRoot,
  readJson,
  writeJson,
  hash,
  objectFile,
} from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { median } from './metrics.mjs';

const snapshot = await readJson(`${cacheRoot}/rollout/old-symbol-survey.json`),
  plan = await readJson(`${fixtureRoot}/old-symbol-treatment-plan.json`),
  base = `${outputRoot}/old-symbol-survey`,
  before = await readJson(`${base}/baseline/capture.json`),
  after = await readJson(`${base}/after/capture.json`),
  rect = [380, 367, 74, 44],
  rows = [];
assert.equal(before.rendererHash, plan.rendererHash);
assert.equal(before.planHash, after.planHash);
assert.equal(before.rows.length, snapshot.entries.length);
assert.equal(after.rows.length, snapshot.entries.length);
for (const e of snapshot.entries) {
  const b = before.rows.find((r) => r.id === e.id),
    a = after.rows.find((r) => r.id === e.id);
  assert.deepEqual(a.face, b.face);
  const ref = await cachedGrayRegion(objectFile(e.reference), e.reference.sha256, rect),
    scores = {};
  for (const tier of ['inspect', 'table']) {
    const images = [],
      gray = [],
      compared = [];
    for (const [stage, row] of [
      ['baseline', b],
      ['after', a],
    ]) {
      const asset = row.images[tier],
        file = `${base}/${stage}/${asset.file}`,
        bytes = await readFile(file);
      assert.equal(hash(bytes), asset.sha256);
      images.push(PNG.sync.read(bytes));
      const crop = await cachedGrayRegion(file, asset.sha256, rect);
      gray.push(crop);
      compared.push({
        ...compareLettering(ref.gray, crop.gray, rect[2], rect[3]),
        contrast: letteringContrast(ref.gray, crop.gray, rect[2], rect[3]),
      });
    }
    const [oldImage, newImage] = images;
    assert.equal(oldImage.width, newImage.width);
    assert.equal(oldImage.height, newImage.height);
    let changed = 0,
      outsideSymbol = 0;
    for (let i = 0; i < oldImage.data.length; i += 4) {
      if (oldImage.data.subarray(i, i + 4).equals(newImage.data.subarray(i, i + 4))) continue;
      changed++;
      const x = (((i / 4) % oldImage.width) * 488) / oldImage.width,
        y = (Math.floor(i / 4 / oldImage.width) * 680) / oldImage.height;
      if (x < rect[0] || x >= rect[0] + rect[2] || y < rect[1] || y >= rect[1] + rect[3])
        outsideSymbol++;
    }
    assert.equal(outsideSymbol, 0, `Non-symbol pixels changed: ${e.card.name} ${tier}`);
    if (['exo', 'ced', 'sum', 'itp'].includes(e.card.set)) assert.equal(changed, 0);
    scores[tier] = { changed, outsideSymbol, before: compared[0], after: compared[1] };
  }
  const review = [];
  if (e.card.set === 'chr') review.push('original-expansion-identity-resolved-shape-unvalidated');
  for (const tier of ['inspect', 'table']) {
    if (scores[tier].after.edgeF1 - scores[tier].before.edgeF1 < -0.02)
      review.push(`${tier}:edge-regression`);
    if (scores[tier].after.censusSimilarity - scores[tier].before.censusSimilarity < -0.02)
      review.push(`${tier}:census-regression`);
  }
  rows.push({
    id: e.id,
    name: e.card.name,
    set: e.card.set,
    number: e.card.collector_number,
    rarity: e.card.rarity,
    referenceHash: e.reference.sha256,
    scores,
    review,
  });
}
const summary = {};
for (const set of [...new Set(rows.map((r) => r.set))]) {
  const group = rows.filter((r) => r.set === set);
  summary[set] = {
    cards: group.length,
    changed: group.filter((r) => r.scores.inspect.changed).length,
    review: group.filter((r) => r.review.length).map((r) => r.id),
    inspect: Object.fromEntries(
      ['before', 'after'].map((stage) => [
        stage,
        Object.fromEntries(
          ['edgeF1', 'contrast', 'censusSimilarity'].map((metric) => [
            metric,
            median(group.map((r) => r.scores.inspect[stage][metric]).filter((v) => v != null)),
          ]),
        ),
      ]),
    ),
  };
}
await writeJson(`${fixtureRoot}/old-symbol-treatment-measurement.json`, {
  schemaVersion: 1,
  scope:
    '85-card first survey. Historical monochrome ink, set-dependent outlines and Chronicles identities; placement and sizing policy unchanged. Raw fixed symbol windows, no fitted per-scan transforms. Text near the region and asset contours can contaminate structural scores; preserve regressions and unvalidated glyph shape/size. Exodus and no-symbol sets are unchanged controls. This is not all-set or alignment certification.',
  rect,
  baselineRendererHash: before.rendererHash,
  rendererHash: after.rendererHash,
  surveyPlanHash: before.planHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  summary,
  rows,
});
console.log(summary);
