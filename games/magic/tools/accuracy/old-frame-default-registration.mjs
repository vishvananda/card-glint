// Scan-only pilot registration. This does not certify a renderer's frame geometry.
import assert from 'node:assert/strict';
import { median } from './metrics.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { fitAffineScan } from './scan-affine-fit.mjs';
const horizontal = (side) => ['left', 'right'].includes(side);
export function oldDefaultTarget(references) {
  const sides = {};
  for (const side of ['left', 'right', 'top', 'bottom']) {
    const observations = references
      .map((r) => {
        const get = (cohort) =>
          r.anchors.points
            .filter((p) => p.side === side && p.cohort === cohort)
            .map((p) => (horizontal(side) ? p.x : p.y));
        const fit = get('fit'),
          validation = get('validation');
        if (fit.length < 8 || validation.length < 8) return null;
        return { fit: median(fit), validation: median(validation) };
      })
      .filter(Boolean);
    // Reject scans whose alternating strips may have selected different features,
    // such as a copyright baseline instead of the outside printed boundary.
    const paired = observations.filter((r) => Math.abs(r.fit - r.validation) <= 0.35);
    assert(paired.length >= 5, 'Insufficient consistent scan-side observations ' + side);
    const position = median(paired.map((r) => (r.fit + r.validation) / 2)),
      agreement = Math.abs(
        median(paired.map((r) => r.fit)) - median(paired.map((r) => r.validation)),
      );
    sides[side] = {
      position,
      reliable: agreement <= 0.35,
      count: paired.length,
      ambiguous: observations.length - paired.length,
      cohortAgreement: agreement,
      source: 'paired-pilot-scan-consensus',
    };
  }
  return { reliable: Object.values(sides).every((s) => s.reliable), sides };
}
export function oldDefaultPose(anchors, target) {
  const simple = fitScanFrame(anchors, target);
  return fitAffineScan(anchors, target, simple);
}
