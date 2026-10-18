import { GpuEtcher, program } from './gpu/etcher.js';
import { Caustics } from './gpu/caustics.js';
import type { Rect } from './types.js';
import type { CardDocument, Instance, Lease, RasterHost } from './types.js';
import { TextureStore } from './gpu/textures.js';
import type { Texture } from './gpu/textures.js';
import { Preparer } from './prepare.js';
import { FinishPrinting } from './finish-printing.js';
import type { FinishMap } from './finish-printing.js';
import { prepareFinishCoverage } from './finish-coverage.js';
import { initializeRenderer } from './renderer.js';
import { layersOf, paintCoverage } from './raster.js';

const copyFragment = `#version 300 es
precision highp float;
uniform sampler2D source;
uniform sampler2D coverage;
uniform bool hasCoverage;
uniform vec2 size;
out vec4 color;
void main(){
 vec2 uv=gl_FragCoord.xy/size;
 float value=texture(source,uv).r;
 if(hasCoverage){vec4 c=texture(coverage,uv);value=max(value,c.b)*(1.-c.a);}
 color=vec4(vec3(value),1.);
}`;

export class FinishResources {
  private canvas = document.createElement('canvas');
  private poolCanvas = document.createElement('canvas');
  private gl: WebGL2RenderingContext;
  private etcher?: GpuEtcher;
  private pool?: Caustics;
  private copy?: WebGLProgram;
  private vao?: WebGLVertexArrayObject;
  private poolTime = NaN;
  private disposed = false;
  private documentTextures?: TextureStore;
  private documentPreparer?: Preparer;
  private documentHost?: RasterHost;
  private documentQueue: Promise<void> = Promise.resolve();
  private documentControllers = new Set<AbortController>();
  private printing?: FinishPrinting;
  constructor() {
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw Error('WebGL2 is required for finish resources');
    this.gl = gl;
    this.canvas.addEventListener('webglcontextlost', this.lost);
    this.canvas.addEventListener('webglcontextrestored', this.restored);
  }
  private lost = (event: Event) => {
    event.preventDefault();
    for (const controller of this.documentControllers) controller.abort();
  };
  private restored = () => {
    this.documentPreparer?.dispose();
    this.documentTextures?.dispose();
    this.documentPreparer = undefined;
    this.documentTextures = undefined;
    this.etcher = undefined;
    this.pool = undefined;
    this.copy = undefined;
    this.vao = undefined;
    this.poolTime = NaN;
    this.printing = undefined;
  };
  private draw(
    map: WebGLTexture,
    width: number,
    height: number,
    target: HTMLCanvasElement,
    coverage?: Texture,
  ) {
    if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
    const gl = this.gl;
    const copy: WebGLProgram = (this.copy ??= program(gl, copyFragment)!);
    this.vao ??= gl.createVertexArray()!;
    this.canvas.width = width;
    this.canvas.height = height;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindVertexArray(this.vao);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.CULL_FACE);
    gl.colorMask(true, true, true, true);
    gl.useProgram(copy);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, map);
    gl.uniform1i(gl.getUniformLocation(copy, 'source'), 0);
    gl.uniform2f(gl.getUniformLocation(copy, 'size'), width, height);
    gl.uniform1i(gl.getUniformLocation(copy, 'hasCoverage'), coverage ? 1 : 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, coverage?.texture ?? map);
    gl.uniform1i(gl.getUniformLocation(copy, 'coverage'), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (target.width !== width || target.height !== height) {
      target.width = width;
      target.height = height;
    }
    const context = target.getContext('2d');
    if (!context) throw Error('Finish resource canvas unavailable');
    context.drawImage(this.canvas, 0, 0);
  }
  mask(source: TexImageSource, width: number, height: number): HTMLCanvasElement {
    if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
    this.etcher ??= new GpuEtcher(this.gl);
    const map = this.etcher.run(source, width, height);
    try {
      const result = document.createElement('canvas');
      this.draw(map, width, height, result);
      return result;
    } finally {
      this.gl.deleteTexture(map);
    }
  }
  printDots(
    source: TexImageSource,
    width: number,
    height: number,
    settings: NonNullable<Instance['printDots']>,
    artWindows: readonly Rect[] = [],
  ): FinishMap {
    if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
    this.printing ??= new FinishPrinting(this.gl);
    return this.printing.printDots(source, width, height, settings, artWindows);
  }
  cardstock(): FinishMap {
    if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
    this.printing ??= new FinishPrinting(this.gl);
    return this.printing.cardstock();
  }
  documentCoverage(
    document: CardDocument,
    host: RasterHost,
    signal: AbortSignal,
  ): Promise<HTMLCanvasElement> {
    return this.documentResource(signal, (signal) => prepareFinishCoverage(document, host, signal));
  }
  private async documentResource<T>(
    signal: AbortSignal,
    prepare: (signal: AbortSignal) => Promise<T>,
  ): Promise<T> {
    signal.throwIfAborted();
    if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
    const controller = new AbortController();
    const abort = () => controller.abort(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    this.documentControllers.add(controller);
    const ready = this.documentQueue.then(async () => {
      controller.signal.throwIfAborted();
      await initializeRenderer();
      controller.signal.throwIfAborted();
      if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
      return prepare(controller.signal);
    });
    this.documentQueue = ready.then(
      () => {},
      () => {},
    );
    try {
      return await ready;
    } finally {
      signal.removeEventListener('abort', abort);
      this.documentControllers.delete(controller);
    }
  }
  async documentMask(
    document: CardDocument,
    host: RasterHost,
    signal: AbortSignal,
  ): Promise<HTMLCanvasElement> {
    return this.documentResource(signal, async (signal) => {
      signal.throwIfAborted();
      if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
      this.documentTextures ??= new TextureStore(this.gl, 16 * 1024 * 1024, 8 * 1024 * 1024);
      this.documentPreparer ??= new Preparer(this.documentTextures, {
        images: (requests, paintSignal) => this.documentHost!.images(requests, paintSignal),
      });
      this.documentHost = host;
      let mask: Lease<Texture> | undefined;
      let coverage: Lease<Texture> | undefined;
      try {
        mask = await this.documentPreparer.prepareMask(document, signal);
        const layers = layersOf(document).filter((layer) => layer.etchCoverage);
        if (layers.length) {
          const bytes = await paintCoverage(document.recipe.color.size, layers, host, signal);
          signal.throwIfAborted();
          coverage = this.documentTextures.uploadBytes(
            `${document.recipe.pack}:` +
              JSON.stringify([
                'finish-etch-coverage-v1',
                document.recipe.color.size,
                layers.map((layer) => [
                  layer.clip,
                  layer.etchCoverage?.add?.key,
                  layer.etchCoverage?.exclude?.key,
                ]),
              ]),
            bytes,
            document.recipe.color.size,
          );
        }
        signal.throwIfAborted();
        const result = window.document.createElement('canvas');
        try {
          this.draw(
            mask.value.texture,
            mask.value.width,
            mask.value.height,
            result,
            coverage?.value,
          );
          return result;
        } catch (error) {
          result.width = result.height = 0;
          throw error;
        }
      } finally {
        coverage?.release();
        mask?.release();
        this.documentHost = undefined;
      }
    });
  }
  caustics(time: number): HTMLCanvasElement {
    if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
    this.pool ??= new Caustics(this.gl);
    if (this.poolTime !== time) {
      this.pool.prepare(time);
      this.draw(this.pool.map, 512, 512, this.poolCanvas);
      this.poolTime = time;
    }
    return this.poolCanvas;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const controller of this.documentControllers) controller.abort();
    this.documentControllers.clear();
    this.documentPreparer?.dispose();
    this.documentTextures?.dispose();
    this.canvas.removeEventListener('webglcontextlost', this.lost);
    this.canvas.removeEventListener('webglcontextrestored', this.restored);
    this.etcher?.dispose();
    this.pool?.dispose();
    this.printing?.dispose();
    this.gl.deleteProgram(this.copy ?? null);
    this.gl.deleteVertexArray(this.vao ?? null);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.canvas.width = this.canvas.height = 1;
  }
}
