import { median, quantile } from './metrics.mjs';
import { inverseScanMatrix, projectScanPoint } from './scan-transform.mjs';

export const SCAN_FRAME_POLICY = Object.freeze({
  minimumPerSide: 8,
  minimumSpanFraction: 0.6,
  maxScaleDeviation: 0.02,
  maxTranslation: 6,
  maxRotationDegrees: 0.6,
  maxSkewDegrees: 0.4,
  maxValidationRms: 0.8,
  maxSideP90: 1.25,
  rotationMinimumGain: 0.12,
  skewMinimumGain: 0.15,
  relativeMinimumGain: 0.2,
  maxSideRegression: 0.15,
});
const sides = ['left', 'right', 'top', 'bottom'];
const horizontal = (side) => side === 'left' || side === 'right';
const span = (side) => (horizontal(side) ? 500 : 350);

function solve(rows, count) {
  const m = Array.from({ length: count }, () => Array(count + 1).fill(0));
  for (const { a, b } of rows)
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) m[i][j] += a[i] * a[j];
      m[i][count] += a[i] * b;
    }
  for (let i = 0; i < count; i++) {
    let pivot = i;
    for (let j = i + 1; j < count; j++) if (Math.abs(m[j][i]) > Math.abs(m[pivot][i])) pivot = j;
    if (Math.abs(m[pivot][i]) < 1e-10) return null;
    [m[i], m[pivot]] = [m[pivot], m[i]];
    const divisor = m[i][i];
    for (let j = i; j <= count; j++) m[i][j] /= divisor;
    for (let k = 0; k < count; k++)
      if (k !== i) {
        const factor = m[k][i];
        for (let j = i; j <= count; j++) m[k][j] -= factor * m[i][j];
      }
  }
  return m.map((row) => row[count]);
}

function support(points, cohort) {
  return Object.fromEntries(
    sides.map((side) => {
      const rows = points.filter((p) => p.side === side && p.cohort === cohort),
        values = rows.map((p) => p.along);
      return [
        side,
        { count: rows.length, span: values.length ? Math.max(...values) - Math.min(...values) : 0 },
      ];
    }),
  );
}
const supported = (counts) =>
  sides.every(
    (side) =>
      counts[side].count >= SCAN_FRAME_POLICY.minimumPerSide &&
      counts[side].span >= span(side) * SCAN_FRAME_POLICY.minimumSpanFraction,
  );
const residual = (point, transform, target) => {
  const [x, y] = projectScanPoint(point.x, point.y, transform);
  return (horizontal(point.side) ? x : y) - target.sides[point.side].position;
};
function errors(points, transform, target) {
  const values = points.map((p) => residual(p, transform, target)),
    rms = (v) => Math.sqrt(v.reduce((a, b) => a + b * b, 0) / v.length);
  return {
    rms: rms(values),
    sides: Object.fromEntries(
      sides.map((side) => {
        const v = points.filter((p) => p.side === side).map((p) => residual(p, transform, target));
        return [side, { rms: rms(v), p90: quantile(v.map(Math.abs), 0.9), bias: median(v) }];
      }),
    ),
  };
}

function candidate(points, target, model) {
  let fit = points.filter((p) => p.cohort === 'fit'),
    coefficients = null,
    transform = null;
  for (let iteration = 0; iteration < 4; iteration++) {
    const equations = fit.map((p) => {
      const x = p.x - 244,
        y = p.y - 340,
        h = horizontal(p.side);
      return {
        a: [
          h ? x : y,
          h ? 1 : 0,
          h ? 0 : 1,
          ...(model === 'translation-scale' ? [] : [h ? -y : x]),
          ...(model === 'rotation-skew' ? [h ? y : x] : []),
        ],
        b: target.sides[p.side].position - (h ? 244 : 340),
      };
    });
    coefficients = solve(
      equations,
      model === 'translation-scale' ? 3 : model === 'rotation' ? 4 : 5,
    );
    if (!coefficients) return { model, accepted: false, reason: 'singular-fit' };
    const [s, tx, ty, r = 0, h = 0] = coefficients;
    transform = { matrix: [s, r + h, -r + h, s, tx, ty] };
    // Detect isolated points within each side, never discard a whole opposing
    // boundary because a genuine asset-aspect error gives it a common bias.
    const sideLimits = Object.fromEntries(
      sides.map((side) => {
        const values = fit
            .filter((p) => p.side === side)
            .map((p) => residual(p, transform, target)),
          center = median(values);
        return [
          side,
          { center, limit: Math.max(0.75, 4.5 * median(values.map((v) => Math.abs(v - center)))) },
        ];
      }),
    );
    const retained = fit.filter(
      (p) =>
        Math.abs(residual(p, transform, target) - sideLimits[p.side].center) <=
        sideLimits[p.side].limit,
    );
    if (iteration === 3) break;
    if (retained.length === fit.length) break;
    fit = retained;
    if (!supported(support(fit, 'fit')))
      return {
        model,
        accepted: false,
        reason: 'insufficient-inlier-support',
        // A rotated frame can look like outliers to the translation-only
        // model. Keep its independent validation error as a comparison for
        // the richer models; it remains ineligible for selection itself.
        validation: errors(
          points.filter((p) => p.cohort === 'validation'),
          transform,
          target,
        ),
      };
  }
  const [s, tx, ty, r = 0, h = 0] = coefficients,
    scale = Math.hypot(s, r),
    rotationDegrees = (Math.atan2(r, s) * 180) / Math.PI,
    skewDegrees = (Math.atan2(h, s) * 180) / Math.PI;
  const validation = errors(
      points.filter((p) => p.cohort === 'validation'),
      transform,
      target,
    ),
    training = errors(fit, transform, target);
  const bounded =
    Math.abs(scale - 1) <= SCAN_FRAME_POLICY.maxScaleDeviation &&
    Math.max(Math.abs(tx), Math.abs(ty)) <= SCAN_FRAME_POLICY.maxTranslation &&
    Math.abs(rotationDegrees) <= SCAN_FRAME_POLICY.maxRotationDegrees &&
    Math.abs(skewDegrees) <= SCAN_FRAME_POLICY.maxSkewDegrees;
  const consistent =
    validation.rms <= SCAN_FRAME_POLICY.maxValidationRms &&
    sides.every((side) => validation.sides[side].p90 <= SCAN_FRAME_POLICY.maxSideP90);
  return {
    model,
    accepted: bounded && consistent,
    reason: !bounded ? 'excessive-scan-pose' : !consistent ? 'frame-validation-disagreement' : null,
    transform,
    inverse: inverseScanMatrix(transform),
    parameters: { scale, tx, ty, rotationDegrees, skewDegrees },
    fitSupport: support(fit, 'fit'),
    training,
    validation,
  };
}

/** Fit only independent outer-frame samples. Extra degrees of freedom must
 * improve disjoint validation strips. The skew model keeps equal diagonals:
 * no independent x/y stretching, perspective or local component deformation. */
export function fitScanFrame(anchors, target) {
  if (
    !target?.reliable ||
    !sides.every(
      (side) => target.sides?.[side]?.reliable && Number.isFinite(target.sides[side].position),
    )
  )
    return {
      accepted: false,
      reason: 'frame-template-unvalidated',
      transform: null,
      candidates: [],
    };
  const points = anchors?.points ?? [];
  if (
    !points.every(
      (p) =>
        sides.includes(p.side) &&
        ['fit', 'validation'].includes(p.cohort) &&
        [p.x, p.y, p.along].every(Number.isFinite),
    )
  )
    throw Error('Invalid frame-anchor observation');
  const supportCounts = { fit: support(points, 'fit'), validation: support(points, 'validation') };
  if (!supported(supportCounts.fit) || !supported(supportCounts.validation))
    return {
      accepted: false,
      reason: 'insufficient-frame-support',
      transform: null,
      support: supportCounts,
      candidates: [],
    };
  const candidates = ['translation-scale', 'rotation', 'rotation-skew'].map((model) =>
    candidate(points, target, model),
  );
  let selected = null;
  for (const next of candidates) {
    if (!next.accepted) continue;
    const simpler = selected ?? candidates.find((c) => c.validation);
    if (next.model === 'translation-scale' || !simpler || !simpler.validation) {
      selected = next;
      continue;
    }
    const minimum =
      next.model === 'rotation'
        ? SCAN_FRAME_POLICY.rotationMinimumGain
        : SCAN_FRAME_POLICY.skewMinimumGain;
    const gain = simpler.validation.rms - next.validation.rms;
    if (
      gain >= Math.max(minimum, simpler.validation.rms * SCAN_FRAME_POLICY.relativeMinimumGain) &&
      sides.every(
        (side) =>
          next.validation.sides[side].rms <=
          simpler.validation.sides[side].rms + SCAN_FRAME_POLICY.maxSideRegression,
      )
    )
      selected = next;
  }
  return {
    accepted: !!selected,
    reason: selected ? null : 'no-validated-model',
    model: selected?.model ?? null,
    transform: selected?.transform ?? null,
    inverse: selected?.inverse ?? null,
    parameters: selected?.parameters ?? null,
    validation: selected?.validation ?? null,
    support: supportCounts,
    candidates,
  };
}
