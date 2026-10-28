import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { CalibratedFrame } from '../calibration/types.js';
import { calibratedFrameImageWindow } from '../calibration/frame-source.js';
import type { FaceRect } from './face-layout.js';
import { retroPx } from './retro-frame.js';

/** Static face painting only. No image mutation, decoding or pixel readback. */
export function paintRetroFramePlate(
  c: CanvasContext,
  image: ImageBitmap,
  target: FaceRect,
  calibrated?: CalibratedFrame,
) {
  if (calibrated?.artWindow && paintArtWindow(c, image, target, calibrated)) return;
  const aperture = calibrated && calibratedFrameImageWindow(calibrated);
  if (!aperture) {
    c.drawImage(image, ...retroPx(target));
    return;
  }
  c.save();
  c.beginPath();
  c.rect(...retroPx(target));
  c.rect(...retroPx(aperture));
  c.clip('evenodd');
  c.drawImage(image, ...retroPx(target));
  c.restore();
}

/** Move the art opening while retaining the original affine sampling below the
 * source anchor. No image mutation, decoding or pixel readback is required. */
function paintArtWindow(
  c: CanvasContext,
  image: ImageBitmap,
  target: FaceRect,
  calibrated: CalibratedFrame,
) {
  const spec = calibrated.artWindow;
  if (!spec) return false;
  const [sx, sy, sw, sh] = spec.source;
  const [fx, fy, fw, fh] = retroPx(target);
  const [ax, ay, aw, ah] = retroPx(calibrated.art);
  const anchor = spec.lowerAnchor;
  const bottom = fy + fh * anchor;
  if (
    ![sx, sy, sw, sh, anchor, fx, fy, fw, fh, ax, ay, aw, ah].every(Number.isFinite) ||
    sx <= 0 ||
    sy <= 0 ||
    sw <= 0 ||
    sh <= 0 ||
    sx + sw >= 1 ||
    sy + sh >= anchor ||
    anchor > 1 ||
    fw <= 0 ||
    fh <= 0 ||
    aw <= 0 ||
    ah <= 0 ||
    ax <= fx ||
    ay <= fy ||
    ax + aw >= fx + fw ||
    ay + ah >= bottom
  )
    throw Error('Invalid calibrated art-window geometry');
  const original = calibratedFrameImageWindow(calibrated) ?? [
    target[0] + sx * target[2],
    target[1] + sy * target[3],
    sw * target[2],
    sh * target[3],
  ];
  if (calibrated.art.every((v, i) => Math.abs(v - original[i]!) < 1e-12)) return false;
  const iw = image.width,
    ih = image.height;
  c.save();
  try {
    // Keep the ordinary whole-image transform below the anchor, including its
    // sampling phase. Rules, artist, copyright and stats backgrounds stay exact.
    c.beginPath();
    c.rect(fx, bottom, fw, fy + fh - bottom);
    c.clip();
    c.drawImage(image, fx, fy, fw, fh);
  } finally {
    c.restore();
  }
  c.drawImage(image, 0, 0, iw, sy * ih, fx, fy, fw, ay - fy);
  c.drawImage(image, 0, sy * ih, sx * iw, sh * ih, fx, ay, ax - fx, ah);
  c.drawImage(
    image,
    (sx + sw) * iw,
    sy * ih,
    (1 - sx - sw) * iw,
    sh * ih,
    ax + aw,
    ay,
    fx + fw - ax - aw,
    ah,
  );
  if (calibrated.family !== 'mse-old')
    c.drawImage(image, sx * iw, sy * ih, sw * iw, sh * ih, ax, ay, aw, ah);
  c.drawImage(
    image,
    0,
    (sy + sh) * ih,
    iw,
    (anchor - sy - sh) * ih,
    fx,
    ay + ah,
    fw,
    bottom - ay - ah,
  );
  return true;
}
