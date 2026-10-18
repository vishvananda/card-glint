import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { paintSolidTitle } from './solid-title.js';

const profiles = {
  fem: { size: 27, x: 37.25, y: 42, width: 1, shadow: 1.5, trim: 0.2, gray: 217 },
  '4ed': { size: 27.25, x: 41.5, y: 41, width: 1.015, shadow: 1, trim: 0.3, gray: 232 },
  chr: { size: 27, x: 41.25, y: 41, width: 1.025, shadow: 1.25, trim: 0.2, gray: 226 },
} as const;

/** Shared printing typography for both wording modes. Light-gray filled strokes
 * retain a dark shadow; the measured frame scope excludes custom treatments. */
export function earlyReprintTitle(face: RenderedCardInput) {
  return earlyReprintFrame(face)
    ? profiles[face.setCode!.toLowerCase() as keyof typeof profiles]
    : undefined;
}

export function paintEarlyReprintTitle(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  right: number,
): boolean {
  const p = earlyReprintTitle(face);
  if (!p) return false;
  c.save();
  c.translate(p.x, p.y);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG Goudy", Georgia`;
  paintSolidTitle(c, face.name, 0, 0, Math.max(1, (right - p.x) / p.width), p);
  c.restore();
  return true;
}
