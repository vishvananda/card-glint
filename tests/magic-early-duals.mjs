import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
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
  assert.deepEqual(defaults.glyphs.W, { scale: 1.09, dx: 0, dy: -0.5 });
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
    { setCode: '2ed' },
    { setCode: '3ed' },
    { borderColor: 'white' },
    { layout: 'split' },
    { typeLine: 'Enchantment — Saga' },
    { symbolStyle: 'modern' },
    { wordingMode: 'oracle' },
  ])
    assert.equal(printingManaAdjustment({ ...adjustedFace, ...extra }), delta);
  const alpha = printingManaAdjustment({ ...adjustedFace, setCode: 'lea' });
  assert.equal(alpha.dy, 1, 'Alpha combines its audited half-pixel offset with editor delta');
  assert.equal(alpha.glyphs.W.scale, 1.04 * 1.1);
  assert.deepEqual(
    printingManaAdjustment({ ...adjustedFace, frameStyle: 'modern' }),
    { ...delta, scaleX: 1.01, scaleY: 1.01, numberScale: 0.98, numberDx: -0.25 },
    'Explicit modern components use frame defaults without Beta glyph calibration',
  );
  assert.deepEqual(
    printingManaAdjustment({ ...beta, wordingMode: 'oracle', symbolStyle: 'original' }),
    defaults,
    'Oracle words with original symbols retain printing calibration',
  );
  const manaStudy = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/showcased-mana-placement.json'),
  );
  const eighth = {
    name: 'Probe',
    setCode: '8ed',
    frameStyle: 'modern',
    frameAssetFamily: 'eighth',
    borderColor: 'white',
  };
  for (const study of manaStudy.sets) {
    const face =
      study.set === '8ed' ? eighth : { name: 'Probe', setCode: study.set, wordingMode: 'original' };
    const actual = printingManaAdjustment(face);
    const abu = ['lea', 'leb'].includes(study.set);
    if (abu) {
      const review = JSON.parse(
        await readFile('games/magic/fixtures/accuracy/abu-054/review.json'),
      );
      assert.ok(review.sets[study.set].manaDecision);
      assert.equal(review.status, 'validated');
      // The frozen historical study is not retroactively rewritten when a
      // later original-wording, glyph-aware audit supersedes its defaults.
    } else if (study.set === 'm21') {
      // The rejected original geometry-only fit is superseded by the separately
      // validated numeral-source and shadow study, not adopted retroactively.
      assert.equal(study.adopt, false);
      assert.notDeepEqual(actual, study.fit.adjustment.mana);
    } else
      assert.equal(!!actual, study.adopt, 'Rejected study candidates must not become defaults');
    assert.equal(study.rows.length, 72);
    assert.equal(new Set(study.rows.map((r) => r.id)).size, 72);
    assert.equal(study.validation.count, 48);
    assert.ok(study.rows.every((r) => /^[a-f0-9]{64}$/.test(r.referenceHash)));
    if (study.adopt && !abu) {
      assert.deepEqual(study.flags, []);
      assert.ok(
        study.validation.after - study.validation.before >= manaStudy.policy.manaMeanMinimumGain,
      );
      assert.ok(
        study.validation.worstRegression <= manaStudy.policy.worstManaCardMaximumRegression,
      );
      const expected = study.fit.adjustment.mana;
      for (const [key, value] of Object.entries(actual)) assert.deepEqual(value, expected[key]);
    }
  }
  const eighthDelta = { dy: 0.5, scaleY: 0.9, glyphs: { U: { dy: 0.25 } } };
  const eighthAdjusted = printingManaAdjustment({
    ...eighth,
    symbolAdjustment: { mana: eighthDelta },
  });
  assert.equal(eighthAdjusted.dy, -1.5);
  assert.equal(eighthAdjusted.scaleY, 1.02 * 0.9);
  assert.equal(eighthAdjusted.glyphs.U.dy, -1.25);
  for (const extra of [
    { borderColor: 'black' },
    { frameAssetFamily: 'm15-accurate' },
    { legendary: true },
    { layout: 'split' },
  ])
    assert.equal(printingManaAdjustment({ ...eighth, ...extra }), undefined);
  const { retroDualFrame, retroLandColors } = await server.ssrLoadModule(
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
  const { profile: unlimited } = await server.ssrLoadModule(
    '/games/magic/src/calibration/sets/2ed.ts',
  );
  const basics = { Plains: 'W', Island: 'U', Swamp: 'B', Mountain: 'R', Forest: 'G' };
  let count = 0;
  for (const set of ['lea', 'leb', '2ed', '3ed']) {
    const fixture = JSON.parse(
      await readFile(`games/magic/fixtures/accuracy/${set}/annotations-early-land-types.json`),
    );
    for (const [id, row] of Object.entries(fixture.cards)) {
      const dwarf = row.name === 'Dwarven Warriors';
      const basic = basics[row.name];
      const card = {
        id,
        name: row.name,
        set,
        frame: '1993',
        layout: 'normal',
        colors: [],
        type_line: dwarf
          ? 'Creature — Dwarf Warrior'
          : basic
            ? 'Basic Land — ' + row.name
            : 'Land — ' + types[row.name],
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
      assert.deepEqual(
        original.reviewedFields.filter(
          (field) => !['artist', 'power', 'toughness'].includes(field),
        ),
        ['typeLine'],
        'Independent artist/stat reviews do not remove the original type correction',
      );
      assert.throws(() => presentation({ ...entry, reference: { sha256: 'stale' } }), /stale/);
      const oracle = presentation(entry, {
        [id]: { typeLine: card.type_line, rulesText: card.oracle_text },
      });
      assert.equal(oracle.face.typeLine, card.type_line);
      assert.equal(oracle.face.rulesText, 'Oracle rules.');
      assert.deepEqual(original.face.frameColors, oracle.face.frameColors);
      if (basic) {
        assert.deepEqual(original.face.frameColors, [basic]);
        assert.ok(
          retroFrameAsset(original.face).endsWith(
            set === '3ed' ? '/old/fourth/l.png' : '/' + basic.toLowerCase() + 'l.png',
          ),
        );
        assert.equal(retroFrameAsset(original.face), retroFrameAsset(oracle.face));
        assert.deepEqual(
          calibratedFrameMaterials({ ...original.face, colorCalibration: 'set-hsb-v1' }),
          calibratedFrameMaterials({ ...oracle.face, colorCalibration: 'set-hsb-v1' }),
          'Original label retains the same basic-land frame and its calibration',
        );
      }
      if (!dwarf && !basic && set !== '3ed') {
        const plan = retroDualFrame(original.face);
        assert.ok(plan);
        const printedOuterBand = {
          Badlands: 'r',
          Bayou: 'b',
          Plateau: 'r',
          Savannah: 'w',
          Scrubland: 'b',
          Taiga: 'r',
          'Tropical Island': 'u',
          Tundra: 'w',
          'Underground Sea': 'b',
          'Volcanic Island': 'r',
        }[row.name];
        assert.ok(plan.overlay.endsWith(`/${printedOuterBand}l.png`), 'Printed ABU stripe order');
        const printedOutline = {
          Badlands: 'b',
          Bayou: 'b',
          Plateau: 'w',
          Savannah: 'w',
          Scrubland: 'w',
          Taiga: 'g',
          'Tropical Island': 'u',
          Tundra: set === 'leb' ? 'w' : 'u',
          'Underground Sea': 'b',
          'Volcanic Island': set === 'leb' ? 'u' : 'r',
        }[row.name];
        const pair = [...'WUBRG'].filter((c) => original.face.frameColors.includes(c)).join('');
        const expectedOutline =
          set === '2ed' ? unlimited.dualLand.outlines[pair].toLowerCase() : printedOutline;
        assert.ok(
          plan.outline.endsWith(`/${expectedOutline}l.png`),
          'The full-frame outline is independent of paper-stripe ordering',
        );
        assert.deepEqual(plan, retroDualFrame(oracle.face));
        assert.equal(retroFrameAsset(original.face), plan.base);
        assert.ok(
          ['base', 'overlay', 'mask', 'outline'].every(
            (role) =>
              typeof plan[role] === 'string' && retroAssets(original.face).includes(plan[role]),
          ),
        );
        const calibrated = calibratedFrameMaterials({
          ...original.face,
          colorCalibration: 'set-hsb-v1',
        });
        for (const [url, { outerStock, outerStockMaskSource, ...pigment }] of Object.entries(
          calibrated,
        )) {
          if (set === '2ed') {
            const color = url.match(/\/([wubrg])l\.png$/)?.[1]?.toUpperCase();
            assert(color);
            assert.deepEqual(pigment, unlimited.dualLand.sources[color].adjustment);
            assert.equal(
              outerStock,
              undefined,
              'Measured dual pigments do not inherit legacy per-source stock',
            );
            assert.equal(outerStockMaskSource, undefined);
            continue;
          }
          assert.deepEqual(
            pigment,
            { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            'Do not inherit neutral-land HSB on a different colored source',
          );
          assert.deepEqual(outerStock, [27 / 255, 27 / 255, 27 / 255]);
          assert.ok(outerStockMaskSource.endsWith('/old/abu/border.svg'));
        }
      } else assert.equal(retroDualFrame(original.face), undefined);
      count++;
    }
  }
  assert.equal(count, 98);
  for (const [name, color] of Object.entries(basics)) {
    const face = {
      name,
      setCode: 'lea',
      typeLine: 'Land',
      canonicalTypeLine: `Basic Land — ${name}`,
    };
    assert.deepEqual(retroLandColors(face), [color]);
    assert.ok(retroFrameAsset(face).endsWith(`/${color.toLowerCase()}l.png`));
    assert.deepEqual(retroLandColors({ ...face, frameColors: [] }), []);
  }
  assert.deepEqual(retroLandColors({ name: 'Tundra', typeLine: 'Land — Plains Island' }), [
    'W',
    'U',
  ]);
  const { framePlate, framePlateUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const { plateBasicSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/plate-basic-land.ts',
  );
  for (const [name, color] of Object.entries(basics)) {
    const face = {
      name,
      colors: [],
      typeLine: `Basic Land — ${name}`,
      frameStyle: 'modern',
      frameAssetFamily: 'eighth',
      setCode: '8ed',
    };
    assert.ok(framePlate(face).frame.endsWith(`/${color.toLowerCase()}l.png`));
    assert.ok(framePlate({ ...face, frameColors: [] }).frame.endsWith('/l.png'));
    for (const raw of [color, `{${color}}`, `({T}: Add {${color}}.)`]) {
      const input = {
        ...face,
        rulesText: raw,
        rulesParagraphs: [{ role: 'rules', runs: [{ text: raw, italic: raw.startsWith('(') }] }],
      };
      const symbol = plateBasicSymbol(input);
      assert.ok(symbol.endsWith(`/basics/${color.toLowerCase()}.png`));
      assert.ok(framePlateUrls(input).includes(symbol));
      assert.equal(plateBasicSymbol({ ...input, rulesParagraphs: [] }), null);
      assert.equal(plateBasicSymbol({ ...input, rulesText: raw + '\nCustom rules.' }), null);
      assert.equal(plateBasicSymbol({ ...input, typeLine: 'Land' }), null);
      assert.equal(plateBasicSymbol({ ...input, frameAssetFamily: undefined }), symbol);
      assert.equal(plateBasicSymbol({ ...input, frameStyle: 'retro' }), null);
    }
  }
  assert.ok(
    retroFrameAsset({
      name: 'Custom land',
      setCode: 'leb',
      typeLine: 'Land',
      colors: ['R'],
    }).endsWith('/l.png'),
    'Rules color alone must not select a basic-land plate',
  );
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
