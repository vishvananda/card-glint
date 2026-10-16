import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import type { FrameHsb } from './frame-hsb.js';
import type { PaperMask } from './frame-paper-mask.js';
import { paperMask, titleMask, typeMask } from './future-color-masks.js';
import panels from './future-panel-colors.json' with { type: 'json' };
import { futureParts, futureTreatment } from './future-frame.js';
import { futureFullMaterials } from './future-full-color.js';
import { futureMseMaterials } from './future-mse-color.js';

const profiles: Readonly<Record<string, Omit<Extract<FrameHsb, { mask: PaperMask }>, 'mask'>>> = {
  A: {
    frame: {
      hueDegrees: -6.794165580182494,
      saturationScale: 0.7130415909549775,
      brightnessScale: 1.083617747440273,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9201680672268907, 0.9121338912133891, 0.9253112033195021],
    },
  },
  W: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9244897959183672, 0.9248971193415638, 0.93125],
    },
  },
  U: {
    frame: {
      hueDegrees: 0,
      saturationScale: 1.0931250000000001,
      brightnessScale: 0.8931249999999998,
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8502155172413793, 0.8613445378151261, 0.9300411522633745],
    },
  },
  B: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1.0137500000000002 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8750000000000001, 0.8459821428571429, 0.8392857142857143],
    },
  },
  R: {
    frame: { hueDegrees: -4.625, saturationScale: 1.0362500000000012, brightnessScale: 1.065625 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9385245901639344, 0.8853161843515541, 0.84070796460177],
    },
  },
  G: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8961038961038961, 0.9102564102564102, 0.8887061403508772],
    },
  },
};

/** Source-bound FUT materials. Ordinary, artifact, MSE and textless profiles
 * have separate evidence and share the existing opt-in material cache. */
export function futureFrameMaterials(face: RenderedCardInput): Readonly<Record<string, FrameHsb>> {
  if (
    face.frameTemplate !== 'future' ||
    face.setCode?.toLowerCase() !== 'fut' ||
    face.colorCalibration !== 'set-hsb-v1'
  )
    return {};
  if (futureTreatment(face) === 'full-art') return futureFullMaterials(face);
  if (futureTreatment(face) !== 'regular') return {};
  const asset = futureParts(face).base;
  for (const [color, profile] of Object.entries(profiles))
    if (
      asset ===
      manifest.CONJURER_ROOT + '/img/frames/future/regular/futureFrame' + color + '.png'
    ) {
      const panel = panels[color as keyof typeof panels];
      const adjustment = (rgbScale: readonly number[]) => ({
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: rgbScale as readonly [number, number, number],
      });
      const stats = futureParts(face).stats;
      return {
        [asset]: {
          ...profile,
          mask: paperMask,
          regions: [
            { mask: titleMask, adjustment: adjustment(panel.title) },
            { mask: typeMask, adjustment: adjustment(panel.type) },
          ],
        },
        ...(stats && panel.stats ? { [stats]: adjustment(panel.stats) } : {}),
      };
    }
  return futureMseMaterials(face);
}
