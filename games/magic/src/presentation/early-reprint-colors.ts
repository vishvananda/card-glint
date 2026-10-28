import type { FrameHsb } from './frame-hsb.js';
import { retroBasicSymbol } from './retro-frame.js';
import { simpleBasicMana } from './retro-basic.js';
import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { calibrationForFace } from '../calibration/selection.js';

/** Replacements bypass older pigment/stock curves fitted to different plates. */
export function earlyReprintColors(face: RenderedCardInput) {
  if (face.colorCalibration !== 'set-hsb-v1') return undefined;
  const frame = earlyReprintFrame(face);
  if (!frame) return undefined;
  if (frame.dual)
    return {
      materials: frame.dual.materials,
      stock: calibrationForFace(face)!.dualLand!.stock,
    };
  const profile = calibrationForFace(face)!.colors[frame.profile.split('/')[1]!];
  if (profile?.source !== JSON.stringify([frame.asset, frame.frame])) return undefined;
  const materials: Record<string, FrameHsb> = { [frame.asset]: profile.adjustment };
  const symbols = calibrationForFace(face)!.basicSymbol?.symbols;
  if (symbols) {
    const url = retroBasicSymbol(face),
      color = simpleBasicMana(face);
    const spec = color && symbols[color as keyof typeof symbols];
    if (url && spec && spec.source === url)
      materials[url] = {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        symbolInk: { key: spec.key, ink: spec.ink },
      };
  }
  return { materials, stock: profile.stock };
}
