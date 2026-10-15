import contours from './eighth-basic-contours.json' with { type: 'json' };
import type { FramePixels } from './frame-paper-mask.js';
import { adjustHsb, type Rgb } from './hsb.js';
import { EIGHTH_BASIC_OUTER, type EighthBasicPalette } from './eighth-basic-profile.js';

export const EIGHTH_BASIC_MASK = contours;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
type Boundary = readonly (readonly number[])[];
const position = (points: Boundary, y: number) => {
  let i = 0;
  while (i + 1 < points.length - 1 && points[i + 1]![0]! < y) i++;
  const a = points[i]!,
    b = points[i + 1]!;
  return a[1]! + clamp((y - a[0]!) / (b[0]! - a[0]!)) * (b[1]! - a[1]!);
};
function bounds(height: number, contour: { left: Boundary; right: Boundary }) {
  const { left, right } = contour;
  const top = Math.max(left[0]![0]!, right[0]![0]!),
    bottom = Math.min(left.at(-1)![0]!, right.at(-1)![0]!);
  return Array.from({ length: height }, (_, row) => {
    const y = ((row + 0.5) * 680) / height;
    return [position(left, y), position(right, y), Math.min(y - top, bottom - y)] as const;
  });
}
type Bounds = ReturnType<typeof bounds>[number];
const coverage = (b: Bounds, x: number) => smooth(0.5 + Math.min(x - b[0], b[1] - x, b[2]) / 0.4);
const mix = (a: Rgb, b: Rgb, weight: number): Rgb => [
  a[0] + weight * (b[0] - a[0]),
  a[1] + weight * (b[1] - a[1]),
  a[2] + weight * (b[2] - a[2]),
];

/** Source-UV masks are evaluated only on a derived-bitmap cache miss. The
 * renderer's independent geometry warp happens later and moves every material
 * together. Alpha, the art aperture and baked black keylines remain unchanged. */
export function colorEighthBasicFrame(image: FramePixels, palette: EighthBasicPalette) {
  const outer = bounds(image.height, contours.outer),
    title = bounds(image.height, contours.title),
    type = bounds(image.height, contours.type),
    paper = bounds(image.height, contours.paper);
  for (let y = 0; y < image.height; y++)
    for (let x = 0; x < image.width; x++) {
      const i = (y * image.width + x) * 4;
      if (!image.data[i + 3]) continue;
      const rgb: Rgb = [image.data[i]! / 255, image.data[i + 1]! / 255, image.data[i + 2]! / 255],
        value = Math.max(...rgb);
      if (value < 0.075) continue;
      const xx = ((x + 0.5) * 488) / image.width,
        inside = coverage(outer[y]!, xx),
        header = Math.max(coverage(title[y]!, xx), coverage(type[y]!, xx)),
        parchment = coverage(paper[y]!, xx);
      let changed: Rgb;
      if (inside < 1) {
        const gain = Math.pow(value, EIGHTH_BASIC_OUTER.gamma) / value;
        const toned = adjustHsb([rgb[0] * gain, rgb[1] * gain, rgb[2] * gain], EIGHTH_BASIC_OUTER);
        changed = mix(rgb, toned, smooth((value - 0.075) / 0.125));
      } else changed = rgb;
      if (inside > 0) {
        const fill = parchment > 0 ? palette.paper : palette.header;
        const fillWeight = Math.max(header, parchment);
        const pin = fillWeight === 1 ? rgb : adjustHsb(rgb, palette.pinline);
        const colored = fillWeight > 0 ? mix(pin, adjustHsb(rgb, fill), fillWeight) : pin;
        changed = mix(changed, colored, inside);
      }
      for (let c = 0; c < 3; c++) image.data[i + c] = Math.round(255 * changed[c]!);
    }
}

/** Tint the glyph's chromatic fill without tinting neutral baked shadows or
 * white bevels. Pure black, white and gray are fixed anchors. */
export function colorEighthBasicGlyph(image: FramePixels, palette: EighthBasicPalette['glyph']) {
  const average = (v: Rgb) => (v[0] + v[1] + v[2]) / 3;
  const mean = average(palette.source),
    axis = palette.source.map((v) => v - mean),
    norm = axis.reduce((s, v) => s + v * v, 0);
  if (norm <= 1e-6) throw Error('Basic glyph fill cannot be separated from neutral details.');
  for (let i = 0; i < image.data.length; i += 4) {
    if (!image.data[i + 3]) continue;
    const rgb: Rgb = [image.data[i]! / 255, image.data[i + 1]! / 255, image.data[i + 2]! / 255],
      gray = average(rgb),
      weight = clamp(rgb.reduce((s, v, c) => s + (v - gray) * axis[c]!, 0) / norm);
    for (let c = 0; c < 3; c++)
      image.data[i + c] = Math.round(
        255 * clamp(rgb[c]! + weight * (palette.target[c]! - palette.source[c]!)),
      );
  }
}
