import { paintFontText } from './font-geometry.js';
import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import { setTitleCalibration } from '../calibration/title-profiles.js';
import { paintTextInk } from './text-ink.js';
import { resolveSetTitleCalibration } from '../calibration/editor.js';

/** Keep the original filled-ink painter and its shadow. No raster rewriting. */
export function paintLegacyCalibratedTitle(
  c: CanvasContext,
  face: RenderedCardInput,
  x: number,
  y: number,
  width: number,
  role: 'title' | 'type' = 'title',
  text = face.name,
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
  )[role];
  if (
    !p.dx &&
    !p.dy &&
    p.size === (role === 'title' ? 27.8 : 22.2) &&
    p.width === 1 &&
    !p.wordSpacing &&
    p.gray === 130 &&
    p.shadow === 1
  )
    return false;
  c.save();
  const shadow = c.getTransform().a * p.shadow;
  c.translate(x + p.dx, y + p.dy);
  c.scale(p.width, 1);
  c.font = `${p.size}px "${role === 'title' ? 'CardRenderer MTG Goudy' : 'CardRenderer MTG MPlantin'}", Georgia`;
  if (p.wordSpacing) c.wordSpacing = `${p.wordSpacing}px`;
  c.fillStyle = `rgb(${p.gray},${p.gray},${p.gray})`;
  c.shadowOffsetX = c.shadowOffsetY = shadow;
  // Apply the width ratio after the existing fit, including long compressed headings.
  const maxWidth = Math.max(1, width - p.dx);
  if (role === 'type') paintTextInk(c, text, 0, 0, maxWidth, face.textInk, 'type');
  else paintFontText(c, text, 0, 0, maxWidth);
  c.restore();
  return true;
}
