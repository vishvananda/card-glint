import manifest from '../../assets.json' with { type: 'json' };
import type { CalibratedFrame } from './types.js';
import type { FaceRect } from '../presentation/face-layout.js';

/** Source families are pinned by the pack; profiles never supply arbitrary URLs. */
export function calibratedFrameSource(frame: Pick<CalibratedFrame, 'family' | 'assetKey'>) {
  const { family, assetKey } = frame;
  switch (family) {
    case 'mse-old':
      return `${manifest.MSE_TEMPLATE_ROOT}/magic-old.mse-style/${assetKey}card.jpg`;
    case 'seventh':
      return `${manifest.RETRO_ROOT}/img/frames/seventh/regular/${assetKey}.png`;
    case 'abu':
    case 'fourth':
      return `${manifest.RETRO_ROOT}/img/frames/old/${family}/${assetKey}.png`;
  }
}

/** The opaque MSE JPEG expects its image field above the source. Our painter
 * inserts artwork first, so omit that exact field when painting the plate. */
export function calibratedFrameImageWindow(frame: CalibratedFrame): FaceRect | undefined {
  if (frame.family !== 'mse-old') return undefined;
  const [x, y, w, h] = frame.frame;
  return [x + (45 / 375) * w, y + (51 / 523) * h, (286 / 375) * w, (233 / 523) * h];
}
