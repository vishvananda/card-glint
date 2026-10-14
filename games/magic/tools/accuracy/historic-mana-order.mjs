import reviews from '../../fixtures/accuracy/historic-mana-order.json' with { type: 'json' };

export function historicManaOrderAnnotation(entry) {
  const row = reviews.cards[entry.card.id];
  if (!row || !entry.reference) return {};
  if (
    row.set !== entry.card.set ||
    row.name !== entry.card.name ||
    row.referenceHash !== entry.reference.sha256
  )
    throw Error(`Historical mana order review is stale for ${entry.card.name}`);
  return row;
}
