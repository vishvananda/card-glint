import assert from 'node:assert/strict';

const family = (candidate) =>
  candidate.name.startsWith('number/')
    ? 'number'
    : candidate.name.startsWith('glyph/')
      ? 'glyph'
      : 'global';

/** A replay of the unadjusted face cannot prove an adjustment control works.
 * Require changed pixels and an independently composed native trial for every
 * applicable family. This rejects the former no-op Alpha numeral study. */
export function verifyManaStudyControls(study, entries) {
  const byId = new Map(entries.map((e) => [e.id, e]));
  assert.equal(study.candidates[0].name, 'current');
  assert.deepEqual(study.candidates[0].delta, {});
  assert.equal(new Set(study.rows.map((r) => r.id)).size, study.rows.length);
  for (const row of study.rows) {
    const entry = byId.get(row.id);
    assert.ok(entry, 'Unknown study printing');
    assert.equal(row.parity, 0);
    assert.equal(row.regionParity, 0);
    assert.equal(row.scores.length, study.candidates.length);
    assert.equal(row.effects.length, study.candidates.length);
    assert.equal(row.effects[0], 0);
    assert.ok(row.scores.every((v) => Number.isFinite(v) && v >= -1 && v <= 1.000001));
    assert.ok(row.effects.every((v) => Number.isSafeInteger(v) && v >= 0));
    const cost = entry.face.manaSymbols;
    for (const kind of new Set(study.candidates.slice(1).map(family))) {
      const applies =
        kind === 'number'
          ? cost.some((s) => /^\d+$/.test(s))
          : kind === 'glyph'
            ? ['W', 'U', 'B', 'R', 'G'].includes(cost.at(-1))
            : true;
      if (!applies) continue;
      assert.equal(row.candidateParities[kind], 0, 'Missing full-native trial parity: ' + kind);
      assert.ok(
        study.candidates.some((c, i) => i && family(c) === kind && row.effects[i] > 0),
        'Calibration control produced no pixel changes: ' + kind,
      );
    }
  }
}

/** Select on calibration names only, then apply the declared validation gate.
 * Numeric controls are judged across mixed costs too, not only artifacts. */
export function manaStudySummary(
  study,
  entries,
  { symbol, numerals = false, minimumGain = 0.003 } = {},
) {
  verifyManaStudyControls(study, entries);
  const byId = new Map(entries.map((e) => [e.id, e]));
  const rows = study.rows.filter((r) =>
    numerals
      ? byId.get(r.id).face.manaSymbols.some((s) => /^\d+$/.test(s))
      : !symbol || r.symbol === symbol,
  );
  const candidates = study.candidates.flatMap((c, i) =>
    !i || (!numerals && !symbol) || family(c) === (numerals || symbol === 'N' ? 'number' : 'glyph')
      ? [i]
      : [],
  );
  const calibration = rows.filter((r) => r.cohort === 'calibration');
  const validation = rows.filter((r) => r.cohort === 'validation');
  assert.ok(calibration.length && validation.length, 'Both cohorts are required');
  const mean = (rs, i) => rs.reduce((n, r) => n + r.scores[i], 0) / rs.length;
  const best = candidates.reduce(
    (a, b) => (mean(calibration, b) > mean(calibration, a) ? b : a),
    0,
  );
  const calibrationGain = mean(calibration, best) - mean(calibration, 0);
  const validationGain = mean(validation, best) - mean(validation, 0);
  return {
    calibrationNames: calibration.length,
    validationNames: validation.length,
    candidate: study.candidates[best],
    calibrationGain,
    validationGain,
    minimumGain,
    qualifies: best !== 0 && calibrationGain > minimumGain && validationGain > minimumGain,
  };
}
