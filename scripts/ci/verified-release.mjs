import { execFileSync } from 'node:child_process';
import { readFile, appendFile, mkdtemp, cp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Release only the exact commit checked by this repository's main workflow. */
export function selectVerifiedRun(runs, commit, repository) {
  const eligible = runs.filter(
    (run) =>
      run.head_sha === commit &&
      run.head_branch === 'main' &&
      run.head_repository?.full_name === repository &&
      run.event === 'push' &&
      run.path === '.github/workflows/check.yml' &&
      run.status === 'completed' &&
      run.conclusion === 'success',
  );
  eligible.sort((a, b) => b.id - a.id);
  if (!eligible.length)
    throw Error(
      'No successful main CI for this exact commit. Complete that run before publishing.',
    );
  return eligible[0];
}

export function verifiedArtifact(artifacts, run, commit) {
  const matches = artifacts.filter(
    (artifact) =>
      artifact.name === 'renderer-build' &&
      !artifact.expired &&
      artifact.workflow_run?.id === run.id &&
      artifact.workflow_run?.head_sha === commit,
  );
  if (matches.length !== 1)
    throw Error(
      'The verified build artifact is missing or expired. Rerun main CI for this commit.',
    );
  return matches[0];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const repository = process.env.GH_REPO ?? process.env.GITHUB_REPOSITORY;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? ''))
    throw Error('Missing GitHub repository identity');
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const api = (url) =>
    JSON.parse(execFileSync('gh', ['api', url], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
  const data = api(
    'repos/' +
      repository +
      '/actions/workflows/check.yml/runs?head_sha=' +
      commit +
      '&status=success&event=push&per_page=100',
  );
  const run = selectVerifiedRun(data.workflow_runs, commit, repository);
  const artifacts = api(
    'repos/' + repository + '/actions/runs/' + run.id + '/artifacts?per_page=100',
  );
  const artifact = verifiedArtifact(artifacts.artifacts, run, commit);
  const directory = await mkdtemp(path.join(os.tmpdir(), 'card-glint-verified-'));
  try {
    execFileSync(
      'gh',
      [
        'run',
        'download',
        String(run.id),
        '--repo',
        repository,
        '--name',
        artifact.name,
        '--dir',
        directory,
      ],
      { stdio: 'inherit' },
    );
    const release = path.join(directory, 'dist/releases');
    const manifest = JSON.parse(await readFile(path.join(release, 'release.json')));
    const pkg = JSON.parse(await readFile('package.json'));
    if (
      manifest.sourceCommit !== commit ||
      manifest.version !== pkg.version ||
      process.env.GITHUB_REF_NAME !== 'v' + manifest.version
    )
      throw Error('Downloaded release provenance does not match the tag');
    const after = api('repos/' + repository + '/actions/runs/' + run.id);
    selectVerifiedRun([after], commit, repository);
    if (after.run_attempt !== run.run_attempt)
      throw Error('Main CI was rerun during artifact download; retry after it finishes');
    const unchanged = api('repos/' + repository + '/actions/artifacts/' + artifact.id);
    if (unchanged.expired || unchanged.digest !== artifact.digest)
      throw Error('Verified artifact changed during download');
    // Restore only immutable archives; never overwrite tracked generated source.
    await cp(release, 'dist/releases', { recursive: true, force: false, errorOnExist: true });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
  const message = 'Reusing checked build from ' + run.html_url + ' (commit ' + commit + ').';
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(process.env.GITHUB_STEP_SUMMARY, message + '\n');
}
