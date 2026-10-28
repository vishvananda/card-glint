import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { originalFields } from '../games/magic/tools/accuracy/old-frame-set-inputs.mjs';
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/mir/source-gap-review.json'),
);
const annotation = Object.values(review.cards).find((c) => c.name === 'Blistering Barrier');
const card = {
  id: '56d000d8-24e1-4cf3-bed9-e68a89c8f569',
  name: annotation.name,
  set: 'mir',
  collector_number: '159',
  type_line: 'Creature — Wall',
  oracle_text: "Defender (This creature can't attack.)",
};
const before = structuredClone(card);
const fields = originalFields(card, undefined, undefined, annotation);
assert.equal(fields.typeLine, 'Summon Wall');
assert.equal(fields.rulesText, '');
assert.equal(fields.typeSource, 'scan-reviewed-field');
assert.deepEqual(card, before);
assert.throws(() => originalFields(card, undefined, undefined), /Missing Original type/);
assert.throws(
  () =>
    originalFields(
      card,
      {
        name: card.name,
        number: '159',
        setCode: 'MIR',
        identifiers: { scryfallId: card.id },
        originalType: 'Summon Wall',
      },
      undefined,
    ),
  /Oracle fallback/,
);
const mtg = {
  name: card.name,
  number: '159',
  setCode: 'MIR',
  identifiers: { scryfallId: card.id },
  originalType: 'Creature – Wall',
};
const proposal = originalFields(card, mtg, { originalText: 'Printed candidate text.' });
assert.equal(proposal.typeLine, 'Creature — Wall');
assert.equal(proposal.rawType, 'Creature – Wall');
assert.equal(proposal.typeSource, 'mtgjson-original-type-candidate');
assert.equal(proposal.rulesSource, 'mtgjson-original-text');
assert.throws(() =>
  originalFields(card, { ...mtg, number: '160' }, { originalText: 'Printed text.' }),
);
assert.throws(() =>
  originalFields(
    card,
    { ...mtg, identifiers: { scryfallId: 'foreign' } },
    { originalText: 'Printed text.' },
  ),
);
assert.throws(() => originalFields(card, mtg, { originalText: null }));
assert.throws(() =>
  originalFields(
    card,
    mtg,
    { originalText: 'Printed text.' },
    { ...annotation, name: 'Foreign card' },
  ),
);
console.log(
  'Old-frame census fields preserve explicit empty rules, reject Oracle fallback and foreign printing identities, and keep provider types provisional.',
);
