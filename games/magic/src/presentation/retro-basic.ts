import type { RenderedCardInput, RulesParagraph } from './face-layout.js';

const basics: Readonly<Record<string, string>> = {
  Plains: 'W',
  Island: 'U',
  Swamp: 'B',
  Mountain: 'R',
  Forest: 'G',
};
/** Recognize only the unmodified basic-land reminder, respecting explicit paragraph overrides. */
export function simpleBasicMana(face: RenderedCardInput): string | null {
  if (!/\bBasic Land\b/.test(face.typeLine ?? '')) return null;
  const raw = face.rulesText ?? '';
  const match = /^\(?\{T\}: Add \{([WUBRG])\}\.\)?$/.exec(raw);
  if (!match || raw.startsWith('(') !== raw.endsWith(')')) return null;
  if (face.rulesParagraphs) {
    const p = face.rulesParagraphs;
    if (
      p.length !== 1 ||
      p[0]!.role !== 'rules' ||
      p[0]!.align ||
      p[0]!.runs.length !== 1 ||
      p[0]!.runs[0]!.text !== raw ||
      Boolean(p[0]!.runs[0]!.italic) !== raw.startsWith('(')
    )
      return null;
  }
  return match[1]!;
}

/** Printed vocabulary for the reviewed pre-large-symbol land style. Semantic
 * subtypes stay on the face so frame selection still uses the correct land plate.
 * Custom rules and explicit styled content remain host-owned.
 */
export function retroBasicPrinting(face: RenderedCardInput): {
  typeLine: string;
  paragraphs: readonly RulesParagraph[];
} | null {
  if (face.wordingMode === 'oracle') return null;
  if (!['mir', 'tmp'].includes(face.setCode?.toLowerCase() ?? '')) return null;
  const subtype = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    face.typeLine ?? '',
  )?.[1];
  if (!subtype) return null;
  const symbol = basics[subtype]!;
  if (simpleBasicMana(face) !== symbol) return null;
  return {
    typeLine: 'Land',
    paragraphs: [
      {
        role: 'rules',
        align: 'center',
        runs: [{ text: `{T}: Add {${symbol}} to your mana pool.` }],
      },
    ],
  };
}
