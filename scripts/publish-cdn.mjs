// Publish only a checksum-verified browser archive. The CDN tag has its own
// artifact-only tree; generated bundles never enter the source branch.
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
const directory = path.resolve(process.argv[2] ?? 'dist/releases');
const manifest = JSON.parse(await readFile(path.join(directory, 'release.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw Error('CDN requires an exact stable version');
const tag = `cdn-v${manifest.version}`;
const git = (args, cwd = process.cwd()) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const archive = manifest.files.find((f) => f.name === `card-glint-${manifest.version}-browser.zip`);
if (!archive) throw Error('Missing browser archive');
const bytes = await readFile(path.join(directory, archive.name));
if (createHash('sha256').update(bytes).digest('hex') !== archive.sha256)
  throw Error('Browser archive checksum failed');
if (git(['ls-remote', '--tags', 'origin', `refs/tags/${tag}`])) {
  git(['fetch', 'origin', `refs/tags/${tag}`]);
  const published = JSON.parse(git(['show', 'FETCH_HEAD:build.json']));
  if (
    published.sourceCommit !== manifest.sourceCommit ||
    published.files.find((f) => f.name === archive.name)?.sha256 !== archive.sha256
  )
    throw Error('Refusing to replace a published CDN version');
  console.log(`${tag} is already published with this exact archive.`);
  process.exit(0);
}
const temporary = await mkdtemp(path.join(os.tmpdir(), 'card-glint-cdn-'));
try {
  execFileSync('unzip', ['-q', path.join(directory, archive.name), '-d', temporary]);
  const root = path.join(temporary, archive.name.slice(0, -4));
  await writeFile(path.join(root, 'build.json'), JSON.stringify(manifest, null, 2) + '\n');
  git(['init', '--quiet'], root);
  git(['add', '.'], root);
  git(
    [
      '-c',
      'user.name=github-actions[bot]',
      '-c',
      'user.email=41898282+github-actions[bot]@users.noreply.github.com',
      'commit',
      '--quiet',
      '-m',
      `Browser distribution ${manifest.version}; source ${manifest.sourceCommit}`,
    ],
    root,
  );
  git(['fetch', '--no-tags', root, 'HEAD']);
  git(['tag', tag, 'FETCH_HEAD']);
  git(['push', 'origin', `refs/tags/${tag}`]);
  console.log(`https://cdn.jsdelivr.net/gh/vishvananda/card-glint@${tag}/browser.js`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
