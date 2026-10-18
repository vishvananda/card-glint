import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { darkSymbolProof } from './magic-dark-symbol-source-guard.mjs';

await darkSymbolProof();
const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-dark-symbols.json'),
);
assert.equal(evidence.status, 'integrated-shared-symbol-calibration');
assert.equal(evidence.rows.filter((r) => r.eligible).length, 121);
const qualified = evidence.rows.filter((r) => r.geometryFitEligible);
assert.equal(qualified.length, 120);
const regressed = qualified.filter((r) =>
  r.before.some((before, i) =>
    ['edgeF1', 'contrast', 'filledArea'].some((key) => r.after[i][key] < before[key]),
  ),
);
assert.deepEqual(
  regressed.map((r) => r.name),
  ['Water Wurm'],
);
assert.deepEqual(
  evidence.rows.filter((r) => !r.eligible).map((r) => r.name),
  ['Ball Lightning'],
);
assert.deepEqual(
  evidence.rows.filter((r) => r.eligible && !r.geometryFitEligible).map((r) => r.collectorNumber),
  ['77†'],
);
for (const cohort of ['calibration', 'validation']) {
  const before = evidence.balanced[cohort + '/before'],
    after = evidence.balanced[cohort + '/proposed'];
  for (const metric of ['edgeF1', 'contrast', 'filledArea'])
    assert.ok(after[metric] > before[metric]);
  assert.ok(after.strokeWidthError < before.strokeWidthError);
  const black = evidence.summary['B/' + cohort];
  assert.ok(black.rim.edgeF1 > black.ink.edgeF1);
  assert.ok(black.rim.contrast > black.ink.contrast);
  // Retain the weak stroke-width result, rather than hiding it in the aggregate.
  assert.ok(black.rim.strokeWidthError > black.before.strokeWidthError);
}
assert.equal(evidence.ink.improved, 120);
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { calibratedStyledSymbolBounds } = await server.ssrLoadModule(
    '/games/magic/src/presentation/styled-symbol-placement.ts',
  );
  const { styledSetSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/styled-set-symbols.ts',
  );
  const base = [424, 388, 21, 18.5],
    face = { name: 'Crescent probe', setCode: 'drk', typeLine: 'Creature' },
    url = styledSetSymbol('drk');
  const actual = calibratedStyledSymbolBounds(face, url, base, 'retro');
  const [dx, dy, sx, sy] = evidence.profiles.delta;
  assert.deepEqual(actual, [445 + dx - 21 * sx, 397.25 + dy - (18.5 * sy) / 2, 21 * sx, 18.5 * sy]);
  for (const change of [{ setSymbol: url }, { layout: 'split' }, { borderColor: 'white' }])
    assert.deepEqual(
      calibratedStyledSymbolBounds({ ...face, ...change }, url, base, 'retro'),
      base,
    );
  assert.deepEqual(calibratedStyledSymbolBounds(face, 'custom.svg', base, 'retro'), base);
  console.log(
    'Dark symbols: native isolation, independent metrics, retained outliers and scope pass.',
  );
} finally {
  await server.close();
}
