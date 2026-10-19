import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import { setTitleCalibration } from '../calibration/title-profiles.js';
import { resolveSetTitleCalibration } from '../calibration/editor.js';

/** Keep the original filled-ink painter and its shadow. No raster rewriting. */
export function paintLegacyCalibratedTitle(
  c: CanvasContext,
  face: RenderedCardInput,
  x: number,
  y: number,
  width: number,
): boolean {
  const base = setTitleCalibration(face.setCode);
  if (
    !base ||
    face.frameStyle === 'modern' ||
    face.frameTemplate ||
    face.frameAssetFamily ||
    (face.borderColor && face.borderColor !== 'black') ||
    (face.layout && face.layout !== 'normal')
  )
    return false;
  const p = (
    face.setCalibrationCandidate ? resolveSetTitleCalibration(face.setCalibrationCandidate) : base
  ).title;
  if (!p.dx && !p.dy && p.size === 27.8 && p.width === 1 && p.gray === 130 && p.shadow === 1)
    return false;
  c.save();
  const shadow = c.getTransform().a * p.shadow;
  c.translate(x + p.dx, y + p.dy);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG Goudy", Georgia`;
  c.fillStyle = `rgb(${p.gray},${p.gray},${p.gray})`;
  c.shadowOffsetX = c.shadowOffsetY = shadow;
  c.fillText(face.name, 0, 0, Math.max(1, (width - p.dx) / p.width));
  c.restore();
  return true;
}
