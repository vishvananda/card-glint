import { resolveCardProfile } from './profile.js';
import { componentAsset } from './assets.js';
import { FACE_WIDTH, FACE_HEIGHT, type RenderedCardInput } from './face-layout.js';
import { faceFrame, faceRects, specialRuleRows, type SingleFrame } from './special-frames.js';
import { paintRules, rulesLines } from './canvas-text.js';
import type { CanvasImages } from './canvas-assets.js';
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
  };
  return colors[resolveCardProfile(face).boxes] ?? '#dededbf0';
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
  context.fillStyle = saga ? '#e3d8bb' : specialPaperColor(face);
  if (saga) context.fillRect(x, y, w, h);
  else {
    context.beginPath();
    context.roundRect(x + 40, y + 3, w - 40, h - 6, [
      4,
      4,
      { x: (w - 40) / 2, y: 10 },
      { x: (w - 40) / 2, y: 10 },
    ]);
    context.fill();
  }
  const box = sagaTextbox(face, resolveCardProfile(face).boxes);
  const paper = box ? images.get(box) : undefined;
  if (paper) context.drawImage(paper, x, y, w, h);
  for (const row of specialRuleRows(face)) {
    if (row.top > 0) {
      context.fillStyle = '#0002';
      context.fillRect(x + (saga ? 0 : 40), y + row.top, w - (saga ? 0 : 40), 1.5);
    }
    context.fillStyle = '#17140f';
    context.textAlign = 'left';
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
    const badgeW = saga ? 36 : 54,
      badgeH = saga ? 36 : 34;
    row.badges.forEach((badge, index) => {
      const bx = x + (saga ? -18 : 0),
        by = y + row.top + row.height / 2 + (index - row.badges.length / 2) * badgeH;
      const url = ruleBadgeAsset(kind, badge),
        image = url ? images.get(url) : null;
      if (image) context.drawImage(image, bx, by, badgeW, badgeH);
      else {
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
        if (!saga) {
          context.fillStyle = '#17140f';
          context.fillText(':', bx + badgeW + 4, by + badgeH / 2);
        }
      }
    });
  }
}
