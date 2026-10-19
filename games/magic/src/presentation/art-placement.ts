import { coverImage, type ImageFit } from '../../../../packages/browser/src/image-cover.js';
import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { faceRects } from './special-frames.js';
import { illustrationTarget } from './illustration-layout.js';
import { battleNativeRect, battlePhysicalRect } from './battle-layout.js';
export interface ArtPlacement extends ImageFit {
  mode: 'window' | 'behind-text';
  /** Behind-text paper opacity; defaults to 0.8. Printing remains opaque. */
  paperOpacity?: number;
}
export function artPlacementSupport(face: RenderedCardInput): {
  modes: readonly ArtPlacement['mode'][];
  reason?: string;
} {
  if (
    face.faces?.length ||
    (face.layout &&
      !['normal', 'token', 'transform', 'modal_dfc', 'reversible_card', 'meld'].includes(
        face.layout,
      )) ||
    (face.frameTemplate && face.frameTemplate !== 'future') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '') ||
    /^Level up\b/m.test(face.rulesText ?? '')
  )
    return {
      modes: [],
      reason:
        'Art placement currently requires an ordinary physical face or Futureshifted template.',
    };
  return {
    modes:
      face.frameTemplate === 'future' && face.futureTreatment !== 'full-art'
        ? ['window', 'behind-text']
        : ['window'],
  };
}
export function validateArtPlacement(face: RenderedCardInput): void {
  const choice = face.artPlacement;
  if (choice === undefined) return;
  if (!choice || typeof choice !== 'object' || Array.isArray(choice))
    throw Error('Invalid artwork placement');
  if (
    Object.keys(choice).some((key) => !['mode', 'focalPoint', 'zoom', 'paperOpacity'].includes(key))
  )
    throw Error('Unknown artwork placement option');
  if (!artPlacementSupport(face).modes.includes(choice.mode))
    throw Error('This frame does not support the selected art placement.');
  if (
    choice.paperOpacity !== undefined &&
    (choice.mode !== 'behind-text' ||
      !Number.isFinite(choice.paperOpacity) ||
      choice.paperOpacity < 0 ||
      choice.paperOpacity > 1)
  )
    throw Error('Paper opacity requires behind-text mode and a value within 0..1');
  coverImage(1, 1, [0, 0, 1, 1], choice);
}
/** Explicit user placement replaces frame-bound import positioning. Source image
 * trimming remains attached to that image. Neither argument is mutated. */
export function resolveArtPlacement(
  face: RenderedCardInput,
  choice: ArtPlacement,
): RenderedCardInput {
  const { illustrationPlacement: _importPosition, ...source } = face;
  const result = { ...source, artPlacement: structuredClone(choice) };
  validateArtPlacement(result);
  return result;
}
/** Normalized coordinates for crop UI; the painter, GPU etching and exports use
 * the same cover fit. Dimensions are those of the original uploaded image. */
export function artworkGeometry(
  face: RenderedCardInput,
  width: number,
  height: number,
): { source: FaceRect; destination: FaceRect; aperture: FaceRect } {
  validateArtPlacement(face);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
    throw Error('Artwork dimensions must be positive');
  const source = face.illustrationCrop ?? [0, 0, 1, 1],
    aperture = faceRects(face).art,
    battle = face.frameTemplate === 'battle';
  const target = battle
    ? illustrationTarget(face, battleNativeRect(aperture), 523, 375, -90)
    : illustrationTarget(
        face,
        [aperture[0] * 488, aperture[1] * 680, aperture[2] * 488, aperture[3] * 680],
        488,
        680,
      );
  const rect = coverImage(width * source[2], height * source[3], target, face.artPlacement);
  return {
    source,
    destination: battle
      ? battlePhysicalRect(rect)
      : [rect[0] / 488, rect[1] / 680, rect[2] / 488, rect[3] / 680],
    aperture,
  };
}
