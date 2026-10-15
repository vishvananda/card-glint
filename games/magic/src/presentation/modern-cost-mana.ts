import type { RenderedCardInput } from './face-layout.js';
import { printingManaDefaults } from './printing-mana-adjustment.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';

const M21 = {
  shadow: [-1.0372, 2.0372] as const,
  paper: [202, 197, 192] as const,
  ink: [13, 15, 15] as const,
};

/** Frozen M21 ordinary-frame fit; other frames and inline symbols stay independent. */
export function modernCostMana(face: RenderedCardInput) {
  return face.setCode?.toLowerCase() === 'm21' && printingManaDefaults(face) ? M21 : undefined;
}

export function modernCostNumeralAsset(face: RenderedCardInput, symbol: string): string | null {
  return modernCostMana(face) && /^\d$/.test(symbol)
    ? `${CONJURER_ROOT}/img/manaSymbols/${symbol}.svg`
    : null;
}
