export interface MaterialBitmapLease {
  readonly value: ImageBitmap;
  release(): void;
}
export interface MaterialBitmapRequest {
  key: string;
  bytes: number;
  build(): Promise<ImageBitmap>;
}
interface Entry {
  promise: Promise<ImageBitmap>;
  bitmap?: ImageBitmap;
  bytes: number;
  accounted: boolean;
  users: number;
  retired: boolean;
}

/** Pack-owned derived images. Borrowed source images never enter this cache.
 * Pending builds reserve their bytes; only unleased results may be evicted. */
export class MaterialBitmapCache {
  private entries = new Map<string, Entry>();
  private bytes = 0;
  private peakBytes = 0;
  private builds = 0;
  private hits = 0;
  private evictions = 0;
  private waiting = new Set<() => void>();
  constructor(private readonly limit: number) {
    if (!Number.isSafeInteger(limit) || limit < 1) throw RangeError('Invalid material budget');
  }

  get stats() {
    return {
      bytes: this.bytes,
      peakBytes: this.peakBytes,
      entries: this.entries.size,
      builds: this.builds,
      hits: this.hits,
      evictions: this.evictions,
    };
  }

  private destroy(entry: Entry) {
    entry.bitmap?.close();
    entry.bitmap = undefined;
    if (entry.accounted) {
      this.bytes -= entry.bytes;
      entry.accounted = false;
    }
  }

  private admit(requests: readonly MaterialBitmapRequest[]): Entry[] | undefined {
    const requested = new Set(requests.map((r) => r.key));
    const bytes = requests.reduce((sum, request) => {
      const entry = this.entries.get(request.key);
      if (entry && entry.bytes !== request.bytes)
        throw Error('Material cache key has inconsistent dimensions');
      return sum + (entry ? 0 : request.bytes);
    }, 0);
    for (const [key, entry] of this.entries) {
      if (this.bytes + bytes <= this.limit) break;
      if (entry.users || requested.has(key)) continue;
      this.entries.delete(key);
      entry.retired = true;
      this.destroy(entry);
      this.evictions++;
    }
    if (this.bytes + bytes > this.limit) return undefined;
    this.bytes += bytes;
    this.peakBytes = Math.max(this.peakBytes, this.bytes);
    return requests.map((request) => {
      let entry = this.entries.get(request.key);
      if (entry) {
        this.hits++;
        this.entries.delete(request.key);
        this.entries.set(request.key, entry);
      } else {
        const fresh: Entry = {
          users: 0,
          bytes: request.bytes,
          accounted: true,
          retired: false,
          promise: Promise.resolve().then(async () => {
            this.builds++;
            const bitmap = await request.build();
            if (bitmap.width * bitmap.height * 4 !== request.bytes) {
              bitmap.close();
              throw Error('Derived bitmap dimensions differ from its cache reservation');
            }
            fresh.bitmap = bitmap;
            return bitmap;
          }),
        };
        fresh.promise = fresh.promise.catch((error: unknown) => {
          if (this.entries.get(request.key) === fresh) this.entries.delete(request.key);
          fresh.retired = true;
          this.destroy(fresh);
          this.notify();
          throw error;
        });
        this.entries.set(request.key, fresh);
        entry = fresh;
      }
      entry.users++;
      return entry;
    });
  }

  private notify() {
    for (const resume of [...this.waiting]) resume();
  }

  private wait(signal: AbortSignal) {
    signal.throwIfAborted();
    return new Promise<void>((resolve, reject) => {
      const done = () => {
        this.waiting.delete(resume);
        signal.removeEventListener('abort', cancel);
      };
      const resume = () => {
        done();
        resolve();
      };
      const cancel = () => {
        done();
        reject(signal.reason);
      };
      this.waiting.add(resume);
      signal.addEventListener('abort', cancel, { once: true });
    });
  }

  async acquire(
    key: string,
    bytes: number,
    build: () => Promise<ImageBitmap>,
    signal: AbortSignal,
  ): Promise<MaterialBitmapLease> {
    return (await this.acquireMany([{ key, bytes, build }], signal))[0]!;
  }

  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(
    requests: readonly MaterialBitmapRequest[],
    signal: AbortSignal,
  ): Promise<MaterialBitmapLease[]> {
    signal.throwIfAborted();
    if (new Set(requests.map((r) => r.key)).size !== requests.length)
      throw Error('Duplicate key in material batch');
    if (
      requests.some((r) => !Number.isSafeInteger(r.bytes) || r.bytes < 1) ||
      requests.reduce((sum, r) => sum + r.bytes, 0) > this.limit
    )
      throw RangeError('Material batch exceeds derived-image budget');
    let entries: Entry[] | undefined;
    while (!(entries = this.admit(requests))) {
      // No build has borrowed this caller's sources yet, so admission waiting
      // can abort without releasing a source underneath another consumer.
      await this.wait(signal);
      signal.throwIfAborted();
    }
    const releases = entries.map((entry) => {
      let released = false;
      return () => {
        if (released) return;
        released = true;
        entry.users--;
        if (entry.retired && !entry.users) this.destroy(entry);
        this.notify();
      };
    });
    try {
      // Do not race cancellation: build may borrow this caller's loaded source.
      // Keep all source leases until every build settles, including sibling failures.
      const results = await Promise.allSettled(entries.map((entry) => entry.promise));
      const failure = results.find((result) => result.status === 'rejected');
      if (failure?.status === 'rejected') throw failure.reason;
      signal.throwIfAborted();
      return entries.map((entry, i) => ({ value: entry.bitmap!, release: releases[i]! }));
    } catch (error) {
      for (const release of releases) release();
      throw error;
    }
  }

  /** Retire active results; their final lease closes them. New work may start
   * after teardown, but retired pending/leased bytes still count toward budget. */
  clear() {
    for (const entry of this.entries.values()) {
      entry.retired = true;
      if (!entry.users) this.destroy(entry);
    }
    this.entries.clear();
    this.notify();
  }
}

// Separate, explicit ceiling for derived materials, in addition to the host's
// decoded-source budget. Shared across direct and public static composition.
export const earlyHsbBitmapCache = new MaterialBitmapCache(16 * 1024 * 1024);
// A composite borrows HSB leases while building. A separate budget prevents
// concurrent preparations from holding all HSB capacity while waiting on it.
export const retroDualBitmapCache = new MaterialBitmapCache(8 * 1024 * 1024);
export const planeswalkerBitmapCache = new MaterialBitmapCache(64 * 1024 * 1024);
export const clearEarlyHsbBitmaps = () => {
  planeswalkerBitmapCache.clear();
  earlyHsbBitmapCache.clear();
  retroDualBitmapCache.clear();
};
