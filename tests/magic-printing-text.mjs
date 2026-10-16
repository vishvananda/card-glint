import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  normalizePrintingText,
  printingTextIndex,
} from '../games/magic/tools/accuracy/printing-text.mjs';
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
const escapedBreaks = printingTextIndex(snapshot, {
  code: '4ED',
  cards: [{ ...record, originalText: '+1: First ability.\\r\n−2: Second ability.' }],
});
assert.equal(
  escapedBreaks.cards['printing-a'].originalText,
  '+1: First ability.\n−2: Second ability.',
);
assert.equal(
  escapedBreaks.cards['printing-a'].rawOriginalText,
  '+1: First ability.\\r\n−2: Second ability.',
);
assert.equal(
  original.face.typeLine,
  entry.card.type_line,
  'Do not trust originalType automatically',
);
assert.equal(presentation(entry).contentStatus, 'oracle-unverified');
const artistReview = {
  reviewedFields: ['artist'],
  referenceHash: 'scan-a',
  artist: 'Printed Artist Spelling',
};
const artistResult = presentation(entry, { 'printing-a': artistReview });
assert.equal(artistResult.face.artist, 'Printed Artist Spelling');
assert.equal(artistResult.contentStatus, 'oracle-unverified');
assert.equal(entry.card.artist, undefined, 'Printing override must not change source metadata');
assert.throws(
  () => presentation(entry, { 'printing-a': { ...artistReview, artist: '' } }),
  /Invalid reviewed printing field/,
);
assert.throws(
  () => presentation(entry, { 'printing-a': { ...artistReview, referenceHash: 'old-scan' } }),
  /stale/,
);
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
const partial = {
  reviewedFields: ['typeLine', 'power', 'toughness', 'manaSymbols'],
  referenceHash: 'scan-a',
  typeLine: 'Summon Example',
  power: 0,
  toughness: '*',
  manaSymbols: [],
};
const partialResult = presentation(entry, { 'printing-a': partial }, index.cards);
assert.equal(partialResult.contentStatus, 'printing-reference');
assert.equal(partialResult.face.creature, true);
assert.equal(partialResult.face.power, 0);
assert.equal(partialResult.face.toughness, '*');
assert.deepEqual(partialResult.face.manaSymbols, []);
assert.equal(partialResult.face.rulesText, 'Printed wording.');
assert.deepEqual(partialResult.reviewedFields, partial.reviewedFields);
assert.throws(
  () => presentation(entry, { 'printing-a': { ...partial, referenceHash: 'other-scan' } }),
  /stale/,
);
assert.throws(
  () => presentation(entry, { 'printing-a': { ...partial, reviewedFields: ['unknown'] } }),
  /Invalid reviewed printing field/,
);
assert.throws(
  () =>
    presentation(entry, {
      'printing-a': { ...partial, reviewedFields: ['power'], power: Infinity },
    }),
  /Invalid reviewed printing field/,
);
assert.throws(
  () => presentation(entry, { 'printing-a': { ...partial, reviewedFields: ['power', 'power'] } }),
  /Repeated printing field/,
);
const removedStats = presentation(entry, {
  'printing-a': { ...partial, power: null, toughness: null },
});
assert.equal(removedStats.face.power, null);
assert.equal(removedStats.face.toughness, null);
const framed = presentation(
  { ...entry, card: { ...entry.card, colors: ['U'], mana_cost: '{2}{U}' } },
  {
    'printing-a': { reviewedFields: ['frameColors'], referenceHash: 'scan-a', frameColors: ['G'] },
  },
);
assert.deepEqual(framed.face.colors, ['U']);
assert.deepEqual(framed.face.frameColors, ['G']);
assert.deepEqual(framed.face.manaSymbols, ['2', 'U']);
assert.equal(framed.contentStatus, 'oracle-unverified');
assert.throws(
  () =>
    presentation(entry, {
      'printing-a': {
        reviewedFields: ['frameColors'],
        referenceHash: 'scan-a',
        frameColors: ['Blue'],
      },
    }),
  /Invalid reviewed printing field/,
);
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

// Produced mana colors describe a modern land's printed palette, not its rules colors.
const land = {
  ...entry,
  card: {
    ...entry.card,
    frame: '2015',
    type_line: 'Land',
    colors: [],
    produced_mana: ['R', 'B', 'C'],
  },
};
const landFace = presentation(land).face;
assert.deepEqual(landFace.colors, []);
assert.deepEqual(landFace.frameColors, ['B', 'R']);
assert.deepEqual(
  presentation({ ...land, card: { ...land.card, frame: '2003' } }).face.frameColors,
  ['B', 'R'],
);
assert.deepEqual(
  presentation({ ...land, card: { ...land.card, produced_mana: ['U'] } }).face.frameColors,
  ['U'],
);
for (const changes of [
  { produced_mana: ['C'] },
  { produced_mana: ['W', 'U', 'B', 'R', 'G'] },
  { produced_mana: undefined, color_identity: ['B', 'R'] },
  { frame: '1997' },
  { type_line: 'Artifact Land' },
  { type_line: 'Basic Land — Mountain' },
  { type_line: 'Artifact' },
  { colors: ['G'] },
])
  assert.equal(
    presentation({ ...land, card: { ...land.card, ...changes } }).face.frameColors,
    undefined,
  );
assert.deepEqual(
  presentation(land, {
    'printing-a': { reviewedFields: ['frameColors'], referenceHash: 'scan-a', frameColors: [] },
  }).face.frameColors,
  [],
);
assert.deepEqual(
  presentation(land, {
    'printing-a': { reviewedFields: ['frameColors'], referenceHash: 'scan-a', frameColors: ['G'] },
  }).face.frameColors,
  ['G'],
);

// Every historical artifact label is tied to its printing and reviewed scan.
const wordingServer = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { withCardWording } = await wordingServer.ssrLoadModule(
    '/games/magic/src/presentation/wording.ts',
  );
  for (const set of ['lea', 'leb', '2ed']) {
    const fixture = JSON.parse(
      await readFile(
        `games/magic/fixtures/accuracy/${set}/annotations-historic-artifact-types.json`,
      ),
    );
    assert.equal(Object.keys(fixture.cards).length, 43);
    for (const [id, row] of Object.entries(fixture.cards)) {
      const input = {
        reference: { sha256: row.referenceHash },
        card: {
          id,
          name: row.name,
          set,
          frame: '1993',
          type_line: 'Artifact',
          oracle_text: 'Current rules.',
        },
      };
      const result = presentation(input);
      assert.equal(result.face.typeLine, row.typeLine);
      assert.equal(result.face.rulesText, 'Current rules.');
      assert.equal(result.contentStatus, 'oracle-unverified');
      assert.deepEqual(result.reviewedFields, ['typeLine']);
      const wordings = {
        original: result.face,
        oracle: { typeLine: 'Artifact', rulesText: 'Oracle rules.' },
      };
      assert.equal(withCardWording(result.face, wordings, 'original').typeLine, row.typeLine);
      assert.equal(withCardWording(result.face, wordings, 'oracle').typeLine, 'Artifact');
      assert.equal(withCardWording(result.face, wordings, 'oracle').rulesText, 'Oracle rules.');
      assert.throws(
        () => presentation({ ...input, reference: { sha256: 'different-scan' } }),
        /stale/,
      );
      const caller = presentation(input, { [id]: { typeLine: 'Caller override' } });
      assert.equal(caller.face.typeLine, 'Caller override');
      assert.deepEqual(
        caller.reviewedFields,
        [],
        'A partial historical review cannot certify caller text',
      );
      if (row.name === 'Jade Statue') assert.equal(row.typeLine, 'Artifact');
    }
  }
  console.log('129 scan-bound historical artifact labels and original/Oracle switching pass.');
  const legendsText = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/leg/annotations-text-review.json'),
  );
  const legends = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/leg/annotations-legend-types.json'),
  );
  assert.equal(Object.keys(legends.cards).length, 55);
  assert.equal(
    Object.values(legends.cards).filter((r) => r.typeLine === 'Summon Legend').length,
    50,
  );
  const creatures = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/leg/annotations-creature-types.json'),
  );
  assert.equal(Object.keys(creatures.cards).length, 97);
  assert.equal(
    Object.values(creatures.cards).filter((r) => r.typeLine === 'Artifact Creature').length,
    3,
  );
  for (const [id, row] of Object.entries({ ...legends.cards, ...creatures.cards })) {
    const input = {
      reference: { sha256: row.referenceHash },
      card: {
        id,
        name: row.name,
        set: 'leg',
        type_line: 'Legendary Creature — Modern Type',
        oracle_text: 'Modern ability.',
      },
    };
    const original = presentation(input);
    assert.equal(original.face.typeLine, row.typeLine);
    assert.equal(original.face.creature, true);
    assert(original.reviewedFields.includes('typeLine'));
    assert.equal(
      original.contentStatus,
      legendsText.cards[id] ? 'scan-reviewed' : 'oracle-unverified',
    );
    const oracle = { typeLine: input.card.type_line, rulesText: input.card.oracle_text };
    assert.equal(
      withCardWording(original.face, { original: original.face, oracle }, 'oracle').typeLine,
      oracle.typeLine,
    );
    assert.throws(() => presentation({ ...input, reference: { sha256: 'changed' } }), /stale/);
    const override = presentation(input, { [id]: { typeLine: 'Caller type' } });
    assert.equal(override.face.typeLine, 'Caller type');
    assert(!override.reviewedFields.includes('typeLine'));
  }
  console.log('152 scan-bound Legends creature type labels and Oracle isolation pass.');
  const noncreatures = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json'),
  );
  assert.equal(Object.keys(noncreatures.cards).length, 158);
  assert.equal(
    new Set([
      ...Object.keys(legends.cards),
      ...Object.keys(creatures.cards),
      ...Object.keys(noncreatures.cards),
    ]).size,
    310,
  );
  assert.equal(
    Object.values(noncreatures.cards).filter((r) => r.typeLine !== r.oracleType).length,
    42,
  );
  for (const [id, row] of Object.entries(noncreatures.cards)) {
    const input = {
      reference: { sha256: row.referenceHash },
      card: {
        id,
        name: row.name,
        set: 'leg',
        type_line: row.oracleType,
        oracle_text: 'Modern ability.',
      },
    };
    const original = presentation(input);
    assert.equal(original.face.typeLine, row.typeLine);
    assert.equal(original.face.creature, false);
    assert.deepEqual(original.reviewedFields, ['typeLine']);
    assert.equal(
      original.contentStatus,
      legendsText.cards[id] ? 'scan-reviewed' : 'oracle-unverified',
    );
    const oracle = { typeLine: row.oracleType, rulesText: 'Modern ability.' };
    assert.equal(
      withCardWording(original.face, { original: original.face, oracle }, 'oracle').typeLine,
      row.oracleType,
    );
    assert.throws(() => presentation({ ...input, reference: { sha256: 'changed' } }), /stale/);
    const override = presentation(input, { [id]: { typeLine: 'Caller type' } });
    assert.equal(override.face.typeLine, 'Caller type');
    assert(!override.reviewedFields.includes('typeLine'));
  }
  console.log('158 scan-bound Legends noncreature types complete the 310-printing inventory.');
  for (const [id, row] of Object.entries(legendsText.cards)) {
    for (const [role, field] of [
      ['rules', 'rulesText'],
      ['flavor', 'flavorText'],
    ])
      assert.equal(
        row.paragraphs
          .filter((p) => p.role === role)
          .map((p) =>
            p.runs
              .map((r) => r.text)
              .join('')
              .replaceAll('\u00ad', ''),
          )
          .join('\n'),
        row[field],
        'Discretionary printing breaks must preserve plain wording',
      );
    const input = {
      reference: { sha256: row.referenceHash },
      card: {
        id,
        name: row.name,
        set: 'leg',
        type_line: 'Enchantment',
        oracle_text: 'Modern ability.',
      },
    };
    const original = presentation(input);
    assert.deepEqual(original.face.rulesParagraphs, row.paragraphs);
    assert.equal(original.contentStatus, 'scan-reviewed');
    assert.equal(
      withCardWording(
        original.face,
        {
          original: original.face,
          oracle: { typeLine: 'Enchantment', rulesText: 'Modern ability.' },
        },
        'oracle',
      ).rulesText,
      'Modern ability.',
    );
    const override = presentation(input, { [id]: { rulesText: 'Caller body.' } });
    assert.equal(override.contentStatus, 'oracle-unverified');
    assert.equal(override.face.rulesParagraphs[0].runs[0].text, 'Caller body.');
    assert.throws(
      () => presentation({ ...input, card: { ...input.card, name: 'Wrong printing' } }),
      /stale/,
    );
  }
  console.log('Twelve Legends body reviews preserve Oracle and explicit caller overrides.');
  let emptyCount = 0;
  for (const set of ['lea', 'leb', '3ed', '8ed', 'm21']) {
    const fixture = JSON.parse(
      await readFile(`games/magic/fixtures/accuracy/${set}/annotations-empty-rules.json`),
    );
    for (const [id, row] of Object.entries(fixture.cards)) {
      const input = {
        reference: { sha256: row.referenceHash },
        card: {
          id,
          name: row.name,
          set,
          frame: '1993',
          type_line: 'Creature — Modern Type',
          oracle_text: 'Modern ability.',
          flavor_text: 'Unverified flavor.',
        },
      };
      const original = presentation(input);
      assert.equal(original.annotation.rulesText, '');
      assert.equal(original.contentStatus, 'scan-reviewed');
      assert.equal(original.face.typeLine, row.typeLine);
      assert(original.face.rulesParagraphs.every((p) => p.role === 'flavor'));
      assert(!original.face.rulesText.includes('Modern ability.'));
      assert.throws(() => presentation({ ...input, reference: { sha256: 'new-scan' } }), /stale/);
      const oracle = { typeLine: input.card.type_line, rulesText: input.card.oracle_text };
      const wordings = { original: original.face, oracle };
      assert.equal(withCardWording(original.face, wordings, 'original').typeLine, row.typeLine);
      assert.equal(withCardWording(original.face, wordings, 'oracle').rulesText, oracle.rulesText);
      assert.equal(withCardWording(original.face, wordings, 'oracle').typeLine, oracle.typeLine);
      const changed = presentation(input, { [id]: { rulesText: 'Caller ability.' } });
      assert.equal(changed.contentStatus, 'oracle-unverified');
      assert.equal(changed.face.rulesParagraphs[0].runs[0].text, 'Caller ability.');
      if (row.name === 'Giant Octopus')
        assert(
          original.face.rulesParagraphs.some((p) =>
            p.runs.some(
              (r) => r.text === 'Twenty Thousand Leagues under the Sea' && r.italic === false,
            ),
          ),
        );
      emptyCount++;
    }
  }
  assert.equal(emptyCount, 73);
  console.log('73 scan-bound empty rules, printed types, flavor and Oracle isolation pass.');
} finally {
  await wordingServer.close();
}

assert.equal(
  normalizePrintingText('{2RRR}: Return this. {10} {W/U} {2/W} {B/P} {T} {CHAOS}'),
  '{2}{R}{R}{R}: Return this. {10} {W/U} {2/W} {B/P} {T} {CHAOS}',
);
assert.equal(normalizePrintingText('{WUBRG} {X}{X} {12GG}'), '{W}{U}{B}{R}{G} {X}{X} {12}{G}{G}');
