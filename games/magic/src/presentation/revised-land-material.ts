import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { retroDualBitmapCache } from './material-bitmap-cache.js';
import { isRevisedLand, REVISED_LAND_ASSET, revisedLandColors } from './revised-land-frame.js';
import { hasColorCalibration } from './calibration-profiles.js';
import { colorRevisedLand } from './revised-land-pixels.js';

export async function prepareRevisedLand(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
) {
  if (!isRevisedLand(face)) return { images, dispose() {} };
  const source = images.get(REVISED_LAND_ASSET);
  if (!source) throw Error('Revised land frame asset unavailable');
  const colors = revisedLandColors(face);
  const calibrated = hasColorCalibration(face);
  const lease = await retroDualBitmapCache.acquire(
    JSON.stringify([
      'revised-fourth-land-v4',
      REVISED_LAND_ASSET,
      source.width,
      source.height,
      colors,
      calibrated,
    ]),
    source.width * source.height * 4,
    async () => {
      const canvas = document.createElement('canvas');
      canvas.width = source.width;
      canvas.height = source.height;
      try {
        const c = canvas.getContext('2d', { willReadFrequently: true });
        if (!c) throw Error('Revised land preparation needs Canvas2D');
        c.drawImage(source, 0, 0);
        const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
        colorRevisedLand(pixels, colors, calibrated);
        c.putImageData(pixels, 0, 0);
        // Shared paper-box fit, in 488 × 680 face pixels. Read/transform only
        // on a material-cache miss; art and the outer frame keep their pose.
        const x = (canvas.width * 160) / 1500,
          y = (canvas.height * 1240) / 2100;
        const w = (canvas.width * 1190) / 1500,
          h = (canvas.height * 654) / 2100;
        const cx = (canvas.width * (244 - 2.404)) / (488 * 0.984);
        const cy = (canvas.height * (515 - 9.9)) / (680 * 0.99);
        c.drawImage(
          canvas,
          x,
          y,
          w,
          h,
          cx + (x - cx) * 1.001,
          cy + (y - cy) * 1.001 + (canvas.height * 0.25) / (680 * 0.99),
          w * 1.001,
          h * 1.001,
        );
        return await createImageBitmap(canvas);
      } finally {
        canvas.width = canvas.height = 0;
      }
    },
    signal,
  );
  const derived = Object.assign(new Map(images), images);
  derived.set(REVISED_LAND_ASSET, lease.value);
  return { images: derived, dispose: () => lease.release() };
}
