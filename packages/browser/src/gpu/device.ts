import { programAsync, texture } from './etcher.js';
import { vertex, materialFragment, imageFragment } from './shaders.js';
import type { Texture } from './textures.js';
import type { FaceRecipe, Frame, Instance, SceneLayer } from '../types.js';
import { SurfaceMotion } from '../surface-motion.js';
import { surfaceSeed } from '../deformation.js';
import { Caustics } from './caustics.js';
import { Cardstock } from './cardstock.js';
import { PrintedInk } from './printed-ink.js';
import { DEFAULT_PRINT_DOTS, printDotValues, printArtBounds } from '../print-settings.js';
const kinds = {
  regular: 0,
  etched: 1,
  prismatic: 2,
  cold: 3,
  opal: 4,
  rain: 5,
  heat: 6,
  pool: 7,
  gloss: 8,
  holofoil: 9,
};
const stride = 49;
export interface Material {
  face: Texture;
  mask: Texture;
  overlay?: Texture;
  coverage?: Texture;
  hologram?: Texture;
  hologramSettings: string;
  recipe: FaceRecipe;
}
export class Device {
  readonly gl: WebGL2RenderingContext;
  private programs = new Map<string, { promise: Promise<WebGLProgram>; value?: WebGLProgram }>();
  private image?: WebGLProgram;
  private imagePending?: Promise<WebGLProgram>;
  private lifetime = new AbortController();
  private reported = new Set<unknown>();
  private compiling = 0;
  private vao: WebGLVertexArrayObject;
  private quad: WebGLBuffer;
  private instances: WebGLBuffer;
  private blank: WebGLTexture;
  private disposed = false;
  private instanceCapacity = 0;
  private staging = new Float32Array();
  private motion = new SurfaceMotion();
  private caustics?: Caustics;
  private cardstock?: Cardstock;
  private printedInk?: PrintedInk;
  private causticsPending?: Promise<Caustics>;
  private cardstockPending?: Promise<Cardstock>;
  private printedInkPending?: Promise<PrintedInk>;
  private uniforms = new WeakMap<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
  private frameUniforms = new Map<WebGLProgram, Frame>();
  private bounds = new WeakMap<FaceRecipe, Float32Array>();
  draws = 0;
  constructor(
    readonly canvas: HTMLCanvasElement,
    private invalidate?: () => void,
    private onError?: (error: unknown) => void,
  ) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw Error('WebGL2 is required');
    this.gl = gl;
    this.vao = gl.createVertexArray()!;
    this.quad = gl.createBuffer()!;
    this.instances = gl.createBuffer()!;
    this.blank = texture(gl, 1, 1, gl.RGBA8, gl.RGBA)!;
    gl.bindTexture(gl.TEXTURE_2D, this.blank);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instances);
    for (let i = 0; i < 4; i++) {
      gl.enableVertexAttribArray(1 + i);
      gl.vertexAttribPointer(1 + i, 4, gl.FLOAT, false, stride * 4, i * 16);
      gl.vertexAttribDivisor(1 + i, 1);
    }
    gl.enableVertexAttribArray(5);
    gl.vertexAttribPointer(5, 3, gl.FLOAT, false, stride * 4, 64);
    gl.vertexAttribDivisor(5, 1);
    gl.enableVertexAttribArray(6);
    gl.vertexAttribPointer(6, 1, gl.FLOAT, false, stride * 4, 76);
    gl.vertexAttribDivisor(6, 1);
    for (let i = 7; i <= 11; i++) {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, 4, gl.FLOAT, false, stride * 4, 80 + (i - 7) * 16);
      gl.vertexAttribDivisor(i, 1);
    }
    gl.enableVertexAttribArray(12);
    gl.vertexAttribPointer(12, 2, gl.FLOAT, false, stride * 4, 160);
    gl.vertexAttribDivisor(12, 1);
    gl.enableVertexAttribArray(13);
    gl.vertexAttribPointer(13, 1, gl.FLOAT, false, stride * 4, 168);
    gl.vertexAttribDivisor(13, 1);
    gl.enableVertexAttribArray(14);
    gl.vertexAttribPointer(14, 4, gl.FLOAT, false, stride * 4, 172);
    gl.vertexAttribDivisor(14, 1);
    gl.enableVertexAttribArray(15);
    gl.vertexAttribPointer(15, 2, gl.FLOAT, false, stride * 4, 188);
    gl.vertexAttribDivisor(15, 1);
    gl.bindVertexArray(null);
  }
  private activePrint(item: Instance) {
    return Boolean(item.printDots && (item.printDots.amount ?? DEFAULT_PRINT_DOTS.amount) > 0);
  }
  private key(recipe: FaceRecipe, finish: Instance['finish'], procedural: boolean) {
    return `${finish ?? 'regular'}:${Boolean(recipe.hologram?.strength)}:${procedural}`;
  }
  private changed = () => {
    if (!this.disposed && !this.gl.isContextLost()) this.invalidate?.();
  };
  private report = (error: unknown) => {
    if (this.disposed || this.gl.isContextLost() || this.reported.has(error)) return;
    this.reported.add(error);
    this.onError?.(error);
  };
  private compile(recipe: FaceRecipe, finish: Instance['finish'], procedural: boolean) {
    const key = this.key(recipe, finish, procedural);
    let entry = this.programs.get(key);
    if (!entry) {
      this.compiling++;
      const next: { promise: Promise<WebGLProgram>; value?: WebGLProgram } = {
        promise: Promise.resolve().then(() =>
          programAsync(
            this.gl,
            materialFragment(
              kinds[finish ?? 'regular'],
              Boolean(recipe.hologram?.strength),
              procedural,
            ),
            vertex,
            this.lifetime.signal,
          ),
        ),
      };
      next.promise = next.promise
        .then((shader) => {
          if (this.disposed) {
            if (!this.gl.isContextLost()) this.gl.deleteProgram(shader);
            throw this.lifetime.signal.reason;
          }
          next.value = shader;
          this.changed();
          return shader;
        })
        .finally(() => this.compiling--);
      this.programs.set(key, (entry = next));
    }
    return entry.promise;
  }
  async prepare(recipe: FaceRecipe, list: readonly Instance[], signal?: AbortSignal) {
    signal?.throwIfAborted();
    if (this.disposed) throw Error('Device disposed');
    const pending: Promise<unknown>[] = [];
    if (!list.length) pending.push(this.compile(recipe, 'regular', false));
    const seen = new Set<string>();
    for (const item of list) {
      const procedural = this.activePrint(item),
        key = this.key(recipe, item.finish, procedural);
      if (!seen.has(key)) {
        seen.add(key);
        pending.push(this.compile(recipe, item.finish, procedural));
      }
    }
    if (list.some((item) => item.finish === 'pool')) {
      if (!this.causticsPending) this.compiling++;
      this.causticsPending ??= Promise.resolve()
        .then(() => Caustics.create(this.gl, this.lifetime.signal))
        .then((value) => {
          if (this.disposed) {
            if (!this.gl.isContextLost()) value.dispose();
            throw this.lifetime.signal.reason;
          }
          this.caustics = value;
          this.changed();
          return value;
        })
        .finally(() => this.compiling--);
      pending.push(this.causticsPending);
    }
    if (
      list.some(
        (item) => item.finish && item.finish !== 'regular' && (item.cardstock?.amount ?? 0) > 0,
      )
    ) {
      if (!this.cardstockPending) this.compiling++;
      this.cardstockPending ??= Promise.resolve()
        .then(() => Cardstock.create(this.gl, this.lifetime.signal))
        .then((value) => {
          if (this.disposed) {
            if (!this.gl.isContextLost()) value.dispose();
            throw this.lifetime.signal.reason;
          }
          this.cardstock = value;
          this.changed();
          return value;
        })
        .finally(() => this.compiling--);
      pending.push(this.cardstockPending);
    }
    if (list.some((item) => this.activePrint(item))) {
      if (!this.printedInkPending) this.compiling++;
      this.printedInkPending ??= Promise.resolve()
        .then(() => PrintedInk.create(this.gl, this.lifetime.signal))
        .then((value) => {
          if (this.disposed) {
            if (!this.gl.isContextLost()) value.dispose();
            throw this.lifetime.signal.reason;
          }
          this.printedInk = value;
          this.changed();
          return value;
        })
        .finally(() => this.compiling--);
      pending.push(this.printedInkPending);
    }
    const ready = Promise.all(pending).then(() => {});
    if (!signal) return ready;
    await new Promise<void>((resolve, reject) => {
      const abort = () => reject(signal.reason);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
      ready.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    });
  }
  prepareLayers() {
    if (this.disposed) return Promise.reject(Error('Device disposed'));
    if (!this.imagePending) this.compiling++;
    return (this.imagePending ??= Promise.resolve()
      .then(() => programAsync(this.gl, imageFragment, vertex, this.lifetime.signal))
      .then((shader) => {
        if (this.disposed) {
          if (!this.gl.isContextLost()) this.gl.deleteProgram(shader);
          throw this.lifetime.signal.reason;
        }
        this.image = shader;
        this.changed();
        return shader;
      })
      .finally(() => this.compiling--));
  }
  get pending() {
    return this.compiling;
  }
  begin(frame: Frame) {
    this.motion.begin();
    this.printedInk?.beginFrame();
    this.frameUniforms.clear();
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.CULL_FACE);
    gl.colorMask(true, true, true, true);
    gl.depthMask(true);
    gl.clearDepth(1);
    gl.clearColor(...(frame.clear ?? [0, 0, 0, 0]));
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.draws = 0;
  }
  private uniform(shader: WebGLProgram, name: string) {
    let uniforms = this.uniforms.get(shader);
    if (!uniforms) this.uniforms.set(shader, (uniforms = new Map()));
    if (!uniforms.has(name)) uniforms.set(name, this.gl.getUniformLocation(shader, name));
    return uniforms.get(name)!;
  }
  private bind(shader: WebGLProgram, frame: Frame, list: readonly Instance[], printed = false) {
    const gl = this.gl;
    gl.useProgram(shader);
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instances);
    const length = list.length * stride;
    if (this.staging.length < length) this.staging = new Float32Array(length);
    const values = this.staging;
    list.forEach((item, i) => {
      const start = i * stride;
      values.set(item.transform, start);
      values.set(item.normal ?? [0, 0, 1], start + 16);
      values[start + 19] = kinds[item.finish ?? 'regular'];
      const surface = this.motion.sample(item, frame);
      if (surface) values.set(surface, start + 20);
      else values.fill(0, start + 20, start + stride);
      values[start + 22] = surfaceSeed(item.id);
      values[start + 23] = item.deformation?.amount ?? 0;
      values[start + 40] = item.wear?.amount ?? 0;
      values[start + 41] = surfaceSeed(item.wear?.seed ?? item.id);
      values[start + 42] = item.cardstock?.amount ?? 0;
      const dots = item.printDots;
      values[start + 43] = printed || !dots ? 0 : (dots.amount ?? DEFAULT_PRINT_DOTS.amount);
      values[start + 44] = dots?.period ?? DEFAULT_PRINT_DOTS.period;
      values[start + 45] = dots?.variation ?? DEFAULT_PRINT_DOTS.variation;
      values[start + 46] = dots?.inset ?? DEFAULT_PRINT_DOTS.inset;
      values[start + 47] = item.rainFog ?? 1;
      values[start + 48] = item.printDots?.artwork === false ? 0 : 1;
    });
    if (this.instanceCapacity < length) {
      this.instanceCapacity = length;
      gl.bufferData(gl.ARRAY_BUFFER, length * 4, gl.DYNAMIC_DRAW);
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, values, 0, length);
    if (this.frameUniforms.get(shader) !== frame) {
      gl.uniformMatrix4fv(this.uniform(shader, 'viewProjection'), false, frame.viewProjection);
      // Pose controls studio lighting; hover UVs remain independent water inputs.
      const pointer = frame.lighting === 'studio' ? [0.5, 0.5] : (frame.pointer ?? [0.5, 0.5]);
      gl.uniform2f(this.uniform(shader, 'pointer'), pointer[0], 1 - pointer[1]);
      gl.uniform1f(this.uniform(shader, 'surfaceTime'), frame.time ?? 0);
      gl.uniform1f(this.uniform(shader, 'studioLighting'), frame.lighting === 'studio' ? 1 : 0);
      this.frameUniforms.set(shader, frame);
    }
  }
  private printing(material: Material, list: readonly Instance[]) {
    const profile = list[0]?.printDots;
    const settings = printDotValues(profile);
    const homogeneous =
      profile &&
      settings[0]! > 0 &&
      (list.length === 1 ||
        list.every(
          (item) =>
            printDotValues(item.printDots).every((value, i) => value === settings[i]) &&
            (item.printDots?.artwork !== false) === (profile.artwork !== false),
        ));
    return homogeneous
      ? this.printedInk?.prepare(
          material.face,
          material.overlay,
          profile,
          material.recipe.artWindows,
        )
      : undefined;
  }
  draw(material: Material, frame: Frame, list: readonly Instance[]) {
    const gl = this.gl;
    const procedural = list.some((item) => this.activePrint(item));
    const p = this.programs.get(this.key(material.recipe, list[0]?.finish, procedural))?.value;
    const pool = list.some((item) => item.finish === 'pool');
    const coated = list.some(
      (item) => item.finish && item.finish !== 'regular' && (item.cardstock?.amount ?? 0) > 0,
    );
    if (
      !p ||
      (pool && !this.caustics) ||
      (coated && !this.cardstock) ||
      (procedural && !this.printedInk)
    ) {
      void this.prepare(material.recipe, list).catch(this.report);
      return;
    }
    if (pool) this.caustics!.prepare(frame.time ?? 0);
    if (coated) this.cardstock!.prepare();
    const printed = this.printing(material, list);
    this.bind(p, frame, list, Boolean(printed));
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    const bindings = [
      ['face', printed?.face.texture ?? material.face.texture],
      ['mask', material.mask.texture],
      ['overlay', printed?.top?.texture ?? material.overlay?.texture ?? this.blank],
      ['coverage', material.coverage?.texture ?? this.blank],
      ['caustics', this.caustics?.map ?? this.blank],
      ['hologramMask', material.hologram?.texture ?? this.blank],
      ['cardstockMap', this.cardstock?.map ?? this.blank],
    ] as const;
    bindings.forEach(([name, t], i) => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.uniform1i(this.uniform(p, name), i);
    });
    let bounds = this.bounds.get(material.recipe);
    if (!bounds)
      this.bounds.set(material.recipe, (bounds = printArtBounds(material.recipe.artWindows)));
    gl.uniform4fv(this.uniform(p, 'artBounds[0]'), bounds);
    gl.uniform4fv(this.uniform(p, 'printArtBounds[0]'), bounds);
    gl.uniform1f(this.uniform(p, 'finishBase'), material.recipe.finishCoverageBase ?? 1);
    const hologram = material.recipe.hologram,
      [hx, hy, hw, hh] = hologram?.rect ?? [0, 0, 1, 1];
    gl.uniform4f(this.uniform(p, 'hologramRect'), hx, 1 - hy - hh, hw, hh);
    gl.uniform2f(
      this.uniform(p, 'hologramMaterial'),
      hologram?.strength ?? 0,
      (hologram?.seed ?? 0) / 0xffffffff,
    );
    const overlayFoil = material.recipe.overlayFoil;
    gl.uniform2f(
      this.uniform(p, 'overlayFoil'),
      overlayFoil ? { gold: 1, silver: 3, prismatic: 2 }[overlayFoil.tone] : 0,
      overlayFoil?.strength ?? 0,
    );
    gl.uniform1f(this.uniform(p, 'cornerRadius'), material.recipe.cornerRadius);
    gl.uniform1f(this.uniform(p, 'aspect'), material.face.height / material.face.width);
    gl.uniform1f(this.uniform(p, 'hasMask'), 1);
    gl.uniform1f(this.uniform(p, 'satinCompact'), 1);
    gl.uniform1f(this.uniform(p, 'satinHoverGain'), 0);

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, list.length);
    this.draws++;
  }
  drawLayer(layer: SceneLayer, image: Texture, frame: Frame) {
    const gl = this.gl,
      p = this.image;
    if (!p) {
      void this.prepareLayers().catch(this.report);
      return;
    }
    this.bind(p, frame, [{ id: 0, card: 0, transform: layer.transform }]);
    if (layer.depth === 'ignore') gl.disable(gl.DEPTH_TEST);
    else {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    }
    gl.depthMask(layer.depth === 'test-write');
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, image.texture);
    gl.uniform1i(this.uniform(p, 'face'), 0);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 1);
    this.draws++;
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.lifetime.abort(new DOMException('Device disposed', 'AbortError'));
    this.motion.clear();
    const gl = this.gl;
    if (gl.isContextLost()) return;
    for (const entry of this.programs.values()) if (entry.value) gl.deleteProgram(entry.value);
    if (this.image) gl.deleteProgram(this.image);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.quad);
    gl.deleteBuffer(this.instances);
    gl.deleteTexture(this.blank);
    this.caustics?.dispose();
    this.cardstock?.dispose();
    this.printedInk?.dispose();
  }
  get surfacePasses() {
    return (
      (this.caustics?.passes ?? 0) + (this.cardstock?.passes ?? 0) + (this.printedInk?.passes ?? 0)
    );
  }
  get surfaceBytes() {
    return (
      (this.caustics?.bytes ?? 0) + (this.cardstock?.bytes ?? 0) + (this.printedInk?.bytes ?? 0)
    );
  }
  end() {
    this.motion.end();
  }
  resetMotion() {
    this.motion.clear();
  }
  isolateMotion() {
    const previous = this.motion;
    this.motion = new SurfaceMotion();
    return () => {
      this.motion = previous;
    };
  }
}
