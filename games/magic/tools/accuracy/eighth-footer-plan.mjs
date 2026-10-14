import assert from 'node:assert/strict';
import { readJson, writeJson, cacheRoot } from './common.mjs';

const source = await readJson(cacheRoot + '/rollout/major-calibration-plan.json');
const keys = new Set([
  '8ed/eighth/white',
  '9ed/eighth/white',
  '10e/eighth/black',
  'm10/eighth/black',
  'm14/eighth/black',
  'mrd/eighth/black',
]);
const rows = source.rows.filter((row) => keys.has(row.key));
assert.equal(rows.length, keys.size, 'Missing predetermined frame group');
for (const row of rows)
  for (const sample of row.samples)
    assert.equal(sample.card.nonfoil, true, 'Footer study requires an ordinary nonfoil printing');
await writeJson(cacheRoot + '/rollout/eighth-footer-plan.json', {
  ...source,
  scope:
    'Predetermined ordinary nonfoil Eighth-frame footer transfer study. Original name cohorts retained; shared development names excluded from validation by the fitting tool. White stock only for 8ED/9ED, never foil stock.',
  summary: {
    sets: rows.length,
    groups: rows.length,
    samples: rows.reduce((n, r) => n + r.samples.length, 0),
    families: { eighth: rows.length },
  },
  rows,
});
console.log(rows.map((row) => [row.key, row.samples.length]));
