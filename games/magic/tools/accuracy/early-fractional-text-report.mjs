// Summarize native text trials without promoting a partial census or hiding regressions.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';

const [directory, output, partial] = process.argv.slice(2);
assert(
  output && (partial === undefined || partial === '--partial'),
  'Usage: early-fractional-text-report.mjs STUDY_DIRECTORY OUTPUT [--partial]',
);
const bytes = await readFile(path.join(directory, 'study.json')),
  study = JSON.parse(bytes);
const inputBytes = await readFile(path.join(directory, 'inputs.json')),
  inputs = JSON.parse(inputBytes);
assert.equal(study.source.inputsHash, hash(JSON.stringify(inputs)));
assert.equal(study.completed, study.rows.length);
assert.equal(new Set(study.rows.map((r) => r.id)).size, study.completed);
assert.equal(study.inventory, inputs.entries.length);
assert.deepEqual(study.faults, []);
if (!partial) {
  assert(study.source.census);
  assert.equal(study.completed, study.inventory);
}
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
const classify = (row) => {
  const layout = row.variants[0].layout;
  return !layout?.lines.length
    ? 'empty'
    : layout.size < 19
      ? 'small'
      : layout.size < 30
        ? 'regular'
        : 'large';
};
const rows = [];
for (const row of study.rows) {
  const entry = inputs.entries.find((e) => e.id === row.id);
  assert.equal(row.referenceHash, entry.reference.sha256);
  assert.equal(row.poseHash, hash(JSON.stringify(entry.pose)));
  assert.equal(row.accepted, entry.pose.accepted);
  assert.deepEqual(
    row.variants.map((v) => v.id),
    study.source.policy === 'tiered'
      ? ['current', 'fractional-tiered']
      : ['current', 'fractional-layout', 'fractional-consistent'],
  );
  for (const variant of row.variants) {
    const b = await readFile(path.join(directory, row.set, row.id, variant.id + '.png'));
    assert.equal(hash(b), variant.renderHash);
    assert.equal(variant.outside, 0);
    assert.equal(variant.alpha, 0);
    assert(!variant.layout?.overflow, 'Overflow in ' + row.name);
  }
  const before = row.variants[0],
    after = row.variants.at(-1);
  const score =
    before.score && after.score
      ? {
          before100: 100 * before.score.score,
          after100: 100 * after.score.score,
          delta100: 100 * (after.score.score - before.score.score),
        }
      : null;
  rows.push({
    id: row.id,
    name: row.name,
    set: row.set,
    material: row.material,
    accepted: row.accepted,
    cohort: classify(row),
    score,
    layouts: row.variants.map((v) => ({
      id: v.id,
      size: v.layout?.size ?? null,
      lines: v.layout?.lines.length ?? 0,
      fractionalMetrics: v.layout?.fractionalMetrics ?? false,
      renderHash: v.renderHash,
    })),
    referenceHash: row.referenceHash,
    poseHash: row.poseHash,
  });
}
const quantile = (values, q) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b),
    position = (sorted.length - 1) * q;
  const lo = Math.floor(position),
    hi = Math.ceil(position);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (position - lo);
};
const summarize = (items) => {
  const scored = items.filter((r) => r.accepted && r.score);
  return {
    inventory: items.length,
    accepted: items.filter((r) => r.accepted).length,
    scored: scored.length,
    empty: items.filter((r) => r.cohort === 'empty').length,
    medianBefore100: quantile(
      scored.map((r) => r.score.before100),
      0.5,
    ),
    medianAfter100: quantile(
      scored.map((r) => r.score.after100),
      0.5,
    ),
    lowerDecileBefore100: quantile(
      scored.map((r) => r.score.before100),
      0.1,
    ),
    lowerDecileAfter100: quantile(
      scored.map((r) => r.score.after100),
      0.1,
    ),
    before100: mean(scored.map((r) => r.score.before100)),
    after100: mean(scored.map((r) => r.score.after100)),
    delta100: mean(scored.map((r) => r.score.delta100)),
    improvedHalfPoint: scored.filter((r) => r.score.delta100 > 0.5).length,
    regressedHalfPoint: scored.filter((r) => r.score.delta100 < -0.5).length,
    changedFontSize: items.filter((r) => r.layouts[0].size !== r.layouts.at(-1).size).length,
    changedLineCount: items.filter((r) => r.layouts[0].lines !== r.layouts.at(-1).lines).length,
  };
};
const sets = Object.fromEntries(
  [...new Set(rows.map((r) => r.set))].map((set) => {
    const items = rows.filter((r) => r.set === set);
    return [
      set,
      {
        ...summarize(items),
        cohorts: Object.fromEntries(
          ['large', 'regular', 'small', 'empty'].map((c) => [
            c,
            summarize(items.filter((r) => r.cohort === c)),
          ]),
        ),
        regressions: items
          .filter((r) => r.score && r.accepted && r.score.delta100 < -0.5)
          .sort((a, b) => a.score.delta100 - b.score.delta100)
          .map((r) => ({ id: r.id, name: r.name, delta100: r.score.delta100, cohort: r.cohort })),
        normalizationReview: items
          .filter((r) => !r.accepted)
          .map((r) => ({ id: r.id, name: r.name, score: r.score })),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  status: partial ? 'incomplete-diagnostic' : 'complete-development-census',
  source: study.source,
  studyHash: hash(bytes),
  inputsHash: hash(inputBytes),
  transformed: study.transformed,
  transformedByStage: study.transformedByStage,
  summary: summarize(rows),
  sets,
  rows,
  limitations: [
    'Structure index is not percentage fidelity.',
    'All scans and poses are reused development references; no independent-name holdout is claimed.',
    'Rejected historical poses remain visible and are excluded from accepted aggregation.',
    'This trial does not certify frame geometry, pigment or the rest of a set.',
  ],
});
console.log(
  JSON.stringify(
    {
      completed: study.completed,
      inventory: study.inventory,
      sets: Object.fromEntries(
        Object.entries(sets).map(([k, v]) => [
          k,
          {
            inventory: v.inventory,
            before100: v.before100,
            after100: v.after100,
            regressedHalfPoint: v.regressedHalfPoint,
          },
        ]),
      ),
    },
    null,
    2,
  ),
);
