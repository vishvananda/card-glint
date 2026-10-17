/** HSB = HSV on encoded sRGB, not the CSS hue-rotation matrix. */
export type Rgb = readonly [number, number, number];
export interface HsbAdjustment {
  hueDegrees: number;
  saturationScale: number;
  brightnessScale: number;
  /** Optional monotone value curve before brightness scaling. Separates
   * scanned texture contrast from mean brightness; prepared once per source. */
  valueGamma?: number;
  /** Optional source white balance after HSV. Neutral textured plates need
   * channel gains to acquire a printing tint without amplifying colored specks. */
  rgbScale?: Rgb;
}
export const IDENTITY_HSB: HsbAdjustment = {
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
};
export function rgbToHsb([r, g, b]: Rgb): [number, number, number] {
  const v = Math.max(r, g, b),
    d = v - Math.min(r, g, b);
  const h = d === 0 ? 0 : v === r ? (g - b) / d : v === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(((h * 60) % 360) + 360) % 360, v === 0 ? 0 : d / v, v];
}
export function hsbToRgb(h: number, s: number, v: number): [number, number, number] {
  const hue = (((h % 360) + 360) % 360) / 60,
    c = v * s;
  const x = c * (1 - Math.abs((hue % 2) - 1)),
    m = v - c;
  const rgb =
    hue < 1
      ? [c, x, 0]
      : hue < 2
        ? [x, c, 0]
        : hue < 3
          ? [0, c, x]
          : hue < 4
            ? [0, x, c]
            : hue < 5
              ? [x, 0, c]
              : [c, 0, x];
  return [rgb[0]! + m, rgb[1]! + m, rgb[2]! + m];
}
export function adjustHsb(rgb: Rgb, adjustment: HsbAdjustment): [number, number, number] {
  const [h, s, b] = rgbToHsb(rgb);
  const value = adjustment.valueGamma === undefined ? b : b ** adjustment.valueGamma;
  const result = hsbToRgb(
    h + adjustment.hueDegrees,
    Math.min(1, s * adjustment.saturationScale),
    Math.min(1, value * adjustment.brightnessScale),
  );
  return adjustment.rgbScale
    ? [
        Math.max(0, Math.min(1, result[0] * adjustment.rgbScale[0])),
        Math.max(0, Math.min(1, result[1] * adjustment.rgbScale[1])),
        Math.max(0, Math.min(1, result[2] * adjustment.rgbScale[2])),
      ]
    : result;
}

/** Validate optional tone parameters once at material preparation, not per pixel. */
export function validateHsbTone(adjustment: HsbAdjustment): void {
  const gamma = adjustment.valueGamma;
  if (gamma !== undefined && (!Number.isFinite(gamma) || gamma < 0.5 || gamma > 2))
    throw RangeError('Frame value exponent must be finite and between 0.5 and 2.');
}
