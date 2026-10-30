import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  fontGeometryHistory,
  preFontGeometrySource,
  fontGeometryHistoricalFiles,
  fontGeometryHistoricalHash,
  fontGeometryRegionalParent,
  fontGeometryTaskAffected,
} from '../games/magic/tools/accuracy/font-geometry-ancestry.mjs';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
const p = await fontGeometryHistory();
assert.equal(p.scoreReuse, false, 'Font geometry changes cannot reuse typography scores');
assert(Object.keys(p.files).length >= 50);
let additions = 0;
for (const [file, e] of Object.entries(p.files)) {
  const current = await fs.readFile(file);
  assert.equal(hash(current), e.after, 'Unreviewed font source: ' + file);
  const old = await preFontGeometrySource(file, current);
  if (e.beforeSource !== null) {
    assert.equal(hash(old), e.before);
    assert.deepEqual(await fontGeometryHistoricalFiles([file]), [file]);
  } else {
    additions++;
    assert.deepEqual(old, current);
    assert.deepEqual(await fontGeometryHistoricalFiles([file]), []);
  }
  const foreign = Buffer.concat([current, Buffer.from('\n// foreign font change\n')]);
  assert.deepEqual(await preFontGeometrySource(file, foreign), foreign);
}
assert.equal(additions, 2);
console.log(
  'Exact historical source reconstruction rejects foreign bytes; live typography and scores keep their new identities.',
);
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/font-geometry/loyalty-shield-review.json'),
);
assert.equal(review.rows.length, 7);
assert.equal(new Set(review.rows.map((r) => r.id)).size, 7);
assert.equal(review.rows.filter((r) => r.set === 'm21').length, 6);
assert.deepEqual(review.startingLoyaltyAfter, { dx: 0, dy: 0 });
const totals = { released079: 0, candidate: 0 };
for (const row of review.rows) {
  assert.match(row.referenceHash, /^[a-f0-9]{64}$/);
  for (const version of Object.keys(totals)) {
    const a = row.scan,
      b = row[version].geometry;
    const error = [
      b.digit.x - b.body.x - ((a.digit.x - a.body.x) * b.body.w) / a.body.w,
      b.digit.y - b.body.y - ((a.digit.y - a.body.y) * b.body.h) / a.body.h,
    ];
    error.forEach((v, i) => assert(Math.abs(v - row[version].error[i]) < 1e-9));
    const distance = Math.hypot(...error);
    assert(Math.abs(distance - row[version].distance) < 1e-9);
    totals[version] += distance / review.rows.length;
  }
  assert(row.candidate.distance < row.released079.distance);
  assert(row.candidate.distance < 1.2);
}
assert(totals.candidate < 0.75);
for (const version of Object.keys(totals))
  assert(Math.abs(totals[version] - review.meanError[version]) < 1e-9);
console.log(
  'Seven badge-relative numeral fits improve; mean error stays below 0.75 reference pixels.',
);

const actualRenderer = await sourceHash('games/magic/src');
const historicalRenderer = await fontGeometryHistoricalHash('games/magic/src');
assert.notEqual(actualRenderer, historicalRenderer);
assert.equal(
  historicalRenderer,
  '24c7c50b47c4dbb2de59be6b617a80be9d7567982eb1bdd9650e34d861312c44',
);
for (const task of ['headings', 'rules', 'manaGeometry', 'stats', 'fullCard', 'release']) {
  assert(fontGeometryTaskAffected(task));
  assert.equal(
    await fontGeometryRegionalParent(actualRenderer, task),
    actualRenderer,
    'Never reuse old typography: ' + task,
  );
}
for (const task of [
  'references',
  'normalization',
  'frameGeometry',
  'frameColor',
  'paperColor',
  'blackLevels',
  'setSymbol',
])
  assert.equal(
    await fontGeometryRegionalParent(actualRenderer, task),
    historicalRenderer,
    'Exact unchanged region: ' + task,
  );
assert.equal(
  await fontGeometryRegionalParent(actualRenderer, 'rules', true),
  historicalRenderer,
  'Original wording does not depend on font geometry',
);
assert.equal(
  await fontGeometryRegionalParent('f'.repeat(64), 'frameColor'),
  'f'.repeat(64),
  'Foreign source is never approved',
);
console.log(
  'Current typography cannot reuse historical scores; exact unchanged regions and wording keep bounded reuse.',
);
