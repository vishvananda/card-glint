import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const rebindings = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/revised-frame-native.json'),
).bindings;
const fit = JSON.parse(await readFile('games/magic/fixtures/accuracy/five-set-hsb-results.json')),
  adoption = JSON.parse(await readFile('games/magic/fixtures/accuracy/five-set-hsb-adoption.json'));
const m21 = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/m21-normal-color-adoption.json'),
);
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { PRINTING_COLOR_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-profiles.ts',
  );
  const { calibratedFrameMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const { colorCalibrationCoverage } = await server.ssrLoadModule(
    '/games/magic/src/presentation/color-calibration-coverage.ts',
  );
  const planar = {
    name: 'Planar material coverage',
    setCode: 'plc',
    frameAssetFamily: 'eighth',
    colors: ['U'],
    typeLine: 'Creature',
    colorCalibration: 'set-hsb-v1',
  };
  for (const frameTreatment of [undefined, 'colorshifted']) {
    const face = { ...planar, frameTreatment },
      materials = calibratedFrameMaterials(face);
    assert.equal(Object.keys(materials).length, 1);
    assert.equal(colorCalibrationCoverage(face).frame, true);
    assert.ok(
      Object.keys(materials)[0].endsWith(frameTreatment ? '/colorshifted/u.png' : '/8th/u.png'),
    );
    for (const excluded of [
      { colorCalibration: undefined },
      { setCode: 'fut' },
      { borderColor: 'white' },
      { layout: 'token' },
    ])
      assert.deepEqual(calibratedFrameMaterials({ ...face, ...excluded }), {});
  }
  assert.deepEqual(calibratedFrameMaterials({ ...planar, typeLine: 'Land', colors: [] }), {});
  const mana = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/showcased-mana-colors.json'),
  );
  const { MANA_PRINTING_TARGETS } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-printing-profiles.ts',
  );
  let manaTargets = 0;
  for (const set of mana.sets) {
    assert.equal(set.rows.length, 72);
    assert.equal(new Set(set.rows.map((r) => r.id)).size, 72);
    assert.ok(set.rows.every((r) => /^[a-f0-9]{64}$/.test(r.referenceHash)));
    for (const group of set.groups) {
      const key = `${set.set}-${['3ed', '8ed'].includes(set.set) ? 'white' : 'black'}-${group.color}`;
      assert.equal(Object.hasOwn(MANA_PRINTING_TARGETS, key), group.adopt);
      if (!group.adopt) continue;
      manaTargets++;
      assert.ok(group.training >= 3 && group.held >= 3);
      assert.ok(group.after < group.before - 0.25 && group.worstRegression <= 3);
      assert.deepEqual(MANA_PRINTING_TARGETS[key], group.target);
      assert.equal(group.rasterValidation.adopt, true);
      assert.ok(group.rasterValidation.after < group.rasterValidation.before - 0.25);
      assert.ok(group.rasterValidation.worstRegression <= 3);
    }
  }
  assert.equal(manaTargets, 13);
  const admitted = adoption.results.filter((r) => r.status !== 'review-only');
  assert.deepEqual(
    Object.keys(PRINTING_COLOR_PROFILES).sort(),
    [...new Set([...admitted.map((r) => r.key), ...rebindings.map((r) => r.key), m21.key])].sort(),
  );
  for (const set of ['lea', 'leb', '3ed', '8ed', 'm21'])
    assert.ok(
      admitted.some((r) => r.key.startsWith(set + '/')),
      set,
    );
  for (const row of admitted) {
    const study = fit.groups.find((g) => g.key === row.key),
      face = { ...study.probe, name: 'Coverage probe', colorCalibration: 'set-hsb-v1' },
      materials = calibratedFrameMaterials(face);
    const rebound = rebindings.find((r) => r.key === row.key);
    assert.equal(
      PRINTING_COLOR_PROFILES[row.key].source,
      rebound?.afterSource ?? study.source.source,
    );
    if (rebound) {
      assert.equal(rebound.beforeSource, study.source.source);
      assert.deepEqual(PRINTING_COLOR_PROFILES[row.key].materials, rebound.materials);
    }
    const pigment = Object.fromEntries(
      Object.entries(materials).map(
        ([url, { blackPoint, outerStock, outerStockMaskSource, ...value }]) => [url, value],
      ),
    );
    assert.deepEqual(pigment, PRINTING_COLOR_PROFILES[row.key].materials, row.key);
    assert.equal(colorCalibrationCoverage(face).frame, true, row.key);
    assert.deepEqual(calibratedFrameMaterials({ ...face, colorCalibration: undefined }), {});
    assert.deepEqual(calibratedFrameMaterials({ ...face, setCode: 'unmeasured' }), {});
    assert.deepEqual(calibratedFrameMaterials({ ...face, layout: 'token' }), {});
    assert.ok(study.rows.filter((r) => r.cohort === 'calibration').length >= 3);
    assert.ok(study.rows.filter((r) => r.cohort === 'validation').length >= 3);
    const ids = study.rows.map((r) => r.id);
    assert.equal(ids.length, new Set(ids).size, 'Calibration and validation must be disjoint');
    assert.deepEqual(row.flags, []);
    for (const c of ['frame', 'paper']) {
      if (!row.accepted[c]) continue;
      assert.ok(row.measurements[c].after <= row.measurements[c].before + 0.15);
      assert.ok(row.measurements[c].worstRegression <= 2);
      assert.ok(study.validation[c].after <= 5);
      assert.ok(!study.flags.some((f) => f.startsWith(c + '-')));
    }
  }
  const modern = {
    name: 'Probe',
    setCode: 'm21',
    colors: ['U'],
    typeLine: 'Instant',
    colorCalibration: 'set-hsb-v1',
  };
  assert.equal(colorCalibrationCoverage(modern).frame, true);
  assert.equal(
    colorCalibrationCoverage({ ...modern, frameAssetFamily: 'm15-accurate' }).frame,
    false,
    'A component fit must not recolor a different plate',
  );
  assert.equal(
    colorCalibrationCoverage({ ...modern, borderColor: 'white' }).frame,
    false,
    'Stock is part of calibration identity',
  );
  console.log(
    `${admitted.length} source-bound color profiles cover five sets; holdouts, independent component gates and opt-in guards pass.`,
  );
} finally {
  await server.close();
}
