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

const snapshot = await readJson(`${cacheRoot}/rollout/old-symbol-material.json`),
  plan = await readJson(`${fixtureRoot}/old-symbol-material-plan.json`),
  base = `${outputRoot}/old-symbol-material`,
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/after/capture.json`),
  rect = [350, 367, 104, 47],
  rows = [];
assert.equal(before.rendererHash, plan.baselineRendererHash);
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
      ['before', b],
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
    if (e.cohort === 'control')
      assert.equal(changed, 0, `${e.card.name}: custom or unrelated control changed`);
    else if (e.card.set !== 'chr') assert.ok(changed > 0, `${e.card.set} backing failed to load`);
    scores[tier] = { changed, outsideSymbol, before: compared[0], after: compared[1] };
  }
  const review = [];
  if (e.card.set === 'chr') review.push('chronicles-transfer-shape-unvalidated');
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
    cohort: e.cohort,
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
await writeJson(`${fixtureRoot}/old-symbol-material-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Opaque white interiors only, with original geometry. Sixty frozen printings include fifteen explicit/unrelated controls and five Chronicles transfers. Raw-window grayscale edge/Census diagnostics remain affected by existing size/position errors; retain every regression. No alignment certification or per-scan fitting. Browser-free cached PNG audit, both raster tiers. Full-card byte comparison protects everything outside the symbol region.',
  rect,
  baselineRendererHash: before.rendererHash,
  rendererHash: after.rendererHash,
  surveyPlanHash: before.planHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  summary,
  rows,
});
console.log(summary);
