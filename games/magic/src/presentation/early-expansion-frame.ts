import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { EARLY_EXPANSION_FRAMES } from './early-expansion-frame-values.js';

/** Shared printing geometry, never a scan-specific correction. Unsupported
 * materials keep their existing source until independent scans establish a fit. */
export function earlyExpansionFrame(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  if (
    !set ||
    !['arn', 'atq', 'drk'].includes(set) ||
    face.frameTemplate ||
    face.frameStyle === 'modern' ||
    (face.borderColor && face.borderColor !== 'black') ||
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  const type = face.typeLine ?? '',
    colors = resolveFrameColors(face);
  // The generic land study excludes colored basic-land plates, including ARN's
  // sole Mountain. Keep the exclusion in original wording mode as well.
  const land = face.land ?? /\bLand\b/.test(type);
  if (
    land &&
    (/\b(Basic|Plains|Island|Swamp|Mountain|Forest)\b/.test(type) ||
      (set === 'arn' && face.name === 'Mountain'))
  )
    return undefined;
  const material = land
    ? 'L'
    : (face.artifact ?? /\bArtifact\b/.test(type))
      ? 'A'
      : colors.length === 1
        ? colors[0]
        : undefined;
  const geometry = material && EARLY_EXPANSION_FRAMES[`${set}/${material}`];
  if (!geometry) return undefined;
  return {
    ...geometry,
    material,
    asset: `${manifest.RETRO_ROOT}/img/frames/old/${geometry.family}/${material.toLowerCase()}.png`,
  };
}
