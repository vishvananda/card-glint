import { paintFontText, setFont, strokeFontText } from './font-geometry.js';
import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import { isPrintingTextOmitted } from './printing-omissions.js';

/** Reduce white header stroke coverage without changing glyph advances. The
 * temporary ink plane is built during static face composition. Pixel-aligned
 * placement avoids a second interpolation; the final draw retains the existing
 * down-left shadow. No pixel readback or animation-time work is needed. */
export function paintInsetText(
  context: CanvasContext,
  text: string,
  bounds: readonly [number, number, number],
  size: number,
  stroke: number,
): void {
  const [x, y, width] = bounds;
  if (isPrintingTextOmitted(context, text, x, y)) return;
  const matrix = context.getTransform(),
    scale = Math.hypot(matrix.a, matrix.b),
    left = (Math.floor((x - 4) * scale + matrix.e) - matrix.e) / scale,
    top = (Math.floor((y - size) * scale + matrix.f) - matrix.f) / scale;
  const ink = rasterCanvas();
  ink.width = Math.ceil((width + 8) * scale);
  ink.height = Math.ceil(size * 2 * scale);
  const c = ink.getContext('2d');
  if (!c) throw Error('Magic heading ink needs Canvas2D');
  try {
    c.scale(scale, scale);
    c.translate(-left, -top);
    setFont(c, context.font);
    c.fillStyle = context.fillStyle;
    c.textAlign = context.textAlign;
    c.textBaseline = context.textBaseline;
    paintFontText(c, text, x, y, width);
    c.globalCompositeOperation = 'destination-out';
    c.lineWidth = stroke;
    c.strokeStyle = '#000';
    strokeFontText(c, text, x, y, width);
    context.drawImage(
      ink,
      0,
      0,
      ink.width,
      ink.height,
      left,
      top,
      ink.width / scale,
      ink.height / scale,
    );
  } finally {
    ink.width = ink.height = 0;
  }
}
