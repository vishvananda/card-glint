import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import reviews from '../games/magic/fixtures/accuracy/historic-mana-order.json' with { type: 'json' };
import decisions from '../games/magic/fixtures/accuracy/mana-glyph-decisions.json' with { type: 'json' };
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { historicalManaFamily, historicalManaAsset } = await server.ssrLoadModule(
    '/games/magic/src/presentation/historical-mana.ts',
  );
  const { faceManaAssets } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-assets.ts',
  );
  const { recolorHistoricalManaPixels } = await server.ssrLoadModule(
    '/games/magic/src/presentation/historical-mana-material.ts',
  );
  const { expandHistoricalManaInk } = await server.ssrLoadModule(
    '/games/magic/src/presentation/historical-mana-ink.ts',
  );
  const { originalManaOrder } = await server.ssrLoadModule(
    '/games/magic/src/presentation/historic-mana-order.ts',
  );
  const { withCardWording } = await server.ssrLoadModule(
    '/games/magic/src/presentation/wording.ts',
  );
  assert.equal(decisions.decisions.length, 255);
  for (const d of decisions.decisions) {
    const face = { name: 'Test', setCode: d.set.toUpperCase(), manaSymbols: [d.symbol] };
    assert.equal(historicalManaFamily(face, d.symbol), d.family);
    assert.equal(historicalManaFamily({ ...face, symbolStyle: 'modern' }, d.symbol), undefined);
    assert.equal(historicalManaFamily({ ...face, wordingMode: 'oracle' }, d.symbol), undefined);
    assert.equal(
      historicalManaFamily({ ...face, wordingMode: 'oracle', symbolStyle: 'original' }, d.symbol),
      d.family,
    );
    const asset = historicalManaAsset(face, d.symbol);
    if (asset) assert.deepEqual(faceManaAssets(face), [asset.url]);
    else assert.equal(d.family === 'modern' || d.family === 'historic-font', true);
  }
  const blue = historicalManaAsset({ name: 'Test', setCode: 'leb' }, 'U');
  assert.ok(blue.url.endsWith('/old/oldu.svg'));
  assert.equal(historicalManaFamily({ name: 'Test', setCode: '4ed' }, 'W'), 'modern');
  assert.equal(historicalManaFamily({ name: 'Test', setCode: 'mir' }, 'U'), 'modern');
  assert.equal(historicalManaAsset({ name: 'Test', setCode: 'unknown' }, 'U'), undefined);
  assert.equal(historicalManaAsset({ name: 'Test', setCode: 'leb' }, 'R').inkExpansion, 0.4);
  assert.equal(historicalManaAsset({ name: 'Test', setCode: '3ed' }, 'R').inkExpansion, undefined);
  assert.equal(
    historicalManaAsset({ name: 'Test', setCode: 'leb', symbolStyle: 'modern' }, 'R'),
    undefined,
  );
  const inkPixels = new Uint8ClampedArray(24 * 24 * 4).fill(255);
  const center = (12 * 24 + 12) * 4;
  inkPixels.fill(0, center, center + 3);
  inkPixels.set([17, 28, 39, 128], 0);
  const beforeInk = inkPixels.slice();
  const palette = { discColor: '#ffffff', inkColor: '#000000', inkExpansion: 0.4 };
  expandHistoricalManaInk(inkPixels, 24, 24, palette);
  assert.deepEqual(
    [...inkPixels.slice(0, 4)],
    [...beforeInk.slice(0, 4)],
    'Disc antialias stays untouched',
  );
  assert.equal(inkPixels[center], 0, 'Solid original ink stays black');
  assert.ok(
    inkPixels[center + 4] > 100 && inkPixels[center + 4] < 200,
    'Fractional ink expansion adds a soft neighboring edge',
  );
  assert.equal(inkPixels[center + 8], 255, 'Distant disc fill is unchanged');
  assert.deepEqual(
    [...inkPixels.filter((_, i) => i % 4 === 3)],
    [...beforeInk.filter((_, i) => i % 4 === 3)],
    'Disc alpha is byte-identical',
  );
  const zeroInk = beforeInk.slice();
  expandHistoricalManaInk(zeroInk, 24, 24, { ...palette, inkExpansion: 0 });
  assert.deepEqual(zeroInk, beforeInk);
  assert.throws(() => expandHistoricalManaInk(zeroInk, 24, 23, palette), /dimensions/);
  assert.throws(
    () => expandHistoricalManaInk(zeroInk, 24, 24, { ...palette, inkExpansion: 2 }),
    /range/,
  );
  // Neutral MSE skull discs must accept a chromatic target without recoloring
  // the ink or losing translucent edges (HSB saturation cannot do this).
  const data = new Uint8ClampedArray([
    172, 172, 172, 128, 0, 0, 0, 255, 86, 86, 86, 200, 12, 34, 56, 0,
  ]);
  recolorHistoricalManaPixels(data, { discColor: '#acacac', inkColor: '#000000' }, [1, 0.5, 0.25]);
  assert.deepEqual([...data], [255, 128, 64, 128, 0, 0, 0, 255, 128, 64, 32, 200, 12, 34, 56, 0]);
  assert.throws(
    () =>
      recolorHistoricalManaPixels(data, { discColor: '#000000', inkColor: '#000000' }, [1, 1, 1]),
    /contrast/,
  );
  for (const [id, row] of Object.entries(reviews.cards)) {
    const symbols = [...row.oracleManaCost.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
    const face = { name: row.name, setCode: row.set, manaSymbols: symbols };
    assert.deepEqual(originalManaOrder(face, symbols), row.manaSymbols, row.name);
    const entry = {
      card: {
        id,
        name: row.name,
        set: row.set,
        mana_cost: row.oracleManaCost,
        type_line: 'Creature',
      },
      reference: { sha256: row.referenceHash },
    };
    assert.deepEqual(presentation(entry).face.manaSymbols, row.manaSymbols);
    assert.throws(() => presentation({ ...entry, reference: { sha256: 'stale' } }), /stale/);
    const wordings = {
      oracle: { typeLine: 'Creature', rulesText: 'Modern', manaSymbols: symbols },
      original: { typeLine: 'Summon Legend', rulesText: 'Printed' },
    };
    assert.deepEqual(withCardWording(face, wordings, 'original').manaSymbols, row.manaSymbols);
    assert.deepEqual(
      withCardWording(face, wordings, 'oracle', { symbolStyle: 'original' }).manaSymbols,
      symbols,
    );
    assert.deepEqual(
      withCardWording(
        face,
        { ...wordings, original: { ...wordings.original, manaSymbols: ['5'] } },
        'original',
      ).manaSymbols,
      ['5'],
    );
  }
  assert.deepEqual(
    originalManaOrder({ name: 'Ayesha Tanaka', setCode: 'leg' }, ['1', 'W', 'U']),
    ['1', 'W', 'U'],
    'Changed cost must not inherit a printing override',
  );
  assert.deepEqual(
    originalManaOrder({ name: 'Custom', setCode: 'ice' }, ['W/U', 'G']),
    ['W/U', 'G'],
    'Unknown symbols stay verbatim',
  );
  console.log(
    '255 mana-era selections, neutral-disc recoloring, 108 scan-bound cost orders, and independent Oracle/symbol modes pass.',
  );
} finally {
  await server.close();
}
