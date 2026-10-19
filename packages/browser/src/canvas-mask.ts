import { rasterCanvas, closeRaster, type CanvasRaster } from './canvas-raster.js';

/** Tightly packed linear R8 coverage; the first row is the texture's bottom row.
 * The caller owns data and may transfer data.buffer or upload it with alignment 1. */
export interface CoverageMap {
  readonly width: number;
  readonly height: number;
  readonly rowOrder: 'bottom-up';
  readonly data: Uint8Array;
}

/** Preparation-only extraction. Never call during animation. Does not consume source. */
export function coverageMap(
  source: CanvasRaster | ImageBitmap,
  channel: 'red' | 'alpha',
): CoverageMap {
  const { width, height } = source;
  const temporary = 'getContext' in source ? undefined : rasterCanvas([width, height]);
  try {
    const target = temporary ?? source;
    if (!('getContext' in target)) throw Error('Mask canvas unavailable');
    const context = target.getContext('2d', { willReadFrequently: true });
    if (!context) throw Error('Mask extraction needs Canvas2D');
    if (temporary) context.drawImage(source, 0, 0);
    const rgba = context.getImageData(0, 0, width, height).data;
    const data = new Uint8Array(width * height),
      offset = channel === 'red' ? 0 : 3;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++)
        data[(height - y - 1) * width + x] = rgba[(y * width + x) * 4 + offset]!;
    return { width, height, rowOrder: 'bottom-up', data };
  } finally {
    if (temporary) closeRaster(temporary);
  }
}
