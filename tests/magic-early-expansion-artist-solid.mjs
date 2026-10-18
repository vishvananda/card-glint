import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { readPreArtistHostSource, readNativeHostSource } from './magic-native-source-guard.mjs';

const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-artist-solid.json'),
);
await readPreArtistHostSource('games/magic/src/presentation/early-expansion-artist.ts');
assert.equal(evidence.validationKind, 'repeated');
assert.equal(evidence.trainingIds.length, 99);
assert.equal(new Set(evidence.trainingIds).size, 99);
assert.equal(evidence.rows.length, 306);
assert.equal(evidence.visualReview.reviewedIds.length, 41);
assert.deepEqual(evidence.visualReview.displaySize, [488, 56]);
for (const id of evidence.trainingIds)
  assert.equal(evidence.rows.find((row) => row.id === id)?.cohort, 'calibration');
assert.ok(!evidence.trainingIds.includes('b7705328-4b5d-4383-9abe-75fca9c32c09'));
for (const [file, expected] of Object.entries(evidence.sourceGuards))
  assert.equal(
    hash(await readNativeHostSource(file)),
    expected,
    'Stale artist ink evidence: ' + file,
  );
for (const set of ['arn', 'atq', 'drk']) {
  const group = evidence.summary[set + '/validation'];
  for (const metric of ['edge', 'contrast', 'filledArea', 'objective'])
    assert.ok(group.after[metric] > group.before[metric], `${set}: ${metric}`);
  for (const row of evidence.rows.filter((row) => row.set === set)) {
    assert.equal(row.before.crops.length, 3);
    assert.equal(row.after.crops.length, 3);
  }
}
// Retain the observed DRK limitation rather than hiding it behind aggregate gains.
const dark = evidence.summary['drk/validation'];
assert.ok(dark.after.strokeWidthError > dark.before.strokeWidthError);
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { earlyExpansionArtist } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-artist.ts',
  );
  const normal = { typeLine: 'Summon Wizard', colors: ['U'], frameStyle: 'retro' };
  for (const setCode of ['arn', 'atq', 'drk']) {
    const expected = evidence.profiles[setCode],
      profile = earlyExpansionArtist({ ...normal, setCode });
    for (const key of ['size', 'x', 'y', 'width', 'trim', 'shadow'])
      assert.equal(profile[key], expected[key]);
    for (const change of [
      { frameStyle: 'modern' },
      { layout: 'split' },
      { frameTemplate: 'future' },
      { borderColor: 'white' },
      { legendary: true },
      { colors: setCode === 'drk' ? ['U', 'R', 'G'] : ['U', 'R'] },
      { typeLine: 'Planeswalker' },
    ])
      assert.equal(earlyExpansionArtist({ ...normal, setCode, ...change }), undefined);
    assert.ok(earlyExpansionArtist({ setCode, typeLine: 'Artifact', colors: [] }));
  }
  for (const setCode of ['lea', 'leb', '2ed', '3ed', 'leg', '4ed', '8ed', 'm21'])
    assert.equal(earlyExpansionArtist({ ...normal, setCode }), undefined);
  for (const setCode of ['arn', 'atq'])
    assert.ok(earlyExpansionArtist({ setCode, typeLine: 'Land', colors: [] }));
  assert.deepEqual(
    earlyExpansionArtist({ setCode: 'drk', typeLine: 'Land', colors: [] }),
    earlyExpansionArtist({ ...normal, setCode: 'drk' }),
  );
  console.log('Artist ink: 306 native candidates, 316 isolated cards, 84 controls and scope pass.');
} finally {
  await server.close();
}
