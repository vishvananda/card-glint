import type { RenderedCardInput } from './face-layout.js';
import { printingManaDefaults } from './printing-mana-adjustment.js';
import { MODERN_MANA_SETS } from './printing-mana-profiles.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';

const MODERN = {
  shadow: [-1.0372, 2.0372] as const,
  paper: [202, 197, 192] as const,
  ink: [13, 15, 15] as const,
};

/** Shared ordinary-frame fit admitted by independent set transfer checks. */
export function modernCostMana(face: RenderedCardInput) {
  return MODERN_MANA_SETS.includes(face.setCode?.toLowerCase() ?? '') && printingManaDefaults(face)
    ? MODERN
    : undefined;
}

export function modernCostNumeralAsset(face: RenderedCardInput, symbol: string): string | null {
  return modernCostMana(face) && /^\d$/.test(symbol)
    ? `${CONJURER_ROOT}/img/manaSymbols/${symbol}.svg`
    : null;
}
