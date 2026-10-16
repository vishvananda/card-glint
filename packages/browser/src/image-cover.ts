import type { Rect } from './types.js';

/** Focal point is a fraction of the cropped source image. Zoom is relative to cover. */
export interface ImageFit {
  focalPoint?: readonly [number, number];
  zoom?: number;
}
export function validateImageFit(fit: ImageFit): void {
  if (!fit || typeof fit !== 'object' || Array.isArray(fit)) throw Error('Invalid image fit');
  if (
    fit.focalPoint !== undefined &&
    (!Array.isArray(fit.focalPoint) ||
      fit.focalPoint.length !== 2 ||
      !fit.focalPoint.every((n) => Number.isFinite(n) && n >= 0 && n <= 1))
  )
    throw Error('Image focal point must be within 0..1');
  if (fit.zoom !== undefined && (!Number.isFinite(fit.zoom) || fit.zoom < 1 || fit.zoom > 8))
    throw Error('Image zoom must be within 1..8');
}
/** Cover an aperture without gutters; constrain the chosen focal point at its edges. */
export function coverImage(
  width: number,
  height: number,
  [x, y, w, h]: Rect,
  fit?: ImageFit,
): Rect {
  if (fit) validateImageFit(fit);
  if (!(width > 0 && height > 0)) return [x, y, w, h];
  const scale = Math.max(w / width, h / height) * (fit?.zoom ?? 1),
    sw = width * scale,
    sh = height * scale;
  const [fx, fy] = fit?.focalPoint ?? [0.5, 0.5];
  const left =
    fx === 0.5 ? x + (w - sw) / 2 : Math.max(x + w - sw, Math.min(x, x + w / 2 - sw * fx));
  const top =
    fy === 0.5 ? y + (h - sh) / 2 : Math.max(y + h - sh, Math.min(y, y + h / 2 - sh * fy));
  return [left, top, sw, sh];
}
