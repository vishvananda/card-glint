import type { RenderedCardInput } from '../presentation/face-layout.js';
import { setCalibrationProfile } from './profiles.js';
import { setTitleCalibration } from './title-profiles.js';
import { resolveSetTitleCalibration, resolveSetCalibrationCandidate } from './editor.js';

/** Candidate scope is printing identity, never a scan or host-global setting. */
export function calibrationForFace(face: RenderedCardInput) {
  const candidate = face.setCalibrationCandidate;
  if (!candidate) return setCalibrationProfile(face.setCode);
  if (candidate.set !== face.setCode?.toLowerCase())
    throw Error('Calibration candidate belongs to another set');
  if (setTitleCalibration(candidate.set)) {
    resolveSetTitleCalibration(candidate);
    return undefined;
  }
  return resolveSetCalibrationCandidate(candidate);
}
