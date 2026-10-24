import { profileMatrix, profileSupport, bounded } from './scan-gradient-fit.mjs';
import { inverseScanMatrix, projectScanPoint } from './scan-transform.mjs';
const sides = ['left', 'right', 'top'];
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
/** Comparison-only vertical correction. Corner observations and three source
 * edges are the objective; no rendered pixels, illustration or text enter it. */
export function fitVerticalAnchors({ parameters, groups, templates, corners, targets }) {
  if (corners.length !== 2 || targets.length !== 2 || groups.length !== 3 || templates.length !== 3)
    throw Error('Expected two corners and three independent profile groups');
  const original = { ...parameters },
    inverse = { matrix: inverseScanMatrix({ matrix: profileMatrix(original) }) };
  const raw = corners.map((c) => projectScanPoint(c.x, c.y, inverse));
  const angle = (original.rotation * Math.PI) / 180,
    s = Math.sin(angle),
    c = Math.cos(angle),
    k = Math.tan((original.shear * Math.PI) / 180);
  const desired = mean(targets.map((t) => t.point[1]));
  const verticalCoefficient = mean(raw.map((p) => (s * k + c) * (p[1] - 340)));
  const constant = 340 + original.sx * s * mean(raw.map((p) => p[0] - 244));
  if (Math.abs(verticalCoefficient) < 200)
    throw Error('Corner baseline is too close to the center');
  const evaluate = (sy) => {
    const p = { ...original, sy, ty: desired - constant - sy * verticalCoefficient };
    if (!bounded(p)) return;
    const fit = profileSupport(groups[0], templates[0], p);
    const score = mean(sides.map((side) => fit.sides[side]));
    return { parameters: p, objective: score };
  };
  let best;
  const consider = (sy) => {
    const r = evaluate(sy);
    if (r && (!best || r.objective > best.objective)) best = r;
  };
  for (let n = -120; n <= 120; n++) consider(original.sy + n * 0.0001);
  if (!best) throw Error('No bounded vertical-anchor candidate');
  const coarse = best.parameters.sy;
  for (let n = -15; n <= 15; n++) consider(coarse + n * 0.00001);
  const p = best.parameters,
    transform = { matrix: profileMatrix(p) };
  const supports = groups.map((g, i) => profileSupport(g, templates[i], p, { residuals: true }));
  const prior = groups.map((g, i) =>
    profileSupport(g, templates[i], original, { residuals: true }),
  );
  const checks = supports.map((v, i) => ({
    minThreeSide: Math.min(...sides.map((side) => v.sides[side])),
    top: v.sides.top,
    topLoss: prior[i].sides.top - v.sides.top,
    sideLoss: Math.max(...sides.map((side) => prior[i].sides[side] - v.sides[side])),
    residualRms: Math.sqrt(
      mean(v.matches.filter((m) => m.side !== 'bottom').map((m) => m.residual * m.residual)),
    ),
  }));
  const projected = raw.map((p, i) => {
    const q = projectScanPoint(...p, transform);
    return {
      id: targets[i].id,
      x: q[0],
      y: q[1],
      residual: Math.hypot(q[0] - targets[i].point[0], q[1] - targets[i].point[1]),
    };
  });
  return {
    parameters: p,
    transform,
    priorParameters: original,
    sourceCorners: raw,
    projected,
    supports,
    priorSupport: prior,
    checks,
    numericalPass:
      checks.every(
        (r) =>
          r.minThreeSide >= 0.6 &&
          r.top >= 0.9 &&
          r.topLoss <= 0.02 &&
          r.sideLoss <= 0.03 &&
          r.residualRms <= 0.5,
      ) && projected.every((p) => p.residual <= 1),
    scope:
      'Only sy/ty change; x scale, rotation and shear remain fixed. Fit group chooses the maximum three-side objective subject to the paired corner baseline. Other groups are untouched validation/certification.',
  };
}
