import type { RenderedCardInput } from '../presentation/face-layout.js';
import type { SetCalibrationCandidate } from './editor-types.js';
import { earlyReprintFrame } from '../presentation/early-reprint-frame.js';
import { setTitleCalibration } from './title-profiles.js';
import { calibrationForFace } from './selection.js';

/** Return a detached input using the regular painter, with explicit scope guards. */
export function withSetCalibration(
  face: RenderedCardInput,
  candidate: SetCalibrationCandidate,
): RenderedCardInput {
  const result = { ...face, setCalibrationCandidate: candidate };
  calibrationForFace(result);
  const title =
    setTitleCalibration(face.setCode) &&
    face.frameStyle !== 'modern' &&
    !face.frameTemplate &&
    !face.frameAssetFamily &&
    (!face.borderColor || face.borderColor === 'black') &&
    (!face.layout || face.layout === 'normal') &&
    !/\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '');
  if (!title && !earlyReprintFrame(result))
    throw Error('This printing has no set calibration adapter');
  return result;
}
