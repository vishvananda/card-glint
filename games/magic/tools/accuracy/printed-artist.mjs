import unlimitedFinal from '../../fixtures/accuracy/2ed/annotations-artist-final.json' with { type: 'json' };
import fixture from '../../fixtures/accuracy/planar-artist-review.json' with { type: 'json' };
import early from '../../fixtures/accuracy/early-expansion-footer-wording.json' with { type: 'json' };

import alpha from '../../fixtures/accuracy/lea/annotations.json' with { type: 'json' };
import alphaCredits from '../../fixtures/accuracy/lea/annotations-artist-credit.json' with { type: 'json' };

import betaCredits from '../../fixtures/accuracy/leb/annotations-artist-credit.json' with { type: 'json' };
import unlimited from '../../fixtures/accuracy/2ed/annotations.json' with { type: 'json' };
import unlimitedCredits from '../../fixtures/accuracy/2ed/annotations-artist-credit.json' with { type: 'json' };

const credits = new Map([
  ...[alpha, alphaCredits, betaCredits, unlimited, unlimitedCredits, unlimitedFinal].flatMap(
    (review) =>
      Object.entries(review.cards)
        .filter(([, row]) => row.reviewedFields?.includes('artist'))
        .map(([id, row]) => [id, { ...row, set: review.set, printedArtist: row.artist }]),
  ),
  ...fixture.rows.map((row) => [row.id, { ...row, set: fixture.set }]),
  ...early.rows.filter((row) => !row.artistMatchesProvider).map((row) => [row.id, row]),
]);

/** Exact physical credits, separate from providers' canonical artist metadata.
 * Partial review certifies only the artist, never legal text or body wording. */
export function printedArtistAnnotation(entry) {
  const row = credits.get(entry.card.id);
  if (!row || !entry.reference) return {};
  if (
    entry.card.set !== row.set ||
    (row.number != null && entry.card.collector_number !== row.number) ||
    entry.card.name !== row.name ||
    entry.reference.sha256 !== row.referenceHash
  )
    throw Error(`Printed artist credit review is stale for ${entry.card.name}`);
  return {
    artist: row.printedArtist,
    referenceHash: row.referenceHash,
    reviewedFields: ['artist'],
  };
}
