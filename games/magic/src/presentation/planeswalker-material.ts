import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { faceFrame } from './special-frames.js';
import { profileAssets } from './assets.js';
import { resolveCardProfile } from './profile.js';
import { adjustHsb, IDENTITY_HSB, type HsbAdjustment } from './hsb.js';
import { planeswalkerBitmapCache, type MaterialBitmapLease } from './material-bitmap-cache.js';
import { calibratedFrameMaterials } from './printing-calibration-materials.js';
import {
  walkerSources,
  walkerPalette,
  walkerTypeRect,
  WALKER_BACKGROUND_HSB,
  WALKER_TYPE_HSB,
  WALKER_MATERIAL_REVISION,
} from './planeswalker-sources.js';
import { buildWalkerOpening, walkerOpeningRect } from './planeswalker-opening.js';

export interface WalkerMaterials {
  type: { image: ImageBitmap; rect: FaceRect };
  opening: { image: ImageBitmap; rect: FaceRect };
}
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
async function type(
  source: ImageBitmap,
  mask: ImageBitmap,
  crop: FaceRect,
  a: HsbAdjustment,
  w: number,
  h: number,
) {
  const c = rasterCanvas();
  c.width = w;
  c.height = h;
  try {
    const ctx = c.getContext('2d');
    if (!ctx) throw Error('Planeswalker type plate needs Canvas2D');
    const [x, y, cw, ch] = crop;
    ctx.drawImage(
      source,
      x * source.width,
      y * source.height,
      cw * source.width,
      ch * source.height,
      0,
      0,
      w,
      h,
    );
    color(ctx, w, h, a);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(
      mask,
      x * mask.width,
      y * mask.height,
      cw * mask.width,
      ch * mask.height,
      0,
      0,
      w,
      h,
    );
    return await createImageBitmap(c);
  } finally {
    c.width = c.height = 0;
  }
}

/** Three atomic, bounded source-derived materials. No decoded source is owned
 * by this cache; callers retain sources until pending builds settle on abort. */
export async function preparePlaneswalkerMaterials(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose(): void }> {
  const kind = faceFrame(face);
  if (!kind.startsWith('planeswalker')) return { images, dispose() {} };
  const large = kind === 'planeswalker-large',
    palette = walkerPalette(resolveCardProfile(face).boxes),
    sources = walkerSources(large, palette);
  const assets = profileAssets(resolveCardProfile(face), kind);
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error('Planeswalker asset unavailable: ' + url);
    return image;
  };
  const source = required(sources.source),
    mask = required(sources.mask),
    bg = required(assets.background),
    frame = required(assets.frame);
  const raw = face.calibration === 'source',
    ba = raw ? IDENTITY_HSB : WALKER_BACKGROUND_HSB[palette],
    ta = raw ? IDENTITY_HSB : WALKER_TYPE_HSB[palette];
  const tw = Math.ceil(sources.crop[2] * source.width),
    th = Math.ceil(sources.crop[3] * source.height),
    openingRect = walkerOpeningRect(frame, large);
  const oh = Math.round((openingRect[3] * 680) / ((0.91339 * 488) / frame.width));
  let leases: MaterialBitmapLease[] = [];
  try {
    leases = await planeswalkerBitmapCache.acquireMany(
      [
        {
          key: JSON.stringify([
            WALKER_MATERIAL_REVISION,
            'background',
            sources.source,
            assets.background,
            bg.width,
            bg.height,
            ba,
          ]),
          bytes: bg.width * bg.height * 4,
          build: () => background(source, bg, ba, palette === 'A'),
        },
        {
          key: JSON.stringify([
            WALKER_MATERIAL_REVISION,
            'type',
            sources.source,
            sources.mask,
            tw,
            th,
            ta,
          ]),
          bytes: tw * th * 4,
          build: () => type(source, mask, sources.crop, ta, tw, th),
        },
        {
          key: JSON.stringify([
            WALKER_MATERIAL_REVISION,
            'opening',
            assets.frame,
            frame.width,
            frame.height,
            large,
            calibratedFrameMaterials(face)[assets.frame] ?? null,
          ]),
          bytes: frame.width * oh * 4,
          build: async () => (await buildWalkerOpening(frame, large)).image,
        },
      ],
      signal,
    );
    const prepared: WalkerMaterials = {
      type: { image: leases[1]!.value, rect: walkerTypeRect(large) },
      opening: { image: leases[2]!.value, rect: openingRect },
    };
    const result = Object.assign(new Map(images), images, { planeswalker: prepared });
    result.set(assets.background, leases[0]!.value);
    return {
      images: result,
      dispose() {
        for (const l of leases) l.release();
      },
    };
  } catch (error) {
    for (const l of leases) l.release();
    throw error;
  }
}
