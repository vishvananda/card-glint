import { calibrationForFace } from '../calibration/selection.js';
import { calibratedFrameSource } from '../calibration/frame-source.js';
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { retroLandColors } from './retro-land-colors.js';
import { earlyReprintDual } from './early-reprint-dual.js';

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
  let dual: ReturnType<typeof earlyReprintDual>;
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
    const landColors =
      face.frameColors ??
      (basic ? [basic] : calibrationForFace(face)!.dualLand ? retroLandColors(face) : []);
    const named =
      face.frameColors === undefined
        ? calibrationForFace(face)!.landMaterials?.[face.name]
        : undefined;
    const explicit =
      face.frameColors && !calibrationForFace(face)!.dualLand
        ? ['L-' + face.frameColors.join(''), 'L-' + [...face.frameColors].reverse().join('')].find(
            (key) => Boolean(calibrationForFace(face)!.frames[key]),
          )
        : undefined;
    if (named || explicit) material = named ?? explicit;
    else if (landColors.length === 2) {
      dual = earlyReprintDual(calibrationForFace(face)!, retroLandColors(face));
      if (!dual) return undefined;
      material = 'L-dual';
    } else if (landColors.length) {
      if (landColors.length !== 1) return undefined;
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
  const geometry = material && calibrationForFace(face)!.frames[material];
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
    dual,
    material,
    profile: `${set}/${pigment}`,
    asset: dual?.base ?? calibratedFrameSource(geometry),
  };
}
