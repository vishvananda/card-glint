import { alphaTypography } from './alpha-typography.js';
import type { RenderedCardInput } from './face-layout.js';
import { legendsFrame } from './legends-frame.js';
import { earlyExpansionTitle } from './early-expansion-title.js';
import { paintSolidTitle } from './solid-title.js';
import { paintTextInk } from './text-ink.js';

const darkType = { size: 22, dx: -3, dy: 0.5, width: 1.02, gray: 224, shadow: 1.5, trim: 0.2 };

/** Original and Oracle wording share this printing's physical typography.
 * Frozen frame poses and filled-stroke checks are recorded in dark-type-line.json. */
export function earlyExpansionType(face: RenderedCardInput) {
  return face.setCode?.toLowerCase() === 'drk' &&
    !face.frameAssetFamily &&
    earlyExpansionTitle(face)
    ? darkType
    : undefined;
}

export function paintEarlyExpansionType(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  text: string,
  x: number,
  y: number,
  width: number,
): boolean {
  const p = earlyExpansionType(face);
  if (!p) return false;
  c.save();
  c.translate(x + p.dx, y + p.dy);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
  c.fillStyle = `rgb(${p.gray},${p.gray},${p.gray})`;
  c.shadowColor = '#17140f';
  c.shadowBlur = 0;
  const maxWidth = width / p.width;
  paintTextInk(c, text, 0, 0, maxWidth, face.textInk, 'type', () =>
    paintSolidTitle(c, text, 0, 0, maxWidth, p, {
      fill: c.fillStyle,
      shadow: c.shadowColor,
    }),
  );
  c.restore();
  return true;
}

/** Shared printing typography, independent of original/Oracle wording.
 * Legends uses 36 training and 36 held-out frozen frame registrations.
 * No per-card offsets or additional horizontal stretch are applied. */
export function retroTypePlacement(face: RenderedCardInput) {
  const alpha = alphaTypography(face.setCode);
  if (alpha) return alpha.type;
  const legends =
    (!face.borderColor || face.borderColor === 'black') && Boolean(legendsFrame(face));
  return {
    fontSize: legends ? 21.7 * 1.03 : 21.7,
    dx: legends ? -2.5 : 0,
    dy: 0,
  };
}
