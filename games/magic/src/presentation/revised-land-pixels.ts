import { adjustHsb, type HsbAdjustment, type Rgb } from './hsb.js';
import type { FramePixels } from './frame-paper-mask.js';

const PAPER: Readonly<Record<string, HsbAdjustment>> = {
  W: { hueDegrees: 8.4847, saturationScale: 0.42831, brightnessScale: 0.97071 },
  U: { hueDegrees: 164.886, saturationScale: 0.25883, brightnessScale: 0.841 },
  B: { hueDegrees: 157.329, saturationScale: 0.20015, brightnessScale: 0.62552 },
  R: { hueDegrees: -23.3867, saturationScale: 0.88939, brightnessScale: 0.9205 },
  G: { hueDegrees: 30.7835, saturationScale: 0.6094, brightnessScale: 0.79916 },
};
// Semantic color palette measured from the existing ABU colored-land assets.
// Printing calibration is optional and replaces this raw asset palette.
const RAW_PAPER: Readonly<Record<string, HsbAdjustment>> = {
  W: { hueDegrees: 7.44281, saturationScale: 0.570206, brightnessScale: 0.845188 },
  U: { hueDegrees: -177.38556, saturationScale: 0.121282, brightnessScale: 0.656904 },
  B: { hueDegrees: 0, saturationScale: 0, brightnessScale: 0.452356 },
  R: { hueDegrees: -34.23136, saturationScale: 1.238404, brightnessScale: 0.866109 },
  G: { hueDegrees: 42.19413, saturationScale: 0.716825, brightnessScale: 0.656904 },
};
const IDENTITY: HsbAdjustment = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
const PIN: Readonly<Record<string, Rgb>> = {
  W: [0.9, 0.91, 0.9],
  U: [0.32, 0.58, 0.75],
  B: [0.38, 0.4, 0.38],
  R: [0.8, 0.32, 0.34],
  G: [0.6, 0.66, 0.29],
};
const FRAME: HsbAdjustment = { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.992232 };
// Shared fit to normalized Revised duals, in the pinned 1500 × 2100 source.
// All ten color pairs share these bounds; no per-card geometry.
const DUAL_BOX = { left: 165.71, right: 1341.17, top: 1253.66, bottom: 1883.12 };
const DUAL_WIDTH = { left: 19.89, right: 24.18, top: 19.87, bottom: 23.37 };

/** The three rules-box pinlines have their own color order, distinct from
 * the broad paper bands. Across the ten Revised pairs, R precedes G, then
 * U, B and W. The outer and inner strokes use that first color. */
function dualPinline(sx: number, sy: number, colors: readonly Rgb[]): Rgb | undefined {
  if (colors.length !== 2) return undefined;
  const inset = Math.min(
    (sx - DUAL_BOX.left) / DUAL_WIDTH.left,
    (DUAL_BOX.right - sx) / DUAL_WIDTH.right,
    (sy - DUAL_BOX.top) / DUAL_WIDTH.top,
    (DUAL_BOX.bottom - sy) / DUAL_WIDTH.bottom,
  );
  if (inset < 0 || inset >= 1) return undefined;
  if (
    inset < 0.06 ||
    (inset >= 0.24 && inset < 0.29) ||
    (inset >= 0.72 && inset < 0.77) ||
    inset >= 0.95
  )
    return [0.18, 0.18, 0.17];
  return colors[inset >= 0.29 && inset < 0.72 ? 1 : 0]!;
}

/** Recolor the pinned source once during cached material preparation. The
 * gold-pigment mask is confined to pinlines, preserving black ink and relief.
 * Alternating paper bands retain the source's texture instead of flat fills. */
export function colorRevisedLand(
  image: FramePixels,
  colors: readonly string[],
  calibrated: boolean,
) {
  const paperPalette = calibrated ? PAPER : RAW_PAPER;
  const first = colors[0],
    second = colors[1] ?? first;
  if (!first || !second || !PAPER[first] || !PAPER[second]) return;
  const pinColors =
    colors.length === 2
      ? [...colors]
          .sort((a, b) => 'RGUBW'.indexOf(a) - 'RGUBW'.indexOf(b))
          .map((color) => PIN[color]!)
      : [];
  // Only preparation reads this copy. Newly exposed paper must not retain
  // the old asset's gold line or its baked shadow under the colored bands.
  const source = pinColors.length ? image.data.slice() : undefined;
  for (let y = 0; y < image.height; y++)
    for (let x = 0; x < image.width; x++) {
      const i = (y * image.width + x) * 4;
      if (!image.data[i + 3]) continue;
      const sx = ((x + 0.5) * 1500) / image.width,
        sy = ((y + 0.5) * 2100) / image.height;
      const rgb: Rgb = [image.data[i]! / 255, image.data[i + 1]! / 255, image.data[i + 2]! / 255];
      const v = Math.max(...rgb);
      const border = dualPinline(sx, sy, pinColors);
      const paper = source
        ? sx >= DUAL_BOX.left + DUAL_WIDTH.left &&
          sx < DUAL_BOX.right - DUAL_WIDTH.right &&
          sy >= DUAL_BOX.top + DUAL_WIDTH.top &&
          sy < DUAL_BOX.bottom - DUAL_WIDTH.bottom
        : sx >= 187 && sx < 1320 && sy >= 1280 && sy < 1864;
      if (!border && v < 0.075 && !(source && paper)) continue;
      const artEdge = Math.min(sx - 126, 1379 - sx, sy - 153, 1171 - sy);
      const paperEdge = Math.min(sx - 170, 1340 - sx, sy - 1253, 1880 - sy);
      const pin = (artEdge >= -1 && artEdge < 13) || (paperEdge >= -1 && paperEdge < 29);
      let result: Rgb;
      if (border) {
        result = border;
      } else if (paper) {
        const inset = Math.min(
          ((sx - 187) * 488 * 0.984) / 1500,
          ((1320 - sx) * 488 * 0.984) / 1500,
          ((sy - 1280) * 680 * 0.99) / 2100,
          ((1864 - sy) * 680 * 0.99) / 2100,
        );
        const band = Math.floor(Math.max(0, inset) / 11.5);
        let paperRgb = rgb;
        if (source && (sx < 190 || sy < 1284)) {
          const px = Math.min(image.width - 1, Math.max(x, Math.ceil((190 * image.width) / 1500)));
          const py = Math.min(
            image.height - 1,
            Math.max(y, Math.ceil((1284 * image.height) / 2100)),
          );
          const index = (py * image.width + px) * 4;
          paperRgb = [source[index]! / 255, source[index + 1]! / 255, source[index + 2]! / 255];
        }
        result = adjustHsb(paperRgb, paperPalette[band % 2 ? second : first]!);
      } else if (
        pin &&
        rgb[0] > 0.45 &&
        rgb[1] > 0.35 &&
        rgb[2] < Math.min(rgb[0], rgb[1]) * 0.72
      ) {
        const color =
          PIN[(artEdge >= -1 && artEdge < 13 ? artEdge < 6 : paperEdge < 14) ? second : first]!;
        const light = v / 0.97;
        result = [
          Math.min(1, color[0] * light),
          Math.min(1, color[1] * light),
          Math.min(1, color[2] * light),
        ];
      } else result = adjustHsb(rgb, calibrated ? FRAME : IDENTITY);
      for (let k = 0; k < 3; k++) image.data[i + k] = Math.round(255 * result[k]!);
    }
}
