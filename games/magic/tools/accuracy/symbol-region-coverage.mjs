import assert from 'node:assert/strict';
import { projectedScanRect, scanMatrix } from './scan-transform.mjs';

/** Reference-only crop QA. Never widen a score window or move a renderer to
 * improve its score. A failed segmentation is unknown coverage, not evidence
 * that a glyph fits. Translation/scale must come from independent frame anchors. */
export function symbolRegionCoverage(measurement, region, transform = {}, padding = 1) {
  assert.ok(region.length === 4 && region.every(Number.isFinite));
  assert.ok(region[2] > 0 && region[3] > 0);
  assert.ok(Number.isFinite(padding) && padding >= 0);
  scanMatrix(transform);
  if (!measurement?.stable || !measurement.rect)
    return { status: 'unknown', reason: 'reference-segmentation-unreliable', clearances: null };
  assert.ok(measurement.rect.length === 4 && measurement.rect.every(Number.isFinite));
  assert.ok(measurement.rect[2] > 0 && measurement.rect[3] > 0);
  const [x, y, width, height] = projectedScanRect(measurement.rect, transform),
    clearances = {
      left: x - region[0],
      right: region[0] + region[2] - x - width,
      top: y - region[1],
      bottom: region[1] + region[3] - y - height,
    },
    minimum = Math.min(...Object.values(clearances));
  return {
    status: minimum < 0 ? 'clipped' : minimum < padding ? 'near-edge' : 'covered',
    clearances,
    padding,
  };
}
