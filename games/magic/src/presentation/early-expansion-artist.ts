import type { RenderedCardInput } from './face-layout.js';
import { paintRetroLetterEdges } from './retro-lettering.js';
import { paintSolidArtist } from './solid-artist.js';
import { resolveFrameColors } from './profile.js';

const legacy = {
  arn: { size: 22, x: 49.75, y: 638.5, width: 1.02, edge: 1.25 },
  atq: { size: 21, x: 48.75, y: 638.5, width: 1.075, edge: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.5, width: 1.045, edge: 1.25 },
} as const;

const profiles = {
  arn: { size: 22, x: 49.25, y: 638.5, width: 1.025, trim: 0.8, shadow: 1.5 },
  atq: { size: 21, x: 48.5, y: 638.5, width: 1.075, trim: 0.75, shadow: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.25, width: 1.045, trim: 0.55, shadow: 1.5 },
} as const;

/** Shared set geometry and filled ink, fitted with original credits and fixed
 * scan poses. The DRK land/gold transfer retains the same values. Nonstandard
 * layouts keep their earlier treatment. See early-expansion-dark-typography.json. */
export function earlyExpansionArtist(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  if (
    (set !== 'arn' && set !== 'atq' && set !== 'drk') ||
    face.frameTemplate ||
    face.frameStyle === 'modern' ||
    (face.layout && face.layout !== 'normal') ||
    (face.borderColor && face.borderColor !== 'black') ||
    face.legendary ||
    /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  const type = face.typeLine ?? '',
    land = face.land ?? /\bLand\b/.test(type),
    artifact = face.artifact ?? /\bArtifact\b/.test(type);
  const colors = resolveFrameColors(face).length;
  if (!land && !artifact && colors !== 1 && !(set === 'drk' && colors === 2)) return undefined;
  return profiles[set];
}

export function paintEarlyExpansionArtist(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
): boolean {
  const set = face.setCode?.toLowerCase();
  if (!face.artist || (set !== 'arn' && set !== 'atq' && set !== 'drk')) return false;
  const solid = earlyExpansionArtist(face),
    p = solid ?? legacy[set];
  c.save();
  c.translate(p.x, p.y);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.letterSpacing = '0px';
  const text = `Illus. © ${set === 'drk' ? '1994 ' : ''}${face.artist}`;
  if (solid) paintSolidArtist(c, text, 0, 0, 338 / p.width, solid);
  else paintRetroLetterEdges(c, text, 0, 0, 338 / p.width, legacy[set].edge);
  c.restore();
  return true;
}
