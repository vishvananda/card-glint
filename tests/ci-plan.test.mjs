import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveCases, partition, planHash, checkResults } from '../scripts/ci/plan.mjs';
const json = async (file) => JSON.parse(await readFile(new URL('../' + file, import.meta.url)));
const pkg = await json('package.json');
const roots = await json('scripts/ci/suites.json');
const baseline = await json('scripts/ci/baseline.json');
const plan = resolveCases(pkg.scripts, roots);

test('every previous CI case remains, with exact repeats removed', () => {
  const actual = new Set(plan.cases.map((test) => test.command));
  assert.equal(actual.size, plan.cases.length);
  for (const command of Object.keys(baseline.commands)) assert(actual.has(command), command);
  assert(plan.invocations > plan.cases.length);
});

test('nested aliases deduplicate, while source/built flags remain separate', () => {
  const result = resolveCases(
    { a: 'npm run b && node tests/a.mjs --built', b: 'node tests/a.mjs' },
    ['npm run a', 'npm run b'],
  );
  assert.equal(result.invocations, 3);
  assert.equal(result.cases.length, 2);
  assert.deepEqual(result.cases[1].argv, ['node', 'tests/a.mjs', '--built']);
  assert.throws(() => resolveCases({ a: 'npm run b', b: 'npm run a' }, ['npm run a']), /Cyclic/);
  assert.throws(() => resolveCases({}, ['node tests/a.mjs; bogus']), /Unsupported/);
});

test('shards form one deterministic, complete partition', () => {
  const a = partition(plan.cases, 4, baseline.commands);
  assert.deepEqual(a, partition(plan.cases, 4, baseline.commands));
  const all = a.flatMap((shard) => shard.cases.map((test) => test.command));
  assert.equal(all.length, plan.cases.length);
  assert.equal(new Set(all).size, all.length);
  assert.throws(() => partition(plan.cases, 0, {}), /shard count/);
});

test('the final gate rejects missing, duplicate, foreign and failed results', () => {
  const shards = partition(resolveCases({}, ['node tests/a.mjs', 'node tests/b.mjs']).cases, 2, {});
  const reports = shards.map((shard) => ({
    schema: 1,
    sourceCommit: 'commit',
    planHash: planHash(shards),
    shard: shard.index,
    shards: shards.length,
    tests: shard.cases.map((test) => ({
      command: test.command,
      status: 'passed',
      code: 0,
      seconds: 1,
    })),
  }));
  assert.deepEqual(checkResults(shards, reports, 'commit'), []);
  assert(checkResults(shards, reports.slice(1), 'commit').length);
  assert(checkResults(shards, [...reports, reports[0]], 'commit').length);
  const failed = structuredClone(reports);
  failed[0].tests[0].status = 'failed';
  assert(checkResults(shards, failed, 'commit').length);
  assert(checkResults(shards, reports, 'other').length);
  for (const patch of [{ shard: 9 }, { shards: 5 }]) {
    const wrong = structuredClone(reports);
    Object.assign(wrong[0], patch);
    assert(checkResults(shards, wrong, 'commit').length);
  }
  for (const patch of [{ code: 1 }, { seconds: NaN }]) {
    const wrong = structuredClone(reports);
    Object.assign(wrong[0].tests[0], patch);
    assert(checkResults(shards, wrong, 'commit').length);
  }
});

test('release reuse requires successful main CI, exact SHA and a live bound artifact', async () => {
  const { selectVerifiedRun, verifiedArtifact } = await import(
    '../scripts/ci/verified-release.mjs'
  );
  const good = {
    id: 10,
    head_sha: 'commit',
    head_branch: 'main',
    head_repository: { full_name: 'owner/repo' },
    event: 'push',
    path: '.github/workflows/check.yml',
    status: 'completed',
    conclusion: 'success',
  };
  assert.equal(selectVerifiedRun([good], 'commit', 'owner/repo'), good);
  for (const patch of [
    { head_sha: 'other' },
    { head_branch: 'feature' },
    { event: 'pull_request' },
    { conclusion: 'failure' },
    { status: 'in_progress' },
    { head_repository: { full_name: 'fork/repo' } },
    { path: '.github/workflows/other.yml' },
  ])
    assert.throws(
      () => selectVerifiedRun([{ ...good, ...patch }], 'commit', 'owner/repo'),
      /No successful/,
    );
  const artifact = {
    name: 'renderer-build',
    expired: false,
    workflow_run: { id: 10, head_sha: 'commit' },
  };
  assert.equal(verifiedArtifact([artifact], good, 'commit'), artifact);
  assert.throws(
    () => verifiedArtifact([{ ...artifact, expired: true }], good, 'commit'),
    /missing or expired/,
  );
  assert.throws(() => verifiedArtifact([artifact, artifact], good, 'commit'), /missing or expired/);
  assert.throws(() => verifiedArtifact([artifact], good, 'other'), /missing or expired/);
});
