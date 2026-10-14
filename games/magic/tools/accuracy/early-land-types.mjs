import lea from '../../fixtures/accuracy/lea/annotations-early-land-types.json' with { type: 'json' };
import leb from '../../fixtures/accuracy/leb/annotations-early-land-types.json' with { type: 'json' };
import unlimited from '../../fixtures/accuracy/2ed/annotations-early-land-types.json' with { type: 'json' };
import revised from '../../fixtures/accuracy/3ed/annotations-early-land-types.json' with { type: 'json' };

const sets = { lea, leb, '2ed': unlimited, '3ed': revised };
export function earlyLandTypeAnnotation(entry) {
  const row = sets[entry.card.set]?.cards[entry.card.id];
  if (!row || !entry.reference) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Early type review is stale for ${entry.card.name}`);
  return row;
}
