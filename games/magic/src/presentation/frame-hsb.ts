import { frameStockInk, colorFrameStockInk, validateFrameStock } from './frame-stock-ink.js';
import type { FrameMaterialBlend } from './frame-material-blend.js';
import { adjustHsb, type HsbAdjustment, type Rgb } from './hsb.js';
import { framePaperMask, type FramePixels, type PaperMask } from './frame-paper-mask.js';
import { frameAccentMask, type FrameAccentMask } from './frame-accent-mask.js';
import {
  colorFrameBlackPoint,
  validateFrameBlackPoint,
  type FrameBlackPoint,
} from './frame-blackpoint.js';

export interface DualFrameHsb {
  frame: HsbAdjustment;
  paper: HsbAdjustment;
  mask: PaperMask;
  /** Source-local panels use their original pixels, independently of the
   * surrounding frame adjustment. Built during cached material preparation. */
  regions?: readonly { mask: PaperMask; adjustment: HsbAdjustment }[];
  accents?: readonly { mask: FrameAccentMask; adjustment: HsbAdjustment }[];
}
export type FrameHsb = (HsbAdjustment | DualFrameHsb) & {
  blackPoint?: FrameBlackPoint;
  blend?: FrameMaterialBlend;
  /** Edge-connected stock on precomposed plates; prepared once with the material. */
  outerStock?: Rgb;
  outerStockMaskSource?: string;
};

/** Recolor the static source, preserving alpha and, without an opt-in shadow
 * curve, black ink. Single-component
 * mana transforms also protect white glyph details. Frame-paper highlights
 * must follow their material, otherwise darkening produces false white relief.
 * Blend recolored pixels at the paper edge without moving texture or shadows. */
export function colorFrame(
  image: FramePixels,
  adjustment: FrameHsb,
  textureMask?: FramePixels,
  stockMask?: FramePixels,
) {
  if (adjustment.blackPoint) validateFrameBlackPoint(adjustment.blackPoint);
  if (adjustment.outerStock) validateFrameStock(adjustment.outerStock);
  if (
    adjustment.outerStockMaskSource &&
    (!stockMask ||
      stockMask.width !== image.width ||
      stockMask.height !== image.height ||
      stockMask.data.length !== image.data.length)
  )
    throw RangeError('Frame stock correction needs its source selection');
  if (
    adjustment.blackPoint?.textureMaskSource &&
    (!textureMask ||
      textureMask.width !== image.width ||
      textureMask.height !== image.height ||
      textureMask.data.length !== image.data.length)
  )
    throw RangeError('Frame texture correction needs its source selection');
  const dual = 'mask' in adjustment ? adjustment : undefined,
    mask = dual ? framePaperMask(image, dual.mask) : undefined,
    frame = 'mask' in adjustment ? adjustment.frame : adjustment,
    regions =
      dual?.regions?.map((region) => ({
        values: framePaperMask(image, region.mask),
        adjustment: region.adjustment,
      })) ?? [],
    accents = [
      ...regions,
      ...(dual?.accents?.map((accent) => ({
        values: frameAccentMask(image, accent.mask),
        adjustment: accent.adjustment,
      })) ?? []),
    ];
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) continue;
    const rgb: Rgb = [image.data[i]! / 255, image.data[i + 1]! / 255, image.data[i + 2]! / 255],
      v = Math.max(...rgb),
      s = v === 0 ? 0 : (v - Math.min(...rgb)) / v;
    if (v < 0.075 || (!dual && s < 0.025 && v > 0.97)) continue;
    const weight = mask?.[i / 4] ?? 0,
      outside = adjustHsb(rgb, weight === 1 && dual ? dual.paper : frame),
      inside = weight > 0 && weight < 1 && dual ? adjustHsb(rgb, dual.paper) : outside;
    for (let c = 0; c < 3; c++)
      image.data[i + c] = Math.round(
        Math.round(255 * outside[c]!) * (1 - weight) + Math.round(255 * inside[c]!) * weight,
      );
    for (const accent of accents) {
      const weight = accent.values[i / 4]!;
      if (!weight) continue;
      const color = adjustHsb(rgb, accent.adjustment);
      for (let c = 0; c < 3; c++)
        image.data[i + c] = Math.round(
          image.data[i + c]! * (1 - weight) + 255 * color[c]! * weight,
        );
    }
  }
  const stockPixels = adjustment.outerStock ? image.data.slice() : undefined;
  const stockSelection = adjustment.outerStock ? frameStockInk(image, stockMask) : undefined;
  if (adjustment.blackPoint) colorFrameBlackPoint(image, adjustment.blackPoint, textureMask);
  if (adjustment.outerStock && stockPixels && stockSelection)
    colorFrameStockInk(image, stockPixels, stockSelection, adjustment.outerStock, stockMask);
}
