import fixture from '../../fixtures/accuracy/planar-artist-review.json' with { type: 'json' };

/** Exact physical credits, separate from providers' canonical artist metadata.
 * Partial review certifies only the artist, never legal text or body wording. */
export function printedArtistAnnotation(entry) {
  const row = fixture.rows.find((r) => r.id === entry.card.id);
  if (!row || !entry.reference) return {};
  if (
    entry.card.set !== fixture.set ||
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
