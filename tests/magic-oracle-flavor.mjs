import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { nativeHostCases } from './magic-native-host-cases.mjs';
import {
  oracleFlavorAncestryProof,
  preOracleFlavorSource,
} from '../games/magic/tools/accuracy/oracle-flavor-ancestry.mjs';

const proof = await oracleFlavorAncestryProof();
const oldSources = new Map(
  await Promise.all(
    Object.keys(proof.files).map(async (file) => [
      file,
      (await preOracleFlavorSource(file, await readFile(file))).toString(),
    ]),
  ),
);
const options = {
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
};
const current = await createServer(options);
const previous = await createServer({
  ...options,
  plugins: [
    {
      name: 'released-wording-selection',
      enforce: 'pre',
      transform(_source, id) {
        for (const [file, code] of oldSources)
          if (id.endsWith('/' + file)) return { code, map: null };
      },
    },
  ],
});
try {
  const load = (server) => server.ssrLoadModule('/games/magic/src/index.ts');
  const api = await load(current),
    prior = await load(previous);
  const { cardTextureKey } = await current.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  const face = {
    name: 'Flavor specimen',
    setCode: 'lea',
    typeLine: 'Creature — Human Cleric',
    colors: ['W'],
    rulesText: 'Stale original text.',
    rulesParagraphs: [{ role: 'flavor', runs: [{ text: 'Stale flavor.' }] }],
  };
  const flavor = {
    role: 'flavor',
    align: 'right',
    runs: [
      { text: 'A printed ', italic: true },
      { text: 'name', italic: false },
    ],
  };
  const rules = {
    role: 'rules',
    runs: [{ text: 'Current rules. ' }, { text: '(Reminder.)', italic: true }],
  };
  const wordings = {
    oracle: {
      typeLine: face.typeLine,
      rulesText: 'Current rules. (Reminder.)',
      rulesParagraphs: [rules],
    },
    original: {
      typeLine: 'Summon Cleric',
      rulesText: 'Misprinted rules.\nA printed name',
      rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Misprinted rules.' }] }, flavor],
    },
  };
  const frozen = JSON.stringify({ face, wordings });
  const visible = api.withCardWording(face, wordings, 'oracle', { includeFlavorText: true });
  assert.equal(visible.typeLine, face.typeLine);
  assert.equal(visible.wordingMode, 'oracle');
  assert.deepEqual(visible.rulesParagraphs, [rules, flavor]);
  assert.equal(visible.rulesText, 'Current rules. (Reminder.)\nA printed name');
  assert.deepEqual(
    visible.rulesAlignment.reference,
    visible.rulesParagraphs,
    'Fitting uses displayed flavor',
  );
  assert.deepEqual(
    api.withCardWording(face, wordings, 'oracle').rulesParagraphs,
    [rules],
    'Omission retains selected wording',
  );
  assert.notEqual(
    cardTextureKey({ face: visible, printingId: null, printedImage: null }, 'inspect'),
    cardTextureKey(
      { face: api.withCardWording(face, wordings, 'oracle'), printingId: null, printedImage: null },
      'inspect',
    ),
  );
  const own = {
    ...wordings,
    oracle: {
      ...wordings.oracle,
      rulesParagraphs: [
        rules,
        { role: 'flavor', runs: [{ text: 'Oracle-side flavor.', italic: true }] },
      ],
    },
  };
  const ownVisible = api.withCardWording(face, own, 'oracle', { includeFlavorText: true });
  assert.equal(ownVisible.rulesParagraphs.length, 2, 'No duplicate flavor');
  assert.equal(ownVisible.rulesParagraphs[1].runs[0].text, 'Oracle-side flavor.');
  const hidden = api.withCardWording(face, own, 'oracle', { includeFlavorText: false });
  assert.deepEqual(hidden.rulesParagraphs, [rules]);
  assert.equal(hidden.rulesText, 'Current rules. (Reminder.)');
  assert.deepEqual(hidden.rulesAlignment.reference, [rules]);
  assert.deepEqual(
    api.withCardWording(face, wordings, 'original', { includeFlavorText: false }),
    api.withCardWording(face, wordings, 'original'),
    'Original display is unchanged',
  );
  assert.equal(JSON.stringify({ face, wordings }), frozen, 'Never mutate input wording or styling');
  assert.throws(
    () => api.withCardWording(face, wordings, 'oracle', { includeFlavorText: 'yes' }),
    /boolean/,
  );
  assert.doesNotThrow(() =>
    api.withCardWording(face, { oracle: wordings.oracle }, 'oracle', { includeFlavorText: true }),
  );
  const resolved = api.resolvePrintingWording('unreviewed-flavor-fixture', {
    oracle: { typeLine: face.typeLine, rulesText: 'Current.' },
    original: {
      typeLine: 'Summon Cleric',
      rulesText: 'Printed.',
      flavorText: 'A *quoted name*.\n—A source',
    },
  });
  const resolvedVisible = api.withCardWording(face, resolved.wordings, 'oracle', {
    includeFlavorText: true,
  });
  assert.deepEqual(
    resolvedVisible.rulesParagraphs.map((p) => p.role),
    ['rules', 'flavor', 'flavor'],
  );
  assert.deepEqual(
    resolvedVisible.rulesParagraphs[1].runs.map((r) => r.italic),
    [true, false, true],
  );
  const rawVisible = api.withCardWording(
    face,
    {
      oracle: { typeLine: 'Instant', rulesText: 'Draw a card.' },
      original: { typeLine: 'Instant', rulesText: 'Printed rules.', flavorText: 'A *name*.' },
    },
    'oracle',
    { includeFlavorText: true },
  );
  assert.equal(rawVisible.rulesParagraphs[1].runs[1].italic, false);
  for (const provider of ['scryfall', 'mtgjson']) {
    const input =
      provider === 'scryfall'
        ? {
            name: 'Provider flavor',
            type_line: 'Creature — Human',
            oracle_text: 'Current rules.',
            printed_text: 'Printed rules.',
            printed_type_line: 'Summon Human',
            flavor_text: 'Provider flavor.',
            set: 'm21',
            colors: ['W'],
          }
        : {
            name: 'Provider flavor',
            type: 'Creature — Human',
            text: 'Current rules.',
            originalText: 'Printed rules.',
            originalType: 'Summon Human',
            flavorText: 'Provider flavor.',
            setCode: 'M21',
            colors: ['W'],
          };
    const importer = provider === 'scryfall' ? api.fromScryfallCard : api.fromMtgjsonCard;
    const oldImporter = provider === 'scryfall' ? prior.fromScryfallCard : prior.fromMtgjsonCard;
    assert.deepEqual(
      importer(input),
      oldImporter(input),
      'Provider defaults unchanged: ' + provider,
    );
    for (const includeFlavorText of [true, false]) {
      const selected = importer(input, { wording: 'oracle', includeFlavorText });
      assert.equal(
        selected.rulesParagraphs.some((p) => p.role === 'flavor'),
        includeFlavorText,
        provider,
      );
      assert.equal(selected.typeLine, 'Creature — Human');
      assert.ok(selected.rulesText.startsWith('Current rules.'));
    }
    assert.deepEqual(
      importer(input, { wording: 'original', includeFlavorText: false }),
      importer(input, { wording: 'original' }),
    );
  }
  const cases = [...nativeHostCases];
  for (const file of [
    'abu-054/lea-inputs.json.gz',
    'abu-054/leb-inputs.json.gz',
    'early-through-fourth/2ed-reviewed-inputs.json.gz',
  ]) {
    const data = JSON.parse(gunzipSync(await readFile('games/magic/fixtures/accuracy/' + file)));
    cases.push(...data.entries);
  }
  let comparisons = 0;
  for (const { face } of cases) {
    const original = {
      ...face,
      typeLine: face.typeLine ?? 'Artifact',
      rulesText: face.rulesText ?? '',
    };
    const pair = {
      original,
      oracle: { ...original, typeLine: face.canonicalTypeLine ?? original.typeLine },
    };
    for (const mode of ['oracle', 'original'])
      for (const selection of [
        {},
        { includeFlavorText: undefined },
        { symbolStyle: 'original' },
        { rulesAlignment: 'left' },
      ]) {
        assert.equal(
          JSON.stringify(api.withCardWording(face, pair, mode, selection)),
          JSON.stringify(prior.withCardWording(face, pair, mode, selection)),
          'Changed default wording: ' + face.name,
        );
        comparisons++;
      }
  }
  console.log(
    JSON.stringify({
      oracleFlavor: true,
      providerImports: true,
      sourceMutation: false,
      cacheInvalidation: true,
      releasedDefaultCases: cases.length,
      releasedDefaultComparisons: comparisons,
    }),
  );
} finally {
  await current.close();
  await previous.close();
}
