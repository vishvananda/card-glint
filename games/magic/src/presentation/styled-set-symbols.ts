import manifest from '../../assets.json' with { type: 'json' };
import inventory from '../../set-symbol-inventory.json' with { type: 'json' };
import { usesMonochromeSetSymbol } from './historical-set-symbol.js';
import type { RenderedCardInput } from './face-layout.js';

export const CONJURER_ROOT = manifest.CONJURER_ROOT;
const ROOT = `${CONJURER_ROOT}/img/setSymbols/official/`;
const codes: Readonly<Record<string, string>> = inventory.codes;
const rarities: Readonly<Record<string, string>> = {
  common: 'c',
  uncommon: 'u',
  rare: 'r',
  mythic: 'm',
  special: 's',
  bonus: 's',
};

export function styledSetSymbol(
  code: string,
  rarity = 'common',
  source: RenderedCardInput['setSymbolSource'] = 'auto',
): string | null {
  const key = code.trim().toLowerCase();
  if (source === 'keyrune') return null;
  const suffix = usesMonochromeSetSymbol(key) ? 'c' : rarities[rarity];
  // Missing rarities fall back to Keyrune, never a different rarity's artwork.
  return suffix && Object.hasOwn(codes, key) && codes[key]!.includes(suffix)
    ? `${ROOT}${key}-${suffix}.svg`
    : null;
}

export function isStyledSetSymbol(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith(ROOT));
}
