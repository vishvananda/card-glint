import dark from '../../fixtures/accuracy/drk/annotations-text-outliers.json' with { type: 'json' };

/** Reviewed source errors must not be mistaken for layout errors. */
export function printedTextOutlierAnnotation(entry) {
  const row = entry.card.set === dark.set ? dark.cards[entry.card.id] : undefined;
  if (!row || !entry.reference) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Printed text review is stale for ${entry.card.name}`);
  return row;
}
