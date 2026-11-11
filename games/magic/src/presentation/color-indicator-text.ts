import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { paintFittedText } from './canvas-text.js';
import { paintTypeColorIndicator } from './color-indicator-paint.js';

type TextArguments =
  Parameters<typeof paintFittedText> extends [CanvasContext, ...infer Rest] ? Rest : never;
/** Preserve the painter's exact default metrics; reserve the disc before text fitting. */
export function paintFittedTypeLine(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
  ...args: TextArguments
): void {
  const [text, x, y, width, size, ...style] = args;
  const type = paintTypeColorIndicator(c, face, images, [x, y - size / 2, width, size]);
  paintFittedText(c, text, type[0], y, type[2], size, ...style);
}
