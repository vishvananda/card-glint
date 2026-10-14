import assert from 'node:assert/strict';
import {
  originalFaceRecord,
  originalPanelText,
  originalPanelType,
  specialFrameSides,
  specialFrameInput,
} from '../games/magic/tools/accuracy/special-frame-input.mjs';

const images = (name) => ({
  png: `https://example.test/${name}.png`,
  art_crop: `https://example.test/${name}-art.jpg`,
});
const front = {
  name: 'Front',
  type_line: 'Enchantment — Saga',
  oracle_text: 'Changed front',
  colors: ['R'],
  image_uris: images('a'),
};
const back = {
  name: 'Back',
  type_line: 'Creature — Goblin',
  oracle_text: 'Changed back',
  colors: ['R'],
  image_uris: images('b'),
  power: '2',
  toughness: '2',
};
const card = {
  id: 'physical-id',
  name: 'Front // Back',
  set: 'neo',
  collector_number: '141',
  frame: '2015',
  layout: 'transform',
  rarity: 'rare',
  card_faces: [front, back],
};
const records = [front, back].map((f, i) => ({
  identifiers: { scryfallId: card.id },
  name: card.name,
  faceName: f.name,
  side: i ? 'b' : 'a',
  number: '141',
  originalText: i ? 'Original back.' : 'I — Original chapter.',
  originalType: f.type_line,
  uuid: `uuid-${i}`,
}));
const sides = specialFrameSides(card);
assert.equal(sides.length, 2);
assert.notEqual(sides[0].images.png, sides[1].images.png);
assert.equal(originalFaceRecord(card, back, records).side, 'b');
assert.throws(() => originalFaceRecord(card, back, records.slice(0, 1)), /unique original/);
assert.throws(() => originalFaceRecord(card, back, [...records, records[1]]), /unique original/);
const reference = { sha256: 'a'.repeat(64) },
  art = { sha256: 'b'.repeat(64) };
const adapted = sides.map((s) => specialFrameInput(card, s, reference, art, records));
assert.equal(adapted[0].face.rulesText, 'I — Original chapter.');
assert.equal(adapted[1].face.rulesText, 'Original back.');
assert.equal(adapted[1].face.power, '2');
assert.equal(adapted[1].face.layout, 'transform');
const split = {
  ...card,
  layout: 'split',
  image_uris: images('whole'),
  card_faces: [front, back].map(({ image_uris: _, ...f }) => f),
};
assert.equal(specialFrameSides(split).length, 1);
const panels = specialFrameInput(split, specialFrameSides(split)[0], reference, art, records).face;
assert.equal(panels.faces.length, 2);
assert.equal(
  panels.faces[0].illustration,
  undefined,
  'Shared split art must exercise the crop policy',
);
assert.equal(panels.illustration, `/__accuracy/object/${art.sha256}`);
const adventure = {
  ...split,
  layout: 'adventure',
  colors: ['R', 'U'],
  card_faces: [
    {
      ...split.card_faces[0],
      type_line: 'Creature — Giant',
      colors: ['R'],
      power: '3',
      toughness: '4',
    },
    { ...split.card_faces[1], type_line: 'Instant — Adventure', colors: ['U'] },
  ],
};
const adventureRecords = records.map((r, i) => ({
  ...r,
  originalType: adventure.card_faces[i].type_line,
}));
const book = specialFrameInput(
  adventure,
  specialFrameSides(adventure)[0],
  reference,
  art,
  adventureRecords,
).face;
assert.equal(book.name, front.name);
assert.equal(book.typeLine, 'Creature — Giant');
assert.deepEqual(
  book.colors,
  ['R'],
  'An Adventure parent uses the permanent colors, not the union',
);
assert.deepEqual(book.faces[1].colors, ['U']);
assert.equal(book.power, '3');
assert.equal(book.rulesText, 'I — Original chapter.');
assert.equal(book.faces[1].rulesText, 'Original back.');
assert.equal(book.illustration, `/__accuracy/object/${art.sha256}`);
const joinedAdventure = adventureRecords.map((r, i) => ({
  ...r,
  originalText: 'Printed spell. // Printed creature.',
  originalType: 'Creature — Giant',
  type: adventure.card_faces[i].type_line,
}));
const correctedBook = specialFrameInput(
  { ...adventure, flavor_text: 'Parent flavor.' },
  specialFrameSides(adventure)[0],
  reference,
  art,
  joinedAdventure,
);
assert.equal(correctedBook.face.rulesText, 'Printed creature.');
assert.equal(correctedBook.face.faces[1].rulesText, 'Printed spell.');
assert.equal(correctedBook.face.faces[1].typeLine, 'Instant — Adventure');
assert.equal(correctedBook.originals[1].typeIssue.kind, 'duplicated-adventure-original-type');
assert.ok(correctedBook.face.faces[1].rulesParagraphs.every((p) => p.role !== 'flavor'));
assert.throws(
  () => originalPanelText(adventure, joinedAdventure[0], [joinedAdventure[0], adventureRecords[1]]),
  /Ambiguous/,
);
const joined = records.map((r, i) => ({
  ...r,
  originalText: 'First. // Creature — Goblin\nSecond.',
  colors: [i ? 'U' : 'R'],
}));
assert.equal(originalPanelText(split, joined[0], joined), 'First.');
assert.equal(originalPanelText(split, joined[1], joined), 'Second.');
assert.throws(() => originalPanelText(split, joined[0], [joined[0], records[1]]), /Ambiguous/);
const spells = {
  ...split,
  card_faces: split.card_faces.map((f, i) => ({ ...f, type_line: i ? 'Sorcery' : 'Instant' })),
};
const brokenTypes = joined.map((r, i) => ({
  ...r,
  originalType: 'Sorcery',
  type: i ? 'Sorcery' : 'Instant',
}));
const recovered = originalPanelType(spells, spells.card_faces[0], brokenTypes[0], brokenTypes);
assert.equal(recovered.typeLine, 'Instant');
assert.equal(recovered.issue.kind, 'duplicated-split-original-type');
assert.equal(
  originalPanelType(
    spells,
    spells.card_faces[0],
    { ...brokenTypes[0], type: 'Sorcery' },
    brokenTypes,
  ).typeLine,
  'Sorcery',
  'Disagreeing face providers cannot correct the historical field',
);
assert.equal(
  originalPanelType(
    spells,
    { ...spells.card_faces[0], type_line: 'Creature — Elemental' },
    { ...brokenTypes[0], originalType: 'Summon Force' },
    brokenTypes,
  ).typeLine,
  'Summon Force',
);
assert.throws(
  () => specialFrameSides({ ...card, card_faces: split.card_faces }),
  /Missing reference/,
);
console.log(
  'Special-frame audit inputs: exact original wording per face, split sheets, independent physical references, missing/ambiguous records pass.',
);
