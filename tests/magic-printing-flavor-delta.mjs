import { wallReviews } from '../games/magic/tools/accuracy/wall-wording-data.mjs';
import {
  abuArtHistoricalHash,
  preAbuArtSource,
} from '../games/magic/tools/accuracy/abu-art-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  printingFlavorDelta,
  printingFlavorHistoricalHash,
} from '../games/magic/tools/accuracy/printing-flavor-data-ancestry.mjs';
import { validatePrintingFlavorDelta } from '../games/magic/tools/accuracy/printing-flavor-data-check.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
const p = await printingFlavorDelta();
assert.equal(await abuArtHistoricalHash(), p.afterRenderer);
assert.equal(await printingFlavorHistoricalHash(), p.beforeRenderer);
const review = JSON.parse(await readFile(p.review.file)),
  after = {};
for (const file of Object.keys(p.files))
  after[file] = (await preAbuArtSource(file, await readFile(file))).toString();
assert.deepEqual(validatePrintingFlavorDelta(p, after, review), p.summary);
assert.deepEqual(p.summary, {
  wordingPrintings: 2962,
  changedFlavorPrintings: 3,
  unchangedArtists: 222,
  changedSets: ['lea', 'leb', '2ed'],
});
const payload = 'games/magic/src/data/wording/lea.ts';
const forged = structuredClone(after),
  copy = structuredClone(p);
forged[payload] = forged[payload].replace('Summon Dwarves', 'Summon Unknown');
assert.notEqual(forged[payload], after[payload]);
copy.files[payload].after = hash(forged[payload]);
assert.throws(
  () => validatePrintingFlavorDelta(copy, forged, review),
  /Unrelated lazy printing data/,
);
const shifted = structuredClone(review);
shifted.cards[0].referenceHash = '0'.repeat(64);
assert.throws(() => validatePrintingFlavorDelta(p, after, shifted));
const native = JSON.parse(gunzipSync(await readFile(p.native.file)));
assert.equal(native.rows.filter((r) => r.affected).length, 3);
assert.equal(native.rows.filter((r) => !r.affected).length, 896);
assert.equal(
  native.faces.filter((r) => r.mode === 'original' && r.layer === 'face' && r.changed > 0).length,
  2,
);
for (const f of native.faces) {
  assert.equal(f.outside, 0);
  assert.equal(f.alpha, 0);
  if (f.layer === 'etching' || (f.mode === 'oracle' && !f.includeFlavor))
    assert.equal(f.beforeHash, f.afterHash);
}
const prefix = 'games/magic/fixtures/accuracy/early-through-fourth/';
const scores = JSON.parse(gunzipSync(await readFile(prefix + 'abu-flavor-current-scores.json.gz')));
const prior = JSON.parse(gunzipSync(await readFile(prefix + 'abu-paper-current-scores.json.gz')));
assert.equal(scores.source.rendererHash, p.afterRenderer);
assert.equal(scores.source.nativeHash, p.native.contentSha256);
assert.deepEqual(scores.source.metricGraph, prior.source.metricGraph);
assert.equal(scores.rows.length, 899);
assert.equal(scores.recomputedPrintings, 3);
assert.equal(scores.reusedPrintings, 896);
assert.equal(scores.changedRasters, 2);
for (const row of scores.rows) {
  const n = native.rows.find((r) => r.id === row.id),
    old = prior.rows.find((r) => r.id === row.id);
  assert.equal(row.nativeFaceHash, n.original.hashes['after-face']);
  assert.equal(row.inputHash, n.inputHash);
  assert.equal(row.referenceHash, old.referenceHash);
  assert.equal(row.poseHash, old.poseHash);
  if (!n.affected) assert.deepEqual(row, old);
}
assert(scores.changes.every((r) => r.delta100 >= 0));
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const sets = ledger.sets.filter((s) => ['lea', 'leb', '2ed'].includes(s.set));
const reports = await calibrationReport({ sets });
for (const r of reports) {
  assert.equal(r.counts.stale, 0);
  const groups = sets
    .find((s) => s.set === r.set)
    .groups.filter((g) => wallReviews.some((w) => w.set === r.set && g.printingIds.includes(w.id)));
  assert.equal(r.counts['needs-audit'], groups.length * 4);
  assert.equal(
    r.originalRulesInputs.ready,
    r.printings - groups.reduce((n, g) => n + g.printings, 0),
  );
  assert.equal(
    r.originalRulesInputs.stale,
    groups.reduce((n, g) => n + g.printings, 0),
  );
  assert.equal(r.originalTypeInputs.ready, r.printings);
  assert.equal(r.complete, groups.length === 0);
  assert.equal(r.byTask.release.validated, r.groups - groups.length);
  assert(
    sets
      .find((s) => s.set === r.set)
      .groups.every((g) => g.tasks.release.proof.version === '0.7.1'),
  );
}
console.log(
  'Flavor source:three exact Original corrections;2962 wording records otherwise preserved,222 artists unchanged;899 native replay,30 layer pairs,896 exact score reuses and no unrelated stale approvals.',
);
