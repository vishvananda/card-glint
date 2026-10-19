import { calibrationForFace } from '../calibration/selection.js';
import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { retroDualFrame } from './retro-dual-frame.js';

/** Printing-level material selection shared by original and Oracle wording. */
export function earlyReprintFrame(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  if (
    !set ||
    !calibrationForFace(face) ||
    face.frameTemplate ||
    face.frameAssetFamily ||
    face.frameStyle === 'modern' ||
    (face.borderColor && face.borderColor !== calibrationForFace(face)!.border) ||
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  const type = face.typeLine ?? '',
    colors = resolveFrameColors(face);
  const land = face.land ?? /\bLand\b/.test(type);
  let material: string | undefined;
  let landColor: string | undefined;
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
    if (landColors.length === 1) {
      landColor = landColors[0];
      material = calibrationForFace(face)!.frames.L?.landPalette ? 'L' : `L-${landColor}`;
    } else if (landColors.length > 1) {
      if (!retroDualFrame(face)) return undefined;
      material = 'L';
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
  const geometry = material && calibrationForFace(face)!.frames[material];
  if (!geometry) return undefined;
  const dual = retroDualFrame(face);
  if (dual && geometry.family !== 'abu') return undefined;
  const assetKey =
    geometry.landPalette && landColor ? `${landColor.toLowerCase()}l` : geometry.assetKey;
  const asset =
    dual?.base ?? `${manifest.RETRO_ROOT}/img/frames/old/${geometry.family}/${assetKey}.png`;
  const pigment =
    dual || (geometry.landPalette && landColor)
      ? `L-${asset.split('/').at(-1)![0]!.toUpperCase()}`
      : material === 'L'
        ? set === 'chr' && face.name === 'Safe Haven'
          ? 'L-dark'
          : (set === 'chr' && face.name === 'City of Brass') ||
              (set === '4ed' && face.name === 'Oasis')
            ? 'L-gold'
            : 'L-red'
        : material;
  return {
    ...geometry,
    stockWindow: geometry.stockMask === 'source' ? undefined : geometry.stockWindow,
    material,
    profile: `${set}/${pigment}`,
    asset,
  };
}
