import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  M21_PUBLICATION,
  m21PublicationEvidence,
  applyM21Publication,
} from '../games/magic/tools/accuracy/calibration-m21-publication.mjs';
import { checkPublication } from '../games/magic/tools/accuracy/modern-publication-review.mjs';
import {
  calibrationTaskStatus,
  calibrationSetStatus,
} from '../games/magic/tools/accuracy/calibration-ledger.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
const data = await m21PublicationEvidence();
const guardsMatch = (
  await Promise.all(
    Object.entries(data.guards).map(async ([file, digest]) => {
      try {
        return hash(await readFile(file)) === digest;
      } catch {
        return false;
      }
    }),
  )
).every(Boolean);
assert.equal(
  data.current,
  guardsMatch && (await sourceHash('games/magic/src')) === data.receipt.rendererHash,
);
// Exercise the immutable published proof without claiming this worktree is its runtime.
const historicalData = { ...data, current: true };
const { receipt } = data;
assert.equal(receipt.published.sourceCommit, 'd500e44246a7f27b047b02095ad5e3253450b57c');
for (const mutate of [
  (r, w) => {
    r.isDraft = true;
  },
  (r, w) => {
    r.isPrerelease = true;
  },
  (r, w) => {
    w.headSha = '0'.repeat(40);
  },
  (r, w) => {
    w.conclusion = 'failure';
  },
  (r, w) => {
    w.jobs
      .find((j) => j.name === 'renderer')
      .steps.find((s) => s.name === 'Run npm run test:browser').conclusion = 'skipped';
  },
  (r, w) => {
    r.assets = r.assets.filter((a) => !a.name.endsWith('.tgz'));
  },
]) {
  const r = structuredClone(receipt.release),
    w = structuredClone(receipt.workflow);
  mutate(r, w);
  assert.throws(() => checkPublication(r, w, receipt.published));
}
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const set = ledger.sets.find((s) => s.set === 'm21');
assert.equal(set.groups.length, 85);
assert.equal(
  set.groups.reduce((sum, g) => sum + g.printings, 0),
  297,
);
for (const group of set.groups) {
  const g = structuredClone(group),
    before = structuredClone(g.tasks);
  applyM21Publication(g, historicalData);
  assert.equal(calibrationTaskStatus(g, 'release').status, 'validated');
  assert.equal(g.tasks.release.proof.coveredPrintings, g.printings);
  assert.deepEqual({ ...g.tasks, release: undefined }, { ...before, release: undefined });
  applyM21Publication(g, { ...data, current: false });
  assert.equal(calibrationTaskStatus(g, 'release').status, 'stale');
  const live = structuredClone(group);
  applyM21Publication(live, data);
  assert.equal(calibrationTaskStatus(live, 'release').status, data.current ? 'validated' : 'stale');
  const bad = structuredClone(group);
  bad.printingIds = bad.printingIds.slice(1);
  assert.throws(() => applyM21Publication(bad, data));
}
assert.equal(
  calibrationSetStatus(set).complete,
  false,
  'Publication must not complete unfinished calibration',
);
const [report] = await calibrationReport({ sets: [set] });
assert.equal(report.byTask.release.validated ?? 0, data.current ? 85 : 0);
assert.equal(report.byTask.release.stale ?? 0, data.current ? 0 : 85);
assert.equal(report.byTask.normalization.validated, 85);
assert.equal(report.complete, false);
const changed = structuredClone(set);
for (const group of changed.groups)
  group.tasks.release.runtimeGuards['games/magic/src'] = '0'.repeat(64);
const [changedReport] = await calibrationReport({ sets: [changed] });
assert.equal(changedReport.byTask.release.stale, 85);
const missing = structuredClone(set);
for (const group of missing.groups)
  group.tasks.release.runtimeGuards = {
    'games/magic/no-such-runtime-directory': receipt.rendererHash,
  };
const [missingReport] = await calibrationReport({ sets: [missing] });
assert.equal(missingReport.byTask.release.stale, 85);
const invalidManifest = structuredClone(receipt.published);
invalidManifest.files = [];
assert.throws(() => checkPublication(receipt.release, receipt.workflow, invalidManifest));

assert(set.groups.every((g) => g.tasks.release.evidence.includes(M21_PUBLICATION)));
console.log(
  'M21 publication: checked release CI/artifacts and exact297-printing score census cover85variants; skipped checks, altered scope and changed runtime reject. Other calibration tasks remain open.',
);
