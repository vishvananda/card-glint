import fixture from '../../fixtures/accuracy/leg/annotations-text-review.json' with { type: 'json' };

/** Original body wording reviewed independently of types and layout. */
export function historicLegendsTextAnnotation(entry) {
  if (entry.card.set !== 'leg' || !entry.reference) return {};
  const row = fixture.cards[entry.card.id];
  if (!row) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Historical Legends text review is stale for ${entry.card.name}`);
  return row;
}
