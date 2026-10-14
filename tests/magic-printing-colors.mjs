import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const fit = JSON.parse(await readFile('games/magic/fixtures/accuracy/five-set-hsb-results.json')),
  adoption = JSON.parse(await readFile('games/magic/fixtures/accuracy/five-set-hsb-adoption.json'));
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
  const admitted = adoption.results.filter((r) => r.status !== 'review-only');
  assert.deepEqual(Object.keys(PRINTING_COLOR_PROFILES).sort(), admitted.map((r) => r.key).sort());
  for (const set of ['lea', 'leb', '3ed', '8ed', 'm21'])
    assert.ok(
      admitted.some((r) => r.key.startsWith(set + '/')),
      set,
    );
  for (const row of admitted) {
    const study = fit.groups.find((g) => g.key === row.key),
      face = { ...study.probe, name: 'Coverage probe', colorCalibration: 'set-hsb-v1' },
      materials = calibratedFrameMaterials(face);
    assert.equal(PRINTING_COLOR_PROFILES[row.key].source, study.source.source);
    assert.deepEqual(materials, PRINTING_COLOR_PROFILES[row.key].materials, row.key);
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
