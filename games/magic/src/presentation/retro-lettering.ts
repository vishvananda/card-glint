/**
 * Printed light/dark letter edges with the frame visible through the interior.
 * Two translated masks are subtracted during cached face composition only;
 * fonts are already loaded, and no pixel readback or per-frame work is needed.
 */
export function paintRetroLetterEdges(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  offset: number,
) {
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  const layer = document.createElement('canvas');
  layer.width = c.canvas.width;
  layer.height = c.canvas.height;
  const ink = layer.getContext('2d');
  if (!ink) throw Error('Retro lettering needs a Canvas2D context');
  const matrix = c.getTransform();
  ink.font = c.font;
  ink.textAlign = c.textAlign;
  ink.textBaseline = c.textBaseline;
  ink.letterSpacing = c.letterSpacing;
  c.resetTransform();
  for (const [shift, subtract, color] of [
    [0, offset, '#f2eee3'],
    [offset, 0, '#17140f'],
  ] as const) {
    ink.resetTransform();
    ink.clearRect(0, 0, layer.width, layer.height);
    ink.setTransform(matrix);
    ink.globalCompositeOperation = 'source-over';
    ink.fillStyle = color;
    ink.fillText(text, x + shift, y + shift, maxWidth);
    ink.globalCompositeOperation = 'destination-out';
    ink.fillText(text, x + subtract, y + subtract, maxWidth);
    c.drawImage(layer, 0, 0);
  }
  layer.width = layer.height = 0;
  c.restore();
}
/** Solid gray ink over a lower-right shadow, composed once per cached face. */
export function paintRetroGrayText(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  offset: number,
  fill = '#ababab',
) {
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.fillStyle = '#17140f';
  c.fillText(text, x + offset, y + offset, maxWidth);
  c.fillStyle = fill;
  c.fillText(text, x, y, maxWidth);
  c.restore();
}
