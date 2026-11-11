import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { colorIndicatorAssets, paintIndicatorSectors } from './color-indicator-paint.js';
import { colorIndicatorComposite, resolveColorIndicator } from './color-indicator.js';
import { MaterialBitmapCache, materialBitmapIdentity } from './material-bitmap-cache.js';

const bitmaps = new MaterialBitmapCache(4 * 1024 * 1024);
export const clearColorIndicatorBitmaps = () => bitmaps.clear();

/** One shared sector composite per source/color tuple. OffscreenCanvas in both
 * realms keeps clip edges consistent; no pixel readback is needed. */
export async function prepareColorIndicators(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose(): void }> {
  signal.throwIfAborted();
  const groups = new Map<string, string[]>();
  const visit = (f: RenderedCardInput) => {
    const indicator = resolveColorIndicator(f);
    if (indicator && indicator.colors.length > 1)
      groups.set(colorIndicatorComposite(indicator.colors), colorIndicatorAssets(f));
    for (const child of f.faces ?? []) visit(child);
  };
  visit(face);
  if (!groups.size) return { images, dispose() {} };
  const entries = [...groups];
  const jobs = entries.map(([url, sources]) => {
    const parts = sources.map((source) => {
      const bitmap = images.get(source);
      if (!bitmap) throw Error('Color indicator asset unavailable: ' + source);
      return bitmap;
    });
    return {
      key: JSON.stringify(['color-indicator-sectors-v1', url, parts.map(materialBitmapIdentity)]),
      bytes: 128 * 128 * 4,
      build: async () => {
        const canvas =
          typeof OffscreenCanvas === 'function'
            ? new OffscreenCanvas(128, 128)
            : rasterCanvas([128, 128]);
        try {
          const c = canvas.getContext('2d');
          if (!c) throw Error('Color indicator preparation needs Canvas2D');
          paintIndicatorSectors(c, parts, [0, 0, 128, 128]);
          return await createImageBitmap(canvas);
        } finally {
          canvas.width = canvas.height = 0;
        }
      },
    };
  });
  const leases = await bitmaps.acquireMany(jobs, signal);
  try {
    const prepared = Object.assign(new Map(images), images);
    entries.forEach(([url], i) => prepared.set(url, leases[i]!.value));
    return { images: prepared, dispose: () => leases.forEach((lease) => lease.release()) };
  } catch (error) {
    leases.forEach((lease) => lease.release());
    throw error;
  }
}
