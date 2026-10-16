import type { FaceRect, RenderedCardInput } from './face-layout.js';

/** The same source placement drives painting and both etching paths. The
 * fallback is already in caller units; explicit placement is normalized. */
export function illustrationTarget(
  face: RenderedCardInput,
  fallback: FaceRect,
  width = 1,
  height = 1,
): FaceRect {
  const rect = face.illustrationPlacement;
  if (!rect) return fallback;
  if (!rect.every(Number.isFinite) || rect[2] <= 0 || rect[3] <= 0)
    throw Error('Artwork placement requires finite coordinates and positive dimensions');
  return [rect[0] * width, rect[1] * height, rect[2] * width, rect[3] * height];
}

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
