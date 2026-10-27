import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { retroPrintDetails, fourthDetailRevision } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-details.ts',
  );
  const { cardTextureKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  const aura = {
    name: 'Printed land aura',
    setCode: '4ed',
    typeLine: 'Enchant Land',
    canonicalTypeLine: 'Enchantment — Aura',
    land: false,
    colors: ['B'],
    manaSymbols: ['B'],
    frameStyle: 'retro',
    wordingMode: 'original',
    symbolStyle: 'original',
  };
  const ordinary = { ...aura, typeLine: 'Enchantment' };
  assert.deepEqual(retroPrintDetails(aura), retroPrintDetails(ordinary));
  assert.equal(retroPrintDetails(aura).manaTop, 27.5);
  assert.equal(fourthDetailRevision(aura), 'fourth-semantic-details-v1');
  assert.equal(fourthDetailRevision(ordinary), undefined);
  const inferred = { ...aura, land: undefined, canonicalTypeLine: undefined };
  assert.deepEqual(retroPrintDetails(inferred), retroPrintDetails(ordinary));
  for (const land of [
    { ...aura, land: true },
    { ...aura, land: undefined, typeLine: 'Land', canonicalTypeLine: 'Land' },
  ]) {
    assert.equal(retroPrintDetails(land), null);
    assert.equal(fourthDetailRevision(land), undefined);
  }
  for (const setCode of [
    'lea',
    'leb',
    '2ed',
    '3ed',
    '5ed',
    'ice',
    'mir',
    'usg',
    'ons',
    '8ed',
    'm21',
  ]) {
    assert.equal(fourthDetailRevision({ ...aura, setCode }), undefined);
  }
  const input = { face: aura, printingId: 'probe', printedImage: null };
  for (const tier of ['table', 'native', 'inspect', 323]) {
    assert(JSON.parse(cardTextureKey(input, tier)).includes('fourth-semantic-details-v1'));
    for (const extra of [
      { layer: 'etching' },
      { paintLayer: 'artwork' },
      { printedImage: 'https://example.com/reference.png' },
    ])
      assert(
        !JSON.parse(cardTextureKey({ ...input, ...extra }, tier)).includes(
          'fourth-semantic-details-v1',
        ),
      );
    const oracle = { ...aura, wordingMode: 'oracle', typeLine: 'Enchantment — Aura' };
    assert(
      !JSON.parse(cardTextureKey({ ...input, face: oracle }, tier)).includes(
        'fourth-semantic-details-v1',
      ),
    );
  }
  const frozen = JSON.stringify(aura);
  retroPrintDetails(aura);
  fourthDetailRevision(aura);
  assert.equal(JSON.stringify(aura), frozen);
  console.log(
    'Fourth details:semantic aura selection,explicit land traits,inferred Enchant Land,unaffected eras and scoped face-only cache revision pass.',
  );
} finally {
  await server.close();
}
