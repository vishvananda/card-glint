import { luminance, WIDTH, HEIGHT } from './pixels-pure.mjs';
import { median, quantile } from './metrics.mjs';

export const PLATE_REGISTRATION_VERSION = 'shared-plate-gradient-v1';

/** Bake study placement into the reference geometry. Runtime scan registration
 * fits one transform to these templates; it does not apply a second set offset. */
export function alignedScanTemplates(templates, transform) {
  return Object.fromEntries(
    Object.entries(templates).map(([material, profiles]) => [
      material,
      profiles.map((p) => {
        const center = p.axis === 'x' ? WIDTH / 2 : HEIGHT / 2;
        const shift = p.axis === 'x' ? transform.tx : transform.ty;
        return {
          ...p,
          gradient: p.gradient.map((_, i) =>
            sample(p.gradient, center + (p.start + i - center - shift) / transform.scale - p.start),
          ),
        };
      }),
    ]),
  );
}

/** Fixed calibration-scan templates. Scan fits never target renderer geometry. */
export function canonicalScanProfiles(rows) {
  const calibration = rows.filter((r) => r.cohort === 'calibration');
  return Object.fromEntries(
    [...new Set(calibration.map((r) => r.material))].map((material) => {
      const group = calibration.filter((r) => r.material === material);
      return [
        material,
        group[0].profiles.map((p, i) => ({
          ...p,
          gradient: p.gradient.map((_, j) => median(group.map((r) => r.profiles[i].gradient[j]))),
        })),
      ];
    }),
  );
}

export function fitScanResidual(profiles, template) {
  if (!template?.length || profiles.length !== template.length)
    return {
      accepted: false,
      reason: 'No fixed reference-frame template for this material.',
      transform: null,
    };
  const score = (axis, scale, shift) =>
    median(
      template.flatMap((p, i) =>
        p.axis === axis ? [similarity(profiles[i], p, scale, shift)].filter((v) => v !== null) : [],
      ),
    );
  const range = (lo, step, n) => Array.from({ length: n }, (_, i) => lo + i * step);
  const search = (scales, xs, ys) => {
    let best = { score: -Infinity };
    for (const scale of scales) {
      const axes = ['x', 'y'].map(
        (axis, i) =>
          (i ? ys : xs)
            .map((shift) => ({ shift, score: score(axis, scale, shift) ?? -1 }))
            .sort((a, b) => b.score - a.score)[0],
      );
      const value = (axes[0].score + axes[1].score) / 2;
      if (value > best.score) best = { score: value, scale, tx: axes[0].shift, ty: axes[1].shift };
    }
    return best;
  };
  const coarse = search(range(0.994, 0.001, 13), range(-3, 0.25, 25), range(-3, 0.25, 25));
  const fine = search(
    range(coarse.scale - 0.0005, 0.0001, 11),
    range(coarse.tx - 0.125, 0.025, 11),
    range(coarse.ty - 0.125, 0.025, 11),
  );
  const matches = template.map((p, i) =>
    similarity(profiles[i], p, fine.scale, p.axis === 'x' ? fine.tx : fine.ty),
  );
  const sides = Object.fromEntries(
    Object.keys(windows).map((side) => [
      side,
      median(matches.filter((v, i) => template[i].side === side && v !== null)),
    ]),
  );
  const bounded =
    Math.abs(fine.scale - 1) < 0.006 && Math.abs(fine.tx) < 3 && Math.abs(fine.ty) < 3;
  const confident =
    matches.filter((v) => v !== null).length >= 10 &&
    Object.values(sides).every((v) => v !== null && v >= 0.5) &&
    fine.score >= 0.7;
  return {
    accepted: bounded && confident,
    reason: !bounded
      ? 'Scan alignment reached its search bound.'
      : !confident
        ? 'Frame edges do not support a reliable scan alignment.'
        : null,
    transform: bounded && confident ? { scale: fine.scale, tx: fine.tx, ty: fine.ty } : null,
    proposed: { scale: fine.scale, tx: fine.tx, ty: fine.ty },
    before: (score('x', 1, 0) + score('y', 1, 0)) / 2,
    after: fine.score,
    sides,
    policy:
      'Bounded translation and uniform scale against fixed calibration-scan template; no text, art or renderer-frame fitting.',
  };
}

export function composeScanTransform(shared, residual) {
  return {
    scale: shared.scale * residual.scale,
    tx: shared.tx + shared.scale * residual.tx,
    ty: shared.ty + shared.scale * residual.ty,
    rotation: 0,
  };
}
// Blank ABU source geometry: keep the narrow plate bevel and its adjacent
// shadow, excluding the bitmap's faint outer rectangular edge. Neither art
// nor lettering enters these strips. Coordinates are frozen for every color.
const windows = {
  left: ['x', 23, 36, [150, 300, 530]],
  right: ['x', 453, 466, [150, 300, 530]],
  top: ['y', 25, 38, [100, 244, 388]],
  bottom: ['y', 640, 653, [100, 244, 388]],
};
const sample = (a, x) => {
  const i = Math.floor(x),
    f = x - i;
  return (a[i] ?? 0) * (1 - f) + (a[i + 1] ?? 0) * f;
};
export function plateProfiles(image) {
  if (image.width !== WIDTH || image.height !== HEIGHT) throw Error('Expected canonical raster');
  const gray = luminance(image);
  return Object.entries(windows).flatMap(([side, [axis, lo, hi, positions]]) =>
    positions.map((along) => {
      const start = lo - 14,
        values = [];
      for (let p = start - 1; p <= hi + 15; p++) {
        let sum = 0;
        for (let a = along - 22; a <= along + 22; a++)
          sum += gray[(axis === 'x' ? a : p) * WIDTH + (axis === 'x' ? p : a)];
        values.push(sum / 45);
      }
      return {
        side,
        axis,
        lo,
        hi,
        along,
        start,
        gradient: values.slice(1, -1).map((_, i) => (values[i + 2] - values[i]) / 2),
      };
    }),
  );
}
function similarity(reference, target, scale, shift) {
  const center = target.axis === 'x' ? WIDTH / 2 : HEIGHT / 2;
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let p = target.lo; p <= target.hi; p++) {
    const a = sample(reference.gradient, center + (p - center - shift) / scale - reference.start);
    const b = sample(target.gradient, p - target.start);
    dot += a * b;
    aa += a * a;
    bb += b * b;
  }
  return aa < 10 || bb < 10 ? null : dot / Math.sqrt(aa * bb);
}
export function plateDiagnostic(reference, target) {
  const a = plateProfiles(reference),
    b = plateProfiles(target);
  const values = b.map((p, i) => similarity(a[i], p, 1, 0));
  const sides = Object.fromEntries(
    Object.keys(windows).map((side) => [
      side,
      median(values.filter((v, i) => b[i].side === side && v !== null)),
    ]),
  );
  const measured = values.filter((v) => v !== null);
  return {
    method: PLATE_REGISTRATION_VERSION,
    sides,
    medianCorrelation: median(measured),
    measuredLandmarks: measured.length,
    uncertain: measured.length < 10 || median(measured) < 0.55,
    geometryMismatch: Object.values(sides).some((v) => v === null || v < 0.3),
  };
}
export function fitSharedPlateRegistration(rows, targets) {
  const cal = rows.filter((r) => r.cohort === 'calibration'),
    held = rows.filter((r) => r.cohort === 'validation');
  const materials = [...new Set(cal.map((r) => r.material))];
  if (
    materials.length < 3 ||
    materials.some(
      (m) =>
        cal.filter((r) => r.material === m).length < 2 ||
        held.filter((r) => r.material === m).length < 2,
    )
  )
    return { status: 'insufficient-plate-cohort', accepted: false, transform: null };
  const cardScore = (row, axis, scale, shift) => {
    const target = targets[row.material];
    return median(
      target.flatMap((p, i) =>
        p.axis === axis
          ? [similarity(row.profiles[i], p, scale, shift)].filter((v) => v !== null)
          : [],
      ),
    );
  };
  const axisScore = (axis, scale, shift) =>
    median(
      materials.map((m) =>
        median(cal.filter((r) => r.material === m).map((r) => cardScore(r, axis, scale, shift))),
      ),
    );
  const search = (scales, shiftsX, shiftsY) => {
    let best = { score: -Infinity };
    for (const scale of scales) {
      const axes = ['x', 'y'].map(
        (axis, i) =>
          (i ? shiftsY : shiftsX)
            .map((shift) => ({ shift, score: axisScore(axis, scale, shift) }))
            .sort((a, b) => b.score - a.score)[0],
      );
      const score = (axes[0].score + axes[1].score) / 2;
      if (score > best.score) best = { score, scale, tx: axes[0].shift, ty: axes[1].shift };
    }
    return best;
  };
  const range = (lo, step, n) => Array.from({ length: n }, (_, i) => lo + i * step);
  const coarse = search(range(0.985, 0.001, 31), range(-5, 0.25, 41), range(-5, 0.25, 41));
  const fine = search(
    range(coarse.scale - 0.001, 0.0002, 11),
    range(coarse.tx - 0.25, 0.05, 11),
    range(coarse.ty - 0.25, 0.05, 11),
  );
  const proposed = { scale: fine.scale, tx: fine.tx, ty: fine.ty };
  const measure = (cohort) => {
    const measured = cohort.map((r) => {
      const before = (cardScore(r, 'x', 1, 0) + cardScore(r, 'y', 1, 0)) / 2;
      const after =
        (cardScore(r, 'x', fine.scale, fine.tx) + cardScore(r, 'y', fine.scale, fine.ty)) / 2;
      return { id: r.id, material: r.material, before, after };
    });
    return {
      count: measured.length,
      before: median(measured.map((r) => r.before)),
      after: median(measured.map((r) => r.after)),
      p10: quantile(
        measured.map((r) => r.after),
        0.1,
      ),
      regressed: measured.filter((r) => r.after < r.before - 0.1).length,
      rows: measured,
    };
  };
  const calibration = measure(cal),
    validation = measure(held),
    flags = [];
  if (Math.abs(fine.scale - 1) >= 0.015 || Math.abs(fine.tx) >= 5 || Math.abs(fine.ty) >= 5)
    flags.push('out-of-bounds');
  for (const [name, result] of [
    ['calibration', calibration],
    ['validation', validation],
  ]) {
    if (result.after < 0.65 || result.p10 < 0.4) flags.push(name + '-weak-match');
    if (result.after < result.before - 0.01 || result.regressed / result.count > 0.25)
      flags.push(name + '-regression');
  }
  return {
    status: flags.length ? 'rejected' : 'accepted',
    accepted: !flags.length,
    transform: flags.length ? null : proposed,
    proposed,
    flags,
    calibration,
    validation,
  };
}
