import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { readCensus } from '../games/magic/tools/accuracy/modern-publication-review.mjs';
import { checkFooterContent } from '../games/magic/tools/accuracy/modern-footer-content-census.mjs';
const p = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/m21/current-footer-content-census.json'),
);
assert.equal(p.status, 'current-footer-content-census-only');
assert.equal(p.rows.length, 297);
assert.equal(new Set(p.rows.map((r) => r.id)).size, 297);
assert.equal(p.rows.filter((r) => r.nonfoil).length, 292);
assert.equal(p.rows.filter((r) => !r.nonfoil).length, 5);
assert.equal(p.summary.fields.length, 7);
assert.equal(
  p.definition.toolHash,
  hash(await readFile('games/magic/tools/accuracy/modern-footer-content-census.mjs')),
);
const originalBytes = await readFile(p.definition.reviewFile);
assert.equal(hash(originalBytes), p.definition.reviewHash);
const review = new Map(JSON.parse(originalBytes).rows.map((r) => [r.id, r]));
const census = await readCensus('games/magic/fixtures/accuracy/m21/current-component-census.json');
// Bind the stored content review to its exact native release census. A newer
// worktree must not silently renew this historical review's runtime identity.
assert.equal(p.definition.rendererHash, census.detail.definition.rendererHash);
const native = new Map(census.detail.rows.map((r) => [r.id, r]));
for (const row of p.rows) {
  const r = review.get(row.id),
    n = native.get(row.id);
  checkFooterContent(row.actual, r);
  for (const key of ['referenceHash', 'poseHash', 'inputHash', 'nativeFaceHash'])
    assert.equal(row[key], n[key], row.name + '/' + key);
  assert.equal(row.normalizedHash, r.normalizedHash);
  for (const field of p.summary.fields)
    assert.throws(() => checkFooterContent({ ...row.actual, [field]: 'incorrect' }, r));
}
assert.equal(p.rows.filter((r) => r.actual.finishMarker === 'star').length, 5);
assert.equal(p.rows.filter((r) => r.actual.rarityMark === 'L').length, 25);
console.log(
  'M21 footer content:297 exact Original inputs/native faces, seven printed fields each and5foil-only wording controls match the existing scan review; altered strings/marks reject. Geometry and frozen score eligibility remain unapproved.',
);
