import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preTitleCalibrationSource } from './magic-title-source-guard.mjs';

const receipt = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-titles.json'),
);
const scores = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-title-scores.json'),
);
assert.equal(scores.rendererHash, receipt.rendererHash);
assert.equal(
  scores.titleEvidenceHash,
  hash(await readFile('games/magic/fixtures/accuracy/early-expansion-titles.json')),
);
assert.equal(scores.total, 316);
assert.equal(scores.scored, 306);
for (const row of scores.rows.filter((r) => r.after)) {
  assert.equal(row.nonTitleComponentsUnchanged, true);
  assert.equal(row.before.coverage, row.after.coverage);
  assert.equal(row.afterHash, receipt.rows.find((r) => r.id === row.id).after);
}
for (const group of Object.values(scores.sets)) assert.ok(group.after > group.before);
assert.equal(receipt.validationKind, 'repeated');
assert.equal(receipt.rows.filter((r) => r.scored).length, 306);
assert.equal(receipt.rows.filter((r) => r.eligible && !r.scored).length, 3);
for (const [file, expected] of Object.entries(receipt.sourceGuards))
  assert.equal(hash(await readFile(file)), expected, 'Stale title evidence: ' + file);
// Also exercise the complete historical reconstruction and isolation proof.
await preTitleCalibrationSource('games/magic/src/presentation/retro-paint.ts');
for (const set of ['arn', 'atq', 'drk'])
  for (const crop of [0, 1, 2]) {
    const group = receipt.summary[`${set}/validation/${crop}`];
    assert.ok(group.after - group.before >= 0.05);
    assert.ok(group.improved / group.cards >= 0.9);
    assert.ok(group.worstRegression <= 0.02);
    for (const material of Object.values(receipt.materials).filter((m) => m.set === set)) {
      assert.ok(material.crops[crop].after >= material.crops[crop].before);
      if (material.independentlyRepresented) assert.ok(material.validationNames >= 3);
    }
  }
for (const row of receipt.rows) {
  assert.equal(row.outsideChanged, 0);
  assert.equal(row.proposalParity, true);
  if (!row.eligible) {
    assert.equal(row.before, row.after);
    continue;
  }
  const g = row.geometry;
  assert.ok(g.left >= 28 && g.top >= 24 && g.bottom <= 62, row.name + ': frame clearance');
  assert.ok(g.right <= g.availableRight + 3, row.name + ': mana clearance');
  if (row.scored) assert.equal(row.parity.maxDifference, 0, row.name + ': native preview');
}

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { earlyExpansionTitle, paintEarlyExpansionTitle } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-title.ts',
  );
  const untouched = new Proxy({}, { get: () => assert.fail('Out-of-scope title touched canvas') });
  for (const setCode of ['arn', 'atq', 'drk'])
    for (const material of ['W', 'U', 'B', 'R', 'G', 'A', 'L']) {
      const face = {
        name: 'Title scope probe',
        setCode,
        colors: /^[WUBRG]$/.test(material) ? [material] : [],
        typeLine: material === 'A' ? 'Mono Artifact' : material === 'L' ? 'Land' : 'Summon Bird',
      };
      if (setCode === 'drk' && material === 'L') {
        assert.equal(earlyExpansionTitle(face), undefined);
        continue;
      }
      assert.deepEqual(earlyExpansionTitle(face), receipt.profiles[setCode]);
      assert.deepEqual(
        earlyExpansionTitle({
          ...face,
          setCode: setCode.toUpperCase(),
          wordingMode: 'oracle',
          typeLine: material === 'A' ? 'Artifact' : material === 'L' ? 'Land' : 'Creature — Bird',
        }),
        receipt.profiles[setCode],
      );
      for (const override of [
        { setCode: 'lea' },
        { setCode: 'leg' },
        { setCode: '4ed' },
        { setCode: '8ed' },
        { setCode: 'm21' },
        { borderColor: 'white' },
        { frameStyle: 'modern' },
        { frameTemplate: 'future' },
        { layout: 'split' },
        { legendary: true },
        { typeLine: 'Enchantment — Saga' },
      ])
        assert.equal(paintEarlyExpansionTitle(untouched, { ...face, ...override }, 400), false);
    }
  assert.equal(
    earlyExpansionTitle({ name: 'Marsh Goblins', setCode: 'drk', colors: ['B', 'R'] }),
    undefined,
  );
  assert.ok(earlyExpansionTitle({ name: 'Mountain', setCode: 'arn', typeLine: 'Land' }));
  console.log('Early titles: 316 native replays, 306 scored, three crops, and 84 controls pass.');
} finally {
  await server.close();
}
