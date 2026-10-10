import { TextureStore, type Texture } from '../../packages/browser/src/gpu/textures.js';
import { texture } from '../../packages/browser/src/gpu/etcher.js';
import { PixelKernels } from '../../packages/browser/generated/renderer.js';
import type { Lease } from '@card-glint/browser';
const median = (values: number[]) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]!;
const delay = () => new Promise((resolve) => setTimeout(resolve, 0));
function stats(store: TextureStore) {
  return {
    edges: store.edgeBuilds,
    uploads: store.uploads,
    readbacks: store.readbacks,
    ...store.store.stats,
  };
}
function delta(a: ReturnType<typeof stats>, b: ReturnType<typeof stats>) {
  return {
    edgeBuilds: b.edges - a.edges,
    uploads: b.uploads - a.uploads,
    evictions: b.evictions - a.evictions,
    hits: b.hits - a.hits,
    misses: b.misses - a.misses,
    bytes: b.bytes,
  };
}
function upload(
  store: TextureStore,
  key: string,
  bytes: Uint8Array,
  w: number,
  h: number,
): Lease<Texture> {
  const gl = store.gl,
    value = texture(gl, w, h)!;
  gl.bindTexture(gl.TEXTURE_2D, value);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED, gl.UNSIGNED_BYTE, bytes);
  return store.store.insert(key, { texture: value, width: w, height: h }, w * h);
}
function session(bytes: number, mode: 'gpu' | 'rust') {
  const canvas = document.createElement('canvas'),
    gl = canvas.getContext('webgl2', { antialias: false, depth: false })!;
  if (!gl) throw Error('WebGL2 unavailable');
  const start = performance.now(),
    store = new TextureStore(gl, bytes, 16 * 1024 * 1024, mode);
  return {
    store,
    setupMs: performance.now() - start,
    dispose() {
      store.dispose();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
async function persistentRoundTrip(raw: Uint8Array) {
  if (!globalThis.caches || typeof CompressionStream === 'undefined')
    return { available: false, reason: 'CacheStorage or CompressionStream unavailable' };
  const name = 'card-glint-benchmark-' + crypto.randomUUID(),
    key = new URL('./cache-probe', location.href).href;
  try {
    const cache = await caches.open(name);
    let start = performance.now();
    const compressed = await new Response(
      new Blob([raw as Uint8Array<ArrayBuffer>])
        .stream()
        .pipeThrough(new CompressionStream('gzip')),
    ).blob();
    const gzipMs = performance.now() - start;
    start = performance.now();
    await cache.put(key, new Response(compressed));
    const writeMs = performance.now() - start;
    const reads: number[] = [];
    let restored: Uint8Array | undefined;
    for (let i = 0; i < 6; i++) {
      start = performance.now();
      const response = await cache.match(key);
      if (!response?.body) throw Error('Stored derivative missing');
      restored = new Uint8Array(
        await new Response(
          response.body.pipeThrough(new DecompressionStream('gzip')),
        ).arrayBuffer(),
      );
      if (i) reads.push(performance.now() - start);
      if (restored.length !== raw.length || restored.some((v, i) => v !== raw[i]))
        throw Error('Persistent R8 roundtrip changed pixels');
    }
    return {
      available: true,
      rawBytes: raw.byteLength,
      compressedBytes: compressed.size,
      gzipMs,
      writeMs,
      readDecodeMedianMs: median(reads),
      restored,
    };
  } catch (error) {
    return { available: false, reason: String(error) };
  } finally {
    await caches.delete(name);
  }
}

/** A separate resource experiment, not an assertion about full scene FPS. */
export async function benchmarkCaches(url: string) {
  // SVG blobs are not accepted by createImageBitmap in every browser.
  // Decode through an image element before starting any timed work.
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  await image.decode();
  const bitmap = await createImageBitmap(image);
  image.src = '';
  const source = document.createElement('canvas');
  source.width = 512;
  source.height = Math.round((bitmap.height * 512) / bitmap.width);
  const ctx = source.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, source.width, source.height);
  bitmap.close();
  const w = source.width,
    h = source.height,
    bytes = w * h,
    paths: Record<string, unknown> = {};
  let gpuSnapshot: Uint8Array | undefined,
    snapshotMs = 0;
  const rgba = ctx.getImageData(0, 0, w, h).data,
    kernels = new PixelKernels();
  const expected = kernels.etch(w, h, new Uint8Array(rgba.buffer), 20);
  kernels.free();
  try {
    for (const mode of ['rust', 'gpu'] as const) {
      const run = session(bytes * 8, mode),
        store = run.store;
      try {
        const missTimes: number[] = [];
        for (let i = 0; i < 7; i++) {
          store.store.clear();
          const start = performance.now(),
            lease = store.edge('base', source, 20);
          const actual = store.read(lease.value);
          if (i >= 2) missTimes.push(performance.now() - start);
          for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++)
              if (actual[(h - 1 - y) * w + x] !== expected[y * w + x])
                throw Error(mode + ' cached texture differs from Rust reference');
          lease.release();
          await delay();
        }
        const before = stats(store),
          start = performance.now();
        for (let i = 0; i < 10000; i++) store.edge('base', source, 20).release();
        const hitsMs = performance.now() - start,
          after = stats(store);
        if (after.edges !== before.edges || after.uploads !== before.uploads)
          throw Error('Cache hit rebuilt a texture');
        if (mode === 'gpu') {
          const lease = store.store.acquire('base')!,
            start = performance.now();
          gpuSnapshot = store.read(lease.value);
          snapshotMs = performance.now() - start;
          lease.release();
        }
        store.store.clear();
        for (let i = 0; i < 8; i++) {
          const lease = store.edge('recipe-' + i, source, 20 + i);
          store.read(lease.value);
          lease.release();
        }
        const fittedBefore = stats(store),
          fitStart = performance.now();
        for (let i = 0; i < 800; i++)
          store.edge('recipe-' + (i % 8), source, 20 + (i % 8)).release();
        const fitted = {
          requests: 800,
          lookupAndLeaseMs: performance.now() - fitStart,
          ...delta(fittedBefore, stats(store)),
        };
        const churn = session(bytes * 4, mode);
        let pressure;
        try {
          const start = performance.now();
          for (let round = 0; round < 3; round++)
            for (let i = 0; i < 8; i++) {
              const lease = churn.store.edge('recipe-' + i, source, 20 + i);
              churn.store.read(lease.value);
              lease.release();
              await delay();
            }
          pressure = {
            requests: 24,
            budgetBytes: bytes * 4,
            elapsedMs: performance.now() - start,
            ...stats(churn.store),
          };
        } finally {
          churn.dispose();
        }
        paths[mode] = {
          contextAndProgramSetupMs: run.setupMs,
          coldMaskCompletedMedianMs: median(missTimes),
          samples: 5,
          hot: {
            requests: 10000,
            lookupAndLeaseMs: hitsMs,
            microsecondsPerHit: hitsMs / 10,
            ...delta(before, after),
          },
          fitted,
          pressure,
          residentMaskBytes: bytes,
          scratchBytes: store.scratchBytes,
        };
      } finally {
        run.dispose();
      }
    }
    const persistence = await persistentRoundTrip(gpuSnapshot!);
    const restore = session(bytes * 2, 'gpu'),
      restoreTimes: number[] = [],
      rebuildTimes: number[] = [];
    try {
      for (let i = 0; i < 7; i++) {
        restore.store.store.clear();
        let start = performance.now();
        const lease = upload(restore.store, 'restored', gpuSnapshot!, w, h);
        const actual = restore.store.read(lease.value);
        if (i >= 2) restoreTimes.push(performance.now() - start);
        lease.release();
        if (actual.some((v, i) => v !== gpuSnapshot![i])) throw Error('GPU restoration differs');
        start = performance.now();
        const built = restore.store.edge('rebuilt-' + i, source, 20);
        restore.store.read(built.value);
        if (i >= 2) rebuildTimes.push(performance.now() - start);
        built.release();
        await delay();
      }
    } finally {
      restore.dispose();
    }
    const uploadMs = median(restoreTimes),
      rebuildMs = median(rebuildTimes);
    let persistent: unknown = persistence;
    if (persistence.available && 'restored' in persistence) {
      const { restored: _, ...metrics } = persistence;
      const restoreCost = (metrics.readDecodeMedianMs ?? 0) + uploadMs,
        saving = rebuildMs - restoreCost;
      persistent = {
        ...metrics,
        snapshotReadbackMs: snapshotMs,
        uploadCompletedMedianMs: uploadMs,
        rebuildFromDecodedArtCompletedMedianMs: rebuildMs,
        breakEvenRestores:
          saving > 0
            ? Math.ceil((snapshotMs + (metrics.gzipMs ?? 0) + (metrics.writeMs ?? 0)) / saving)
            : null,
        note: 'Null means cached restore was slower than rebuilding here. Hot CacheStorage reads, not OS-cold disk or fresh network; optional persistence is not enabled in the renderer.',
      };
    }
    return {
      schemaVersion: 1,
      browser: navigator.userAgent,
      size: [w, h],
      paths,
      persistence: persistent,
      byteExact: true,
      methodology:
        'Both backends use the same Rust LRU and R8 texture budget. Miss/pressure/restore timings include full mask readback to force completion; hit batches contain no GL work. Eight recipe keys vary threshold on the same decoded source. Network, fonts, face composition and full-scene draw time are excluded. Shader/context setup is separate. Pressure includes yielding between requests. These are mask-resource measurements, not VRAM telemetry or large-scene FPS.',
    };
  } finally {
    source.width = source.height = 0;
  }
}
