import { measureFontText, paintFontText, setFont } from './font-geometry.js';
import type { ModernLoyaltyAdjustment } from './modern-printing-profiles.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { FaceRect } from './face-layout.js';

export const PLANESWALKER_COST_GEOMETRY = {
  fontSize: 19.5,
  fontFamily: '"CardRenderer MTG Beleren", Georgia',
  fontWeight: 700,
  ink: '#fff',
  numeralOffsetX: -0.5,
  numeralOffsetY: { plus: -0.25, zero: -3.25, minus: -4.5 },
  horizontalInset: 10,
  widthScale: 0.97,
} as const;

/** Center the visible ink in the shield's body, below its top notch. Canvas's
 * generic middle baseline centers the font em box and puts tall digits into
 * that notch. Measured against frozen M15, M21 and WAR scan registrations. */
export function paintPlaneswalkerLoyalty(
  c: CanvasContext,
  text: string,
  [x, y, width, height]: FaceRect,
  adjustment?: ModernLoyaltyAdjustment,
): void {
  paintAdjustedLoyaltyInk(
    c,
    text,
    24,
    x + width / 2,
    y + height / 2 + 2.5,
    width * 0.72,
    1,
    adjustment,
  );
}

type CostAdjustments = {
  readonly cost: ModernLoyaltyAdjustment;
  readonly wideCost: ModernLoyaltyAdjustment;
};

export function planeswalkerCostAdjustment(text: string, adjustments?: CostAdjustments) {
  return adjustments?.[(text.match(/[0-9]/g)?.length ?? 0) > 1 ? 'wideCost' : 'cost'];
}

/** Shared visible-ink anchor for the cost label and its adjacent colon. */
export function planeswalkerCostInkCenter(
  text: string,
  centerY: number,
  adjustments?: CostAdjustments,
): number {
  const shape = text.startsWith('+') ? 'plus' : text === '0' ? 'zero' : 'minus';
  return (
    centerY +
    PLANESWALKER_COST_GEOMETRY.numeralOffsetY[shape] +
    (planeswalkerCostAdjustment(text, adjustments)?.dy ?? 0)
  );
}

/** The source badge's black body is not centered in its image: plus has a top
 * point, minus a bottom point, and all three have transparent bottom padding.
 * Keep ability anchors independent of the visible numerals inside each shape. */
export function paintPlaneswalkerCost(
  c: CanvasContext,
  text: string,
  [x, y, width, height]: FaceRect,
  adjustments?: CostAdjustments,
): void {
  const adjustment = planeswalkerCostAdjustment(text, adjustments);
  const geometry = PLANESWALKER_COST_GEOMETRY;
  const inkOffsetY =
    geometry.numeralOffsetY[text.startsWith('+') ? 'plus' : text === '0' ? 'zero' : 'minus'];
  paintAdjustedLoyaltyInk(
    c,
    text,
    geometry.fontSize,
    x + width / 2 + geometry.numeralOffsetX,
    y + height / 2 + inkOffsetY,
    width - geometry.horizontalInset,
    geometry.widthScale,
    adjustment,
  );
}

/** Shared source-family fit, applied before static rasterization. Width scales
 * the actual glyphs while retaining the badge's original maximum ink width. */
function paintAdjustedLoyaltyInk(
  c: CanvasContext,
  text: string,
  size: number,
  centerX: number,
  centerY: number,
  maxWidth: number,
  widthScale: number,
  adjustment?: ModernLoyaltyAdjustment,
): void {
  if (!adjustment) {
    paintLoyaltyInk(c, text, size, centerX, centerY, maxWidth, widthScale);
    return;
  }
  c.save();
  if (adjustment.fractionalMetrics) {
    c.textRendering = 'geometricPrecision';
    c.fontKerning = 'normal';
  }
  const x = centerX + adjustment.dx;
  c.translate(x, 0);
  c.scale(adjustment.width, 1);
  const family =
    adjustment.font === 'beleren-2016'
      ? '"CardRenderer MTG Beleren 2016", Georgia'
      : PLANESWALKER_COST_GEOMETRY.fontFamily;
  paintLoyaltyInk(
    c,
    text,
    size * adjustment.size,
    0,
    centerY + adjustment.dy,
    maxWidth / adjustment.width,
    widthScale,
    family,
  );
  c.restore();
}

function paintLoyaltyInk(
  c: CanvasContext,
  text: string,
  size: number,
  centerX: number,
  centerY: number,
  maxWidth: number,
  widthScale = 1,
  family: string = PLANESWALKER_COST_GEOMETRY.fontFamily,
): void {
  c.save();
  c.fillStyle = PLANESWALKER_COST_GEOMETRY.ink;
  setFont(c, `${PLANESWALKER_COST_GEOMETRY.fontWeight} ${size}px ${family}`);
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  c.letterSpacing = '0px';
  c.shadowColor = 'transparent';
  const metrics = measureFontText(c, text);
  const fittedWidth = Math.min(maxWidth, metrics.width * widthScale);
  const scale = Math.min(1, fittedWidth / Math.max(1, metrics.width));
  const x =
    centerX + ((metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) * scale) / 2;
  const baseline =
    centerY + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
  paintFontText(c, text, x, baseline, fittedWidth);
  c.restore();
}
