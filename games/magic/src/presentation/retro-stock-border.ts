import { FACE_WIDTH, FACE_HEIGHT, type FaceRect } from './face-layout.js';

/** Recolor stock without leaving the plate's white edge under a fractional mask.
 * Chrome and WebKit can antialias drawImage's outer rectangle: painting it
 * twice does not fully cover the first edge. Prime that outer edge with stock,
 * keeping the mask's inner aperture and resampling exactly as before.
 * This scratch raster is built only while composing a static face. */
export function paintRetroStockBorder(
  c: CanvasRenderingContext2D,
  mask: CanvasImageSource,
  [x, y, w, h]: FaceRect,
  stock: string,
) {
  const layer = document.createElement('canvas');
  layer.width = 732;
  layer.height = 1020;
  try {
    const ctx = layer.getContext('2d');
    if (!ctx) throw new Error('Retro stock preparation requires Canvas2D.');
    ctx.drawImage(mask, 0, 0, layer.width, layer.height);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = stock;
    ctx.fillRect(0, 0, layer.width, layer.height);
    // These plates have continuous stock along their rectangular outer edge.
    // Two canonical pixels cover one output pixel at the 244px table tier;
    // the aperture is much farther in. Preserve its original bitmap sampling.
    const bleed = 2;
    c.save();
    c.fillStyle = stock;
    c.beginPath();
    c.rect(0, 0, FACE_WIDTH, FACE_HEIGHT);
    c.rect(x + bleed, y + bleed, w - 2 * bleed, h - 2 * bleed);
    c.fill('evenodd');
    c.restore();
    c.drawImage(layer, x, y, w, h);
  } finally {
    layer.width = layer.height = 0;
  }
}
