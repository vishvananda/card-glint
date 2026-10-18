/** Bounded coordinate descent for a prepared regional painter/metric. The caller
 * caches scan masks and supplies scores; this helper never launches Chromium.
 * Freeze bounds/steps before validation. Quantization and memoization avoid
 * repeating equivalent candidates. Return boundary hits and tied optima. */
export async function searchCalibration(
  initial,
  parameters,
  score,
  { epsilon = 1e-6, maxSweeps = 30 } = {},
) {
  for (const p of parameters)
    if (
      !Number.isFinite(initial[p.key]) ||
      !Number.isFinite(p.min) ||
      !Number.isFinite(p.max) ||
      p.min >= p.max ||
      !p.steps?.length ||
      p.steps.some((s) => !Number.isFinite(s) || s <= 0) ||
      initial[p.key] < p.min ||
      initial[p.key] > p.max
    )
      throw Error('Invalid calibration search bounds');
  if (!Number.isInteger(maxSweeps) || maxSweeps < 1 || !(epsilon >= 0))
    throw Error('Invalid search budget');
  const memo = new Map();
  const evaluate = async (values) => {
    const key = JSON.stringify(values);
    if (!memo.has(key)) {
      const result = await score(Object.freeze({ ...values }));
      if (!Number.isFinite(result)) throw Error('Non-finite calibration score');
      memo.set(key, result);
    }
    return memo.get(key);
  };
  let values = { ...initial },
    best = await evaluate(values),
    exhausted = false;
  for (let level = 0; level < Math.max(...parameters.map((p) => p.steps.length)); level++) {
    let stable = false;
    for (let sweep = 0; sweep < maxSweeps; sweep++) {
      let improved = false;
      for (const p of parameters) {
        const step = p.steps[Math.min(level, p.steps.length - 1)];
        let selected = values,
          value = best;
        for (const direction of [-1, 1]) {
          const n = Math.round((values[p.key] + direction * step) * 1e8) / 1e8;
          if (n < p.min || n > p.max) continue;
          const candidate = { ...values, [p.key]: n },
            result = await evaluate(candidate);
          if (result > value + epsilon) {
            selected = candidate;
            value = result;
          }
        }
        if (selected !== values) {
          values = selected;
          best = value;
          improved = true;
        }
      }
      if (!improved) {
        stable = true;
        break;
      }
    }
    exhausted ||= !stable;
  }
  return {
    values,
    score: best,
    evaluations: memo.size,
    exhausted,
    boundary: parameters
      .filter((p) => values[p.key] === p.min || values[p.key] === p.max)
      .map((p) => p.key),
    tiedCandidates: [...memo.values()].filter((v) => Math.abs(v - best) <= epsilon).length,
  };
}
