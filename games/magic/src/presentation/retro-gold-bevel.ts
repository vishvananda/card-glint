import type { FaceRect } from './face-layout.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
/** The pinned seventh-family gold paper has reversed bevel lighting. Adjust
 * the four facets in place: moving/copying the rim also moves its baked shadow
 * texture. Multiplicative light preserves shadows; a white overlay washes them
 * out. Reuse the decoded frame during preparation, without another readback. */
export function paintRetroGoldBevel(
  context: CanvasContext,
  frame: CanvasImageSource,
  target: FaceRect = [0, 0, 1, 1],
) {
  // Bounds of the existing 1500×2100 asset, excluding its black keyline.
  const x = (160 / 1500) * 488,
    y = (1255 / 2100) * 680,
    right = (1346 / 1500) * 488,
    bottom = (1861 / 2100) * 680,
    insetX = (17 / 1500) * 488,
    insetY = (17 / 2100) * 680;
  const facet = (points: readonly (readonly [number, number])[]) => {
    context.moveTo(...points[0]!);
    for (const point of points.slice(1)) context.lineTo(...point);
    context.closePath();
  };
  context.save();
  if (target.some((v, i) => v !== [0, 0, 1, 1][i])) {
    context.translate(target[0] * 488, target[1] * 680);
    context.scale(target[2], target[3]);
  }
  const frameFilter = context.filter;
  context.filter = 'none';
  context.fillStyle = '#00000047';
  context.beginPath();
  facet([
    [x, y],
    [right, y],
    [right - insetX, y + insetY],
    [x + insetX, y + insetY],
  ]);
  facet([
    [right, y],
    [right, bottom],
    [right - insetX, bottom - insetY],
    [right - insetX, y + insetY],
  ]);
  context.fill();
  context.beginPath();
  facet([
    [x, y],
    [x + insetX, y + insetY],
    [x + insetX, bottom - insetY],
    [x, bottom],
  ]);
  facet([
    [x, bottom],
    [x + insetX, bottom - insetY],
    [right - insetX, bottom - insetY],
    [right, bottom],
  ]);
  context.clip();
  context.filter = `${frameFilter === 'none' ? '' : frameFilter + ' '}brightness(1.35)`;
  context.drawImage(frame, 0, 0, 488, 680);
  context.restore();
}
