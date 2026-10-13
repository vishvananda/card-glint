import { median, quantile } from './metrics.mjs';

export const OLD_FRAME_REGISTRATION_VERSION = 'old-frame-shared-similarity-v1';
const sides = ['left', 'right', 'top', 'bottom'];
const horizontal = (side) => side === 'left' || side === 'right';
const center = (bounds, axis) =>
  axis === 'x'
    ? (bounds.sides.left.position + bounds.sides.right.position) / 2
    : (bounds.sides.top.position + bounds.sides.bottom.position) / 2;
const rms = (values) => Math.sqrt(values.reduce((sum, v) => sum + v * v, 0) / values.length);
const usable = (bounds) =>
  bounds?.reliable &&
  bounds.width > 0 &&
  bounds.height > 0 &&
  sides.every((side) => Number.isFinite(bounds.sides[side].position));

/** One uniform scan transform, fitted to the retained painter's outer stock
 * boundaries only. Source-frame aspect differences remain signed residuals;
 * neither a text edge nor an individual scan gets its own transform. */
export function fitSharedStockRegistration(rows, targets) {
  const eligible = rows.filter((r) => usable(r.bounds) && usable(targets[r.material]));
  const calibration = eligible.filter((r) => r.cohort === 'calibration');
  const validation = eligible.filter((r) => r.cohort === 'validation');
  const materials = [...new Set(calibration.map((r) => r.material))].sort();
  const materialCounts = Object.fromEntries(
    materials.map((m) => [
      m,
      {
        calibration: calibration.filter((r) => r.material === m).length,
        validation: validation.filter((r) => r.material === m).length,
      },
    ]),
  );
  if (
    calibration.length < 6 ||
    validation.length < 6 ||
    materials.length < 3 ||
    Object.values(materialCounts).some((c) => c.calibration < 2 || c.validation < 2)
  )
    return {
      status: 'insufficient-outer-anchors',
      accepted: false,
      transform: null,
      counts: { calibration: calibration.length, validation: validation.length, materialCounts },
      excluded: rows.length - eligible.length,
    };

  // Equal material weight prevents a set's color distribution from moving its
  // registration. Medians within each material suppress scan outliers. The
  // least-squares scale uses both axes; translation uses the same frozen sample.
  const summaries = materials.map((material) => {
    const group = calibration.filter((r) => r.material === material);
    return {
      source: {
        width: median(group.map((r) => r.bounds.width)),
        height: median(group.map((r) => r.bounds.height)),
        x: median(group.map((r) => center(r.bounds, 'x'))),
        y: median(group.map((r) => center(r.bounds, 'y'))),
      },
      target: targets[material],
    };
  });
  const numerator = summaries.reduce(
      (sum, r) => sum + r.source.width * r.target.width + r.source.height * r.target.height,
      0,
    ),
    denominator = summaries.reduce((sum, r) => sum + r.source.width ** 2 + r.source.height ** 2, 0),
    scale = numerator / denominator;
  const proposed = {
    scale,
    tx: median(summaries.map((r) => center(r.target, 'x') - 244 - scale * (r.source.x - 244))),
    ty: median(summaries.map((r) => center(r.target, 'y') - 340 - scale * (r.source.y - 340))),
  };
  const measure = (cohort) => {
    const measured = cohort.map((r) => {
      const target = targets[r.material];
      const before = {},
        after = {};
      for (const side of sides) {
        const origin = horizontal(side) ? 244 : 340;
        const shift = horizontal(side) ? proposed.tx : proposed.ty;
        const a = r.bounds.sides[side].position,
          b = target.sides[side].position;
        before[side] = a - b;
        after[side] = origin + scale * (a - origin) + shift - b;
      }
      return {
        id: r.id,
        material: r.material,
        beforeRms: rms(Object.values(before)),
        afterRms: rms(Object.values(after)),
        before,
        after,
      };
    });
    const residuals = Object.fromEntries(
      sides.map((side) => [side, median(measured.map((r) => r.after[side]))]),
    );
    return {
      count: measured.length,
      beforeRms: median(measured.map((r) => r.beforeRms)),
      afterRms: median(measured.map((r) => r.afterRms)),
      afterP90: quantile(
        measured.map((r) => r.afterRms),
        0.9,
      ),
      worstRegression: Math.max(...measured.map((r) => r.afterRms - r.beforeRms)),
      regressed: measured.filter((r) => r.afterRms > r.beforeRms + 0.25).length,
      residuals,
      scatter: Object.fromEntries(
        sides.map((side) => [
          side,
          median(measured.map((r) => Math.abs(r.after[side] - residuals[side]))),
        ]),
      ),
      rows: measured,
    };
  };
  const cal = measure(calibration),
    held = measure(validation),
    flags = [];
  if (Math.abs(scale - 1) > 0.02 || Math.abs(proposed.tx) > 5 || Math.abs(proposed.ty) > 5)
    flags.push('out-of-bounds');
  for (const [cohort, result] of [
    ['calibration', cal],
    ['validation', held],
  ]) {
    if (Math.max(...Object.values(result.scatter)) > 1.5) flags.push(`${cohort}-unstable-anchors`);
    if (result.afterRms > 2 || result.afterP90 > 3) flags.push(`${cohort}-excessive-residual`);
    if (result.afterRms > result.beforeRms + 0.05 || result.regressed / result.count > 0.25)
      flags.push(`${cohort}-regression`);
  }
  const accepted = flags.length === 0;
  return {
    status: accepted ? 'accepted' : 'rejected',
    accepted,
    transform: accepted ? proposed : null,
    proposed,
    flags,
    // This is a source-geometry diagnostic, not grounds for secretly fitting
    // anisotropic scale or changing the measured held-out transform.
    geometryFlags:
      Math.max(...Object.values(cal.residuals).map(Math.abs)) > 1
        ? ['remaining-opposed-stock-residual']
        : [],
    counts: { calibration: calibration.length, validation: validation.length, materialCounts },
    excluded: rows.length - eligible.length,
    calibration: cal,
    validation: held,
  };
}
