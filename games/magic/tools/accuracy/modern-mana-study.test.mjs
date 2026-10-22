import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { hash } from './common.mjs';
import { modernManaStudy } from './modern-mana-study.mjs';
const file = 'games/magic/src/presentation/printing-mana-adjustment.ts';
const source = await readFile(file, 'utf8');
const parameters = {
  schema: 1,
  set: 'm21',
  source: { profileSourceHash: hash(source) },
  rendererControls: { scaleX: 0.98, scaleY: 0.98, spacing: 0.75, dx: -0.125, dy: -0.25 },
};
test('source-bound study rejects foreign code and invalid knobs', () => {
  const plugin = modernManaStudy(parameters);
  assert(plugin.transform(source, '/' + file).code.includes('"scaleX":0.98'));
  assert.throws(
    () => plugin.transform(source + '// edited source', '/' + file),
    /Changed mana source/,
  );
  assert.equal(plugin.transform(source, '/other.ts'), undefined);
  assert.throws(() => modernManaStudy({ ...parameters, set: 'war' }));
  assert.throws(() =>
    modernManaStudy({
      ...parameters,
      rendererControls: { ...parameters.rendererControls, scaleY: 1 },
    }),
  );
  assert.throws(() =>
    modernManaStudy({ ...parameters, rendererControls: { ...parameters.rendererControls, dy: 5 } }),
  );
});
test('only M21 normal costs change; source types, noncost cards and editor deltas stay scoped', async () => {
  const plain = await createServer({
    configFile: false,
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  const study = await createServer({
    configFile: false,
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [modernManaStudy(parameters)],
  });
  try {
    for (const server of [plain, study])
      await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const a = await plain.ssrLoadModule('/' + file),
      b = await study.ssrLoadModule('/' + file);
    const face = {
      name: 'Cost',
      setCode: 'm21',
      typeLine: 'Creature',
      colors: ['U'],
      manaSymbols: ['2', 'U'],
    };
    assert.notDeepEqual(a.printingManaDefaults(face), b.printingManaDefaults(face));
    for (const [key, value] of Object.entries(parameters.rendererControls))
      assert.equal(b.printingManaDefaults(face)[key], value);
    for (const extra of [
      { setCode: 'war' },
      { setCode: 'lea', frameStyle: 'retro' },
      { layout: 'planeswalker', typeLine: 'Planeswalker' },
      { manaSymbols: [] },
      { frameAssetFamily: 'eighth' },
    ])
      assert.deepEqual(
        b.printingManaDefaults({ ...face, ...extra }),
        a.printingManaDefaults({ ...face, ...extra }),
      );
    const delta = b.printingManaAdjustment({
      ...face,
      symbolAdjustment: { mana: { dx: 0.5, scaleX: 1.02, spacing: 0.25 } },
    });
    assert.equal(delta.dx, 0.375);
    assert.equal(delta.spacing, 1);
    assert.equal(delta.scaleX, 0.98 * 1.02);
  } finally {
    await plain.close();
    await study.close();
  }
});

test('glyph study retains numeric and per-color controls and composes editor deltas', async () => {
  const controls = {
    ...parameters.rendererControls,
    numberScale: 0.99,
    numberDx: -0.2,
    numberDy: 0.3,
    glyphs: { U: { scale: 0.96, dx: -0.2, dy: 0.2 } },
  };
  for (const invalid of [
    { glyphs: { X: { scale: 1, dx: 0, dy: 0 } } },
    { glyphs: { U: { scale: 1.3, dx: 0, dy: 0 } } },
    { numberScale: NaN },
    { numberDy: 2 },
    { unknown: 1 },
  ])
    assert.throws(() =>
      modernManaStudy({
        ...parameters,
        rendererControls: { ...controls, ...invalid },
      }),
    );
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [modernManaStudy({ ...parameters, rendererControls: controls })],
  });
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const { printingManaDefaults, printingManaAdjustment } = await server.ssrLoadModule('/' + file);
    const face = {
      setCode: 'm21',
      typeLine: 'Creature',
      colors: ['U'],
      manaSymbols: ['2', 'U'],
    };
    const defaults = printingManaDefaults(face);
    for (const [key, value] of Object.entries(controls)) assert.deepEqual(defaults[key], value);
    const user = {
      numberScale: 1.1,
      numberDy: -0.1,
      glyphs: { U: { scale: 1.02, dx: 0.5 }, R: { dy: -0.25 } },
    };
    const adjusted = printingManaAdjustment({ ...face, symbolAdjustment: { mana: user } });
    assert.equal(adjusted.numberScale, 0.99 * 1.1);
    assert.equal(adjusted.numberDy, 0.3 - 0.1);
    assert.deepEqual(adjusted.glyphs.U, { scale: 0.96 * 1.02, dx: 0.3, dy: 0.2 });
    assert.deepEqual(adjusted.glyphs.R, { dy: -0.25 });
    assert.deepEqual(user.glyphs.U, { scale: 1.02, dx: 0.5 });
    assert.equal(printingManaDefaults({ ...face, setCode: 'war' }).glyphs, undefined);
  } finally {
    await server.close();
  }
});

test('paper and shadow study binds both material sources and preserves other printing policies', async () => {
  const costFile = 'games/magic/src/presentation/modern-cost-mana.ts';
  const paletteFile = 'games/magic/src/presentation/calibration-profiles.ts';
  const costSource = await readFile(costFile, 'utf8'),
    paletteSource = await readFile(paletteFile, 'utf8');
  const parametersWithColor = {
    ...parameters,
    paperTargets: { N: [206, 195, 195], B: [202, 193, 192], R: [242, 170, 134] },
    shadow: [-1.25, 2.25],
    source: {
      ...parameters.source,
      costSourceHash: hash(costSource),
      paletteSourceHash: hash(paletteSource),
    },
  };
  const plugin = modernManaStudy(parametersWithColor);
  assert.throws(
    () => plugin.transform(costSource + '\n', '/' + costFile),
    /Changed cost material source/,
  );
  assert.throws(
    () => plugin.transform(paletteSource + '\n', '/' + paletteFile),
    /Changed mana palette source/,
  );
  for (const invalid of [
    { paperTargets: { N: [-1, 2, 3] } },
    { shadow: [1, 2] },
    { shadow: [-1, Infinity] },
  ])
    assert.throws(() => modernManaStudy({ ...parametersWithColor, ...invalid }));
  const servers = await Promise.all(
    [[], [plugin]].map((plugins) =>
      createServer({
        configFile: false,
        optimizeDeps: { noDiscovery: true },
        server: { middlewareMode: true, hmr: false, ws: false },
        plugins,
      }),
    ),
  );
  try {
    const loaded = [];
    for (const server of servers) {
      await server.ssrLoadModule('/games/magic/src/data/eager.ts');
      loaded.push({
        cost: await server.ssrLoadModule('/' + costFile),
        palette: await server.ssrLoadModule(
          '/games/magic/src/presentation/printing-calibration-materials.ts',
        ),
      });
    }
    const [plain, study] = loaded;
    const face = {
      name: 'Cost',
      setCode: 'm21',
      typeLine: 'Creature',
      colors: ['R'],
      manaSymbols: ['2', 'R'],
      colorCalibration: 'set-hsb-v1',
    };
    assert.deepEqual(study.cost.modernCostMana(face).paper, [206, 195, 195]);
    assert.deepEqual(study.cost.modernCostMana(face).shadow, [-1.25, 2.25]);
    assert.deepEqual(study.palette.calibratedManaTarget(face, 'R'), [
      242 / 255,
      170 / 255,
      134 / 255,
    ]);
    assert.deepEqual(study.palette.calibratedManaTarget(face, 'B'), [
      202 / 255,
      193 / 255,
      192 / 255,
    ]);
    assert.equal(
      study.palette.calibratedManaTarget({ ...face, calibration: 'source' }, 'R'),
      undefined,
    );
    assert.deepEqual(
      study.cost.modernCostMana({ ...face, calibration: 'source' }).paper,
      [202, 197, 192],
    );
    for (const extra of [
      { setCode: 'war' },
      { frameAssetFamily: 'eighth' },
      { layout: 'planeswalker', typeLine: 'Planeswalker' },
      { manaSymbols: [] },
    ]) {
      assert.deepEqual(
        study.cost.modernCostMana({ ...face, ...extra }),
        plain.cost.modernCostMana({ ...face, ...extra }),
      );
    }
    assert.deepEqual(
      study.palette.calibratedManaTarget({ ...face, setCode: 'war' }, 'R'),
      plain.palette.calibratedManaTarget({ ...face, setCode: 'war' }, 'R'),
    );
    assert.deepEqual(
      study.palette.calibratedManaTarget(face, 'W'),
      plain.palette.calibratedManaTarget(face, 'W'),
    );
  } finally {
    for (const server of servers) await server.close();
  }
});

test('walker cohort uses its own circle placement and the same reviewed cost style without changing other frames', async () => {
  const costFile = 'games/magic/src/presentation/modern-cost-mana.ts';
  const paletteFile = 'games/magic/src/presentation/calibration-profiles.ts';
  const p = {
    ...parameters,
    walkerControls: {
      scaleX: 0.978,
      scaleY: 0.978,
      dx: -0.5,
      dy: -0.6875,
      spacing: 0.55,
      numberScale: 0.99,
    },
    paperTargets: { N: [206, 195, 195], W: [251, 249, 218], U: [190, 220, 249] },
    shadow: [-0.85, 2.35],
    source: {
      ...parameters.source,
      costSourceHash: hash(await readFile(costFile)),
      paletteSourceHash: hash(await readFile(paletteFile)),
    },
  };
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [modernManaStudy(p)],
  });
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const costs = await server.ssrLoadModule('/' + costFile),
      placements = await server.ssrLoadModule('/' + file),
      colors = await server.ssrLoadModule(
        '/games/magic/src/presentation/printing-calibration-materials.ts',
      );
    const face = {
      setCode: 'm21',
      typeLine: 'Legendary Planeswalker — Test',
      manaSymbols: ['3', 'U'],
      colorCalibration: 'set-hsb-v1',
    };
    for (const layout of [undefined, 'normal', 'planeswalker']) {
      const f = { ...face, layout };
      assert.equal(placements.printingManaDefaults(f).dy, -0.6875);
      assert.deepEqual(costs.modernCostMana(f).paper, [206, 195, 195]);
      assert(costs.modernCostNumeralAsset(f, '8').endsWith('/8.svg'));
      assert.deepEqual(colors.calibratedManaTarget(f, 'U'), [190 / 255, 220 / 255, 249 / 255]);
      assert.equal(colors.calibratedManaTarget({ ...f, calibration: 'source' }, 'U'), undefined);
    }
    for (const extra of [
      { setCode: 'war' },
      { frameAssetFamily: 'eighth' },
      { frameStyle: 'retro' },
      { frameTemplate: 'future' },
      { layout: 'split' },
      { manaSymbols: [] },
    ]) {
      const f = { ...face, ...extra };
      assert.equal(costs.modernCostMana(f), undefined);
      assert.equal(placements.printingManaDefaults(f), undefined);
    }
    assert.equal(placements.printingManaDefaults({ ...face, typeLine: 'Creature' }).dy, -0.25);
  } finally {
    await server.close();
  }
});
