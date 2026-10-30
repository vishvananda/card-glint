// Verify a manually published, checksum-matched patch against its complete CI.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { format } from 'prettier';
import { hash, root, sourceHash, atomicWrite } from './common.mjs';
import { RELEASE_CHECKS } from './modern-publication-review.mjs';
import { onsSymbolStatsDelta } from './ons-symbol-stats-ancestry.mjs';
const [directory, releaseFile, ciFile] = process.argv.slice(2);
assert(directory && releaseFile && ciFile, 'Use VERIFIED_DOWNLOAD_DIRECTORY RELEASE_JSON CI_JSON');
const release = JSON.parse(await fs.readFile(releaseFile)),
  ci = JSON.parse(await fs.readFile(ciFile));
const manifestBytes = await fs.readFile(path.join(directory, 'release.json'));
const manifest = JSON.parse(manifestBytes);
assert.equal(manifest.version, '0.7.7');
assert.equal(release.tagName, 'v0.7.7');
assert.equal(release.isDraft, false);
assert.equal(release.isPrerelease, false);
assert.equal(release.url, 'https://github.com/vishvananda/card-glint/releases/tag/v0.7.7');
assert.match(release.publishedAt, /^\d{4}-\d{2}-\d{2}T/);
assert.equal(ci.status, 'completed');
assert.equal(ci.conclusion, 'success');
// A release-version-only child can reuse the completed renderer CI. No other
// file or package/build/dependency change is accepted by this qualification.
const gitObject = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
let qualification = {
  kind: 'exact-commit',
  ciCommit: ci.headSha,
  releaseCommit: manifest.sourceCommit,
};
if (ci.headSha !== manifest.sourceCommit) {
  const changed = gitObject('diff', '--name-only', ci.headSha, manifest.sourceCommit)
    .split('\n')
    .sort();
  assert.deepEqual(changed, ['docs/releases/0.7.7.md', 'package-lock.json', 'package.json']);
  for (const file of ['package.json', 'package-lock.json']) {
    const before = JSON.parse(gitObject('show', ci.headSha + ':' + file));
    const after = JSON.parse(gitObject('show', manifest.sourceCommit + ':' + file));
    assert.equal(before.version, '0.7.6');
    assert.equal(after.version, '0.7.7');
    delete before.version;
    delete after.version;
    if (file === 'package-lock.json') {
      assert.equal(before.packages[''].version, '0.7.6');
      assert.equal(after.packages[''].version, '0.7.7');
      delete before.packages[''].version;
      delete after.packages[''].version;
    }
    assert.deepEqual(after, before, 'Unvalidated runtime, dependency or build change');
  }
  qualification = { ...qualification, kind: 'strict-version-metadata-only', changedFiles: changed };
}
const renderer = ci.jobs.find((j) => j.name === 'renderer');
assert.equal(renderer?.conclusion, 'success');
for (const check of RELEASE_CHECKS)
  assert.equal(renderer.steps.find((s) => s.name === 'Run ' + check)?.conclusion, 'success', check);
const sums = new Map(
  (await fs.readFile(path.join(directory, 'SHA256SUMS'), 'utf8'))
    .trim()
    .split('\n')
    .map((line) => {
      const m = /^([a-f0-9]{64})  ([a-zA-Z0-9._-]+)$/.exec(line);
      assert(m);
      return [m[2], m[1]];
    }),
);
assert.equal(sums.size, 3);
assert.equal(sums.get('release.json'), hash(manifestBytes));
assert.deepEqual(manifest.files.map((f) => f.name).sort(), [
  'card-glint-0.7.7-browser.zip',
  'card-glint-0.7.7.tgz',
]);
for (const file of manifest.files) {
  const b = await fs.readFile(path.join(directory, file.name));
  assert.equal(b.length, file.bytes);
  assert.equal(hash(b), file.sha256);
  assert.equal(sums.get(file.name), file.sha256);
  assert.equal(release.assets.find((a) => a.name === file.name)?.size, file.bytes);
}
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
assert.equal(git('rev-parse', 'v0.7.7^{commit}'), manifest.sourceCommit);
git(
  'diff',
  '--exit-code',
  'v0.7.7',
  '--',
  'games/magic/src',
  'games/magic/assets.json',
  'games/magic/fonts.css',
  'games/magic/set-symbol-inventory.json',
  'games/magic/symbol-svg-patches.json',
);
const p = await onsSymbolStatsDelta();
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), p.afterRenderer);
assert.equal(p.captures.after.rows.length, 350);
const prefix = 'games/magic/fixtures/accuracy/ons-recheck/';
const publicationFile = prefix + 'publication-077.json';
await fs.access(path.join(root, publicationFile)).then(
  () => {
    throw Error('Publication receipt already exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const nativeFile = prefix + 'native-audit-077.json';
const receiptFile = prefix + 'symbols-and-stats-077.json.gz';
const receiptHash = hash(await fs.readFile(path.join(root, receiptFile)));
const write = async (file, data) =>
  atomicWrite(
    path.join(root, file),
    await format(JSON.stringify(data), { parser: 'json', printWidth: 100 }),
  );
await write(nativeFile, {
  schema: 1,
  set: 'ons',
  version: '0.7.7',
  sourceCommit: manifest.sourceCommit,
  rendererHash: p.afterRenderer,
  scope:
    '350 ordinary nonfoil Original printings; frozen scans/poses and unchanged whole-card metric. Development scans are reused, not an independent holdout. Prior credit/frame reviews transfer only through exact unchanged native pixels.',
  nonfoil: 350,
  nonfoilComplete: true,
  structure100: p.scores.after.all.acceptedPoseMean100,
  evidence: { file: receiptFile, sha256: receiptHash },
  materials: p.scores.after,
  pendingFoilOnlyPrintings: [
    { id: '0ee5aa80-32cc-486e-bbb2-5386eadaf4ca', collectorNumber: '200★' },
  ],
  outliers: [...p.scores.rows]
    .sort((a, b) => a.after - b.after)
    .slice(0, 20)
    .map((r) => ({ id: r.id, name: r.name, material: r.material, structure100: r.after * 100 })),
});
const methodFile = 'games/magic/tools/accuracy/ons-symbol-stats-publication.mjs';
const methodHash = hash(await fs.readFile(path.join(root, methodFile)));
await write(publicationFile, {
  schema: 1,
  status: 'published-verified-manual-patch',
  reviewedAt: new Date().toISOString(),
  method:
    'Complete renderer CI passed for identical renderer/build/test source, with an explicit strict version-only qualification when commits differ. Official GitHub downloads match their manifest, sizes and checksums. This receipt does not claim an automated release job ran.',
  release,
  workflow: ci,
  qualification,
  published: manifest,
  checksumsVerified: true,
  rendererHash: p.afterRenderer,
  nativeEvidence: {
    file: nativeFile,
    sha256: hash(await fs.readFile(path.join(root, nativeFile))),
  },
  regionalEvidence: { file: receiptFile, sha256: receiptHash },
  methodFile,
  methodHash,
});
const pubHash = hash(await fs.readFile(path.join(root, publicationFile)));
const ledgerFile = 'games/magic/fixtures/accuracy/calibration-progress.json';
const ledger = JSON.parse(await fs.readFile(path.join(root, ledgerFile)));
const set = ledger.sets.find((s) => s.set === 'ons');
for (const group of set.groups.filter((g) => g.references.nonfoil > 0)) {
  const item = group.tasks.release;
  assert.equal(item.status, 'validated');
  const source = hash(
    JSON.stringify({
      prior: item.proof.sourceHash,
      renderer: p.afterRenderer,
      publication: pubHash,
    }),
  );
  group.sourceHashes.release = source;
  Object.assign(item, {
    reviewedAt: new Date().toISOString(),
    reason:
      'Published 0.7.7 archives and complete exact-source CI match all350 nonfoil native/scoring members. The foil-only alternate remains deferred.',
    evidence: [publicationFile, nativeFile, ...item.evidence],
    guards: {
      ...item.guards,
      [publicationFile]: pubHash,
      [nativeFile]: hash(await fs.readFile(path.join(root, nativeFile))),
      [receiptFile]: receiptHash,
    },
    runtimeGuards: { ...item.runtimeGuards, 'games/magic/src': p.afterRenderer },
    proof: {
      ...item.proof,
      sourceHash: source,
      rendererHash: p.afterRenderer,
      onsSymbolStats: p.afterRenderer,
      methodHash,
      nativeReplayHash: p.native.source.afterCapture,
      metricsHash: p.scores.afterDefinition,
      version: '0.7.7',
      publishedCommit: manifest.sourceCommit,
      checksPassed: true,
    },
  });
}
set.audit = {
  version: '0.7.7',
  rendererHash: p.afterRenderer,
  structure100: p.scores.after.all.acceptedPoseMean100,
  nonfoil: 350,
  evidence: nativeFile,
  pendingFoilOnlyPrintings: 1,
  nonfoilComplete: true,
};
Object.assign(set.inventory.review.onsSymbolStats, {
  publication: 'released',
  version: '0.7.7',
  sourceCommit: manifest.sourceCommit,
});
await write(ledgerFile, ledger);
console.log(
  'Verified published 0.7.7 and complete nonfoil Onslaught census; no renderer inputs changed.',
);
