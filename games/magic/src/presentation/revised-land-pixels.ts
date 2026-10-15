import { adjustHsb, type HsbAdjustment, type Rgb } from './hsb.js';
import type { FramePixels } from './frame-paper-mask.js';
import { DUAL_BOX, revisedDualPinline } from './revised-land-pinline.js';

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
      const border = revisedDualPinline(sx, sy, 1500 / image.width, 2100 / image.height, pinColors);
      const paper = source
        ? sx >= DUAL_BOX.left && sx < DUAL_BOX.right && sy >= DUAL_BOX.top && sy < DUAL_BOX.bottom
        : sx >= 187 && sx < 1320 && sy >= 1280 && sy < 1864;
      const retiredBorder = source && sx >= 165 && sx <= 1345 && sy >= 1248 && sy <= 1885;
      if (!border && v < 0.075 && !(source && paper) && !retiredBorder) continue;
      const artEdge = Math.min(sx - 126, 1379 - sx, sy - 153, 1171 - sy);
      const paperEdge = Math.min(sx - 170, 1340 - sx, sy - 1253, 1880 - sy);
      const pin = (artEdge >= -1 && artEdge < 13) || (paperEdge >= -1 && paperEdge < 29);
      let result: Rgb;
      if (paper) {
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
      } else if (retiredBorder) {
        // Clear the baked outline where the fitted box moves inward. Sample
        // adjacent unprinted stock; otherwise a second dark rim survives.
        const distances = [sx - 165, 1345 - sx, sy - 1248, 1885 - sy];
        const edge = distances.indexOf(Math.min(...distances));
        const sampleX = edge === 0 ? 160 : edge === 1 ? 1350 : sx;
        const sampleY = edge === 2 ? 1240 : edge === 3 ? 1890 : sy;
        const px = Math.min(image.width - 1, Math.floor((sampleX * image.width) / 1500));
        const py = Math.min(image.height - 1, Math.floor((sampleY * image.height) / 2100));
        const index = (py * image.width + px) * 4;
        result = adjustHsb(
          [source[index]! / 255, source[index + 1]! / 255, source[index + 2]! / 255],
          calibrated ? FRAME : IDENTITY,
        );
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
      for (let k = 0; k < 3; k++)
        image.data[i + k] = Math.round(
          255 *
            (border
              ? border.color[k]! * border.alpha + result[k]! * (1 - border.alpha)
              : result[k]!),
        );
    }
}
