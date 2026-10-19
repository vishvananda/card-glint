import { loadCanvasImages } from '../../src/presentation/canvas-assets.ts';
const limit = 128 * 1024 * 1024,
  retained = new Map();
let bytes = 0,
  hits = 0,
  builds = 0;
/** A study retains common decoded plates and glyphs, while each card owns its
 * illustration. Admission is bounded; oversized/new overflow assets stay local.
 * This changes asset ownership only, never decode size or material preparation. */
export async function loadAccuracyImages(urls, signal, illustration) {
  const result = new Map(),
    temporary = [],
    wanted = [...new Set(urls.filter(Boolean))];
  let index = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, wanted.length) }, async () => {
        while (index < wanted.length) {
          const url = wanted[index++];
          let pending = retained.get(url);
          if (pending) hits++;
          else {
            builds++;
            pending = loadCanvasImages([url], signal)
              .then((lease) => {
                const size = [...new Set(lease.images.values())].reduce(
                  (n, v) => n + v.width * v.height * 4,
                  0,
                );
                const keep = url !== illustration && lease.images.has(url) && bytes + size <= limit;
                if (keep) bytes += size;
                else if (retained.get(url) === pending) retained.delete(url);
                return { lease, retained: keep };
              })
              .catch((error) => {
                if (retained.get(url) === pending) retained.delete(url);
                throw error;
              });
            if (url !== illustration) retained.set(url, pending);
          }
          const entry = await pending;
          if (!entry.retained) temporary.push(entry.lease);
          for (const [alias, image] of entry.lease.images) result.set(alias, image);
        }
      }),
    );
    return {
      images: result,
      dispose() {
        for (const lease of temporary) lease.dispose();
        result.clear();
      },
    };
  } catch (error) {
    for (const lease of temporary) lease.dispose();
    throw error;
  }
}
export const accuracyAssetStats = () => ({ bytes, limit, hits, builds, entries: retained.size });
export async function clearAccuracyImages() {
  for (const value of retained.values()) (await value).lease.dispose();
  retained.clear();
  bytes = 0;
}
