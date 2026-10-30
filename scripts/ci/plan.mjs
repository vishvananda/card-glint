import { createHash } from 'node:crypto';

/** Expand existing npm aliases; keep flags and multi-file Node tests intact. */
export function resolveCases(scripts, roots) {
  const byCommand = new Map();
  let invocations = 0;
  function expand(command, root, visiting = []) {
    const alias = /^npm run ([\w:.-]+)$/.exec(command);
    if (alias) {
      const name = alias[1];
      if (!scripts[name]) throw Error('Unknown CI suite: ' + name);
      if (visiting.includes(name)) throw Error('Cyclic CI suite: ' + name);
      for (const part of scripts[name].split(' && '))
        expand(part.trim(), root, [...visiting, name]);
      return;
    }
    // CI commands are literal Node invocations, never shell programs.
    const argv = command.split(/\s+/);
    if (
      argv[0] !== 'node' ||
      argv.length < 2 ||
      argv.some((token) => !/^[\w./:@=-]+$/.test(token)) ||
      argv.includes('scripts/ci/run.mjs')
    )
      throw Error('Unsupported CI command: ' + command);
    invocations++;
    const key = argv.join(' ');
    const prior = byCommand.get(key);
    if (prior) {
      if (!prior.suites.includes(root)) prior.suites.push(root);
    } else byCommand.set(key, { command: key, argv, suites: [root] });
  }
  for (const root of roots) expand(root, root);
  return { invocations, cases: [...byCommand.values()] };
}

/** Longest-first scheduling; every test runs once, serially within its shard. */
export function partition(cases, count, estimates) {
  if (!Number.isInteger(count) || count < 1 || count > 16)
    throw Error('CI shard count must be 1..16');
  const shards = Array.from({ length: count }, (_, index) => ({
    index,
    estimatedSeconds: 0,
    cases: [],
  }));
  const weighted = cases.map((test) => ({
    ...test,
    estimatedSeconds: estimates[test.command] ?? 10,
  }));
  for (const test of weighted)
    if (!Number.isFinite(test.estimatedSeconds) || test.estimatedSeconds <= 0)
      throw Error('Invalid CI duration: ' + test.command);
  weighted.sort(
    (a, b) =>
      b.estimatedSeconds - a.estimatedSeconds ||
      (a.command < b.command ? -1 : a.command > b.command ? 1 : 0),
  );
  for (const test of weighted) {
    const shard = shards.reduce((a, b) => (a.estimatedSeconds <= b.estimatedSeconds ? a : b));
    shard.cases.push(test);
    shard.estimatedSeconds += test.estimatedSeconds;
  }
  return shards;
}

export const planHash = (shards) =>
  createHash('sha256')
    .update(JSON.stringify(shards.map((s) => s.cases.map((t) => t.argv))))
    .digest('hex');

/** Missing, duplicate or foreign test results cannot satisfy the final gate. */
export function checkResults(shards, reports, commit) {
  const expected = new Set(shards.flatMap((s) => s.cases.map((t) => t.command)));
  const seen = new Set();
  const errors = [];
  const fingerprint = planHash(shards);
  const seenShards = new Set();
  for (const report of reports) {
    const assigned = shards.find((shard) => shard.index === report.shard);
    if (!assigned || seenShards.has(report.shard) || report.shards !== shards.length)
      errors.push('Invalid or duplicate CI shard: ' + report.shard);
    seenShards.add(report.shard);
    const allowed = new Set(assigned?.cases.map((test) => test.command) ?? []);
    if (report.schema !== 1 || report.planHash !== fingerprint || report.sourceCommit !== commit)
      errors.push('Incompatible CI report: ' + report.shard);
    for (const test of report.tests ?? []) {
      if (!expected.has(test.command) || !allowed.has(test.command) || seen.has(test.command))
        errors.push('Foreign or duplicate CI case: ' + test.command);
      seen.add(test.command);
      if (test.status !== 'passed' || test.code !== 0)
        errors.push('Failed CI case: ' + test.command);
      if (!Number.isFinite(test.seconds) || test.seconds < 0)
        errors.push('Invalid CI timing: ' + test.command);
    }
  }
  for (const command of expected)
    if (!seen.has(command)) errors.push('Missing CI case: ' + command);
  return errors;
}
