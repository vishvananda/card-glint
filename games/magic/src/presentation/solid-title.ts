import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
/** Solid title ink, optionally thinned around its perimeter during cached face
 * preparation. The surviving strokes stay filled. No pixel readback is needed. */
export function paintSolidTitle(
  c: CanvasContext,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  p: { width: number; shadow: number; trim: number; gray: number },
  colors?: { fill: CanvasContext['fillStyle']; shadow: string },
) {
  c.save();
  const matrix = c.getTransform();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  const layer = rasterCanvas();
  layer.width = c.canvas.width;
  layer.height = c.canvas.height;
  const ink = layer.getContext('2d');
  if (!ink) throw Error('Solid title needs a Canvas2D context');
  ink.setTransform(matrix);
  ink.font = c.font;
  ink.textAlign = c.textAlign;
  ink.textBaseline = c.textBaseline;
  ink.letterSpacing = c.letterSpacing;
  ink.fillStyle = colors?.fill ?? `rgb(${p.gray},${p.gray},${p.gray})`;
  ink.fillText(text, x, y, maxWidth);
  if (p.trim > 0) {
    ink.globalCompositeOperation = 'destination-out';
    ink.lineWidth = p.trim * 2;
    ink.strokeText(text, x, y, maxWidth);
  }
  c.resetTransform();
  c.shadowColor = colors?.shadow ?? '#17140f';
  c.shadowOffsetX = (matrix.a / p.width) * p.shadow;
  c.shadowOffsetY = matrix.d * p.shadow;
  c.drawImage(layer, 0, 0);
  c.restore();
  layer.width = layer.height = 0;
}
