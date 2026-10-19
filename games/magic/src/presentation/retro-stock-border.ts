import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import { FACE_WIDTH, FACE_HEIGHT, type FaceRect } from './face-layout.js';

/** Independent printed-face aperture; no scaling of the interior plate. */
export function paintRetroStockWindow(c: CanvasContext, window: FaceRect, stock: string) {
  c.save();
  c.fillStyle = stock;
  c.beginPath();
  c.rect(0, 0, FACE_WIDTH, FACE_HEIGHT);
  c.rect(...window);
  c.fill('evenodd');
  c.restore();
}

/** Extend the stock mask past the source rectangle so fractional drawImage
 * edges cannot expose a white plate fringe. Padding leaves the aperture's
 * native mask pixels and sample spacing unchanged. Static face preparation only. */
export function paintRetroStockBorder(
  c: CanvasContext,
  mask: CanvasImageSource,
  [x, y, w, h]: FaceRect,
  stock: string,
) {
  const padding = 12,
    width = 732,
    height = 1020,
    layer = rasterCanvas();
  layer.width = width + padding * 2;
  layer.height = height + padding * 2;
  try {
    const ctx = layer.getContext('2d');
    if (!ctx) throw new Error('Retro stock preparation requires Canvas2D.');
    ctx.drawImage(mask, padding, padding, width, height);
    // Extend only the known opaque stock perimeter, not the inner aperture.
    ctx.fillRect(0, 0, layer.width, padding);
    ctx.fillRect(0, padding + height, layer.width, padding);
    ctx.fillRect(0, padding, padding, height);
    ctx.fillRect(padding + width, padding, padding, height);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = stock;
    ctx.fillRect(0, 0, layer.width, layer.height);
    c.drawImage(
      layer,
      x - (padding * w) / width,
      y - (padding * h) / height,
      (layer.width * w) / width,
      (layer.height * h) / height,
    );
  } finally {
    layer.width = layer.height = 0;
  }
}
