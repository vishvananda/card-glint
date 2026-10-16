import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const directory = await mkdtemp(path.join(os.tmpdir(), 'card-glint-cache-'));
process.env.MAGIC_ACCURACY_CACHE = directory;
const { cachedFetch, readObject } = await import('../games/magic/tools/accuracy/cache.mjs');
const { objectFile, hash, readJson } = await import('../games/magic/tools/accuracy/common.mjs');
const originalFetch = globalThis.fetch;
const url = 'https://cards.scryfall.io/test-original-fixture.png';
let requests = 0;
try {
  globalThis.fetch = async () => {
    requests++;
    return new Response('original synthetic bytes', { headers: { 'Content-Type': 'image/png' } });
  };
  const [a, b] = await Promise.all([cachedFetch(url), cachedFetch(url)]);
  assert.deepEqual(a, b);
  assert.equal(requests, 1, 'Concurrent downloads deduplicate');
  assert.equal((await readObject(a)).toString(), 'original synthetic bytes');
  await cachedFetch(url, { offline: true });
  assert.equal(requests, 1, 'Offline replay must not fetch');
  await assert.rejects(cachedFetch(url + '?missing', { offline: true }), /Offline cache miss/);
  assert.throws(() => cachedFetch('https://untrusted.example/image.png'), /host/);
  const manifest = (await import('../games/magic/assets.json', { with: { type: 'json' } })).default;
  await cachedFetch(manifest.MSE_SPLIT_BRIDGE_ROOT + '/bridgemask.png');
  assert.throws(() => cachedFetch(manifest.MSE_SPLIT_BRIDGE_ROOT + '/../other.png'), /host/);
  await cachedFetch(manifest.MSE_TEMPLATE_ROOT + '/magic-future.mse-style/wcard.jpg');
  assert.throws(
    () => cachedFetch(manifest.MSE_TEMPLATE_ROOT + '/magic-future.mse-style/../other.png'),
    /host/,
  );
  const symbol = await cachedFetch('https://svgs.scryfall.io/sets/brb.svg?version=1');
  assert.equal((await readObject(symbol)).toString(), 'original synthetic bytes');
  assert.throws(() => cachedFetch('https://svgs.scryfall.io/unexpected.svg'), /host/);
  assert.throws(() => cachedFetch('https://svgs.scryfall.io/sets/../unexpected.svg'), /host/);
  globalThis.fetch = async () =>
    new Response('<html>Error</html>', { headers: { 'Content-Type': 'text/html' } });
  await assert.rejects(cachedFetch(url, { refresh: true }), /Invalid asset response/);
  assert.deepEqual(
    await readJson(path.join(directory, 'urls', hash(url) + '.json')),
    a,
    'Failed refresh must preserve the previous URL pointer',
  );
  await writeFile(objectFile(a), 'corrupt');
  await assert.rejects(readObject(a), /Corrupt cache object/);
  // A fresh module key reads the pointer and validates the bytes before reuse.
  const cache = await import('../games/magic/tools/accuracy/cache.mjs?corruption-test');
  await assert.rejects(cache.cachedFetch(url, { offline: true }), /Corrupt cache object/);
  console.log(
    'Offline cache, concurrent deduplication, checksums and failed refresh preservation passed.',
  );
} finally {
  globalThis.fetch = originalFetch;
  delete process.env.MAGIC_ACCURACY_CACHE;
  await rm(directory, { recursive: true, force: true });
}
