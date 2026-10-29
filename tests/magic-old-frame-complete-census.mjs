import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import { calibrationSetStatus } from '../games/magic/tools/accuracy/calibration-ledger.mjs';
const file = 'games/magic/fixtures/accuracy/mirage-onslaught/complete-census.json.gz';
const bytes = await fs.readFile(file);
assert.equal(hash(bytes), '2531840a4ca415ade228c4bed58a40bf8f0d7c3c65684c4abad10276ae43fb9f');
const p = JSON.parse(gunzipSync(bytes));
assert.equal(p.rendererHash, await sourceHash('games/magic/src'));
assert.equal(
  p.sourceAdoption,
  hash(
    await fs.readFile('games/magic/fixtures/accuracy/mirage-onslaught/production-adoption.json.gz'),
  ),
);
for (const [f, m] of Object.entries(p.methods)) {
  assert.equal(hash(m.source), m.sha256);
  assert.equal(hash(await fs.readFile(f)), m.sha256);
}
const ledger = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
let oldScores = 0,
  newScores = 0,
  amendedFooters = 0;
for (const [code, count] of [
  ['mir', 351],
  ['ons', 350],
]) {
  const s = p.sets[code];
  assert.equal(s.members.length, count);
  assert.equal(s.scores.summary.measured, count);
  assert.equal(s.scores.summary.rejected, 0);
  assert.equal(s.before.summary.measured, count);
  assert.equal(s.poses.summary.accepted, count);
  assert.equal(s.native.source.rendererHash, p.rendererHash);
  assert.equal(s.original.count, count);
  assert.equal(s.audit.syntheticControlsPassed, true);
  for (const [name, sha] of Object.entries(s.proposal.sources))
    assert.equal(hash(await fs.readFile('games/magic/tools/accuracy/' + name)), sha);
  for (const r of s.members) {
    const native = s.native.rows.find((n) => n.id === r.id),
      pose = s.poses.rows.find((n) => n.id === r.id);
    const parent = s.parentPoses.rows.find((n) => n.id === r.id),
      score = s.scores.rows.find((n) => n.id === r.id);
    const old = s.previousRows.find((n) => n.id === r.id);
    assert.equal(r.inputHash, hash(JSON.stringify(r.face)));
    assert.equal(r.nativeFaceHash, native.sha256);
    assert.equal(r.reference.sha256, score.referenceHash);
    assert.equal(r.poseHash, hash(JSON.stringify(pose.transform)));
    assert(pose.accepted);
    assert(!r.face.setCalibrationCandidate);
    if (parent.accepted) {
      assert.deepEqual(pose.transform, parent.transform);
      if (native.footerRevision) {
        assert.equal(code, 'mir');
        assert.equal(r.material, 'M');
        assert.equal(old.nativeHash, native.footerRevision.previousNativeHash);
        assert.deepEqual(r.footerRevision, native.footerRevision);
        assert(native.footerRevision.changedPixels > 0);
        const nonCredit = structuredClone(score.score);
        delete nonCredit.components.credits;
        assert.equal(old.nonCreditScoreDigest, hash(JSON.stringify(nonCredit)));
        amendedFooters++;
      } else {
        assert.equal(old.nativeHash, native.sha256);
        assert.equal(old.scoreDigest, hash(JSON.stringify(score.score)));
        oldScores++;
      }
    } else {
      assert.equal(pose.acceptanceSource, 'source-audited-rgb-recovery');
      assert(pose.validation.rms <= 0.8);
      for (const side of Object.values(pose.validation.sides)) assert(side.p90 <= 1.25);
      newScores++;
    }
  }
  const set = ledger.sets.find((s) => s.set === code);
  assert.equal(set.inventory.review.nonfoilCensus.printings, count);
  assert.equal(set.inventory.review.nonfoilCensus.sha256, hash(bytes));
  const status = calibrationSetStatus(set);
  assert(
    status.outstanding.every(
      (o) =>
        o.task === 'release' || set.groups.find((g) => g.key === o.group).references.foilOnly > 0,
    ),
  );
  const covered = set.groups.filter((g) => g.references.nonfoil > 0).flatMap((g) => g.printingIds);
  assert.deepEqual(covered.sort(), s.members.map((r) => r.id).sort());
  for (const g of set.groups.filter((g) => g.references.nonfoil > 0)) {
    assert.equal(g.tasks.rules.originalInput.status, 'ready');
    assert.equal(g.tasks.headings.originalInput.status, 'ready');
    assert.equal(g.sourceCensus.heldOut, false);
  }
}
assert.equal(oldScores + amendedFooters, 694);
assert(amendedFooters > 0);
assert.equal(newScores, 7);
const footerBytes = await fs.readFile(p.footerReview.file);
assert.equal(hash(footerBytes), p.footerReview.sha256);
const footer = JSON.parse(gunzipSync(footerBytes));
assert.equal(footer.rendererHash, p.rendererHash);
for (const [f, m] of Object.entries(footer.methods)) {
  assert.equal(hash(m.source), m.sha256);
  assert.equal(hash(await fs.readFile(f)), m.sha256);
}
assert.equal(footer.sets.mir.amendments.length, amendedFooters);
assert.equal(footer.sets.ons.amendments.length, 0);
const foil = ledger.sets.find((s) => s.set === 'ons').inventory.review.nonfoilCensus
  .pendingFoilOnlyPrintings;
assert.deepEqual(
  foil.map((r) => r.collectorNumber),
  ['200★'],
);
console.log(
  'Complete nonfoil census:701 exact Original native/scan/score members;694 prior scan poses, isolated gold copyright amendments,7 audited recoveries, current per-variant reviews and one explicit foil-only follow-up. No publication is inferred.',
);
