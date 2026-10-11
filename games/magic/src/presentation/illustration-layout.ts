import type { FaceRect } from './face-layout.js';

/** Center a source image over the entire aperture without stretching or gutters.
 * Use source dimensions for both the image and its rounded-size edge derivative. */
export function illustrationCover(width: number, height: number, [x, y, w, h]: FaceRect): FaceRect {
  if (!(width > 0 && height > 0)) return [x, y, w, h];
  const scale = Math.max(w / width, h / height),
    sw = width * scale,
    sh = height * scale;
  return [x + (w - sw) / 2, y + (h - sh) / 2, sw, sh];
}

/** Source and destination rectangles for a printing's optional illustration sheet. */
export function croppedIllustration(
  width: number,
  height: number,
  rect: FaceRect,
  crop: FaceRect,
): [...FaceRect, ...FaceRect] {
  const source: FaceRect = [crop[0] * width, crop[1] * height, crop[2] * width, crop[3] * height];
  return [...source, ...illustrationCover(source[2], source[3], rect)];
}
