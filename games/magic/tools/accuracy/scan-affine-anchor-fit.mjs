// Offline physical-frame recovery only. No renderer pixels or text enter this fit.
import { median, quantile } from './metrics.mjs';
import { projectScanPoint, inverseScanMatrix } from './scan-transform.mjs';
import { SCAN_FRAME_POLICY as policy } from './scan-frame-fit.mjs';
const sides = ['left', 'right', 'top', 'bottom'];
const horizontal = (s) => s === 'left' || s === 'right';
function solve(rows) {
  const m = Array.from({ length: 6 }, () => Array(7).fill(0));
  for (const { a, b } of rows)
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) m[i][j] += a[i] * a[j];
      m[i][6] += a[i] * b;
    }
  for (let i = 0; i < 6; i++) {
    let pivot = i;
    for (let j = i + 1; j < 6; j++) if (Math.abs(m[j][i]) > Math.abs(m[pivot][i])) pivot = j;
    if (Math.abs(m[pivot][i]) < 1e-10) return null;
    [m[i], m[pivot]] = [m[pivot], m[i]];
    const div = m[i][i];
    for (let j = i; j < 7; j++) m[i][j] /= div;
    for (let k = 0; k < 6; k++)
      if (k !== i) {
        const v = m[k][i];
        for (let j = i; j < 7; j++) m[k][j] -= v * m[i][j];
      }
  }
  return m.map((r) => r[6]);
}
function support(points) {
  return Object.fromEntries(
    sides.map((side) => {
      const values = points.filter((p) => p.side === side).map((p) => p.along);
      return [
        side,
        {
          count: values.length,
          span: values.length ? Math.max(...values) - Math.min(...values) : 0,
        },
      ];
    }),
  );
}
const supported = (s) =>
  sides.every(
    (side) =>
      s[side].count >= policy.minimumPerSide &&
      s[side].span >= policy.minimumSpanFraction * (horizontal(side) ? 500 : 350),
  );
function residual(p, t, target) {
  const xy = projectScanPoint(p.x, p.y, t);
  return xy[horizontal(p.side) ? 0 : 1] - target.sides[p.side].position;
}
function errors(points, t, target) {
  const rms = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0) / v.length);
  return {
    rms: rms(points.map((p) => residual(p, t, target))),
    sides: Object.fromEntries(
      sides.map((side) => {
        const values = points.filter((p) => p.side === side).map((p) => residual(p, t, target));
        return [
          side,
          { rms: rms(values), p90: quantile(values.map(Math.abs), 0.9), bias: median(values) },
        ];
      }),
    ),
  };
}
export function fitAffineFrameAnchors(anchors, target, simpler, { fixedModel = false } = {}) {
  const points = anchors?.points ?? [];
  if (
    !points.every(
      (p) =>
        sides.includes(p.side) &&
        ['fit', 'validation'].includes(p.cohort) &&
        [p.x, p.y, p.along].every(Number.isFinite),
    )
  )
    throw Error('Invalid affine frame anchors');
  const reject = (reason, details = {}) => ({
    accepted: false,
    reason,
    model: 'affine-outer-frame',
    transform: null,
    ...details,
  });
  if (
    !target?.reliable ||
    !sides.every((s) => target.sides?.[s]?.reliable && Number.isFinite(target.sides[s].position))
  )
    return reject('frame-template-unvalidated');
  let fit = points.filter((p) => p.cohort === 'fit');
  const held = points.filter((p) => p.cohort === 'validation');
  if (!supported(support(fit)) || !supported(support(held)))
    return reject('insufficient-frame-support');
  let transform;
  for (let pass = 0; pass < 4; pass++) {
    const rows = fit.map((p) => {
      const x = p.x - 244,
        y = p.y - 340,
        h = horizontal(p.side);
      return {
        a: h ? [x, y, 1, 0, 0, 0] : [0, 0, 0, x, y, 1],
        b: target.sides[p.side].position - (h ? 244 : 340),
      };
    });
    const values = solve(rows);
    if (!values) return reject('singular-fit');
    const [a, c, tx, b, d, ty] = values;
    transform = { matrix: [a, b, c, d, tx, ty] };
    if (a * d - b * c <= 1e-8) return reject('reflected-frame');
    const limits = Object.fromEntries(
      sides.map((side) => {
        const v = fit.filter((p) => p.side === side).map((p) => residual(p, transform, target)),
          center = median(v);
        return [
          side,
          { center, limit: Math.max(0.75, 4.5 * median(v.map((x) => Math.abs(x - center)))) },
        ];
      }),
    );
    const retained = fit.filter(
      (p) =>
        Math.abs(residual(p, transform, target) - limits[p.side].center) <= limits[p.side].limit,
    );
    if (pass === 3 || retained.length === fit.length) break;
    fit = retained;
    if (!supported(support(fit))) return reject('insufficient-inlier-support');
  }
  const [a, b, c, d, tx, ty] = transform.matrix,
    scaleX = Math.hypot(a, b),
    scaleY = Math.hypot(c, d),
    mean = (a + d) / 2;
  const parameters = {
    scaleX,
    scaleY,
    tx,
    ty,
    rotationDegrees: (Math.atan2((b - c) / 2, mean) * 180) / Math.PI,
    skewDegrees: (Math.atan2((b + c) / 2, mean) * 180) / Math.PI,
  };
  const training = errors(fit, transform, target),
    validation = errors(held, transform, target);
  const details = {
    parameters,
    training,
    validation,
    support: { fit: support(fit), validation: support(held) },
  };
  if (
    [scaleX, scaleY].some((s) => Math.abs(s - 1) > policy.maxScaleDeviation) ||
    Math.abs(scaleX - scaleY) > 0.006 ||
    Math.max(Math.abs(tx), Math.abs(ty)) > policy.maxTranslation ||
    Math.abs(parameters.rotationDegrees) > policy.maxRotationDegrees ||
    Math.abs(parameters.skewDegrees) > policy.maxSkewDegrees
  )
    return reject('excessive-scan-pose', details);
  if (
    validation.rms > policy.maxValidationRms ||
    sides.some((s) => validation.sides[s].p90 > policy.maxSideP90)
  )
    return reject('frame-validation-disagreement', details);
  if (!fixedModel && (!simpler?.validation || !Number.isFinite(simpler.validation.rms)))
    return reject('missing-simpler-model', details);
  const gain = fixedModel ? Infinity : simpler.validation.rms - validation.rms;
  if (
    !fixedModel &&
    (gain < Math.max(policy.skewMinimumGain, simpler.validation.rms * policy.relativeMinimumGain) ||
      sides.some(
        (s) => validation.sides[s].rms > simpler.validation.sides[s].rms + policy.maxSideRegression,
      ))
  )
    return reject('insufficient-independent-gain', details);
  return {
    accepted: true,
    reason: null,
    model: 'affine-outer-frame',
    transform,
    inverse: inverseScanMatrix(transform),
    ...details,
  };
}
