/** Printing treatments belong to the set, independently of Oracle wording.
 * Before Exodus every rarity used black ink. Source:
 * https://magic.wizards.com/en/news/feature/anatomy-magic-card-2006-10-21 */
const monochromeSets = new Set(
  'arn atq leg drk fem ice hml all chr mir vis wth tmp sth por'.split(' '),
);
const noSymbolSets = new Set('lea leb 2ed 3ed 4ed 5ed ced cei sum itp'.split(' '));

export function usesMonochromeSetSymbol(setCode?: string | null): boolean {
  return monochromeSets.has(setCode?.trim().toLowerCase() ?? '');
}

/** Early symbols have black outside contours; their internal white details are
 * distinct from the later white outer rim. Confirmed on dark/green/artifact scans. */
export function historicalSetOutline(setCode?: string | null): number {
  return ['arn', 'atq', 'leg', 'drk', 'chr'].includes(setCode?.toLowerCase() ?? '') ? 0 : 1;
}

export function hasNoPrintedSetSymbol(setCode?: string | null): boolean {
  return noSymbolSets.has(setCode?.trim().toLowerCase() ?? '');
}
