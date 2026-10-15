import legends from '../../fixtures/accuracy/leg/annotations-legend-types.json' with { type: 'json' };

/** Original printing labels, not inferred creature subtypes. Keep modern
 * Oracle wording separate and never certify unrelated rules or flavor text. */
export function historicLegendAnnotation(entry) {
  if (entry.card.set !== 'leg' || !entry.reference) return {};
  const row = legends.cards[entry.card.id];
  if (!row) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Historical legend type review is stale for ${entry.card.name}`);
  return row;
}
