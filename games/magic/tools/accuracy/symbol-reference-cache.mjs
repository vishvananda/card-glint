import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { cacheRoot, hash, readJson, writeJson } from './common.mjs';
import { measureSymbolBounds } from './symbol-bounds.mjs';

export const REFERENCE_BOUNDS_METHOD_HASH = hash(
  Buffer.concat(
    await Promise.all(
      ['symbol-reference-cache.mjs', 'symbol-bounds.mjs', 'symbol-component-bounds.mjs'].map(
        (file) => readFile(new URL(file, import.meta.url)),
      ),
    ),
  ),
);

/** Native reference segmentation is independent of a candidate renderer. Cache
 * by source bytes, complete profile and method so repeated fits need no PNG
 * decoding. Inconclusive measurements are reusable evidence, not empty success. */
export async function cachedReferenceSymbolBounds(
  file,
  referenceHash,
  profile,
  directory = `${cacheRoot}/derived/symbol-bounds`,
) {
  const identity = {
      referenceHash,
      profileHash: hash(JSON.stringify(profile)),
      methodHash: REFERENCE_BOUNDS_METHOD_HASH,
    },
    destination = `${directory}/${hash(JSON.stringify(identity))}.json`;
  try {
    const cached = await readJson(destination);
    assert.deepEqual(cached.identity, identity, 'Reference segmentation cache identity changed.');
    assert.equal(typeof cached.measurement?.stable, 'boolean');
    return cached.measurement;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const bytes = await readFile(file);
  assert.equal(hash(bytes), referenceHash, 'Reference bytes changed before segmentation.');
  const measurement = measureSymbolBounds(PNG.sync.read(bytes, { checkCRC: true }), profile);
  await writeJson(destination, { identity, measurement });
  return measurement;
}
