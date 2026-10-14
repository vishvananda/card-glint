import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const beta = { name: 'Probe', setCode: 'leb', wordingMode: 'original' };
  const defaults = printingManaAdjustment(beta);
  assert.equal(defaults.dx, -1.5);
  assert.equal(defaults.dy ?? 0, 0, 'Disc height remains unchanged');
  assert.deepEqual(defaults.glyphs.W, { scale: 1.09, dx: 0, dy: 0 });
  assert.equal(defaults.glyphs.B.scale, 1.03);
  assert.equal(defaults.glyphs.G.scale, 1.12);
  const delta = { dx: 0.5, dy: 0.5, numberDy: 0.5, glyphs: { W: { dx: 1, scale: 1.1 } } };
  const adjustedFace = { ...beta, symbolAdjustment: { mana: delta } };
  const frozenInput = structuredClone(adjustedFace);
  const adjusted = printingManaAdjustment(adjustedFace);
  assert.equal(adjusted.dx, -1);
  assert.equal(adjusted.dy, 0.5);
  assert.equal(adjusted.numberDy, -0.5);
  assert.equal(adjusted.glyphs.W.scale, 1.09 * 1.1);
  assert.equal(adjusted.glyphs.W.dx, 1);
  assert.deepEqual(adjustedFace, frozenInput, 'Do not accumulate defaults into editor values');
  assert.deepEqual(
    printingManaAdjustment(adjustedFace),
    adjusted,
    'Repeated preparation is stable',
  );
  for (const extra of [
    { setCode: 'lea' },
    { setCode: '2ed' },
    { setCode: '3ed' },
    { borderColor: 'white' },
    { frameStyle: 'modern' },
    { layout: 'split' },
    { typeLine: 'Enchantment — Saga' },
    { symbolStyle: 'modern' },
    { wordingMode: 'oracle' },
  ])
    assert.equal(printingManaAdjustment({ ...adjustedFace, ...extra }), delta);
  assert.deepEqual(
    printingManaAdjustment({ ...beta, wordingMode: 'oracle', symbolStyle: 'original' }),
    defaults,
    'Oracle words with original symbols retain printing calibration',
  );
  const { retroDualFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-dual-frame.ts',
  );
  const { retroFrameAsset, retroAssets } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { calibratedFrameMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const { titleTranslation } = await server.ssrLoadModule(
    '/games/magic/src/presentation/title-placement.ts',
  );
  const types = {
    Badlands: 'Swamp Mountain',
    Bayou: 'Swamp Forest',
    Plateau: 'Mountain Plains',
    Savannah: 'Forest Plains',
    Scrubland: 'Plains Swamp',
    Taiga: 'Mountain Forest',
    'Tropical Island': 'Forest Island',
    Tundra: 'Plains Island',
    'Underground Sea': 'Island Swamp',
    'Volcanic Island': 'Island Mountain',
  };
  let count = 0;
  for (const set of ['lea', 'leb', '2ed', '3ed']) {
    const fixture = JSON.parse(
      await readFile(`games/magic/fixtures/accuracy/${set}/annotations-early-land-types.json`),
    );
    for (const [id, row] of Object.entries(fixture.cards)) {
      const dwarf = row.name === 'Dwarven Warriors';
      const card = {
        id,
        name: row.name,
        set,
        frame: '1993',
        layout: 'normal',
        colors: [],
        type_line: dwarf ? 'Creature — Dwarf Warrior' : 'Land — ' + types[row.name],
        oracle_text: 'Oracle rules.',
      };
      const entry = { card, reference: { sha256: row.referenceHash } };
      const original = presentation(
        entry,
        {},
        { [id]: { originalText: 'Original rules.', originalType: card.type_line } },
      );
      assert.equal(original.face.typeLine, dwarf ? 'Summon Dwarves' : 'Land');
      assert.equal(original.face.rulesText, 'Original rules.');
      assert.deepEqual(original.reviewedFields, ['typeLine']);
      assert.throws(() => presentation({ ...entry, reference: { sha256: 'stale' } }), /stale/);
      const oracle = presentation(entry, {
        [id]: { typeLine: card.type_line, rulesText: card.oracle_text },
      });
      assert.equal(oracle.face.typeLine, card.type_line);
      assert.equal(oracle.face.rulesText, 'Oracle rules.');
      assert.deepEqual(original.face.frameColors, oracle.face.frameColors);
      if (!dwarf && set !== '3ed') {
        const plan = retroDualFrame(original.face);
        assert.ok(plan);
        assert.deepEqual(plan, retroDualFrame(oracle.face));
        assert.equal(retroFrameAsset(original.face), plan.base);
        assert.ok(Object.values(plan).every((url) => retroAssets(original.face).includes(url)));
        assert.deepEqual(
          calibratedFrameMaterials({ ...original.face, colorCalibration: 'set-hsb-v1' }),
          {},
          'Do not inherit neutral-land HSB on a different colored source',
        );
      } else assert.equal(retroDualFrame(original.face), undefined);
      count++;
    }
  }
  assert.equal(count, 43);
  assert.equal(
    retroDualFrame({ name: 'Utility', setCode: 'leb', typeLine: 'Land', colors: ['U', 'R'] }),
    undefined,
    'Rules colors do not imply printed dual-land bands',
  );
  assert.equal(
    retroDualFrame({
      name: 'Opt out',
      setCode: 'leb',
      typeLine: 'Land — Island Swamp',
      frameColors: [],
    }),
    undefined,
  );
  assert.equal(
    retroDualFrame({
      name: 'Modern override',
      setCode: 'leb',
      typeLine: 'Land — Island Swamp',
      frameStyle: 'modern',
    }),
    undefined,
  );
  for (const [set, family, offset] of [
    ['lea', 'retro', [-1.5, 1.5]],
    ['leb', 'retro', [-1, 2]],
    ['8ed', 'eighth', [0.5, -2]],
    ['m21', 'modern', [-1, 1]],
  ]) {
    const face = { name: 'Probe', setCode: set };
    assert.deepEqual(titleTranslation(face, family), offset);
    for (const extra of [
      { legendary: true },
      { layout: 'split' },
      { borderColor: 'silver' },
      { setCode: '3ed' },
    ])
      assert.deepEqual(titleTranslation({ ...face, ...extra }, family), [0, 0]);
  }
  console.log(
    'Reviewed early types, semantic dual palettes, material guards, and title scope passed.',
  );
} finally {
  await server.close();
}
