import { resolveCardProfile } from './profile.js';
import { componentAsset } from './assets.js';
import { FACE_WIDTH, FACE_HEIGHT, type RenderedCardInput } from './face-layout.js';
import { faceFrame, faceRects, specialRuleRows, type SingleFrame } from './special-frames.js';
import { paintRules, rulesLines } from './canvas-text.js';
import type { CanvasImages } from './canvas-assets.js';
import { planeswalkerRuleRows } from './planeswalker-rules.js';
import { paintRulesLayout } from './rules-paint.js';
import type { RulesLayout } from './rules-layout.js';
import { planeswalkerLowerPanel } from './planeswalker-lower-frame.js';
/** Badge art has an asymmetric point and a small transparent right margin. */
export function loyaltyBadge(badge: string) {
  return { font: 18, offsetY: badge.startsWith('+') ? 2 : badge === '0' ? 0 : -2 };
}
export function ruleBadgeAsset(kind: SingleFrame, badge: string): string | null {
  if (kind === 'saga') return /^(I|II|III|IV)$/.test(badge) ? componentAsset('saga', badge) : null;
  return componentAsset(
    'planeswalker',
    badge.startsWith('+') ? 'LoyaltyPlus' : badge === '0' ? 'LoyaltyZero' : 'LoyaltyMinus',
  );
}
export function sagaTextbox(face: RenderedCardInput, boxes: string) {
  return faceFrame(face) === 'saga'
    ? componentAsset('saga_textboxes', boxes === 'Colourless' ? 'Land' : boxes)
    : null;
}
export function specialPaperColor(face: RenderedCardInput): string {
  const colors: Record<string, string> = {
    W: '#eee9d9f0',
    U: '#d3e4ecf0',
    B: '#ddd8e4f0',
    R: '#ecd4c8f0',
    G: '#d4e2d0f0',
    Gold: '#e8dfbef0',
    Colourless: '#f2f2f0f0',
  };
  return colors[resolveCardProfile(face).boxes] ?? '#dededbf0';
}
/** Paper belongs below the frame's own outline, not across its inside edge. */
export function paintPlaneswalkerPaper(context: CanvasRenderingContext2D, face: RenderedCardInput) {
  // Match the existing aperture in reference pixels. A rectangular underlay
  // leaks through the type opening and beyond the curved lower frame corners.
  const { top, scale } = planeswalkerLowerPanel(faceFrame(face) === 'planeswalker-large');
  context.save();
  context.translate(0, top);
  context.scale(1, scale);
  context.translate(0, -top);
  context.beginPath();
  context.moveTo(66, top);
  context.lineTo(448, top);
  context.quadraticCurveTo(456, top, 456, top + 8);
  context.lineTo(456, 613);
  context.bezierCurveTo(456, 623, 420, 629, 257, 629);
  context.bezierCurveTo(94, 629, 58, 623, 58, 613);
  context.lineTo(58, top + 8);
  context.quadraticCurveTo(58, top, 66, top);
  context.closePath();
  context.clip();
  context.fillStyle = specialPaperColor(face);
  context.fillRect(58, top, 398, 629 - top);
  context.restore();
}

function paintAbilityColon(context: CanvasRenderingContext2D, x: number, center: number) {
  context.fillStyle = '#17140f';
  context.font = '24px "CardRenderer MTG MPlantin", Georgia';
  context.textBaseline = 'alphabetic';
  const ink = context.measureText(':');
  context.fillText(
    ':',
    x,
    center + 1.5 + (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2,
  );
}
export function paintSpecialRules(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  const kind = faceFrame(face),
    saga = kind === 'saga',
    rect = faceRects(face).rules;
  const x = rect[0] * FACE_WIDTH,
    y = rect[1] * FACE_HEIGHT,
    w = rect[2] * FACE_WIDTH,
    h = rect[3] * FACE_HEIGHT;
  if (saga) {
    context.fillStyle = '#e3d8bb';
    context.fillRect(x, y, w, h);
  }
  const box = sagaTextbox(face, resolveCardProfile(face).boxes);
  const paper = box ? images.get(box) : undefined;
  if (paper) context.drawImage(paper, x, y, w, h);
  const rows: (ReturnType<typeof specialRuleRows>[number] & { layout?: RulesLayout })[] = saga
    ? specialRuleRows(face)
    : planeswalkerRuleRows(context, face);
  for (const [rowIndex, row] of rows.entries()) {
    if (rowIndex > 0) {
      const previous = rows[rowIndex - 1]?.layout;
      const separator =
        row.layout && previous
          ? Math.max(previous.top + previous.height + 3, Math.min(y + row.top, row.layout.top - 3))
          : y + row.top;
      context.fillStyle = '#0002';
      context.fillRect(x + (saga ? 0 : 40), separator, w - (saga ? 0 : 40), 1.5);
    }
    context.fillStyle = '#17140f';
    context.textAlign = 'left';
    if (row.layout) paintRulesLayout(context, row.layout, images);
    else {
      context.font = `${row.reminder ? 'italic ' : ''}${row.font}px "CardRenderer MTG MPlantin", Georgia`;
      const textHeight = rulesLines(context, row.text, row.width, row.font).length * row.font;
      paintRules(
        context,
        row.text,
        x + row.left,
        y + row.top + (row.height - textHeight) / 2,
        row.width,
        { size: row.font, italic: row.reminder },
        images,
      );
    }
    const badgeW = saga ? 36 : 54,
      badgeH = saga ? 36 : 40;
    row.badges.forEach((badge, index) => {
      const bx = x + (saga ? -18 : 0),
        by = y + row.top + row.height / 2 + (index - row.badges.length / 2) * badgeH;
      const url = ruleBadgeAsset(kind, badge),
        image = url ? images.get(url) : null;
      if (image) {
        context.save();
        if (!saga) {
          const scale = context.getTransform().a;
          context.shadowColor = '#0009';
          context.shadowBlur = 3 * scale;
          context.shadowOffsetY = 2 * scale;
        }
        context.drawImage(image, bx, by, badgeW, badgeH);
        context.restore();
      } else {
        context.fillStyle = '#29231c';
        context.fillRect(bx, by, badgeW, badgeH);
      }
      if (!image || !saga) {
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const metrics = loyaltyBadge(badge);
        context.font = `bold ${saga ? 19 : metrics.font}px "CardRenderer MTG Beleren", Georgia`;
        context.fillText(
          badge,
          bx + badgeW / 2 - (saga ? 0 : 1.5),
          by + badgeH / 2 + (saga ? 0 : metrics.offsetY),
          badgeW - 3,
        );
        if (!saga) paintAbilityColon(context, bx + badgeW + 4, by + badgeH / 2);
      }
    });
  }
}
