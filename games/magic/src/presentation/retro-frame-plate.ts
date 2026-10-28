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
