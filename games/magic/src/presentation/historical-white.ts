import type { ManaGlyphTransform } from './symbol-adjustment.js';

export function paintOriginalWhite(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  whiteSize: number,
  fill = '#efe7cb',
  adjustment?: ManaGlyphTransform,
) {
  // The font supplies only the black glyph; its outline and disc size differ.
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.fillStyle = fill;
  c.beginPath();
  c.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  c.fill();
  c.clip();
  c.fillStyle = '#0d0f0f';
  c.font = '100px "CardRenderer MTG Historic Symbols"';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  const glyph = '\ue997';
  const m = c.measureText(glyph);
  const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const scale = (whiteSize * (adjustment?.scale ?? 1)) / Math.max(width, height);
  c.translate(x + size / 2 + (adjustment?.dx ?? 0), y + size / 2 + (adjustment?.dy ?? 0));
  c.scale(scale, scale);
  c.fillText(
    glyph,
    (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
    (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  );
  c.restore();
}
