// Shared regional selection. Validation never chooses or repairs a candidate.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
const [matrixFile, definitionFile, output, guards] = process.argv.slice(2);
assert(
  output && (!guards || guards === 'density-guards'),
  'Usage: early-region-select.mjs MATRIX DEFINITION OUTPUT [density-guards]',
);
const raw = await readFile(matrixFile),
  definitionBytes = await readFile(definitionFile);
const matrix = JSON.parse(raw),
  definition = JSON.parse(definitionBytes);
assert(
  ['native-body-policy-matrix-complete', 'native-stats-matrix-complete'].includes(matrix.status),
);
assert.equal(matrix.completed, matrix.total);
assert.equal(matrix.rows.length, matrix.total);
assert.equal(matrix.definitionHash, hash(definitionBytes));
assert.deepEqual(matrix.definition, definition);
assert.equal(new Set(matrix.rows.map((r) => r.id)).size, matrix.total);
const baselineId = definition.baselineId ?? 'current';
let candidates = definition.candidates
  .filter((c) => !definition.eligibleIds || definition.eligibleIds.includes(c.id))
  .map((c) => ({ ...c, sourceCandidateId: c.id }));
assert(candidates.some((c) => c.id === baselineId));
if (guards) {
  assert.equal(matrix.status, 'native-body-policy-matrix-complete');
  const physical = candidates.filter((c) => c.adjustment.transferAlphaModel);
  for (const maximumLines of [6, 7])
    for (const c of physical)
      candidates.push({
        ...c,
        id: c.id + '/regular-through-' + maximumLines,
        adjustment: { ...c.adjustment, retainRegularAboveLines: maximumLines },
        guard: { minimumSize: 19, maximumSizeExclusive: 30, maximumLines },
      });
}
const byId = (row, id) => {
  const trial = row.trials.find((t) => t.id === id);
  assert(trial, row.name + '/' + id);
  return trial;
};
const valid = (t) =>
  Number.isFinite(t.score) && t.score >= 0 && t.score <= 1 && !t.invalid && !t.overflow;
const trial = (row, c) => {
  const baseline = byId(row, baselineId),
    g = c.guard;
  const retain =
    g &&
    baseline.size >= g.minimumSize &&
    baseline.size < g.maximumSizeExclusive &&
    baseline.lineCount > g.maximumLines;
  return {
    value: retain ? baseline : byId(row, c.sourceCandidateId),
    retainedBase: Boolean(retain),
  };
};
const rows = matrix.rows;
for (const r of rows) {
  assert(['calibration', 'validation'].includes(r.cohort));
  assert(valid(byId(r, baselineId)), 'Invalid baseline: ' + r.name);
  assert(Math.max(...Object.values(r.zeroReplayMaximumError)) <= 1.001);
}
const train = rows.filter((r) => r.cohort === 'calibration'),
  validation = rows.filter((r) => r.cohort === 'validation');
assert(train.length >= 3 && validation.length >= 3);
const mean = (v) => (v.length ? v.reduce((s, x) => s + x, 0) / v.length : null);
const evaluate = (all, c) => {
  const rr = all.map((r) => ({ r, before: byId(r, baselineId).score, ...trial(r, c) }));
  const invalid = rr.filter((t) => !valid(t.value));
  return {
    count: all.length,
    invalid: invalid.length,
    retainedBase: rr.filter((t) => t.retainedBase).length,
    beforeMean100: all.length ? 100 * mean(rr.map((t) => t.before)) : null,
    afterMean100: all.length && !invalid.length ? 100 * mean(rr.map((t) => t.value.score)) : null,
    improved: rr.filter((t) => valid(t.value) && t.value.score > t.before + 1e-9).length,
    regressed: rr.filter((t) => valid(t.value) && t.value.score < t.before - 1e-9).length,
    worstRegression100:
      all.length && !invalid.length
        ? 100 * Math.max(0, ...rr.map((t) => t.before - t.value.score))
        : null,
  };
};
const objective = (c) => {
  const values = train.map((r) => ({ before: byId(r, baselineId).score, ...trial(r, c) }));
  if (values.some((t) => !valid(t.value))) return null;
  return (
    mean(values.map((t) => t.value.score)) -
    0.25 * Math.max(0, ...values.map((t) => t.before - t.value.score))
  );
};
let selected = candidates.find((c) => c.id === baselineId);
for (const c of candidates) {
  const score = objective(c);
  if (score !== null && score > objective(selected) + 1e-9) selected = c;
}
const groups = {
  calibration: evaluate(train, selected),
  validation: evaluate(validation, selected),
  all: evaluate(rows, selected),
};
for (const material of [...new Set(rows.map((r) => r.material))])
  groups['material/' + material] = evaluate(
    rows.filter((r) => r.material === material),
    selected,
  );
for (const sizeClass of ['large', 'medium', 'dense']) {
  const rr = rows.filter((r) => byId(r, baselineId).sizeClass === sizeClass);
  if (rr.length) groups['size/' + sizeClass] = evaluate(rr, selected);
}
const observations = rows.map((r) => {
  const t = trial(r, selected),
    base = byId(r, baselineId);
  return {
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    before: base.score,
    after: valid(t.value) ? t.value.score : null,
    invalid: !valid(t.value),
    retainedBase: t.retainedBase,
    baselineSize: base.size ?? null,
    baselineLines: base.lineCount ?? null,
    selectedSize: t.value.size ?? null,
    selectedLines: t.value.lineCount ?? null,
    delta: valid(t.value) ? t.value.score - base.score : null,
  };
});
await writeJson(output, {
  schema: 1,
  set: matrix.set,
  status: groups.validation.invalid
    ? 'shared-region-candidate-invalid-in-validation'
    : 'shared-region-candidate-needs-native-verification',
  scope:
    'One shared candidate selected using calibration rows only. Validation is reused development evidence and cannot change selection. Optional medium-density retention uses the original compiled font size and line count, never a scan or card identity. Retained cases reuse the exact baseline recipe; all other cases reuse an existing measured recipe. Such guarded predictions still require a native replay of the actual branch. Gray controls remain measurement-only. This is not runtime adoption, a whole-card score or complete-set certification.',
  rendererHash: matrix.rendererHash,
  nativeCaptureHash: matrix.nativeCaptureHash,
  matrixHash: hash(raw),
  definitionHash: hash(definitionBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  baselineId,
  selected,
  selection: {
    method: 'calibration mean minus one quarter of the worst calibration loss',
    usedValidation: false,
    validationKind: 'reused-development',
    baselineObjective: objective(candidates.find((c) => c.id === baselineId)),
    selectedObjective: objective(selected),
  },
  groups,
  candidates: candidates.map((c) => ({
    id: c.id,
    adjustment: c.adjustment,
    guard: c.guard ?? null,
    calibrationObjective: objective(c),
    calibration: evaluate(train, c),
    validation: evaluate(validation, c),
  })),
  worst: observations
    .filter((r) => r.delta !== null)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 20),
  rows: observations,
});
console.log(JSON.stringify({ selected, groups }));
