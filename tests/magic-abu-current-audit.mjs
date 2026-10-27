import {
  wallWordingAffected,
  wallReviews,
} from '../games/magic/tools/accuracy/wall-wording-data.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  abuCurrentAudit,
  abuCurrentApproval,
} from '../games/magic/tools/accuracy/abu-current-review.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
import { calibrationTaskStatus } from '../games/magic/tools/accuracy/calibration-ledger.mjs';
const a = await abuCurrentAudit();
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const sets = ledger.sets.filter((s) => ['lea', 'leb', '2ed'].includes(s.set));
const reports = await calibrationReport({ sets });
const affectedGroups = (set) =>
  set.groups.filter((g) =>
    wallReviews.some((r) => r.set === set.set && g.printingIds.includes(r.id)),
  );
assert.equal(affectedGroups(sets.find((s) => s.set === '2ed')).length, 2);

for (const report of reports) {
  assert.equal(report.inventoryReady, true);
  const reopened = affectedGroups(sets.find((s) => s.set === report.set));
  const reopenedPrintings = reopened.reduce((n, g) => n + g.printings, 0);
  assert.equal(report.outstanding.length, reopened.length * 4);
  assert.equal(report.complete, reopened.length === 0);
  assert.equal(report.originalRulesInputs.ready, report.printings - reopenedPrintings);
  assert.equal(report.originalRulesInputs.stale, reopenedPrintings);
  for (const entry of report.outstanding)
    assert(['rules', 'flavor', 'fullCard', 'release'].includes(entry.task));

  assert.equal(report.originalTypeInputs.ready, report.printings);
  assert.equal(report.counts.stale, 0);
  assert.equal(report.counts['needs-audit'], reopened.length * 4);
}
for (const set of sets)
  for (const group of set.groups)
    for (const task of ['rules', 'flavor', 'fullCard']) {
      if (group.applicable?.[task] === false) continue;
      assert.equal(
        await abuCurrentApproval(group.tasks[task], group, task, false, set.set),
        !(await wallWordingAffected(set.set, task, false, group)),
      );
      assert.equal(group.tasks[task].proof.sourceCensus.heldOut, false);
    }
const publicationFile =
  'games/magic/fixtures/accuracy/early-through-fourth/abu-publication-071.json';
const publicationBytes = await readFile(publicationFile);
const publication = JSON.parse(publicationBytes);
assert.equal(publication.published.version, '0.7.1');
assert.equal(publication.workflow.status, 'completed');
assert.equal(publication.workflow.conclusion, 'success');
assert.equal(publication.workflow.headSha, publication.published.sourceCommit);
assert.equal(publication.checksumsVerified, true);
assert.equal(publication.rendererHash, a.flow.afterRenderer);
assert.equal(publication.lab.scored, 899);
assert.equal(publication.lab.unmatched, 0);
assert.equal(publication.lab.metricPolicyDifferences, 0);
assert.equal(publication.alphaPreview.version, '0.7.1');
assert.equal(publication.alphaPreview.experimentalFramesShipped, false);
const { hash } = await import('../games/magic/tools/accuracy/common.mjs');
for (const set of sets)
  for (const group of set.groups) {
    const release = group.tasks.release;
    assert.equal(release.status, 'validated');
    assert.equal(release.proof.version, publication.published.version);
    assert.equal(release.proof.publishedCommit, publication.published.sourceCommit);
    assert.equal(release.proof.checksPassed, true);
    assert.equal(release.proof.publicationReceiptHash, hash(publicationBytes));
    assert.equal(release.guards[publicationFile], hash(publicationBytes));
    assert.equal(
      await abuCurrentApproval(release, group, 'release', false, set.set),
      !(await wallWordingAffected(set.set, 'release', false, group)),
    );
  }
const set = sets[0],
  group = set.groups.find((g) => g.tasks.rules.proof?.abuCurrentReview);
const item = group.tasks.rules;
for (const edit of [
  (v) => {
    delete v.proof.abuCurrentReview;
  },
  (v) => {
    v.proof.nativeReplayHash = '0'.repeat(64);
  },
  (v) => {
    v.proof.metricsHash = '0'.repeat(64);
  },
  (v) => {
    v.proof.sourceCensus.members.pop();
  },
  (v) => {
    v.proof.sourceCensus.members[0].nativeFaceHash = '0'.repeat(64);
  },
  (v) => {
    v.proof.sourceCensus.members[0].referenceHash = '0'.repeat(64);
  },
  (v) => {
    v.proof.sourceCensus.heldOut = true;
  },
  (v) => {
    v.guards[Object.keys(a.flow.files)[0]] = '0'.repeat(64);
  },
]) {
  const bad = structuredClone(item);
  edit(bad);
  assert(!(await abuCurrentApproval(bad, group, 'rules', false, set.set)));
}
assert(!(await abuCurrentApproval(item, group, 'headings', false, set.set)));
assert(!(await abuCurrentApproval(item, group, 'rules', false, 'drk')));
const changedGroupGuard = structuredClone(group);
changedGroupGuard.guards = {
  ...changedGroupGuard.guards,
  'games/magic/src/calibration/sets/lea.ts': '0'.repeat(64),
};
assert(
  !(await abuCurrentApproval(item, changedGroupGuard, 'rules', false, set.set)),
  'A per-item source guard must not hide a changed group dependency',
);

const foreign = structuredClone(set);
foreign.set = 'drk';
foreign.groups = [structuredClone(group)];
foreign.inventory.ordinaryPrintings = group.printings;
const [badSet] = await calibrationReport({ sets: [foreign] });
assert.equal(badSet.byTask.rules['needs-audit'], 1, 'A current ABU marker cannot escape its set');
const missing = structuredClone(group),
  badRules = missing.tasks.rules;
badRules.proof.sourceCensus.members[0].poseHash = '0'.repeat(64);
const [badMember] = await calibrationReport({
  sets: [
    {
      ...set,
      groups: [missing],
      inventory: { ...set.inventory, ordinaryPrintings: missing.printings },
    },
  ],
});
assert.equal(
  badMember.byTask.rules['needs-audit'],
  1,
  'A marker cannot replace exact current native membership',
);
const fake = structuredClone(group);
fake.tasks.release.status = 'validated';
fake.tasks.release.proof.gatesPassed = true;
delete fake.tasks.release.proof.version;
delete fake.tasks.release.proof.publishedCommit;
delete fake.tasks.release.proof.checksPassed;
assert.throws(() => calibrationTaskStatus(fake, 'release'), /not a released calibration/);
console.log(
  'ABU finite review:899 exact native/metric members,33 visually reviewed changes,19 current art candidates; historical review preserved, only two Unlimited Wall source groups reopened; missing/foreign/changed evidence and forged publication reject.',
);
