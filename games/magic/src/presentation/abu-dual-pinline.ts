import type { Rgb } from './hsb.js';
import { dualLandPinline, type DualBorderGeometry } from './dual-land-pinline.js';

// ABU artwork has its own geometry; Revised uses a cropped Fourth plate.
// Source coordinates are 1500 × 2100. Compensate for its aspect ratio so the
// physical thickness is identical on all four sides of the finished card.
export const ABU_DUAL_BOX = {
  left: 61.063333333333325 / (488 / 1500),
  right: 427.9656666666666 / (488 / 1500),
  top: 404.6309523809524 / (680 / 2100),
  bottom: 606.325 / (680 / 2100),
};
const SOURCE_BOX = { left: 188, right: 1324, top: 1253, bottom: 1871 };
const SOURCE_WIDTH = { left: 26, right: 29, top: 29, bottom: 28 };
export const ABU_DUAL_BAND_WIDTH = 6.375;
const horizontal = ABU_DUAL_BAND_WIDTH / (488 / 1500);
const vertical = ABU_DUAL_BAND_WIDTH / (680 / 2100);
const width = { left: horizontal, right: horizontal, top: vertical, bottom: vertical };

// Median colored-line samples from the pinned Card Conjurer ABU plates.
// Preserve this source palette; neutral-land HSB is not valid for these plates.
const PALETTE: Readonly<Record<string, Rgb>> = {
  W: [186 / 255, 177 / 255, 176 / 255],
  U: [72 / 255, 110 / 255, 137 / 255],
  B: [88 / 255, 77 / 255, 85 / 255],
  R: [182 / 255, 62 / 255, 81 / 255],
  G: [129 / 255, 149 / 255, 92 / 255],
};

/** Cached static material preparation, never an animation-frame operation. */
export function colorAbuDualPinline(
  pixels: ImageData,
  colors: readonly string[],
  calibrated?: DualBorderGeometry & { readonly palette: Readonly<Partial<Record<string, Rgb>>> },
): void {
  const box = calibrated?.box ?? ABU_DUAL_BOX;
  const ringWidth = calibrated?.width ?? width;
  if (colors.length !== 2) return;
  const pair = [...colors].sort((a, b) => 'RGUBW'.indexOf(a) - 'RGUBW'.indexOf(b));
  const inks = pair.map((color) => (calibrated?.palette ?? PALETTE)[color]);
  if (!inks[0] || !inks[1]) return;
  const pw = 1500 / pixels.width,
    ph = 2100 / pixels.height;
  const original = pixels.data.slice();
  const left = Math.min(box.left, SOURCE_BOX.left),
    right = Math.max(box.right, SOURCE_BOX.right),
    top = Math.min(box.top, SOURCE_BOX.top),
    bottom = Math.max(box.bottom, SOURCE_BOX.bottom);
  for (let y = Math.floor(top / ph); y < Math.ceil(bottom / ph); y++)
    for (let x = Math.floor(left / pw); x < Math.ceil(right / pw); x++) {
      const p = dualLandPinline((x + 0.5) * pw, (y + 0.5) * ph, pw, ph, [inks[0], inks[1]], {
        box,
        width: ringWidth,
        edge: calibrated?.edge,
      });
      const sx = (x + 0.5) * pw,
        sy = (y + 0.5) * ph;
      const old = dualLandPinline(sx, sy, pw, ph, [inks[0], inks[1]], {
        box: SOURCE_BOX,
        width: SOURCE_WIDTH,
      });
      if (!p && !old) continue;
      const i = (y * pixels.width + x) * 4;
      if (!pixels.data[i + 3]) continue;
      if (old) {
        // Remove the former single-color outline where the new ring no longer
        // covers it. Sample adjacent stock, keeping the broad paper stripes.
        const distances = [
          sx - SOURCE_BOX.left,
          SOURCE_BOX.right - sx,
          sy - SOURCE_BOX.top,
          SOURCE_BOX.bottom - sy,
        ];
        const side = distances.indexOf(Math.min(...distances));
        const inside = sx >= box.left && sx < box.right && sy >= box.top && sy < box.bottom;
        const sampleX =
          side === 0
            ? SOURCE_BOX.left + (inside ? SOURCE_WIDTH.left + 2 : -2)
            : side === 1
              ? SOURCE_BOX.right - (inside ? SOURCE_WIDTH.right + 2 : -2)
              : sx;
        const sampleY =
          side === 2
            ? SOURCE_BOX.top + (inside ? SOURCE_WIDTH.top + 2 : -2)
            : side === 3
              ? SOURCE_BOX.bottom - (inside ? SOURCE_WIDTH.bottom + 2 : -2)
              : sy;
        const source = (Math.floor(sampleY / ph) * pixels.width + Math.floor(sampleX / pw)) * 4;
        for (let k = 0; k < 3; k++)
          pixels.data[i + k] =
            original[i + k]! * (1 - old.alpha) + original[source + k]! * old.alpha;
      }
      if (p)
        for (let k = 0; k < 3; k++)
          pixels.data[i + k] = pixels.data[i + k]! * (1 - p.alpha) + p.color[k]! * 255 * p.alpha;
    }
}
