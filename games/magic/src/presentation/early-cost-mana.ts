import { calibrationForFace } from '../calibration/selection.js';
import { inheritedOldFrameDefault } from '../calibration/old-frame-defaults.js';
import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { earlyReprintMana } from './early-reprint-mana.js';

/** Measured generic cost paper is independent of inline and colored symbols.
 * Donor sets retain their existing paper until that transfer is reviewed. */
export function earlyCostGenericPaper(face: RenderedCardInput) {
  if (
    !earlyReprintMana(face) ||
    inheritedOldFrameDefault(face) ||
    face.calibration === 'source' ||
    !(face.calibration === 'auto' || face.colorCalibration === 'set-hsb-v1')
  )
    return undefined;
  const material = earlyReprintFrame(face)?.material;
  return material ? calibrationForFace(face)?.mana.costGenericPaper?.[material] : undefined;
}
