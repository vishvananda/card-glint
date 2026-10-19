import { calibrationPresentation } from './calibration-wording.mjs';

/** Use the public, scan-bound correction resolver for calibration as hosts do.
 * A temporary empty provider body is safe only when an exact reviewed rules
 * correction replaces it. Missing provider text never means an empty printing. */
export function reviewedCalibrationInput(entry, printingText, api) {
  const card = entry.card,
    providerRules = printingText[card.id]?.originalText ?? card.printed_text,
    resolved = api.resolvePrintingWording(
      card.id,
      {
        original: {
          name: card.name,
          typeLine: card.printed_type_line ?? card.type_line,
          rulesText: providerRules ?? '',
          flavorText: card.flavor_text ?? '',
          manaSymbols: [...(card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
          power: card.power,
          toughness: card.toughness,
        },
        oracle: { typeLine: card.type_line, rulesText: card.oracle_text ?? '' },
      },
      { referenceSha256: entry.reference?.sha256 },
    );
  if (resolved.provenance.status === 'reference-mismatch')
    throw Error(`Stale original wording review for ${card.name}`);
  const fields = new Set(resolved.provenance.corrections.flatMap((r) => r.fields)),
    reviewedRules = fields.has('rulesText') || fields.has('rulesParagraphs'),
    reviewedFlavor =
      fields.has('flavorText') ||
      resolved.provenance.corrections.some(
        (r) => r.fields.includes('rulesParagraphs') && r.paragraphScope !== 'rules-only',
      );
  if (typeof providerRules !== 'string' && !reviewedRules)
    throw Error(`Original rules unavailable for ${card.name}; exclude text calibration.`);
  const artist = api.resolvePrintingArtist(card.id, card.artist, {
    referenceSha256: entry.reference?.sha256,
  });
  if (artist.provenance.status === 'reference-mismatch')
    throw Error(`Stale artist review for ${card.name}`);
  const original = resolved.wordings.original,
    paragraphs = original.rulesParagraphs,
    text = (role) =>
      paragraphs
        .filter((p) => p.role === role)
        .map((p) => p.runs.map((r) => r.text).join(''))
        .join('\n'),
    annotation = {
      ...original,
      artist: artist.artist,
      paragraphs,
      rulesText: text('rules'),
      flavorText: text('flavor'),
      referenceHash: entry.reference?.sha256,
      reviewed: reviewedRules,
      reviewedFields: [
        ...[...fields].filter((f) =>
          ['name', 'typeLine', 'manaSymbols', 'power', 'toughness'].includes(f),
        ),
        ...(artist.provenance.status === 'applied' ? ['artist'] : []),
      ],
    };
  const prepared = calibrationPresentation(entry, { [card.id]: annotation }, printingText);
  return {
    ...prepared,
    wordingEvidence: {
      ...prepared.wordingEvidence,
      flavor: reviewedFlavor ? 'scan-reviewed' : 'printing-metadata-unreviewed',
    },
    correctionEvidence: { wording: resolved.provenance, artist: artist.provenance },
  };
}
