import { reviewDetails } from './review.js';
import type { CardWording } from '../presentation/wording.js';
import type { RulesParagraph } from '../presentation/face-layout.js';
import { printingCorrections, printingCorrectionRevision } from './corrections.js';
import type {
  PrintingText,
  PrintingWordingProvenance,
  ResolvedPrintingWording,
  ReviewedWordingField,
} from './types.js';

function paragraphs(text: string, role: 'rules' | 'flavor'): RulesParagraph[] {
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => ({
      role,
      runs:
        role === 'rules'
          ? line
              .split(/(\([^)]*\))/g)
              .filter(Boolean)
              .map((text) => ({ text, italic: text.startsWith('(') }))
          : line
              .split('*')
              .map((text, i) => ({ text, italic: i % 2 === 0 }))
              .filter((run) => run.text),
    }));
}
function assemble(input: PrintingText): CardWording {
  const { flavorText, ...wording } = structuredClone(input);
  const runs = wording.rulesParagraphs ?? [
    ...paragraphs(input.rulesText, 'rules'),
    ...paragraphs(flavorText ?? '', 'flavor'),
  ];
  return {
    ...wording,
    rulesText: runs.map((p) => p.runs.map((r) => r.text).join('')).join('\n'),
    rulesParagraphs: runs,
  };
}

/** Resolve reviewed ORIGINAL wording for an exact Scryfall printing ID.
 * Provider rules and flavor are separate inputs. No fetches, scan processing,
 * name/set inference or Oracle edits occur. Missing original data stays missing.
 * For multi-face printings supply the exact printed face name explicitly. */
export function resolvePrintingWording(
  printingId: string,
  input: { oracle: PrintingText; original?: PrintingText },
  options: { faceName?: string; referenceSha256?: string } = {},
): ResolvedPrintingWording {
  return resolveWithCorrections(printingCorrections, printingId, input, options);
}
/** Internal pure implementation shared by eager and exact-set entry points. */
export function resolveWithCorrections(
  catalog: typeof printingCorrections,
  printingId: string,
  input: { oracle: PrintingText; original?: PrintingText },
  options: { faceName?: string; referenceSha256?: string } = {},
): ResolvedPrintingWording {
  if (!printingId.trim()) throw Error('Printing ID must not be empty');
  for (const value of [input.oracle, input.original])
    if (value && (typeof value.typeLine !== 'string' || typeof value.rulesText !== 'string'))
      throw Error('Printing wording requires a type line and rules text');
  const provenance: PrintingWordingProvenance = {
    printingId,
    catalogRevision: printingCorrectionRevision,
    status: 'unreviewed',
    identity: options.referenceSha256 ? 'printing-id-and-scan' : 'printing-id',
    corrections: [],
  };
  const result: ResolvedPrintingWording = {
    wordings: {
      oracle: assemble(input.oracle),
      ...(input.original ? { original: assemble(input.original) } : {}),
    },
    provenance,
  };
  const reviews = Object.hasOwn(catalog, printingId) ? catalog[printingId] : undefined;
  if (!reviews) return result;
  if (reviews.some((r) => r.faceName) && !options.faceName) {
    provenance.status = 'face-required';
    return result;
  }
  const selected = reviews.filter((r) => !r.faceName || r.faceName === options.faceName);
  if (!selected.length) {
    provenance.status = 'face-not-found';
    return result;
  }
  if (
    options.referenceSha256 &&
    selected.some((r) => r.referenceSha256 !== options.referenceSha256)
  ) {
    provenance.status = 'reference-mismatch';
    return result;
  }
  if (!input.original) {
    provenance.status = 'missing-original';
    return result;
  }
  let original = structuredClone(input.original);
  for (const review of selected) {
    const fields = Object.keys(review.fields) as ReviewedWordingField[],
      before = Object.fromEntries(fields.map((field) => [field, structuredClone(original[field])])),
      after = structuredClone(review.fields);
    if (review.paragraphScope === 'rules-only' && after.rulesParagraphs) {
      const flavor =
        original.rulesParagraphs?.filter((p) => p.role === 'flavor') ??
        paragraphs(original.flavorText ?? '', 'flavor');
      after.rulesParagraphs = [...after.rulesParagraphs, ...flavor];
    }
    // Rebuild only the changed role; a flavor correction must not erase rich
    // rules runs, and stale structured runs must not defeat corrected wording.
    if (
      !after.rulesParagraphs &&
      original.rulesParagraphs &&
      (after.rulesText !== undefined || after.flavorText !== undefined)
    ) {
      const rules =
        after.rulesText === undefined
          ? original.rulesParagraphs.filter((p) => p.role !== 'flavor')
          : paragraphs(after.rulesText, 'rules');
      const flavor =
        after.flavorText === undefined
          ? original.rulesParagraphs.filter((p) => p.role === 'flavor')
          : paragraphs(after.flavorText, 'flavor');
      original.rulesParagraphs = [...rules, ...flavor];
    }
    original = { ...original, ...after };
    provenance.corrections.push({
      ...(review.faceName ? { faceName: review.faceName } : {}),
      ...(review.paragraphScope ? { paragraphScope: review.paragraphScope } : {}),
      ...reviewDetails(review),
      fields,
      before,
      after,
    });
  }
  result.wordings.original = assemble(original);
  provenance.status = 'applied';
  return result;
}
