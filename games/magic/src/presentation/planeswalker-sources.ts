import manifest from '../../assets.json' with { type: 'json' };
import type { BoxAssetKey } from './profile.js';
import type { FaceRect } from './face-layout.js';
import type { HsbAdjustment } from './hsb.js';

export type WalkerPalette = 'W' | 'U' | 'B' | 'R' | 'G' | 'M' | 'A';
export type WalkerFamily = 'regular' | 'tall';
export const WALKER_MATERIAL_REVISION = 'conjurer-planeswalker-v1';

/** Shared source-material correction; exact printing profiles remain separate. */
export const WALKER_BACKGROUND_HSB: Readonly<Record<WalkerPalette, HsbAdjustment>> = {
  W: { hueDegrees: -19.0561061, saturationScale: 1.0414075, brightnessScale: 0.967493 },
  U: { hueDegrees: 10.198972, saturationScale: 0.7186607, brightnessScale: 0.8360822 },
  B: { hueDegrees: 5.4208506, saturationScale: 0.7598563, brightnessScale: 0.8801518 },
  R: { hueDegrees: -3.269066, saturationScale: 1.2589451, brightnessScale: 1.0859474 },
  G: { hueDegrees: 6.636047, saturationScale: 0.8931966, brightnessScale: 0.8272016 },
  M: { hueDegrees: -3.6353884, saturationScale: 0.9038432, brightnessScale: 0.9853541 },
  A: { hueDegrees: -0.0941491, saturationScale: 1.6, brightnessScale: 1.1230379 },
};
export const WALKER_TYPE_HSB: Readonly<Record<WalkerPalette, HsbAdjustment>> = {
  W: { hueDegrees: 14.6450571, saturationScale: 0.2868237, brightnessScale: 0.9642352 },
  U: { hueDegrees: 7.5644988, saturationScale: 0.9820435, brightnessScale: 0.9860931 },
  B: { hueDegrees: -17.4075631, saturationScale: 1.2255249, brightnessScale: 1.0776789 },
  R: { hueDegrees: 0.9753593, saturationScale: 0.9516829, brightnessScale: 0.9921301 },
  G: { hueDegrees: -25.0, saturationScale: 0.3487185, brightnessScale: 0.9982582 },
  M: { hueDegrees: 0.5139304, saturationScale: 1.1071443, brightnessScale: 1.0444201 },
  A: { hueDegrees: 24.9999991, saturationScale: 0.2596335, brightnessScale: 0.8875961 },
};
export const WALKER_TYPE_REGISTRATION = {
  regular: { dx: 0.2, dy: 0.15, scaleX: 0.9997696, scaleY: 0.9887927 },
  tall: { dx: 0.5, dy: -1.3, scaleX: 0.9990783, scaleY: 0.990038 },
} as const;

export function walkerPalette(material: BoxAssetKey): WalkerPalette {
  return material === 'Gold'
    ? 'M'
    : ['Colourless', 'Artifact', 'Land'].includes(material)
      ? 'A'
      : (material as WalkerPalette);
}

/** The source masks contain the complete contour and original bevel/shadow.
 * Coordinates are measured in the pinned 1500×2100 frame, not guessed radii. */
export function walkerSources(large: boolean, palette: WalkerPalette) {
  const family: WalkerFamily = large ? 'tall' : 'regular';
  const prefix = large ? 'planeswalkerTall' : 'planeswalker';
  const root = `${manifest.CONJURER_ROOT}/img/frames/planeswalker/${family}/`;
  const crop: FaceRect = [83 / 1500, (large ? 1037 : 1175) / 2100, 1334 / 1500, 124 / 2100];
  return {
    family,
    source: `${root}${prefix}${large ? '' : 'Frame'}${palette}.png`,
    mask: `${root}${prefix}MaskType.png`,
    crop,
  };
}

export function walkerTypeRect(large: boolean): FaceRect {
  const { crop, family } = walkerSources(large, 'U');
  const a = WALKER_TYPE_REGISTRATION[family];
  return [crop[0] + a.dx / 488, crop[1] + a.dy / 680, crop[2] * a.scaleX, crop[3] * a.scaleY];
}
