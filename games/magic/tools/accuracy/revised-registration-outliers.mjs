// Explain frozen registration rejections without changing acceptance or poses.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
const [posesFile, output] = process.argv.slice(2);
assert(output, 'Usage: revised-registration-outliers.mjs POSES NEW_OUTPUT');
const bytes = await fs.readFile(posesFile),
  poses = JSON.parse(bytes),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  rows = [];
assert.equal(poses.set, '3ed');
for (const [material, g] of Object.entries(poses.groups))
  for (const r of g.rows) {
    if (r.accepted) continue;
    assert.equal(r.accepted, false);
    assert(Array.isArray(g.verificationKeys));
    const verification = g.verificationKeys.map((key) => {
      const b = r.bands[key];
      assert([b.score, b.shift, b.bestScore].every(Number.isFinite));
      return {
        key,
        ...b,
        similarityPassed: b.score >= 90,
        displacementPassed: Math.abs(b.shift) <= 0.5,
      };
    });
    const failureTypes = [];
    if (!r.parentAccepted) failureTypes.push('parent-registration');
    const searchBoundary = !r.bounded || r.endpoints.boundary || r.endpoints.coarseBoundary;
    if (searchBoundary) failureTypes.push('vertical-search-boundary');
    if (!r.fitPassed) failureTypes.push('fit-profile-mismatch');
    if (!r.independentPassed) failureTypes.push('independent-band-mismatch');
    assert(failureTypes.length, 'Unexplained rejected registration');
    const queue = !r.parentAccepted
      ? 'parent-registration-review'
      : searchBoundary
        ? 'search-boundary-review'
        : verification.some((b) => !b.displacementPassed)
          ? 'independent-displacement-review'
          : 'profile-shape-review';
    rows.push({
      id: r.id,
      name: r.name,
      material,
      cohort: r.cohort,
      referenceHash: r.referenceHash,
      accepted: false,
      diagnosticTransform: r.transform,
      failureTypes,
      queue,
      fit: { top: r.bands.fitTop, bottom: r.bands.fitBottom },
      verification,
    });
  }
assert.equal(rows.length, poses.summary.cards - poses.summary.accepted);
assert.equal(new Set(rows.map((r) => r.id)).size, rows.length);
assert.equal(hash(await fs.readFile(posesFile)), hash(bytes));
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
const counts = (key) =>
  Object.fromEntries(
    [...new Set(rows.flatMap(key))].map((k) => [k, rows.filter((r) => key(r).includes(k)).length]),
  );
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
await writeJson(output, {
  schema: 1,
  status: 'registration-outlier-review-queue-not-accepted',
  set: '3ed',
  scope:
    'Explain every frozen nonland rejection. Profile similarity is distinguished from independent displacement,upstream rejection and search bounds. Proposed transforms are diagnostics only;no pose or gate changes,and no scan is labelled defective.',
  toolHash,
  posesHash: hash(bytes),
  inputHash: poses.source.inputHash,
  summary: {
    cards: poses.summary.cards,
    accepted: poses.summary.accepted,
    rejected: rows.length,
    byQueue: counts((r) => [r.queue]),
    overlappingFailureTypes: counts((r) => r.failureTypes),
  },
  rows,
});
console.log(
  JSON.stringify({
    cards: poses.summary.cards,
    rejected: rows.length,
    byQueue: counts((r) => [r.queue]),
  }),
);
