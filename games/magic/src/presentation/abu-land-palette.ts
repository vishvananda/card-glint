/** Printed full-frame outline, independent of concentric paper-stripe order.
 * Reviewed against all nine Alpha duals; Beta has independently reviewed WU/UR outline inks.
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

export function abuLandOutlineColor(
  colors: readonly string[],
  setCode?: string | null,
): string | undefined {
  const ordered = [...new Set(colors)].filter((c) => /^[WUBRG]$/.test(c));
  ordered.sort((a, b) => 'WUBRG'.indexOf(a) - 'WUBRG'.indexOf(b));
  const pair = ordered.join('');
  // These are printing-family inks, not Oracle color-order changes. Alpha WU
  // remains blue; Beta's scanned WU is white and UR is blue. Unlimited keeps
  // its existing policy until its independent frame audit is complete.
  if (setCode?.toLowerCase() === 'leb' && (pair === 'WU' || pair === 'UR'))
    return pair === 'WU' ? 'W' : 'U';
  return ordered.length === 1 ? ordered[0] : OUTLINES[pair];
}
