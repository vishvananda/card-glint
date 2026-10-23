import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { readCensus } from '../games/magic/tools/accuracy/modern-publication-review.mjs';
const file = 'games/magic/fixtures/accuracy/m21/current-footer-region-diagnostic.json';
const { summary: p, detail: d } = await readCensus(file);
assert.equal(d.status, 'current-fixed-cell-footer-diagnostics-not-calibration-approval');
assert.equal(d.rows.length, 297);
assert.equal(new Set(d.rows.map((r) => r.id)).size, 297);
for (const [name, digest] of Object.entries(d.definition.sources))
  assert.equal(hash(await readFile('games/magic/tools/accuracy/' + name)), digest);
const { detail: census } = await readCensus(
  'games/magic/fixtures/accuracy/m21/current-component-census.json',
);
// These are immutable release diagnostics, not approval of the current worktree.
assert.equal(d.definition.rendererHash, census.definition.rendererHash);
const byId = new Map(census.rows.map((r) => [r.id, r]));
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
for (const row of d.rows) {
  const current = byId.get(row.id);
  assert(current);
  for (const key of ['referenceHash', 'poseHash', 'inputHash', 'nativeFaceHash'])
    assert.equal(row[key], current[key]);
  for (const role of ['collector', 'artist', 'legal']) {
    const field = row.fields[role];
    assert.equal(field.current.length, role === 'collector' ? 2 : 1);
    assert.equal(field.before.length, field.current.length);
    for (const item of [...field.current, ...field.before, ...field.sharedProposal]) {
      assert.equal(item.status, 'measured');
      assert(item.fillDice >= 0 && item.fillDice <= 1 + 1e-9);
      assert.equal(item.edgeF1.length, 3);
      for (const value of item.edgeF1) assert(value >= 0 && value <= 1);
    }
    assert(
      mean(field.current.map((f) => f.edgeF1[1])) > mean(field.before.map((f) => f.edgeF1[1])),
    );
  }
}
for (const role of ['collector', 'artist', 'legal']) {
  const summary = p.summary.roles[role],
    rows = d.rows.filter((r) => r.nonfoil);
  assert.equal(summary.independentRegionApproval, false);
  const current = rows.flatMap((r) => r.fields[role].current);
  assert(Math.abs(summary.current.fillDice100 - 100 * mean(current.map((f) => f.fillDice))) < 1e-8);
  assert(Math.abs(summary.current.edgeF1At1 - 100 * mean(current.map((f) => f.edgeF1[1]))) < 1e-8);
  const flagged = d.rows
    .filter((r) =>
      r.fields[role].current.some(
        (f) => f.boundaryReview.reference.length || f.boundaryReview.rendered.length,
      ),
    )
    .map((r) => r.id);
  assert.deepEqual(summary.boundaryReview.ids, flagged);
  assert(flagged.length > 0);
  const fit = d.proposals[role];
  assert(Math.abs(fit.dx) <= 2 && Math.abs(fit.dy) <= 2);
  assert(fit.score >= fit.baseline);
  assert(
    summary.sharedProposal.edgeF1At1 < summary.current.edgeF1At1,
    'Conflicting objectives must stay visible',
  );
}
const review = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/m21/footer-region-method-review.json'),
);
assert.equal(review.diagnostic.sha256, hash(await readFile(file)));
assert.equal(review.rendererHash, d.definition.rendererHash);
assert.equal(review.visual.reviewed, true);
const seen = new Set(review.visual.pages.flatMap((page) => page.ids));
assert.equal(seen.size, review.visual.printings);
for (const row of d.rows) {
  const flagged = Object.values(row.fields).some(
    (f) =>
      f.current.some((p) => p.edgeF1[1] < 0.65) ||
      mean(f.current.map((p) => p.fillDice)) + 1e-8 < mean(f.before.map((p) => p.fillDice)),
  );
  if (flagged || !row.nonfoil) assert(seen.has(row.id), 'Missing visual disposition: ' + row.name);
}
assert.deepEqual(review.decisions.promotedAdjustments, []);
assert.deepEqual(review.decisions.calibrationApprovals, []);
assert.equal(review.decisions.keepReleasedFooterValues, true);
assert.equal(review.decisions.wholeCardMetricChanged, false);
console.log(
  'M21 footer diagnostics:297 exact native/reference/pose joins, current-vs-release metrics and boundary/contact flags pass. Unisolated cells and conflicting fractional-shift proposals remain unapproved.',
);
