// Verify the published packages and CI before completing nonfoil release tasks.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash, atomicWrite } from './common.mjs';
import { format } from 'prettier';
import { checkPublication } from './modern-publication-review.mjs';
// Format before hashing so a later repository formatting check cannot stale the receipt.
const writeReviewedJson = async (file, value) =>
  atomicWrite(file, await format(JSON.stringify(value), { parser: 'json', printWidth: 100 }));
const [directory, releaseFile, workflowFile, out] = process.argv.slice(2);
assert(out, 'Use RELEASE_DIRECTORY RELEASE_API_JSON WORKFLOW_API_JSON NEW_RECEIPT');
await fs.access(out).then(
  () => {
    throw Error('Receipt exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const raw = await fs.readFile(path.join(directory, 'release.json')),
  published = JSON.parse(raw);
const release = JSON.parse(await fs.readFile(releaseFile)),
  workflow = JSON.parse(await fs.readFile(workflowFile));
checkPublication(release, workflow, published);
assert.equal(published.version, '0.7.5');
const lines = (await fs.readFile(path.join(directory, 'SHA256SUMS'), 'utf8')).trim().split('\n');
const sums = new Map(
  lines.map((line) => {
    const m = /^([a-f0-9]{64})  ([a-zA-Z0-9._-]+)$/.exec(line);
    assert(m);
    return [m[2], m[1]];
  }),
);
assert.equal(sums.size, 3);
assert.equal(sums.get('release.json'), hash(raw));
for (const f of published.files) {
  const b = await fs.readFile(path.join(directory, f.name));
  assert.equal(b.length, f.bytes);
  assert.equal(hash(b), f.sha256);
  assert.equal(sums.get(f.name), f.sha256);
}
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
assert.equal(git('rev-parse', release.tagName + '^{commit}'), published.sourceCommit);
git(
  'diff',
  '--exit-code',
  published.sourceCommit,
  '--',
  'games/magic/src',
  'games/magic/assets.json',
  'games/magic/fonts.css',
  'games/magic/set-symbol-inventory.json',
  'games/magic/symbol-svg-patches.json',
);
const file = 'games/magic/fixtures/accuracy/mirage-onslaught/complete-census.json.gz',
  census = await fs.readFile(path.join(root, file)),
  data = JSON.parse(gunzipSync(census));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(data.rendererHash, rendererHash);
assert.equal(data.sets.mir.members.length, 351);
assert.equal(data.sets.ons.members.length, 350);
const toolFile = 'games/magic/tools/accuracy/old-frame-publication-review.mjs';
const auditEvidence = {};
for (const set of ['mir', 'ons']) {
  const study = data.sets[set];
  const auditFile = 'games/magic/fixtures/accuracy/' + set + '/native-audit-075.json';
  await writeReviewedJson(path.join(root, auditFile), {
    schema: 1,
    set,
    version: published.version,
    sourceCommit: published.sourceCommit,
    rendererHash,
    scope:
      'Complete ordinary English nonfoil native census. Development scans are reused; this is not an independent holdout. Credits are reviewed separately from the structural index.',
    nonfoil: study.members.length,
    structure100: study.scores.summary.structuralMean100,
    census: { file, sha256: hash(census) },
    footerReview: data.footerReview,
    components: study.scores.summary.components,
    materials: study.scores.materials,
    pendingFoilOnlyPrintings:
      set === 'ons'
        ? [{ id: '0ee5aa80-32cc-486e-bbb2-5386eadaf4ca', collectorNumber: '200★' }]
        : [],
    outliers: [...study.members]
      .sort((a, b) => a.after100 - b.after100)
      .slice(0, 20)
      .map((r) => ({ id: r.id, name: r.name, material: r.material, structure100: r.after100 })),
  });
  auditEvidence[auditFile] = hash(await fs.readFile(path.join(root, auditFile)));
}
await writeReviewedJson(out, {
  schema: 1,
  status: 'published-renderer-and-native-census',
  reviewedAt: new Date().toISOString(),
  release,
  workflow,
  published,
  checksumsVerified: true,
  auditEvidence,
  rendererHash,
  censusHash: hash(census),
  toolFile,
  toolHash: hash(await fs.readFile(path.join(root, toolFile))),
  scope:
    'All 701 ordinary nonfoil members have exact native rasters, Original sources and frozen scan-only poses with this published renderer. One foil-only Onslaught alternate is explicitly deferred. Shared defaults do not certify other sets.',
});
