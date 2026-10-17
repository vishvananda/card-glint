import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { darkTypographyProof } from './magic-dark-type-source-guard.mjs';

await darkTypographyProof();
const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-dark-typography.json'),
);
assert.equal(evidence.status, 'integrated-shared-profile-transfer');
for (const row of evidence.metrics.rows)
  for (const value of Object.values(row.components)) {
    assert.ok(value.gain > 0, row.name);
    for (const metric of ['edge', 'filledArea'])
      assert.ok(value.after[metric] > value.before[metric], row.name + ': ' + metric);
  }
assert.equal(evidence.fullScores.summary.all.improved, 7);
for (const value of Object.values(evidence.metrics.summary))
  for (const metric of ['edge', 'contrast', 'filledArea'])
    assert.ok(value.after[metric] > value.before[metric]);
const city = evidence.metrics.rows.find((row) => row.name === 'City of Shadows');
assert.ok(city.components.title.after.contrast < city.components.title.before.contrast);
// Do not hide the land ink-width limitation behind the combined objective.
for (const kind of ['title', 'artist']) {
  const result = evidence.metrics.summary['L/validation/' + kind];
  assert.ok(result.after.strokeWidthError > result.before.strokeWidthError);
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const modules = {};
  for (const kind of ['title', 'artist', 'stats'])
    modules[kind] = await server.ssrLoadModule(
      '/games/magic/src/presentation/early-expansion-' + kind + '.ts',
    );
  for (const colors of [[], ['B', 'R'], ['G', 'R'], ['B', 'G']]) {
    const face = {
      name: 'Typography transfer probe',
      setCode: 'drk',
      colors,
      typeLine: colors.length ? 'Summon Goblins' : 'Land',
      power: colors.length ? '2' : undefined,
      toughness: colors.length ? '2' : undefined,
    };
    for (const [kind, fn] of Object.entries({
      title: modules.title.earlyExpansionTitle,
      artist: modules.artist.earlyExpansionArtist,
      stats: modules.stats.earlyExpansionStats,
    })) {
      assert.deepEqual(
        fn(face),
        kind === 'stats' && !colors.length ? undefined : evidence.profiles[kind],
      );
      assert.deepEqual(fn({ ...face, setCode: 'DRK', wordingMode: 'oracle' }), fn(face));
      for (const change of [
        { frameTemplate: 'future' },
        { frameStyle: 'modern' },
        { layout: 'split' },
        { borderColor: 'white' },
        { legendary: true },
        { typeLine: 'Enchantment — Saga' },
      ])
        assert.equal(fn({ ...face, ...change }), undefined);
      for (const unsupportedColors of [[], ['W', 'U', 'B']])
        assert.equal(fn({ ...face, typeLine: 'Creature', colors: unsupportedColors }), undefined);
    }
  }
  console.log(
    'Dark typography: seven exact transfers, filled-ink checks, preserved regions and scope pass.',
  );
} finally {
  await server.close();
}
