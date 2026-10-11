import { visibleArt } from './art-apertures.js';
import { splitPanels, panelTransform } from './split-layout.js';
import { faceRects } from './special-frames.js';
import {
  ETCHED_SET_MARK_PATH,
  FACE_HEIGHT,
  FACE_WIDTH,
  etchedSetLabel,
  type RenderedCardInput,
} from './face-layout.js';
import { faceSetSymbol } from './assets.js';
import { loadCanvasImages } from './canvas-assets.js';
import { illustrationCover } from './illustration-layout.js';

/** Host-owned mask resolution. The pack owns placement, clipping and stamp geometry. */
export type EtchingResolver = (
  face: RenderedCardInput,
  printingId: string | null,
  signal: AbortSignal,
  threshold?: number,
  beforePaint?: () => Promise<void>,
) => Promise<string | null>;

/** One transparent alpha plane shares the assembled face's exact illustration aperture. */
export async function paintEtchingMask(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  printingId: string | null,
  signal: AbortSignal,
  threshold?: number,
  beforePaint?: () => Promise<void>,
  loadImages = loadCanvasImages,
  resolveEtching?: EtchingResolver,
): Promise<void> {
  return paintMask(context, face, printingId, signal, {
    threshold,
    resolveEtching,
    beforePaint,
    loadImages,
    height: FACE_HEIGHT,
  });
}
async function paintMask(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  printingId: string | null,
  signal: AbortSignal,
  options: {
    threshold?: number;
    resolveEtching?: EtchingResolver;
    beforePaint?: () => Promise<void>;
    loadImages: typeof loadCanvasImages;
    height: number;
  },
): Promise<void> {
  const { threshold, beforePaint, loadImages, height } = options;
  const panels = splitPanels(face);
  if (panels.length) {
    for (const panel of panels) {
      // The single-face mask is normalized to 488 × 680; transform it into the same panel aperture.
      context.save();
      panelTransform(context, panel);
      await paintMask(context, panel.face, printingId, signal, {
        ...options,
        height: (panel.height * FACE_WIDTH) / panel.width,
      });
      context.restore();
    }
    return;
  }
  if (face.illustration && options.resolveEtching) {
    let loaded: Awaited<ReturnType<typeof loadImages>> | undefined;
    try {
      const path = await options.resolveEtching(face, printingId, signal, threshold, beforePaint);
      loaded = await loadImages([path, face.illustration], signal);
      const bitmap = loaded.images.get(path ?? '');
      if (bitmap && !signal.aborted) {
        await beforePaint?.();
        signal.throwIfAborted();
        const [rx, ry, rw, rh] = faceRects(face).art;
        const x = rx * FACE_WIDTH,
          y = ry * height,
          w = rw * FACE_WIDTH,
          h = rh * height;
        // Derivative dimensions are rounded to whole pixels. Keep the source
        // illustration's aspect ratio, as the DOM's shared crop plane does.
        const source = loaded.images.get(face.illustration) ?? bitmap;
        context.save();
        context.beginPath();
        const clip = visibleArt(face);
        context.rect(
          clip[0] * FACE_WIDTH,
          clip[1] * height,
          clip[2] * FACE_WIDTH,
          clip[3] * height,
        );
        context.clip();
        // Match the DOM alpha mask's bilinear sampling; photographic filtering
        // alters thin etched edges when this lower-resolution mask is enlarged.
        context.imageSmoothingQuality = 'low';
        if (face.illustrationCrop) {
          const crop = face.illustrationCrop;
          const dest = illustrationCover(source.width * crop[2], source.height * crop[3], [
            x,
            y,
            w,
            h,
          ]);
          context.drawImage(
            bitmap,
            crop[0] * bitmap.width,
            crop[1] * bitmap.height,
            crop[2] * bitmap.width,
            crop[3] * bitmap.height,
            ...dest,
          );
        } else
          context.drawImage(
            bitmap,
            ...illustrationCover(source.width, source.height, [x, y, w, h]),
          );
        context.restore();
      }
    } catch {
      /* Etching is cosmetic; the face remains complete without the derivative. */
    } finally {
      loaded?.dispose();
    }
  }
  signal.throwIfAborted();
  if (!face.setCode) return;
  const [rx, ry, rw, rh] = faceRects(face).stamp;
  const x = rx * FACE_WIDTH,
    y = ry * height,
    w = rw * FACE_WIDTH,
    h = rh * height;
  const url = faceSetSymbol(face, 'common');
  const loaded = await loadImages([url], signal);
  try {
    await beforePaint?.();
    signal.throwIfAborted();
    const image = url ? loaded.images.get(url) : null;
    context.save();
    context.globalAlpha = 0.68;
    if (image) {
      const scale = Math.min(w / image.width, h / image.height);
      context.drawImage(
        image,
        x + (w - image.width * scale) / 2,
        y + (h - image.height * scale) / 2,
        image.width * scale,
        image.height * scale,
      );
    } else {
      context.translate(x, y);
      context.scale(w / 100, h / 100);
      context.fillStyle = 'white';
      context.fill(new Path2D(ETCHED_SET_MARK_PATH));
      context.font = 'bold 43px Georgia';
      context.textAlign = 'center';
      context.textBaseline = 'alphabetic';
      context.fillText(etchedSetLabel(face.setCode), 50, 65);
    }
    context.restore();
  } finally {
    loaded.dispose();
  }
}
