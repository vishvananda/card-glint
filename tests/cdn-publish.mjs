import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, cp, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
const temporary = await mkdtemp(path.join(os.tmpdir(), 'glint-cdn-test-'));
const script = path.resolve('scripts/publish-cdn.mjs');
const git = (cwd, args) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
try {
  const source = path.join(temporary, 'source'),
    remote = path.join(temporary, 'remote.git'),
    packages = path.join(temporary, 'packages');
  await mkdir(source);
  git(temporary, ['init', '--bare', '--quiet', remote]);
  git(source, ['init', '--quiet']);
  git(source, ['remote', 'add', 'origin', remote]);
  git(source, [
    '-c',
    'user.name=Test',
    '-c',
    'user.email=test@example.invalid',
    'commit',
    '--allow-empty',
    '--quiet',
    '-m',
    'Source',
  ]);
  const head = git(source, ['rev-parse', 'HEAD']);
  await cp('dist/releases', packages, { recursive: true });
  const manifest = JSON.parse(await readFile(path.join(packages, 'release.json'), 'utf8'));
  const tag = 'cdn-v' + manifest.version;
  const run = () =>
    spawnSync(process.execPath, [script, packages], { cwd: source, encoding: 'utf8' });
  let result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(git(source, ['rev-parse', 'HEAD']), head, 'Publication changed the source checkout');
  assert.ok(git(source, ['ls-remote', '--tags', 'origin', 'refs/tags/' + tag]));
  const files = git(source, ['ls-tree', '-r', '--name-only', tag]).split('\n');
  for (const file of [
    'browser.js',
    'renderer_bg.wasm',
    'showcase.js',
    'build.json',
    'art/tide.webp',
  ])
    assert.ok(files.includes(file));
  assert.ok(
    !files.some((file) => file.startsWith('packages/') || file.startsWith('node_modules/')),
  );
  assert.equal(
    JSON.parse(git(source, ['show', tag + ':build.json'])).sourceCommit,
    manifest.sourceCommit,
  );
  result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes('already published'));
  const zip = manifest.files.find((file) => file.name.endsWith('.zip'));
  await writeFile(path.join(packages, zip.name), 'corrupted archive');
  result = run();
  assert.notEqual(result.status, 0);
  assert.ok(result.stderr.includes('checksum failed'));
  console.log(
    'CDN publication passed against a local Git remote: isolated artifact tag, idempotent retry and corrupt archive rejection.',
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
