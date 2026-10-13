import { median, quantile } from './metrics.mjs';
import { inverseScanMatrix, projectScanPoint } from './scan-transform.mjs';

const sides = ['left', 'right', 'top', 'bottom'];
const horizontal = (s) => s === 'left' || s === 'right';
const rms = (a) => Math.sqrt(a.reduce((n, v) => n + v * v, 0) / a.length);
function solve(rows) {
  const m = Array.from({ length: 3 }, () => Array(4).fill(0));
  for (const [a, b] of rows)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) m[i][j] += a[i] * a[j];
      m[i][3] += a[i] * b;
    }
  for (let i = 0; i < 3; i++) {
    const pivot = m
      .map((r, j) => (j >= i ? Math.abs(r[i]) : -1))
      .indexOf(Math.max(...m.map((r, j) => (j >= i ? Math.abs(r[i]) : -1))));
    if (Math.abs(m[pivot][i]) < 1e-10) return null;
    [m[i], m[pivot]] = [m[pivot], m[i]];
    const divisor = m[i][i];
    for (let j = i; j < 4; j++) m[i][j] /= divisor;
    for (let k = 0; k < 3; k++)
      if (k !== i) {
        const factor = m[k][i];
        for (let j = i; j < 4; j++) m[k][j] -= factor * m[i][j];
      }
  }
  return m.map((r) => r[3]);
}
function support(points, cohort) {
  return sides.every((side) => {
    const a = points.filter((p) => p.side === side && p.cohort === cohort).map((p) => p.along);
    return a.length >= 8 && Math.max(...a) - Math.min(...a) >= (horizontal(side) ? 300 : 210);
  });
}
/** Analysis only. Preserve the axis ratio as a diagnostic: an affine fit can
 * remove both scanning distortion and source aspect error, and cannot tell
 * those causes apart. Never use its stretch to certify frame-stock geometry. */
export function fitAffineScan(anchors, target, simpler) {
  if (simpler.accepted) return simpler;
  const points = anchors.points;
  if (!target.reliable || !support(points, 'fit') || !support(points, 'validation')) return simpler;
  let fit = points.filter((p) => p.cohort === 'fit'),
    transform;
  const residual = (p, t) => {
    const q = projectScanPoint(p.x, p.y, t);
    return q[horizontal(p.side) ? 0 : 1] - target.sides[p.side].position;
  };
  for (let round = 0; round < 4; round++) {
    const axis = (h) =>
      solve(
        fit
          .filter((p) => horizontal(p.side) === h)
          .map((p) => [[p.x - 244, p.y - 340, 1], target.sides[p.side].position - (h ? 244 : 340)]),
      );
    const x = axis(true),
      y = axis(false);
    if (!x || !y) return simpler;
    transform = { matrix: [x[0], y[0], x[1], y[1], x[2], y[2]] };
    const limits = Object.fromEntries(
      sides.map((side) => {
        const a = fit.filter((p) => p.side === side).map((p) => residual(p, transform)),
          center = median(a);
        return [
          side,
          { center, limit: Math.max(0.75, 4.5 * median(a.map((v) => Math.abs(v - center)))) },
        ];
      }),
    );
    const kept = fit.filter(
      (p) => Math.abs(residual(p, transform) - limits[p.side].center) <= limits[p.side].limit,
    );
    if (kept.length === fit.length) break;
    if (!support(kept, 'fit')) return simpler;
    fit = kept;
  }
  const [a, b, c, d, tx, ty] = transform.matrix;
  const sx = Math.hypot(a, b),
    sy = Math.hypot(c, d),
    rotationDegrees = (Math.atan2(b - c, a + d) * 180) / Math.PI,
    skewDegrees = (Math.atan2(b + c, a + d) * 180) / Math.PI;
  const validation = points.filter((p) => p.cohort === 'validation'),
    errors = validation.map((p) => residual(p, transform));
  const sideErrors = Object.fromEntries(
    sides.map((side) => {
      const v = validation.filter((p) => p.side === side).map((p) => residual(p, transform));
      return [side, { rms: rms(v), p90: quantile(v.map(Math.abs), 0.9), bias: median(v) }];
    }),
  );
  const bounded =
    Math.abs(sx - 1) <= 0.03 &&
    Math.abs(sy - 1) <= 0.03 &&
    Math.abs(tx) <= 6 &&
    Math.abs(ty) <= 6 &&
    Math.abs(rotationDegrees) <= 0.6 &&
    Math.abs(skewDegrees) <= 0.4;
  const consistent = rms(errors) <= 0.8 && Object.values(sideErrors).every((s) => s.p90 <= 1.25);
  const before = Math.min(
    ...simpler.candidates.filter((c) => c.validation).map((c) => c.validation.rms),
  );
  const gain = before - rms(errors),
    accepted = bounded && consistent && gain >= Math.max(0.15, before * 0.2);
  if (!accepted)
    return {
      ...simpler,
      affineCandidate: {
        accepted: false,
        parameters: { sx, sy, tx, ty, rotationDegrees, skewDegrees },
        validationRms: rms(errors),
      },
    };
  return {
    accepted: true,
    reason: null,
    model: 'affine-comparison-only',
    transform,
    inverse: inverseScanMatrix(transform),
    parameters: { sx, sy, tx, ty, rotationDegrees, skewDegrees, axisRatio: sx / sy },
    validation: { rms: rms(errors), sides: sideErrors },
    uniformRejected: simpler.reason,
    aspectDiagnostic:
      'Axis ratio combines scan distortion and source-frame aspect. Inspect repeated per-set residuals separately; this is not a runtime correction.',
  };
}
