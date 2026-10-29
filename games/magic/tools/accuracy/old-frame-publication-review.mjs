// Verify the published packages and CI before completing nonfoil release tasks.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { checkPublication } from './modern-publication-review.mjs';
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
await writeJson(out, {
  schema: 1,
  status: 'published-renderer-and-native-census',
  reviewedAt: new Date().toISOString(),
  release,
  workflow,
  published,
  checksumsVerified: true,
  rendererHash,
  censusHash: hash(census),
  toolFile,
  toolHash: hash(await fs.readFile(path.join(root, toolFile))),
  scope:
    'All 701 ordinary nonfoil members have exact native rasters, Original sources and frozen scan-only poses with this published renderer. One foil-only Onslaught alternate is explicitly deferred. Shared defaults do not certify other sets.',
});
