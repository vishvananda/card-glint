import type { CanvasImages } from './canvas-assets.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { illustrationCover, croppedIllustration } from './illustration-layout.js';

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
  if (layer === 'printing') {
    context.clearRect(x, y, width, height);
    return;
  }
  if (layer === 'artwork') {
    context.fillStyle = '#80745c';
    context.fillRect(x, y, width, height);
  }
  const image = images.get(face.illustration ?? '');
  if (!image) return;
  context.save();
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  if (face.illustrationCrop)
    context.drawImage(
      image,
      ...croppedIllustration(image.width, image.height, bounds, face.illustrationCrop),
    );
  else context.drawImage(image, ...illustrationCover(image.width, image.height, bounds));
  context.restore();
}
