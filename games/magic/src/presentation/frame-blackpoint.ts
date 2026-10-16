import type { FramePixels } from './frame-paper-mask.js';
import type { Rgb } from './hsb.js';

/** Source-bound, post-HSB shadow lift in normalized sRGB. The added lift fades
 * with zero slope at transition. The half-transition
 * bound prevents reversals in a channel ramp. This is not a flat black floor. */
export interface FrameBlackPoint {
  lift: Rgb;
  transition: number;
}

export function validateFrameBlackPoint({ lift, transition }: FrameBlackPoint): void {
  if (
    !Number.isFinite(transition) ||
    transition <= 0 ||
    transition > 1 ||
    lift.length !== 3 ||
    lift.some((v) => !Number.isFinite(v) || v < 0 || v > transition / 2)
  )
    throw RangeError('Invalid frame black-point curve');
}

/** Apply a validated curve only during cached preparation, with no extra readback.
 * Preserve transparency and leave every pixel above the transition untouched. */
export function colorFrameBlackPoint(image: FramePixels, point: FrameBlackPoint): void {
  const transition = point.transition * 255;
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) continue;
    const value = Math.max(image.data[i]!, image.data[i + 1]!, image.data[i + 2]!);
    if (value >= transition) continue;
    const weight = (1 - value / transition) ** 2;
    for (let c = 0; c < 3; c++)
      image.data[i + c] = Math.round(image.data[i + c]! + 255 * point.lift[c]! * weight);
  }
}
