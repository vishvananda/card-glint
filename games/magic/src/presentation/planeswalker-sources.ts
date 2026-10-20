import manifest from '../../assets.json' with { type: 'json' };
import type { BoxAssetKey } from './profile.js';
import type { FaceRect } from './face-layout.js';
import type { HsbAdjustment } from './hsb.js';

export type WalkerPalette = 'W' | 'U' | 'B' | 'R' | 'G' | 'M' | 'A';
export type WalkerFamily = 'regular' | 'tall';
export const WALKER_MATERIAL_REVISION = 'conjurer-planeswalker-v1';

/** Shared source-material correction; exact printing profiles remain separate. */
export const WALKER_BACKGROUND_HSB: Readonly<Record<WalkerPalette, HsbAdjustment>> = {
  W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  U: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  B: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  R: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  M: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  A: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
};
export const WALKER_TYPE_HSB: Readonly<Record<WalkerPalette, HsbAdjustment>> = {
  W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  U: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  B: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  R: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  M: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
  A: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
};
export const WALKER_TYPE_REGISTRATION = {
  regular: { dx: 0, dy: 0, scaleX: 1, scaleY: 1 },
  tall: { dx: 0, dy: 0, scaleX: 1, scaleY: 1 },
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
