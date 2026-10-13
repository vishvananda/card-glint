/** Fallback disc colors are also the base of the original procedural sun. */
export const MANA_COLORS: Readonly<Record<string, string>> = {
  W: '#efe7cb',
  U: '#3d7ac3',
  B: '#33313c',
  R: '#c2432e',
  G: '#3b8a4e',
};
export const GENERIC_MANA_COLOR = '#9aa4ae';

/** Disc fills in the pinned renderer symbol SVGs. Keep separate from fallback
 * discs and the historical procedural sun; their source colors differ. */
export const BITMAP_MANA_COLORS: Readonly<Record<string, string>> = {
  W: '#f8f6d8',
  U: '#c1d7e9',
  B: '#cac5c0',
  R: '#e49977',
  G: '#a3c095',
  N: '#cac5c0',
};
