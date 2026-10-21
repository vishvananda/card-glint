import type { Rgb } from './hsb.js';

export interface DualBorderGeometry {
  readonly edge?: Rgb;
  box: { left: number; right: number; top: number; bottom: number };
  width: { left: number; right: number; top: number; bottom: number };
}
const BAND_ENDS = [0.08, 0.36, 0.64, 0.92, 1] as const;
const INK: Rgb = [0.18, 0.18, 0.17];

/** Edge / first color / second color / first color / edge.
 * The three colored bands have equal physical thickness.
 * Integrating pixel coverage keeps the finest outlines visible at every asset
 * decode size. Point sampling could erase an entire subpixel outline. */
export function dualLandPinline(
  sx: number,
  sy: number,
  pixelWidth: number,
  pixelHeight: number,
  colors: readonly Rgb[],
  geometry: DualBorderGeometry,
): { color: Rgb; alpha: number } | undefined {
  if (colors.length !== 2) return undefined;
  const { box: DUAL_BOX, width: DUAL_WIDTH } = geometry;
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
    const ink = band === 0 || band === 4 ? (geometry.edge ?? INK) : colors[band === 2 ? 1 : 0]!;
    for (let k = 0; k < 3; k++) color[k]! += ink[k]! * amount;
    alpha += amount;
    previous = next;
  }
  if (!alpha) return undefined;
  return { color: [color[0] / alpha, color[1] / alpha, color[2] / alpha], alpha };
}
