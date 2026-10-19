import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
const colors = new WeakMap<ImageBitmap, string>();

/** A solid, explicitly incomplete background, never a stretched duplicate of
 * the illustration. Sample once per decoded asset during face preparation. */
export function illustrationFallback(image: ImageBitmap): string {
  const prior = colors.get(image);
  if (prior) return prior;
  const sample = rasterCanvas();
  sample.width = sample.height = 16;
  try {
    const c = sample.getContext('2d', { willReadFrequently: true })!;
    c.drawImage(image, 0, 0, 16, 16);
    const pixels = c.getImageData(0, 0, 16, 16).data;
    const channels: number[][] = [[], [], []];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        if (x > 0 && x < 15 && y > 0 && y < 15) continue;
        const i = (y * 16 + x) * 4;
        if (pixels[i + 3]! < 128) continue;
        channels.forEach((channel, j) => channel.push(pixels[i + j]!));
      }
    const color = `rgb(${channels.map((v) => v.sort((a, b) => a - b)[Math.floor(v.length / 2)] ?? 128).join(' ')})`;
    colors.set(image, color);
    return color;
  } finally {
    sample.width = sample.height = 0;
  }
}
