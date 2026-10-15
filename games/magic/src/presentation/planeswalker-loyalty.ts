import { FACE_TEXT, type FaceRect } from './face-layout.js';

/** Center the visible ink in the shield's body, below its top notch. Canvas's
 * generic middle baseline centers the font em box and put the tall digits into
 * that notch. The shield geometry and Beleren Bold size remain independent. */
export function paintPlaneswalkerLoyalty(
  c: CanvasRenderingContext2D,
  text: string,
  [x, y, width, height]: FaceRect,
): void {
  c.save();
  c.fillStyle = '#fff';
  c.font = `700 ${FACE_TEXT.statsFont}px "CardRenderer MTG Beleren", Georgia`;
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  const metrics = c.measureText(text);
  const baseline =
    y + height * 0.56 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
  c.fillText(text, x + width / 2, baseline, width * 0.72);
  c.restore();
}
