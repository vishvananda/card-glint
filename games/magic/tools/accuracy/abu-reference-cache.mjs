import path from 'node:path';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, readJson, writeJson, atomicWrite } from './common.mjs';
import { normalize } from './pixels-pure.mjs';

const normalizerHash = hash(
  JSON.stringify(
    await Promise.all(
      ['pixels-pure.mjs', 'scan-transform.mjs'].map(async (file) => [
        file,
        hash(await readFile(new URL(file, import.meta.url))),
      ]),
    ),
  ),
);
/** Derived rasters are keyed by scan bytes and comparison transform, never by
 * renderer version, wording, fit candidates, or the surrounding input manifest. */
export async function normalizedReference(entry, pose, directory) {
  assert.equal(entry.reference.sha256, pose.referenceHash);
  const key = hash(
    JSON.stringify({
      referenceHash: pose.referenceHash,
      transform: pose.transform,
      normalizerHash,
    }),
  );
  await mkdir(directory, { recursive: true });
  const file = path.join(directory, key + '.png'),
    receiptFile = path.join(directory, key + '.json');
  let receipt;
  try {
    receipt = await readJson(receiptFile);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (receipt) {
    assert.equal(receipt.key, key);
    const bytes = await readFile(file);
    assert.equal(hash(bytes), receipt.rasterHash, 'Corrupt normalized reference');
    return { image: PNG.sync.read(bytes), bytes, key };
  }
  const raw = await readFile(objectFile(entry.reference));
  assert.equal(hash(raw), entry.reference.sha256);
  const image = normalize(normalize(PNG.sync.read(raw)), pose.transform);
  const bytes = PNG.sync.write({
    width: image.width,
    height: image.height,
    data: Buffer.from(image.data),
  });
  await atomicWrite(file, bytes);
  await writeJson(receiptFile, {
    schema: 1,
    key,
    normalizerHash,
    referenceHash: pose.referenceHash,
    transform: pose.transform,
    rasterHash: hash(bytes),
  });
  return { image, bytes, key };
}
