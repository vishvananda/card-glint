import { WALKER_GEOMETRY } from './planeswalker-geometry.js';
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
/** Copy only the right section. Compressing the center would move the left
 * aperture, type slot and artwork. The texture expands into the vacated strip. */
async function rightInset(image: ImageBitmap, isBackground: boolean): Promise<ImageBitmap> {
  const canvas = rasterCanvas();
  canvas.width = image.width;
  canvas.height = image.height;
  try {
    const context = canvas.getContext('2d');
    if (!context) throw Error('Planeswalker inset needs Canvas2D');
    const left = (isBackground ? 0.03937 : 0.04724) * 488;
    const width = (isBackground ? 0.92126 : 0.91339) * 488;
    const q = image.width / width,
      px = (x: number) => (x - left) * q;
    if (!isBackground) {
      const split = Math.round(px(420)),
        edge = split - WALKER_GEOMETRY.rightInset * q;
      context.drawImage(image, 0, 0);
      context.clearRect(edge, 0, image.width - edge, image.height);
      context.drawImage(
        image,
        split,
        0,
        image.width - split,
        image.height,
        edge,
        0,
        image.width - split,
        image.height,
      );
    } else {
      const source = [0, px(420), px(442), image.width - 4 * q, image.width];
      const target = [
        0,
        px(420),
        px(442 - WALKER_GEOMETRY.rightInset),
        image.width - (4 + WALKER_GEOMETRY.rightInset) * q,
        image.width,
      ];
      for (let i = 0; i < source.length - 1; i++)
        context.drawImage(
          image,
          source[i]!,
          0,
          source[i + 1]! - source[i]!,
          image.height,
          target[i]!,
          0,
          target[i + 1]! - target[i]!,
          image.height,
        );
    }
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = canvas.height = 0;
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
  const frame = required(assets.frame);
  const leases = await planeswalkerBitmapCache.acquireMany(
    [
      {
        key: JSON.stringify([
          WALKER_MATERIAL_REVISION,
          'background',
          sources.source,
          assets.background,
          mask.width,
          mask.height,
          adjustment,
        ]),
        bytes: mask.width * mask.height * 4,
        async build() {
          const prepared = await background(source, mask, adjustment, palette === 'A');
          try {
            return await rightInset(prepared, true);
          } finally {
            prepared.close();
          }
        },
      },
      {
        key: JSON.stringify([
          WALKER_MATERIAL_REVISION,
          'frame',
          assets.frame,
          frame.width,
          frame.height,
        ]),
        bytes: frame.width * frame.height * 4,
        build: () => rightInset(frame, false),
      },
    ],
    signal,
  );
  const result = Object.assign(new Map(images), images);
  result.set(assets.background, leases[0]!.value);
  result.set(assets.frame, leases[1]!.value);
  return {
    images: result,
    dispose() {
      for (const lease of leases) lease.release();
    },
  };
}
