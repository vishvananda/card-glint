import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { PNG } from 'pngjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { cachedReferenceSymbolBounds } from '../games/magic/tools/accuracy/symbol-reference-cache.mjs';

const directory = await mkdtemp(`${tmpdir()}/magic-symbol-reference-`),
  file = `${directory}/reference.png`,
  cache = `${directory}/cache`,
  profile = {
    region: [90, 90, 60, 60],
    thresholds: [20, 40, 60],
    limits: { width: [10, 35], height: [10, 35] },
  };
try {
  const png = new PNG({ width: 488, height: 680 });
  png.data.fill(255);
  for (let y = 100; y < 123; y++)
    for (let x = 100; x < 124; x++) png.data.fill(0, (y * 488 + x) * 4, (y * 488 + x) * 4 + 3);
  const bytes = PNG.sync.write(png),
    referenceHash = hash(bytes);
  await writeFile(file, bytes);
  await assert.rejects(cachedReferenceSymbolBounds(file, 'incorrect', profile, cache));
  const first = await cachedReferenceSymbolBounds(file, referenceHash, profile, cache);
  assert.equal(first.stable, true);
  assert.deepEqual(first.rect, [100, 100, 24, 23]);
  await rm(file);
  assert.deepEqual(
    await cachedReferenceSymbolBounds(file, referenceHash, profile, cache),
    first,
    'A warm measurement must not reopen or decode the reference PNG.',
  );
  await assert.rejects(
    cachedReferenceSymbolBounds(
      file,
      referenceHash,
      { ...profile, thresholds: [30, 50, 70] },
      cache,
    ),
    { code: 'ENOENT' },
  );
  await assert.rejects(cachedReferenceSymbolBounds(file, 'different-source', profile, cache), {
    code: 'ENOENT',
  });
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log(
  'Reference symbol cache: byte integrity, warm reuse and profile/source invalidation pass.',
);
