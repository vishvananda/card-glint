// Bind published packages and successful CI to the exact finite native score census.
import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { hash, sourceHash, writeJson } from './common.mjs';
const prefix = 'games/magic/fixtures/accuracy/m21/';
export const RELEASE_CHECKS = [
  'npm run build',
  'npm run check',
  'npm run test:package',
  'npm run magic:data:check',
  'npm run test:magic-accuracy',
  'npm run test:browser',
  'npm run test:showcase',
  'npm run test:magic',
  'npm run package:release',
  'npm run test:release',
  'npm run test:cdn-publish',
];
export function checkPublication(release, workflow, published) {
  assert.equal(release.isDraft, false);
  assert.equal(release.isPrerelease, false);
  assert.equal(release.tagName, 'v' + published.version);
  assert.match(release.publishedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(
    release.url,
    'https://github.com/vishvananda/card-glint/releases/tag/' + release.tagName,
  );
  assert.equal(workflow.status, 'completed');
  assert.equal(workflow.conclusion, 'success');
  assert.equal(workflow.headSha, published.sourceCommit);
  const renderer = workflow.jobs.find((j) => j.name === 'renderer');
  assert.equal(renderer?.conclusion, 'success');
  for (const name of RELEASE_CHECKS)
    assert.equal(renderer.steps.find((s) => s.name === 'Run ' + name)?.conclusion, 'success', name);
  assert.equal(workflow.jobs.find((j) => j.name === 'release')?.conclusion, 'success');
  assert.match(published.sourceCommit, /^[a-f0-9]{40}$/);
  assert.deepEqual(
    published.files.map((f) => f.name).sort(),
    [
      'card-glint-' + published.version + '-browser.zip',
      'card-glint-' + published.version + '.tgz',
    ].sort(),
  );
  const publishJob = workflow.jobs.find((j) => j.name === 'release');
  for (const name of ['Publish immutable CDN tree', 'Publish checked packages'])
    assert.equal(publishJob.steps.find((step) => step.name === name)?.conclusion, 'success', name);
  for (const file of published.files) {
    const asset = release.assets.find((a) => a.name === file.name);
    assert.equal(asset?.size, file.bytes, 'Published asset size: ' + file.name);
  }
}
export async function readCensus(file) {
  const bytes = await readFile(file),
    summary = JSON.parse(bytes);
  const compressedFile = path.join(path.dirname(file), summary.evidence.file);
  const compressed = await readFile(compressedFile);
  assert.equal(hash(compressed), summary.evidence.sha256);
  const raw = gunzipSync(compressed);
  assert.equal(hash(raw), summary.evidence.contentSha256);
  return {
    summary,
    detail: JSON.parse(raw),
    guards: {
      [file]: hash(bytes),
      [compressedFile]: hash(compressed),
    },
  };
}
export async function main(args) {
  const [directory, releaseFile, workflowFile, output] = args;
  assert(
    output && args.length === 4,
    'Use RELEASE_DIRECTORY RELEASE_API_JSON WORKFLOW_API_JSON OUTPUT',
  );
  const publishedBytes = await readFile(path.join(directory, 'release.json'));
  const published = JSON.parse(publishedBytes);
  const release = JSON.parse(await readFile(releaseFile));
  const workflow = JSON.parse(await readFile(workflowFile));
  checkPublication(release, workflow, published);
  const checksums = await readFile(path.join(directory, 'SHA256SUMS'));
  const expected = new Map(
    checksums
      .toString()
      .trim()
      .split('\n')
      .map((line) => {
        const m = /^([a-f0-9]{64})  ([a-zA-Z0-9._-]+)$/.exec(line);
        assert(m, 'Invalid checksum line');
        return [m[2], m[1]];
      }),
  );
  assert.equal(expected.size, 3);
  assert.equal(expected.get('release.json'), hash(publishedBytes));
  for (const file of published.files) {
    assert.match(file.name, /^card-glint-\d+\.\d+\.\d+(?:-browser\.zip|\.tgz)$/);
    const bytes = await readFile(path.join(directory, file.name));
    assert.equal(bytes.length, file.bytes);
    assert.equal(hash(bytes), file.sha256);
    assert.equal(expected.get(file.name), file.sha256);
  }
  const commit = execFileSync('git', ['rev-parse', release.tagName + '^{commit}'], {
    encoding: 'utf8',
  }).trim();
  assert.equal(commit, published.sourceCommit);
  const sourcePaths = [
    'games/magic/src',
    'games/magic/assets.json',
    'games/magic/fonts.css',
    'games/magic/set-symbol-inventory.json',
    'games/magic/symbol-svg-patches.json',
  ];
  execFileSync('git', ['diff', '--exit-code', commit, '--', ...sourcePaths], { stdio: 'pipe' });
  const census = await readCensus(prefix + 'current-component-census.json');
  const comparison = await readCensus(prefix + 'release-0612-comparison.json');
  const d = census.detail.definition,
    c = comparison.detail.definition;
  assert.equal(await sourceHash('games/magic/src'), d.rendererHash);
  assert.equal(published.version, c.afterVersion);
  for (const [a, b] of [
    ['rendererHash', 'afterRendererHash'],
    ['nativeCaptureHash', 'afterCaptureHash'],
    ['inputsHash', 'inputsHash'],
    ['normalizationHash', 'normalizationHash'],
    ['scoresHash', 'afterScoresHash'],
  ])
    assert.equal(d[a], c[b]);
  assert.equal(census.detail.rows.length, 297);
  assert.equal(comparison.detail.rows.length, 297);
  const rows = new Map(census.detail.rows.map((r) => [r.id, r]));
  assert.equal(rows.size, 297);
  for (const row of comparison.detail.rows) {
    const current = rows.get(row.id);
    assert(current && current.poseAccepted);
    for (const key of ['inputHash', 'referenceHash', 'poseHash'])
      assert.equal(row[key], current[key]);
    assert.equal(row.afterFaceHash, current.nativeFaceHash);
  }
  const ledger = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
  );
  const groups = ledger.sets.find((s) => s.set === 'm21').groups;
  assert.equal(groups.length, 85);
  assert.equal(hash(JSON.stringify(groups.map((g) => [g.key, g.scopeHash]))), d.inventoryScopeHash);
  assert.deepEqual(groups.flatMap((g) => g.printingIds).sort(), [...rows.keys()].sort());
  const toolFile = 'games/magic/tools/accuracy/modern-publication-review.mjs';
  await writeJson(output, {
    schema: 1,
    set: 'm21',
    status: 'published-renderer-and-matching-score-revision',
    reviewedAt: new Date().toISOString(),
    release,
    workflow,
    published,
    releaseManifestSha256: hash(publishedBytes),
    checksumsSha256: hash(checksums),
    checksumsVerified: true,
    rendererHash: d.rendererHash,
    toolFile,
    toolHash: hash(await readFile(fileURLToPath(import.meta.url))),
    nativeReplayHash: d.nativeCaptureHash,
    metricsHash: d.scoresHash,
    scanTemplateHash: d.normalizationHash,
    metricGraphHash: d.metricGraphHash,
    evidenceGuards: {
      ...census.guards,
      ...comparison.guards,
      ...Object.fromEntries(
        await Promise.all(
          sourcePaths.slice(1).map(async (file) => [file, hash(await readFile(file))]),
        ),
      ),
    },
    summary: {
      printings: 297,
      nonfoil: 292,
      foilOnly: 5,
      variants: 85,
      mean100: census.detail.summary.wholeCard.mean100,
    },
    groups: groups.map((g) => ({ key: g.key, scopeHash: g.scopeHash, printingIds: g.printingIds })),
    scope:
      'Publication and exact native/score identity only. Does not approve reference content, geometry, pigment, typography, full-card outliers or complete-set status. Foil-only printings remain structural controls.',
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await main(process.argv.slice(2));
