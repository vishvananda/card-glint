import {
  validateDocument,
  validateFrame,
  validateInstance,
  validateSceneLayer,
} from './validation.js';
import init, { SceneCore } from '../generated/renderer.js';
import { AssetStore } from './assets.js';
import { Device, type Material } from './gpu/device.js';
import { TextureStore, type Texture } from './gpu/textures.js';
import { Preparer, type Prepared } from './prepare.js';
import { paintRaster, closeRaster, layersOf } from './raster.js';
import { surfaceSeed, validateDeformation, exportScale } from './deformation.js';
import {
  IDENTITY,
  type Budgets,
  type CardDocument,
  type Frame,
  type Instance,
  type Lease,
  type Metrics,
  type RasterHost,
  type SceneLayer,
} from './types.js';
let initialized: Promise<unknown> | undefined;
export interface RendererOptions {
  canvas: HTMLCanvasElement;
  wasmUrl?: string | URL;
  rasterHost?: RasterHost;
  etching?: 'gpu' | 'rust';
  budgets?: Partial<Budgets>;
  invalidate?: () => void;
  onError?: (error: unknown) => void;
}
interface Job {
  document: CardDocument;
  controller: AbortController;
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: unknown) => void;
  started: boolean;
}

/** One context per session. Game documents supply rasters, never engine objects. */
export class Renderer {
  readonly abiVersion = 1;
  readonly assets: AssetStore;
  private device: Device;
  private textures: TextureStore;
  private preparer: Preparer;
  private scene = new SceneCore();
  private documents = new Map<number, CardDocument>();
  private prepared = new Map<number, Prepared>();
  private jobs = new Map<number, Job>();
  private instances: readonly Instance[] = [];
  private sceneLayers: readonly SceneLayer[] = [];
  private sceneLayerGeneration = 0;
  private sceneLayerPending = 0;
  private sceneLayerFailure = false;
  private failed = new WeakSet<CardDocument>();
  private active = 0;
  private epoch = 0;
  private disposed = false;
  private lost = false;
  private lastFrame: Frame | undefined;
  private frameMs = 0;
  private visible = 0;
  private shapeData = new Float32Array();
  readonly budgets: Budgets;
  constructor(private options: RendererOptions) {
    this.budgets = {
      gpuBytes: 64 * 1024 * 1024,
      cpuBytes: 32 * 1024 * 1024,
      scratchBytes: 16 * 1024 * 1024,
      preparationConcurrency: 2,
      ...options.budgets,
    };
    if (
      !Number.isInteger(this.budgets.preparationConcurrency) ||
      this.budgets.preparationConcurrency < 1 ||
      this.budgets.preparationConcurrency > 4
    )
      throw RangeError('Preparation concurrency must be 1–4');
    this.assets = new AssetStore(this.budgets.cpuBytes);
    this.device = new Device(options.canvas);
    this.textures = new TextureStore(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      options.etching,
    );
    this.preparer = new Preparer(this.textures, options.rasterHost ?? this.assets);
    options.canvas.addEventListener('webglcontextlost', this.contextLost);
    options.canvas.addEventListener('webglcontextrestored', this.contextRestored);
  }
  private assertLive() {
    if (this.disposed) throw Error('Renderer disposed');
  }
  upsertCards(documents: readonly CardDocument[]) {
    this.assertLive();
    if (new Set(documents.map((d) => d.id)).size !== documents.length)
      throw Error('Duplicate document ID');
    for (const document of documents) {
      validateDocument(document);
      layersOf(document);
      const old = this.documents.get(document.id);
      if (old && document.revision <= old.revision && old !== document)
        throw Error('Changed documents require a newer revision');
    }
    for (const document of documents) {
      if (this.documents.get(document.id) === document) continue;
      this.cancel(document.id);
      this.documents.set(document.id, document);
    }
  }
  releaseCards(ids: Uint32Array) {
    this.assertLive();
    for (const id of ids) {
      this.cancel(id);
      this.documents.delete(id);
      this.prepared.delete(id);
    }
    this.updateScene(this.instances.filter((i) => this.documents.has(i.card)));
  }
  updateScene(instances: readonly Instance[]) {
    this.assertLive();
    const snapshot = instances.map((item) => ({
      ...item,
      transform: [...item.transform],
      normal: item.normal ? ([...item.normal] as [number, number, number]) : undefined,
      deformation: item.deformation ? { ...item.deformation } : undefined,
      wear: item.wear ? { ...item.wear } : undefined,
      cardstock: item.cardstock ? { ...item.cardstock } : undefined,
      printDots: item.printDots ? { ...item.printDots } : undefined,
    }));
    for (const item of snapshot) {
      validateInstance(item);
      if (!this.documents.has(item.card)) throw Error(`Unknown card ${item.card}`);
    }
    this.scene.update(
      Uint32Array.from(snapshot, (i) => i.id),
      Float32Array.from(snapshot.flatMap((i) => i.transform)),
      Int32Array.from(snapshot, (i) => i.order ?? 0),
    );
    this.instances = snapshot;
  }
  private plan(frame: Frame) {
    if (this.shapeData.length !== this.instances.length * 4)
      this.shapeData = new Float32Array(this.instances.length * 4);
    this.instances.forEach((item, index) => {
      // Keep clipping tied to the published face, even during a pending revision.
      const recipe = (this.prepared.get(item.card)?.document ?? this.documents.get(item.card)!)
        .recipe;
      const offset = index * 4;
      this.shapeData[offset] = recipe.color.size[1] / recipe.color.size[0];
      this.shapeData[offset + 1] = recipe.cornerRadius;
      this.shapeData[offset + 2] = item.deformation?.amount ?? 0;
      this.shapeData[offset + 3] = surfaceSeed(item.id);
    });
    return this.scene.plan_shaped(frame.viewProjection, this.shapeData, frame.time ?? 0);
  }
  ready(id: number, revision: number, signal?: AbortSignal): Promise<void> {
    this.assertLive();
    const document = this.documents.get(id);
    if (!document || document.revision !== revision)
      return Promise.reject(Error('Requested revision is not current'));
    this.failed.delete(document);
    const promise = this.enqueue(document);
    if (!signal) return promise;
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(signal.reason);
        return;
      }
      const cancel = () => reject(signal.reason);
      signal.addEventListener('abort', cancel, { once: true });
      promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', cancel));
    });
  }
  private enqueue(document: CardDocument): Promise<void> {
    const existing = this.jobs.get(document.id);
    if (existing) return existing.promise;
    let resolve!: () => void, reject!: (error: unknown) => void;
    const promise = new Promise<void>((yes, no) => {
      resolve = yes;
      reject = no;
    });
    const job = {
      document,
      controller: new AbortController(),
      promise,
      resolve,
      reject,
      started: false,
    };
    this.jobs.set(document.id, job);
    queueMicrotask(() => this.pump());
    return promise;
  }
  private pump() {
    if (this.disposed || this.lost) return;
    for (const job of this.jobs.values()) {
      if (this.active >= this.budgets.preparationConcurrency) break;
      if (job.started) continue;
      job.started = true;
      this.active++;
      const preparer = this.preparer;
      void preparer
        .prepare(job.document, job.controller.signal)
        .then((prepared) => {
          job.controller.signal.throwIfAborted();
          if (this.documents.get(job.document.id) !== job.document)
            throw Error('Superseded preparation');
          this.prepared.set(job.document.id, prepared);
          job.resolve();
          this.options.invalidate?.();
        })
        .catch((error) => {
          if (!job.controller.signal.aborted) this.failed.add(job.document);
          job.reject(error);
        })
        .finally(() => {
          if (this.jobs.get(job.document.id) === job) this.jobs.delete(job.document.id);
          this.active--;
          this.pump();
        });
    }
  }
  private cancel(id: number) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.controller.abort(new DOMException('Revision invalidated', 'AbortError'));
    job.reject(job.controller.signal.reason);
    this.jobs.delete(id);
  }
  private material(prepared: Prepared, leases: Lease<Texture>[]): Material | null {
    const lookup = (key: string | undefined) => {
      if (!key) return undefined;
      const lease = this.textures.store.acquire(key);
      if (lease) leases.push(lease);
      return lease?.value;
    };
    const face = lookup(prepared.color),
      mask = lookup(prepared.mask),
      overlay = lookup(prepared.overlay),
      coverage = lookup(prepared.coverage),
      hologram = lookup(prepared.hologram);
    return face &&
      mask &&
      (!prepared.overlay || overlay) &&
      (!prepared.coverage || coverage) &&
      (!prepared.hologram || hologram)
      ? {
          face,
          mask,
          overlay,
          coverage,
          hologram,
          hologramSettings: prepared.hologramSettings,
          recipe: prepared.document.recipe,
        }
      : null;
  }
  render(frame: Frame): Metrics {
    this.assertLive();
    validateFrame(frame);
    if (this.lost) return this.metrics;
    const start = performance.now(),
      order = this.plan(frame),
      leases: Lease<Texture>[] = [];
    this.lastFrame = frame;
    this.device.begin(frame);
    this.visible = order.length;
    const materialCache = new Map<number, Material | null>();
    const layer = (item: SceneLayer) => {
      const lease = this.textures.store.acquire('scene:' + item.raster.key);
      if (!lease) {
        if (!this.sceneLayerPending && !this.sceneLayerFailure)
          void this.setSceneLayers(this.sceneLayers).catch(this.options.onError ?? console.error);
        return;
      }
      leases.push(lease);
      this.device.drawLayer(
        item,
        lease.value,
        item.stage === 'hud' ? { ...frame, viewProjection: IDENTITY } : frame,
      );
    };
    try {
      this.sceneLayers.filter((l) => l.stage === 'world-under-cards').forEach(layer);
      let group: Instance[] = [],
        current: Material | null = null;
      const flush = () => {
        if (current && group.length) this.device.draw(current, frame, group);
        group = [];
      };
      for (const index of order) {
        const instance = this.instances[index]!;
        let material = materialCache.get(instance.card);
        if (material === undefined) {
          const prepared = this.prepared.get(instance.card),
            document = this.documents.get(instance.card)!;
          material = prepared ? this.material(prepared, leases) : null;
          materialCache.set(instance.card, material);
          if (
            (!material || prepared?.document !== document) &&
            !this.jobs.has(document.id) &&
            !this.failed.has(document)
          )
            void this.enqueue(document).catch((error) => {
              if (!(error instanceof DOMException && error.name === 'AbortError'))
                this.options.onError?.(error);
            });
        }
        if (
          material !== current &&
          (!material ||
            !current ||
            material.face !== current.face ||
            material.mask !== current.mask ||
            material.overlay !== current.overlay ||
            material.coverage !== current.coverage ||
            material.hologram !== current.hologram ||
            material.hologramSettings !== current.hologramSettings ||
            material.recipe.cornerRadius !== current.recipe.cornerRadius ||
            material.recipe.finishCoverageBase !== current.recipe.finishCoverageBase ||
            material.recipe.overlayFoil?.tone !== current.recipe.overlayFoil?.tone ||
            material.recipe.overlayFoil?.strength !== current.recipe.overlayFoil?.strength ||
            JSON.stringify(material.recipe.artWindows) !==
              JSON.stringify(current.recipe.artWindows))
        ) {
          flush();
          current = material;
        }
        if (material) group.push(instance);
      }
      flush();
      for (const stage of ['world-interleaved', 'scene-overlay', 'hud'])
        this.sceneLayers.filter((l) => l.stage === stage).forEach(layer);
    } finally {
      for (const lease of leases) lease.release();
      this.device.end();
    }
    this.frameMs = performance.now() - start;
    return this.metrics;
  }
  async setSceneLayers(layers: readonly SceneLayer[]) {
    this.assertLive();
    if (this.lost) throw Error('Graphics context is lost');
    if (new Set(layers.map((l) => l.id)).size !== layers.length)
      throw Error('Duplicate scene layer ID');
    for (const layer of layers) validateSceneLayer(layer);
    const snapshot = layers.map((layer) => ({ ...layer, transform: [...layer.transform] }));
    const generation = ++this.sceneLayerGeneration,
      epoch = this.epoch,
      textures = this.textures,
      leases: Lease<Texture>[] = [];
    this.sceneLayerFailure = false;
    this.sceneLayerPending++;
    const assertCurrent = () => {
      if (
        this.disposed ||
        this.lost ||
        this.epoch !== epoch ||
        generation !== this.sceneLayerGeneration
      )
        throw new DOMException('Stale scene layer preparation', 'AbortError');
    };
    try {
      for (const layer of snapshot) {
        const key = 'scene:' + layer.raster.key,
          hit = textures.store.acquire(key);
        if (hit) {
          leases.push(hit);
          continue;
        }
        const image = await paintRaster(
          layer.raster,
          this.options.rasterHost ?? this.assets,
          new AbortController().signal,
        );
        try {
          assertCurrent();
          leases.push(textures.upload(key, image, false));
        } finally {
          closeRaster(image);
        }
      }
      assertCurrent();
      this.sceneLayers = snapshot.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
      this.options.invalidate?.();
    } catch (error) {
      if (generation === this.sceneLayerGeneration) this.sceneLayerFailure = true;
      throw error;
    } finally {
      for (const lease of leases) lease.release();
      this.sceneLayerPending--;
    }
  }
  hitTest(x: number, y: number) {
    const rect = this.options.canvas.getBoundingClientRect(),
      hit = this.scene.hit((x / rect.width) * 2 - 1, 1 - (y / rect.height) * 2);
    if (!hit.length) return null;
    const [id, u, v] = hit as unknown as [number, number, number],
      instance = this.instances.find((i) => i.id === id)!;
    const recipe = this.prepared.get(instance.card)?.document.recipe;
    const part = recipe?.regions
      .filter((region) => {
        const [x, y, w, h] = region.rect;
        return u >= x && v >= y && u <= x + w && v <= y + h;
      })
      .sort((a, b) => a.rect[2] * a.rect[3] - b.rect[2] * b.rect[3])[0]?.id;
    return { instance: id, card: instance.card, uv: [u, v] as const, part: part ?? null };
  }
  get metrics(): Metrics {
    return {
      compositions: this.preparer.compositions,
      maskBuilds: this.preparer.masks.builds,
      edgeBuilds: this.textures.edgeBuilds,
      uploads: this.textures.uploads,
      readbacks: this.textures.readbacks,
      draws: this.device.draws,
      visible: this.visible,
      pending: this.jobs.size + this.sceneLayerPending,
      gpu: this.textures.store.stats,
      cpu: this.assets.store.stats,
      scratchBytes: this.textures.scratchBytes,
      cpuFrameMs: this.frameMs,
      surfacePasses: this.device.surfacePasses,
      surfaceBytes: this.device.surfaceBytes,
    };
  }
  resetEpoch(epoch: number) {
    this.assertLive();
    if (!Number.isSafeInteger(epoch) || epoch <= this.epoch) throw Error('Epoch must increase');
    this.epoch = epoch;
    this.sceneLayerGeneration++;
    for (const id of this.jobs.keys()) this.cancel(id);
    this.documents.clear();
    this.prepared.clear();
    this.sceneLayers = [];
    this.sceneLayerFailure = false;
    this.failed = new WeakSet();
    this.instances = [];
    this.device.resetMotion();
    this.scene.update(new Uint32Array(), new Float32Array(), new Int32Array());
    this.textures.store.clear();
    this.assets.clear();
    if (!this.lost) this.device.begin({ viewProjection: IDENTITY });
  }
  private contextLost = (event: Event) => {
    event.preventDefault();
    this.lost = true;
    for (const id of this.jobs.keys()) this.cancel(id);
    this.prepared.clear();
    this.sceneLayerGeneration++;
    this.preparer.dispose();
    this.textures.store.clear();
    this.textures.etcher.dispose();
    this.device.dispose();
  };
  private contextRestored = () => {
    if (this.disposed) return;
    this.preparer.dispose();
    this.textures.dispose();
    this.device.dispose();
    this.device = new Device(this.options.canvas);
    this.textures = new TextureStore(
      this.device.gl,
      this.budgets.gpuBytes,
      this.budgets.scratchBytes,
      this.options.etching,
    );
    this.preparer = new Preparer(this.textures, this.options.rasterHost ?? this.assets);
    this.lost = false;
    this.failed = new WeakSet();
    const layers = this.sceneLayers;
    this.sceneLayers = [];
    void this.setSceneLayers(layers).catch(this.options.onError ?? console.error);
    this.options.invalidate?.();
    this.pump();
  };
  async exportCard(
    id: number,
    options: {
      revision: number;
      width: number;
      finish?: Instance['finish'];
      /** Match the live rain condensation density. */
      rainFog?: Instance['rainFog'];
      pointer?: readonly [number, number];
      /** Surface snapshot time in seconds; does not change the live simulation. */
      time?: number;
      /** Optional silhouette warp; fits within the PNG with transparent margins. */
      deformation?: Instance['deformation'];
      /** Stable surface seed identity. Supply the live instance ID to match its phase. */
      instanceId?: number;
      /** Abrasion over the chosen finish; use the live seed/instanceId to match. */
      wear?: Instance['wear'];
      /** Match the live gloss coating relief. */
      cardstock?: Instance['cardstock'];
      /** Match the experimental process-ink screens. */
      printDots?: Instance['printDots'];
    },
  ): Promise<Blob> {
    validateDeformation(options.deformation);
    await this.ready(id, options.revision);
    const document = this.documents.get(id)!;
    if (document.revision !== options.revision) throw Error('Export revision changed');
    const canvas = this.options.canvas,
      oldSize = [canvas.width, canvas.height],
      oldInstances = this.instances,
      oldLayers = this.sceneLayers,
      oldFrame = this.lastFrame;
    if (!Number.isInteger(options.width) || options.width < 1 || options.width > 2048)
      throw RangeError('Invalid export size');
    let promise: Promise<Blob>;
    const scale = exportScale(options.deformation, options.width);
    const restoreMotion = this.device.isolateMotion();
    try {
      canvas.width = options.width;
      canvas.height = Math.round(
        (options.width * document.recipe.color.size[1]) / document.recipe.color.size[0],
      );
      this.sceneLayers = [];
      this.updateScene([
        {
          id: options.instanceId ?? 0,
          card: id,
          finish: options.finish,
          rainFog: options.rainFog,
          wear: options.wear,
          cardstock: options.cardstock,
          printDots: options.printDots,
          deformation: options.deformation,
          transform: [2 * scale, 0, 0, 0, 0, -2 * scale, 0, 0, 0, 0, 1, 0, -scale, scale, 0, 1],
        },
      ]);
      this.render({
        viewProjection: IDENTITY,
        pointer: options.pointer,
        time: options.time ?? oldFrame?.time,
      });
      promise = new Promise((resolve, reject) =>
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(Error('Export failed'))),
          'image/png',
        ),
      );
    } finally {
      restoreMotion();
      canvas.width = oldSize[0]!;
      canvas.height = oldSize[1]!;
      this.sceneLayers = oldLayers;
      this.updateScene(oldInstances);
      if (oldFrame) this.render(oldFrame);
    }
    return promise;
  }
  dispose() {
    if (this.disposed) return;
    for (const id of this.jobs.keys()) this.cancel(id);
    this.disposed = true;
    this.sceneLayerGeneration++;
    if (!this.lost) this.device.begin({ viewProjection: IDENTITY });
    this.options.canvas.removeEventListener('webglcontextlost', this.contextLost);
    this.options.canvas.removeEventListener('webglcontextrestored', this.contextRestored);
    this.preparer.dispose();
    this.textures.dispose();
    this.device.dispose();
    this.assets.dispose();
    this.scene.free();
  }
}
export async function initializeRenderer(wasmUrl?: string | URL): Promise<void> {
  initialized ??= init(wasmUrl ? { module_or_path: wasmUrl } : undefined).catch((error) => {
    initialized = undefined;
    throw error;
  });
  await initialized;
}
export async function createRenderer(options: RendererOptions): Promise<Renderer> {
  await initializeRenderer(options.wasmUrl);
  return new Renderer(options);
}
