import reviewed from '../../fixtures/accuracy/split-legal-text.json' with { type: 'json' };

/** Copyright is not originalText. Use reviewed scans where available and label
 * the older release-year template explicitly when it has not been verified. */
export function splitFooterInput(card, reference, releaseYear) {
  const row = reviewed.printings[card.id];
  if (row) {
    if (row.referenceSha256 !== reference.sha256 || row.set !== card.set)
      throw Error('Reviewed split copyright does not match this reference');
    return { legalText: row.legalText, footerSource: 'scan-transcription' };
  }
  return {
    legalText: `™ & © ${releaseYear} Wizards of the Coast`,
    footerSource: 'unverified-release-year-template',
  };
}
