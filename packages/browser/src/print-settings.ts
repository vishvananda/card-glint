import type { Instance, Rect } from './types.js';

/** Period values are reference pixels at this card width, independent of tier. */
export const PRINT_DOTS_REFERENCE_WIDTH = 732;
export function printDotPeriodForWidth(
  width: number,
  period: number = DEFAULT_PRINT_DOTS.period,
): number {
  if (
    !Number.isFinite(width) ||
    width <= 0 ||
    !Number.isFinite(period) ||
    period < 2 ||
    period > 16
  )
    throw RangeError('Invalid print-dot period or face width');
  return (period * width) / PRINT_DOTS_REFERENCE_WIDTH;
}

/** Opt-in process-printing defaults. An absent printDots profile stays disabled. */
export const DEFAULT_PRINT_DOTS = Object.freeze({
  amount: 0.35,
  period: 2,
  variation: 0.5,
  inset: 0.035,
  artwork: true,
});
export function printDotValues(profile: Instance['printDots']): number[] {
  return [
    profile ? (profile.amount ?? DEFAULT_PRINT_DOTS.amount) : 0,
    profile?.period ?? DEFAULT_PRINT_DOTS.period,
    profile?.variation ?? DEFAULT_PRINT_DOTS.variation,
    profile?.inset ?? DEFAULT_PRINT_DOTS.inset,
  ];
}
export function printArtBounds(windows: readonly Rect[]) {
  const bounds = new Float32Array(32);
  windows.forEach(([x, y, w, h], i) => bounds.set([x, 1 - y - h, x + w, 1 - y], i * 4));
  return bounds;
}
