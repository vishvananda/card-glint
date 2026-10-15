import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { legendsFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/legends-frame.ts',
  );
  const { retroFrameAsset, retroRects } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { titleTranslation } = await server.ssrLoadModule(
    '/games/magic/src/presentation/title-placement.ts',
  );
  for (const [colors, family] of [
    [['W'], 'abu'],
    [['B'], 'abu'],
    [['U'], 'fourth'],
    [['R'], 'fourth'],
    [['G'], 'fourth'],
    [['W', 'U'], 'fourth'],
  ]) {
    const original = { name: 'Probe', setCode: 'leg', typeLine: 'Summon Legend', colors };
    const oracle = { ...original, typeLine: 'Legendary Creature — Human Wizard' };
    assert.equal(legendsFrame(original).family, family);
    assert.equal(retroFrameAsset(original), retroFrameAsset(oracle));
    assert.deepEqual(retroRects(original), retroRects(oracle));
    assert.deepEqual(titleTranslation(original, 'retro'), [-18.5, -6]);
    assert.deepEqual(titleTranslation(oracle, 'retro'), [-18.5, -6]);
    assert.deepEqual(titleTranslation({ ...original, legendary: true }, 'retro'), [-18.5, -6]);
  }
  // Printed land/artifact semantics outrank their frame-color metadata.
  const land = { name: 'Karakas', setCode: 'leg', typeLine: 'Legendary Land', colors: ['W'] };
  assert.ok(retroFrameAsset(land).endsWith('/old/fourth/l.png'));
  assert.equal(
    retroFrameAsset({ ...land, typeLine: 'Land' }),
    retroFrameAsset({ ...land, typeLine: '', land: true }),
  );
  assert.ok(
    retroFrameAsset({
      ...land,
      land: false,
      artifact: true,
      typeLine: 'Artifact Creature',
    }).endsWith('/old/fourth/a.png'),
  );
  const ordinary = { name: 'Probe', setCode: 'leg', typeLine: 'Instant', colors: ['W'] };
  for (const override of [
    { setCode: 'arn' },
    { setCode: '3ed' },
    { setCode: 'chr' },
    { frameStyle: 'modern' },
    { frameTemplate: 'battle' },
    { layout: 'split' },
    { typeLine: 'Enchantment — Saga' },
  ]) {
    assert.equal(legendsFrame({ ...ordinary, ...override }), undefined);
    assert.deepEqual(titleTranslation({ ...ordinary, ...override }, 'retro'), [0, 0]);
  }
  assert.deepEqual(titleTranslation({ ...ordinary, borderColor: 'white' }, 'retro'), [0, 0]);
  assert.deepEqual(titleTranslation(land, 'retro'), [-18.5, -6]);
  assert.ok(retroFrameAsset({ ...ordinary, setCode: 'lea' }).endsWith('/old/abu/w.png'));
  assert.ok(retroFrameAsset({ ...ordinary, setCode: '3ed' }).endsWith('/old/fourth/w.png'));
  assert.ok(retroFrameAsset({ ...ordinary, setCode: 'arn' }).endsWith('/seventh/regular/w.png'));
  const { calibratedFrameMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const { LEGENDS_COLOR_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/legends-color-profiles.ts',
  );
  const study = JSON.parse(await readFile('games/magic/fixtures/accuracy/legends-colors.json'));
  const titles = JSON.parse(await readFile('games/magic/fixtures/accuracy/legends-titles.json'));
  assert.equal(titles.runtimeVerified, 72);
  assert.deepEqual(titles.translation, titleTranslation(ordinary, 'retro'));
  assert.equal(
    titles.results.reduce((n, r) => n + r.held, 0),
    36,
  );
  for (const result of titles.results) {
    assert.ok(result.after > result.before);
    assert.equal(result.improved, result.held);
    assert.equal(result.worstRegression, 0);
  }
  const geometry = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/early-frame-source-review.json'),
  );
  assert.equal(geometry.productionIntegration.exactMatches, 83);
  assert.equal(study.groups.length, 8);
  const landPins = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/legends-land-pins.json'),
  );
  const landColor = study.groups.find((g) => g.material === 'L');
  assert.equal(landPins.status, 'validated');
  assert.equal(landPins.asset, landColor.asset);
  assert.deepEqual(landPins.frame, landColor.rect);
  assert.deepEqual(landPins.accents, landColor.adjustment.accents);
  assert.equal(landColor.fit.frame.method, 'source-rgb-balance');
  assert.ok(landColor.fit.frame.pixelClipping <= 0.03);
  for (const region of Object.values(landPins.raster.regions)) {
    assert.ok(region.after < region.before && region.after <= 5);
    assert.ok(region.worstRegression <= 2);
    assert.equal(region.rows.filter((r) => r.cohort === 'calibration').length, 4);
    assert.equal(region.rows.filter((r) => r.cohort === 'validation').length, 4);
  }
  for (const group of study.groups) {
    const face = {
      ...ordinary,
      colors:
        group.material === 'M'
          ? ['W', 'U']
          : /[WUBRG]/.test(group.material)
            ? [group.material]
            : [],
      typeLine: group.material === 'A' ? 'Artifact' : group.material === 'L' ? 'Land' : 'Instant',
      colorCalibration: 'set-hsb-v1',
    };
    assert.ok(/^[a-f0-9]{64}$/.test(group.assetSha256));
    assert.equal(new Set(group.rows.map((r) => r.id)).size, group.rows.length);
    for (const cohort of ['calibration', 'validation'])
      assert.ok(group.rows.filter((r) => r.cohort === cohort).length >= 4);
    assert.deepEqual(calibratedFrameMaterials(face), { [group.asset]: group.adjustment });
    assert.deepEqual(calibratedFrameMaterials({ ...face, colorCalibration: undefined }), {});
    assert.deepEqual(calibratedFrameMaterials({ ...face, borderColor: 'white' }), {});
    assert.deepEqual(calibratedFrameMaterials({ ...face, frameStyle: 'modern' }), {});
    for (const component of ['frame', 'paper']) {
      if (!group.accepted[component]) {
        assert.equal(group.actual[component].after, group.actual[component].before);
        continue;
      }
      assert.ok(group.actual[component].after <= 5);
      assert.ok(group.actual[component].after <= group.actual[component].before + 0.15);
      assert.ok(group.actual[component].worstRegression <= 2);
      assert.ok(group.predicted[component].clipping <= 0.03);
    }
    for (const [key, value] of Object.entries(group.actualTexture))
      assert.ok(value.after <= value.before + (key === 'contrastError' ? 0.5 : 0.25));
    // A calibration is invalidated by changed geometry/source identity. It must
    // not silently inherit a fit from the old Seventh/Legends plate.
    const profile = LEGENDS_COLOR_PROFILES['leg/black/retro/' + group.asset.split('/').at(-1)];
    const saved = profile.source;
    try {
      profile.source = 'different source or geometry';
      assert.deepEqual(calibratedFrameMaterials(face), {});
    } finally {
      profile.source = saved;
    }
  }
  console.log(
    'Legends frame sources, original/Oracle equivalence, measured color gates and source/geometry guards pass.',
  );
} finally {
  await server.close();
}
