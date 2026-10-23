// Comparison-only Eighth scan registration. Never adjust painter geometry here.
import { SCAN_ANCHOR_WINDOWS } from './scan-frame-anchors.mjs';
import { nativeScanFrameAnchors } from './native-scan-frame-anchors.mjs';
import { fitAffineFrameAnchors } from './scan-affine-anchor-fit.mjs';
export const EIGHTH_RECOVERY_POLICY = Object.freeze({
  version: 'eighth-native-frame-affine-v1',
  halfWindow: 4.5,
  maximumAxisDifference: 0.006,
  scope:
    'Use the frozen outer physical boundary, excluding inner bevel peaks. One fixed six-parameter affine model for every source. Fit and held strips remain disjoint; all original support, residual and pose bounds remain enforced. No per-card model selection.',
});
export function eighthScanRegistration(rawScan, target) {
  const windows = Object.fromEntries(
    Object.entries(SCAN_ANCHOR_WINDOWS).map(([side, w]) => [
      side,
      {
        ...w,
        lo: Math.floor(target.sides[side].position - EIGHTH_RECOVERY_POLICY.halfWindow),
        hi: Math.ceil(target.sides[side].position + EIGHTH_RECOVERY_POLICY.halfWindow),
      },
    ]),
  );
  const anchors = nativeScanFrameAnchors(rawScan, 'white', windows);
  const result = fitAffineFrameAnchors(anchors, target, undefined, { fixedModel: true });
  return {
    ...result,
    method: {
      policy: EIGHTH_RECOVERY_POLICY,
      windows,
    },
  };
}

/** Replace central printed content for an exact spatial-isolation control.
 * Frame stock, outside rails and the lower physical edge remain untouched. */
export function eighthPrintedContentControl(source) {
  const changed = { ...source, data: Uint8Array.from(source.data) };
  const scale = Math.min(488 / source.width, 680 / source.height);
  const px = (488 - source.width * scale) / 2,
    py = (680 - source.height * scale) / 2;
  for (let y = 0; y < source.height; y++)
    for (let x = 0; x < source.width; x++) {
      const cx = (x + 0.5) * scale + px - 0.5,
        cy = (y + 0.5) * scale + py - 0.5;
      if (cx >= 38 && cx <= 450 && cy >= 35 && cy <= 650) {
        const i = (y * source.width + x) * 4;
        changed.data.set([i % 251, (i * 3) % 251, (i * 7) % 251, 255], i);
      }
    }
  return changed;
}
