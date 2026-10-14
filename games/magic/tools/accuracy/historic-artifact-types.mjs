import lea from '../../fixtures/accuracy/lea/annotations-historic-artifact-types.json' with { type: 'json' };
import leb from '../../fixtures/accuracy/leb/annotations-historic-artifact-types.json' with { type: 'json' };
import unlimited from '../../fixtures/accuracy/2ed/annotations-historic-artifact-types.json' with { type: 'json' };

const sets = { lea, leb, '2ed': unlimited };
/** Exact printing and reviewed scan only. A partial type review does not certify
 * rules text, and the caller's separately supplied Oracle wording stays intact. */
export function historicArtifactAnnotation(entry) {
  const row = sets[entry.card.set]?.cards[entry.card.id];
  if (!row || !entry.reference) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Historical artifact type review is stale for ${entry.card.name}`);
  return row;
}
