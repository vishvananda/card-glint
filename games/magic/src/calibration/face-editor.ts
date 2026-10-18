import type { RenderedCardInput } from '../presentation/face-layout.js';
import type { SetCalibrationCandidate } from './editor-types.js';
import { earlyReprintFrame } from '../presentation/early-reprint-frame.js';
import { calibrationForFace } from './selection.js';

/** Return a detached input using the regular painter, with explicit scope guards. */
export function withSetCalibration(
  face: RenderedCardInput,
  candidate: SetCalibrationCandidate,
): RenderedCardInput {
  const result = { ...face, setCalibrationCandidate: candidate };
  calibrationForFace(result);
  if (!earlyReprintFrame(result)) throw Error('This printing has no set calibration adapter');
  return result;
}
