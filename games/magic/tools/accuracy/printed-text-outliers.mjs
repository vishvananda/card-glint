import fourth from '../../fixtures/accuracy/4ed/annotations-text-outliers.json' with { type: 'json' };
import arabian from '../../fixtures/accuracy/arn/annotations-text-outliers.json' with { type: 'json' };
import antiquities from '../../fixtures/accuracy/atq/annotations-text-outliers.json' with { type: 'json' };
import dark from '../../fixtures/accuracy/drk/annotations-text-outliers.json' with { type: 'json' };
import alpha from '../../fixtures/accuracy/lea/annotations-text-outliers.json' with { type: 'json' };
import alphaCosts from '../../fixtures/accuracy/lea/annotations-original-cost.json' with { type: 'json' };
import alphaTypes from '../../fixtures/accuracy/lea/annotations-colored-types.json' with { type: 'json' };
import betaTypes from '../../fixtures/accuracy/leb/annotations-colored-types.json' with { type: 'json' };
import beta from '../../fixtures/accuracy/leb/annotations-text-outliers.json' with { type: 'json' };

const reviews = new Map(
  [arabian, antiquities, dark, fourth].map((review) => [review.set, [review]]),
);
reviews.set('lea', [alphaTypes, alpha, alphaCosts]);
reviews.set('leb', [betaTypes, beta]);

/** Reviewed source errors must not be mistaken for layout errors. */
export function printedTextOutlierAnnotation(entry) {
  const rows = (reviews.get(entry.card.set) ?? [])
    .map((r) => r.cards[entry.card.id])
    .filter(Boolean);
  if (!rows.length || !entry.reference) return {};
  for (const row of rows)
    if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
      throw Error(`Printed text review is stale for ${entry.card.name}`);
  // Existing single-source sets retain their exact annotation object.
  if (!['lea', 'leb'].includes(entry.card.set)) return rows[0];
  return Object.assign({}, ...rows, {
    reviewedFields: [...new Set(rows.flatMap((r) => r.reviewedFields ?? []))],
  });
}
