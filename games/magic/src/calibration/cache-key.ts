import type { RenderedCardInput } from '../presentation/face-layout.js';
import { retroDualFrame } from '../presentation/retro-dual-frame.js';
import { calibrationForFace } from './selection.js';
import { setTitleCalibration } from './title-profiles.js';

/** Source revisions are scoped; unrelated packs/sets keep their existing keys. */
export function setCalibrationTextureKey(face: RenderedCardInput) {
  const profile = calibrationForFace(face)?.revision ?? null;
  const title = setTitleCalibration(face.setCode)?.revision;
  const dual = retroDualFrame(face);
  return title || dual
    ? [
        'legacy-regional-v1',
        profile,
        title ?? null,
        dual ? 'abu-outline-v3' : null,
        face.setCalibrationCandidate ?? null,
      ]
    : ['set-profile-v1', profile, face.setCalibrationCandidate ?? null];
}
