import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { normalize, cropGray } from '../games/magic/tools/accuracy/pixels.mjs';
import { normalizedGrayRegion } from '../games/magic/tools/accuracy/normalized-gray-region.mjs';
import { cachedGrayRegion } from '../games/magic/tools/accuracy/region-cache.mjs';

for (const [width, height] of [
  [488, 680],
  [745, 1040],
  [976, 1360],
  [81, 113],
]) {
  const image = {
    width,
    height,
    data: Uint8Array.from(
      { length: width * height * 4 },
      (_, i) => (i * 37 + Math.floor(i / 113)) % 256,
    ),
  };
  for (const transform of [
    {},
    { tx: -2, ty: 1.5, scale: 1.012, rotation: 0.004 },
    { matrix: [1.002, 0.003, -0.001, 1.002, -2, 1.5] },
  ]) {
    const full = normalize(image, transform);
    for (const rect of [
      [387, 387, 66, 30],
      [0, 0, 10, 10],
      [476, 668, 12, 12],
    ])
      assert.deepEqual(
        normalizedGrayRegion(image, rect, transform),
        cropGray(full, rect),
        'Region sampling changed canonical pixels',
      );
  }
}
assert.throws(() => normalizedGrayRegion({}, [-1, 0, 2, 2]), /region/);
assert.throws(() => normalizedGrayRegion({}, [0, 0, 2, 2], { scale: 0 }), /transform/);
const directory = await mkdtemp(path.join(os.tmpdir(), 'magic-region-cache-'));
try {
  const image = new PNG({ width: 488, height: 680 });
  image.data.fill(200);
  const source = PNG.sync.write(image),
    file = path.join(directory, 'source.png'),
    cache = path.join(directory, 'cache'),
    rect = [387, 387, 66, 30];
  await writeFile(file, source);
  const cold = await cachedGrayRegion(file, hash(source), rect, {}, cache),
    warm = await cachedGrayRegion(file, hash(source), rect, {}, cache);
  assert.equal(cold.cacheHit, false);
  assert.equal(warm.cacheHit, true);
  assert.deepEqual(cold.gray, warm.gray);
  assert.equal(
    (await cachedGrayRegion(file, hash(source), [388, 387, 66, 30], {}, cache)).cacheHit,
    false,
  );
  const cacheFile = path.join(cache, (await readdir(cache))[0]),
    entry = JSON.parse(await readFile(cacheFile));
  entry.bytes = Buffer.alloc(rect[2] * rect[3] * 4).toString('base64');
  await writeFile(cacheFile, JSON.stringify(entry));
  await assert.rejects(
    cachedGrayRegion(file, hash(source), entry.identity.rect, {}, cache),
    /Corrupt/,
  );
  await writeFile(file, Buffer.from('changed source'));
  await assert.rejects(cachedGrayRegion(file, hash(source), rect, {}, cache), /no longer matches/);
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log(
  'Canonical region sampling is pixel-identical; cache reuse, invalidation and corruption checks passed.',
);
