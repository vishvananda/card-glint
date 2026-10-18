import { calibrationForFace } from '../calibration/selection.js';
import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { paintSolidTitle } from './solid-title.js';
import { paintTextInk } from './text-ink.js';

/** Shared original/Oracle typography. Absolute origins also correct the old
 * Fourth Edition land inset. Keep the caller's set-symbol clearance. */
export function earlyReprintType(face: RenderedCardInput) {
  return earlyReprintFrame(face) ? calibrationForFace(face)!.type : undefined;
}

export function paintEarlyReprintType(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  text: string,
  right: number,
): boolean {
  const p = earlyReprintType(face);
  if (!p) return false;
  c.save();
  c.translate(p.x, p.y);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
  c.fillStyle = `rgb(${p.gray},${p.gray},${p.gray})`;
  c.shadowColor = '#17140f';
  c.shadowBlur = 0;
  const maxWidth = Math.max(1, (right - p.x) / p.width);
  paintTextInk(c, text, 0, 0, maxWidth, face.textInk, 'type', () =>
    paintSolidTitle(c, text, 0, 0, maxWidth, p, {
      fill: c.fillStyle,
      shadow: c.shadowColor,
    }),
  );
  c.restore();
  return true;
}
