import { program, texture } from './etcher.js';
import { PRINT_DOTS_GLSL } from './print-dots.js';
import type { Texture } from './textures.js';
import type { Instance } from '../types.js';

const vertex = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const fragment = `#version 300 es
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${PRINT_DOTS_GLSL.replace('flat in vec4 printDotsInfo;', 'uniform vec4 printDotsInfo;')}
void main(){
 printFootprint=1./printDotsInfo.y;
 // Fine screens need pixel-area coverage before they enter the mip chain.
 // Sample only the ink screen: averaging source texels would soften lettering.
 // This pass is cached per printing/settings, never rerun for pointer motion.
 if(printDotsInfo.y<4.){
  vec4 source=texture(face,uv);vec3 ink=previewInk(source.rgb),sum=vec3(0.);
  vec2 pixel=1./vec2(textureSize(face,0));
  for(int y=0;y<2;y++)for(int x=0;x<2;x++){
   vec2 offset=(vec2(float(x),float(y))-.5)*.5;
   sum+=previewLinear(printDotInk(ink,uv+offset*pixel));
  }
  color=vec4(sum*.25,source.a);
 }else color=printFace(uv);
}`;
const limit = 16 * 1024 * 1024;
const sizeOf = (texture: Texture) => {
  let w = texture.width,
    h = texture.height,
    bytes = 0;
  while (true) {
    bytes += w * h * 4;
    if (w === 1 && h === 1) return bytes;
    w = Math.max(1, Math.floor(w / 2));
    h = Math.max(1, Math.floor(h / 2));
  }
};
type Entry = {
  source: Texture;
  overlay?: Texture;
  settings: string;
  face: Texture;
  top?: Texture;
  bytes: number;
};

/** Small context-owned LRU of finished printing. Only homogeneous instance
 * groups use it; mixed settings keep the procedural per-instance path. All
 * texture work is once per printing revision/settings, never per tilt frame. */
export class PrintedInk {
  private shader: WebGLProgram;
  private framebuffer: WebGLFramebuffer;
  private vao: WebGLVertexArrayObject;
  private entries: Entry[] = [];
  bytes = 0;
  passes = 0;
  constructor(private gl: WebGL2RenderingContext) {
    this.shader = program(gl, fragment, vertex)!;
    this.framebuffer = gl.createFramebuffer()!;
    this.vao = gl.createVertexArray()!;
  }
  prepare(
    source: Texture,
    overlay: Texture | undefined,
    profile: NonNullable<Instance['printDots']>,
  ) {
    const values = [
        profile.amount,
        profile.period ?? 5,
        profile.variation ?? 0.5,
        profile.inset ?? 0,
      ],
      settings = values.join(':');
    const index = this.entries.findIndex(
      (e) =>
        e.source.texture === source.texture &&
        e.overlay?.texture === overlay?.texture &&
        e.settings === settings,
    );
    if (index >= 0) {
      const entry = this.entries.splice(index, 1)[0]!;
      this.entries.push(entry);
      return entry;
    }
    const bytes = sizeOf(source) + (overlay ? sizeOf(overlay) : 0);
    if (bytes > limit) return undefined;
    while (this.bytes + bytes > limit) {
      const old = this.entries.shift()!;
      this.release(old);
    }
    let face: Texture | undefined, top: Texture | undefined;
    try {
      face = this.paint(source, values);
      if (overlay) top = this.paint(overlay, values);
      const entry = { source, overlay, settings, face, top, bytes };
      this.entries.push(entry);
      this.bytes += bytes;
      return entry;
    } catch (error) {
      this.gl.deleteTexture(face?.texture ?? null);
      this.gl.deleteTexture(top?.texture ?? null);
      throw error;
    } finally {
      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindVertexArray(null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  }
  private paint(source: Texture, values: number[]): Texture {
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
