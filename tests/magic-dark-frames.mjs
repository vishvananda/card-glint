import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { darkCalibrationProof } from './magic-dark-source-guard.mjs';

await darkCalibrationProof();
const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-dark-frames.json'),
);
assert.equal(evidence.normalization.status, 'normalized-references-frozen');
assert.equal(evidence.normalization.replay.length, 18);
for (const row of evidence.normalization.replay) {
  assert.ok(row.accepted);
  assert.ok(row.support.residualRms < 0.4);
  assert.ok(row.texture.objective >= 0.65);
}
for (const row of evidence.normalization.synthetic) {
  assert.ok(row.accepted);
  assert.ok(row.maxCorner < 0.6);
}
for (const row of evidence.color.rows)
  for (const value of Object.values(row.metrics)) assert.ok(value.after < value.before);
for (const [material, group] of Object.entries(evidence.groups)) {
  assert.equal(group.reservedNames.length, 2);
  assert.equal(group.trainingNames.length, material === 'L' ? 2 : 1);
  const v = evidence.geometry.summary[material].validation;
  assert.ok(v.candidate.boundary > v.baseline.boundary);
  assert.ok(v.candidate.texture['1.5'] > v.baseline.texture['1.5']);
  assert.ok(evidence.color.clipping[material].fraction < 0.03);
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { earlyExpansionFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-frame.ts',
  );
  const { earlyExpansionColors } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-colors.ts',
  );
  const { earlyExpansionTitle } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-title.ts',
  );
  const { earlyExpansionArtist } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-artist.ts',
  );
  for (const material of ['L', 'M']) {
    const original = {
      name: 'Frame probe',
      setCode: 'drk',
      typeLine: material === 'L' ? 'Land' : 'Summon Goblins',
      colors: material === 'L' ? [] : ['G', 'R'],
      colorCalibration: 'set-hsb-v1',
    };
    const expected = evidence.groups[material];
    const frame = earlyExpansionFrame(original);
    assert.equal(frame.family, material === 'L' ? 'abu' : 'fourth');
    assert.deepEqual(frame.frame, expected.geometry.frame);
    assert.deepEqual(frame.art, expected.geometry.art);
    assert.deepEqual(earlyExpansionColors(original), {
      materials: { [frame.asset]: expected.profile.adjustment },
      stock: expected.profile.stock,
    });
    assert.deepEqual(
      earlyExpansionFrame({
        ...original,
        wordingMode: 'oracle',
        typeLine: material === 'L' ? 'Land' : 'Creature — Goblin',
      }),
      frame,
    );
    // Geometry must not accidentally opt unreviewed typography into another fit.
    assert.equal(earlyExpansionTitle(original), undefined);
    assert.equal(earlyExpansionArtist(original), undefined);
    for (const override of [
      { colorCalibration: undefined },
      { borderColor: 'white' },
      { borderColor: 'silver' },
      { frameStyle: 'modern' },
      { frameTemplate: 'future' },
      { layout: 'split' },
      { typeLine: 'Enchantment — Saga' },
      { setCode: 'leg' },
      { setCode: 'lea' },
    ])
      assert.equal(earlyExpansionColors({ ...original, ...override }), undefined);
  }
  // Other unsupported early multicolor cards must not inherit the DRK profile.
  for (const setCode of ['arn', 'atq'])
    assert.equal(
      earlyExpansionFrame({ name: 'Probe', setCode, colors: ['G', 'R'], typeLine: 'Summon' }),
      undefined,
    );
  for (const typeLine of ['Basic Land — Forest', 'Forest'])
    assert.equal(earlyExpansionFrame({ name: 'Forest', setCode: 'drk', typeLine }), undefined);
  console.log('Dark land/gold scan-only poses, native parity, colors and scoped selection pass.');
} finally {
  await server.close();
}
