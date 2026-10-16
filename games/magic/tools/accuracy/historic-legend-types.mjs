import legends from '../../fixtures/accuracy/leg/annotations-legend-types.json' with { type: 'json' };
import creatures from '../../fixtures/accuracy/leg/annotations-creature-types.json' with { type: 'json' };

import noncreatures from '../../fixtures/accuracy/leg/annotations-noncreature-types.json' with { type: 'json' };

const cards = { ...legends.cards, ...creatures.cards, ...noncreatures.cards };

/** Original printing labels, not inferred modern card types. Keep modern
 * Oracle wording separate and never certify unrelated rules or flavor text. */
export function historicLegendAnnotation(entry) {
  if (entry.card.set !== 'leg' || !entry.reference) return {};
  const row = cards[entry.card.id];
  if (!row) return {};
  if (row.name !== entry.card.name || row.referenceHash !== entry.reference.sha256)
    throw Error(`Historical legend type review is stale for ${entry.card.name}`);
  return row.printedName ? { ...row, name: row.printedName } : row;
}
