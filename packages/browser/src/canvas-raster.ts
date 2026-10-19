import type { Size } from './types.js';
export type CanvasRaster = HTMLCanvasElement | OffscreenCanvas;
export type CanvasContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/** Preparation-only canvas, including workers without a DOM. */
export function rasterCanvas(size: Size = [300, 150]): CanvasRaster {
  const [width, height] = size;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width * height > 4194304
  )
    throw RangeError('Invalid raster size');
  if (typeof document !== 'undefined') return canvas(size);
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
  throw Error('Canvas2D preparation requires a document or OffscreenCanvas');
}

/** Obtain mutable Canvas2D storage, consuming a transferred bitmap if needed. */
export function mutableRaster(image: HTMLCanvasElement | ImageBitmap): CanvasRaster {
  if ('getContext' in image) return image;
  const result = rasterCanvas([image.width, image.height]);
  try {
    const context = result.getContext('2d');
    if (!context) throw Error('Canvas2D raster unavailable');
    context.drawImage(image, 0, 0);
    return result;
  } catch (error) {
    closeRaster(result);
    throw error;
  } finally {
    image.close();
  }
}
export function canvas(size: Size) {
  const [width, height] = size;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width * height > 4194304
  )
    throw RangeError('Invalid raster size');
  const result = document.createElement('canvas');
  result.width = width;
  result.height = height;
  return result;
}
/** Complete a worker raster without retaining its Canvas backing store. */
export async function finishRaster(
  image: CanvasRaster | ImageBitmap,
  bitmap = false,
): Promise<HTMLCanvasElement | ImageBitmap> {
  if ('close' in image) return image;
  if ('transferToImageBitmap' in image) {
    try {
      return image.transferToImageBitmap();
    } finally {
      closeRaster(image);
    }
  }
  if (bitmap) {
    try {
      return await createImageBitmap(image);
    } finally {
      closeRaster(image);
    }
  }
  return image;
}
export function closeRaster(image: CanvasRaster | ImageBitmap) {
  if ('close' in image) image.close();
  else image.width = image.height = 0;
}
