import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { MaterialBitmapCache } = await server.ssrLoadModule(
    '/games/magic/src/presentation/material-bitmap-cache.ts',
  );
  const signal = new AbortController().signal;
  const bitmap = () => ({
    width: 4,
    height: 4,
    closes: 0,
    close() {
      this.closes++;
    },
  });
  const cache = new MaterialBitmapCache(128),
    a = bitmap(),
    b = bitmap(),
    c = bitmap();
  (await cache.acquire('a', 64, async () => a, signal)).release();
  (await cache.acquire('b', 64, async () => b, signal)).release();
  const warm = await cache.acquire('a', 64, async () => assert.fail('Warm image rebuilt'), signal);
  assert.equal(warm.value, a);
  warm.release();
  (await cache.acquire('c', 64, async () => c, signal)).release();
  assert.equal(b.closes, 1, 'Evict the least recently used unleased bitmap');
  assert.equal(a.closes, 0);
  assert.equal(cache.stats.builds, 3);
  assert.equal(cache.stats.hits, 1);
  assert.equal(cache.stats.bytes, 128);
  cache.clear();
  cache.clear();
  assert.equal(a.closes, 1);
  assert.equal(b.closes, 1);
  assert.equal(c.closes, 1);
  assert.equal(cache.stats.bytes, 0);

  const pendingCache = new MaterialBitmapCache(64),
    controller = new AbortController(),
    shared = bitmap();
  let complete,
    callerSourceReleased = false,
    firstSettled = false;
  const build = new Promise((resolve) => (complete = resolve));
  const first = pendingCache
      .acquire('shared', 64, () => build, controller.signal)
      .finally(() => {
        firstSettled = true;
        callerSourceReleased = true;
      }),
    second = pendingCache.acquire('shared', 64, () => assert.fail('Duplicate build'), signal);
  const outcomes = Promise.allSettled([first, second]);
  controller.abort();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(firstSettled, false, 'Abort must retain the source lease until build settles');
  assert.equal(pendingCache.stats.builds, 1);
  assert.equal(pendingCache.stats.bytes, 64, 'Pending builds must reserve budget');
  pendingCache.clear();
  const waitingController = new AbortController();
  const waiting = pendingCache.acquire(
    'new',
    64,
    async () => assert.fail('No budget yet'),
    waitingController.signal,
  );
  waitingController.abort();
  await assert.rejects(waiting, /abort/i);
  assert.equal(callerSourceReleased, false);
  complete(shared);
  const result = await outcomes;
  assert.equal(result[0].status, 'rejected');
  assert.equal(result[1].status, 'fulfilled');
  assert.equal(callerSourceReleased, true);
  assert.equal(shared.closes, 0, 'Teardown must retain active results');
  result[1].value.release();
  result[1].value.release();
  assert.equal(shared.closes, 1);
  assert.equal(pendingCache.stats.bytes, 0);
  const replacement = bitmap(),
    replacementLease = await pendingCache.acquire('shared', 64, async () => replacement, signal);
  replacementLease.release();
  pendingCache.clear();
  assert.equal(replacement.closes, 1);

  // A face acquires all its materials together. A second face waits without
  // pinning a partial batch, then completes when the first face releases.
  const batches = new MaterialBitmapCache(128),
    firstBatch = await batches.acquireMany(
      [
        { key: 'frame-a', bytes: 64, build: async () => bitmap() },
        { key: 'symbol-a', bytes: 64, build: async () => bitmap() },
      ],
      signal,
    );
  let secondFinished = false;
  const secondBatch = batches
    .acquireMany(
      [
        { key: 'frame-b', bytes: 64, build: async () => bitmap() },
        { key: 'symbol-b', bytes: 64, build: async () => bitmap() },
      ],
      signal,
    )
    .then((leases) => {
      secondFinished = true;
      return leases;
    });
  await Promise.resolve();
  assert.equal(secondFinished, false);
  assert.equal(batches.stats.builds, 2, 'Blocked batch must not start partial work');
  firstBatch[0].release();
  await Promise.resolve();
  assert.equal(secondFinished, false, 'One released component cannot admit a full second face');
  firstBatch[1].release();
  for (const lease of await secondBatch) lease.release();
  assert.equal(batches.stats.builds, 4);
  assert.ok(batches.stats.peakBytes <= 128);
  batches.clear();

  // A sibling build failure cannot release the source lease of an unfinished
  // component in that same batch.
  let siblingComplete,
    failedBatchSettled = false;
  const sibling = bitmap(),
    siblingWork = new Promise((resolve) => (siblingComplete = resolve));
  const failedBatch = batches
    .acquireMany(
      [
        {
          key: 'bad',
          bytes: 64,
          build: async () => {
            throw Error('bad component');
          },
        },
        { key: 'slow', bytes: 64, build: () => siblingWork },
      ],
      signal,
    )
    .finally(() => {
      failedBatchSettled = true;
    });
  const failedBatchOutcome = Promise.allSettled([failedBatch]);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(failedBatchSettled, false);
  siblingComplete(sibling);
  assert.equal((await failedBatchOutcome)[0].status, 'rejected');
  batches.clear();
  assert.equal(sibling.closes, 1);

  // The renderer permits up to four preparation jobs. Even when only one full
  // face fits at a time, all jobs must progress under the fixed byte ceiling.
  const grid = new MaterialBitmapCache(128);
  await Promise.all(
    Array.from({ length: 4 }, async (_, i) => {
      const leases = await grid.acquireMany(
        [
          { key: `frame-${i}`, bytes: 64, build: async () => bitmap() },
          { key: `symbol-${i}`, bytes: 64, build: async () => bitmap() },
        ],
        signal,
      );
      for (const lease of leases) lease.release();
    }),
  );
  assert.equal(grid.stats.builds, 8);
  assert.ok(grid.stats.peakBytes <= 128);
  grid.clear();

  const failures = new MaterialBitmapCache(64);
  await assert.rejects(
    failures.acquire(
      'retry',
      64,
      async () => {
        throw Error('synthetic build failure');
      },
      signal,
    ),
    /synthetic build failure/,
  );
  assert.equal(failures.stats.bytes, 0);
  const recovered = bitmap();
  (await failures.acquire('retry', 64, async () => recovered, signal)).release();
  failures.clear();
  assert.equal(recovered.closes, 1);
  const invalid = { ...bitmap(), width: 3 };
  await assert.rejects(
    failures.acquire('size', 64, async () => invalid, signal),
    /dimensions/,
  );
  assert.equal(invalid.closes, 1, 'Reject and close incorrectly sized results exactly once');
  assert.equal(failures.stats.bytes, 0);
  const aborted = new AbortController();
  aborted.abort();
  await assert.rejects(
    failures.acquire('aborted', 64, async () => assert.fail('Canceled build ran'), aborted.signal),
  );
  assert.ok(failures.stats.peakBytes <= 64);
  console.log(
    'Material cache: warm reuse, LRU budget, shared cancellation/source lifetime, failure retry, pending accounting and single-close teardown pass.',
  );
} finally {
  await server.close();
}
