/** Partial printing reviews must never certify unrelated rules text. */
export function reviewedPrintingFields(entry, annotation) {
  if (annotation.reviewedFields === undefined) return {};
  if (!Array.isArray(annotation.reviewedFields)) throw Error('Invalid reviewed printing fields');
  if (annotation.referenceHash !== entry.reference?.sha256)
    throw Error(`Reviewed printing fields are stale for ${entry.card.name}`);
  const result = {};
  for (const field of annotation.reviewedFields) {
    if (Object.hasOwn(result, field)) throw Error(`Repeated printing field: ${field}`);
    const value = annotation[field];
    const valid =
      field === 'typeLine'
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
