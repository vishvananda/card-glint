import assert from 'node:assert/strict';
import { openBrowser } from '../games/magic/tools/accuracy/browser.mjs';
const session = await openBrowser({ entries: [], components: [] }, { fonts: false });
try {
  const result = await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const {
      modernPrintingProfile,
      modernOrdinaryPlates,
      modernLandPlates,
      modernWalkerBodyProfile,
    } = await import('/games/magic/src/presentation/modern-printing-profile.ts');
    const { printingCalibrationMaterials, calibratedManaTarget } = await import(
      '/games/magic/src/presentation/printing-calibration-materials.ts'
    );
    const { resolvePrintingCalibration } = await import(
      '/games/magic/src/presentation/printing-calibration.ts'
    );
    const { componentPrintingColorSource } = await import(
      '/games/magic/src/presentation/printing-color-source.ts'
    );
    const { registerSet } = await import('/games/magic/src/data/registry.ts');
    const check = (x, label) => {
      if (!x) throw Error(label);
    };
    const original = {
      name: 'Independent host card',
      setCode: 'qzz',
      frameStyle: 'modern',
      typeLine: 'Creature — Wizard',
      colors: ['U'],
      manaSymbols: ['2', 'U'],
      power: '2',
      toughness: '3',
      colorCalibration: 'set-hsb-v1',
      collectorNumber: '282',
      artist: 'Host artist',
      legalText: 'Host legal',
    };
    const saved = JSON.stringify(original),
      donor = modernPrintingProfile({ ...original, setCode: 'm21' }),
      profile = modernPrintingProfile(original);
    check(
      profile.inheritedFrom === 'm21' && profile.revision === donor.revision,
      'Missing labeled donor',
    );
    check(
      profile === modernPrintingProfile({ ...original, name: 'Other card' }),
      'Cache immutable shared defaults',
    );
    check(
      profile.printedLandRarities.length === 0 &&
        profile.foilStarNumbers.length === 0 &&
        profile.planeswalkers.deckCollectorNumbers.length === 0,
      'M21 printing content leaked',
    );
    check(JSON.stringify(original) === saved, 'Host input mutated');
    check(modernOrdinaryPlates(original), 'Ordinary native source default missing');
    const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
    check(
      canvasAssetUrls(original).some((url) => url?.endsWith('/m15/new/border.png')),
      'Inherited calibrated stock must request its border bitmap',
    );
    for (const setCode of [
      'lea',
      'leb',
      '2ed',
      '3ed',
      '4ed',
      'leg',
      '7ed',
      '8ed',
      '9ed',
      '10e',
      'plc',
      'lrw',
      'm14',
    ])
      check(
        !modernPrintingProfile({ ...original, setCode }),
        'Historical implicit era inherited ' + setCode,
      );
    for (const extra of [
      { frameStyle: 'retro' },
      { frameAssetFamily: 'eighth' },
      { frameTemplate: 'future' },
      { frameTemplate: 'flip' },
      { frameTreatment: 'colorshifted' },
      { calibration: 'printing' },
    ])
      check(
        !modernPrintingProfile({ ...original, ...extra }),
        'Excluded family/policy inherited ' + JSON.stringify(extra),
      );
    check(
      modernPrintingProfile({ ...original, setCode: 'lea', frameAssetFamily: 'm15-accurate' })
        .inheritedFrom === 'm21',
      'Explicit modern frame choice must override historical set era',
    );
    for (const layout of [
      'transform',
      'modal_dfc',
      'adventure',
      'prepare',
      'room',
      'saga',
      'class',
      'split',
    ]) {
      const special = { ...original, layout, faces: [{ ...original }, { ...original }] };
      check(
        modernPrintingProfile(special)?.inheritedFrom === 'm21',
        'Missing shared style for ' + layout,
      );
      check(
        !modernOrdinaryPlates(special) &&
          !modernLandPlates({ ...special, typeLine: 'Land', land: true }),
        'Ordinary geometry entered dedicated ' + layout,
      );
    }
    const deckNumber = donor.planeswalkers.deckCollectorNumbers[0];
    check(Boolean(deckNumber), 'Need an actual M21 printing-content control');
    const walker = {
      ...original,
      typeLine: 'Legendary Planeswalker — Teferi',
      collectorNumber: deckNumber,
      layout: 'planeswalker',
    };
    check(
      modernWalkerBodyProfile(walker),
      'Another set accidentally treated as M21 deck collector282',
    );
    check(!modernWalkerBodyProfile({ ...walker, setCode: 'm21' }), 'Exact M21 deck exception lost');
    const color = calibratedManaTarget(original, 'U');
    check(
      color?.every((v, i) => Math.abs(v - donor.mana.paperTargets.U[i] / 255) < 1e-12),
      'Mana paper fallback missing',
    );
    const resolved = printingCalibrationMaterials(original),
      report = resolvePrintingCalibration(original);
    check(
      resolved.fallbackAssets.length > 0 && resolved.fallbackStock,
      'Inherited color/stock unmarked',
    );
    check(
      report.defaults?.status === 'inherited' &&
        report.components.frame.status === 'fallback' &&
        report.components.manaSymbols.status === 'fallback',
      'Inherited styles reported as measured',
    );
    const raw = printingCalibrationMaterials({ ...original, calibration: 'source' });
    check(Object.keys(raw.materials).length === 0 && !raw.border, 'Source colors changed');
    const independentFace = { ...original, setCode: 'qx1', colors: ['R'] };
    const source = componentPrintingColorSource(independentFace);
    const materials = {
      [source.frame]: { hueDegrees: 7, saturationScale: 0.9, brightnessScale: 0.8 },
    };
    registerSet({
      set: 'qx1',
      kind: 'calibration',
      tables: {
        PRINTING_COLOR_PROFILES: {
          [source.key]: { source: source.source, materials },
        },
      },
    });
    check(
      !modernOrdinaryPlates(independentFace),
      'Independent component source replaced by donor plate',
    );
    const exact = printingCalibrationMaterials(independentFace);
    check(
      JSON.stringify(exact.materials[source.frame]) === JSON.stringify(materials[source.frame]),
      'Exact source-bound pigment lost to donor',
    );
    check(!exact.fallbackAssets.includes(source.frame), 'Independent fit labeled inherited');
    return {
      ordinary: true,
      dedicatedLayouts: 8,
      historicalEraControls: 13,
      contentIsolation: true,
      sourcePolicy: true,
      independentFit: true,
      sharedCache: true,
    };
  });
  assert.deepEqual(session.faults, []);
  console.log(JSON.stringify(result));
} finally {
  await session.close();
}
const lazy = await openBrowser({ entries: [], components: [] }, { fonts: false });
try {
  const result = await lazy.page.evaluate(async () => {
    const { prepareMagicCards, loadMagicSet, loadedMagicSets } = await import(
      '/games/magic/src/lazy.ts'
    );
    const { setTable } = await import('/games/magic/src/data/registry.ts');
    const check = (x, m) => {
      if (!x) throw Error(m);
    };
    check(loadedMagicSets().length === 0, 'Initial import loaded data');
    await prepareMagicCards([
      { name: 'Old', setCode: 'lea', frameStyle: 'retro' },
      { name: 'Eighth', setCode: '8ed', frameAssetFamily: 'eighth' },
      { name: 'Exact only', setCode: 'qx2', calibration: 'printing' },
    ]);
    check(!loadedMagicSets().includes('m21'), 'Older/exact-only cards fetched M21');
    await loadMagicSet('war');
    check(
      loadedMagicSets().includes('m21'),
      'Set-only callers lost their required shared style dependency',
    );
    const { modernPrintingProfile: preparedProfile } = await import(
      '/games/magic/src/presentation/modern-printing-profile.ts'
    );
    check(
      preparedProfile({
        name: 'Set-only host',
        setCode: 'war',
        typeLine: 'Creature',
        colors: ['U'],
      }).inheritedFrom === 'm21',
      'Set-only legacy preparation cannot resolve the new default',
    );

    const card = {
      name: 'Modern',
      setCode: 'qzz',
      frameStyle: 'modern',
      typeLine: 'Creature',
      colors: ['U'],
    };
    await Promise.all([prepareMagicCards([card]), prepareMagicCards([card])]);
    check(loadedMagicSets().includes('m21'), 'Modern preparation omitted donor');
    let wordingLoaded = true;
    try {
      setTable('m21', 'printingCorrections');
    } catch {
      wordingLoaded = false;
    }
    check(!wordingLoaded, 'Calibration imported M21 wording');
    const { modernPrintingProfile } = await import(
      '/games/magic/src/presentation/modern-printing-profile.ts'
    );
    check(
      modernPrintingProfile(card).inheritedFrom === 'm21',
      'Prepared slim entry differs from eager',
    );
    return { loaded: loadedMagicSets(), wordingLoaded };
  });
  assert.deepEqual(lazy.faults, []);
  console.log(JSON.stringify(result));
} finally {
  await lazy.close();
}
