import { measureFontText, paintFontText } from './font-geometry.js';
import { modernPrintingProfile } from './modern-printing-profile.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { paintPrintingElement, type PrintingElements } from './printing-elements.js';
import { cardStock, type RenderedCardInput } from './face-layout.js';
import { printingCollectorText, printingLegalText } from './printing-footer.js';

/** Ordinary M15-family information lines. MSE's Relay / Beleren small caps /
 * MPlantin roles, checked against M15, WAR, M21 and FDN paper references.
 * Fonts are loaded once during face preparation, never by this painter. */
export function paintModernFooter(c: CanvasContext, face: RenderedCardInput): void {
  const profile = modernPrintingProfile(face),
    style = profile?.footer;
  if (style) {
    const elements: PrintingElements = { ...face.printingElements };
    for (const key of ['collector', 'artist', 'legal'] as const) {
      const previous = face.printingElements?.[key],
        delta = style[`${key}Offset`];
      elements[key] = {
        ...previous,
        offset: [(previous?.offset?.[0] ?? 0) + delta[0], (previous?.offset?.[1] ?? 0) + delta[1]],
      };
    }
    face = { ...face, printingElements: elements };
  }
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.letterSpacing = `${style?.collectorTracking ?? 0}px`;
  c.fillStyle = cardStock(face.setCode, face.borderColor).ink;
  c.textBaseline = 'alphabetic';
  c.textAlign = 'left';
  c.font = `${style?.collectorSize ?? 11}px "${style?.collectorFamily ?? 'CardRenderer MTG Relay'}", sans-serif`;
  paintPrintingElement(c, face, 'collector', () => {
    const text = printingCollectorText(face);
    if (!style || !text) return paintFontText(c, text, 30, 645);
    const match = /^(\d{3}(?:\/\d+)?) ([CMRUL])$/.exec(text);
    // Explicit host formats/numbers remain valid, with the measured font.
    if (!match) return paintFontText(c, text, 30, 645);
    paintFontText(c, match[1]!, 30, 645);
    paintFontText(c, match[2]!, style.collectorRarityX, 645);
  });
  const set = (face.collectorSetCode ?? face.setCode)?.trim().toUpperCase() ?? '';
  const code = set ? `${set} • ${face.collectorLanguage?.toUpperCase() ?? 'EN'}` : '';
  paintPrintingElement(c, face, 'collector', () => {
    const marker =
      profile?.foilStarNumbers.includes(face.collectorNumber ?? '') && set === 'M21'
        ? style?.collectorMarker
        : undefined;
    if (!marker) return paintFontText(c, code, 30, 658);
    const prefix = set + ' ',
      language = ' ' + (face.collectorLanguage?.toUpperCase() ?? 'EN');
    paintFontText(c, prefix, 30, 658);
    paintFontText(
      c,
      language,
      30 + measureFontText(c, prefix).width + measureFontText(c, '•').width,
      658,
    );
    const m = measureFontText(c, '★'),
      width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
      height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    if (!(width > 0 && height > 0)) throw Error('Modern collector marker has no glyph ink');
    c.save();
    c.translate(marker.center[0], marker.center[1]);
    c.scale(marker.size[0] / width, marker.size[1] / height);
    paintFontText(
      c,
      '★',
      (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
      (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
    );
    c.restore();
  });
  const legal = printingLegalText(face);
  const stats = (face.power != null && face.toughness != null) || face.loyalty != null;
  let left = 30 + measureFontText(c, code).width + (code ? 7 : 0);
  paintPrintingElement(c, face, 'artist', () => {
    if (face.artist) {
      c.letterSpacing = '0px';
      c.font = `${style?.artistSize ?? 11}px "CardRenderer MTG Artist Credit", sans-serif`;
      paintFontText(c, 'a', left, 658);
      left += measureFontText(c, 'a').width + 2;
      c.letterSpacing = `${style?.artistTracking ?? 0}px`;
      c.font = `700 ${style?.artistSize ?? 11}px "CardRenderer MTG Beleren Small Caps", Georgia`;
      paintFontText(c, face.artist, left, 658, Math.max(1, (legal && stats ? 272 : 456) - left));
    }
  });
  if (legal) {
    c.textAlign = 'right';
    c.letterSpacing = `${style?.legalTracking ?? 0}px`;
    c.font = `${style?.legalSize ?? 10}px "CardRenderer MTG MPlantin", Georgia`;
    // Creature and planeswalker badges reserve the upper right footer row.
    paintPrintingElement(c, face, 'legal', () =>
      paintFontText(c, legal, 456, stats ? 658 : 645, 178),
    );
  }
  c.restore();
}
