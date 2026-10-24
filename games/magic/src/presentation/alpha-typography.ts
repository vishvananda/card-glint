import { wordingParagraphs } from './wording.js';
import type { RenderedCardInput, RulesParagraph } from './face-layout.js';

// Alpha, Beta and Unlimited scans share these small-face layouts despite
// shorter text. Scan reviews are in lea/text-size-review.json and the ABU audit.
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
  if (
    face.wordingMode === 'oracle' ||
    !['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '')
  )
    return false;
  const expected = smallOriginals[face.name];
  return Boolean(
    expected &&
      canonical(paragraphs.flatMap((p) => p.runs.map((r) => r.text)).join(' ')) ===
        canonical(expected),
  );
}

const originalAbu = (face: RenderedCardInput) =>
  face.wordingMode !== 'oracle' &&
  ['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '');
const characters = (paragraphs: readonly RulesParagraph[]) =>
  paragraphs.reduce((n, p) => n + p.runs.reduce((sum, r) => sum + r.text.length, 0), 0);

/** The same exact printed passage uses seven small-face rows in all three sets.
 * Keep this review separate from the general line-preservation budget. */
export function reviewedSmallRowMinimum(
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
): number {
  return originalAbu(face) &&
    face.name === 'Word of Command' &&
    canonical(paragraphs.flatMap((p) => p.runs.map((r) => r.text)).join(' ')) === WORD_PASSAGE
    ? 7
    : 0;
}
const WORD_PASSAGE =
  "You may look at opponent's hand and choose any card opponent can legally play using mana from his or her mana pool or lands. Opponent must play this card immediately; you make all the decisions it calls for. This spell may not be countered after you have looked at opponent's hand.";

/** Short keyword-led passages keep the large left-aligned early printing class. */
export function earlyKeywordBlock(
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
  count = characters(paragraphs),
): boolean {
  return (
    originalAbu(face) &&
    count <= 117 &&
    paragraphs.length === 2 &&
    paragraphs.every((p) => p.role === 'rules' && (p.align === undefined || p.align === 'left')) &&
    paragraphs[0]!.runs.map((r) => r.text).join('').length <= 15
  );
}

/** Only this original-printing body cohort needs new face pixels. */
export function earlyTextFlowRevision(face: RenderedCardInput): string | undefined {
  if (
    !originalAbu(face) ||
    face.frameTemplate ||
    face.frameStyle === 'modern' ||
    (face.layout && !['normal', 'token'].includes(face.layout)) ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  const visible = wordingParagraphs({
    rulesText: face.rulesText ?? '',
    rulesParagraphs: face.rulesParagraphs,
  });
  const reference =
    face.rulesAlignment?.mode === 'auto' ? (face.rulesAlignment.reference ?? visible) : visible;
  const count = characters(reference);
  return count > 274 ||
    reviewedSmallOriginal(face, reference) ||
    reviewedOriginalTextLayout(face, reference).centeredDy === 0 ||
    earlyKeywordBlock(face, visible, count)
    ? 'abu-original-flow-v1'
    : undefined;
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

/** Content-matched original typesetting reviews. These are shared by Alpha and
 * Beta when the printed passage agrees; Oracle text never inherits them. */
export function reviewedOriginalTextLayout(
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
) {
  const set = face.setCode?.toLowerCase();
  if (face.wordingMode === 'oracle' || !['lea', 'leb'].includes(set ?? '')) return {};
  const text = canonical(paragraphs.flatMap((p) => p.runs.map((r) => r.text)).join(' '));
  if (
    (face.name === 'Lifetap' &&
      text === "You gain 1 life each time any forest of opponent's becomes tapped.") ||
    (face.name === 'Gauntlet of Might' &&
      text ===
        'All red creatures gain +1/+1 and all mountains provide an extra red mana when tapped.')
  )
    return { centeredWidth: 390, centeredDx: -6.5 };
  if (face.name === 'Howl from Beyond' && text === 'Target creature gains +X/+0 until end of turn.')
    return { centeredDx: -6.5, centeredDy: 0 };
  if (
    set === 'lea' &&
    face.name === 'Twiddle' &&
    text === 'Caster may tap or untap any one land, creature, or artifact in play.'
  )
    return { centeredDx: -6.5, centeredDy: -16 };
  if (
    face.name === 'Black Vise' &&
    text ===
      'If opponent has more than four cards in hand during upkeep, black vise does 1 damage to opponent for each card in excess of four.'
  )
    return { shortRegularDy: -16 };
  if (
    set === 'leb' &&
    face.name === 'Birds of Paradise' &&
    text ===
      'Flying Tap to add one mana of any color to your mana pool. This tap may be played as an interrupt.'
  )
    return { centeredWidth: 374, regularDx: 10, regularDy: 12 };
  return {};
}
