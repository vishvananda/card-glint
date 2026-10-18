import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { paintSolidTitle } from './solid-title.js';
import { paintTextInk } from './text-ink.js';

const profiles = {
  fem: { x: 49, y: 391.5, size: 22, width: 1.025, shadow: 1.75, trim: 0, gray: 220 },
  '4ed': { x: 42.75, y: 390.5, size: 23, width: 0.98, shadow: 0.75, trim: 0.2, gray: 239 },
  chr: { x: 43.25, y: 390.5, size: 22, width: 1.02, shadow: 1, trim: 0.2, gray: 231 },
} as const;

/** Shared original/Oracle typography. Absolute origins also correct the old
 * Fourth Edition land inset. Keep the caller's set-symbol clearance. */
export function earlyReprintType(face: RenderedCardInput) {
  return earlyReprintFrame(face)
    ? profiles[face.setCode!.toLowerCase() as keyof typeof profiles]
    : undefined;
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
