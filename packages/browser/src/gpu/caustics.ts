import { program, texture } from './etcher.js';
import { WATER_WAVES_GLSL } from './water-waves.js';

const cells = 192,
  size = 512;
const vertex = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${WATER_WAVES_GLSL}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${cells + 1},gl_VertexID/${cells + 1})/${cells}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`;
const fragment = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(size / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;

/** One bounded light map per context, shared by all water instances at a time.
 * Programs/grid/target live until context loss. No per-frame upload or readback. */
export class Caustics {
  readonly map: WebGLTexture;
  readonly bytes = size * size + cells * cells * 6 * 2;
  passes = 0;
  private shader: WebGLProgram;
  private framebuffer: WebGLFramebuffer;
  private vao: WebGLVertexArrayObject;
  private indices: WebGLBuffer;
  private clock: WebGLUniformLocation | null;
  private time = NaN;
  constructor(private gl: WebGL2RenderingContext) {
    this.shader = program(gl, fragment, vertex)!;
    this.clock = gl.getUniformLocation(this.shader, 'time');
    this.map = texture(gl, size, size)!;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    this.framebuffer = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.map, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.deleteTexture(this.map);
      gl.deleteFramebuffer(this.framebuffer);
      gl.deleteProgram(this.shader);
      throw Error('Caustics framebuffer is incomplete');
    }
    this.vao = gl.createVertexArray()!;
    this.indices = gl.createBuffer()!;
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    const indices = new Uint16Array(cells * cells * 6);
    for (let y = 0; y < cells; y++)
      for (let x = 0; x < cells; x++) {
        const a = y * (cells + 1) + x,
          b = a + cells + 1;
        indices.set([a, a + 1, b, b, a + 1, b + 1], (y * cells + x) * 6);
      }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  prepare(time: number) {
    time = Math.fround(time);
    if (time === this.time) return;
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, size, size);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.SCISSOR_TEST);
    gl.colorMask(true, true, true, true);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(this.shader);
    gl.uniform1f(this.clock, time);
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, cells * cells * 6, gl.UNSIGNED_SHORT, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.disable(gl.BLEND);
    this.time = time;
    this.passes++;
  }
  dispose() {
    const gl = this.gl;
    gl.deleteTexture(this.map);
    gl.deleteFramebuffer(this.framebuffer);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.indices);
    gl.deleteProgram(this.shader);
  }
}
