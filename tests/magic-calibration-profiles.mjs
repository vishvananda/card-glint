import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { MAJOR_SYMBOL_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/major-symbol-profiles.ts',
  );
  const { MAJOR_FRAME_INSETS } = await server.ssrLoadModule(
    '/games/magic/src/presentation/major-frame-profiles.ts',
  );
  const { calibratedStyledSymbolBounds } = await server.ssrLoadModule(
    '/games/magic/src/presentation/styled-symbol-placement.ts',
  );
  const { normalFrameInset } = await server.ssrLoadModule(
    '/games/magic/src/presentation/normal-frame-geometry.ts',
  );
  const { styledSetSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/styled-set-symbols.ts',
  );
  const { colorCalibrationCoverage } = await server.ssrLoadModule(
    '/games/magic/src/presentation.ts',
  );
  const report = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/major-set-calibration.json'),
  );
  assert.equal(report.complete, true);
  const approved = report.rows.filter((r) => r.status === 'validated-symbol-profile');
  assert.deepEqual(Object.keys(MAJOR_SYMBOL_PROFILES).sort(), approved.map((r) => r.key).sort());
  for (const row of approved) {
    assert.equal(row.symbol.flags.length, 0);
    assert.ok(row.symbol.after - row.symbol.before >= 0.005);
    assert.deepEqual(
      MAJOR_SYMBOL_PROFILES[row.key],
      row.symbol.params.map((n) => Math.round(n * 1e6) / 1e6),
    );
  }
  assert.deepEqual(
    Object.keys(MAJOR_FRAME_INSETS).sort(),
    report.rows
      .filter((r) => r.frameCalibration?.status === 'validated')
      .map((r) => `${r.set}/${r.border}`)
      .sort(),
  );
  // A measured NCC placement shrinks around the center vertically, while dx
  // locates its right edge. It must not leak to another stock or custom asset.
  const face = { name: 'Probe', setCode: 'ncc', typeLine: 'Creature', borderColor: 'black' };
  const bounds = [400, 390, 40, 20],
    url = styledSetSymbol('ncc', 'rare');
  const actual = calibratedStyledSymbolBounds(face, url, bounds, 'component');
  assert.ok(actual.every((n, i) => Math.abs(n - [397.6, 388.8, 38.4, 18.4][i]) < 1e-9));
  for (const f of [
    { ...face, borderColor: 'white' },
    { ...face, setSymbol: url },
    { ...face, layout: 'token' },
    { ...face, legendary: true },
  ])
    assert.equal(calibratedStyledSymbolBounds(f, url, bounds, 'component'), bounds);
  assert.equal(
    calibratedStyledSymbolBounds(face, 'https://example.test/s.svg', bounds, 'component'),
    bounds,
  );
  assert.equal(calibratedStyledSymbolBounds(face, url, bounds, 'retro'), bounds);
  const sixth = { name: 'Probe', setCode: '6ed', borderColor: 'white' };
  const sixthBounds = calibratedStyledSymbolBounds(
    sixth,
    styledSetSymbol('6ed', 'uncommon'),
    bounds,
    'retro',
  );
  assert.ok(sixthBounds.every((n, i) => Math.abs(n - [398.8, 387.2, 43.2, 21.6][i]) < 1e-9));
  for (const f of [
    { ...sixth, borderColor: 'black' },
    { ...sixth, setSymbol: 'custom' },
  ])
    assert.equal(
      calibratedStyledSymbolBounds(f, styledSetSymbol('6ed', 'rare'), bounds, 'retro'),
      bounds,
    );
  assert.equal(
    calibratedStyledSymbolBounds(sixth, styledSetSymbol('6ed', 'rare'), bounds, 'component'),
    bounds,
  );
  assert.equal(normalFrameInset({ name: 'Probe', setCode: 'blb', borderColor: 'black' }), 1);
  assert.equal(normalFrameInset({ name: 'Probe', setCode: 'blb', borderColor: 'white' }), 0);
  assert.equal(normalFrameInset({ name: 'Probe', setCode: 'blb', legendary: true }), 0);
  const revised = {
    name: 'Probe',
    setCode: '3ed',
    frameStyle: 'retro',
    typeLine: 'Instant',
    colors: ['W'],
    colorCalibration: 'set-hsb-v1',
    manaSymbols: ['W', '1'],
  };
  assert.equal(colorCalibrationCoverage(revised).frame, true);
  assert.ok(colorCalibrationCoverage(revised).manaSymbols.includes('W'));
  assert.equal(colorCalibrationCoverage({ ...revised, colors: ['G'] }).frame, true);
  assert.deepEqual(colorCalibrationCoverage({ ...revised, colorCalibration: undefined }), {
    frame: false,
    manaSymbols: [],
  });
  assert.equal(colorCalibrationCoverage({ ...revised, frameStyle: 'modern' }).frame, false);
  const { calibratedManaTarget } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const beta = {
    ...revised,
    setCode: 'leb',
    borderColor: 'black',
    manaSymbols: ['W', 'U', 'B', 'R', 'G', '1'],
  };
  const materials = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/beta-mana-materials.json'),
  );
  const { MANA_PRINTING_TARGETS } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-printing-profiles.ts',
  );
  for (const row of materials.groups) {
    // Routing uses the later full-set audit; retain the historical measurements
    // as historical evidence rather than relabeling them with new RGB values.
    assert.deepEqual(
      calibratedManaTarget(beta, row.color),
      MANA_PRINTING_TARGETS['leb-black-' + row.color],
    );
    assert.equal(
      calibratedManaTarget({ ...beta, colorCalibration: undefined }, row.color),
      undefined,
    );
    assert.equal(calibratedManaTarget({ ...beta, borderColor: 'white' }, row.color), undefined);
    assert.ok(row.training >= 10 && row.held >= 10);
  }
  assert.deepEqual(colorCalibrationCoverage(beta).manaSymbols, beta.manaSymbols);
  console.log(
    `${approved.length} raster-approved symbol profiles, frame/source/stock guards, and public color coverage pass.`,
  );
} finally {
  await server.close();
}
