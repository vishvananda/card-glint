import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { loadMagicSet, prepareMagicCards, loadedMagicSets } = await server.ssrLoadModule(
    '/games/magic/src/data/load.ts',
  );
  const { calibrationForFace } = await server.ssrLoadModule(
    '/games/magic/src/calibration/selection.ts',
  );
  const { setCalibrationProfile } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  const { oldFrameDefaults } = await server.ssrLoadModule(
    '/games/magic/src/calibration/old-frame-default-values.ts',
  );
  const { inheritedOldFrameDefault, inheritedOldFrameManaBase, retainsOldFrameComponent } =
    await server.ssrLoadModule('/games/magic/src/calibration/old-frame-defaults.ts');
  const { earlyReprintTitle } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-title.ts',
  );
  const { earlyReprintType } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-type.ts',
  );
  const { earlyReprintMana } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-mana.ts',
  );
  const { earlyReprintFooter } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-footer.ts',
  );
  const { earlyReprintFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-frame.ts',
  );
  const { isRetro } = await server.ssrLoadModule('/games/magic/src/presentation/retro-frame.ts');
  const report = JSON.parse(
    await (
      await import('node:fs/promises')
    ).readFile('games/magic/fixtures/accuracy/mirage-onslaught/default-donor-review.json'),
  );
  const mono = {
    name: 'Control',
    typeLine: 'Summon Wizard',
    canonicalTypeLine: 'Creature — Wizard',
    colors: ['U'],
    frameStyle: 'retro',
    wordingMode: 'original',
  };
  for (const row of report.sets) {
    await loadMagicSet(row.set);
    const spec = oldFrameDefaults[row.set];
    assert.equal(spec.donor, row.recommended);
    const face = { ...mono, setCode: row.set, borderColor: spec.border };
    const profile = calibrationForFace(face),
      donor = setCalibrationProfile(spec.donor);
    assert(profile && donor, row.set);
    const initial = JSON.stringify(donor);
    assert.equal(profile.set, row.set);
    assert.equal(profile.border, spec.border);
    assert.equal(
      calibrationForFace({ ...face, name: 'Second card' }),
      profile,
      'Per-card profile cloning',
    );
    assert.deepEqual(profile.frames, donor.frames);
    if (row.set === 'ice') continue;
    for (const [key, value] of Object.entries(spec.pigment ?? {})) {
      assert.equal(value.source, donor.colors[key].source, 'Stale pigment source binding');
      assert.deepEqual(profile.colors[key].adjustment.frame, value.frame);
      assert.deepEqual(profile.colors[key].adjustment.paper, value.paper);
    }
    if (spec.palette === 'ons' || Object.values(spec.materialPalettes ?? {}).includes('ons'))
      assert(loadedMagicSets().includes('ons'), 'Color donor was not loaded');
    const fresh = { ...face, frameStyle: 'modern' };
    assert.equal(inheritedOldFrameDefault(fresh), undefined);
    assert(
      !profile.setSymbols &&
        !profile.setSymbolSource &&
        !profile.landMaterials &&
        !profile.dualLand,
    );
    assert.equal(profile.footer.legal.defaultText, undefined);
    assert.equal(profile.footer.legal.collectorTotal, undefined);
    assert.equal(earlyReprintFooter(face), undefined, 'Target footer must remain in charge');
    for (const role of ['title', 'type', 'mana', 'rules'])
      assert.equal(retainsOldFrameComponent(face, role), spec.retain.includes(role));
    assert.equal(!!earlyReprintTitle(face), !spec.retain.includes('title'));
    assert.equal(!!earlyReprintType(face), !spec.retain.includes('type'));
    assert.equal(earlyReprintMana(face), !spec.retain.includes('mana'));
    if (spec.retain.includes('rules')) {
      for (const key of [
        'body',
        'bodyClasses',
        'expansionBody',
        'textTiers',
        'rulesPlacement',
        'rulesAdjustments',
      ])
        assert.equal(profile[key], undefined, row.set + ': ' + key);
    }
    assert.equal(
      !!inheritedOldFrameManaBase(face),
      !spec.retain.includes('mana') && spec.donor !== 'ons',
    );
    assert.equal(
      isRetro({ ...face, frameStyle: undefined }),
      true,
      'Known supplemental old set not recognized',
    );
    for (const changed of [
      { calibration: 'printing' },
      { frameStyle: 'modern' },
      { frameTemplate: 'custom' },
      { frameAssetFamily: 'fourth' },
      { layout: 'split' },
      { faces: [mono, mono] },
      { borderColor: 'silver' },
      { typeLine: 'Enchantment — Saga' },
    ]) {
      assert.equal(inheritedOldFrameDefault({ ...face, ...changed }), undefined);
      assert.equal(earlyReprintFrame({ ...face, ...changed }), undefined);
    }
    const otherBorder = spec.border === 'black' ? 'white' : 'black';
    const other = calibrationForFace({ ...face, borderColor: otherBorder });
    assert.equal(other.border, otherBorder);
    assert.notEqual(other, profile);
    for (const color of Object.values(other.colors))
      if (color) assert.equal(color.stock, otherBorder === 'white' ? '#eeedeb' : '#181510');
    assert.equal(JSON.stringify(donor), initial, 'Shared donor was mutated');
  }
  for (const set of ['mir', 'ons']) {
    await prepareMagicCards([{ ...mono, setCode: set }]);
    assert.equal(
      calibrationForFace({ ...mono, setCode: set }),
      setCalibrationProfile(set),
      'Independent profile lost precedence',
    );
    assert.equal(inheritedOldFrameDefault({ ...mono, setCode: set }), undefined);
  }
  assert.equal(inheritedOldFrameDefault({ ...mono, setCode: 'unknown' }), undefined);
  assert(loadedMagicSets().includes('mir') && loadedMagicSets().includes('4ed'));
  console.log(
    'All34 runtime default mappings: lazy donors, immutable cached profiles, independent precedence, retained components, printing-fact isolation, surround overrides and special-layout exclusions pass.',
  );
} finally {
  await server.close();
}
