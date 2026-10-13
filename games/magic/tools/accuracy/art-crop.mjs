import corrections from '../../fixtures/accuracy/art-crops.json' with { type: 'json' };

/** Asset cleanup belongs to the reference adapter, never the card painter.
 * A replaced image must be reviewed again rather than inheriting an old trim. */
export function reviewedArtCrop(entry) {
  const row = corrections.cards[entry.card.id];
  if (!row || !entry.art) return { status: 'unreviewed' };
  if (row.artHash !== entry.art.sha256) return { status: 'stale-source' };
  const source = row.source === 'reference' ? entry.reference : entry.art;
  if (!source || (row.source === 'reference' && row.referenceHash !== source.sha256))
    return { status: 'stale-source' };
  const [width, height] = row.sourceDimensions;
  const [x, y, w, h] = row.cropPixels;
  if (
    !(
      width > 0 &&
      height > 0 &&
      x >= 0 &&
      y >= 0 &&
      w > 0 &&
      h > 0 &&
      x + w <= width &&
      y + h <= height
    )
  )
    throw Error(`Invalid reviewed art crop: ${entry.card.id}`);
  return {
    status: 'reviewed-source-crop',
    crop: [x / width, y / height, w / width, h / height],
    artHash: row.artHash,
    source: row.source ?? 'art',
    sourceHash: source.sha256,
    reason: row.reason,
  };
}
