// Summarize native heading trials without turning a regional fit into set approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { hash } from './common.mjs';

const [input, output] = process.argv.slice(2);
assert(input && output, 'Usage: revised-heading-style-review.mjs STUDY NEW_REVIEW');
const bytes = await fs.readFile(input),
  study = JSON.parse(bytes);
assert.equal(study.schema, 1);
assert.equal(study.mode, 'full');
assert.equal(study.status, 'native-revised-heading-study-not-adopted');
assert.deepEqual(study.faults, []);
assert.equal(study.rows.length, 223);
assert.equal(new Set(study.rows.map((r) => r.id)).size, study.rows.length);
const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;
const median = (values) => {
  const sorted = values.toSorted((a, b) => a - b),
    m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
};
for (const row of study.rows) {
  assert.equal(row.nativeHash, row.fullHash);
  assert(['calibration', 'validation'].includes(row.cohort));
  for (const role of ['title', 'type']) {
    const r = row.roles[role];
    assert.equal(r.baselineParity, 0);
    assert.equal(r.scores.length, study.definition[role].length);
    for (const s of r.scores) {
      assert(Number.isFinite(s.score));
      if (s.ink?.error !== undefined) assert(Number.isFinite(s.ink.error));
    }
  }
}
const summaries = (rows, role, index) => {
  const before = rows.map((r) => r.roles[role].scores[0].score),
    after = rows.map((r) => r.roles[role].scores[index].score),
    changes = after.map((v, i) => v - before[i]),
    inks = rows
      .map((r) => r.roles[role].scores[index].ink)
      .filter((v) => Number.isFinite(v?.error));
  return {
    cards: rows.length,
    before100: 100 * mean(before),
    after100: 100 * mean(after),
    medianChange100: 100 * median(changes),
    gains: changes.filter((v) => v > 0).length,
    losses: changes.filter((v) => v < 0).length,
    worstLoss100: -100 * Math.min(0, ...changes),
    ink: {
      cards: inks.length,
      meanOklabDistance: inks.length ? mean(inks.map((v) => v.error)) : null,
      medianOklabDistance: inks.length ? median(inks.map((v) => v.error)) : null,
      referenceRgb: inks.length
        ? [0, 1, 2].map((k) => mean(inks.map((v) => v.reference[k])))
        : null,
      renderedRgb: inks.length ? [0, 1, 2].map((k) => mean(inks.map((v) => v.rendered[k]))) : null,
    },
  };
};
const groups = {
    all: study.rows,
    ...Object.fromEntries(
      ['calibration', 'validation'].map((c) => [c, study.rows.filter((r) => r.cohort === c)]),
    ),
    ...Object.fromEntries(
      [...new Set(study.rows.map((r) => r.material))].map((m) => [
        m,
        study.rows.filter((r) => r.material === m),
      ]),
    ),
  },
  roles = {};
for (const role of ['title', 'type']) {
  const candidates = study.definition[role].map((candidate, index) => {
      const stats = Object.fromEntries(
          Object.entries(groups).map(([key, rows]) => [key, summaries(rows, role, index)]),
        ),
        calibration = stats.calibration,
        objective = calibration.after100 - 0.25 * calibration.worstLoss100,
        losses = study.rows
          .flatMap((r) => {
            const change100 =
              100 * (r.roles[role].scores[index].score - r.roles[role].scores[0].score);
            return change100 < 0
              ? [{ id: r.id, name: r.name, material: r.material, cohort: r.cohort, change100 }]
              : [];
          })
          .sort((a, b) => a.change100 - b.change100);
      return { index, candidate, objective, summaries: stats, losses };
    }),
    rank = candidates.toSorted((a, b) => b.objective - a.objective),
    pareto = candidates.filter(
      (a) =>
        !candidates.some(
          (b) =>
            b.summaries.calibration.after100 >= a.summaries.calibration.after100 &&
            b.summaries.calibration.ink.meanOklabDistance <=
              a.summaries.calibration.ink.meanOklabDistance &&
            (b.summaries.calibration.after100 > a.summaries.calibration.after100 ||
              b.summaries.calibration.ink.meanOklabDistance <
                a.summaries.calibration.ink.meanOklabDistance),
        ),
    );
  roles[role] = {
    geometrySelection: rank[0].index,
    calibrationParetoIndices: pareto.map((v) => v.index),
    candidates,
  };
}
const report = {
  schema: 1,
  status: 'native-heading-font-style-proposals-not-adopted',
  rendererHash: study.rendererHash,
  studyHash: hash(bytes),
  scope:
    '223 accepted nonland poses; Original wording; 58 rejected nonland poses and 25 lands remain outside this trial.',
  selection:
    'Geometry ranking uses calibration mean minus one quarter worst calibration loss. Validation is reused development data and never selects the candidate. Ink error is reported separately, not folded into a shape score. The Pareto frontier uses calibration shape and ink means.',
  limitations:
    'Opaque glyph stencils are selected from renderer black/white endpoints, never scan darkness. Scan halftone, residual registration and thinner reference strokes can mix background into ink samples; these means are diagnostic, not literal printing-ink targets. Filled painters only. No runtime defaults or completion status are changed.',
  groups: Object.fromEntries(Object.entries(groups).map(([k, rows]) => [k, rows.length])),
  roles,
};
await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
for (const role of ['title', 'type']) {
  const r = roles[role],
    top = r.candidates[r.geometrySelection];
  console.log(
    role,
    JSON.stringify({
      candidate: top.candidate,
      summaries: top.summaries,
      pareto: r.calibrationParetoIndices,
    }),
  );
}
