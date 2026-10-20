import manifest from '../../assets.json' with { type: 'json' };
import type { BoxAssetKey } from './profile.js';
import type { HsbAdjustment } from './hsb.js';

export type WalkerPalette = 'W' | 'U' | 'B' | 'R' | 'G' | 'M' | 'A';
export type WalkerFamily = 'regular' | 'tall';
export const WALKER_MATERIAL_REVISION = 'conjurer-planeswalker-v2';

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
export function walkerPalette(material: BoxAssetKey): WalkerPalette {
  return material === 'Gold'
    ? 'M'
    : ['Colourless', 'Artifact', 'Land'].includes(material)
      ? 'A'
      : (material as WalkerPalette);
}

/** Background pigment is sampled from complete pinned source frames. */
export function walkerSources(large: boolean, palette: WalkerPalette) {
  const family: WalkerFamily = large ? 'tall' : 'regular';
  const prefix = large ? 'planeswalkerTall' : 'planeswalkerFrame';
  const source = `${manifest.CONJURER_ROOT}/img/frames/planeswalker/${family}/${prefix}${palette}.png`;
  return { family, source };
}
