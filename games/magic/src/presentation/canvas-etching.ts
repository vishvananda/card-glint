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
import { setSymbolAsset } from './assets.js';
import { loadCanvasImages } from './canvas-assets.js';
import { illustrationCover } from './illustration-layout.js';

/** One transparent alpha plane shares the assembled face's exact illustration aperture. */
export async function paintEtchingMask(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  printingId: string | null,
  signal: AbortSignal,
  threshold?: number,
  beforePaint?: () => Promise<void>,
  loadImages = loadCanvasImages,
): Promise<void> {
  return paintMask(context, face, printingId, signal, {
    threshold,
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
  signal.throwIfAborted();
  if (!face.setCode) return;
  const [rx, ry, rw, rh] = faceRects(face).stamp;
  const x = rx * FACE_WIDTH,
    y = ry * height,
    w = rw * FACE_WIDTH,
    h = rh * height;
  const url = setSymbolAsset(face.setCode);
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
