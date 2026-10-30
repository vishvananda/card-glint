import { spawn, execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { resolveCases, partition, planHash } from './plan.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const json = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const { values } = parseArgs({
  options: { shard: { type: 'string' }, shards: { type: 'string' }, list: { type: 'boolean' } },
});
const count = Number(values.shards ?? 1);
const index = Number(values.shard ?? 0);
if (!Number.isInteger(index) || index < 0 || index >= count) throw Error('Invalid CI shard index');
const pkg = await json('package.json');
const baseline = await json('scripts/ci/baseline.json');
const cases = resolveCases(pkg.scripts, await json('scripts/ci/suites.json'));
const shards = partition(cases.cases, count, baseline.commands);
if (values.list) {
  console.log(
    JSON.stringify({ invocations: cases.invocations, unique: cases.cases.length, shards }, null, 2),
  );
} else {
  const report = {
    schema: 1,
    sourceCommit:
      process.env.GITHUB_SHA ??
      execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    planHash: planHash(shards),
    shard: index,
    shards: count,
    node: process.version,
    platform: process.platform,
    scope: 'Process wall time, including startup, CPU, I/O and GPU waits; not GPU throughput.',
    tests: [],
  };
  const build = await json('dist/releases/release.json');
  if (build.sourceCommit !== report.sourceCommit || build.version !== pkg.version)
    throw Error(
      'Build artifacts do not match this commit/version. Build and package this checkout first.',
    );
  let child,
    stopping = false;
  const stop = () => {
    stopping = true;
    child?.kill('SIGTERM');
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  const output = path.join(root, 'evidence/ci-times-' + index + '.json');
  await mkdir(path.dirname(output), { recursive: true });
  const save = () => writeFile(output, JSON.stringify(report, null, 2) + '\n');
  for (const test of shards[index].cases) {
    if (stopping) break;
    console.log('::group::' + test.command);
    const started = performance.now();
    const result = await new Promise((resolve) => {
      child = spawn(process.execPath, test.argv.slice(1), { cwd: root, stdio: 'inherit' });
      child.once('error', (error) => resolve({ code: null, error: error.message }));
      child.once('exit', (code, signal) => resolve({ code, signal }));
    });
    child = undefined;
    const seconds = (performance.now() - started) / 1000;
    report.tests.push({
      command: test.command,
      status: result.code === 0 ? 'passed' : 'failed',
      seconds,
      ...result,
    });
    console.log('::endgroup::');
    console.log(
      (result.code === 0 ? 'PASS ' : 'FAIL ') + test.command + ' (' + seconds.toFixed(2) + 's)',
    );
    await save();
  }
  await save();
  if (stopping || report.tests.some((test) => test.status !== 'passed')) process.exitCode = 1;
}
