import type { RenderedCardInput } from '../presentation/face-layout.js';
import type { SetCalibrationProfile } from './types.js';
import { setCalibrationProfile } from './profiles.js';
import { setTitleCalibration } from './title-profiles.js';
import { resolveSetTitleCalibration, resolveSetCalibrationCandidate } from './editor.js';

/** Candidate scope is printing identity, never a scan or host-global setting. */
export function calibrationForFace(face: RenderedCardInput) {
  const candidate = face.setCalibrationCandidate;
  if (!candidate) return setCalibrationProfile(face.setCode) ?? inheritedFourthProfile(face);
  if (candidate.set !== face.setCode?.toLowerCase())
    throw Error('Calibration candidate belongs to another set');
  if (setTitleCalibration(candidate.set)) {
    resolveSetTitleCalibration(candidate);
    return undefined;
  }
  return resolveSetCalibrationCandidate(candidate);
}

/** Only the measured early-family donor is enabled here. Later old frames keep
 * their existing sources until Mirage/Onslaught have independent profiles. */
export function usesFourthDefaults(face: RenderedCardInput): boolean {
  return (
    face.setCode?.toLowerCase() === 'ice' &&
    face.calibration !== 'printing' &&
    !face.frameTemplate &&
    !face.frameAssetFamily &&
    face.frameStyle !== 'modern' &&
    (!face.layout || face.layout === 'normal') &&
    (!face.borderColor || face.borderColor === 'black') &&
    (face.frameColors ?? face.colors ?? []).length <= 1 &&
    !/\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  );
}
const fourthDefaults = new WeakMap<SetCalibrationProfile, SetCalibrationProfile>();
function inheritedFourthProfile(face: RenderedCardInput) {
  if (!usesFourthDefaults(face)) return undefined;
  const donor = setCalibrationProfile('4ed');
  if (!donor) return undefined;
  let profile = fourthDefaults.get(donor);
  if (!profile) {
    // The target's black surround must never inherit Fourth's white stock.
    // Reuse immutable geometry/pigment tables rather than shipping a second copy.
    profile = {
      ...donor,
      set: 'ice',
      border: 'black',
      colors: Object.fromEntries(
        Object.entries(donor.colors).map(([key, color]) => [
          key,
          color ? { ...color, stock: '#080808' } : color,
        ]),
      ),
    };
    fourthDefaults.set(donor, profile);
  }
  return profile;
}
