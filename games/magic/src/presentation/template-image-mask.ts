/** MSE uses grayscale coverage, not alpha. Convert each decoded shared mask
 * once during face preparation; animation never reads pixels or rebuilds it. */
const masks = new WeakMap<ImageBitmap, HTMLCanvasElement>();
export function templateImageMask(image: ImageBitmap): HTMLCanvasElement {
  const old = masks.get(image);
  if (old) return old;
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  c.drawImage(image, 0, 0);
  const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 3] = Math.round((pixels.data[i]! * pixels.data[i + 3]!) / 255);
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255;
  }
  c.putImageData(pixels, 0, 0);
  masks.set(image, canvas);
  return canvas;
}
