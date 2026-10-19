import { type CanvasRaster, rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import { adjustHsb, type HsbAdjustment } from './hsb.js';

/** Alternating ELD calibration, validated on the reserved ELD cards and WOE.
 * CLB's darker printing does not share this correction. Neutral hues are locked
 * to avoid turning near-gray paper pink. No per-card scan coefficients enter here. */
const PAPER: Readonly<Record<string, HsbAdjustment>> = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 },
};

/** RGB work happens once while constructing the cached material, before any
 * text is painted. Clip to the source's curved lower page, preserving headers,
 * the left folded edge, black book outline and colored bottom rail. */
export function prepareAdventurePaper(
  canvas: CanvasRaster,
  face: RenderedCardInput,
  material: string,
) {
  if (
    face.colorCalibration !== 'set-hsb-v1' ||
    !['eld', 'woe'].includes(face.setCode?.toLowerCase() ?? '')
  )
    return;
  const adjustment = PAPER[material.toUpperCase()];
  if (!adjustment) return;
  const c = canvas.getContext('2d')!,
    w = canvas.width,
    h = canvas.height;
  const region = [
    Math.floor((31 * w) / 488),
    Math.floor((487 * h) / 680),
    Math.ceil((214 * w) / 488),
    Math.ceil((142 * h) / 680),
  ] as const;
  const pixels = c.getImageData(...region);
  for (let i = 0; i < pixels.data.length; i += 4) {
    if (!pixels.data[i + 3]) continue;
    const rgb = adjustHsb(
      [pixels.data[i]! / 255, pixels.data[i + 1]! / 255, pixels.data[i + 2]! / 255],
      adjustment,
    );
    for (let channel = 0; channel < 3; channel++)
      pixels.data[i + channel] = Math.round(rgb[channel]! * 255);
  }
  const paper = rasterCanvas();
  paper.width = region[2];
  paper.height = region[3];
  paper.getContext('2d')!.putImageData(pixels, 0, 0);
  c.save();
  c.scale(w / 488, h / 680);
  c.beginPath();
  c.moveTo(31.8, 488.3);
  c.lineTo(218, 488.3);
  c.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496);
  c.lineTo(244, 627.4);
  c.lineTo(31.8, 627.4);
  c.closePath();
  c.clip();
  c.drawImage(
    paper,
    (region[0] * 488) / w,
    (region[1] * 680) / h,
    (region[2] * 488) / w,
    (region[3] * 680) / h,
  );
  c.restore();
  paper.width = paper.height = 0;
}
