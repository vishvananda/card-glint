import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { calibrationForFace } from '../calibration/selection.js';
import { arabianManaVariant } from './early-expansion-mana.js';

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
  if (!earlyReprintMana(face)) return undefined;
  const mana = calibrationForFace(face)!.mana,
    variant = arabianManaVariant(face);
  const extra = variant ? mana.variants?.[variant]?.geometry : undefined;
  return extra ? { ...mana.geometry, ...extra } : mana.geometry;
}
export function earlyReprintManaTarget(face: RenderedCardInput, symbol: string) {
  if (!earlyReprintMana(face)) return undefined;
  const mana = calibrationForFace(face)!.mana,
    variant = arabianManaVariant(face);
  const key = symbol === 'X' ? 'N' : symbol;
  return (variant ? mana.variants?.[variant]?.paper?.[key] : undefined) ?? mana.paper[key];
}
export function earlyReprintManaInk(face: RenderedCardInput) {
  return face.calibration !== 'source' &&
    face.colorCalibration === 'set-hsb-v1' &&
    earlyReprintMana(face)
    ? calibrationForFace(face)!.mana.ink
    : undefined;
}
