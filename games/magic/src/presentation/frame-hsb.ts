import { adjustHsb, type HsbAdjustment, type Rgb } from './hsb.js';
import { framePaperMask, type FramePixels, type PaperMask } from './frame-paper-mask.js';

export interface DualFrameHsb {
  frame: HsbAdjustment;
  paper: HsbAdjustment;
  mask: PaperMask;
}
export type FrameHsb = HsbAdjustment | DualFrameHsb;

/** Recolor the static source, preserving alpha, black ink and neutral white.
 * Blend recolored pixels at the paper edge without moving texture or shadows. */
export function colorFrame(image: FramePixels, adjustment: FrameHsb) {
  const dual = 'mask' in adjustment ? adjustment : undefined,
    mask = dual ? framePaperMask(image, dual.mask) : undefined,
    frame = 'mask' in adjustment ? adjustment.frame : adjustment;
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) continue;
    const rgb: Rgb = [image.data[i]! / 255, image.data[i + 1]! / 255, image.data[i + 2]! / 255],
      v = Math.max(...rgb),
      s = v === 0 ? 0 : (v - Math.min(...rgb)) / v;
    if (v < 0.075 || (s < 0.025 && v > 0.97)) continue;
    const weight = mask?.[i / 4] ?? 0,
      outside = adjustHsb(rgb, weight === 1 && dual ? dual.paper : frame),
      inside = weight > 0 && weight < 1 && dual ? adjustHsb(rgb, dual.paper) : outside;
    for (let c = 0; c < 3; c++)
      image.data[i + c] = Math.round(
        Math.round(255 * outside[c]!) * (1 - weight) + Math.round(255 * inside[c]!) * weight,
      );
  }
}
