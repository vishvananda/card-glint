import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { paintPrintingElement } from './printing-elements.js';
import { cardStock, type RenderedCardInput } from './face-layout.js';
import { printingCollectorText, printingLegalText } from './printing-footer.js';

/** Ordinary M15-family information lines. MSE's Relay / Beleren small caps /
 * MPlantin roles, checked against M15, WAR, M21 and FDN paper references.
 * Fonts are loaded once during face preparation, never by this painter. */
export function paintModernFooter(c: CanvasContext, face: RenderedCardInput): void {
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.letterSpacing = '0px';
  c.fillStyle = cardStock(face.setCode, face.borderColor).ink;
  c.textBaseline = 'alphabetic';
  c.textAlign = 'left';
  c.font = '11px "CardRenderer MTG Relay", sans-serif';
  paintPrintingElement(c, face, 'collector', () =>
    c.fillText(printingCollectorText(face), 30, 645),
  );
  const set = (face.collectorSetCode ?? face.setCode)?.trim().toUpperCase() ?? '';
  const code = set ? `${set} • ${face.collectorLanguage?.toUpperCase() ?? 'EN'}` : '';
  paintPrintingElement(c, face, 'collector', () => c.fillText(code, 30, 658));
  const legal = printingLegalText(face);
  const stats = (face.power != null && face.toughness != null) || face.loyalty != null;
  let left = 30 + c.measureText(code).width + (code ? 7 : 0);
  paintPrintingElement(c, face, 'artist', () => {
    if (face.artist) {
      c.font = '11px "CardRenderer MTG Artist Credit", sans-serif';
      c.fillText('a', left, 658);
      left += c.measureText('a').width + 2;
      c.font = '700 11px "CardRenderer MTG Beleren Small Caps", Georgia';
      c.fillText(face.artist, left, 658, Math.max(1, (legal && stats ? 272 : 456) - left));
    }
  });
  if (legal) {
    c.textAlign = 'right';
    c.font = '10px "CardRenderer MTG MPlantin", Georgia';
    // Creature and planeswalker badges reserve the upper right footer row.
    paintPrintingElement(c, face, 'legal', () => c.fillText(legal, 456, stats ? 658 : 645, 178));
  }
  c.restore();
}
