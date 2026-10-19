import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import { verifyMetadataRefresh } from '../games/magic/tools/accuracy/abu-metadata-refresh.mjs';
const directory = await mkdtemp(path.join(tmpdir(), 'abu-metadata-'));
try {
  await mkdir(path.join(directory, 'data'));
  await writeFile(path.join(directory, 'painter.ts'), 'export const ink = 1;');
  const beforeMetadata = JSON.stringify({ files: { table: 'same' }, sources: { painter: 'old' } });
  await writeFile(path.join(directory, 'data/generated-manifest.json'), beforeMetadata);
  const beforeRendererHash = await sourceHash(directory);
  const after = JSON.stringify({ files: { table: 'same' }, sources: { painter: 'current' } });
  await writeFile(path.join(directory, 'data/generated-manifest.json'), after);
  const proof = {
    beforeMetadata,
    beforeMetadataHash: hash(beforeMetadata),
    afterMetadataHash: hash(after),
    beforeRendererHash,
    afterRendererHash: await sourceHash(directory),
  };
  await verifyMetadataRefresh(directory, proof);
  await writeFile(path.join(directory, 'painter.ts'), 'export const ink = 2;');
  await assert.rejects(
    verifyMetadataRefresh(directory, proof),
    'Executable changes cannot use metadata equivalence',
  );
  await writeFile(path.join(directory, 'painter.ts'), 'export const ink = 1;');
  const changed = JSON.stringify({
    files: { table: 'different' },
    sources: { painter: 'current' },
  });
  await writeFile(path.join(directory, 'data/generated-manifest.json'), changed);
  await assert.rejects(
    verifyMetadataRefresh(directory, {
      ...proof,
      afterMetadataHash: hash(changed),
      afterRendererHash: await sourceHash(directory),
    }),
    'Payload changes cannot use metadata equivalence',
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log(
  'Audit metadata refresh preserves exact executable and payload identities; other changes fail closed.',
);
