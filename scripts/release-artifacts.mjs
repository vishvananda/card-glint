import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, rm, cp, mkdtemp, appendFile } from 'node:fs/promises';
import { spawnSync, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** Verify all published bytes before reusing an immutable release on a retry. */
export async function verifyReleaseArtifacts(directory, { version, sourceCommit }) {
  const bytes = await readFile(path.join(directory, 'release.json'));
  const manifest = JSON.parse(bytes);
  assert.match(version, /^\d+\.\d+\.\d+$/);
  assert.match(sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(manifest.version, version, 'Release version differs');
  assert.equal(manifest.sourceCommit, sourceCommit, 'Release source differs');
  const names = [`card-glint-${version}.tgz`, `card-glint-${version}-browser.zip`];
  assert.deepEqual(manifest.files.map((f) => f.name).sort(), [...names].sort());
  const sums = [];
  for (const file of manifest.files) {
    const data = await readFile(path.join(directory, file.name));
    assert.equal(data.length, file.bytes, file.name + ': size');
    assert.equal(sha(data), file.sha256, file.name + ': checksum');
    sums.push(`${file.sha256}  ${file.name}`);
  }
  sums.push(`${sha(bytes)}  release.json`);
  assert.deepEqual(
    (await readFile(path.join(directory, 'SHA256SUMS'), 'utf8')).trim().split('\n').sort(),
    sums.sort(),
    'Release checksum manifest differs',
  );
  return [...names, 'release.json', 'SHA256SUMS'];
}

/** Source CI still runs normally; a retry publishes the original verified archives
 * instead of replacing them with a different ZIP timestamp or build host. */
export async function selectReleaseArtifacts(directory, expected, publishedDirectory) {
  const names = await verifyReleaseArtifacts(publishedDirectory ?? directory, expected);
  if (publishedDirectory && path.resolve(directory) !== path.resolve(publishedDirectory)) {
    await rm(directory, { recursive: true, force: true });
    await mkdir(directory, { recursive: true });
    for (const name of names)
      await cp(path.join(publishedDirectory, name), path.join(directory, name));
  }
  return !!publishedDirectory;
}

async function main(directory) {
  assert(directory, 'Pass the release artifact directory');
  const version = JSON.parse(await readFile('package.json', 'utf8')).version;
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const expected = { version, sourceCommit },
    tag = `v${version}`;
  const result = spawnSync(
    'gh',
    ['release', 'view', tag, '--json', 'tagName,isDraft,isPrerelease,publishedAt'],
    {
      encoding: 'utf8',
    },
  );
  let temporary;
  try {
    if (result.error) throw result.error;
    if (result.status !== 0 && !/release not found|HTTP 404/i.test(result.stderr))
      throw Error('Cannot determine published release state: ' + result.stderr);
    if (result.status === 0) {
      const published = JSON.parse(result.stdout);
      assert.equal(published.tagName, tag);
      assert.equal(published.isDraft, false, 'Existing release is a draft');
      assert.equal(published.isPrerelease, false, 'Existing release is a prerelease');
      assert.ok(published.publishedAt, 'Existing release has not been published');
      temporary = await mkdtemp(path.join(tmpdir(), 'card-glint-published-'));
      execFileSync(
        'gh',
        [
          'release',
          'download',
          tag,
          '--dir',
          temporary,
          '--pattern',
          `card-glint-${version}.tgz`,
          '--pattern',
          `card-glint-${version}-browser.zip`,
          '--pattern',
          'release.json',
          '--pattern',
          'SHA256SUMS',
        ],
        { stdio: 'inherit' },
      );
    }
    const published = await selectReleaseArtifacts(directory, expected, temporary);
    if (process.env.GITHUB_OUTPUT)
      await appendFile(process.env.GITHUB_OUTPUT, `published=${published}\n`);
    console.log(
      published
        ? 'Reusing verified immutable published archives.'
        : 'New release archives verified.',
    );
  } finally {
    if (temporary) await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await main(process.argv[2]);
