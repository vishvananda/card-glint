import assert from 'node:assert/strict';
import path from 'node:path';
import { fixtureRoot, hash, options, outputRoot, readJson, writeJson } from './common.mjs';
import { median, quantile } from './metrics.mjs';
import { summarize } from './summary.mjs';

// Absolute cross-set baseline, distinct from transfer.mjs's paired before/after test.
const opts = options();
const plan = await readJson(path.join(fixtureRoot, opts.set, 'transfer-plan.json'));
assert.equal(plan.mode, 'baseline-survey', 'This command needs a frozen baseline-survey plan');
for (const value of [plan.sourceSet, plan.sourceRun])
  assert.match(value, /^[a-z0-9][a-z0-9_-]{0,50}$/);
const source = await readJson(
  path.join(outputRoot, plan.sourceSet, plan.sourceRun, 'metrics.json'),
);
const target = await readJson(path.join(outputRoot, opts.set, opts.run, 'metrics.json'));
assert.equal(plan.set, opts.set);
assert.equal(source.set, plan.sourceSet);
assert.equal(target.set, opts.set);
assert.equal(source.rendererHash, plan.rendererHash, 'The baseline renderer is frozen');
for (const key of ['rendererHash', 'fontStylesheetHash', 'browser', 'metricSource']) {
  assert.ok(source[key], `Missing provenance: ${key}`);
  assert.equal(target[key], source[key], `Cross-set mismatch: ${key}`);
}
assert.equal(target.alignmentProfile.transferredFrom?.set, source.set);
assert.equal(target.alignmentProfile.transferredFrom?.profileHash, source.alignmentHash);
assert.deepEqual(target.alignmentProfile.frameFamilies, source.alignmentProfile.frameFamilies);
for (const report of [source, target]) {
  assert.ok(report.complete, `Incomplete ${report.set} capture`);
  assert.equal(
    report.results.length,
    report.eligibleCount,
    'All eligible printings must be represented',
  );
}
const distribution = (values) => ({
  count: values.length,
  median: median(values),
  p90: quantile(values, 0.9),
});
const describe = (report) => {
  const heldOut = report.results.filter(
    (c) => c.cohort === 'held-out' && c.contentStatus === 'scan-reviewed',
  );
  const confident = heldOut.filter((c) => !c.issue && !c.alignment.uncertain);
  return {
    set: report.set,
    run: report.run,
    referenceIdentity: report.referenceIdentity,
    alignmentHash: report.alignmentHash,
    annotationHash: report.annotationHash,
    coverage: report.summary,
    heldOutReviewed: {
      selected: heldOut.length,
      excludedNames: heldOut.filter((c) => !confident.includes(c)).map((c) => c.name),
      summary: summarize(confident),
    },
    alignmentResidualPx: distribution(
      report.results.flatMap((c) =>
        c.alignment?.medianResidualPx != null ? [c.alignment.medianResidualPx] : [],
      ),
    ),
    comparisonSeconds: report.elapsedSeconds,
    cacheHits: report.cacheHits,
    reviewedCards: report.results
      .filter((c) => c.contentStatus === 'scan-reviewed')
      .map((c) => ({
        id: c.id,
        name: c.name,
        cohort: c.cohort,
        alignmentUncertain: c.alignment?.uncertain,
        body: Object.fromEntries(
          ['inspect', 'table'].map((tier) => [
            tier,
            c.comparisons?.[tier].regions.find((r) => r.id === 'body')?.edgeF1?.[1] ?? null,
          ]),
        ),
      })),
  };
};
const assets = new Map();
for (const report of [source, target])
  for (const asset of report.assets) {
    const key = `${asset.url}:${asset.role}`;
    if (!assets.has(key)) assets.set(key, { url: asset.url, role: asset.role, sets: {} });
    assets.get(key).sets[report.set] = {
      status: asset.status,
      cardCount: asset.cardCount,
      confidentCount: asset.confidentCount,
      medianEdgeF1: asset.medianEdgeF1,
      examples: asset.examples.slice(0, 3),
    };
  }
const output = {
  schemaVersion: 1,
  mode: plan.mode,
  planHash: hash(JSON.stringify(plan)),
  rendererHash: source.rendererHash,
  fontStylesheetHash: source.fontStylesheetHash,
  browser: source.browser,
  metricSource: source.metricSource,
  note: 'Absolute structural scores on different cards, not paired improvements or accuracy percentages. Reviewed held-out summaries exclude alignment flags; full coverage retains every eligible printing. Legacy layout/overflow is unmeasured. No per-card or target-set fitting.',
  sets: [describe(source), describe(target)],
  assets: [...assets.values()].map((asset) => ({
    ...asset,
    repeatedFlag:
      Object.values(asset.sets).length === 2 &&
      Object.values(asset.sets).every((a) => a.status === 'review-asset-or-placement'),
  })),
};
await writeJson(path.join(outputRoot, opts.set, opts.run, 'survey.json'), output);
console.log(
  JSON.stringify(
    output.sets.map((s) => ({
      set: s.set,
      measured: s.coverage.measured,
      reviewedHeldOut: s.heldOutReviewed.summary.tiers.inspect.reviewedBody,
      alignment: s.alignmentResidualPx,
      uncertain: s.coverage.alignmentUncertain,
    })),
    null,
    2,
  ),
);
