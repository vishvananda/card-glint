import type { FinishQuality } from '../finish-quality.js';
import { program, programAsync, texture } from './etcher.js';
import { withFinishTextureState } from '../finish-texture-state.js';
import { PRINT_DOTS_GLSL } from './print-dots.js';
import { textureMipBytes, type Texture } from './textures.js';
import type { Instance, Rect } from '../types.js';
import { printArtBounds, printDotValues, printDotPeriodForWidth } from '../print-settings.js';

const vertex = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const fragment = `#version 300 es
#define PRINT_DOT_ART_WINDOWS
#define GLINT_PRINT_FACE(uv) textureLod(face,uv,0.)
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${PRINT_DOTS_GLSL.replace('flat in vec4 printDotsInfo;', 'uniform vec4 printDotsInfo;')}
void main(){
 printFootprint=1./printDotPeriodTexels();
 // Fine screens need pixel-area coverage before they enter the mip chain.
 // Sample only the ink screen: averaging source texels would soften lettering.
 // This pass is cached per printing/settings, never rerun for pointer motion.
 if(printDotPeriodTexels()<4.){
  vec4 source=textureLod(face,uv,0.);vec3 ink=previewInk(source.rgb),sum=vec3(0.);
  vec2 pixel=1./vec2(textureSize(face,0));
  for(int y=0;y<2;y++)for(int x=0;x<2;x++){
   vec2 offset=(vec2(float(x),float(y))-.5)*.5;
   sum+=previewLinear(printDotInk(ink,uv+offset*pixel));
  }
  color=vec4(sum*.25,source.a);
 }else color=printFace(uv);
}`;
const limit = 16 * 1024 * 1024;
const sizeOf = (texture: Texture) => textureMipBytes(texture.width, texture.height);
const invisibleAtTier = (texture: Texture, period: number) =>
  1 / printDotPeriodForWidth(texture.width, period) >= 0.9;
type Entry = {
  source: Texture;
  overlay?: Texture;
  settings: string;
  face: Texture;
  top?: Texture;
  bytes: number;
  lastFrame: number;
};

/** Small context-owned LRU of finished printing. Only homogeneous instance
 * groups use it; mixed settings keep the procedural per-instance path. All
 * texture work is once per printing revision/settings, never per tilt frame. */
export class PrintedInk {
  private shader: WebGLProgram;
  private framebuffer: WebGLFramebuffer;
  private vao: WebGLVertexArrayObject;
  private entries: Entry[] = [];
  private invisible = new WeakMap<WebGLTexture, Entry>();
  private frame = 0;
  bytes = 0;
  passes = 0;
  static async create(
    gl: WebGL2RenderingContext,
    signal?: AbortSignal,
    quality: FinishQuality = 'full',
  ): Promise<PrintedInk> {
    // The pressure/mixed-instance analytic filter is also a bounded software-GPU
    // option: one coverage tap instead of nine times three spread taps. Cached
    // color, registration, period, art exclusion and alpha semantics stay intact.
    const source =
      quality === 'reduced'
        ? fragment.replace('#version 300 es', '#version 300 es\n#define GLINT_PRINT_PROCEDURAL')
        : fragment;
    const shader = await programAsync(gl, source, vertex, signal);
    try {
      signal?.throwIfAborted();
      if (gl.isContextLost()) throw Error('Context lost during printing preparation');
      return withFinishTextureState(gl, () => new PrintedInk(gl, shader));
    } catch (error) {
      gl.deleteProgram(shader);
      throw error;
    }
  }
  constructor(
    private gl: WebGL2RenderingContext,
    shader?: WebGLProgram,
  ) {
    this.shader = shader ?? program(gl, fragment, vertex)!;
    const framebuffer = gl.createFramebuffer();
    const vao = gl.createVertexArray();
    if (!framebuffer || !vao) {
      gl.deleteFramebuffer(framebuffer);
      gl.deleteVertexArray(vao);
      if (!shader) gl.deleteProgram(this.shader);
      throw Error('Printing resources unavailable');
    }
    this.framebuffer = framebuffer;
    this.vao = vao;
  }
  /** Protect the active working set. Overflow uses the existing procedural path
   * instead of evicting and rebuilding the same printing on every frame. */
  beginFrame() {
    this.frame++;
  }
  prepare(
    source: Texture,
    overlay: Texture | undefined,
    profile: NonNullable<Instance['printDots']>,
    windows: readonly Rect[] = [],
  ) {
    const values = printDotValues(profile);
    // The screen shader is identically inactive below this physical sampling
    // threshold. Borrow the existing printing: no duplicate texture, pass or
    // procedural per-frame fallback for dense small-card scenes.
    if (
      source.mipmapped &&
      (!overlay || overlay.mipmapped) &&
      (values[0]! <= 0 ||
        (invisibleAtTier(source, values[1]!) && (!overlay || invisibleAtTier(overlay, values[1]!))))
    ) {
      const previous = this.invisible.get(source.texture);
      if (previous && previous.overlay?.texture === overlay?.texture) return previous;
      const entry: Entry = {
        source,
        overlay,
        settings: 'invisible',
        face: source,
        top: overlay,
        bytes: 0,
        lastFrame: this.frame,
      };
      this.invisible.set(source.texture, entry);
      return entry;
    }
    const artwork = profile.artwork !== false,
      settings = JSON.stringify([values, artwork, artwork ? [] : windows]);
    const index = this.entries.findIndex(
      (e) =>
        e.source.texture === source.texture &&
        e.overlay?.texture === overlay?.texture &&
        e.settings === settings,
    );
    if (index >= 0) {
      const entry = this.entries.splice(index, 1)[0]!;
      entry.lastFrame = this.frame;
      this.entries.push(entry);
      return entry;
    }
    const bytes = sizeOf(source) + (overlay ? sizeOf(overlay) : 0);
    if (bytes > limit) return undefined;
    while (this.bytes + bytes > limit) {
      const victim = this.entries.findIndex(
        (e) => this.frame === 0 || e.lastFrame < this.frame - 1,
      );
      if (victim < 0) return undefined;
      const old = this.entries.splice(victim, 1)[0]!;
      this.release(old);
    }
    let face: Texture | undefined, top: Texture | undefined;
    try {
      face = this.paint(source, values, windows, artwork);
      if (overlay) top = this.paint(overlay, values, windows, artwork);
      const entry = { source, overlay, settings, face, top, bytes, lastFrame: this.frame };
      this.entries.push(entry);
      this.bytes += bytes;
      return entry;
    } catch (error) {
      this.gl.deleteTexture(face?.texture ?? null);
      this.gl.deleteTexture(top?.texture ?? null);
      throw error;
    }
  }
  /** Uncached native preparation. The caller owns and deletes the returned texture. */
  paint(source: Texture, values: number[], windows: readonly Rect[] = [], artwork = true): Texture {
    const gl = this.gl,
      w = source.width,
      h = source.height;
    // A renderable sRGB target preserves dark-ink precision. WebGL performs the
    // linear-to-sRGB store and normal decode when the material samples it.
    const map = texture(gl, w, h, gl.SRGB8_ALPHA8, gl.RGBA)!;
    try {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, map, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw Error('Printed ink framebuffer is incomplete');
      gl.viewport(0, 0, w, h);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.SCISSOR_TEST);
      gl.disable(gl.BLEND);
      gl.disable(gl.DITHER);
      gl.colorMask(true, true, true, true);
      gl.useProgram(this.shader);
      gl.bindVertexArray(this.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, source.texture);
      gl.uniform1i(gl.getUniformLocation(this.shader, 'face'), 0);
      gl.uniform4fv(gl.getUniformLocation(this.shader, 'printDotsInfo'), values);
      gl.uniform4fv(
        gl.getUniformLocation(this.shader, 'printArtBounds[0]'),
        printArtBounds(windows),
      );
      gl.uniform1f(gl.getUniformLocation(this.shader, 'printArtwork'), artwork ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.passes++;
      gl.bindTexture(gl.TEXTURE_2D, map);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      return { texture: map, width: w, height: h };
    } catch (error) {
      gl.deleteTexture(map);
      throw error;
    } finally {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindVertexArray(null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  }
  private release(entry: Entry) {
    this.gl.deleteTexture(entry.face.texture);
    this.gl.deleteTexture(entry.top?.texture ?? null);
    this.bytes -= entry.bytes;
  }
  dispose() {
    for (const entry of this.entries) this.release(entry);
    this.entries = [];
    this.gl.deleteProgram(this.shader);
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteVertexArray(this.vao);
  }
}
