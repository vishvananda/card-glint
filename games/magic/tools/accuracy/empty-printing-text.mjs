import unlimited from '../../fixtures/accuracy/2ed/annotations-empty-rules.json' with { type: 'json' };
import lea from '../../fixtures/accuracy/lea/annotations-empty-rules.json' with { type: 'json' };
import leb from '../../fixtures/accuracy/leb/annotations-empty-rules.json' with { type: 'json' };
import revised from '../../fixtures/accuracy/3ed/annotations-empty-rules.json' with { type: 'json' };
import eighth from '../../fixtures/accuracy/8ed/annotations-empty-rules.json' with { type: 'json' };
import m21 from '../../fixtures/accuracy/m21/annotations-empty-rules.json' with { type: 'json' };

const sets = { lea, leb, '2ed': unlimited, '3ed': revised, '8ed': eighth, m21 };
/** Missing originalText is unknown. Only an exact, visually reviewed printing
 * can establish that its rules are empty; Oracle may add abilities later. */
export function emptyPrintingTextAnnotation(entry) {
  const row = sets[entry.card.set]?.cards[entry.card.id];
  if (!row || !entry.reference) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Empty printed text review is stale for ${entry.card.name}`);
  return row;
}
