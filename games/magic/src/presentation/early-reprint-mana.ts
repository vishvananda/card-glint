import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { REPRINT_MANA, REPRINT_MANA_INK, REPRINT_MANA_PAPER } from './early-reprint-mana-values.js';

/** Original glyphs can accompany either wording mode. Modern symbols and
 * unmeasured/custom frames retain their existing defaults. */
export function earlyReprintMana(face: RenderedCardInput): boolean {
  return (
    !!earlyReprintFrame(face) &&
    !/^Level up\b/m.test(face.rulesText ?? '') &&
    face.symbolStyle !== 'modern' &&
    !(face.symbolStyle === undefined && face.wordingMode === 'oracle')
  );
}
export function earlyReprintManaDefaults(face: RenderedCardInput) {
  return earlyReprintMana(face) ? REPRINT_MANA[face.setCode!.toLowerCase()] : undefined;
}
export function earlyReprintManaTarget(face: RenderedCardInput, symbol: string) {
  return earlyReprintMana(face)
    ? REPRINT_MANA_PAPER[`${face.setCode!.toLowerCase()}/${symbol === 'X' ? 'N' : symbol}`]
    : undefined;
}
export function earlyReprintManaInk(face: RenderedCardInput) {
  return face.calibration !== 'source' &&
    face.colorCalibration === 'set-hsb-v1' &&
    earlyReprintMana(face)
    ? REPRINT_MANA_INK[face.setCode!.toLowerCase()]
    : undefined;
}
