/** Rarity color for external monochrome Keyrune glyphs; local vectors already have ink. */
export function setSymbolFilter(code?: string | null, rarity?: string): string {
  if (!code || ['forge', 'glint'].includes(code.toLowerCase())) return 'none';
  return (
    (
      {
        uncommon: 'brightness(0) invert(.65)',
        rare: 'brightness(0) invert(.62) sepia(.8) saturate(2) hue-rotate(5deg)',
        mythic: 'brightness(0) invert(.48) sepia(1) saturate(4) hue-rotate(340deg)',
        special: 'brightness(0) invert(.45) sepia(.5) saturate(2) hue-rotate(220deg)',
        bonus: 'brightness(0) invert(.6) sepia(.8) saturate(2)',
      } as Record<string, string>
    )[rarity ?? 'common'] ?? 'none'
  );
}
