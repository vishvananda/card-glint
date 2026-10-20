// Select shared role geometry using calibration names; retain all residuals.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
const [matrixFile, probesFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-heading-select.mjs SHARED_MATRIX ORIGINAL_PROBES OUTPUT');
const matrixBytes = await readFile(matrixFile),
  probeBytes = await readFile(probesFile);
const matrix = JSON.parse(matrixBytes),
  probes = JSON.parse(probeBytes);
assert.equal(matrix.status, 'shared-heading-matrix-complete');
assert.equal(probes.status, 'diagnostic-heading-probes-complete');
assert.equal(matrix.completed, matrix.total);
assert.equal(matrix.completed, probes.completed);
assert.equal(matrix.sharedDefinition.parentProbeHash, hash(probeBytes));
for (const field of ['rendererHash', 'nativeCaptureHash', 'nativeInputsHash'])
  assert.equal(matrix[field], probes[field]);
for (const row of matrix.rows) {
  const old = probes.rows.find((r) => r.id === row.id);
  assert(old);
  for (const field of [
    'cohort',
    'referenceHash',
    'poseHash',
    'baselineHash',
    'nativeScanHash',
    'canonicalReferenceHash',
  ])
    assert.equal(row[field], old[field]);
  assert(Math.max(...Object.values(row.zeroReplayMaximumError)) <= 1.001);
}
const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;
const roles = {};
for (const role of ['title', 'type', 'artist']) {
  const rows = matrix.rows.filter((r) => r.fits[role]);
  const candidates = matrix.sharedDefinition.candidates[role];
  for (const row of rows) {
    assert.deepEqual(
      row.fits[role].candidates.map(({ id, adjustment }) => ({ id, adjustment })),
      candidates,
    );
    assert(
      row.fits[role].candidates.every(
        (c) => Number.isFinite(c.score) && c.score >= 0 && c.score <= 1,
      ),
    );
  }
  const calibration = rows.filter((r) => r.cohort === 'calibration');
  const validation = rows.filter((r) => r.cohort === 'validation');
  assert(calibration.length >= 3 && validation.length >= 3);
  const score = (row, id) => row.fits[role].candidates.find((c) => c.id === id).score;
  const objective = (id) =>
    mean(calibration.map((r) => score(r, id))) -
    0.25 * Math.max(0, ...calibration.map((r) => r.fits[role].fixedGray - score(r, id)));
  let selected = candidates[0];
  assert.equal(selected.id, 'fixed-gray');
  for (const candidate of candidates)
    if (objective(candidate.id) > objective(selected.id) + 1e-9) selected = candidate;
  const summary = (all) => {
    assert(all.length);
    const before = all.map((r) => r.fits[role].fixedGray),
      after = all.map((r) => score(r, selected.id));
    return {
      count: all.length,
      beforeMean100: 100 * mean(before),
      afterMean100: 100 * mean(after),
      improved: after.filter((s, i) => s > before[i]).length,
      worstRegression100: 100 * Math.max(0, ...before.map((v, i) => v - after[i])),
    };
  };
  const summaries = {
    calibration: summary(calibration),
    validation: summary(validation),
    all: summary(rows),
    ordinary: summary(rows.filter((r) => r.material !== 'L')),
    land: summary(rows.filter((r) => r.material === 'L')),
  };
  const { gray, ...geometry } = selected.adjustment;
  assert.equal(gray, 130);
  roles[role] = {
    status: 'shared-command-candidate-needs-native-profile-replay',
    selectedId: selected.id,
    geometry,
    measurementGray: 130,
    selection: {
      method:
        'calibration mean minus one quarter of the worst calibration loss against fixed-gray control',
      usedValidation: false,
      validationKind: 'reused-development',
      baselineObjective: objective('fixed-gray'),
      selectedObjective: objective(selected.id),
    },
    groups: summaries,
    candidates: candidates.map((c) => ({
      id: c.id,
      geometry: c.adjustment,
      calibrationObjective: objective(c.id),
    })),
    rows: rows.map((r) => ({
      id: r.id,
      name: r.name,
      material: r.material,
      cohort: r.cohort,
      before: r.fits[role].fixedGray,
      after: score(r, selected.id),
      delta: score(r, selected.id) - r.fits[role].fixedGray,
    })),
  };
  console.log(
    role,
    JSON.stringify({
      geometry,
      calibration: summaries.calibration,
      validation: summaries.validation,
    }),
  );
}
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'shared-heading-geometry-candidates-not-runtime-adopted',
  scope:
    'One heading, type and artist geometry candidate per set, selected on calibration names only. Validation names are reused development observations. Original wording, independent scan poses, canonical 488x680 references, exact current full-card PNG hashes and zero-command replay parity are checked for all fifty-five inputs. Gray 130 is a fixed geometry-measurement control; it is not an adopted ink color. No per-printing offsets are proposed. Native profile replay after frame/color integration, actual ink tone/shadows, body text, mana and full-set verification remain open.',
  rendererHash: matrix.rendererHash,
  nativeCaptureHash: matrix.nativeCaptureHash,
  matrixHash: hash(matrixBytes),
  probesHash: hash(probeBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  roles,
});
