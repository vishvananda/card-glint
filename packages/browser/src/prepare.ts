import type { TextureStore, Texture } from './gpu/textures.js';
import { MaskComposer } from './gpu/masks.js';
import {
  closeRaster,
  layerKey,
  layersOf,
  paintCoverage,
  paintLayers,
  paintRaster,
} from './raster.js';
import type { CardDocument, Lease, EdgeSource, RasterHost } from './types.js';
export interface Prepared {
  color: string;
  mask: string;
  overlay?: string;
  coverage?: string;
  hologram?: string;
  hologramSettings: string;
  document: CardDocument;
}

export class Preparer {
  readonly masks: MaskComposer;
  private pending = new Map<string, Promise<void>>();
  compositions = 0;
  constructor(
    readonly textures: TextureStore,
    readonly assets: RasterHost,
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
    const hologram = recipe.hologram
      ? prefix +
        JSON.stringify(['hologram-v1', recipe.hologram.mask.key, recipe.hologram.mask.size])
      : undefined;
    const hologramSettings = JSON.stringify(
      recipe.hologram
        ? [recipe.hologram.rect, recipe.hologram.strength, recipe.hologram.seed ?? 0]
        : null,
    );
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
      leases.push(await this.prepareMask(document, signal));
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
      if (hologram)
        leases.push(
          await this.ensure(hologram, async () => {
            const surface = await paintRaster(recipe.hologram!.mask, this.assets, signal);
            try {
              signal.throwIfAborted();
              return this.textures.upload(hologram, surface, false);
            } finally {
              closeRaster(surface);
            }
          }),
        );
      signal.throwIfAborted();
      return { color, mask, overlay, coverage, hologram, hologramSettings, document };
    } finally {
      for (const lease of leases) lease.release();
    }
  }
  async prepareMask(document: CardDocument, signal: AbortSignal): Promise<Lease<Texture>> {
    const { recipe } = document,
      size = recipe.color.size,
      contributors = layersOf(document).filter((layer) => layer.contributesToEtch),
      prefix = `${recipe.pack}:`,
      key =
        prefix +
        JSON.stringify(['mask-v1', size, recipe.edges, recipe.stamp?.key, layerKey(contributors)]);
    return this.ensure(key, async () => {
      const inputs: { value: Texture; spec: EdgeSource }[] = [],
        temporary: Lease<Texture>[] = [];
      try {
        for (const spec of recipe.edges) {
          const edgeKey =
            prefix +
            JSON.stringify([
              'edge-integer-v1',
              spec.key,
              spec.asset,
              spec.importedMask,
              spec.threshold,
            ]);
          const edge = await this.ensure(edgeKey, async () => {
            const request = spec.importedMask ?? spec.asset;
            const images = await this.assets.images([request], signal);
            try {
              signal.throwIfAborted();
              const image = images.value.get(request.url);
              if (!image) throw Error(`Edge asset unavailable: ${request.url}`);
              return spec.importedMask
                ? this.textures.upload(edgeKey, image, false, 0)
                : this.textures.edge(edgeKey, image, spec.threshold);
            } finally {
              images.release();
            }
          });
          temporary.push(edge);
          inputs.push({ value: edge.value, spec });
        }
        for (const layer of contributors) {
          const edgeKey = prefix + JSON.stringify(['contribution-v1', size, layerKey([layer])]);
          const edge = await this.ensure(edgeKey, async () => {
            const image = await paintLayers(size, [layer], this.assets, signal);
            try {
              signal.throwIfAborted();
              return this.textures.edge(edgeKey, image, 20);
            } finally {
              closeRaster(image);
            }
          });
          temporary.push(edge);
          inputs.push({
            value: edge.value,
            spec: {
              key: edgeKey,
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
            stampKey = prefix + JSON.stringify(['stamp-v1', raster.key]);
          stamp = await this.ensure(stampKey, async () => {
            const image = await paintRaster(raster, this.assets, signal);
            try {
              signal.throwIfAborted();
              return this.textures.upload(stampKey, image, false, 0);
            } finally {
              closeRaster(image);
            }
          });
          temporary.push(stamp);
        }
        signal.throwIfAborted();
        return this.masks.compose(key, size, inputs, stamp?.value);
      } finally {
        for (const lease of temporary) lease.release();
      }
    });
  }
  dispose() {
    this.masks.dispose();
  }
}
