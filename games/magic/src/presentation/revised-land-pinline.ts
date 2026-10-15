import type { Rgb } from './hsb.js';
import { dualLandPinline } from './dual-land-pinline.js';

// Source-space geometry, fitted after fixing the five-band cross-section.
// All ten Revised duals share these bounds; paper stripes keep their own anchor.
export const DUAL_BOX = { left: 166.8794, right: 1338.8298, top: 1255.6105, bottom: 1882.7268 };
// One physical width on the finished 488 × 680 face. Undo the source frame
// transform here; independent side widths would distort the band proportions.
const horizontal = 6.375 / (((488 * 0.984) / 1500) * 1.001);
const vertical = 6.375 / (((680 * 0.99) / 2100) * 1.001);
const DUAL_WIDTH = { left: horizontal, right: horizontal, top: vertical, bottom: vertical };

export function revisedDualPinline(
  sx: number,
  sy: number,
  pixelWidth: number,
  pixelHeight: number,
  colors: readonly Rgb[],
) {
  return dualLandPinline(sx, sy, pixelWidth, pixelHeight, colors, {
    box: DUAL_BOX,
    width: DUAL_WIDTH,
  });
}
