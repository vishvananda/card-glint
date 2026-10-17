import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { paintSolidTitle } from './solid-title.js';

const profiles = {
  arn: { size: 26.75, x: 37.75, y: 42.5, width: 0.995, shadow: 1.25, trim: 0.4, gray: 196 },
  atq: { size: 26.5, x: 38, y: 42.5, width: 1, shadow: 1.25, trim: 0.4, gray: 196 },
  drk: { size: 27.25, x: 37.25, y: 43, width: 1, shadow: 1.5, trim: 0.2, gray: 208 },
} as const;

/** Shared set typography, fitted with original names and frozen scan poses.
 * Solid light-gray lettering with thin strokes and a lower-right shadow.
 * DRK land/gold transfer uses these same values; custom frames keep their prior style.
 * See early-expansion-titles.json for native replay and repeated validation. */
export function earlyExpansionTitle(face: RenderedCardInput) {
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

export function paintEarlyExpansionTitle(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  right: number,
): boolean {
  const p = earlyExpansionTitle(face);
  if (!p) return false;
  c.save();
  c.translate(p.x, p.y);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG Goudy", Georgia`;
  const width = Math.max(1, (right - p.x) / p.width);
  paintSolidTitle(c, face.name, 0, 0, width, p);
  c.restore();
  return true;
}
