import corrections from '../../fixtures/accuracy/adventure-printing-corrections.json' with { type: 'json' };
import preparedText from '../../fixtures/accuracy/prepare-printing-text.json' with { type: 'json' };
import futureText from '../../fixtures/accuracy/future-printing-corrections.json' with { type: 'json' };

/** Reviewed printing fields are keyed to the exact physical scan. Keep provider
 * values in provenance, and refuse to transfer a correction to a changed scan. */
export function reviewedSpecialRecords(card, reference, records) {
  const correction =
    corrections.cards[card.id] ?? preparedText.cards[card.id] ?? futureText.cards[card.id];
  if (!correction) return records;
  if (
    card.set !== correction.set ||
    card.collector_number !== correction.number ||
    reference.sha256 !== correction.referenceSha256
  )
    throw Error('Reviewed special-frame printing identity changed');
  const selected = new Set();
  const result = records.map((r) => {
    if (r.identifiers?.scryfallId !== card.id) return r;
    const face = correction.faces.find((f) => f.name === (r.faceName ?? r.name));
    if (!face || selected.has(face.name)) throw Error('Ambiguous reviewed special-frame face');
    selected.add(face.name);
    const fields = Object.fromEntries(Object.entries(face).filter(([key]) => key !== 'name'));
    return {
      ...r,
      ...fields,
      reviewedCorrection: {
        referenceSha256: reference.sha256,
        reason: correction.reason,
        fields: Object.fromEntries(
          Object.entries(fields).map(([key, after]) => [key, { before: r[key] ?? null, after }]),
        ),
      },
    };
  });
  if (selected.size !== correction.faces.length) throw Error('Missing reviewed special-frame face');
  return result;
}
