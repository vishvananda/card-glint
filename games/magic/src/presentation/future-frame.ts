import manifest from '../../assets.json' with { type: 'json' };
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';

const CC = `${manifest.CONJURER_ROOT}/img/frames/future/regular`;
const MSE = manifest.MSE_TEMPLATE_ROOT;
export const FUTURE_REGULAR_ROOT = `${MSE}/magic-future.mse-style`;
const FULL = `${MSE}/magic-future-textless.mse-style`;

/** Physical treatment is independent of the selected rules wording. */
export function futureTreatment(face: RenderedCardInput) {
  // Colorless printings use an ordinary paper panel. The optional transparent
  // fan template is a separate physical treatment, never inferred from color.
  return face.futureTreatment ?? 'regular';
}

export function futurePalette(face: RenderedCardInput): string[] {
  const colors = resolveFrameColors(face);
  // Clockwise mana order, including the two pairs that cross WUBRG's origin.
  return colors.join('') === 'WG' ? ['G', 'W'] : colors.join('') === 'WR' ? ['R', 'W'] : colors;
}

export function futureParts(face: RenderedCardInput) {
  const profile = resolveCardProfile(face),
    palette = futurePalette(face),
    treatment = futureTreatment(face),
    full = treatment === 'full-art',
    land = profile.land && !full,
    colorless = treatment === 'regular' && !land && !profile.artifact && palette.length === 0,
    mse = land || colorless,
    color = palette.length > 1 ? 'M' : (palette[0] ?? (profile.artifact ? 'A' : 'C')),
    material = (palette[0]?.toLowerCase() ?? 'c') + 'l',
    dual = land && palette.length === 2,
    back = (palette[1]?.toLowerCase() ?? 'c') + 'l',
    stats = face.power != null && face.toughness != null;
  if (full && !/^[WUBRG]$/.test(color))
    throw Error('Futureshifted full-art plates require one printed frame color');
  const white = ['U', 'B', 'R', 'G'].includes(color) && !(land && dual);
  const types = [
    'Artifact',
    'Creature',
    'Enchantment',
    'Instant',
    'Land',
    'Planeswalker',
    'Sorcery',
  ].filter((type) => new RegExp(`\\b${type}\\b`).test(face.typeLine ?? ''));
  if (/\b(?:Tribal|Kindred)\b/.test(face.typeLine ?? '')) types.push('Tribal');
  const type = types.length > 1 ? 'multitype' : types[0]?.toLowerCase();
  const typeWhite = land ? ['U', 'B', 'R', 'G'].includes(palette[0] ?? '') : white;
  return {
    kind: 'future' as const,
    base: full
      ? `${FULL}/${color.toLowerCase()}card.jpg`
      : mse
        ? `${FUTURE_REGULAR_ROOT}/${colorless ? 'c' : material}card.jpg`
        : `${CC}/futureFrame${color}.png`,
    ...(full ? { mask: `${FULL}/mask_image.png` } : {}),
    ...(mse
      ? {
          mask: `${FUTURE_REGULAR_ROOT}/mask_image.png`,
          paper: `${FUTURE_REGULAR_ROOT}/${colorless ? 'c' : profile.creature ? color.toLowerCase() : material}textbox.png`,
          type: `${FUTURE_REGULAR_ROOT}/${colorless ? 'c' : material}typeline.png`,
        }
      : {}),
    ...(dual
      ? {
          reverseBase: `${FUTURE_REGULAR_ROOT}/${back}card.jpg`,
          reversePaper: `${FUTURE_REGULAR_ROOT}/${back}textbox.png`,
          reverseType: `${FUTURE_REGULAR_ROOT}/${back}typeline.png`,
          neutralBase: `${FUTURE_REGULAR_ROOT}/clcard.jpg`,
          neutralType: `${FUTURE_REGULAR_ROOT}/cltypeline.png`,
          baseBlend: `${FUTURE_REGULAR_ROOT}/hybrid_blend_card.png`,
          typeBlend: `${FUTURE_REGULAR_ROOT}/hybrid_blend_typeline.png`,
        }
      : {}),
    ...(stats
      ? {
          stats: full
            ? `${FULL}/${color.toLowerCase()}pt.jpg`
            : mse
              ? `${FUTURE_REGULAR_ROOT}/${colorless ? 'c' : material}pt.png`
              : `${CC}/futurePT${color}.png`,
          ...(full ? { statsMask: `${FULL}/mask_pt.png` } : {}),
        }
      : {}),
    ...(type
      ? {
          typeSymbol: `${MSE}/magic-future-common.mse-include/${type}_${typeWhite ? 'white' : 'black'}.png`,
        }
      : {}),
    ...(face.artist
      ? {
          brush: `${manifest.CONJURER_ROOT}/img/manaSymbols/${land || white ? 'whitebrush' : 'brush'}.svg`,
        }
      : {}),
  };
}

/** Visible art fit, rather than the larger source mask hidden behind printing.
 * Coordinates stay in canonical card pixels. Source calibration follows after
 * all three physical treatments have been assembled and reviewed. */
export function futureGeometry(face: RenderedCardInput) {
  const treatment = futureTreatment(face),
    full = treatment === 'full-art';
  return {
    art: (full
      ? [32, 83, 433, 476]
      : treatment === 'clear' || face.artPlacement?.mode === 'behind-text'
        ? [23, 22, 442, 637]
        : [32, 83, 433, 297]) as FaceRect,
    title: [86, 32, 360, 43] as FaceRect,
    type: [59, full ? 560 : 382, 367, 40] as FaceRect,
    rules: [50, 433, 393, 166] as FaceRect,
    stats: [377, 609, 69, 40] as FaceRect,
    symbol: [431, full ? 571 : 389, 29, 29] as FaceRect,
    footer: [38, 611, 404, 35] as FaceRect,
  };
}
