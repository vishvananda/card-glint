import { median } from './metrics.mjs';
const sides = ['left', 'right', 'top', 'bottom'];
const sample = (a, x) => {
  const i = Math.floor(x),
    f = x - i;
  return (a[i] ?? 0) * (1 - f) + (a[i + 1] ?? 0) * f;
};
export function profileMatrix(p) {
  const c = Math.cos((p.rotation * Math.PI) / 180),
    s = Math.sin((p.rotation * Math.PI) / 180),
    k = Math.tan((p.shear * Math.PI) / 180);
  return [p.sx * c, p.sx * s, p.sy * (c * k - s), p.sy * (s * k + c), p.tx, p.ty];
}
function match(p, t, m, delta = 0) {
  const horizontal = p.axis === 'x',
    center = horizontal ? 244 : 340,
    alongCenter = horizontal ? 340 : 244;
  const scale = m[horizontal ? 0 : 3],
    shift = m[horizontal ? 4 : 5] + m[horizontal ? 2 : 1] * (p.along - alongCenter) + delta;
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let x = t.lo; x <= t.hi; x++) {
    const a = sample(p.gradient, center + (x - center - shift) / scale - p.start),
      b = sample(t.gradient, x - t.start);
    dot += a * b;
    aa += a * a;
    bb += b * b;
  }
  return aa < 10 || bb < 10 ? null : Math.max(-1, Math.min(1, dot / Math.sqrt(aa * bb)));
}
export function profileSupport(profiles, template, parameters, { residuals = false } = {}) {
  const matrix = Array.isArray(parameters) ? parameters : profileMatrix(parameters);
  const matches = profiles.map((p, i) => {
    const t = template[i];
    if (!t || p.side !== t.side || p.along !== t.along) throw Error('Profile identity differs');
    const score = match(p, t, matrix);
    let best = { score: score ?? -1, delta: 0 };
    if (residuals && score !== null) {
      for (let delta = -3; delta <= 3.001; delta += 0.1) {
        const s = match(p, t, matrix, delta);
        if (s !== null && s > best.score) best = { score: s, delta };
      }
    }
    return {
      side: p.side,
      along: p.along,
      score,
      ...(residuals ? { residual: best.delta, bestScore: best.score } : {}),
    };
  });
  const bySide = Object.fromEntries(
    sides.map((side) => [
      side,
      median(matches.filter((r) => r.side === side).map((r) => r.score ?? -1)),
    ]),
  );
  const confidence = sides.reduce((n, side) => n + bySide[side], 0) / 4;
  const finite = matches.filter((r) => r.score !== null);
  const objective =
    sides.reduce((n, side) => {
      const scores = matches.filter((r) => r.side === side).map((r) => r.score ?? -1);
      return n + scores.reduce((a, b) => a + b, 0) / scores.length;
    }, 0) / 4;
  return {
    confidence,
    objective,
    sides: bySide,
    count: finite.length,
    accepted: finite.length >= 8 && confidence >= 0.7 && sides.every((s) => bySide[s] >= 0.5),
    ...(residuals
      ? {
          residualRms: Math.sqrt(
            finite.reduce((n, r) => n + r.residual * r.residual, 0) / finite.length,
          ),
          matches,
        }
      : {}),
  };
}
export const bounded = (p) =>
  Math.abs(p.sx - 1) < 0.03 &&
  Math.abs(p.sy - 1) < 0.03 &&
  Math.abs(p.tx) < 6 &&
  Math.abs(p.ty) < 6 &&
  Math.abs(p.rotation) < 0.6 &&
  Math.abs(p.shear) < 0.4;
function optimize(profiles, template, start, model) {
  const keys =
    model === 'affine'
      ? ['tx', 'ty', 'sx', 'sy', 'rotation', 'shear']
      : model === 'similarity'
        ? ['tx', 'ty', 'scale', 'rotation']
        : ['tx', 'ty', 'scale'];
  let p = { ...start },
    score = profileSupport(profiles, template, p).objective;
  for (const step of [1, 0.4, 0.15, 0.05]) {
    let changed = true,
      round = 0;
    while (changed && round++ < 25) {
      changed = false;
      for (const key of keys)
        for (const sign of [-1, 1]) {
          const q = { ...p },
            delta =
              sign *
              step *
              (key === 'scale' || key === 'sx' || key === 'sy'
                ? 0.001
                : key === 'rotation' || key === 'shear'
                  ? 0.1
                  : 1);
          if (key === 'scale') {
            q.sx += delta;
            q.sy += delta;
          } else q[key] += delta;
          if (!bounded(q)) continue;
          const v = profileSupport(profiles, template, q).objective;
          if (v > score + 1e-9) {
            p = q;
            score = v;
            changed = true;
          }
        }
    }
  }
  return p;
}
// Search independent x/y scale and shift before local refinement. This avoids
// inheriting a wrong bevel peak from the legacy median-based uniform seed.
function independentSeed(profiles, template) {
  const p = { sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 };
  for (const axis of ['x', 'y']) {
    const pair = axis === 'x' ? ['left', 'right'] : ['top', 'bottom'];
    let best = { score: -Infinity };
    for (let si = -6; si <= 6; si++)
      for (let ti = -6; ti <= 6; ti++) {
        const q = {
          ...p,
          [axis === 'x' ? 'sx' : 'sy']: 1 + si * 0.002,
          [axis === 'x' ? 'tx' : 'ty']: ti * 0.5,
        };
        const m = profileMatrix(q);
        const scores = profiles.flatMap((a, i) =>
          pair.includes(a.side) ? [match(a, template[i], m) ?? -1] : [],
        );
        const score = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (score > best.score) best = { score, q };
      }
    Object.assign(p, best.q);
  }
  return p;
}

/** Comparison-only models. Source profiles are frozen before searching. Each
 * extra degree of freedom must improve independent strips by a measurable
 * subpixel amount; the renderer never receives these parameters. */
export function fitGradientProfiles(row, study) {
  const start = row.fit.proposed ?? row.fit.transform ?? { scale: 1, tx: 0, ty: 0 };
  const initial = {
    sx: start.scale,
    sy: start.scale,
    tx: start.tx,
    ty: start.ty,
    rotation: 0,
    shear: 0,
  };
  const choose = (list) =>
    list.sort(
      (a, b) =>
        profileSupport(row.profiles, study.template, b).objective -
        profileSupport(row.profiles, study.template, a).objective,
    )[0];
  const wide = study.search === 'independent-axis-seed-v1';
  const uniform = wide
    ? choose(
        [initial, { sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 }].map((p) =>
          optimize(row.profiles, study.template, p, 'uniform'),
        ),
      )
    : optimize(row.profiles, study.template, initial, 'uniform');
  const similarity = optimize(row.profiles, study.template, uniform, 'similarity');
  const affine = wide
    ? choose(
        [similarity, independentSeed(row.profiles, study.template)].map((p) =>
          optimize(row.profiles, study.template, p, 'affine'),
        ),
      )
    : optimize(row.profiles, study.template, similarity, 'affine');
  const candidates = [
    ['uniform', uniform],
    ['similarity', similarity],
    ['affine', affine],
  ].map(([model, parameters]) => ({
    model,
    parameters,
    transform: { matrix: profileMatrix(parameters) },
    fit: profileSupport(row.profiles, study.template, parameters, {
      residuals: true,
    }),
    validation: profileSupport(row.independentProfiles, study.independentTemplate, parameters, {
      residuals: true,
    }),
  }));
  const chosen = selectGradientCandidate(candidates);
  return {
    model: chosen.model,
    accepted: chosen.fit.accepted && chosen.validation.accepted,
    transform: chosen.transform,
    parameters: chosen.parameters,
    fit: chosen.fit,
    validation: chosen.validation,
    candidates,
  };
}

/** Replayed by the server when validating browser-produced evidence. */
export function selectGradientCandidate(candidates) {
  let chosen = candidates[0];
  for (const c of candidates.slice(1)) {
    const gain = chosen.validation.residualRms - c.validation.residualRms;
    c.gainFromSimpler = gain;
    c.admitted =
      c.fit.accepted &&
      c.validation.accepted &&
      bounded(c.parameters) &&
      c.fit.residualRms <= chosen.fit.residualRms &&
      c.validation.objective >= chosen.validation.objective + 0.001 &&
      gain >= Math.max(0.05, chosen.validation.residualRms * 0.25);
    if (c.admitted) chosen = c;
  }
  return chosen;
}
