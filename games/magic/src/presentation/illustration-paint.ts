import { clipPlaneswalkerArt } from './planeswalker-art.js';
import { faceFrame } from './special-frames.js';
import type { CanvasImages } from './canvas-assets.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import {
  illustrationCover,
  croppedIllustration,
  illustrationTarget,
} from './illustration-layout.js';
import { illustrationFallback } from './illustration-fallback.js';

export type PaintLayer = 'artwork' | 'printing';
/** Keep the illustration aperture transparent in the printing layer. Subsequent
 * frame, crown, text and symbol drawing retains its original ordering. */
export function paintIllustration(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  bounds: FaceRect,
  layer?: PaintLayer,
) {
  const [x, y, width, height] = bounds;
  const kind = faceFrame(face);
  context.save();
  if (kind.startsWith('planeswalker')) clipPlaneswalkerArt(context, kind === 'planeswalker-large');
  if (layer === 'printing') {
    context.clearRect(x, y, width, height);
    context.restore();
    return;
  }
  const image = images.get(face.illustration ?? '');
  if (layer === 'artwork' || kind.startsWith('planeswalker') || face.illustrationPlacement) {
    context.fillStyle =
      image && face.illustrationPlacement ? illustrationFallback(image) : '#80745c';
    context.fillRect(x, y, width, height);
  }
  if (!image) {
    context.restore();
    return;
  }
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  const target = illustrationTarget(face, bounds, 488, 680);
  if (face.illustrationCrop)
    context.drawImage(
      image,
      ...croppedIllustration(
        image.width,
        image.height,
        target,
        face.illustrationCrop,
        face.artPlacement,
      ),
    );
  else
    context.drawImage(
      image,
      ...illustrationCover(image.width, image.height, target, face.artPlacement),
    );
  context.restore();
}
