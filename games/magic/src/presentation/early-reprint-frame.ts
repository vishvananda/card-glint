import { setCalibrationProfile } from '../calibration/profiles.js';
import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { EARLY_REPRINT_FRAMES } from './early-reprint-frame-values.js';

/** Printing-level material selection shared by original and Oracle wording. */
export function earlyReprintFrame(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  if (
    !set ||
    !setCalibrationProfile(set) ||
    face.frameTemplate ||
    face.frameAssetFamily ||
    face.frameStyle === 'modern' ||
    (face.borderColor && face.borderColor !== setCalibrationProfile(set)!.border) ||
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  const type = face.typeLine ?? '',
    colors = resolveFrameColors(face);
  const land = face.land ?? /\bLand\b/.test(type);
  let material: string | undefined;
  if (land) {
    // The original basics say only "Land". Explicit frame colors or their
    // printed names retain the same plate when switching to Oracle wording.
    const basics: Readonly<Record<string, string>> = {
      Plains: 'W',
      Island: 'U',
      Swamp: 'B',
      Mountain: 'R',
      Forest: 'G',
    };
    const basic = basics[face.name];
    const landColors = face.frameColors ?? (basic ? [basic] : []);
    if (landColors.length) {
      if (set !== '4ed' || landColors.length !== 1) return undefined;
      material = `L-${landColors[0]}`;
    } else material = 'L';
  } else
    material =
      (face.artifact ?? /\bArtifact\b/.test(type))
        ? 'A'
        : colors.length === 1
          ? colors[0]
          : colors.length > 1
            ? 'M'
            : undefined;
  const geometry = material && EARLY_REPRINT_FRAMES[`${set}/${material}`];
  if (!geometry) return undefined;
  const pigment =
    material === 'L'
      ? set === 'chr' && face.name === 'Safe Haven'
        ? 'L-dark'
        : (set === 'chr' && face.name === 'City of Brass') ||
            (set === '4ed' && face.name === 'Oasis')
          ? 'L-gold'
          : 'L-red'
      : material;
  return {
    ...geometry,
    material,
    profile: `${set}/${pigment}`,
    asset: `${manifest.RETRO_ROOT}/img/frames/old/${geometry.family}/${geometry.assetKey}.png`,
  };
}
