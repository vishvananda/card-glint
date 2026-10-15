import assert from 'node:assert/strict';
import { flipPrintingRecords } from '../games/magic/tools/accuracy/flip-printing-text.mjs';
const card = {
  id: 'printing',
  layout: 'flip',
  card_faces: [{ name: 'Front' }, { name: 'Back', type_line: 'Legendary Creature — Fox Wizard' }],
};
const joined =
  'Printed front ability.\n-----\nBack\nLegendary Creature Fox Wizard\n4/5\nPrinted reverse ability.';
const records = card.card_faces.map((f) => ({
  identifiers: { scryfallId: card.id },
  faceName: f.name,
  originalText: joined,
  originalType: 'Creature — Fox Wizard',
}));
const fixed = flipPrintingRecords(card, records);
assert.equal(fixed[0].originalText, 'Printed front ability.');
assert.equal(fixed[1].originalText, 'Printed reverse ability.');
assert.equal(fixed[1].originalType, 'Legendary Creature — Fox Wizard');
assert.equal(records[0].originalText, joined);
const errata = flipPrintingRecords(
  {
    ...card,
    card_faces: [
      card.card_faces[0],
      { ...card.card_faces[1], type_line: 'Legendary Creature — Human' },
    ],
  },
  records,
);
assert.equal(
  errata[1].originalType,
  'Legendary Creature Fox Wizard',
  'Oracle errata must not replace provider words',
);
assert.throws(
  () =>
    flipPrintingRecords(
      card,
      records.map((r) => ({ ...r, originalText: joined.replace('\nBack\n', '\nWrong face\n') })),
    ),
  /Ambiguous/,
);
console.log(
  'Joined flip text separates only verified headers and preserves historical type words.',
);
