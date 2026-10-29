import { retainsOldFrameComponent } from '../calibration/old-frame-defaults.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { calibrationForFace } from '../calibration/selection.js';
import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { paintSolidTitle } from './solid-title.js';

/** Shared printing typography for both wording modes. Light-gray filled strokes
 * retain a dark shadow; the measured frame scope excludes custom treatments. */
export function earlyReprintTitle(face: RenderedCardInput) {
  if (retainsOldFrameComponent(face, 'title')) return undefined;
  return earlyReprintFrame(face) ? calibrationForFace(face)!.title : undefined;
}

export function paintEarlyReprintTitle(
  c: CanvasContext,
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
