import { Caustics } from './gpu/caustics.js';
import { Cardstock } from './gpu/cardstock.js';
import { texture } from './gpu/etcher.js';
import { PrintedInk } from './gpu/printed-ink.js';
import { printDotValues } from './print-settings.js';
import { validatePrintDots } from './validation.js';
import { withFinishTextureState } from './finish-texture-state.js';
import type { Instance, Rect } from './types.js';

/** Bottom-left UVs, straight-alpha sRGB, level zero matching these dimensions.
 * Omit layer for TEXTURE_2D; otherwise select a TEXTURE_2D_ARRAY layer. */
export interface FinishTextureSource {
  readonly texture: WebGLTexture;
  readonly width: number;
  readonly height: number;
  readonly layer?: number;
}

/** A level-zero TEXTURE_2D; filtering, format and ownership depend on its producer. */
export interface FinishTexture {
  readonly texture: WebGLTexture;
  readonly width: number;
  readonly height: number;
}

/** Native GPU preparation in a host-owned context. No context creation, uploads
 * or readPixels. Cache results outside animation, by immutable source/settings.
 * Printing textures belong to the caller; shared cardstock and caustics belong to
 * this owner. After context loss, dispose and recreate this owner and sources. */
export class FinishTextures {
  private ink?: PrintedInk;
  private stock?: Cardstock;
  private stockMap?: FinishTexture;
  private pool?: Caustics;
  private poolMap?: FinishTexture;
  private poolTime = NaN;
  private warming?: Promise<void>;
  private warmupController?: AbortController;
  private sampler?: WebGLSampler;
  private disposed = false;
  private lost = false;
  private onLost = () => {
    this.lost = true;
    this.warmupController?.abort();
  };

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.available();
    gl.canvas.addEventListener('webglcontextlost', this.onLost);
  }

  private available() {
    if (this.disposed || this.lost || this.gl.isContextLost())
      throw Error('Finish textures unavailable; recreate after context loss');
  }

  async ready(signal?: AbortSignal): Promise<void> {
    this.available();
    signal?.throwIfAborted();
    if (this.ink && this.stock && this.pool) return;
    if (!this.warming) {
      const controller = new AbortController();
      this.warmupController = controller;
      this.warming = this.warm(controller.signal).finally(() => {
        this.warming = undefined;
        this.warmupController = undefined;
      });
    }
    let abort: (() => void) | undefined;
    try {
      if (signal) {
        await new Promise<void>((resolve, reject) => {
          abort = () => reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
          signal.addEventListener('abort', abort, { once: true });
          this.warming!.then(resolve, reject);
        });
      } else await this.warming;
      signal?.throwIfAborted();
      this.available();
    } finally {
      if (abort) signal?.removeEventListener('abort', abort);
    }
  }

  private async warm(signal: AbortSignal): Promise<void> {
    const accept = <T extends { dispose(): void }>(helper: T, current?: T): T => {
      try {
        signal.throwIfAborted();
        this.available();
        if (current) {
          helper.dispose();
          return current;
        }
        return helper;
      } catch (error) {
        if (!this.lost && !this.gl.isContextLost()) helper.dispose();
        throw error;
      }
    };
    if (!this.ink) this.ink = accept(await PrintedInk.create(this.gl, signal), this.ink);
    if (!this.stock) this.stock = accept(await Cardstock.create(this.gl, signal), this.stock);
    if (!this.pool) this.pool = accept(await Caustics.create(this.gl, signal), this.pool);
  }

  /** Allocate one caller-owned SRGB8_ALPHA8 printing texture. Delete it with
   * gl.deleteTexture when evicted; disposing this helper does not delete it. */
  printDots(
    source: FinishTextureSource,
    settings: NonNullable<Instance['printDots']> = {},
    artWindows: readonly Rect[] = [],
  ): FinishTexture {
    this.available();
    if (!settings || typeof settings !== 'object') throw Error('Invalid print dots');
    validatePrintDots(settings);
    if (
      artWindows.length > 8 ||
      artWindows.some(
        (r) => r.length !== 4 || r.some((v) => !Number.isFinite(v)) || r[2] <= 0 || r[3] <= 0,
      )
    )
      throw Error('Invalid print artwork windows');
    const gl = this.gl;
    const limit = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (
      !source ||
      !Number.isInteger(source.width) ||
      !Number.isInteger(source.height) ||
      source.width < 1 ||
      source.height < 1 ||
      source.width > limit ||
      source.height > limit ||
      source.width * source.height > 4194304 ||
      (source.layer !== undefined &&
        (!Number.isInteger(source.layer) ||
          source.layer < 0 ||
          source.layer >= (gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS) as number)))
    )
      throw Error('Invalid printing size or layer');
    if (!gl.isTexture(source.texture)) throw Error('Printing requires a texture in this context');
    return withFinishTextureState(gl, () => {
      if (!this.sampler) {
        const sampler = gl.createSampler();
        if (!sampler) throw Error('Finish texture sampler unavailable');
        gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        this.sampler = sampler;
      }
      gl.bindSampler(0, this.sampler);
      this.ink ??= new PrintedInk(gl);
      const copied = source.layer === undefined ? undefined : this.copyLayer(source);
      try {
        const result = this.ink.paint(
          { texture: copied ?? source.texture, width: source.width, height: source.height },
          printDotValues(settings),
          artWindows,
          settings.artwork !== false,
        );
        if (gl.isContextLost()) {
          gl.deleteTexture(result.texture);
          throw Error('Context lost during finish preparation');
        }
        return result;
      } finally {
        gl.deleteTexture(copied ?? null);
      }
    });
  }

  /** Borrow one shared RGBA8 packed-slope map; alpha is data. Do not delete or
   * modify it. It remains valid until this owner is disposed or context is lost. */
  cardstock(): FinishTexture {
    this.available();
    if (this.stockMap) return this.stockMap;
    return withFinishTextureState(this.gl, () => {
      this.stock ??= new Cardstock(this.gl);
      this.stock.prepare();
      this.available();
      return (this.stockMap = {
        texture: this.stock.map!,
        width: this.stock.width,
        height: this.stock.height,
      });
    });
  }

  caustics(time: number): FinishTexture {
    this.available();
    time = Math.fround(time);
    if (!Number.isFinite(time) || time < 0) throw Error('Invalid caustics time');
    if (this.poolMap && this.poolTime === time) return this.poolMap;
    return withFinishTextureState(this.gl, () => {
      this.pool ??= new Caustics(this.gl);
      this.pool.prepare(time);
      this.available();
      this.poolTime = time;
      return (this.poolMap ??= { texture: this.pool.map, width: 512, height: 512 });
    });
  }

  private copyLayer(source: FinishTextureSource): WebGLTexture {
    const gl = this.gl;
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) throw Error('Finish source framebuffer unavailable');
    let copy: WebGLTexture | undefined;
    try {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTextureLayer(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        source.texture,
        0,
        source.layer!,
      );
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw Error('Printing source layer is incomplete');
      copy = texture(gl, source.width, source.height, gl.SRGB8_ALPHA8, gl.RGBA)!;
      gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, source.width, source.height);
      return copy!;
    } catch (error) {
      gl.deleteTexture(copy ?? null);
      throw error;
    } finally {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(framebuffer);
    }
  }

  /** Releases helper programs, scratch resources and borrowed maps only. */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.warmupController?.abort();
    this.gl.canvas.removeEventListener('webglcontextlost', this.onLost);
    // Lost-context objects are already released and must not be submitted to a
    // restored context. Only this context generation's live handles need deletion.
    if (!this.lost && !this.gl.isContextLost()) {
      this.ink?.dispose();
      this.stock?.dispose();
      this.pool?.dispose();
      this.gl.deleteSampler(this.sampler ?? null);
    }
    this.ink = undefined;
    this.stock = undefined;
    this.pool = undefined;
    this.poolMap = undefined;
    this.sampler = undefined;
    this.stockMap = undefined;
  }
}
