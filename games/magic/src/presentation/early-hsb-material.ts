import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { isRetro, retroFrameAsset, retroFamily } from './retro-frame.js';
import { adjustHsb, IDENTITY_HSB, type HsbAdjustment, type Rgb } from './hsb.js';
import { EARLY_HSB_PROFILES } from './early-hsb-profiles.js';

/** An opt-in color trial; the original bitmap and its owner are never mutated.
 * This runs during static face preparation, not during animation or mask work. */
export async function prepareEarlyHsb(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose: () => void }> {
  const unchanged = { images, dispose() {} };
  const profile = earlyHsbProfile(face);
  if (!profile) return unchanged;
  const url = retroFrameAsset(face),
    source = images.get(url);
  if (!source) return unchanged;
  signal.throwIfAborted();
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw Error('HSB preparation needs Canvas2D.');
  try {
    context.drawImage(source, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    colorEarlyFrame(pixels, profile, retroFamily(face), materialKey(face));
    context.putImageData(pixels, 0, 0);
    const bitmap = await createImageBitmap(canvas);
    if (signal.aborted) {
      bitmap.close();
      signal.throwIfAborted();
    }
    const derived = new Map(images);
    derived.set(url, bitmap);
    return { images: derived, dispose: () => bitmap.close() };
  } finally {
    canvas.width = canvas.height = 0;
  }
}
export interface EarlyHsbProfile {
  frame?: HsbAdjustment;
  paper?: HsbAdjustment;
}
const materialKey = (face: RenderedCardInput) =>
  retroFrameAsset(face).split('/').at(-1)!.replace('.png', '').toUpperCase();
export function earlyHsbProfile(face: RenderedCardInput): EarlyHsbProfile | undefined {
  if (face.colorCalibration !== 'early-hsb-v1' || !isRetro(face)) return undefined;
  return EARLY_HSB_PROFILES[`${face.setCode?.toLowerCase()}-${materialKey(face)}`];
}
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
/** Asset-space paper masks, independent of text margins and scan alignment.
 * Black parchment and green wood have irregular edges: classify only their
 * narrow boundary band by source color, retaining the source shadow shape. */
export function earlyPaperWeight(
  x: number,
  y: number,
  rgb: Rgb,
  family: string,
  material: string,
): number {
  const bounds =
    family === 'fourth'
      ? [54, 408, 434, 610]
      : family === 'seventh'
        ? [57, 412, 433, 599]
        : [62, 407, 428, 603];
  if (material === 'B' || material === 'G') {
    if (x < 57 || x > 433 || y < 403 || y > 608) return 0;
    if (x > 71 && x < 419 && y > 419 && y < 590) return 1;
    if (material === 'B') return smooth((Math.max(...rgb) - 0.3) / 0.35);
    return smooth((rgb[0] - rgb[1] + 0.01) / 0.09);
  }
  const [l, t, r, b] = bounds as [number, number, number, number];
  return smooth((Math.min(x - l, r - x, y - t, b - y) + 0.5) / 1.5);
}
export function colorEarlyFrame(
  image: { width: number; height: number; data: Uint8ClampedArray },
  profile: EarlyHsbProfile,
  family: string,
  material: string,
) {
  for (let y = 0; y < image.height; y++)
    for (let x = 0; x < image.width; x++) {
      const i = (y * image.width + x) * 4;
      if (image.data[i + 3] === 0) continue;
      const rgb: Rgb = [image.data[i]! / 255, image.data[i + 1]! / 255, image.data[i + 2]! / 255];
      // Preserve neutral black/white outlines and baked border ink. Colored
      // textures remain multiplicative in brightness, including their shadows.
      const v = Math.max(...rgb),
        s = v === 0 ? 0 : (v - Math.min(...rgb)) / v;
      if (v < 0.075 || (s < 0.025 && v > 0.97)) continue;
      const p = earlyPaperWeight(
        ((x + 0.5) * 488) / image.width,
        ((y + 0.5) * 680) / image.height,
        rgb,
        family,
        material,
      );
      const frame = adjustHsb(rgb, profile.frame ?? IDENTITY_HSB),
        paper = adjustHsb(rgb, profile.paper ?? IDENTITY_HSB);
      for (let c = 0; c < 3; c++)
        image.data[i + c] = Math.round(255 * (frame[c]! * (1 - p) + paper[c]! * p));
    }
}
