import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { basicLandColor } from './plate-basic-land.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';

/** One measured inner-frame transform for ordinary Eighth basic lands. The
 * printing's outer stock stays fixed; scan registration never enters painting.
 * Ten calibration and nine reserved nonfoil printings, all five colors. */
export function usesEighthBasicGeometry(face: RenderedCardInput, source: string): boolean {
  const color = basicLandColor(face)?.toLowerCase();
  return (
    face.setCode?.toLowerCase() === '8ed' &&
    face.frameAssetFamily === 'eighth' &&
    !face.frameTemplate &&
    (!face.layout || face.layout === 'normal') &&
    (!face.borderColor || face.borderColor === 'white') &&
    (face.frameColors === undefined ||
      (face.frameColors.length === 1 && face.frameColors[0]?.toLowerCase() === color)) &&
    !!color &&
    source === `${CONJURER_ROOT}/img/frames/8th/${color}l.png`
  );
}

const x = (value: number) => 244 + (value - 244) * 1.004 - 1.25;
const y = (value: number) => 340 + (value - 340) * 1.005 - 0.5;

export function eighthBasicRect([left, top, width, height]: FaceRect): FaceRect {
  return [x(left * 488) / 488, y(top * 680) / 680, width * 1.004, height * 1.005];
}

/** Stretch the inner plate and its adjacent brown texture continuously. Fixed
 * outer bands retain the existing border and corners.
 * This runs only when preparing a static face; it adds no readback or decoding. */
export function paintEighthBasicFrame(
  c: CanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
) {
  c.save();
  c.beginPath();
  c.rect(0, 0, 488, 680);
  c.rect(22, 22, 444, 636);
  c.clip('evenodd');
  c.drawImage(image, 0, 0, 488, 680);
  c.restore();
  const sourceX = [22, 28, 460, 466];
  const sourceY = [22, 28, 624, 658];
  const targetX = [22, x(28), x(460), 466];
  const targetY = [22, y(28), y(624), 658];
  for (let row = 0; row < sourceY.length - 1; row++)
    for (let column = 0; column < sourceX.length - 1; column++) {
      const sx = sourceX[column]!,
        sy = sourceY[row]!,
        tx = targetX[column]!,
        ty = targetY[row]!;
      c.drawImage(
        image,
        (sx / 488) * image.width,
        (sy / 680) * image.height,
        ((sourceX[column + 1]! - sx) / 488) * image.width,
        ((sourceY[row + 1]! - sy) / 680) * image.height,
        tx,
        ty,
        targetX[column + 1]! - tx,
        targetY[row + 1]! - ty,
      );
    }
}
