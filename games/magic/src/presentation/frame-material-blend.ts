import type { Rgb } from './hsb.js';
import type { FramePixels } from './frame-paper-mask.js';

/** Approximate a softer printed bevel using the source pack's alpha selection.
 * The backdrop is a measured texture color, not reconstructed hidden artwork. */
export interface FrameMaterialBlend {
  maskSource: string;
  outerMaskSource: string;
  /** Outward selection expansion as a fraction of source width. */
  outset: number;
  backdrop: Rgb;
  amount: number;
}
export function blendFrameMaterial(
  image: FramePixels,
  mask: FramePixels,
  blend: FrameMaterialBlend,
): void {
  if (
    mask.width !== image.width ||
    mask.height !== image.height ||
    mask.data.length !== image.data.length ||
    !Number.isFinite(blend.amount) ||
    blend.amount < 0 ||
    blend.amount > 1 ||
    blend.backdrop.length !== 3 ||
    blend.backdrop.some((v) => !Number.isFinite(v) || v < 0 || v > 1)
  )
    throw RangeError('Invalid frame material blend');
  for (let i = 0; i < image.data.length; i += 4) {
    if (!image.data[i + 3] || !mask.data[i + 3]) continue;
    const weight = (blend.amount * mask.data[i + 3]!) / 255;
    for (let c = 0; c < 3; c++)
      image.data[i + c] = Math.round(
        image.data[i + c]! * (1 - weight) +
          Math.min(image.data[i + c]!, 255 * blend.backdrop[c]!) * weight,
      );
  }
}
