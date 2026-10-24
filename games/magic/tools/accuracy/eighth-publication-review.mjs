// Verify publication separately from component/outlier completion.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { format } from 'prettier';
import { execFileSync } from 'node:child_process';
import { hash, sourceHash } from './common.mjs';
import { checkPublication } from './modern-publication-review.mjs';
import { eighthAuditEvidence } from './calibration-eighth-audit.mjs';
const [directory, releaseFile, workflowFile, output] = process.argv.slice(2);
assert(output, 'Use RELEASE_DIRECTORY RELEASE_API_JSON WORKFLOW_API_JSON OUTPUT');
const read = async (f) => JSON.parse(await readFile(f));
const published = await read(path.join(directory, 'release.json')),
  release = await read(releaseFile),
  workflow = await read(workflowFile);
checkPublication(release, workflow, published);
const checksums = new Map(
  (await readFile(path.join(directory, 'SHA256SUMS'), 'utf8'))
    .trim()
    .split('\n')
    .map((line) => {
      const m = /^([a-f0-9]{64})  ([a-zA-Z0-9._-]+)$/.exec(line);
      assert(m);
      return [m[2], m[1]];
    }),
);
assert.equal(checksums.size, 3);
assert.equal(
  checksums.get('release.json'),
  hash(await readFile(path.join(directory, 'release.json'))),
);
for (const file of published.files) {
  const bytes = await readFile(path.join(directory, file.name));
  assert.equal(bytes.length, file.bytes);
  assert.equal(hash(bytes), file.sha256);
  assert.equal(checksums.get(file.name), file.sha256);
}
const commit = execFileSync('git', ['rev-parse', release.tagName + '^{commit}'], {
  encoding: 'utf8',
}).trim();
assert.equal(commit, published.sourceCommit);
execFileSync(
  'git',
  [
    'diff',
    '--exit-code',
    commit,
    '--',
    'games/magic/src',
    'games/magic/assets.json',
    'games/magic/fonts.css',
    'games/magic/set-symbol-inventory.json',
    'games/magic/symbol-svg-patches.json',
  ],
  { stdio: 'pipe' },
);
const audit = await eighthAuditEvidence();
assert(audit.current);
assert.equal(await sourceHash('games/magic/src'), audit.receipt.definition.rendererHash);
const ledgerFile = 'games/magic/fixtures/accuracy/calibration-progress.json',
  ledger = await read(ledgerFile),
  set = ledger.sets.find((s) => s.set === '8ed'),
  groups = set.groups.filter((g) => g.references.nonfoil === g.printings);
assert.equal(groups.length, 24);
assert.deepEqual(
  groups.flatMap((g) => g.printingIds).sort(),
  audit.receipt.rows.map((r) => r.id).sort(),
);
const toolFile = 'games/magic/tools/accuracy/eighth-publication-review.mjs',
  toolHash = hash(await readFile(toolFile));
const receipt = {
  schema: 1,
  status: 'published-eighth-baseline',
  reviewedAt: new Date().toISOString(),
  scope:
    'The published ordinary Eighth nonfoil baseline and its exact 357-printing diagnostic replay. Publication does not approve remaining component/texture/text outliers or foil appearance.',
  checksumsVerified: true,
  published,
  release,
  workflow,
  rendererHash: audit.receipt.definition.rendererHash,
  nativeReplayHash: audit.receipt.definition.nativeCaptureHash,
  metricsHash: hash(JSON.stringify(audit.receipt.rows)),
  summary: {
    printings: 357,
    variants: 24,
    foilOnlyExcluded: 350,
    structure100: audit.receipt.summary.final100,
  },
  groups: groups.map((g) => ({ key: g.key, scopeHash: g.scopeHash, printingIds: g.printingIds })),
  evidenceGuards: audit.guards,
  toolFile,
  toolHash,
};
await writeFile(output, await format(JSON.stringify(receipt), { parser: 'json' }));
// Hash the formatted receipt bytes used by the release task.
const guards = { ...audit.guards, [output]: hash(await readFile(output)), [toolFile]: toolHash };
for (const g of groups) {
  g.tasks.release = {
    status: 'validated',
    reviewedAt: receipt.reviewedAt,
    reason:
      'Published 0.7.0 packages and successful complete renderer CI match the 357-printing nonfoil native census. Publication is complete; known component/asset outliers remain open.',
    evidence: [output, ...Object.keys(audit.guards)],
    guards,
    runtimeGuards: { 'games/magic/src': receipt.rendererHash },
    coveredPrintings: g.printings,
    proof: {
      sourceHash: g.sourceHashes?.release ?? g.sourceHash,
      scopeHash: g.scopeHash,
      gatesPassed: true,
      rendererHash: receipt.rendererHash,
      eighthDefaultsSource: receipt.rendererHash,
      methodHash: toolHash,
      nativeReplayHash: receipt.nativeReplayHash,
      metricsHash: receipt.metricsHash,
      coveredPrintings: g.printings,
      version: published.version,
      publishedCommit: published.sourceCommit,
      checksPassed: true,
    },
  };
}
await writeFile(ledgerFile, await format(JSON.stringify(ledger), { parser: 'json' }));
console.log(JSON.stringify(receipt.summary));
