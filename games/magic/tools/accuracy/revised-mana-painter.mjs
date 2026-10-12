/** Browser-only candidate painter. Existing SVGs are preserved except the
 * verified original white sun in the already loaded historic-symbol font. */
export function paintManaCandidate(c, symbol, x, y, size, images, paintMana, whiteSize) {
  if (symbol !== 'W') return paintMana(c, symbol, x, y, size, images, false);
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.fillStyle = '#0d0f0f';
  c.font = '100px "CardRenderer MTG Historic Symbols"';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  const glyph = '\ue997';
  const m = c.measureText(glyph);
  const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const scale = whiteSize / Math.max(width, height);
  c.translate(x + size / 2, y + size / 2);
  c.scale(scale, scale);
  c.fillText(
    glyph,
    (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
    (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  );
  c.restore();
}
