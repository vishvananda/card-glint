import path from 'node:path';
import { options, outputRoot, readJson, writeJson } from './common.mjs';
import { median } from './metrics.mjs';

const opts = options(),
  setRoot = path.join(outputRoot, opts.set);
const before = await readJson(path.join(setRoot, opts.baseline, 'metrics.json'));
const after = await readJson(path.join(setRoot, opts.run, 'metrics.json'));
for (const key of ['metricSource', 'referenceIdentity', 'alignmentHash', 'browser'])
  if (before[key] !== after[key]) throw Error(`Cannot pair runs with different ${key}`);
const previous = new Map(before.results.map((r) => [r.id, r]));
const paired = [],
  excluded = [];
for (const card of after.results) {
  const old = previous.get(card.id);
  if (!old || card.issue || old.issue || card.inputHash !== old.inputHash) {
    excluded.push({
      id: card.id,
      name: card.name,
      reason: !old ? 'no-baseline' : card.issue || old.issue ? 'failed' : 'changed-input',
    });
    continue;
  }
  paired.push({ card, old });
}
const summarize = (pairs) =>
  Object.fromEntries(
    ['inspect', 'table'].map((tier) => {
      const regions = ['title', 'type', 'body', 'stats', 'set-symbol'].map((region) => {
        const values = pairs.flatMap(({ card, old }) => {
          if (
            region === 'body' &&
            (card.contentStatus !== 'scan-reviewed' ||
              card.alignment.uncertain ||
              old.alignment.uncertain)
          )
            return [];
          const a = old.comparisons[tier].regions.find((r) => r.id === region)?.edgeF1?.[1];
          const b = card.comparisons[tier].regions.find((r) => r.id === region)?.edgeF1?.[1];
          return a == null || b == null
            ? []
            : [{ id: card.id, name: card.name, before: a, after: b, delta: b - a }];
        });
        return [
          region,
          {
            count: values.length,
            beforeMedian: median(values.map((v) => v.before)),
            afterMedian: median(values.map((v) => v.after)),
            medianPairedDelta: median(values.map((v) => v.delta)),
            improved: values.filter((v) => v.delta > 0.02).length,
            regressed: values.filter((v) => v.delta < -0.02).length,
            worst: values.sort((a, b) => a.delta - b.delta).slice(0, 5),
          },
        ];
      });
      return [tier, Object.fromEntries(regions)];
    }),
  );
const result = {
  before: opts.baseline,
  after: opts.run,
  paired: paired.length,
  excluded,
  note: 'Identical inputs, reference bytes, metrics, browser and alignment only. Body deltas require reviewed wording and confident alignment. ±0.02 is a review flag, not a validated acceptance threshold.',
  all: summarize(paired),
  calibration: summarize(paired.filter(({ card }) => card.cohort === 'calibration')),
  heldOut: summarize(paired.filter(({ card }) => card.cohort === 'held-out')),
};
await writeJson(path.join(setRoot, opts.run, 'delta.json'), result);
console.log(JSON.stringify(result, null, 2));
