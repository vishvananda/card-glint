import type { FaceRect } from './face-layout.js';
import type { FramePixels } from './frame-paper-mask.js';
import { rgbToHsb } from './hsb.js';

/** Source-local pigment selection. Rings limit a color correction to printed
 * outlines; hue/saturation weights preserve neighboring gray bevels and ink. */
export interface FrameAccentMask {
  rings: readonly { outer: FaceRect; inner: FaceRect }[];
  hueCenter: number;
  hueRadius: number;
  hueFeather: number;
  saturation: readonly [number, number];
}
const smooth = (v: number) => {
  const t = Math.max(0, Math.min(1, v));
  return t * t * (3 - 2 * t);
};
const contains = ([x, y, w, h]: FaceRect, px: number, py: number) =>
  px >= x && py >= y && px < x + w && py < y + h;

/** Called only while preparing a derived bitmap, using the original source
 * pixels. The mask is discarded after recoloring, not read back while drawing. */
export function frameAccentMask(image: FramePixels, spec: FrameAccentMask): Float32Array {
  if (
    !(spec.hueCenter >= 0 && spec.hueCenter < 360) ||
    !(spec.hueRadius > 0 && spec.hueRadius <= 180) ||
    !(spec.hueFeather > 0 && spec.hueFeather <= spec.hueRadius) ||
    !(spec.saturation[0] >= 0 && spec.saturation[1] > spec.saturation[0] && spec.saturation[1] <= 1)
  )
    throw Error('Invalid source pigment mask.');
  for (const { outer, inner } of spec.rings)
    if (
      ![...outer, ...inner].every(Number.isFinite) ||
      outer[2] <= 0 ||
      outer[3] <= 0 ||
      inner[2] <= 0 ||
      inner[3] <= 0 ||
      inner[0] < outer[0] ||
      inner[1] < outer[1] ||
      inner[0] + inner[2] > outer[0] + outer[2] ||
      inner[1] + inner[3] > outer[1] + outer[3]
    )
      throw Error('Source pigment rings need nested positive rectangles.');
  const values = new Float32Array(image.width * image.height);
  for (let y = 0; y < image.height; y++)
    for (let x = 0; x < image.width; x++) {
      const p = y * image.width + x,
        at = p * 4,
        px = (x + 0.5) / image.width,
        py = (y + 0.5) / image.height;
      if (
        !image.data[at + 3] ||
        !spec.rings.some((r) => contains(r.outer, px, py) && !contains(r.inner, px, py))
      )
        continue;
      const [hue, saturation] = rgbToHsb([
        image.data[at]! / 255,
        image.data[at + 1]! / 255,
        image.data[at + 2]! / 255,
      ]);
      const distance = Math.abs(((hue - spec.hueCenter + 540) % 360) - 180);
      values[p] =
        smooth((spec.hueRadius - distance) / spec.hueFeather) *
        smooth((saturation - spec.saturation[0]) / (spec.saturation[1] - spec.saturation[0]));
    }
  return values;
}
