import assert from 'node:assert/strict';
import { fromScryfallCard, fromMtgjsonCard, magic, resolveFrameColors } from '../dist/lib/magic.js';
const card = {
  object: 'card',
  name: 'Provider Probe',
  type_line: 'Artifact Creature — Myr',
  oracle_text: 'Flying (This creature can fly.)',
  mana_cost: '{2}{U}',
  colors: ['U'],
  power: '2',
  toughness: '1',
  set: 'fut',
  frame: 'future',
  rarity: 'uncommon',
  collector_number: '1',
  artist: 'Original Artist',
  image_uris: { art_crop: 'https://example.com/art.png', png: 'https://example.com/full-card.png' },
};
const before = structuredClone(card),
  face = fromScryfallCard(card);
assert.equal(face.frameTemplate, 'future');
assert.equal(face.typeLine, card.type_line);
assert.deepEqual(face.manaSymbols, ['2', 'U']);
assert.equal(face.illustration, card.image_uris.art_crop);
assert.equal(face.artifact, true);
assert.equal(face.rulesParagraphs[0].runs.at(-1).italic, true);
assert.ok(magic.describe(face, 'inspect').regions.length);
assert.equal(
  fromScryfallCard({ ...card, image_uris: { png: 'https://example.com/scan.png' } }).illustration,
  null,
);
assert.equal(
  fromScryfallCard(
    { ...card, printed_type_line: 'Summon Myr', printed_text: 'Original rules.' },
    { wording: 'original' },
  ).typeLine,
  'Summon Myr',
);
assert.equal(
  fromScryfallCard({ ...card, printed_type_line: 'Summon Myr' }, { wording: 'original' }).artifact,
  true,
);
assert.equal(fromScryfallCard(card, { illustrations: [null] }).illustration, null);
assert.equal(
  fromScryfallCard(card, { illustrations: ['/local/art.png'] }).illustration,
  '/local/art.png',
);
assert.equal(fromScryfallCard({ ...card, power: undefined }).power, undefined);
const split = {
  ...card,
  frame: '2003',
  layout: 'split',
  card_faces: [
    {
      name: 'First',
      type_line: 'Instant',
      oracle_text: 'Draw a card.',
      mana_cost: '{U}',
      colors: ['U'],
    },
    {
      name: 'Second',
      type_line: 'Sorcery',
      oracle_text: 'Aftermath\nGain 3 life.',
      mana_cost: '{R}',
      colors: ['R'],
    },
  ],
};
const composite = fromScryfallCard(split);
assert.equal(composite.layout, 'aftermath');
assert.equal(composite.faces.length, 2);
assert.equal(composite.faces[1].name, 'Second');
assert.equal(fromScryfallCard(split, { faceIndex: 1 }).name, 'Second');
assert.doesNotThrow(() => magic.describe(composite, 'inspect'));
const ordinarySplit = fromScryfallCard({
  ...split,
  colors: ['U', 'R'],
  set: 'unknown',
  card_faces: split.card_faces.map((f) => ({
    ...f,
    colors: undefined,
    oracle_text: 'Draw a card.',
  })),
});
assert.deepEqual(
  ordinarySplit.faces.map((f) => f.colors),
  [['U'], ['R']],
);
assert.equal(ordinarySplit.frameAssetFamily, 'eighth');
assert.doesNotThrow(() => magic.describe(ordinarySplit, 'inspect'));
for (const type_line of ['Legendary Planeswalker — Jace', 'Creature — Human Wizard']) {
  const special = fromScryfallCard({
    ...card,
    frame: '2003',
    type_line,
    oracle_text: type_line.includes('Planeswalker')
      ? '+1: Draw a card.'
      : 'Level up {U}\nLEVEL 1-2\nFlying',
  });
  assert.equal(special.frameAssetFamily, undefined);
  assert.doesNotThrow(() => magic.describe(special, 'inspect'));
}
const land = {
  ...card,
  frame: '2015',
  set: 'm21',
  colors: [],
  type_line: 'Land',
  produced_mana: ['C', 'B', 'R'],
};
assert.deepEqual(resolveFrameColors(fromScryfallCard(land)), ['B', 'R']);
assert.deepEqual(
  resolveFrameColors(fromScryfallCard({ ...land, produced_mana: ['W', 'U', 'B', 'R', 'G'] })),
  [],
);
assert.deepEqual(
  resolveFrameColors(
    fromScryfallCard(
      {
        ...land,
        set: '3ed',
        frame: '1993',
        type_line: 'Land — Swamp Forest',
        printed_type_line: 'Land',
      },
      { wording: 'original' },
    ),
  ),
  ['B', 'G'],
);
assert.deepEqual(
  resolveFrameColors(
    fromMtgjsonCard({
      name: 'Dual',
      type: 'Land',
      colors: [],
      frameVersion: '2015',
      text: '{T}: Add {B} or {R}.',
    }),
  ),
  ['B', 'R'],
);
assert.deepEqual(
  resolveFrameColors(
    fromMtgjsonCard({
      name: 'Utility',
      type: 'Land',
      colors: [],
      frameVersion: '2015',
      text: '{W}: Gain 1 life.',
      colorIdentity: ['W'],
    }),
  ),
  [],
);
assert.equal(fromScryfallCard(split, { illustrations: [null, null] }).illustration, null);
const dual = fromScryfallCard({ ...split, layout: 'transform' }, { faceIndex: 1 });
assert.equal(dual.faces, undefined);
assert.equal(dual.name, 'Second');
assert.equal(fromScryfallCard({ ...split, layout: 'battle' }).frameTemplate, 'battle');
assert.equal(fromScryfallCard({ ...split, layout: 'flip' }).frameAssetFamily, undefined);
const a = {
    uuid: 'a',
    otherFaceIds: ['b'],
    side: 'a',
    name: 'First // Second',
    faceName: 'First',
    type: 'Instant',
    text: 'Draw a card.',
    originalType: 'Interrupt',
    originalText: 'Original text.',
    manaCost: '{U}',
    colors: ['U'],
    layout: 'split',
    setCode: 'FUT',
    frameVersion: '2003',
  },
  b = {
    ...a,
    uuid: 'b',
    otherFaceIds: ['a'],
    side: 'b',
    faceName: 'Second',
    type: 'Sorcery',
    manaCost: '{R}',
    colors: ['R'],
  };
const mtgBefore = structuredClone([b, a]);
const result = fromMtgjsonCard([b, a]);
assert.doesNotThrow(() => magic.describe(result, 'inspect'));
assert.deepEqual(
  fromMtgjsonCard([b, a], { illustrations: ['/second.png', '/first.png'] }).faces.map((f) => [
    f.name,
    f.illustration,
  ]),
  [
    ['First', '/first.png'],
    ['Second', '/second.png'],
  ],
);
const joined = [a, b].map((f) => ({
  ...f,
  originalText: 'Draw a card. // Sorcery\nGain 3 life.',
  originalType: 'Sorcery',
}));
assert.deepEqual(
  fromMtgjsonCard(joined, { wording: 'original' }).faces.map((f) => [f.typeLine, f.rulesText]),
  [
    ['Instant', 'Draw a card.'],
    ['Sorcery', 'Gain 3 life.'],
  ],
);
assert.throws(
  () =>
    fromMtgjsonCard([joined[0], { ...joined[1], originalText: 'Different // text' }], {
      wording: 'original',
    }),
  /Ambiguous/,
);
assert.throws(
  () =>
    fromMtgjsonCard([
      { ...a, setCode: 'AAA', otherFaceIds: ['c'] },
      { ...b, setCode: 'BBB', otherFaceIds: ['d'] },
    ]),
  /not associated/,
);
assert.throws(
  () =>
    fromMtgjsonCard([
      { ...a, setCode: 'AAA' },
      { ...b, setCode: 'BBB' },
    ]),
  /not associated/,
);
const atomic = [a, b].map(({ uuid, otherFaceIds, ...row }) => row);
assert.equal(fromMtgjsonCard(atomic).faces.length, 2);
assert.equal(result.faces[0].name, 'First');
assert.equal(result.faces[1].name, 'Second');
assert.equal(result.frameAssetFamily, 'eighth');
assert.equal(fromMtgjsonCard([a, b], { faceIndex: 0, wording: 'original' }).typeLine, 'Interrupt');
assert.equal(result.illustration, null);
assert.deepEqual([b, a], mtgBefore);
assert.deepEqual(card, before);
for (const bad of [
  null,
  {},
  { ...card, colors: ['Z'] },
  { ...card, mana_cost: '2U' },
  { ...card, image_uris: { art_crop: 'javascript:alert(1)' } },
  { ...card, card_faces: [card, card, card] },
])
  assert.throws(() => fromScryfallCard(bad));
assert.throws(() => fromScryfallCard(card, { faceIndex: 1 }));
assert.throws(() => fromScryfallCard(split, { illustrations: [null] }));
assert.throws(() => fromMtgjsonCard(a));
assert.throws(() =>
  fromMtgjsonCard([
    { ...a, name: 'Unrelated', otherFaceIds: [] },
    { ...b, otherFaceIds: [] },
  ]),
);
console.log(
  'PASS public provider adapters preserve text, flavor, original wording, mana, physical frames, associated faces and explicit artwork; reject invalid and partial composite records without mutating input',
);

assert.throws(() => fromScryfallCard({ ...card, layout: 'split' }));
assert.throws(() => fromMtgjsonCard([a, a]));

assert.equal(
  fromMtgjsonCard([a, { ...b, frameVersion: '2015' }], { faceIndex: 1 }).frameAssetFamily,
  undefined,
);
assert.equal(
  fromScryfallCard({ ...split, layout: 'transform', security_stamp: 'oval' }, { faceIndex: 1 })
    .securityStamp,
  'none',
);
assert.equal(
  fromScryfallCard({ ...card, printed_name: 'Printed title' }, { wording: 'original' }).name,
  'Printed title',
);
assert.deepEqual(
  fromScryfallCard(
    { ...card, name: 'Adun Oakenshield', set: 'leg', mana_cost: '{B}{R}{G}' },
    { wording: 'original' },
  ).manaSymbols,
  ['G', 'R', 'B'],
);
assert.deepEqual(
  fromScryfallCard({ ...card, name: 'Adun Oakenshield', set: 'leg', mana_cost: '{B}{R}{G}' })
    .manaSymbols,
  ['B', 'R', 'G'],
);
assert.deepEqual(
  fromScryfallCard({ ...card, flavor_text: 'Words *upright* words.' })
    .rulesParagraphs.at(-1)
    .runs.map((r) => r.italic),
  [true, false, true],
);
assert.equal(fromScryfallCard({ ...card, watermark: 'izzet' }).watermark, 'izzet');
const flipPair = [a, b].map((row) => ({
  ...row,
  layout: 'flip',
  originalText: 'Front ability.\n-----\nSecond\nLegendary Creature — Spirit\n3/3\nBack ability.',
}));
const flipOriginal = fromMtgjsonCard(flipPair, { wording: 'original' });
assert.equal(flipOriginal.faces[0].rulesText, 'Front ability.');
assert.equal(flipOriginal.faces[1].rulesText, 'Back ability.');
assert.equal(flipOriginal.faces[1].typeLine, 'Legendary Creature — Spirit');
console.log(
  'PASS provider render routing, panel palettes, land colors, original panel boundaries, artwork pairing, historical cost order and reverse-side stamps',
);
