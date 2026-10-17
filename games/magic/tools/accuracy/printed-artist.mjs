import fixture from '../../fixtures/accuracy/planar-artist-review.json' with { type: 'json' };
import early from '../../fixtures/accuracy/early-expansion-footer-wording.json' with { type: 'json' };

const credits = new Map([
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
    entry.card.collector_number !== row.number ||
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
