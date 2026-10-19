import type { RenderedCardInput, RulesParagraph } from './face-layout.js';

// Alpha and Beta scans share these small-face layouts and line breaks despite
// shorter text. The scan hashes and review are in lea/text-size-review.json.
// Match original content too: Oracle wording and renamed/custom cards do not
// inherit a printing exception merely because a title happens to match.
const smallOriginals: Readonly<Record<string, string>> = {
  'Mana Vault':
    "Tap to add 3 colorless mana to your mana pool. Mana Vault doesn't untap normally during untap phase; to untap it, you must pay 4 mana. If Mana Vault remains tapped during upkeep it does 1 damage to you. Tapping this artifact can be played as an interrupt.",
  'Hypnotic Specter':
    'Flying An opponent damaged by Specter must discard a card at random from his or her hand. Ignore this effect if opponent has no cards left in hand. "...There was no trace/ Of aught on that illumined face..." —Samuel Coleridge, "Phantom"',
};
const canonical = (text: string) =>
  text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
export function reviewedSmallOriginal(
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
): boolean {
  if (face.wordingMode === 'oracle' || !['lea', 'leb'].includes(face.setCode?.toLowerCase() ?? ''))
    return false;
  const expected = smallOriginals[face.name];
  return Boolean(
    expected &&
      canonical(paragraphs.flatMap((p) => p.runs.map((r) => r.text)).join(' ')) ===
        canonical(expected),
  );
}

/** Filled lettering and shared physical placement; canonical card pixels. */
const placement = {
  type: { fontSize: 22.2, dx: -2, dy: -1 },
  artistBaseline: 630.25,
  statsDx: 1,
  headingInk: '#828282',
} as const;
export function alphaTypography(setCode?: string | null) {
  const set = setCode?.toLowerCase();
  return set === 'lea'
    ? { ...placement, artistInk: '#737373', statsInk: '#787878' }
    : set === 'leb'
      ? { ...placement, artistInk: '#828282', statsInk: '#737373' }
      : undefined;
}
