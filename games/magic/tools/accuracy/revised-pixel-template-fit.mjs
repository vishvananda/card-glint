/** Reference-only horizontal consensus with a pixel-exact, centered template. */
import assert from 'node:assert/strict';
import { median } from './metrics.mjs';
import { scanMatrix } from './scan-transform.mjs';
import {
  revisedArtifactStrips,
  fitPrintedFrameTranslations,
} from './revised-artifact-normalize.mjs';
import {
  pixelRefinementSteps,
  selectPixelRefinement,
  warpedFrameProfiles,
  refinePrintedFramePixels,
  verifyWarpedFrame,
} from './revised-frame-pixel-fit.mjs';

const fitKeys = ['fitLeft', 'fitRight'];
const pose = (row, dx) => {
  const matrix = scanMatrix(row.stockTransform).slice();
  matrix[4] += dx;
  return { matrix };
};
const templatesAt = (rows, offsets, keys) => {
  const profiles = rows.map((row) =>
    warpedFrameProfiles(row.image, pose(row, offsets.get(row.id)), keys),
  );
  return Object.fromEntries(
    keys.map((key) => [
      key,
      profiles[0][key].map((_, i) => median(profiles.map((p) => p[key][i]))),
    ]),
  );
};
/** Only calibration scans choose templates and the translation gauge.
 * Rebuild after recentering: shifting a gradient array does not reproduce the
 * bilinear sampling and rounding of the scan under the centered transform.
 * Validation poses are fitted once after freezing all templates. */
export function fitCenteredPrintedFramePixels(rows) {
  assert(rows.length >= 4);
  const calibration = rows.filter((r) => r.cohort === 'calibration');
  assert(calibration.length >= 3);
  const observations = rows.map(({ image, ...row }) => ({
    ...row,
    profiles: warpedFrameProfiles(image, row.stockTransform),
  }));
  const coarse = fitPrintedFrameTranslations(observations);
  const offsets = new Map(coarse.rows.map((r) => [r.id, r.interiorDelta.dx]));
  const calibrationIds = new Set(calibration.map((r) => r.id));
  const passes = [];
  const selections = new Map();
  for (let pass = 0; pass < 3; pass++) {
    // Check strips are deliberately absent during parameter selection.
    const fit = templatesAt(calibration, offsets, fitKeys);
    const next = calibration.map((row) => {
      const trials = pixelRefinementSteps.map((delta) => ({
        delta,
        profiles: warpedFrameProfiles(row.image, pose(row, offsets.get(row.id) + delta), fitKeys),
      }));
      const best = selectPixelRefinement(trials, fit);
      const selected = { refinement: best.delta, fitScore: best.score };
      selections.set(row.id, selected);
      return { id: row.id, dx: offsets.get(row.id) + selected.refinement };
    });
    const gauge = median(next.map((r) => r.dx)) || 0;
    for (const row of next) offsets.set(row.id, row.dx - gauge || 0);
    passes.push({ pass, gauge, calibrationMedianDx: median(next.map((r) => offsets.get(r.id))) });
  }
  const templates = templatesAt(calibration, offsets, Object.keys(revisedArtifactStrips));
  const fitted = rows.map(({ image, ...row }) => {
    let dx = offsets.get(row.id),
      selected = selections.get(row.id),
      transform,
      profiles,
      verification;
    if (calibrationIds.has(row.id)) {
      transform = pose(row, dx);
      profiles = warpedFrameProfiles(image, transform);
      verification = verifyWarpedFrame(profiles, templates, { delta: selected.refinement });
    } else {
      selected = refinePrintedFramePixels(image, pose(row, dx), templates);
      dx += selected.refinement;
      ({ transform, profiles } = selected);
      verification = verifyWarpedFrame(profiles, templates, { delta: selected.refinement });
    }
    const bounded = Math.abs(dx) <= 4.75;
    return {
      ...row,
      transform,
      profiles,
      interiorDelta: { dx, dy: 0 },
      finalRefinement: selected.refinement,
      ...verification,
      bounded,
      accepted: bounded && verification.accepted,
    };
  });
  assert.equal(
    median(fitted.filter((r) => r.cohort === 'calibration').map((r) => r.interiorDelta.dx)),
    0,
  );
  return {
    rows: fitted,
    templates,
    passes,
    coarseGauge: coarse.gauge,
    medoid: coarse.medoid,
    calibrationMedianDx: 0,
  };
}

export function physicalRevisedMaterial(entry) {
  const face = entry.face;
  if (face.artifact) return 'A';
  if (face.land) return 'L';
  const colors = face.frameColors ?? face.colors;
  assert(
    Array.isArray(colors) && colors.length === 1 && ['W', 'U', 'B', 'R', 'G'].includes(colors[0]),
    'Expected a reviewed ordinary Revised physical material',
  );
  return colors[0];
}
