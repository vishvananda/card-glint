import assert from 'node:assert/strict';
import { SCAN_ANCHOR_WINDOWS, scanFrameAnchors } from './scan-frame-anchors.mjs';
import { oldFrameTarget } from './old-frame-normalization.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { fitAffineScan } from './scan-affine-fit.mjs';
import { median } from './metrics.mjs';

/** Verify an exact pinned base plate against its own stock mask in native
 * pixels, before white-stock recoloring can hide their common boundary.
 * No scan, sibling color, title, rules, or symbol contributes to this proof. */
export function plateStockMaskProof(frame, mask) {
  assert.equal(frame.width, mask.width);
  assert.equal(frame.height, mask.height);
  assert.equal(frame.data.length, mask.data.length);
  const sides = {};
  for (const [side, spec] of Object.entries(SCAN_ANCHOR_WINDOWS)) {
    const horizontal = spec.axis === 'x',
      size = horizontal ? frame.width : frame.height,
      factor = (horizontal ? 488 : 680) / size,
      forward = side === 'left' || side === 'top',
      samples = [];
    for (let n = 0; n < spec.count; n++) {
      const along = Math.round(
        (spec.start + spec.step * n) * (horizontal ? frame.height / 680 : frame.width / 488),
      );
      const at = (p) => (horizontal ? along * frame.width + p : p * frame.width + along) * 4;
      let expected = null,
        observed = null;
      for (let distance = 0; distance < size * 0.09; distance++) {
        const p = forward ? distance : size - distance - 1,
          i = at(p);
        if (expected === null && mask.data[i + 3] < 128) expected = p;
        // Source plates have exact black stock. This is deliberately not a
        // threshold applied to scanned paper, whose blacks are variable.
        if (
          observed === null &&
          frame.data[i + 3] >= 250 &&
          Math.max(frame.data[i], frame.data[i + 1], frame.data[i + 2]) > 12
        )
          observed = p;
      }
      samples.push({
        along,
        expected,
        observed,
        delta: expected === null || observed === null ? null : (observed - expected) * factor,
      });
    }
    const agreement = samples.filter((s) => s.delta !== null && Math.abs(s.delta) <= 0.75);
    sides[side] = {
      samples,
      matching: agreement.length,
      medianDelta: median(agreement.map((s) => s.delta)),
      reliable: agreement.length >= Math.max(16, Math.ceil(samples.length * 0.65)),
    };
  }
  // Three independently visible sides are required. Dark marbling can conceal
  // the fourth side; its source mask still must pass scan-side validation.
  return { accepted: Object.values(sides).filter((s) => s.reliable).length >= 3, sides };
}

export function plateStockTarget(geometry, proof, border) {
  const target = oldFrameTarget(geometry, geometry, border);
  return {
    ...target,
    reliable: proof.accepted && target.reliable,
    source: 'native-verified-exact-plate-stock-mask',
    sourceProof: proof,
  };
}
export function normalizePlateStock(reference, target, border) {
  const anchors = scanFrameAnchors(reference, border);
  return { target, ...fitAffineScan(anchors, target, fitScanFrame(anchors, target)) };
}
