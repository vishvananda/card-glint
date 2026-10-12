import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { atomicWrite, cacheRoot, hash, readJson } from './common.mjs';
import { WIDTH, HEIGHT } from './pixels.mjs';
import { normalizedGrayRegion } from './normalized-gray-region.mjs';

export const regionMethodHash = hash(
  await readFile(new URL('./normalized-gray-region.mjs', import.meta.url)),
);

/** Analysis cache only. Source bytes are still hashed on every call; a warm hit
 * skips PNG decoding and bilinear resampling, never source identity checks. */
export async function cachedGrayRegion(
  file,
  expectedHash,
  rect,
  transform = {},
  directory = `${cacheRoot}/normalized-regions`,
) {
  const source = await readFile(file);
  assert.equal(hash(source), expectedHash, 'Comparison PNG no longer matches its capture');
  const identity = {
      source: expectedHash,
      rect,
      transform,
      method: regionMethodHash,
      canonical: [WIDTH, HEIGHT],
    },
    key = hash(JSON.stringify(identity)),
    cacheFile = `${directory}/${key}.json`;
  let cached;
  try {
    cached = await readJson(cacheFile);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (cached) {
    assert.deepEqual(cached.identity, identity, 'Comparison cache identity mismatch');
    const bytes = Buffer.from(cached.bytes, 'base64');
    assert.equal(bytes.length, rect[2] * rect[3] * 4, 'Truncated comparison cache');
    assert.equal(hash(bytes), cached.sha256, 'Corrupt comparison cache');
    const gray = new Float32Array(rect[2] * rect[3]);
    for (let i = 0; i < gray.length; i++) gray[i] = bytes.readFloatLE(i * 4);
    return { gray, width: rect[2], height: rect[3], cacheHit: true };
  }
  const region = normalizedGrayRegion(PNG.sync.read(source, { checkCRC: true }), rect, transform),
    bytes = Buffer.alloc(region.gray.length * 4);
  region.gray.forEach((v, i) => bytes.writeFloatLE(v, i * 4));
  await atomicWrite(
    cacheFile,
    JSON.stringify({ identity, sha256: hash(bytes), bytes: bytes.toString('base64') }),
  );
  return { ...region, cacheHit: false };
}
