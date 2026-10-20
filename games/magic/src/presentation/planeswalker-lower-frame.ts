import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { WALKER_GEOMETRY, paintWalkerGeometry } from './planeswalker-geometry.js';
import { FACE_HEIGHT, FACE_WIDTH } from './face-layout.js';

// Shared correction from separate inner/outer rim landmarks across four sets.
// Preserve the accepted type opening; shorten only the panel below it.
const LOWER_LIFT = 5;
const FRAME_BOTTOM = 0.02655 * FACE_HEIGHT + (0.91339 * FACE_WIDTH * 3810) / 2736;
export function planeswalkerLowerPanel(large: boolean) {
  const top = large ? 382 : 429;
  return { top, scale: 1 - LOWER_LIFT / (FRAME_BOTTOM - top) };
}

/** Inset the printed ink from the aperture's inner rim, including its curve. */
export function planeswalkerInkLimits(large: boolean): readonly [number, number] {
  const { top, scale } = planeswalkerLowerPanel(large);
  return [top + 6 - WALKER_GEOMETRY.middleLift, top + (625 - top) * scale - 4];
}

/** Keep all source pixels, with the upper frame unchanged and a shared small
 * vertical compression below the type opening. Called during face preparation. */
function paintPlaneswalkerFrameImageBase(
  context: CanvasContext,
  image: ImageBitmap,
  x: number,
  y: number,
  width: number,
  large: boolean,
) {
  const { top, scale } = planeswalkerLowerPanel(large);
  const height = (image.height * width) / image.width;
  const upperHeight = Math.max(0, Math.min(height, top - y));
  const sourceSplit = (upperHeight * image.width) / width;
  if (upperHeight > 0)
    context.drawImage(image, 0, 0, image.width, sourceSplit, x, y, width, upperHeight);
  if (upperHeight < height)
    context.drawImage(
      image,
      0,
      sourceSplit,
      image.width,
      image.height - sourceSplit,
      x,
      y + upperHeight,
      width,
      (height - upperHeight) * scale,
    );
}

export function paintPlaneswalkerFrameImage(
  context: CanvasContext,
  image: ImageBitmap,
  x: number,
  y: number,
  width: number,
  large: boolean,
) {
  paintWalkerGeometry(context, large, () =>
    paintPlaneswalkerFrameImageBase(context, image, x, y, width, large),
  );
}
