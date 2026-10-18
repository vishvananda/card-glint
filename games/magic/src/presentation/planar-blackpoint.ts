import type { RenderedCardInput } from './face-layout.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';
import type { FrameBlackPoint } from './frame-blackpoint.js';
import type { FrameMaterialBlend } from './frame-material-blend.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import type { Rgb } from './hsb.js';
import { PLANAR_TEXTURE } from '../data/tables.js';

// Lower-quartile native-raster ink residuals from three cards per source.
// Twenty-nine independent printings validate these five material-level fits.
// A single shared lift over-lightened the black plate's already tinted ink.
const INK: Readonly<Record<string, Rgb>> = {
  w: [22 / 255, 24 / 255, 18 / 255],
  u: [21 / 255, 25 / 255, 31 / 255],
  b: [3 / 255, 7 / 255, 14 / 255],
  r: [31 / 255, 25 / 255, 24 / 255],
  g: [16 / 255, 18 / 255, 21 / 255],
};

/** Independently sampled display-reference stock. The source geometry guard
 * excludes ordinary PLC, custom frames and other sets from this ink study. */
export function planarCalibratedStock(face: RenderedCardInput, source: string): string | undefined {
  return face.colorCalibration === 'set-hsb-v1' &&
    face.frameTreatment === 'colorshifted' &&
    source.includes('/colorshifted/') &&
    usesPlanarFrameGeometry(face, source)
    ? '#181510'
    : undefined;
}

export function planarFrameBlackPoint(
  face: RenderedCardInput,
  source: string,
): FrameBlackPoint | undefined {
  if (!planarCalibratedStock(face, source)) return undefined;
  const key = source.split('/').at(-1)?.replace('.png', ''),
    lift = key && INK[key];
  return lift
    ? {
        lift,
        transition: 96 / 255,
        ...(PLANAR_TEXTURE[key]!.knots.length
          ? {
              textureMaskSource: `${CONJURER_ROOT}/img/frames/8th/frame.png`,
              texture: PLANAR_TEXTURE[key]!.knots.map(
                ([x, rgb]) => [x / 255, [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255]] as const,
              ),
            }
          : {}),
      }
    : undefined;
}

export function planarBevelBlend(
  face: RenderedCardInput,
  source: string,
): FrameMaterialBlend | undefined {
  if (!planarCalibratedStock(face, source)) return undefined;
  const key = source.split('/').at(-1)?.replace('.png', ''),
    profile = key && PLANAR_TEXTURE[key];
  return profile
    ? {
        maskSource: `${CONJURER_ROOT}/img/frames/8th/pinline.png`,
        outerMaskSource: `${CONJURER_ROOT}/img/frames/8th/frame.png`,
        outset: 7 / 488,
        backdrop: [
          profile.bevel.backdrop[0] / 255,
          profile.bevel.backdrop[1] / 255,
          profile.bevel.backdrop[2] / 255,
        ],
        amount: profile.bevel.amount,
      }
    : undefined;
}
