import { readFile, readdir, writeFile, appendFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { resolveCases, partition, checkResults } from './plan.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const { values } = parseArgs({
  options: { results: { type: 'string' }, shards: { type: 'string' } },
});
const directory = path.resolve(values.results ?? 'ci-results');
const count = Number(values.shards ?? 4);
const pkg = await json(path.join(root, 'package.json'));
const suites = await json(path.join(root, 'scripts/ci/suites.json'));
const baseline = await json(path.join(root, 'scripts/ci/baseline.json'));
const plan = partition(resolveCases(pkg.scripts, suites).cases, count, baseline.commands);
const names = (await readdir(directory)).filter((name) => /^ci-times-\d+\.json$/.test(name));
const reports = await Promise.all(names.map((name) => json(path.join(directory, name))));
const commit =
  process.env.GITHUB_SHA ??
  execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const errors = checkResults(plan, reports, commit);
if (reports.length !== count || new Set(reports.map((r) => r.shard)).size !== count)
  errors.push('Expected one report for each shard');
const tests = reports.flatMap((report) => report.tests);
const rows = tests.slice().sort((a, b) => b.seconds - a.seconds);
const lines = [
  '# Verification timing',
  '',
  tests.length + ' test invocations; ' + errors.length + ' verification errors.',
  'Times include process startup, CPU, I/O and GPU waits. They are not GPU throughput measurements.',
  '',
  '| Shard | Cases | Test seconds |',
  '| --- | ---: | ---: |',
  ...reports
    .sort((a, b) => a.shard - b.shard)
    .map(
      (r) =>
        '| ' +
        r.shard +
        ' | ' +
        r.tests.length +
        ' | ' +
        r.tests.reduce((n, test) => n + test.seconds, 0).toFixed(1) +
        ' |',
    ),
  '',
  '## Slowest checks',
  '',
  '| Check | Seconds | Result |',
  '| --- | ---: | --- |',
  ...rows
    .slice(0, 20)
    .map(
      (test) => '| ' + test.command + ' | ' + test.seconds.toFixed(2) + ' | ' + test.status + ' |',
    ),
  '',
  ...errors.map((error) => '- ' + error),
  '',
];
const markdown = lines.join('\n');
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
await writeFile(
  path.join(directory, 'summary.json'),
  JSON.stringify({ schema: 1, sourceCommit: commit, tests, errors }, null, 2) + '\n',
);
if (errors.length) process.exitCode = 1;
