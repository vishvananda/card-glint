import type { RenderedCardInput } from './face-layout.js';
import type { FrameColor } from './profile.js';

/** Physical land colors survive historical labels that omit their subtypes. */
export function landSubtypePalette(type: string): FrameColor[] | undefined {
  if (!/\bLand\b/.test(type)) return undefined;
  const colors = (['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'] as const).flatMap(
    (name, i) => (new RegExp(`\\b${name}\\b`).test(type) ? ['WUBRG'[i] as FrameColor] : []),
  );
  return colors.length >= 1 && colors.length <= 2 ? colors : undefined;
}

/** Keep semantic color separate from the printed land palette, before wording
 * can remove the basic land subtypes. Ambiguous rainbow/fetch lands stay native. */
export function providerLandPalette(
  type: string,
  colors: readonly FrameColor[],
  set: string | null | undefined,
  frame: string,
  produced: unknown,
): FrameColor[] | undefined {
  if (!/\bLand\b/.test(type) || colors.length) return undefined;
  const basics = landSubtypePalette(type);
  if (
    basics ||
    /\b(Plains|Island|Swamp|Mountain|Forest)\b/.test(type) ||
    ['lea', 'leb', '2ed', '3ed'].includes(set?.toLowerCase() ?? '')
  )
    return basics;
  if (!['2003', '2015', 'future'].includes(frame) || /\bArtifact\b/.test(type)) return undefined;
  if (produced === undefined || produced === null) return undefined;
  if (
    !Array.isArray(produced) ||
    !produced.every((c) => typeof c === 'string' && /^[WUBRGC]$/.test(c))
  )
    throw Error('Invalid produced mana.');
  const palette = [...'WUBRG'].filter((c) => produced.includes(c)) as FrameColor[];
  // The complete Eighth scan census confirms its rainbow land uses the gold
  // plate. Keep unreviewed printing eras on the conservative two-color policy.
  const maximum = set?.toLowerCase() === '8ed' && frame === '2003' ? 5 : 2;
  return palette.length >= 1 && palette.length <= maximum ? palette : undefined;
}

/** MTGJSON has no produced_mana field. Accept only a literal tap-for-mana
 * sentence; color identity would incorrectly recolor fetches and utility lands. */
export function mtgjsonProducedMana(text: string): string[] | undefined {
  const literal = text.split('\n').flatMap((line) => {
    const match = /^\(?\{T\}: Add (\{[WUBRGC]\}(?:,? (?:or )?\{[WUBRGC]\})*)\.\)?$/.exec(line);
    return match ? [...match[1]!.matchAll(/\{([WUBRGC])\}/g)].map((m) => m[1]!) : [];
  });
  return literal.length ? [...new Set(literal)] : undefined;
}

/** The 2003 era also includes dedicated planeswalker and leveler layouts. */
export function providerFrameAppearance(
  appearance: Partial<RenderedCardInput>,
  type: string,
  rules: string,
): Partial<RenderedCardInput> {
  return /\b(Saga|Class|Planeswalker|Battle)\b/.test(type) || /^Level up\b/m.test(rules)
    ? { ...appearance, frameAssetFamily: undefined }
    : appearance;
}
