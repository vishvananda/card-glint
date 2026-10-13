import {
  hasHistoricalBacking,
  historicalBackingBlob,
  historicalBackingKey,
} from './historical-symbol-backing.js';

interface SymbolSources {
  original: string;
  backing: string;
}
interface Entry {
  promise: Promise<SymbolSources>;
  controller: AbortController;
  sources?: SymbolSources;
  users: number;
  retired: boolean;
}

// Only the six exact pinned URLs qualify. Retain encoded SVG object URLs, not
// decoded bitmaps: the host still owns its bounded decoded-image cache.
const entries = new Map<string, Entry>();

function retire(entry: Entry) {
  if (!entry.retired || entry.users) return;
  if (!entry.sources) {
    entry.controller.abort();
    return;
  }
  URL.revokeObjectURL(entry.sources.original);
  URL.revokeObjectURL(entry.sources.backing);
  entry.sources = undefined;
}

/** Release encoded symbol sources on pack teardown. Active loaders retain
 * their URLs until decoding finishes; already decoded host images are untouched. */
export function clearHistoricalSymbolSources() {
  for (const entry of entries.values()) {
    entry.retired = true;
    retire(entry);
  }
  entries.clear();
}

async function acquire(url: string, signal: AbortSignal) {
  signal.throwIfAborted();
  let entry = entries.get(url);
  if (!entry) {
    const fresh: Entry = {
      users: 0,
      retired: false,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        // A consumer's abort must not poison another loader sharing this fetch.
        const response = await fetch(url, { mode: 'cors', signal: fresh.controller.signal });
        if (!response.ok) throw Error(`Historical symbol ${response.status}: ${url}`);
        const blob = await response.blob(),
          backing = await historicalBackingBlob(url, blob);
        if (!backing) throw Error('Missing historical symbol backing policy.');
        fresh.controller.signal.throwIfAborted();
        const original = URL.createObjectURL(blob);
        try {
          const sources = { original, backing: URL.createObjectURL(backing) };
          fresh.sources = sources;
          return sources;
        } catch (error) {
          URL.revokeObjectURL(original);
          throw error;
        }
      }),
    };
    fresh.promise = fresh.promise.catch((error: unknown) => {
      if (entries.get(url) === fresh) entries.delete(url);
      throw error;
    });
    entries.set(url, fresh);
    entry = fresh;
  }
  entry.users++;
  const held = entry;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    held.users--;
    if (!held.users && !held.sources) {
      held.retired = true;
      if (entries.get(url) === held) entries.delete(url);
    }
    retire(held);
  };
  let cancel: () => void = () => {};
  const aborted = new Promise<never>((_, reject) => {
    cancel = () => {
      release();
      reject(signal.reason);
    };
    signal.addEventListener('abort', cancel, { once: true });
  });
  try {
    const sources = await Promise.race([held.promise, aborted]);
    signal.throwIfAborted();
    return { sources, release };
  } catch (error) {
    release();
    throw error;
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}

/** Share the same source preparation between the direct painter and host loader.
 * Ordinary asset URLs pass through. Aliases preserve the painter's stable keys. */
export async function resolveCanvasSources(
  urls: readonly (string | null | undefined)[],
  signal: AbortSignal,
) {
  signal.throwIfAborted();
  const list = [...new Set(urls.filter((url): url is string => Boolean(url)))],
    held: { release(): void }[] = [],
    aliases = new Map<string, string>();
  const dispose = () => {
    for (const lease of held) lease.release();
    held.length = 0;
  };
  const results = await Promise.allSettled(
    list.map(async (url) => {
      if (!hasHistoricalBacking(url)) {
        aliases.set(url, url);
        return;
      }
      const lease = await acquire(url, signal);
      held.push(lease);
      aliases.set(url, lease.sources.original);
      aliases.set(historicalBackingKey(url), lease.sources.backing);
    }),
  );
  const failure = results.find((result) => result.status === 'rejected');
  if (failure?.status === 'rejected') {
    dispose();
    throw failure.reason;
  }
  if (signal.aborted) {
    dispose();
    signal.throwIfAborted();
  }
  return { urls: [...new Set(aliases.values())], aliases, dispose };
}

export function aliasCanvasImages(
  aliases: ReadonlyMap<string, string>,
  images: ReadonlyMap<string, ImageBitmap>,
) {
  const result = new Map<string, ImageBitmap>();
  for (const [key, source] of aliases) {
    const image = images.get(source);
    if (image) result.set(key, image);
  }
  return result;
}
