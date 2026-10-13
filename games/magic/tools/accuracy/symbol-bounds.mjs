import assert from 'node:assert/strict';
import { median } from './metrics.mjs';
import { symbolComponentBounds } from './symbol-component-bounds.mjs';
import { scanMatrix, projectScanPoint } from './scan-transform.mjs';

/** Shared offline measurement: inspect native pixels, sweep thresholds, keep
 * independent axes and flag uncertainty. Profiles are set/cohort choices,
 * never parameters optimized against one scan's render score. */
export function measureSymbolBounds(image, profile) {
  const { thresholds, light = false, maxSpread = 1.31, minimumSamples = 2 } = profile;
  assert.ok(thresholds.length >= minimumSamples && new Set(thresholds).size === thresholds.length);
  const samples = thresholds.map((t) => symbolComponentBounds(image, t, light, profile)),
    accepted = samples.filter(Boolean),
    rect = accepted.length
      ? Array.from({ length: 4 }, (_, j) => median(accepted.map((s) => s.rect[j])))
      : null,
    spread = accepted.length
      ? Array.from(
          { length: 4 },
          (_, j) =>
            Math.max(...accepted.map((s) => s.rect[j])) -
            Math.min(...accepted.map((s) => s.rect[j])),
        )
      : null,
    review = [];
  if (accepted.length < minimumSamples) review.push('insufficient-segmentation');
  if (accepted.some((s) => s.ambiguous)) review.push('competing-components');
  if (spread?.some((v) => v > maxSpread)) review.push('threshold-sensitive');
  return {
    samples,
    rect,
    spread,
    stable: review.length === 0,
    review,
    sourcePixelSize: Math.min(488 / image.width, 680 / image.height),
  };
}

/** Keep raw dimensions separate from a frozen shared scale/position model.
 * Extents stay along the symbol's axes, not a rotated rectangle's AABB. */
export function fittedSymbolBounds(rect, transform = {}) {
  const { tx = 0, ty = 0, scale = 1, rotation = 0 } = transform;
  const matrix = scanMatrix(transform);
  if (transform.matrix) {
    const [x, y, width, height] = rect,
      [centerX, centerY] = projectScanPoint(x + width / 2, y + height / 2, transform);
    return {
      width: width * Math.hypot(matrix[0], matrix[1]),
      height: height * Math.hypot(matrix[2], matrix[3]),
      centerX,
      centerY,
    };
  }
  const [x, y, width, height] = rect,
    cx = x + width / 2 - 244,
    cy = y + height / 2 - 340,
    c = Math.cos(rotation),
    s = Math.sin(rotation);
  return {
    width: width * scale,
    height: height * scale,
    centerX: 244 + tx + scale * (cx * c - cy * s),
    centerY: 340 + ty + scale * (cx * s + cy * c),
  };
}

/** Exact matched blank-face subtraction isolates a renderer's symbol even when
 * it overlaps a frame edge. Reference scans never use this synthetic mask. */
export function measureRenderedSymbol(rendered, blank, profile) {
  assert.equal(rendered.width, blank.width);
  assert.equal(rendered.height, blank.height);
  assert.equal(rendered.data.length, blank.data.length);
  const foreground = profile.foreground ?? 'difference',
    minimumDifference = profile.minimumDifference ?? 8,
    data = new Uint8Array(rendered.data.length);
  assert.ok(['difference', 'dark', 'light'].includes(foreground));
  assert.ok(
    Number.isFinite(minimumDifference) && minimumDifference >= 0 && minimumDifference < 255,
  );
  for (let p = 0; p < data.length; p += 4) {
    const value = Math.max(
      ...[0, 1, 2, 3].map((c) => Math.abs(rendered.data[p + c] - blank.data[p + c])),
    );
    if (foreground === 'difference') {
      data[p] = data[p + 1] = data[p + 2] = value;
      data[p + 3] = 255;
    } else {
      // Compare like ink with like ink: a white outline must not count toward
      // a reference's black-ink bounds. Subtraction still excludes the frame.
      data[p] = rendered.data[p];
      data[p + 1] = rendered.data[p + 1];
      data[p + 2] = rendered.data[p + 2];
      data[p + 3] = value > minimumDifference ? rendered.data[p + 3] : 0;
    }
  }
  return measureSymbolBounds(
    { width: rendered.width, height: rendered.height, data },
    { ...profile, signal: 'luminance', light: foreground !== 'dark' },
  );
}
