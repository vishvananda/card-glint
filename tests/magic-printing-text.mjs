import assert from 'node:assert/strict';
import { printingTextIndex } from '../games/magic/tools/accuracy/printing-text.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';

const entry = {
  id: 'printing-a',
  reference: { sha256: 'scan-a' },
  card: {
    id: 'printing-a',
    name: 'Example',
    set: '4ed',
    collector_number: '3',
    type_line: 'Creature — Human',
    oracle_text: 'Current wording.',
  },
};
const snapshot = { set: '4ed', entries: [entry] };
const record = {
  name: 'Example',
  setCode: '4ED',
  number: '3',
  language: 'English',
  identifiers: { scryfallId: 'printing-a' },
  originalText: 'Printed wording.',
  originalType: 'Creature – Human',
  uuid: 'mtgjson-a',
};
const index = printingTextIndex(snapshot, { code: '4ED', cards: [record] });
assert.equal(index.missing.length, 0);
const original = presentation(entry, {}, index.cards);
assert.equal(original.face.rulesText, 'Printed wording.');
assert.equal(original.contentStatus, 'printing-reference');
const tapped = printingTextIndex(snapshot, {
  code: '4ED',
  cards: [{ ...record, originalText: 'ocT: Add {U} to your mana pool.' }],
});
assert.equal(tapped.cards['printing-a'].originalText, '{T}: Add {U} to your mana pool.');
assert.equal(tapped.cards['printing-a'].rawOriginalText, 'ocT: Add {U} to your mana pool.');
assert.equal(
  original.face.typeLine,
  entry.card.type_line,
  'Do not trust originalType automatically',
);
assert.equal(presentation(entry).contentStatus, 'oracle-unverified');
const reviewed = presentation(
  entry,
  {
    'printing-a': {
      reviewed: true,
      referenceHash: 'scan-a',
      rulesText: 'Reviewed correction.',
      typeLine: 'Summon Example',
    },
  },
  index.cards,
);
assert.equal(reviewed.face.rulesText, 'Reviewed correction.');
assert.equal(reviewed.face.typeLine, 'Summon Example');
assert.equal(reviewed.contentStatus, 'scan-reviewed');
assert.equal(
  printingTextIndex(snapshot, { code: '4ED', cards: [{ ...record, originalText: undefined }] })
    .missing.length,
  1,
);
assert.equal(
  printingTextIndex(snapshot, {
    code: '4ED',
    cards: [{ ...record, identifiers: { scryfallId: 'other-printing' } }],
  }).missing.length,
  1,
);
assert.throws(
  () => printingTextIndex(snapshot, { code: '4ED', cards: [record, record] }),
  /Ambiguous/,
);
assert.throws(
  () => printingTextIndex(snapshot, { code: '4ED', cards: [{ ...record, number: '4' }] }),
  /identity mismatch/,
);
assert.throws(
  () => printingTextIndex(snapshot, { code: 'MIR', cards: [record] }),
  /set does not match/,
);
console.log(
  'Printing text identity, ambiguity, absence, reviewed precedence and type separation passed.',
);
