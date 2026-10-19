import arabian from '../../fixtures/accuracy/arn/annotations-text-outliers.json' with { type: 'json' };
import antiquities from '../../fixtures/accuracy/atq/annotations-text-outliers.json' with { type: 'json' };
import dark from '../../fixtures/accuracy/drk/annotations-text-outliers.json' with { type: 'json' };
import alpha from '../../fixtures/accuracy/lea/annotations-text-outliers.json' with { type: 'json' };
import alphaTypes from '../../fixtures/accuracy/lea/annotations-colored-types.json' with { type: 'json' };

const reviews = new Map([arabian, antiquities, dark].map((review) => [review.set, [review]]));
reviews.set('lea', [alphaTypes, alpha]);

/** Reviewed source errors must not be mistaken for layout errors. */
export function printedTextOutlierAnnotation(entry) {
  const rows = (reviews.get(entry.card.set) ?? [])
    .map((r) => r.cards[entry.card.id])
    .filter(Boolean);
  if (!rows.length || !entry.reference) return {};
  for (const row of rows)
    if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
      throw Error(`Printed text review is stale for ${entry.card.name}`);
  return Object.assign({}, ...rows, {
    reviewedFields: [...new Set(rows.flatMap((r) => r.reviewedFields ?? []))],
  });
}
