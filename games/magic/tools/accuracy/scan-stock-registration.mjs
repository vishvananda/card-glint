export const SCAN_STOCK_POLICY = Object.freeze({
  maxScaleDeviation: 0.02,
  maxTranslation: 6,
  maxSideResidual: 1.5,
});
const sides = ['left', 'right', 'top', 'bottom'];
const horizontal = (side) => side === 'left' || side === 'right';
const usable = (bounds) =>
  bounds?.reliable &&
  sides.every(
    (side) => bounds.sides?.[side]?.reliable && Number.isFinite(bounds.sides[side].position),
  ) &&
  bounds.sides.right.position > bounds.sides.left.position &&
  bounds.sides.bottom.position > bounds.sides.top.position;

/** Comparison-only scan pose from four independent outer-frame edges. Symbol,
 * text and art pixels never enter this fit. Uniform scale preserves internal
 * shape errors; missing edges, excessive pose and aspect disagreement reject
 * the fit instead of silently falling back to identity or a shared offset. */
export function fitScanStockRegistration(reference, target) {
  if (!usable(reference) || !usable(target))
    return { accepted: false, reason: 'unreliable-frame-anchors', transform: null };
  const extent = (b, lo, hi) => b.sides[hi].position - b.sides[lo].position,
    middle = (b, lo, hi) => (b.sides[lo].position + b.sides[hi].position) / 2,
    rw = extent(reference, 'left', 'right'),
    rh = extent(reference, 'top', 'bottom'),
    tw = extent(target, 'left', 'right'),
    th = extent(target, 'top', 'bottom'),
    scale = (rw * tw + rh * th) / (rw * rw + rh * rh),
    proposed = {
      scale,
      tx:
        middle(target, 'left', 'right') - 244 - scale * (middle(reference, 'left', 'right') - 244),
      ty:
        middle(target, 'top', 'bottom') - 340 - scale * (middle(reference, 'top', 'bottom') - 340),
    },
    residuals = Object.fromEntries(
      sides.map((side) => {
        const origin = horizontal(side) ? 244 : 340,
          shift = horizontal(side) ? proposed.tx : proposed.ty;
        return [
          side,
          origin +
            scale * (reference.sides[side].position - origin) +
            shift -
            target.sides[side].position,
        ];
      }),
    ),
    bounded =
      Math.abs(scale - 1) <= SCAN_STOCK_POLICY.maxScaleDeviation &&
      Math.max(Math.abs(proposed.tx), Math.abs(proposed.ty)) <= SCAN_STOCK_POLICY.maxTranslation,
    consistent =
      Math.max(...Object.values(residuals).map(Math.abs)) <= SCAN_STOCK_POLICY.maxSideResidual,
    accepted = bounded && consistent;
  return {
    accepted,
    reason: !bounded ? 'excessive-scan-pose' : !consistent ? 'frame-aspect-disagreement' : null,
    transform: accepted ? proposed : null,
    proposed,
    residuals,
  };
}
