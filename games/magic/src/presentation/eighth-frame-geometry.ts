import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { cardStock } from './face-layout.js';
import { basicLandColor } from './plate-basic-land.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
import type { EighthFrameGeometry } from './eighth-printing-types.js';
export function eighthFrameGeometry(
  face: RenderedCardInput,
  source: string,
): EighthFrameGeometry | undefined {
  const p = eighthPrintingProfile(face);
  if (!p || !['#eeedeb', '#090806'].includes(cardStock(face.setCode, face.borderColor).border))
    return undefined;
  const prefix = p.root + '/',
    name = source.startsWith(prefix) ? source.slice(prefix.length) : '';
  if (!/^(?:[wubrgam]l?|l)[.]png$/.test(name)) return undefined;
  return basicLandColor(face) ? p.geometry.basic : p.geometry.ordinary;
}
const x = (v: number, g: EighthFrameGeometry) => 244 + (v - 244) * g.scaleX + g.dx;
const y = (v: number, g: EighthFrameGeometry) => 340 + (v - 340) * g.scaleY + g.dy;
export function eighthFrameRect(
  [left, top, width, height]: FaceRect,
  g: EighthFrameGeometry,
): FaceRect {
  return [x(left * 488, g) / 488, y(top * 680, g) / 680, width * g.scaleX, height * g.scaleY];
}
/** Inner rails and apertures share one source warp. Outer stock stays fixed.
 * Static Canvas composition only; no extra asset decoding or pixel readback. */
export function paintEighthFrame(
  c: CanvasContext,
  image: CanvasImageSource & { width: number; height: number },
  g: EighthFrameGeometry,
): void {
  c.save();
  c.beginPath();
  c.rect(0, 0, 488, 680);
  c.rect(22, 22, 444, 636);
  c.clip('evenodd');
  c.drawImage(image, 0, 0, 488, 680);
  c.restore();
  const sourceX = [22, 28, 460, 466],
    sourceY = [22, 28, 624, 658];
  const targetX = [22, x(28, g), x(460, g), 466],
    targetY = [22, y(28, g), y(624, g), 658];
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 3; col++) {
      const sx = sourceX[col]!,
        sy = sourceY[row]!,
        tx = targetX[col]!,
        ty = targetY[row]!;
      c.drawImage(
        image,
        (sx / 488) * image.width,
        (sy / 680) * image.height,
        ((sourceX[col + 1]! - sx) / 488) * image.width,
        ((sourceY[row + 1]! - sy) / 680) * image.height,
        tx,
        ty,
        targetX[col + 1]! - tx,
        targetY[row + 1]! - ty,
      );
    }
}
