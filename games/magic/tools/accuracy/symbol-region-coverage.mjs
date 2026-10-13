import assert from 'node:assert/strict';
import { fittedSymbolBounds } from './symbol-bounds.mjs';

/** Reference-only crop QA. Never widen a score window or move a renderer to
 * improve its score. A failed segmentation is unknown coverage, not evidence
 * that a glyph fits. Translation/scale must come from independent frame anchors. */
export function symbolRegionCoverage(measurement, region, transform = {}, padding = 1) {
  assert.ok(region.length === 4 && region.every(Number.isFinite));
  assert.ok(region[2] > 0 && region[3] > 0);
  assert.ok(Number.isFinite(padding) && padding >= 0);
  assert.ok(
    [transform.scale ?? 1, transform.tx ?? 0, transform.ty ?? 0].every(Number.isFinite) &&
      (transform.scale ?? 1) > 0 &&
      !(transform.rotation ?? 0),
    'Coverage supports only the frozen translation and uniform scale.',
  );
  if (!measurement?.stable || !measurement.rect)
    return { status: 'unknown', reason: 'reference-segmentation-unreliable', clearances: null };
  assert.ok(measurement.rect.length === 4 && measurement.rect.every(Number.isFinite));
  assert.ok(measurement.rect[2] > 0 && measurement.rect[3] > 0);
  const bounds = fittedSymbolBounds(measurement.rect, transform),
    clearances = {
      left: bounds.centerX - bounds.width / 2 - region[0],
      right: region[0] + region[2] - bounds.centerX - bounds.width / 2,
      top: bounds.centerY - bounds.height / 2 - region[1],
      bottom: region[1] + region[3] - bounds.centerY - bounds.height / 2,
    },
    minimum = Math.min(...Object.values(clearances));
  return {
    status: minimum < 0 ? 'clipped' : minimum < padding ? 'near-edge' : 'covered',
    clearances,
    padding,
  };
}
