import { program, texture } from './etcher.js';

const width = 732,
  height = 1020;
const vertex = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const fragment = `#version 300 es
precision highp float;precision highp int;
in vec2 uv;out vec4 color;
float stockNoise(vec2 p){uvec2 q=uvec2(ivec2(p));uint n=q.x*1664525u+q.y*1013904223u+2246822519u;n^=n>>16;n*=2246822519u;n^=n>>13;return float(n)/4294967295.;}
vec2 relief(vec2 p){
 vec2 i=floor(p),f=fract(p),s=f*f*(3.-2.*f),ds=6.*f*(1.-f);
 float a=stockNoise(i),b=stockNoise(i+vec2(1,0)),c=stockNoise(i+vec2(0,1)),d=stockNoise(i+1.);
 return vec2(mix(b-a,d-c,s.y)*ds.x,mix(c-a,d-b,s.x)*ds.y);
}
void main(){
 mat2 rotation=mat2(.83,.55776,-.55776,.83);
 vec2 p=rotation*(uv*vec2(732.,1020.));
 vec2 slope=transpose(rotation)*(relief(p/2.4)*.82+relief(p/6.7+19.3)*.18);
 // Two 16-bit slopes in a portable RGBA8 target. Decoding is affine, so
 // interpolation and mip averaging remain valid across byte boundaries.
 vec2 encoded=floor(clamp(slope/4.4+.5,0.,1.)*65535.+.5);
 vec2 high=floor(encoded/256.);
 color=vec4(high.x,encoded.x-high.x*256.,high.y,encoded.y-high.y*256.)/255.;
}`;

/** A fixed, card-local coating relief map shared by all instances in a context.
 * Compile at context creation; allocate/generate once on first textured finish.
 * No per-frame noise evaluation, uploads, copies or CPU pixel readbacks. */
export class Cardstock {
  readonly width = width;
  readonly height = height;
  map?: WebGLTexture;
  bytes = 0;
  passes = 0;
  private shader: WebGLProgram;
  constructor(private gl: WebGL2RenderingContext) {
    this.shader = program(gl, fragment, vertex)!;
  }
  prepare() {
    if (this.map) return;
    const gl = this.gl;
    const map = texture(gl, width, height, gl.RGBA8, gl.RGBA)!;
    const framebuffer = gl.createFramebuffer()!;
    const vao = gl.createVertexArray()!;
    try {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, map, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw Error('Cardstock framebuffer is incomplete');
      gl.viewport(0, 0, width, height);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.SCISSOR_TEST);
      gl.disable(gl.BLEND);
      gl.disable(gl.DITHER);
      gl.colorMask(true, true, true, true);
      gl.useProgram(this.shader);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindTexture(gl.TEXTURE_2D, map);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      let w = width,
        h = height;
      while (true) {
        this.bytes += w * h * 4;
        if (w === 1 && h === 1) break;
        w = Math.max(1, Math.floor(w / 2));
        h = Math.max(1, Math.floor(h / 2));
      }
      this.map = map;
      this.passes++;
    } catch (error) {
      gl.deleteTexture(map);
      throw error;
    } finally {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindVertexArray(null);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteVertexArray(vao);
    }
  }
  dispose() {
    this.gl.deleteTexture(this.map ?? null);
    this.gl.deleteProgram(this.shader);
  }
}

export const CARDSTOCK_GLSL = `
#ifndef GLINT_LIGHTING_POINTER
#define GLINT_LIGHTING_POINTER pointer
#endif
#ifdef GLINT_HOST_SAMPLING
#ifndef GLINT_POINTER_BINDING
#define GLINT_POINTER_BINDING
flat in vec2 pointer;
#endif
#endif
uniform sampler2D cardstockMap;
flat in float cardstockAmount;
float cardstockResponse(vec2 uv){
 if(cardstockAmount<=0.)return 1.;
 vec4 encoded=texture(cardstockMap,uv);
 vec2 slope=(vec2(dot(encoded.rg,vec2(256.,1.)),dot(encoded.ba,vec2(256.,1.)))/257.-.5)*4.4;
 vec2 direction=vec2(.65,.76)+(vec2(GLINT_LIGHTING_POINTER.x,1.-GLINT_LIGHTING_POINTER.y)-.5)*1.6;
 vec2 light=direction/max(length(direction),.1);
 return max(0.,1.+cardstockAmount*2.38*dot(slope,light));
}
vec3 cardstockGloss(vec2 uv,vec3 ink,vec3 reflected){
 if(cardstockAmount<=0.)return reflected;
 // Relief redistributes the finish response without reducing its overall gain.
 return ink+(reflected-ink)*cardstockResponse(uv);
}`;
