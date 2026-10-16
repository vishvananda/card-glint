import { coverImage } from '../image-cover.js';
import { program, texture } from './etcher.js';
import type { TextureStore, Texture } from './textures.js';
import type { EdgeSource, Lease, Rect, Size } from '../types.js';
const fragment = `#version 300 es
precision highp float;
uniform sampler2D inputMask;uniform vec2 size;uniform vec4 cover;uniform vec4 clip;
uniform vec4 crop;uniform float alphaChannel;uniform float angle;
out vec4 color;
void main(){
 vec2 pixel=vec2(gl_FragCoord.x,size.y-gl_FragCoord.y);vec2 uv=pixel/size;
 vec2 amount=max(vec2(0.),min(pixel+.5,(clip.xy+clip.zw)*size)-max(pixel-.5,clip.xy*size));
 vec2 local=(uv-cover.xy)/cover.zw;
 if(angle<0.)local=vec2(1.-local.y,local.x);else if(angle>0.)local=vec2(local.y,1.-local.x);
 vec2 source=local*crop.zw+crop.xy;
 vec4 sampleValue=texture(inputMask,vec2(source.x,1.-source.y));
 float a=mix(sampleValue.r,sampleValue.a,alphaChannel)*amount.x*amount.y;
 color=vec4(a,0.,0.,a);
}`;

export class MaskComposer {
  private shader: WebGLProgram;
  private fbo: WebGLFramebuffer;
  private vao: WebGLVertexArrayObject;
  private disposed = false;
  builds = 0;
  constructor(private textures: TextureStore) {
    const gl = textures.gl;
    this.shader = program(gl, fragment)!;
    this.fbo = gl.createFramebuffer()!;
    this.vao = gl.createVertexArray()!;
  }
  compose(
    key: string,
    size: Size,
    inputs: readonly { value: Texture; spec: EdgeSource }[],
    stamp?: Texture,
  ): Lease<Texture> {
    const old = this.textures.store.acquire(key);
    if (old) return old;
    const gl = this.textures.gl,
      [w, h] = size;
    return this.textures.store.create(key, w * h, () => {
      const result = texture(gl, w, h)!;
      try {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, result, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
          throw Error('Mask framebuffer unavailable');
        gl.bindVertexArray(this.vao);
        gl.viewport(0, 0, w, h);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.SCISSOR_TEST);
        gl.disable(gl.DITHER);
        gl.colorMask(true, true, true, true);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.shader);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        const draw = (
          image: Texture,
          cover: Rect,
          clip: Rect,
          crop: Rect,
          alpha: boolean,
          rotation = 0,
        ) => {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, image.texture);
          gl.uniform1i(gl.getUniformLocation(this.shader, 'inputMask'), 0);
          gl.uniform2f(gl.getUniformLocation(this.shader, 'size'), w, h);
          gl.uniform4fv(gl.getUniformLocation(this.shader, 'cover'), cover);
          gl.uniform4fv(gl.getUniformLocation(this.shader, 'clip'), clip);
          gl.uniform4fv(gl.getUniformLocation(this.shader, 'crop'), crop);
          gl.uniform1f(gl.getUniformLocation(this.shader, 'alphaChannel'), alpha ? 1 : 0);
          gl.uniform1f(gl.getUniformLocation(this.shader, 'angle'), rotation);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        if (stamp) draw(stamp, [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1], true);
        for (const { value, spec } of inputs) {
          const [x, y, width, height] = spec.destination,
            rotation = spec.rotation ?? 0;
          const iw = value.width * spec.crop[2],
            ih = value.height * spec.crop[3];
          let bounds: Rect;
          if (!spec.fit) {
            const scale = Math.max(
              (width * w) / (rotation ? ih : iw),
              (height * h) / (rotation ? iw : ih),
            );
            const sw = ((rotation ? ih : iw) * scale) / w,
              sh = ((rotation ? iw : ih) * scale) / h;
            bounds = [x + (width - sw) / 2, y + (height - sh) / 2, sw, sh];
          } else {
            const sourcePoint = spec.fit.focalPoint ?? [0.5, 0.5];
            const fit = {
              ...spec.fit,
              focalPoint: (rotation === 90
                ? [1 - sourcePoint[1]!, sourcePoint[0]!]
                : rotation === -90
                  ? [sourcePoint[1]!, 1 - sourcePoint[0]!]
                  : sourcePoint) as readonly [number, number],
            };
            const cover = coverImage(
              rotation ? ih : iw,
              rotation ? iw : ih,
              [x * w, y * h, width * w, height * h],
              fit,
            );
            bounds = [cover[0] / w, cover[1] / h, cover[2] / w, cover[3] / h];
          }
          draw(value, bounds, spec.clip, spec.crop, !!spec.importedMask, rotation);
        }
        this.builds++;
      } catch (error) {
        gl.deleteTexture(result);
        throw error;
      } finally {
        gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindVertexArray(null);
      }
      return { texture: result, width: w, height: h };
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    const gl = this.textures.gl;
    gl.deleteProgram(this.shader);
    gl.deleteFramebuffer(this.fbo);
    gl.deleteVertexArray(this.vao);
  }
}
