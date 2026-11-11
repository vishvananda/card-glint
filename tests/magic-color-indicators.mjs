import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { providerColorIndicator } from '../games/magic/src/presentation/color-indicator-printing.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const api = await server.ssrLoadModule('/games/magic/src/presentation.ts');
  const pack = await server.ssrLoadModule('/games/magic/src/index.ts');
  const base = { name: 'Sol Ring', typeLine: 'Artifact', colors: [], manaSymbols: ['1'] };
  const blue = { ...base, currentColors: ['U'] };
  assert.equal(api.resolveColorIndicator(base), null);
  assert.deepEqual(api.resolveColorIndicator(blue), {
    colors: ['U'],
    source: 'current',
    label: 'Currently blue',
  });
  assert.deepEqual(api.resolveCardProfile(blue), api.resolveCardProfile(base));
  assert.deepEqual(blue.manaSymbols, base.manaSymbols);
  const coloredArtifact = { ...blue, frameColors: ['U'], artifact: true, frameStyle: 'modern' };
  const coloredProfile = api.resolveCardProfile(coloredArtifact);
  assert.equal(coloredProfile.frame, 'U');
  assert.equal(coloredProfile.boxes, 'Artifact');
  assert.deepEqual(api.resolveColorIndicator(coloredArtifact), api.resolveColorIndicator(blue));
  assert.deepEqual(coloredArtifact.colors, []);

  assert.equal(api.resolveColorIndicator({ ...blue, currentColors: [] }), null);
  assert.equal(api.resolveColorIndicator({ ...blue, colorIndicatorDisplay: 'hidden' }), null);
  const printed = { ...base, colors: ['G'], colorIndicator: ['G'] };
  assert.equal(api.resolveColorIndicator(printed).source, 'printed');
  assert.equal(api.resolveColorIndicator({ ...printed, currentColors: ['R'] }).source, 'current');
  assert.deepEqual(
    api.resolveColorIndicator({ ...blue, colorIndicatorDisplay: 'current-if-changed' }),
    api.resolveColorIndicator(blue),
  );
  assert.equal(api.resolveColorIndicator({ ...blue, colorIndicatorDisplay: 'printed' }), null);
  assert.equal(api.resolveColorIndicator({ ...printed, currentColors: ['G'] }).source, 'printed');
  assert.equal(
    api.resolveColorIndicator({
      ...printed,
      currentColors: ['R'],
      colorIndicatorDisplay: 'printed',
    }).source,
    'printed',
  );
  assert.equal(
    api.resolveColorIndicator({ ...base, colors: ['U'] }),
    null,
    'Base color differs from artifact frame and mana, but no indicator is inferred',
  );
  assert.equal(
    api.resolveColorIndicator({
      ...printed,
      currentColors: ['G'],
      colorIndicatorDisplay: 'current-if-changed',
    }).source,
    'printed',
  );
  assert.deepEqual(
    api.resolveColorIndicator({
      ...printed,
      currentColors: [],
      colorIndicatorDisplay: 'current-if-changed',
    }),
    {
      colors: [],
      source: 'current',
      label: 'Currently colorless',
    },
  );
  assert.deepEqual(api.indicatorColors(['R', 'U', 'U', 'B']), ['U', 'B', 'R']);
  for (const value of [null, 'U', ['C'], ['u'], ['blue'], [1], Array(6).fill('U')])
    assert.throws(() => api.resolveColorIndicator({ ...base, colorIndicator: value }));
  assert.throws(
    () => api.resolveColorIndicator({ ...blue, colors: undefined }),
    /base card colors/,
  );
  assert.throws(() => api.resolveColorIndicator({ ...base, colorIndicatorDisplay: 'auto' }));
  assert.throws(() => api.resolveColorIndicator({ ...base, colorIndicatorPrinting: 'yes' }));
  const layout = api.colorIndicatorLayout(blue, [40, 390, 400, 30]);
  assert.equal(layout.text[0] + layout.text[2], 440);
  assert(layout.indicator[0] + layout.indicator[2] < layout.text[0]);
  assert.throws(() => api.colorIndicatorLayout(blue, [40, 390, 4, 30]), /no room/);
  assert.deepEqual(api.colorIndicatorAssets(base), []);
  assert.equal(api.colorIndicatorAssets(blue).length, 1);
  assert.match(api.colorIndicatorAssets(blue)[0], /\/uidentity.png$/);
  assert.deepEqual(api.canvasAssetUrls(base), api.canvasAssetUrls({ ...base, colorIndicator: [] }));

  const input = (face, extra = {}) => ({ printingId: null, printedImage: null, face, ...extra });
  assert.notEqual(
    api.cardTextureKey(input(base), 'native'),
    api.cardTextureKey(input(blue), 'native'),
  );
  const hidden = { ...blue, colorIndicatorDisplay: 'hidden' };
  assert.equal(
    api.cardTextureKey(input(base), 'native'),
    api.cardTextureKey(input(hidden), 'native'),
  );
  for (const extra of [{ paintLayer: 'artwork' }, { layer: 'etching' }])
    assert.equal(
      api.cardTextureKey(input(base, extra), 'native'),
      api.cardTextureKey(input(blue, extra), 'native'),
    );
  assert.equal(
    api.cardTextureKey(input(blue, { printedImage: 'https://example.com/scan.jpg' }), 'native'),
    api.cardTextureKey(input(blue), 'native'),
    'A changed scan takes exactly the rebuilt cache path',
  );
  assert(api.colorIndicatorChangesPrinting(blue));
  assert(!api.colorIndicatorChangesPrinting(printed));
  assert(api.colorIndicatorChangesPrinting({ ...printed, colorIndicatorDisplay: 'hidden' }));
  assert.equal(pack.magic.describe(blue, 'inspect').regions[0].id, 'color-indicator');
  assert(!pack.magic.describe(base, 'inspect').regions.some((r) => r.id === 'color-indicator'));

  const record = {
    name: 'Ancestral Vision',
    type_line: 'Sorcery',
    colors: ['U'],
    color_indicator: ['U'],
    mana_cost: '',
    frame: '2003',
    set: 'tsp',
    rarity: 'rare',
  };
  const old = api.fromScryfallCard({ ...record, released_at: '2006-10-06' });
  assert.deepEqual(old.colorIndicator, []);
  assert.deepEqual(old.oracleColorIndicator, ['U']);
  assert.equal(api.resolveColorIndicator(old), null);
  assert.equal(
    api.resolveColorIndicator({ ...old, colorIndicatorDisplay: 'oracle' }).source,
    'oracle',
  );
  assert.deepEqual(
    api.fromScryfallCard({ ...record, set: 'tsr', released_at: '2021-03-19' }).colorIndicator,
    ['U'],
  );
  assert.deepEqual(api.fromScryfallCard(record).colorIndicator, []);
  assert.deepEqual(api.fromScryfallCard(record, { colorIndicators: [['R']] }).colorIndicator, [
    'R',
  ]);
  const unknown = api.fromScryfallCard({ ...record, set: 'unknown' });
  assert.equal(unknown.colorIndicatorPrinting, 'unknown');
  assert.equal(api.resolveColorIndicator(unknown), null);
  assert.deepEqual(
    api.fromScryfallCard({ ...record, set: 'unknown' }, { printingDate: '2014-02-01' })
      .colorIndicator,
    ['U'],
  );
  for (const date of ['2020-02-31', 'bad', '2001-1-1'])
    assert.throws(() => providerColorIndicator(record, { printingDate: date }));
  for (const indicator of [['C'], 'U', null]) {
    if (indicator === null) continue;
    assert.throws(() => api.fromScryfallCard({ ...record, color_indicator: indicator }));
  }
  assert.throws(() => api.fromScryfallCard(record, { colorIndicators: [] }));
  assert.throws(
    () =>
      presentation({
        card: { ...record, id: 'unknown-indicator', set: 'unknown' },
        reference: { sha256: '0'.repeat(64) },
      }),
    /indicator visibility is unverified/,
  );

  const dfc = {
    ...record,
    name: 'Front // Back',
    set: 'isd',
    layout: 'transform',
    card_faces: [
      { name: 'Front', type_line: 'Creature', colors: ['U'], mana_cost: '{U}' },
      { name: 'Back', type_line: 'Creature', colors: ['U'], color_indicator: ['U'], mana_cost: '' },
    ],
  };
  assert.equal(api.fromScryfallCard(dfc).colorIndicator, undefined);
  assert.deepEqual(api.fromScryfallCard(dfc, { faceIndex: 1 }).colorIndicator, ['U']);
  const mtg = {
    name: 'Test',
    type: 'Creature',
    colors: ['G'],
    colorIndicator: ['G'],
    setCode: 'm21',
    frameVersion: '2015',
    text: '',
  };
  assert.deepEqual(api.fromMtgjsonCard(mtg).colorIndicator, ['G']);
  assert.deepEqual(
    api.fromMtgjsonCard({ ...mtg, setCode: 'tsp', frameVersion: '2003' }).colorIndicator,
    [],
  );
  assert.deepEqual(api.fromMtgjsonCard(mtg, { colorIndicators: [null] }).colorIndicator, []);
  assert.deepEqual(
    api.resolvePrintingPreset(base, {
      preset: 'match',
      overrides: {
        colorIndicator: ['R'],
        colorIndicatorDisplay: 'printed',
      },
    }).colorIndicator,
    ['R'],
  );
  assert.throws(() =>
    api.resolvePrintingPreset(base, {
      preset: 'match',
      overrides: {
        colorIndicator: ['C'],
      },
    }),
  );
  assert.deepEqual(
    api.withCardWording(
      printed,
      {
        oracle: { typeLine: 'Artifact', rulesText: '' },
        original: { typeLine: 'Mono Artifact', rulesText: '' },
      },
      'original',
    ).colorIndicator,
    ['G'],
  );
  console.log(
    'Color indicators: provider printing history, face isolation, live colors, palette preservation, cache/scan routing, and preset validation passed.',
  );
} finally {
  await server.close();
}
