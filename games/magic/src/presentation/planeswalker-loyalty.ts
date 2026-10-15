import type { FaceRect } from './face-layout.js';

/** Center the visible ink in the shield's body, below its top notch. Canvas's
 * generic middle baseline centers the font em box and puts tall digits into
 * that notch. Measured against frozen M15, M21 and WAR scan registrations. */
export function paintPlaneswalkerLoyalty(
  c: CanvasRenderingContext2D,
  text: string,
  [x, y, width, height]: FaceRect,
): void {
  paintLoyaltyInk(c, text, 24, x + width / 2, y + height / 2 + 2.5, width * 0.72);
}

/** The source badge's black body is not centered in its image: plus has a top
 * point, minus a bottom point, and all three have transparent bottom padding.
 * Keep ability anchors independent of the visible numerals inside each shape. */
export function paintPlaneswalkerCost(
  c: CanvasRenderingContext2D,
  text: string,
  [x, y, width, height]: FaceRect,
): void {
  const inkOffsetY = text.startsWith('+') ? -0.25 : text === '0' ? -3.25 : -4.5;
  paintLoyaltyInk(
    c,
    text,
    19.5,
    x + width / 2 - 0.5,
    y + height / 2 + inkOffsetY,
    width - 10,
    0.97,
  );
}

function paintLoyaltyInk(
  c: CanvasRenderingContext2D,
  text: string,
  size: number,
  centerX: number,
  centerY: number,
  maxWidth: number,
  widthScale = 1,
): void {
  c.save();
  c.fillStyle = '#fff';
  c.font = `700 ${size}px "CardRenderer MTG Beleren", Georgia`;
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  c.letterSpacing = '0px';
  c.shadowColor = 'transparent';
  const metrics = c.measureText(text);
  const fittedWidth = Math.min(maxWidth, metrics.width * widthScale);
  const scale = Math.min(1, fittedWidth / Math.max(1, metrics.width));
  const x =
    centerX + ((metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) * scale) / 2;
  const baseline =
    centerY + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
  c.fillText(text, x, baseline, fittedWidth);
  c.restore();
}
