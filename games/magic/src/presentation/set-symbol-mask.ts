import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import { MaterialBitmapCache, type MaterialBitmapLease } from './material-bitmap-cache.js';
import { isStyledSetSymbol } from './styled-set-symbols.js';

// Separate from face materials: a shared symbol must not crowd out frame plates.
export const setSymbolMaskCache = new MaterialBitmapCache(4 * 1024 * 1024);
const identities = new WeakMap<ImageBitmap, number>();
let nextIdentity = 0;

/** Styled common symbols use black ink on opaque white. Host symbols retain
 * their alpha unless the caller explicitly selects dark-ink extraction. */
export async function acquireSetSymbolMask(
  image: ImageBitmap,
  url: string,
  mode: RenderedCardInput['setSymbolMask'],
  signal: AbortSignal,
): Promise<MaterialBitmapLease> {
  signal.throwIfAborted();
  if (mode !== undefined && !['auto', 'alpha', 'ink'].includes(mode))
    throw Error('Invalid set symbol mask mode');
  const ink = mode === 'ink' || ((mode === undefined || mode === 'auto') && isStyledSetSymbol(url));
  if (!ink) return { value: image, release() {} };
  let identity = identities.get(image);
  if (identity === undefined) identities.set(image, (identity = ++nextIdentity));
  const scale = Math.min(1, 512 / Math.max(image.width, image.height)),
    width = Math.max(1, Math.round(image.width * scale)),
    height = Math.max(1, Math.round(image.height * scale));
  return setSymbolMaskCache.acquire(
    JSON.stringify(['set-symbol-ink-v1', identity, width, height]),
    width * height * 4,
    async () => {
      const canvas = rasterCanvas();
      canvas.width = width;
      canvas.height = height;
      try {
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw Error('Set symbol mask needs Canvas2D');
        context.drawImage(image, 0, 0, width, height);
        // Read the small decoded source once on a cache miss, never a renderer
        // mask or live frame. White backing/holes become transparent; soft ink
        // edges retain both their original alpha and grayscale coverage.
        const pixels = context.getImageData(0, 0, width, height);
        for (let i = 0; i < pixels.data.length; i += 4) {
          const light =
            pixels.data[i]! * 0.2126 + pixels.data[i + 1]! * 0.7152 + pixels.data[i + 2]! * 0.0722;
          pixels.data[i + 3] = Math.round(pixels.data[i + 3]! * (1 - light / 255));
          pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255;
        }
        context.putImageData(pixels, 0, 0);
        return await createImageBitmap(canvas);
      } finally {
        canvas.width = canvas.height = 0;
      }
    },
    signal,
  );
}
