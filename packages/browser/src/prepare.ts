import type { AssetStore } from './assets.js';
import type { TextureStore, Texture } from './gpu/textures.js';
import { MaskComposer } from './gpu/masks.js';
import {
  canvas,
  closeRaster,
  layerKey,
  layersOf,
  paintCoverage,
  paintLayers,
  paintRaster,
} from './raster.js';
import type { CardDocument, Lease, EdgeSource } from './types.js';
export interface Prepared {
  color: string;
  mask: string;
  overlay?: string;
  coverage?: string;
  document: CardDocument;
}

export class Preparer {
  readonly masks: MaskComposer;
  private pending = new Map<string, Promise<void>>();
  compositions = 0;
  constructor(
    readonly textures: TextureStore,
    readonly assets: AssetStore,
  ) {
    this.masks = new MaskComposer(textures);
  }
  private async ensure(key: string, build: () => Promise<Lease<Texture>>): Promise<Lease<Texture>> {
    const hit = this.textures.store.acquire(key);
    if (hit) return hit;
    let pending = this.pending.get(key);
    if (!pending) {
      pending = build()
        .then((lease) => lease.release())
        .finally(() => this.pending.delete(key));
      this.pending.set(key, pending);
    }
    await pending;
    const result = this.textures.store.acquire(key);
    if (!result) throw Error('Prepared working set exceeds GPU budget');
    return result;
  }
  async prepare(document: CardDocument, signal: AbortSignal): Promise<Prepared> {
    const { recipe } = document,
      size = recipe.color.size,
      layers = layersOf(document),
      leases: Lease<Texture>[] = [];
    const under = layers.filter((l) => l.stage === 'under-art'),
      printed = layers.filter((l) => l.stage === 'printed-content' || l.stage === 'under-finish');
    const over = layers.filter((l) => l.stage === 'over-finish'),
      contributors = layers.filter((l) => l.contributesToEtch);
    const coverageLayers = layers.filter((l) => l.finishCoverage || l.etchCoverage);
    const prefix = `${recipe.pack}:`;
    const color =
      prefix + JSON.stringify(['color-v1', recipe.color.key, layerKey([...under, ...printed])]);
    const mask =
      prefix +
      JSON.stringify(['mask-v1', size, recipe.edges, recipe.stamp?.key, layerKey(contributors)]);
    const overlay = over.length
      ? prefix + JSON.stringify(['over-v1', size, layerKey(over)])
      : undefined;
    const coverage = coverageLayers.length
      ? prefix +
        JSON.stringify([
          'coverage-v1',
          size,
          coverageLayers.map((l) => [
            l.clip,
            l.finishCoverage?.add?.key,
            l.finishCoverage?.exclude?.key,
            l.etchCoverage?.add?.key,
            l.etchCoverage?.exclude?.key,
          ]),
        ])
      : undefined;
    try {
      leases.push(
        await this.ensure(color, async () => {
          const beneath = under.length
            ? await paintLayers(size, under, this.assets, signal)
            : undefined;
          let surface: HTMLCanvasElement | undefined;
          try {
            surface = await paintRaster(recipe.color, this.assets, signal, beneath);
            await paintLayers(size, printed, this.assets, signal, surface);
            signal.throwIfAborted();
            this.compositions++;
            return this.textures.upload(color, surface);
          } finally {
            if (beneath) closeRaster(beneath);
            if (surface) closeRaster(surface);
          }
        }),
      );
      leases.push(
        await this.ensure(mask, async () => {
          const inputs: { value: Texture; spec: EdgeSource }[] = [],
            temporary: Lease<Texture>[] = [];
          try {
            for (const spec of recipe.edges) {
              const key =
                prefix +
                JSON.stringify([
                  'edge-integer-v1',
                  spec.key,
                  spec.asset,
                  spec.importedMask,
                  spec.threshold,
                ]);
              const edge = await this.ensure(key, async () => {
                const image = await this.assets.image(spec.importedMask ?? spec.asset, signal);
                try {
                  signal.throwIfAborted();
                  return spec.importedMask
                    ? this.textures.upload(key, image.value, false, 0)
                    : this.textures.edge(key, image.value, spec.threshold);
                } finally {
                  image.release();
                }
              });
              temporary.push(edge);
              inputs.push({ value: edge.value, spec });
            }
            for (const layer of contributors) {
              const key = prefix + JSON.stringify(['contribution-v1', size, layerKey([layer])]);
              const edge = await this.ensure(key, async () => {
                const image = await paintLayers(size, [layer], this.assets, signal);
                try {
                  signal.throwIfAborted();
                  return this.textures.edge(key, image, 20);
                } finally {
                  closeRaster(image);
                }
              });
              temporary.push(edge);
              inputs.push({
                value: edge.value,
                spec: {
                  key,
                  asset: { url: '' },
                  crop: [0, 0, 1, 1],
                  destination: [0, 0, 1, 1],
                  clip: [0, 0, 1, 1],
                  threshold: 20,
                },
              });
            }
            let stamp: Lease<Texture> | undefined;
            if (recipe.stamp) {
              const raster = recipe.stamp,
                key = prefix + JSON.stringify(['stamp-v1', raster.key]);
              stamp = await this.ensure(key, async () => {
                const image = await paintRaster(raster, this.assets, signal);
                try {
                  signal.throwIfAborted();
                  return this.textures.upload(key, image, false, 0);
                } finally {
                  closeRaster(image);
                }
              });
              temporary.push(stamp);
            }
            signal.throwIfAborted();
            return this.masks.compose(mask, size, inputs, stamp?.value);
          } finally {
            for (const lease of temporary) lease.release();
          }
        }),
      );
      if (overlay)
        leases.push(
          await this.ensure(overlay, async () => {
            const surface = await paintLayers(size, over, this.assets, signal);
            try {
              signal.throwIfAborted();
              return this.textures.upload(overlay, surface);
            } finally {
              closeRaster(surface);
            }
          }),
        );
      if (coverage)
        leases.push(
          await this.ensure(coverage, async () => {
            const bytes = await paintCoverage(size, coverageLayers, this.assets, signal);
            signal.throwIfAborted();
            return this.textures.uploadBytes(coverage, bytes, size);
          }),
        );
      signal.throwIfAborted();
      return { color, mask, overlay, coverage, document };
    } finally {
      for (const lease of leases) lease.release();
    }
  }
  dispose() {
    this.masks.dispose();
  }
}
