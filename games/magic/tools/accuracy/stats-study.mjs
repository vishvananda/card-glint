import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fixtureRoot, outputRoot, readJson, writeJson, hash } from './common.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { median } from './metrics.mjs';
import { componentOffset } from './component-offset.mjs';
import { statsPage } from './stats-page.mjs';

const start = performance.now();
const plan = await readJson(path.join(fixtureRoot, '4ed/stats-plan.json'));
const sets = [];
const rect = [388, 599, 85, 50];
const summarize = (rows) =>
  Object.fromEntries(
    ['inspect', 'table'].map((tier) => {
      const values = rows.filter((c) => !c.alignmentUncertain && c.scores[tier]);
      return [
        tier,
        {
          count: values.length,
          before: median(values.map((c) => c.scores[tier][0])),
          after: median(values.map((c) => c.scores[tier][1])),
          improved: values.filter((c) => c.scores[tier][1] - c.scores[tier][0] > 0.02).length,
          regressed: values.filter((c) => c.scores[tier][0] - c.scores[tier][1] > 0.02).length,
        },
      ];
    }),
  );

for (const set of plan.policy.sets) {
  const baseline = set === '4ed' ? plan.baselineRun : 'stats-before';
  const dir = path.join(outputRoot, set, plan.run),
    previous = path.join(outputRoot, set, baseline);
  const before = await readJson(path.join(previous, 'metrics.json')),
    after = await readJson(path.join(dir, 'metrics.json'));
  assert.ok(before.complete && after.complete, 'Require complete paired captures');
  assert.equal(after.rendererHash, plan.frozenRendererHash);
  assert.equal(before.rendererHash, plan.baselineRendererHash);
  for (const key of [
    'referenceIdentity',
    'alignmentHash',
    'metricSource',
    'browser',
    'fontStylesheetHash',
  ])
    assert.equal(before[key], after[key], key);
  assert.equal(before.results.length, after.results.length);
  const oldById = new Map(before.results.map((c) => [c.id, c]));
  const results = [],
    failures = [];
  let outsideStatsIdentical = 0,
    unchangedNonstats = 0,
    verifiedFiles = 0;
  for (const card of after.results) {
    const old = oldById.get(card.id);
    assert.ok(old, `Missing baseline: ${card.name}`);
    if (card.issue || old.issue) {
      failures.push({ id: card.id, name: card.name, before: old.issue, after: card.issue });
      continue;
    }
    assert.equal(card.inputHash, old.inputHash, card.name);
    assert.deepEqual(card.layout, old.layout, card.name);
    assert.equal(card.images.reference.sha256, old.images.reference.sha256);
    assert.deepEqual(card.alignment.transform, old.alignment.transform);
    for (const [root, entry] of [
      [previous, old],
      [dir, card],
    ])
      for (const tier of ['reference', 'inspect', 'table']) {
        assert.equal(
          hash(await readFile(path.join(root, entry.images[tier].file))),
          entry.images[tier].sha256,
        );
        verifiedFiles++;
      }
    const hasStats = card.face.power != null && card.face.toughness != null;
    for (const tier of ['inspect', 'table']) {
      if (!hasStats) assert.equal(old.images[tier].sha256, card.images[tier].sha256, card.name);
      if (old.images[tier].sha256 === card.images[tier].sha256) continue;
      const a = await readPng(path.join(previous, old.images[tier].file)),
        b = await readPng(path.join(dir, card.images[tier].file));
      assert.equal(a.width, b.width);
      assert.equal(a.height, b.height);
      const scale = a.width / 488;
      const [left, top, right, bottom] = [
        Math.floor(rect[0] * scale),
        Math.floor(rect[1] * scale),
        Math.ceil((rect[0] + rect[2]) * scale),
        Math.ceil((rect[1] + rect[3]) * scale),
      ];
      for (let y = 0; y < a.height; y++) {
        const start = y * a.width * 4,
          end = start + a.width * 4;
        if (y < top || y >= bottom)
          assert.ok(
            a.data.subarray(start, end).equals(b.data.subarray(start, end)),
            `Changed outside stats: ${card.name} ${tier} row ${y}`,
          );
        else {
          assert.ok(
            a.data
              .subarray(start, start + left * 4)
              .equals(b.data.subarray(start, start + left * 4)),
            `Changed left of stats: ${card.name}`,
          );
          assert.ok(
            a.data.subarray(start + right * 4, end).equals(b.data.subarray(start + right * 4, end)),
            `Changed right of stats: ${card.name}`,
          );
        }
      }
    }
    outsideStatsIdentical++;
    if (!hasStats) unchangedNonstats++;
    const scores = Object.fromEntries(
      ['inspect', 'table'].map((tier) => [
        tier,
        hasStats
          ? [old, card].map(
              (c) => c.comparisons[tier].regions.find((r) => r.id === 'stats')?.edgeF1?.[1],
            )
          : null,
      ]),
    );
    if (hasStats) assert.ok(Object.values(scores).every((v) => v.every(Number.isFinite)));
    let diagnostic = null;
    if (hasStats) {
      const crops = [];
      for (const [root, c, tier] of [
        [dir, card, 'reference'],
        [previous, old, 'inspect'],
        [dir, card, 'inspect'],
      ]) {
        const image = normalize(
          await readPng(path.join(root, c.images[tier].file)),
          tier === 'reference' ? card.alignment.transform : {},
        );
        crops.push(cropGray(image, [393, 607, 67, 33]));
      }
      diagnostic = crops.slice(1).map((c) => componentOffset(crops[0].gray, c.gray, 67, 33, true));
    }
    results.push({
      id: card.id,
      name: card.name,
      collectorNumber: card.collectorNumber,
      cohort: card.cohort,
      source: card.source,
      contentStatus: card.contentStatus,
      alignmentUncertain: old.alignment.uncertain || card.alignment.uncertain,
      scores,
      diagnostic,
      images: {
        scan: path.join(dir, `cards/${card.id}.aligned.png`),
        before: path.join(previous, old.images.inspect.file),
        after: path.join(dir, card.images.inspect.file),
      },
    });
  }
  const stats = results.filter((c) => c.scores.inspect);
  const report = {
    set,
    run: plan.run,
    baseline,
    rendererHashes: [before.rendererHash, after.rendererHash],
    referenceIdentity: after.referenceIdentity,
    alignmentHash: after.alignmentHash,
    metricSource: after.metricSource,
    attempted: after.results.length,
    eligible: after.eligibleCount,
    failed: failures.length,
    failures,
    statsCards: stats.length,
    alignmentExcluded: stats.filter((c) => c.alignmentUncertain).length,
    allAlignmentWarnings: results.filter((c) => c.alignmentUncertain).length,
    outsideStatsIdentical,
    unchangedNonstats,
    verifiedFiles,
    summary: Object.fromEntries(
      ['calibration', 'held-out', 'corpus', 'all'].map((cohort) => [
        cohort,
        summarize(stats.filter((c) => cohort === 'all' || c.cohort === cohort)),
      ]),
    ),
    comparisonSeconds: after.elapsedSeconds,
    comparisonCacheHits: after.cacheHits,
    results,
  };
  await writeJson(path.join(dir, 'stats.json'), report);
  sets.push(report);
  console.log(
    JSON.stringify(
      {
        set,
        attempted: report.attempted,
        failed: report.failed,
        statsCards: report.statsCards,
        alignmentExcluded: report.alignmentExcluded,
        summary: report.summary,
      },
      null,
      2,
    ),
  );
}
const regressionParity = [];
for (const set of ['mir', 'tmp', 'm21']) {
  const aRoot = path.join(outputRoot, set, 'stats-parity'),
    bRoot = path.join(outputRoot, set, 'fourth-details-parity');
  const a = await readJson(path.join(aRoot, 'capture.json')),
    b = await readJson(path.join(bRoot, 'capture.json'));
  assert.equal(a.rendererHash, plan.frozenRendererHash);
  assert.equal(a.results.length, b.results.length);
  for (const card of a.results) {
    const old = b.results.find((c) => c.id === card.id);
    assert.ok(old);
    assert.equal(card.issue, null);
    assert.equal(card.inputHash, old.inputHash);
    for (const tier of ['inspect', 'table']) {
      assert.equal(card.images[tier].sha256, old.images[tier].sha256);
      for (const [root, c] of [
        [aRoot, card],
        [bRoot, old],
      ])
        assert.equal(
          hash(await readFile(path.join(root, c.images[tier].file))),
          c.images[tier].sha256,
        );
    }
  }
  regressionParity.push({ set, cards: a.results.length, tiers: 2, identical: true });
}
const measurement = {
  schemaVersion: 1,
  study: 'fourth-stats',
  planHash: hash(JSON.stringify(plan)),
  policy: plan.policy,
  rendererHashes: [plan.baselineRendererHash, plan.frozenRendererHash],
  note: 'Fixed-region F1, not percent accuracy. Shared production displacement; no per-card alignment. Fourth Edition is development, Fifth Edition has reserved transfer names. Whole-set corpus results remain exploratory.',
  parityRegion: rect,
  regressionParity,
  seconds: (performance.now() - start) / 1000,
  timingScope:
    'Node image verification, pixel parity and component searches, not GPU completion. Chromium is used only for production capture.',
  sets: sets.map(({ results, ...summary }) => ({
    ...summary,
    statsResults: results
      .filter((c) => c.scores.inspect)
      .map(({ images, diagnostic, ...r }) => ({ ...r, offset: diagnostic[1] })),
  })),
};
await writeJson(path.join(fixtureRoot, '5ed/stats-measurement.json'), measurement);
await statsPage(sets, path.join(outputRoot, '5ed', plan.run));
