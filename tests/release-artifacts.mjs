import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { verifyReleaseArtifacts, selectReleaseArtifacts } from '../scripts/release-artifacts.mjs';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const root = await mkdtemp(path.join(tmpdir(), 'glint-release-retry-'));
const expected = { version: '0.6.0', sourceCommit: 'a'.repeat(40) };
async function fixture(directory, label) {
  await mkdir(directory, { recursive: true });
  const files = [];
  for (const name of ['card-glint-0.6.0.tgz', 'card-glint-0.6.0-browser.zip']) {
    const data = Buffer.from(label + name);
    await writeFile(path.join(directory, name), data);
    files.push({ name, bytes: data.length, sha256: sha(data) });
  }
  const bytes = Buffer.from(JSON.stringify({ ...expected, files }) + '\n');
  await writeFile(path.join(directory, 'release.json'), bytes);
  await writeFile(
    path.join(directory, 'SHA256SUMS'),
    files.map((f) => `${f.sha256}  ${f.name}\n`).join('') + `${sha(bytes)}  release.json\n`,
  );
}
try {
  const candidate = path.join(root, 'candidate'),
    published = path.join(root, 'published');
  await fixture(candidate, 'new build host');
  await fixture(published, 'original published bytes');
  assert.equal(await selectReleaseArtifacts(candidate, expected), false);
  await assert.rejects(
    verifyReleaseArtifacts(published, { ...expected, sourceCommit: 'b'.repeat(40) }),
    /source differs/,
  );
  await assert.rejects(
    verifyReleaseArtifacts(published, { ...expected, version: '0.6.1' }),
    /version differs/,
  );
  assert.equal(await selectReleaseArtifacts(candidate, expected, published), true);
  assert.deepEqual(
    await readFile(path.join(candidate, 'card-glint-0.6.0-browser.zip')),
    await readFile(path.join(published, 'card-glint-0.6.0-browser.zip')),
  );
  assert.equal(await selectReleaseArtifacts(candidate, expected, published), true);
  await writeFile(path.join(published, 'card-glint-0.6.0.tgz'), 'corrupt');
  await assert.rejects(selectReleaseArtifacts(candidate, expected, published), /size|checksum/);
  await verifyReleaseArtifacts(candidate, expected);
  await writeFile(path.join(candidate, 'SHA256SUMS'), 'wrong');
  await assert.rejects(verifyReleaseArtifacts(candidate, expected), /manifest differs/);
  console.log(
    'Release retry preserves original archives; wrong revisions and corrupt or incomplete checksums fail closed.',
  );
} finally {
  await rm(root, { recursive: true, force: true });
}
