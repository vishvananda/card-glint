import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PNG } from 'pngjs';

const directory = await mkdtemp(path.join(tmpdir(), 'magic-abu-reference-'));
process.env.MAGIC_ACCURACY_CACHE = path.join(directory, 'raw');
const { hash, objectFile } = await import('../games/magic/tools/accuracy/common.mjs');
const { normalizedReference } = await import(
  '../games/magic/tools/accuracy/abu-reference-cache.mjs'
);
const { normalize } = await import('../games/magic/tools/accuracy/pixels-pure.mjs');
try {
  const image = new PNG({ width: 488, height: 680 });
  for (let i = 0; i < image.data.length; i += 4) {
    image.data[i] = (i / 4) % 251;
    image.data[i + 1] = (i / 16) % 239;
    image.data[i + 2] = (i / 32) % 233;
    image.data[i + 3] = 255;
  }
  const bytes = PNG.sync.write(image),
    reference = { sha256: hash(bytes) },
    entry = { reference, face: { name: 'Original wording' } },
    pose = { referenceHash: reference.sha256, transform: { tx: 1.5, ty: -0.5 } },
    cache = path.join(directory, 'derived');
  await mkdir(path.dirname(objectFile(reference)), { recursive: true });
  await writeFile(objectFile(reference), bytes);
  await assert.rejects(normalizedReference(entry, { ...pose, referenceHash: 'wrong' }, cache));
  const first = await normalizedReference(entry, pose, cache),
    expected = normalize(normalize(image), pose.transform);
  assert.deepEqual(Buffer.from(first.image.data), Buffer.from(expected.data));
  await rm(objectFile(reference));
  const reused = await normalizedReference(
    { ...entry, face: { name: 'Reviewed wording', rules: 'Changed' } },
    pose,
    cache,
  );
  assert.equal(reused.key, first.key, 'Wording changes must reuse scan-only normalization');
  assert.deepEqual(reused.bytes, first.bytes);
  await assert.rejects(normalizedReference(entry, { ...pose, transform: { tx: 2 } }, cache), {
    code: 'ENOENT',
  });
  await writeFile(path.join(cache, first.key + '.png'), 'corrupt');
  await assert.rejects(normalizedReference(entry, pose, cache), /Corrupt normalized reference/);
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log(
  'ABU reference cache: raster parity, wording reuse, pose invalidation and integrity pass.',
);
