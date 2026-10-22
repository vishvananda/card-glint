import { modernOrdinaryPlates } from './modern-printing-profile.js';
import type { RenderedCardInput } from './face-layout.js';
import { isRetro } from './retro-frame.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';

const MODERN = {
  shadow: [-1.0372, 2.0372] as const,
  paper: [202, 197, 192] as const,
  ink: [13, 15, 15] as const,
};

/** The component frame owns this default, independently of the printing set.
 * Replacement plates and special layouts retain their own cost geometry. */
export function usesModernCostMana(face: RenderedCardInput): boolean {
  return (
    !isRetro(face) &&
    (face.frameAssetFamily === undefined || Boolean(modernOrdinaryPlates(face))) &&
    face.frameTemplate === undefined &&
    (face.layout ?? 'normal') === 'normal' &&
    !/\b(Saga|Class|Planeswalker|Battle)\b/i.test(face.canonicalTypeLine ?? face.typeLine ?? '') &&
    !/^Level up\b/m.test(face.rulesText ?? '')
  );
}

export function modernCostMana(face: RenderedCardInput) {
  return usesModernCostMana(face) ? MODERN : undefined;
}

export function modernCostNumeralAsset(face: RenderedCardInput, symbol: string): string | null {
  return modernCostMana(face) && /^\d$/.test(symbol)
    ? `${CONJURER_ROOT}/img/manaSymbols/${symbol}.svg`
    : null;
}
