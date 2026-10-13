import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PNG } from 'pngjs';
import { cachedScanFrame } from '../games/magic/tools/accuracy/scan-frame-cache.mjs';
import { hash, readJson } from '../games/magic/tools/accuracy/common.mjs';
const directory = await mkdtemp(path.join(os.tmpdir(), 'magic-frame-fit-'));
try {
  const file = path.join(directory, 'source.png'),
    png = new PNG({ width: 488, height: 680 });
  for (let y = 0; y < 680; y++)
    for (let x = 0; x < 488; x++) {
      const p = (y * 488 + x) * 4,
        v = x >= 26 && x < 464 && y >= 28 && y < 652 ? 180 : 10;
      png.data[p] = png.data[p + 1] = png.data[p + 2] = v;
      png.data[p + 3] = 255;
    }
  const bytes = PNG.sync.write(png),
    sha = hash(bytes),
    target = {
      reliable: true,
      sides: Object.fromEntries(
        Object.entries({ left: 25.5, right: 463.5, top: 27.5, bottom: 651.5 }).map(
          ([side, position]) => [side, { reliable: true, position }],
        ),
      ),
    };
  await writeFile(file, bytes);
  const cold = await cachedScanFrame(file, sha, 'black', target, 'template-v1', directory),
    warm = await cachedScanFrame(file, sha, 'black', target, 'template-v1', directory);
  assert.ok(cold.accepted);
  assert.equal(cold.anchorCacheHit, false);
  assert.equal(cold.fitCacheHit, false);
  assert.equal(warm.anchorCacheHit, true);
  assert.equal(warm.fitCacheHit, true);
  assert.deepEqual(warm.transform, cold.transform);
  const changed = await cachedScanFrame(file, sha, 'black', target, 'template-v2', directory);
  assert.equal(changed.anchorCacheHit, true);
  assert.equal(changed.fitCacheHit, false);
  const destination = path.join(directory, 'fits', warm.fitKey + '.json'),
    value = await readJson(destination);
  value.result.transform.matrix[4] = 999;
  await writeFile(destination, JSON.stringify(value));
  await assert.rejects(
    cachedScanFrame(file, sha, 'black', target, 'template-v1', directory),
    /Corrupt/,
  );
  await writeFile(file, 'changed scan');
  await assert.rejects(
    cachedScanFrame(file, sha, 'black', target, 'template-v3', directory),
    /bytes changed/,
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log(
  'Stored scan normalization: warm reuse, template invalidation, source verification and corruption detection pass.',
);
