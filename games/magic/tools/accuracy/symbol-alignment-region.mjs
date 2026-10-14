import assert from 'node:assert/strict';
import { compareRegion } from './metrics.mjs';

/** Frozen baseline envelope, independent of scan content and candidate score.
 * This second check excludes most neighboring type text and frame rails. The
 * broad historical score remains separate; neither replaces frame validation. */
export function symbolAlignmentRegion(bounds) {
  assert.ok(bounds.length === 4 && bounds.every(Number.isFinite));
  const [x, y, w, h] = bounds;
  assert.ok(w > 0 && h > 0);
  return [Math.floor(x) - 12, Math.floor(y) - 4, Math.ceil(w) + 20, Math.ceil(h) + 8];
}

export function containedSymbol(region, bounds, padding = 1) {
  return (
    bounds[0] >= region[0] + padding &&
    bounds[1] >= region[1] + padding &&
    bounds[0] + bounds[2] <= region[0] + region[2] - padding &&
    bounds[1] + bounds[3] <= region[1] + region[3] - padding
  );
}

/** Keep dark ink and the light rim separate so a large background edge cannot
 * hide one treatment's regression. Input is grayscale after frozen frame pose. */
export function compareSymbolAlignment(reference, rendered, width, height) {
  const score = (light) => {
    const m = compareRegion(reference, rendered, width, height, light);
    return {
      status: m.status,
      f1: m.edgeF1?.[1] ?? 0,
      distance: m.meanDistance,
      referenceEdges: m.referenceEdges,
      renderedEdges: m.renderedEdges,
    };
  };
  return { dark: score(false), light: score(true) };
}
