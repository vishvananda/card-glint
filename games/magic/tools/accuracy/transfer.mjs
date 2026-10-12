import path from 'node:path';
import { options, outputRoot, studyFile, readJson, writeJson, hash } from './common.mjs';
import { median, quantile } from './metrics.mjs';

const opts = options();
const plan = await readJson(studyFile(opts, 'transfer-plan'));
const sourceRoot = path.join(outputRoot, plan.sourceSet);
const targetRoot = path.join(outputRoot, opts.set);
const load = async (root, run) => ({
  structural: await readJson(path.join(root, run, 'metrics.json')),
  typography: await readJson(path.join(root, run, 'typography.json')),
});
const sourceBefore = await load(sourceRoot, plan.sourceBaselineRun ?? 'current');
const sourceAfter = await load(sourceRoot, plan.sourceRun ?? 'typography');
const targetBefore = await load(targetRoot, opts.baseline);
const targetAfter = await load(targetRoot, opts.run);
if (plan.frozenRendererHash && targetAfter.structural.rendererHash !== plan.frozenRendererHash)
  throw Error('Renderer changed after the typography policy freeze');
if (plan.baselineRendererHash && targetBefore.structural.rendererHash !== plan.baselineRendererHash)
  throw Error('Baseline renderer differs from the study plan');
for (const key of ['rendererHash', 'fontStylesheetHash', 'browser', 'metricSource']) {
  if (
    sourceBefore.structural[key] !== targetBefore.structural[key] ||
    sourceAfter.structural[key] !== targetAfter.structural[key]
  )
    throw Error(`Transfer changes ${key} between sets`);
}
for (const [before, after] of [
  [sourceBefore, sourceAfter],
  [targetBefore, targetAfter],
]) {
  for (const key of ['referenceIdentity', 'alignmentHash', 'browser', 'metricSource'])
    if (before.structural[key] !== after.structural[key])
      throw Error(`Before/after changes ${key}`);
  for (const key of ['fixtureHash', 'metricSource'])
    if (before.typography[key] !== after.typography[key]) throw Error(`Typography changes ${key}`);
}
const sourceProfile = sourceAfter.structural.alignmentProfile;
const targetProfile = targetAfter.structural.alignmentProfile;
if (
  targetProfile.transferredFrom?.profileHash !== hash(JSON.stringify(sourceProfile)) ||
  JSON.stringify(targetProfile.frameFamilies) !== JSON.stringify(sourceProfile.frameFamilies)
)
  throw Error('Target alignment does not preserve the frozen source profile');

/** Paired card bootstrap. Describes this small stratified cohort, not all Magic cards. */
function interval(values) {
  if (!values.length) return null;
  let state = 20202021;
  const samples = Array.from({ length: 2000 }, () =>
    median(
      Array.from({ length: values.length }, () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return values[Math.floor((state / 4294967296) * values.length)];
      }),
    ),
  );
  return [quantile(samples, 0.025), quantile(samples, 0.975)];
}
function evaluate(before, after, cohort) {
  const old = new Map(before.structural.results.map((c) => [c.id, c]));
  const oldType = new Map(before.typography.results.map((c) => [c.id, c]));
  const newType = new Map(after.typography.results.map((c) => [c.id, c]));
  const selected = after.structural.results.filter((c) => c.cohort === cohort);
  const excluded = [],
    pairs = [];
  for (const card of selected) {
    const previous = old.get(card.id),
      a = oldType.get(card.id),
      b = newType.get(card.id);
    const reason = !previous
      ? 'no-baseline'
      : card.issue || previous.issue
        ? 'failed'
        : card.inputHash !== previous.inputHash
          ? 'changed-input'
          : card.contentStatus !== 'scan-reviewed' || previous.contentStatus !== 'scan-reviewed'
            ? 'unreviewed-text'
            : card.alignment.uncertain || previous.alignment.uncertain
              ? 'alignment-uncertain'
              : a?.status !== 'measured' || b?.status !== 'measured'
                ? 'unmeasured-line-geometry'
                : null;
    if (reason) {
      excluded.push({ id: card.id, name: card.name, reason });
      continue;
    }
    const body = (c, tier) => c.comparisons[tier].regions.find((r) => r.id === 'body').edgeF1[1];
    pairs.push({
      id: card.id,
      name: card.name,
      inspect: [body(previous, 'inspect'), body(card, 'inspect')],
      table: [body(previous, 'table'), body(card, 'table')],
      softBreakF1: [a.softBreakF1, b.softBreakF1],
      exactWrapping: [a.exactWrapping, b.exactWrapping],
      blockEdgeMae: [a.blockEdgeMae, b.blockEdgeMae],
    });
  }
  const summarize = (key) => {
    const values = pairs.map((p) => p[key]);
    const deltas = values.map(([a, b]) => b - a);
    return {
      beforeMedian: median(values.map((p) => p[0])),
      afterMedian: median(values.map((p) => p[1])),
      beforeMean: values.length ? values.reduce((sum, p) => sum + p[0], 0) / values.length : null,
      afterMean: values.length ? values.reduce((sum, p) => sum + p[1], 0) / values.length : null,
      medianPairedDelta: median(deltas),
      pairedDeltaBootstrap95: interval(deltas),
      improved:
        key === 'blockEdgeMae'
          ? deltas.filter((d) => d < -2).length
          : deltas.filter((d) => d > 0.02).length,
      regressed:
        key === 'blockEdgeMae'
          ? deltas.filter((d) => d > 2).length
          : deltas.filter((d) => d < -0.02).length,
    };
  };
  return {
    attempted: selected.length,
    paired: pairs.length,
    excluded,
    inspectBody: summarize('inspect'),
    tableBody: summarize('table'),
    softBreakF1: summarize('softBreakF1'),
    blockEdgeMae: summarize('blockEdgeMae'),
    exactWrapping: [
      pairs.filter((p) => p.exactWrapping[0]).length,
      pairs.filter((p) => p.exactWrapping[1]).length,
    ],
    cards: pairs,
  };
}
const coverage = (report) => ({
  eligible: report.eligibleCount,
  measured: report.summary.measured,
  failed: report.summary.failed,
  reviewed: report.summary.scanReviewed,
  unverified: report.summary.oracleUnverified,
  alignmentFlags: report.summary.alignmentUncertain,
  overflow: report.summary.clipped,
  diagnosticMedianTextF1: report.summary.tiers.inspect.text.median,
  frameFamilies: Object.fromEntries(
    [...new Set(report.results.map((c) => c.alignment?.family))].filter(Boolean).map((family) => {
      const cards = report.results.filter((c) => c.alignment?.family === family);
      return [
        family,
        {
          count: cards.length,
          uncertain: cards.filter((c) => c.alignment.uncertain).length,
          medianLandmarkResidual: median(
            cards.map((c) => c.alignment.medianResidualPx).filter((v) => v != null),
          ),
        },
      ];
    }),
  ),
});
const result = {
  schemaVersion: 1,
  sourceSet: plan.sourceSet,
  targetSet: opts.set,
  plan,
  frozenRendererHash: targetAfter.structural.rendererHash,
  baselineRendererHash: targetBefore.structural.rendererHash,
  browser: targetAfter.structural.browser,
  metricSource: targetAfter.structural.metricSource,
  note: 'Same before/after renderers, fonts, inputs, metrics and shared alignment transforms. Reviewed, confidently aligned holdouts only. F1 is structural similarity, not accuracy percentage. Bootstrap intervals describe the selected cards; ±0.02 F1 and 2px geometry are review thresholds, not acceptance gates.',
  sourceHoldout: evaluate(sourceBefore, sourceAfter, 'held-out'),
  targetHoldout: evaluate(targetBefore, targetAfter, 'held-out'),
  coverage: {
    [plan.sourceSet]: coverage(sourceAfter.structural),
    [opts.set]: coverage(targetAfter.structural),
  },
  assetReview: targetAfter.structural.assets.filter(
    (a) => a.status === 'review-asset-or-placement',
  ),
};
await writeJson(path.join(targetRoot, opts.run, 'transfer.json'), result);
console.log(
  JSON.stringify(
    {
      source: { ...result.sourceHoldout, cards: undefined },
      target: { ...result.targetHoldout, cards: undefined },
      coverage: result.coverage,
    },
    null,
    2,
  ),
);
