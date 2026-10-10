import { ResourceStore } from './cache.js';
import type { AssetRequest, Lease, RasterHost } from './types.js';

async function decode(request: AssetRequest, signal: AbortSignal): Promise<ImageBitmap> {
  const response = await fetch(request.url, { mode: 'cors', signal });
  if (!response.ok) throw Error(`Asset ${response.status}: ${request.url}`);
  const blob = await response.blob();
  if (!blob.type.includes('svg'))
    return createImageBitmap(
      blob,
      request.width ? { resizeWidth: request.width, resizeQuality: 'high' } : {},
    );
  const doc = new DOMParser().parseFromString(await blob.text(), 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.localName !== 'svg' || doc.querySelector('parsererror')) throw Error('Invalid SVG');
  const box = (svg.getAttribute('viewBox') ?? '')
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const w = box[2] ?? Number.parseFloat(svg.getAttribute('width') ?? '');
  const h = box[3] ?? Number.parseFloat(svg.getAttribute('height') ?? '');
  if (!(w > 0 && h > 0 && Number.isFinite(w + h))) throw Error('SVG needs finite dimensions');
  const scale = (request.width ?? 512) / Math.max(w, h);
  if (!svg.hasAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', String(Math.max(1, Math.round(w * scale))));
  svg.setAttribute('height', String(Math.max(1, Math.round(h * scale))));
  const url = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }),
  );
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    return await createImageBitmap(image);
  } finally {
    image.src = '';
    URL.revokeObjectURL(url);
  }
}

/** Session-owned decoded images; canceled consumers never close another lease. */
export class AssetStore implements RasterHost {
  readonly store: ResourceStore<ImageBitmap>;
  private pending = new Map<string, Promise<void>>();
  private active = 0;
  private waiting: (() => void)[] = [];
  private disposed = false;
  private generation = 0;
  private controllers = new Set<AbortController>();
  decodes = 0;
  constructor(bytes: number) {
    this.store = new ResourceStore(bytes, (image) => image.close());
  }
  private async reserve() {
    if (this.active >= 4) await new Promise<void>((resolve) => this.waiting.push(resolve));
    else this.active++;
    return () => {
      const next = this.waiting.shift();
      if (next) next();
      else this.active--;
    };
  }
  async image(request: AssetRequest, signal: AbortSignal): Promise<Lease<ImageBitmap>> {
    signal.throwIfAborted();
    if (this.disposed) throw Error('Asset store disposed');
    const key = JSON.stringify([request.url, request.width, request.revision]);
    let lease = this.store.acquire(key);
    if (lease) return lease;
    let pending = this.pending.get(key);
    if (!pending) {
      const generation = this.generation,
        controller = new AbortController();
      this.controllers.add(controller);
      pending = (async () => {
        const release = await this.reserve();
        try {
          if (this.disposed || generation !== this.generation) throw Error('Asset scope changed');
          const bitmap = await decode(request, controller.signal);
          this.decodes++;
          if (this.disposed || generation !== this.generation) {
            bitmap.close();
            throw Error('Asset scope changed');
          }
          const installed = this.store.insert(key, bitmap, bitmap.width * bitmap.height * 4);
          installed.release();
        } finally {
          release();
          this.controllers.delete(controller);
          if (generation === this.generation) this.pending.delete(key);
        }
      })();
      this.pending.set(key, pending);
    }
    await pending;
    signal.throwIfAborted();
    lease = this.store.acquire(key);
    if (!lease) throw Error('Decoded working set exceeds CPU budget');
    return lease;
  }
  async images(requests: readonly AssetRequest[], signal: AbortSignal) {
    const leases: Lease<ImageBitmap>[] = [],
      images = new Map<string, ImageBitmap>();
    const results = await Promise.allSettled(
      requests.map(async (request) => {
        const lease = await this.image(request, signal);
        leases.push(lease);
        images.set(request.url, lease.value);
      }),
    );
    const dispose = () => {
      for (const lease of leases) lease.release();
      images.clear();
    };
    const failure = results.find((result) => result.status === 'rejected');
    if (failure?.status === 'rejected') {
      dispose();
      throw failure.reason;
    }
    return { value: images, release: dispose };
  }
  clear() {
    this.generation++;
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
    this.pending.clear();
    this.store.clear();
  }
  dispose() {
    this.disposed = true;
    this.clear();
    this.store.dispose();
  }
}
