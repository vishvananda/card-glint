/** Partial printing reviews must never certify unrelated rules text. */
export function reviewedPrintingFields(entry, annotation) {
  if (annotation.reviewedFields === undefined) return {};
  if (!Array.isArray(annotation.reviewedFields)) throw Error('Invalid reviewed printing fields');
  if (annotation.referenceHash !== entry.reference?.sha256)
    throw Error(`Reviewed printing fields are stale for ${entry.card.name}`);
  const result = {},
    seen = new Set();
  for (const field of annotation.reviewedFields) {
    if (seen.has(field)) throw Error(`Repeated printing field: ${field}`);
    seen.add(field);
    const value = annotation[field];
    // Both full-body and field-only reviews can list body strings. The adapter
    // assembles them separately. A field-only correction must not certify the
    // other body field or become a type, cost, artist or stats review.
    if (['rulesText', 'flavorText'].includes(field)) {
      if (annotation.reviewed === false || typeof value !== 'string')
        throw Error(`Invalid reviewed printing field: ${field}`);
      continue;
    }
    const valid = ['name', 'typeLine', 'artist'].includes(field)
      ? typeof value === 'string' && value.length > 0
      : field === 'manaSymbols'
        ? Array.isArray(value) && value.every((v) => typeof v === 'string' && v.length > 0)
        : field === 'frameColors'
          ? Array.isArray(value) && value.every((v) => ['W', 'U', 'B', 'R', 'G'].includes(v))
          : ['power', 'toughness'].includes(field) &&
            (value === null ||
              typeof value === 'string' ||
              (typeof value === 'number' && Number.isFinite(value)));
    if (!valid) throw Error(`Invalid reviewed printing field: ${field}`);
    result[field] = Array.isArray(value) ? [...value] : value;
  }
  return result;
}
