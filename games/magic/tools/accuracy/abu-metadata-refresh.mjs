import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { hash } from './common.mjs';

/** Explicitly certify an audit-manifest refresh, never a renderer/payload edit.
 * The generated manifest is not imported by the painter. Reconstructing the
 * entire old source digest ensures no executable file changed during capture. */
export async function verifyMetadataRefresh(directory, proof) {
  const file = 'data/generated-manifest.json';
  const current = await readFile(path.join(directory, file));
  assert.equal(hash(current), proof.afterMetadataHash);
  const previous = Buffer.from(proof.beforeMetadata);
  assert.equal(hash(previous), proof.beforeMetadataHash);
  assert.deepEqual(JSON.parse(current).files, JSON.parse(previous).files);
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  const graph = await Promise.all(
    files.map(async (f) => [path.relative(directory, f), hash(await readFile(f))]),
  );
  assert.equal(hash(JSON.stringify(graph)), proof.afterRendererHash);
  const before = graph.map(([f, h]) => [f, f === file ? hash(previous) : h]);
  assert.equal(hash(JSON.stringify(before)), proof.beforeRendererHash);
  return {
    beforeRendererHash: proof.beforeRendererHash,
    afterRendererHash: proof.afterRendererHash,
    proofHash: hash(JSON.stringify(proof)),
    scope: 'Audit metadata only; executable source, emitted tables, fonts and assets unchanged.',
  };
}
