// Reviewed Scryfall icon identities. See fixtures/assets/recent-set-symbols.json.
// Never guess promo prefixes or copy calibration from an aliased set.
const aliases: Readonly<Record<string, string>> = {
  aa1: 'mtga',
  aa2: 'mtga',
  aa3: 'mtga',
  aa4: 'mtga',
  ea3: 'mtga',
  h2r: 'mh2',
  ha7: 'ha1',
  p23: 'archie',
  pa1: 'mtga',
  pbig: 'big',
  pblb: 'blb',
  pdft: 'dft',
  pdsk: 'dsk',
  pecl: 'ecl',
  peoe: 'eoe',
  pfdn: 'fdn',
  pfin: 'fin',
  pfra: 'fra',
  plci: 'lci',
  pltr: 'ltr',
  pmat: 'mat',
  pmh3: 'mh3',
  pmkm: 'mkm',
  pmom: 'mom',
  pone: 'one',
  potj: 'otj',
  psos: 'sos',
  pspm: 'spm',
  ptdm: 'tdm',
  ptla: 'tla',
  ptsr: 'tsr',
  pwoe: 'woe',
  rfin: 'fin',
  yblb: 'y25',
  ydft: 'y25',
  ydsk: 'y25',
  yecl: 'y26',
  yeoe: 'y25',
  yfra: 'y26',
  ylci: 'y24',
  ymkm: 'y24',
  yone: 'y23',
  yotj: 'y24',
  ysos: 'y26',
  ytdm: 'y25',
  ywoe: 'y24',
};

export function recentSetSymbolCode(code: string): string {
  const key = code.trim().toLowerCase();
  return Object.hasOwn(aliases, key) ? aliases[key]! : key;
}

/** Explicit monochrome fallback, used only when the styled collection lacks a set. */
export function recentSetSymbolVector(code: string): string | null {
  return code === 'slz' ? 'https://svgs.scryfall.io/sets/slz.svg?1794200400' : null;
}
