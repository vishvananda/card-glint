import { program, texture } from './etcher.js';
import { vertex, fragment, hologramFragment, imageFragment } from './shaders.js';
import type { Texture } from './textures.js';
import type { FaceRecipe, Frame, Instance, SceneLayer } from '../types.js';
import { SurfaceMotion } from '../surface-motion.js';
import { surfaceSeed } from '../deformation.js';
import { Caustics } from './caustics.js';
import { Cardstock } from './cardstock.js';
import { PrintedInk } from './printed-ink.js';
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
};
const stride = 47;
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
  private foil: WebGLProgram;
  private holographic: WebGLProgram;
  private image: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private quad: WebGLBuffer;
  private instances: WebGLBuffer;
  private blank: WebGLTexture;
  private disposed = false;
  private instanceCapacity = 0;
  private staging = new Float32Array();
  private motion = new SurfaceMotion();
  private caustics: Caustics;
  private cardstock: Cardstock;
  private printedInk: PrintedInk;
  draws = 0;
  constructor(readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw Error('WebGL2 is required');
    this.gl = gl;
    this.caustics = new Caustics(gl);
    this.cardstock = new Cardstock(gl);
    this.printedInk = new PrintedInk(gl);
    this.foil = program(gl, fragment, vertex)!;
    // Compile both variants once with the context. Uncoated cards keep the
    // smaller original shader rather than paying its register/branch cost.
    this.holographic = program(gl, hologramFragment, vertex)!;
    this.image = program(gl, imageFragment, vertex)!;
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
    gl.bindVertexArray(null);
  }
  begin(frame: Frame) {
    this.motion.begin();
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
      values[start + 43] = printed ? 0 : (item.printDots?.amount ?? 0);
      values[start + 44] = item.printDots?.period ?? 5;
      values[start + 45] = item.printDots?.variation ?? 0.5;
      values[start + 46] = item.printDots?.inset ?? 0;
    });
    if (this.instanceCapacity < length) {
      this.instanceCapacity = length;
      gl.bufferData(gl.ARRAY_BUFFER, length * 4, gl.DYNAMIC_DRAW);
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, values, 0, length);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(shader, 'viewProjection'),
      false,
      frame.viewProjection,
    );
  }
  draw(material: Material, frame: Frame, list: readonly Instance[]) {
    const gl = this.gl,
      p = material.recipe.hologram?.strength ? this.holographic : this.foil;
    if (list.some((item) => item.finish === 'pool')) this.caustics.prepare(frame.time ?? 0);
    if (
      list.some(
        (item) => item.finish && item.finish !== 'regular' && (item.cardstock?.amount ?? 0) > 0,
      )
    )
      this.cardstock.prepare();
    const profile = list[0]?.printDots;
    const homogeneous =
      profile &&
      profile.amount > 0 &&
      list.every(
        (item) =>
          item.printDots?.amount === profile.amount &&
          (item.printDots.period ?? 5) === (profile.period ?? 5) &&
          (item.printDots.variation ?? 0.5) === (profile.variation ?? 0.5) &&
          (item.printDots.inset ?? 0) === (profile.inset ?? 0),
      );
    const printed = homogeneous
      ? this.printedInk.prepare(material.face, material.overlay, profile)
      : undefined;
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
      ['caustics', this.caustics.map],
      ['hologramMask', material.hologram?.texture ?? this.blank],
      ['cardstockMap', this.cardstock.map ?? this.blank],
    ] as const;
    bindings.forEach(([name, t], i) => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.uniform1i(gl.getUniformLocation(p, name), i);
    });
    const windows = material.recipe.artWindows.map(([x, y, w, h]) => [x, 1 - y - h, x + w, 1 - y]);
    const bounds = new Float32Array(32);
    windows.forEach((rect, i) => bounds.set(rect, i * 4));
    gl.uniform4fv(gl.getUniformLocation(p, 'artBounds[0]'), bounds);
    gl.uniform1f(gl.getUniformLocation(p, 'finishBase'), material.recipe.finishCoverageBase ?? 1);
    const hologram = material.recipe.hologram,
      [hx, hy, hw, hh] = hologram?.rect ?? [0, 0, 1, 1];
    gl.uniform4f(gl.getUniformLocation(p, 'hologramRect'), hx, 1 - hy - hh, hw, hh);
    gl.uniform2f(
      gl.getUniformLocation(p, 'hologramMaterial'),
      hologram?.strength ?? 0,
      (hologram?.seed ?? 0) / 0xffffffff,
    );
    const overlayFoil = material.recipe.overlayFoil;
    gl.uniform2f(
      gl.getUniformLocation(p, 'overlayFoil'),
      overlayFoil ? { gold: 1, silver: 3, prismatic: 2 }[overlayFoil.tone] : 0,
      overlayFoil?.strength ?? 0,
    );
    gl.uniform1f(gl.getUniformLocation(p, 'cornerRadius'), material.recipe.cornerRadius);
    gl.uniform1f(gl.getUniformLocation(p, 'aspect'), material.face.height / material.face.width);
    const pointer = frame.pointer ?? [0.5, 0.5];
    gl.uniform2f(gl.getUniformLocation(p, 'pointer'), pointer[0], 1 - pointer[1]);
    gl.uniform1f(gl.getUniformLocation(p, 'hasMask'), 1);
    gl.uniform1f(gl.getUniformLocation(p, 'satinCompact'), 1);
    gl.uniform1f(gl.getUniformLocation(p, 'satinHoverGain'), 0);
    gl.uniform1f(gl.getUniformLocation(p, 'surfaceTime'), frame.time ?? 0);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, list.length);
    this.draws++;
  }
  drawLayer(layer: SceneLayer, image: Texture, frame: Frame) {
    const gl = this.gl,
      p = this.image;
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
    gl.uniform1i(gl.getUniformLocation(p, 'face'), 0);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 1);
    this.draws++;
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.motion.clear();
    const gl = this.gl;
    gl.deleteProgram(this.foil);
    gl.deleteProgram(this.holographic);
    gl.deleteProgram(this.image);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.quad);
    gl.deleteBuffer(this.instances);
    gl.deleteTexture(this.blank);
    this.caustics.dispose();
    this.cardstock.dispose();
    this.printedInk.dispose();
  }
  get surfacePasses() {
    return this.caustics.passes + this.cardstock.passes + this.printedInk.passes;
  }
  get surfaceBytes() {
    return this.caustics.bytes + this.cardstock.bytes + this.printedInk.bytes;
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
