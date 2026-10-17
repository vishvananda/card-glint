import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';

/** One shared inner-plate fit for ordinary and colorshifted PLC spells.
 * Scan-only normalization stays in comparison tools. The singleton land and
 * split frames are outside this measured cohort. */
export function usesPlanarFrameGeometry(face: RenderedCardInput, source: string): boolean {
  return (
    face.setCode?.toLowerCase() === 'plc' &&
    face.frameAssetFamily === 'eighth' &&
    !face.frameTemplate &&
    (!face.layout || face.layout === 'normal') &&
    (!face.borderColor || face.borderColor === 'black') &&
    source.startsWith(`${CONJURER_ROOT}/img/frames/8th/`) &&
    /^(?:[wubrgm]|colorshifted\/[wubrg])\.png$/.test(
      source.slice(`${CONJURER_ROOT}/img/frames/8th/`.length),
    )
  );
}

const x = (value: number) => 244 + (value - 244) * 1.006 - 0.5;
const y = (value: number) => 340 + (value - 340) * 1.008 + 0.25;

export function planarFrameRect([left, top, width, height]: FaceRect): FaceRect {
  return [x(left * 488) / 488, y(top * 680) / 680, width * 1.006, height * 1.008];
}

/** Separate badge-material fit. Border-only profiles exclude the P/T glyphs;
 * lettering keeps its independent calibration. Ordinary/colorshifted sources
 * were selected on 21 calibration scans and checked on 84 validation scans. */
export function planarBadgeRect(
  [left, top, width, height]: FaceRect,
  colorshifted: boolean,
): FaceRect {
  const [sx, dx, sy, dy] = colorshifted
    ? ([1.03, -0.5, 1.025, 2.5] as const)
    : ([1.005, 0.25, 1.005, 2.75] as const);
  return [
    (407 + (left * 488 - 407) * sx + dx) / 488,
    (626 + (top * 680 - 626) * sy + dy) / 680,
    width * sx,
    height * sy,
  ];
}

/** Static face preparation. The center keeps the reviewed inner-plate fit.
 * Colorshifted outer bands expand independently to the measured stock edge;
 * applying the same mapping to the stock mask preserves that texture. These
 * shared bounds use 15 calibration scans, with 29 held out. Separate badges,
 * lettering, symbols, art and paper apertures retain their existing geometry. */
export function paintPlanarFrame(
  c: CanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  colorshifted = false,
): void {
  const [left, top, right, bottom] = colorshifted
    ? ([21, 18.75, 467.5, 661] as const)
    : ([22, 22, 466, 658] as const);
  c.save();
  c.beginPath();
  c.rect(0, 0, 488, 680);
  c.rect(left, top, right - left, bottom - top);
  c.clip('evenodd');
  c.drawImage(image, 0, 0, 488, 680);
  c.restore();
  const sourceX = [22, 28, 460, 466],
    sourceY = [22, 28, 638, 658],
    targetX = [left, x(28), x(460), right],
    targetY = [top, y(28), y(638), bottom];
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
