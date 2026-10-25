import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
/** Filled light ink with an independent lower-right shadow. Partial perimeter
 * thinning retains fine strokes, including the copyright ring. Composed only
 * during cached face preparation, without pixel readback or font loading. */
export function paintSolidArtist(
  c: CanvasContext,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  p: { width: number; shadow: number; trim: number },
  fill: CanvasContext['fillStyle'] = '#f2eee3',
) {
  c.save();
  const layer = rasterCanvas();
  try {
    const matrix = c.getTransform();
    c.shadowColor = 'transparent';
    c.shadowOffsetX = c.shadowOffsetY = 0;
    c.fillStyle = '#17140f';
    c.fillText(text, x + p.shadow / p.width, y + p.shadow, maxWidth);
    layer.width = c.canvas.width;
    layer.height = c.canvas.height;
    const ink = layer.getContext('2d');
    if (!ink) throw Error('Artist ink needs a Canvas2D context');
    ink.setTransform(matrix);
    ink.font = c.font;
    ink.textAlign = c.textAlign;
    ink.textBaseline = c.textBaseline;
    ink.letterSpacing = c.letterSpacing;
    ink.fillStyle = fill;
    ink.fillText(text, x, y, maxWidth);
    if (p.trim > 0) {
      ink.globalCompositeOperation = 'destination-out';
      ink.globalAlpha = 0.65;
      ink.lineWidth = p.trim * 2;
      ink.strokeText(text, x, y, maxWidth);
    }
    c.resetTransform();
    c.drawImage(layer, 0, 0);
  } finally {
    layer.width = layer.height = 0;
    c.restore();
  }
}
