import { paintTextInk } from './text-ink.js';
import { rulesInkVisible } from './rules-visibility.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput, FaceRect, CardTextInk } from './face-layout.js';
import { paintFittedText, paintMana } from './canvas-text.js';
import { layoutRules } from './rules-layout.js';
import { paintRulesLayout } from './rules-paint.js';

// MSE Font::toWxFont uses 96 / 72 pixels per point. Template coordinates
// remain native pixels; only text font sizes receive this conversion.
const POINT = 96 / 72;

export function templateLabel(
  c: CanvasRenderingContext2D,
  text: string,
  rect: FaceRect,
  size: number,
  family: 'CardRenderer MTG Matrix' | 'CardRenderer MTG Beleren',
  liveChanges?: CardTextInk,
) {
  const [x, y, w, h] = rect;
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  paintFittedText(
    c,
    text,
    x,
    y + h / 2,
    w,
    size * POINT,
    family !== 'CardRenderer MTG Matrix',
    1,
    family,
    0,
    liveChanges,
  );
}
export function templateCost(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  right: number,
  top: number,
  size: number,
) {
  const symbols = face.manaSymbols ?? [],
    advance = size + 1;
  symbols.forEach((symbol, i) =>
    paintMana(c, symbol, right - symbols.length * advance + i * advance, top, size, images, true),
  );
  return symbols.length * advance;
}
export function templateRules(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  rect: FaceRect,
  size: number,
  min: number,
  color = '#17140f',
) {
  if (!rulesInkVisible(c)) return;
  const [x, y, width, height] = rect;
  const paragraphs =
    face.rulesParagraphs ??
    (face.rulesText ?? '')
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  const layout = layoutRules(c, paragraphs, { x, y, width, height }, size * POINT, min * POINT, {
    leading: 0.95,
    paragraphGap: 0.4,
    flavorGap: 0.5,
    flavorOrphans: false,
  });
  if (layout.overflow) throw Error('Standard template text exceeds its minimum readable size.');
  paintRulesLayout(c, layout, images, undefined, 0, color);
}
export function templateStats(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  rect: FaceRect,
  size: number,
  family: 'CardRenderer MTG Matrix' | 'CardRenderer MTG Beleren',
) {
  if (face.power == null || face.toughness == null) return;
  const [x, y, w, h] = rect;
  c.font = `bold ${size * POINT}px "${family}", Georgia`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  paintTextInk(c, `${face.power}/${face.toughness}`, x + w / 2, y + h / 2, w, face.textInk);
}
export function templateFooter(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  rect: FaceRect,
  color: string,
) {
  const [x, y, w] = rect;
  c.fillStyle = color;
  c.textAlign = 'left';
  c.textBaseline = 'top';
  c.font = `${10 * POINT}px "CardRenderer MTG Matrix", Georgia`;
  c.fillText(face.artist ?? '', x, y, w);
  if (face.legalText) {
    c.font = `${6.5 * POINT}px "CardRenderer MTG MPlantin", Georgia`;
    c.fillText(face.legalText, x, y + 14, w);
  }
}
