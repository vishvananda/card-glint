/** Printed full-frame outline, independent of concentric paper-stripe order.
 * Reviewed against all nine Alpha duals; UR retains the Beta source treatment.
 * Keys are semantic WUBRG pairs, never the displayed original type wording. */
const OUTLINES: Readonly<Record<string, string>> = {
  WU: 'U',
  WB: 'W',
  WR: 'W',
  WG: 'W',
  UB: 'B',
  UR: 'R',
  UG: 'U',
  BR: 'B',
  BG: 'B',
  RG: 'G',
};

export function abuLandOutlineColor(colors: readonly string[]): string | undefined {
  const ordered = [...new Set(colors)].filter((c) => /^[WUBRG]$/.test(c));
  ordered.sort((a, b) => 'WUBRG'.indexOf(a) - 'WUBRG'.indexOf(b));
  return ordered.length === 1 ? ordered[0] : OUTLINES[ordered.join('')];
}
