import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { faceFrame } from './special-frames.js';
import { profileAssets } from './assets.js';
import { resolveCardProfile } from './profile.js';
import { adjustHsb, IDENTITY_HSB, type HsbAdjustment } from './hsb.js';
import { planeswalkerBitmapCache } from './material-bitmap-cache.js';
import {
  walkerSources,
  walkerPalette,
  WALKER_BACKGROUND_HSB,
  WALKER_MATERIAL_REVISION,
} from './planeswalker-sources.js';

function color(
  c: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  w: number,
  h: number,
  a: HsbAdjustment,
) {
  if (a.hueDegrees === 0 && a.saturationScale === 1 && a.brightnessScale === 1) return;
  const p = c.getImageData(0, 0, w, h);
  for (let i = 0; i < p.data.length; i += 4) {
    if (!p.data[i + 3]) continue;
    const rgb = adjustHsb([p.data[i]! / 255, p.data[i + 1]! / 255, p.data[i + 2]! / 255], a);
    for (let k = 0; k < 3; k++) p.data[i + k] = Math.round(rgb[k]! * 255);
  }
  c.putImageData(p, 0, 0);
}
async function background(
  source: ImageBitmap,
  mask: ImageBitmap,
  a: HsbAdjustment,
  opaqueColorless: boolean,
) {
  const c = rasterCanvas();
  c.width = mask.width;
  c.height = mask.height;
  try {
    const ctx = c.getContext('2d');
    if (!ctx) throw Error('Planeswalker background needs Canvas2D');
    const x = 0.03937 * 488,
      y = 0.02531 * 680,
      w = 0.92126 * 488,
      h = (w * 3793) / 2778;
    ctx.drawImage(
      source,
      (x / 488) * source.width,
      (y / 680) * source.height,
      (w / 488) * source.width,
      (h / 680) * source.height,
      0,
      0,
      c.width,
      c.height,
    );
    color(ctx, c.width, c.height, a);
    ctx.globalCompositeOperation = 'destination-in';
    if (opaqueColorless) {
      // The retired gray texture used 179/255 material opacity. The replacement
      // is an opaque printed material: retain its antialiased silhouette only.
      const coverage = rasterCanvas();
      coverage.width = mask.width;
      coverage.height = mask.height;
      try {
        const m = coverage.getContext('2d');
        if (!m) throw Error('Planeswalker coverage needs Canvas2D');
        m.drawImage(mask, 0, 0);
        const p = m.getImageData(0, 0, mask.width, mask.height);
        for (let i = 3; i < p.data.length; i += 4)
          p.data[i] = Math.min(255, Math.round((p.data[i]! * 255) / 179));
        m.putImageData(p, 0, 0);
        ctx.drawImage(coverage, 0, 0);
      } finally {
        coverage.width = coverage.height = 0;
      }
    } else ctx.drawImage(mask, 0, 0);
    return await createImageBitmap(c);
  } finally {
    c.width = c.height = 0;
  }
}
/** Bounded source-derived background. Other frame parts and type geometry stay
 * independent. Sources remain borrowed until a pending build settles on abort. */
export async function preparePlaneswalkerMaterials(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose(): void }> {
  const kind = faceFrame(face);
  if (!kind.startsWith('planeswalker')) return { images, dispose() {} };
  const large = kind === 'planeswalker-large',
    palette = walkerPalette(resolveCardProfile(face).boxes);
  const sources = walkerSources(large, palette),
    assets = profileAssets(resolveCardProfile(face), kind);
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error('Planeswalker asset unavailable: ' + url);
    return image;
  };
  const source = required(sources.source),
    mask = required(assets.background);
  const adjustment = face.calibration === 'source' ? IDENTITY_HSB : WALKER_BACKGROUND_HSB[palette];
  const lease = await planeswalkerBitmapCache.acquire(
    JSON.stringify([
      WALKER_MATERIAL_REVISION,
      sources.source,
      assets.background,
      mask.width,
      mask.height,
      adjustment,
    ]),
    mask.width * mask.height * 4,
    () => background(source, mask, adjustment, palette === 'A'),
    signal,
  );
  const result = Object.assign(new Map(images), images);
  result.set(assets.background, lease.value);
  return {
    images: result,
    dispose() {
      lease.release();
    },
  };
}
