import arabian from '../../fixtures/accuracy/arn/annotations-text-outliers.json' with { type: 'json' };
import antiquities from '../../fixtures/accuracy/atq/annotations-text-outliers.json' with { type: 'json' };
import dark from '../../fixtures/accuracy/drk/annotations-text-outliers.json' with { type: 'json' };

const reviews = new Map([arabian, antiquities, dark].map((review) => [review.set, review]));

/** Reviewed source errors must not be mistaken for layout errors. */
export function printedTextOutlierAnnotation(entry) {
  const row = reviews.get(entry.card.set)?.cards[entry.card.id];
  if (!row || !entry.reference) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Printed text review is stale for ${entry.card.name}`);
  return row;
}
