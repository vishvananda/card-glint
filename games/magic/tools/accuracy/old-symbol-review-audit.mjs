import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, objectFile, readJson, writeJson, hash } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
import { oldSymbolRegions } from './old-symbol-regions.mjs';

const base = `${outputRoot}/old-symbol-material`,
  before = await readJson(`${base}/geometry/capture.json`),
  after = await readJson(`${base}/review/capture.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  rows = [];
assert.equal(before.planHash, after.planHash);
assert.equal(before.rows.length, after.rows.length);
for (const a of after.rows) {
  const b = before.rows.find((r) => r.id === a.id),
    changedSet = ['arn', 'leg'].includes(a.set) && a.cohort !== 'control',
    rect = oldSymbolRegions[a.set] ?? [350, 367, 104, 47],
    transform = registration.groups[a.set]?.transform ?? {},
    ref = await cachedGrayRegion(
      objectFile({ sha256: a.referenceHash }),
      a.referenceHash,
      rect,
      transform,
    ),
    raw = await cachedGrayRegion(objectFile({ sha256: a.referenceHash }), a.referenceHash, rect),
    scores = {};
  assert.deepEqual(a.face, b.face);
  assert.deepEqual(a.layout, b.layout);
  for (const tier of ['inspect', 'table']) {
    const images = [],
      crops = [],
      metrics = {};
    for (const [stage, row] of [
      ['geometry', b],
      ['review', a],
    ]) {
      const asset = row.images[tier],
        file = `${base}/${stage}/${asset.file}`,
        bytes = await readFile(file);
      assert.equal(hash(bytes), asset.sha256);
      images.push(PNG.sync.read(bytes));
      const crop = await cachedGrayRegion(file, asset.sha256, rect);
      crops.push(crop);
      metrics[stage] = {
        raw: compareLettering(raw.gray, crop.gray, rect[2], rect[3]),
        registered: compareLettering(ref.gray, crop.gray, rect[2], rect[3]),
      };
    }
    const [old, current] = images;
    assert.equal(old.width, current.width);
    assert.equal(old.height, current.height);
    let changed = 0,
      outside = 0;
    for (let i = 0; i < old.data.length; i += 4) {
      if (old.data.subarray(i, i + 4).equals(current.data.subarray(i, i + 4))) continue;
      changed++;
      const x = (((i / 4) % old.width) * 488) / old.width,
        y = (Math.floor(i / 4 / old.width) * 680) / old.height;
      if (x < rect[0] || x >= rect[0] + rect[2] || y < rect[1] || y >= rect[1] + rect[3]) outside++;
    }
    assert.equal(outside, 0, `${a.name}: pixels outside symbol changed`);
    if (changedSet) assert.ok(changed > 0, `${a.name}: missing correction`);
    else assert.equal(changed, 0, `${a.name}: control changed`);
    // Gray tone is a separate diagnostic from shape: use the formerly opaque
    // white blade interior, avoiding antialiased contours. The table tier has
    // no opaque blade interior, so only inspect supports this tone diagnostic.
    // No per-card fitting.
    let tone = null;
    if (a.set === 'arn' && changedSet && tier === 'inspect') {
      const indices = [...crops[0].gray.keys()].filter(
          (i) => crops[0].gray[i] > 245 && crops[0].gray[i] - crops[1].gray[i] > 40,
        ),
        error = (crop) =>
          indices.reduce((sum, i) => sum + Math.abs(crop.gray[i] - raw.gray[i]), 0) /
          indices.length;
      assert.ok(indices.length > 0);
      tone = {
        pixels: indices.length,
        referenceMedian: median(indices.map((i) => raw.gray[i])),
        beforeMeanAbsoluteError: error(crops[0]),
        afterMeanAbsoluteError: error(crops[1]),
      };
    }
    scores[tier] = { changed, outside, tone, ...metrics };
  }
  const review = [];
  if (changedSet && !registration.groups[a.set].accepted)
    review.push('frame-registration-unvalidated');
  for (const tier of ['inspect', 'table']) {
    if (scores[tier].review.registered.edgeF1 < scores[tier].geometry.registered.edgeF1 - 0.02)
      review.push(`${tier}:edge-regression`);
    if (
      scores[tier].review.registered.censusSimilarity <
      scores[tier].geometry.registered.censusSimilarity - 0.02
    )
      review.push(`${tier}:census-regression`);
  }
  rows.push({ id: a.id, set: a.set, name: a.name, cohort: a.cohort, changedSet, scores, review });
}
const summary = {};
for (const set of ['arn', 'leg']) {
  const group = rows.filter((r) => r.set === set && r.changedSet);
  summary[set] = Object.fromEntries(
    ['calibration', 'held-out'].map((cohort) => {
      const cards = group.filter((r) => r.cohort === cohort);
      return [
        cohort,
        {
          cards: cards.length,
          tiers: Object.fromEntries(
            ['inspect', 'table'].map((tier) => [
              tier,
              {
                beforeEdgeF1: median(cards.map((r) => r.scores[tier].geometry.registered.edgeF1)),
                afterEdgeF1: median(cards.map((r) => r.scores[tier].review.registered.edgeF1)),
                toneBefore: median(
                  cards
                    .map((r) => r.scores[tier].tone?.beforeMeanAbsoluteError)
                    .filter((v) => v != null),
                ),
                toneAfter: median(
                  cards
                    .map((r) => r.scores[tier].tone?.afterMeanAbsoluteError)
                    .filter((v) => v != null),
                ),
              },
            ]),
          ),
        },
      ];
    }),
  );
}
const report = {
  schemaVersion: 1,
  scope:
    'User visual review: move the shared Legends symbol up one canonical pixel; gray Arabian Nights blade at brightness 0.7. Same sixty frozen cards, same set registration, same geometry and original masks otherwise. All inputs have previously been reviewed: cohort names describe original selection, not fresh held-out validation. Separate blade-tone diagnostic uses opaque interior pixels; ARN registration remains uncertain. Cached PNG comparison without Chromium; all non-symbol pixels and text layouts protected at both tiers.',
  baselineRendererHash: before.rendererHash,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  registrationHash: hash(JSON.stringify(registration)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  summary,
  unchangedControls: rows.filter((r) => !r.changedSet).length,
  rows,
};
await writeJson(`${fixtureRoot}/old-symbol-review-measurement.json`, report);
console.log(
  JSON.stringify(
    {
      summary,
      unchangedControls: report.unchangedControls,
      flags: rows
        .filter((r) => r.changedSet && r.review.length)
        .map((r) => ({ name: r.name, review: r.review })),
    },
    null,
    2,
  ),
);
