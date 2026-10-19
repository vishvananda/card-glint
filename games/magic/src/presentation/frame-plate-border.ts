import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import { paintPlanarFrame } from './planar-frame-geometry.js';

/** The stock mask must use the plate's geometry, including its outer bands.
 * Preparing this static layer performs no pixel readback or per-frame work. */
export function paintPlateStockBorder(
  c: CanvasContext,
  image: CanvasImageSource & { width: number; height: number },
  stock: string,
  geometry?: 'planar' | 'colorshifted',
): void {
  const mask = rasterCanvas();
  mask.width = 732;
  mask.height = 1020;
  try {
    const m = mask.getContext('2d');
    if (!m) throw Error('Missing frame stock composition context');
    if (geometry) {
      m.save();
      m.scale(1.5, 1.5);
      paintPlanarFrame(m, image, geometry === 'colorshifted');
      m.restore();
    } else m.drawImage(image, 0, 0, mask.width, mask.height);
    m.globalCompositeOperation = 'source-in';
    m.fillStyle = stock;
    m.fillRect(0, 0, mask.width, mask.height);
    c.drawImage(mask, 0, 0, 488, 680);
  } finally {
    mask.width = mask.height = 0;
  }
}
