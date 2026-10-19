import { visibleArt } from './art-apertures.js';
import { splitPanels, panelTransform } from './split-layout.js';
import { faceRects } from './special-frames.js';
import {
  ETCHED_SET_MARK_PATH,
  FACE_HEIGHT,
  FACE_WIDTH,
  etchedSetLabel,
  type RenderedCardInput,
  type FaceRect,
} from './face-layout.js';
import { faceEtchingSymbol } from './assets.js';
import { acquireSetSymbolMask } from './set-symbol-mask.js';
import { loadCanvasImages } from './canvas-assets.js';
import { illustrationCover, illustrationTarget } from './illustration-layout.js';
import { battleNativeRect } from './battle-layout.js';

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
      try {
        panelTransform(context, panel);
        await paintMask(context, panel.face, printingId, signal, {
          ...options,
          height: (panel.height * FACE_WIDTH) / panel.width,
        });
      } finally {
        context.restore();
      }
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
        const battle = face.frameTemplate === 'battle',
          width = battle ? 523 : FACE_WIDTH,
          artHeight = battle ? 375 : height;
        const aperture = faceRects(face).art,
          bounds: FaceRect = battle
            ? battleNativeRect(aperture)
            : [
                aperture[0] * width,
                aperture[1] * artHeight,
                aperture[2] * width,
                aperture[3] * artHeight,
              ];
        // Derivative dimensions are rounded to whole pixels. Keep the source
        // illustration's aspect ratio, as the DOM's shared crop plane does.
        const source = loaded.images.get(face.illustration) ?? bitmap;
        context.save();
        if (battle) {
          context.translate(0, height);
          context.rotate(-Math.PI / 2);
          context.scale(height / 523, FACE_WIDTH / 375);
        }
        context.beginPath();
        const physicalClip = visibleArt(face),
          clip: FaceRect = battle
            ? battleNativeRect(physicalClip)
            : [
                physicalClip[0] * width,
                physicalClip[1] * artHeight,
                physicalClip[2] * width,
                physicalClip[3] * artHeight,
              ];
        context.rect(...clip);
        context.clip();
        // Match the DOM alpha mask's bilinear sampling; photographic filtering
        // alters thin etched edges when this lower-resolution mask is enlarged.
        context.imageSmoothingQuality = 'low';
        const target = illustrationTarget(face, bounds, width, artHeight, battle ? -90 : 0);
        if (face.illustrationCrop) {
          const crop = face.illustrationCrop;
          const dest = illustrationCover(
            source.width * crop[2],
            source.height * crop[3],
            target,
            face.artPlacement,
          );
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
            ...illustrationCover(source.width, source.height, target, face.artPlacement),
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
  if (!face.setCode || face.printingElements?.setSymbol?.hidden) return;
  const [rx, ry, rw, rh] = faceRects(face).stamp;
  const x = rx * FACE_WIDTH,
    y = ry * height,
    w = rw * FACE_WIDTH,
    h = rh * height;
  const url = faceEtchingSymbol(face);
  const loaded = await loadImages([url], signal);
  try {
    await beforePaint?.();
    signal.throwIfAborted();
    const image = url ? loaded.images.get(url) : null;
    context.save();
    try {
      if (face.printingElements?.setSymbol?.offset)
        context.translate(...face.printingElements.setSymbol.offset);
      context.globalAlpha = 0.68;
      if (image) {
        const mask = await acquireSetSymbolMask(image, url!, face.setSymbolMask, signal);
        try {
          signal.throwIfAborted();
          const scale = Math.min(w / mask.value.width, h / mask.value.height);
          context.drawImage(
            mask.value,
            x + (w - mask.value.width * scale) / 2,
            y + (h - mask.value.height * scale) / 2,
            mask.value.width * scale,
            mask.value.height * scale,
          );
        } finally {
          mask.release();
        }
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
    } finally {
      context.restore();
    }
  } finally {
    loaded.dispose();
  }
}
