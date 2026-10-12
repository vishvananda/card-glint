import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { resolveCardProfile } from './profile.js';

/** Exact supplied wording, never a guessed conversion of creature subtypes. */
export interface CardWording {
  typeLine: string;
  rulesText: string;
  rulesParagraphs?: readonly RulesParagraph[];
  manaSymbols?: string[];
  power?: string | number | null;
  toughness?: string | number | null;
}

export type WordingAlignment = 'left' | 'original' | 'oracle';

export function wordingParagraphs(wording: Pick<CardWording, 'rulesText' | 'rulesParagraphs'>) {
  return (
    wording.rulesParagraphs ??
    wording.rulesText
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }))
  );
}

/** Hosts own printing data/provenance. The pack selects its visible text and
 * symbol era, retaining the same physical frame, art and typography. */
export function withCardWording(
  face: RenderedCardInput,
  wordings: { oracle: CardWording; original?: CardWording },
  mode: 'oracle' | 'original' = 'oracle',
  options: { rulesAlignment?: WordingAlignment } = {},
): RenderedCardInput {
  const selected = wordings[mode];
  if (!selected) throw Error(`Missing ${mode} printing wording`);
  if (typeof selected.typeLine !== 'string' || typeof selected.rulesText !== 'string')
    throw Error('Wording requires a type line and rules text');
  const alignment = options.rulesAlignment ?? mode;
  const reference = alignment === 'left' ? undefined : wordings[alignment];
  if (alignment !== 'left' && !reference) throw Error(`Missing ${alignment} alignment wording`);
  const profile = resolveCardProfile({ ...face, typeLine: wordings.oracle.typeLine });
  return {
    ...face,
    ...selected,
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: selected.rulesParagraphs,
    rulesAlignment: reference
      ? { mode: 'auto', reference: wordingParagraphs(reference) }
      : { mode: 'left' },
    artifact: face.artifact ?? profile.artifact,
    land: face.land ?? profile.land,
    creature: face.creature ?? profile.creature,
    legendary: face.legendary ?? profile.legendary,
    wordingMode: mode,
  };
}
