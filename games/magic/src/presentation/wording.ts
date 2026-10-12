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

/** Hosts own printing data/provenance. The pack selects its visible text and
 * symbol era, retaining the same physical frame, art and typography. */
export function withCardWording(
  face: RenderedCardInput,
  wordings: { oracle: CardWording; original?: CardWording },
  mode: 'oracle' | 'original' = 'oracle',
): RenderedCardInput {
  const selected = wordings[mode];
  if (!selected) throw Error(`Missing ${mode} printing wording`);
  if (typeof selected.typeLine !== 'string' || typeof selected.rulesText !== 'string')
    throw Error('Wording requires a type line and rules text');
  const profile = resolveCardProfile({ ...face, typeLine: wordings.oracle.typeLine });
  return {
    ...face,
    ...selected,
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: selected.rulesParagraphs,
    artifact: face.artifact ?? profile.artifact,
    land: face.land ?? profile.land,
    creature: face.creature ?? profile.creature,
    legendary: face.legendary ?? profile.legendary,
    wordingMode: mode,
  };
}
