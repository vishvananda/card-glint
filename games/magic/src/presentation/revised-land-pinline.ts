import type { Rgb } from './hsb.js';

// Source-space geometry, fitted after fixing the five-band cross-section.
// All ten Revised duals share these bounds; paper stripes keep their own anchor.
export const DUAL_BOX = { left: 166.4893, right: 1339.6099, top: 1255.6105, bottom: 1881.9477 };
// One physical width on the finished 488 × 680 face. Undo the source frame
// transform here; independent side widths would distort the band proportions.
const horizontal = 5.875 / (((488 * 0.984) / 1500) * 1.001);
const vertical = 5.875 / (((680 * 0.99) / 2100) * 1.001);
const DUAL_WIDTH = { left: horizontal, right: horizontal, top: vertical, bottom: vertical };
const BAND_ENDS = [0.08, 0.5, 0.71, 0.92, 1] as const;
const INK: Rgb = [0.18, 0.18, 0.17];

/** Edge / thick first color / thin second color / thin first color / edge.
 * Integrating pixel coverage keeps the finest outlines visible at every asset
 * decode size. Point sampling could erase an entire subpixel outline. */
export function revisedDualPinline(
  sx: number,
  sy: number,
  pixelWidth: number,
  pixelHeight: number,
  colors: readonly Rgb[],
): { color: Rgb; alpha: number } | undefined {
  if (colors.length !== 2) return undefined;
  const left = sx - pixelWidth / 2,
    right = sx + pixelWidth / 2,
    top = sy - pixelHeight / 2,
    bottom = sy + pixelHeight / 2;
  if (
    right <= DUAL_BOX.left ||
    left >= DUAL_BOX.right ||
    bottom <= DUAL_BOX.top ||
    top >= DUAL_BOX.bottom ||
    (left >= DUAL_BOX.left + DUAL_WIDTH.left &&
      right <= DUAL_BOX.right - DUAL_WIDTH.right &&
      top >= DUAL_BOX.top + DUAL_WIDTH.top &&
      bottom <= DUAL_BOX.bottom - DUAL_WIDTH.bottom)
  )
    return undefined;
  const coverage = (inset: number) =>
    (Math.max(
      0,
      Math.min(right, DUAL_BOX.right - DUAL_WIDTH.right * inset) -
        Math.max(left, DUAL_BOX.left + DUAL_WIDTH.left * inset),
    ) *
      Math.max(
        0,
        Math.min(bottom, DUAL_BOX.bottom - DUAL_WIDTH.bottom * inset) -
          Math.max(top, DUAL_BOX.top + DUAL_WIDTH.top * inset),
      )) /
    (pixelWidth * pixelHeight);
  let previous = coverage(0),
    alpha = 0;
  const color: [number, number, number] = [0, 0, 0];
  for (let band = 0; band < BAND_ENDS.length; band++) {
    const next = coverage(BAND_ENDS[band]!);
    const amount = Math.max(0, previous - next);
    const ink = band === 0 || band === 4 ? INK : colors[band === 2 ? 1 : 0]!;
    for (let k = 0; k < 3; k++) color[k]! += ink[k]! * amount;
    alpha += amount;
    previous = next;
  }
  if (!alpha) return undefined;
  return { color: [color[0] / alpha, color[1] / alpha, color[2] / alpha], alpha };
}
