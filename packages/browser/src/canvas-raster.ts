import type { Size } from './types.js';
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
export function closeRaster(image: HTMLCanvasElement) {
  image.width = image.height = 0;
}
