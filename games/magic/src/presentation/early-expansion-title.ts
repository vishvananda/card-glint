import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { paintRetroLetterEdges } from './retro-lettering.js';

const profiles = {
  arn: { size: 26.5, x: 38.5, y: 42.5, width: 1, edge: 1, shadow: 0 },
  atq: { size: 26.5, x: 38.5, y: 42.5, width: 1, edge: 1, shadow: 0 },
  drk: { size: 26.25, x: 37, y: 42.5, width: 1.035, edge: 0, shadow: 2 },
} as const;

/** Shared set typography, fitted with original names and frozen scan poses.
 * ARN/ATQ retain open light/dark letter edges; DRK uses solid light ink.
 * Unresolved DRK land/gold plates and custom frame choices keep their prior style.
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
  if (land ? set === 'drk' : !artifact && resolveFrameColors(face).length !== 1) return undefined;
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
  if (p.edge) paintRetroLetterEdges(c, face.name, 0, 0, width, p.edge);
  else {
    // Canvas shadows use backing pixels; canonical offsets follow render scale.
    c.shadowOffsetX = c.shadowOffsetY = c.getTransform().d * p.shadow;
    c.fillText(face.name, 0, 0, width);
  }
  c.restore();
  return true;
}
