import type { RenderedCardInput } from './face-layout.js';
import type { FrameHsb } from './frame-hsb.js';
import type { PaperMask } from './frame-paper-mask.js';
import { framePlate } from './frame-plates.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';
import { PLANAR_COLORS } from './planar-color-values.js';
import { planarFrameBlackPoint } from './planar-blackpoint.js';

const polygon = (points: readonly (readonly [number, number])[]): PaperMask => ({
  kind: 'polygon',
  points: points.map(([x, y]) => [x / 488, y / 680]),
  feather: 0.75 / 488,
});
// Source-local panel outlines, before the shared geometry transform. Their
// bevels and dark keylines retain the source's relief and the frame pigment.
const title = polygon([
  [43, 41],
  [445, 41],
  [449, 48],
  [450, 58],
  [446, 72],
  [42, 72],
  [38, 64],
  [37, 54],
  [39, 46],
]);
const type = polygon([
  [43, 388],
  [445, 388],
  [449, 395],
  [450, 402],
  [446, 414],
  [42, 414],
  [38, 407],
  [37, 399],
  [39, 392],
]);

/** Opt-in, exact-source PLC materials. No scan transform enters rendering;
 * existing bounded material preparation caches each static result. */
export function planarFrameMaterials(face: RenderedCardInput): Readonly<Record<string, FrameHsb>> {
  if (
    face.setCode?.toLowerCase() !== 'plc' ||
    face.frameAssetFamily !== 'eighth' ||
    face.colorCalibration !== 'set-hsb-v1' ||
    face.frameTemplate ||
    (face.layout && face.layout !== 'normal')
  )
    return {};
  const plate = framePlate(face);
  if (!plate || !usesPlanarFrameGeometry(face, plate.frame)) return {};
  const blackPoint = planarFrameBlackPoint(face, plate.frame);
  const entry = Object.entries(PLANAR_COLORS).find(([, p]) => p.source === plate.frame);
  // Colorshifted green retained its source pigment after the earlier HSB fit.
  // Its independently measured ink curve does not require adopting a pigment fit.
  if (!entry)
    return blackPoint
      ? { [plate.frame]: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, blackPoint } }
      : {};
  const [key, profile] = entry;
  const bottom = key.endsWith('/W') || key.endsWith('/M') ? 615 : 610;
  const materials: Record<string, FrameHsb> = {
    [plate.frame]: {
      blackPoint,
      frame: profile.frame,
      paper: profile.paper,
      mask: {
        kind: 'rect',
        rect: [41 / 488, 425 / 680, 405 / 488, (bottom - 425) / 680],
        feather: 0.75 / 488,
      },
      regions: [
        { mask: title, adjustment: profile.title },
        { mask: type, adjustment: profile.type },
      ],
    },
  };
  // Colored rails come from the same mono sources used by this set's frame
  // study. Reuse their frame pigment adjustment, with no paper/panel changes.
  for (const url of plate.pinlines ? [plate.pinlines.left, plate.pinlines.right] : []) {
    const mono = Object.values(PLANAR_COLORS).find((p) => p.source === url);
    if (mono) materials[url] = mono.frame;
  }
  return materials;
}
