import type { FramePixels } from './frame-paper-mask.js';
import type { Rgb } from './hsb.js';

/** Source-bound, post-HSB shadow lift in normalized sRGB. The added lift fades
 * with zero slope at transition. The half-transition
 * bound prevents reversals in a channel ramp. This is not a flat black floor. */
export interface FrameBlackPoint {
  lift: Rgb;
  transition: number;
  /** Continuous additive texture tone knots over 0..1: maximum channel, offset.
   * These are independently selected, and can extend above the ink transition. */
  texture?: readonly (readonly [number, Rgb])[];
  /** Optional native source selection for the texture correction only. */
  textureMaskSource?: string;
}

export function validateFrameBlackPoint({ lift, transition, texture }: FrameBlackPoint): void {
  if (
    !Number.isFinite(transition) ||
    transition <= 0 ||
    transition > 1 ||
    lift.length !== 3 ||
    lift.some((v) => !Number.isFinite(v) || v < 0 || v > transition / 2)
  )
    throw RangeError('Invalid frame black-point curve');
  if (texture) {
    if (
      texture.length < 2 ||
      texture.length > 16 ||
      texture[0]?.[0] !== 0 ||
      texture[0]?.[1].some((v) => v !== 0) ||
      texture.at(-1)?.[0] !== 1 ||
      texture.at(-1)?.[1].some((v) => v !== 0) ||
      texture.some(
        ([x, rgb]) =>
          !Number.isFinite(x) || rgb.length !== 3 || rgb.some((v) => !Number.isFinite(v)),
      )
    )
      throw RangeError('Invalid frame texture curve');
    for (let i = 1; i < texture.length; i++) {
      const [x, y] = texture[i - 1]!,
        [nx, ny] = texture[i]!;
      // The quadratic base derivative is smallest at the segment's left end.
      if (
        nx <= x ||
        lift.some(
          (v, c) =>
            1 -
              ((2 * v) / transition) * Math.max(0, 1 - x / transition) +
              (ny[c]! - y[c]!) / (nx - x) <
            0,
        )
      )
        throw RangeError('Frame texture curve reverses contrast');
    }
  }
}

/** Apply validated curves only during cached preparation, with no extra readback.
 * The ink lift stops at its transition; selected texture has a separate curve. */
export function colorFrameBlackPoint(
  image: FramePixels,
  point: FrameBlackPoint,
  textureMask?: FramePixels,
): void {
  const transition = point.transition * 255;
  const texture = new Float64Array(256 * 3);
  for (let k = 1; k < (point.texture?.length ?? 0); k++) {
    const [x, y] = point.texture![k - 1]!,
      [nx, ny] = point.texture![k]!;
    for (let v = Math.ceil(x * 255); v < nx * 255; v++)
      for (let c = 0; c < 3; c++)
        texture[v * 3 + c] = 255 * (y[c]! + ((ny[c]! - y[c]!) * (v / 255 - x)) / (nx - x));
  }
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) continue;
    const value = Math.max(image.data[i]!, image.data[i + 1]!, image.data[i + 2]!);
    if (value >= transition && !point.texture) continue;
    const weight = Math.max(0, 1 - value / transition) ** 2;
    for (let c = 0; c < 3; c++)
      image.data[i + c] = Math.round(
        image.data[i + c]! +
          255 * point.lift[c]! * weight +
          texture[value * 3 + c]! * (textureMask ? textureMask.data[i + 3]! / 255 : 1),
      );
  }
}
