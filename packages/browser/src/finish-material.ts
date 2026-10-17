import { foilShader } from './gpu/foil-preview-shader.js';
import { SURFACE_GLSL } from './gpu/surface-shader.js';
import { WORN_GLSL } from './gpu/worn-shader.js';
import { GpuEtcher, program } from './gpu/etcher.js';
import { Caustics } from './gpu/caustics.js';

export function modernSurfaceShader(): string {
  const foil = foilShader()
    .replaceAll('texture2D(face,', 'finishFace(')
    .replaceAll('texture2D(mask,', 'finishMask(');
  const surface = SURFACE_GLSL.replaceAll('flat in ', 'uniform ').replaceAll(
    'texture(face,',
    'finishFace(',
  );
  return `${foil}
${surface}
${WORN_GLSL}

vec3 modernSurface(vec2 uv,vec3 normal,vec3 view,vec2 wear,vec2 pixel) {
  vec3 color=previewKind>=5. && previewKind<8. ? animatedSurface(uv,normal) : previewFoil(uv,normal,view);
  vec3 base=finishFace(uv).rgb;
  if(hasPrinting>0.){
    vec4 top=finishPrinting(uv);
    vec3 under=mix(base,previewLinear(color),finishCoverage(uv));
    vec3 printing=top.rgb;
    if(top.a>0.)printing=mix(printing,previewLinear(satin(uv,previewInk(printing),normal,view,2.,0.)),.75);
    color=previewInk(mix(under,printing,top.a));
    base=mix(base,top.rgb,top.a);
  }
  if(wear.x>0.)color=wornSurface(uv,previewInk(base),color,normal,view,wear.y,wear.x,
    step(.5,previewKind)*(1.-step(4.5,previewKind)),pixel);
  return color;
}`;
}

const copyFragment = `#version 300 es
precision highp float;
uniform sampler2D source;
uniform vec2 size;
out vec4 color;
void main(){color=vec4(texture(source,gl_FragCoord.xy/size).rrr,1.);}`;

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
  };
  private restored = () => {
    this.etcher = undefined;
    this.pool = undefined;
    this.copy = undefined;
    this.vao = undefined;
    this.poolTime = NaN;
  };
  private draw(map: WebGLTexture, width: number, height: number, target: HTMLCanvasElement) {
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
    this.canvas.removeEventListener('webglcontextlost', this.lost);
    this.canvas.removeEventListener('webglcontextrestored', this.restored);
    this.etcher?.dispose();
    this.pool?.dispose();
    this.gl.deleteProgram(this.copy ?? null);
    this.gl.deleteVertexArray(this.vao ?? null);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.canvas.width = this.canvas.height = 1;
  }
}
