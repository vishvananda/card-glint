import { presentation } from './adapter.mjs';

/** Calibration inputs must prove which body they render. wordingMode is a
 * presentation preference, not evidence that original text was supplied. */
export function calibrationPresentation(entry, annotations = {}, printingText = {}) {
  const result = presentation(entry, annotations, printingText);
  const original = printingText[entry.card.id];
  const reviewed = result.annotation.reviewed === true;
  if (reviewed && !entry.reference?.sha256)
    throw Error(`Original rules review lacks a scan identity for ${entry.card.name}.`);
  const expected = reviewed
    ? result.annotation.rulesText
    : (original?.originalText ?? entry.card.printed_text);
  if (typeof expected !== 'string')
    throw Error(`Original rules unavailable for ${entry.card.name}; exclude text calibration.`);
  const rendered = result.face.rulesParagraphs
    .filter((p) => p.role === 'rules')
    .map((p) => p.runs.map((r) => r.text).join(''))
    .join('\n');
  const canonical = (text) => text.replaceAll('\u00ad', '').split('\n').filter(Boolean).join('\n');
  if (canonical(rendered) !== canonical(expected))
    throw Error(`Original rules mismatch for ${entry.card.name}; review the supplied paragraphs.`);
  return {
    ...result,
    face: { ...result.face, wordingMode: 'original' },
    wordingEvidence: {
      rules: reviewed
        ? 'scan-reviewed'
        : typeof original?.originalText === 'string'
          ? 'mtgjson-original'
          : 'scryfall-printed',
      type: result.reviewedFields.includes('typeLine')
        ? 'scan-reviewed'
        : entry.card.printed_type_line != null &&
            result.face.typeLine === entry.card.printed_type_line
          ? 'scryfall-printed'
          : 'unverified',
      // Printed flavor metadata is a separate reference, not proof of its
      // punctuation, attribution line breaks, or typographic emphasis.
      flavor: reviewed ? 'scan-reviewed' : 'printing-metadata-unreviewed',
      referenceHash: entry.reference?.sha256 ?? null,
      printingTextUuid: original?.uuid ?? null,
    },
  };
}
