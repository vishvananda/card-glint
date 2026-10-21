// Joint comparison-only affine fit. Parameters are scaled to canonical pixels;
// held strips are evaluated only after optimization, never in its objective.
import { fitGradientProfiles, profileSupport, bounded } from './scan-gradient-fit.mjs';
import { patchGradient, patchSupport } from './frame-patch-profiles.mjs';
const sample = (a, x) => {
  const i = Math.floor(x),
    f = x - i;
  return (a[i] ?? 0) * (1 - f) + (a[i + 1] ?? 0) * f;
};
const matrix = (q) => [1 + q[0] / 244, q[1] / 244, q[2] / 340, 1 + q[3] / 340, q[4], q[5]];
const variables = (m) => [(m[0] - 1) * 244, m[1] * 244, m[2] * 340, (m[3] - 1) * 340, m[4], m[5]];
function parameters(m) {
  const [a, b, c, d, tx, ty] = m,
    sx = Math.hypot(a, b),
    sy = (a * d - b * c) / sx;
  return {
    sx,
    sy,
    tx,
    ty,
    rotation: (Math.atan2(b, a) * 180) / Math.PI,
    shear: (Math.atan((a * c + b * d) / (sx * sy)) * 180) / Math.PI,
  };
}
function residuals(profiles, templates, q, patches, patchTemplates) {
  const m = matrix(q),
    result = [];
  if (patches) {
    for (let i = 0; i < patches.length; i++) {
      const a = patchGradient(patches[i], { matrix: m }),
        b = patchTemplates[i].gradient,
        an = Math.hypot(...a),
        bn = Math.hypot(...b);
      if (a.length !== b.length) throw Error('Frame feature identity differs');
      for (let j = 0; j < a.length; j++)
        result.push(an * an < 10 || bn * bn < 10 ? 1 / Math.sqrt(a.length) : a[j] / an - b[j] / bn);
    }
    return result;
  }
  for (let i = 0; i < templates.length; i++) {
    const p = profiles[i],
      t = templates[i],
      horizontal = p.axis === 'x',
      center = horizontal ? 244 : 340,
      alongCenter = horizontal ? 340 : 244;
    const scale = m[horizontal ? 0 : 3],
      shift = m[horizontal ? 4 : 5] + m[horizontal ? 2 : 1] * (p.along - alongCenter);
    const a = [],
      b = [];
    for (let x = t.lo; x <= t.hi; x++) {
      a.push(sample(p.gradient, center + (x - center - shift) / scale - p.start));
      b.push(sample(t.gradient, x - t.start));
    }
    const an = Math.hypot(...a),
      bn = Math.hypot(...b);
    // Preserve the raw-signal rejection of profileSupport. A deficient strip
    // contributes a fixed penalty rather than gaining weight from normalization.
    for (let j = 0; j < a.length; j++)
      result.push(an * an < 10 || bn * bn < 10 ? 1 / Math.sqrt(a.length) : a[j] / an - b[j] / bn);
  }
  return result;
}
const squared = (r) => r.reduce((s, x) => s + x * x, 0);
function solve(A, b) {
  const rows = A.map((r, i) => [...r, b[i]]),
    n = b.length;
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let j = i + 1; j < n; j++) if (Math.abs(rows[j][i]) > Math.abs(rows[pivot][i])) pivot = j;
    [rows[i], rows[pivot]] = [rows[pivot], rows[i]];
    if (!Number.isFinite(rows[i][i]) || Math.abs(rows[i][i]) < 1e-14) return null;
    const d = rows[i][i];
    for (let k = i; k <= n; k++) rows[i][k] /= d;
    for (let j = 0; j < n; j++)
      if (j !== i) {
        const s = rows[j][i];
        for (let k = i; k <= n; k++) rows[j][k] -= s * rows[i][k];
      }
  }
  const x = rows.map((r) => r[n]);
  return x.every(Number.isFinite) ? x : null;
}
function optimize(profiles, templates, start, patches, patchTemplates) {
  let q = variables(start),
    r = residuals(profiles, templates, q, patches, patchTemplates),
    loss = squared(r),
    lambda = 0.001,
    iterations = 0,
    acceptedSteps = 0;
  for (; iterations < 70; iterations++) {
    // Central differences in canonical-pixel variables avoid the poorly
    // conditioned angle/scale/translation coordinate search used by older fits.
    const h = 0.015,
      J = [];
    for (let j = 0; j < 6; j++) {
      const lo = [...q],
        hi = [...q];
      lo[j] -= h;
      hi[j] += h;
      const a = residuals(profiles, templates, lo, patches, patchTemplates),
        b = residuals(profiles, templates, hi, patches, patchTemplates);
      J.push(a.map((x, i) => (b[i] - x) / (2 * h)));
    }
    const A = Array.from({ length: 6 }, () => Array(6).fill(0)),
      g = Array(6).fill(0);
    for (let j = 0; j < 6; j++)
      for (let i = 0; i < r.length; i++) {
        g[j] += J[j][i] * r[i];
        for (let k = 0; k < 6; k++) A[j][k] += J[j][i] * J[k][i];
      }
    for (let j = 0; j < 6; j++) A[j][j] += lambda * (A[j][j] + 1e-8);
    const delta = solve(
      A,
      g.map((x) => -x),
    );
    if (!delta) break;
    const cap = Math.max(1, Math.max(...delta.map(Math.abs)) / 2),
      next = q.map((x, j) => x + delta[j] / cap);
    const p = parameters(matrix(next));
    if (!bounded(p)) {
      lambda *= 10;
      if (lambda > 1e9) break;
      continue;
    }
    const nr = residuals(profiles, templates, next, patches, patchTemplates),
      nl = squared(nr);
    if (nl < loss - 1e-12) {
      q = next;
      r = nr;
      loss = nl;
      acceptedSteps++;
      lambda = Math.max(1e-9, lambda / 3);
      if (Math.hypot(...delta) / cap < 0.001) break;
    } else {
      lambda *= 10;
      if (lambda > 1e9) break;
    }
  }
  return {
    parameters: parameters(matrix(q)),
    transform: { matrix: matrix(q) },
    loss,
    iterations,
    acceptedSteps,
  };
}
export function fitModernAffine(row, study) {
  const legacy = fitGradientProfiles(row, study);
  const starts = [
    [1, 0, 0, 1, 0, 0],
    ...(row.patches
      ? [legacy.candidates.at(-1).transform.matrix]
      : legacy.candidates.map((c) => c.transform.matrix)),
  ];
  const seeds = starts.filter(
    (m, i) => starts.findIndex((p) => p.every((x, j) => Math.abs(x - m[j]) < 1e-9)) === i,
  );
  const fits = seeds.map((m) =>
    optimize(row.profiles, study.template, m, row.patches, study.patchTemplate),
  );
  fits.sort((a, b) => a.loss - b.loss);
  const chosen = fits[0];
  const fit = row.patches
    ? patchSupport(row.patches, study.patchTemplate, chosen.transform)
    : profileSupport(row.profiles, study.template, chosen.parameters, { residuals: true });
  const validation = row.patches
    ? patchSupport(row.independentPatches, study.independentPatchTemplate, chosen.transform)
    : profileSupport(row.independentProfiles, study.independentTemplate, chosen.parameters, {
        residuals: true,
      });
  return {
    model: row.patches ? 'affine-joint-2d' : 'affine-joint',
    accepted: fit.accepted && validation.accepted && bounded(chosen.parameters),
    transform: chosen.transform,
    parameters: chosen.parameters,
    fit,
    validation,
    optimization: {
      loss: chosen.loss,
      iterations: chosen.iterations,
      acceptedSteps: chosen.acceptedSteps,
      starts: fits.map(({ loss, iterations, acceptedSteps }) => ({
        loss,
        iterations,
        acceptedSteps,
      })),
    },
    candidates: legacy.candidates,
  };
}
