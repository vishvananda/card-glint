import { calibrationForFace } from '../calibration/selection.js';
import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { earlyReprintMana } from './early-reprint-mana.js';
import type { EarlyManaNumeral } from './early-expansion-mana.js';

/** Rules-only printing pigment; original glyph policy and header remain separate. */
export function earlyInlineManaNumeral(face: RenderedCardInput): EarlyManaNumeral | undefined {
  if (
    !earlyReprintMana(face) ||
    face.calibration === 'source' ||
    !(face.calibration === 'auto' || face.colorCalibration === 'set-hsb-v1')
  )
    return undefined;
  const material = earlyReprintFrame(face)?.material;
  const tone = material && calibrationForFace(face)?.mana.inlineGeneric?.[material];
  if (!tone) return undefined;
  return {
    fill: 'rgba(' + [...tone.paper.map((v) => Math.round(v * 255)), tone.alpha].join(',') + ')',
  };
}
