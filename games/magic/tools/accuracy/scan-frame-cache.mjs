import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { cacheRoot, hash, readJson, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { fitScanFrame, SCAN_FRAME_POLICY } from './scan-frame-fit.mjs';

const methodHash = async (names) =>
  hash(
    Buffer.concat(await Promise.all(names.map((name) => readFile(new URL(name, import.meta.url))))),
  );
export const SCAN_ANCHOR_METHOD_HASH = await methodHash([
  'scan-frame-anchors.mjs',
  'pixels-pure.mjs',
  'scan-transform.mjs',
]);
export const SCAN_FIT_METHOD_HASH = await methodHash([
  'scan-frame-fit.mjs',
  'scan-transform.mjs',
  'metrics.mjs',
]);

async function cached(file, identity, create) {
  try {
    const value = await readJson(file);
    assert.deepEqual(value.identity, identity, 'Frame cache identity mismatch');
    assert.equal(hash(JSON.stringify(value.result)), value.resultHash, 'Corrupt frame cache');
    return { result: value.result, cacheHit: true };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const result = await create();
  await writeJson(file, { identity, resultHash: hash(JSON.stringify(result)), result });
  return { result, cacheHit: false };
}

/** Warm comparisons reuse both edge observations and normalization without PNG
 * decoding. Never substitute a different scan/template after a checksum change. */
export async function cachedScanFrame(
  file,
  referenceHash,
  border,
  target,
  templateHash,
  directory = `${cacheRoot}/derived/scan-frame`,
) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), referenceHash, 'Frame reference bytes changed');
  const anchorIdentity = { referenceHash, border, methodHash: SCAN_ANCHOR_METHOD_HASH },
    anchorKey = hash(JSON.stringify(anchorIdentity));
  const anchors = await cached(`${directory}/anchors/${anchorKey}.json`, anchorIdentity, () =>
    scanFrameAnchors(normalize(PNG.sync.read(bytes, { checkCRC: true })), border),
  );
  const anchorHash = hash(JSON.stringify(anchors.result));
  const identity = {
      referenceHash,
      templateHash,
      targetHash: hash(JSON.stringify(target)),
      anchorHash,
      methodHash: SCAN_FIT_METHOD_HASH,
      policy: SCAN_FRAME_POLICY,
    },
    fitKey = hash(JSON.stringify(identity));
  const fit = await cached(`${directory}/fits/${fitKey}.json`, identity, () =>
    fitScanFrame(anchors.result, target),
  );
  return {
    ...fit.result,
    identity,
    anchorKey,
    fitKey,
    anchorCacheHit: anchors.cacheHit,
    fitCacheHit: fit.cacheHit,
  };
}
