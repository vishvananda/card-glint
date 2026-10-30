// GPU-resident version of the production integer Sobel recipe. WebGL2 only.
// This object owns scratch textures/programs in the caller's context. It changes
// GL bindings/state; callers must establish their draw state after invoking it.
const vertex = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`;
const head = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`;
const gray =
  head +
  `uniform sampler2D source;uniform ivec2 size;uniform int mode;layout(location=0) out uvec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);if(mode==1)p.y=size.y-1-p.y;uvec3 rgb=uvec3(floor(texelFetch(source,p,0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`;
const filter =
  head +
  `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`;
const combine =
  head +
  `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;

function link(gl, fragment, vs) {
  const shaders = [],
    p = gl.createProgram();
  if (!p) throw Error('WebGL program allocation failed');
  try {
    for (const [kind, source] of [
      [gl.VERTEX_SHADER, vs],
      [gl.FRAGMENT_SHADER, fragment],
    ]) {
      const shader = gl.createShader(kind);
      if (!shader) throw Error('WebGL shader allocation failed');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(p, shader);
    }
    gl.linkProgram(p);
    return { p, shaders };
  } catch (error) {
    gl.deleteProgram(p);
    throw error;
  } finally {
    for (const shader of shaders) gl.deleteShader(shader);
  }
}
function linked(gl, p, shaders) {
  if (gl.getProgramParameter(p, gl.LINK_STATUS)) return p;
  const details = shaders.map((shader) => gl.getShaderInfoLog(shader)).filter(Boolean);
  throw Error([gl.getProgramInfoLog(p), ...details].filter(Boolean).join('\n'));
}
export function program(gl, fragment, vs = vertex) {
  const { p, shaders } = link(gl, fragment, vs);
  try {
    return linked(gl, p, shaders);
  } catch (error) {
    gl.deleteProgram(p);
    throw error;
  }
}
/**
 * @param {AbortSignal} [signal]
 * @returns {Promise<WebGLProgram>}
 */
export function programAsync(gl, fragment, vs = vertex, signal) {
  if (signal?.aborted) return Promise.reject(signal.reason);
  if (gl.isContextLost()) return Promise.reject(Error('Graphics context is lost'));
  return new Promise((resolve, reject) => {
    const extension = gl.getExtension('KHR_parallel_shader_compile');
    let pending, timer;
    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      gl.canvas.removeEventListener('webglcontextlost', lost);
    };
    const fail = (error) => {
      cleanup();
      if (pending && !gl.isContextLost()) gl.deleteProgram(pending.p);
      pending = undefined;
      reject(error);
    };
    const abort = () => fail(signal.reason);
    const lost = () => fail(new DOMException('Graphics context is lost', 'AbortError'));
    const poll = () => {
      if (signal?.aborted) return abort();
      if (gl.isContextLost()) return lost();
      try {
        if (extension && !gl.getProgramParameter(pending.p, extension.COMPLETION_STATUS_KHR)) {
          timer = setTimeout(poll, 8);
          return;
        }
        const shader = linked(gl, pending.p, pending.shaders);
        cleanup();
        pending = undefined;
        resolve(shader);
      } catch (error) {
        fail(error);
      }
    };
    signal?.addEventListener('abort', abort, { once: true });
    gl.canvas.addEventListener('webglcontextlost', lost, { once: true });
    try {
      pending = link(gl, fragment, vs);
      timer = setTimeout(poll, 0);
    } catch (error) {
      fail(error);
    }
  });
}
export function texture(gl, w, h, internal = gl.R8, format = gl.RED, type = gl.UNSIGNED_BYTE) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  const filtering = internal === gl.R8UI ? gl.NEAREST : gl.LINEAR;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
  return t;
}
export class GpuEtcher {
  constructor(gl) {
    this.gl = gl;
    this.scratch = [];
    this.width = this.height = 0;
    this.disposed = false;
    const start = performance.now();
    this.programs = [];
    try {
      for (const f of [gray, filter, combine]) this.programs.push(program(gl, f));
    } catch (error) {
      this.dispose();
      throw error;
    }
    this.uniforms = this.programs.map((p) =>
      Object.fromEntries(
        ['source', 'size', 'mode', 'threshold', 'strength', 'softened'].map((n) => [
          n,
          gl.getUniformLocation(p, n),
        ]),
      ),
    );
    this.framebuffer = gl.createFramebuffer();
    this.vao = gl.createVertexArray();
    this.compileMs = performance.now() - start;
  }
  allocate(w, h) {
    if (w === this.width && h === this.height) return;
    const gl = this.gl;
    for (const t of this.scratch) gl.deleteTexture(t);
    this.scratch = [];
    this.width = w;
    this.height = h;
    this.input = texture(gl, w, h, gl.RGBA8, gl.RGBA);
    this.scratch.push(this.input);
    for (let i = 0; i < 3; i++) this.scratch.push(texture(gl, w, h, gl.R8UI, gl.RED_INTEGER));
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.scratch[1],
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
      throw Error('GPU integer etching framebuffer is unavailable');
  }
  run(source, w, h, threshold = 20, output = null) {
    if (this.disposed) throw Error('GPU etcher disposed');
    if (
      !Number.isInteger(w) ||
      !Number.isInteger(h) ||
      w < 1 ||
      h < 1 ||
      w * h > 4194304 ||
      !Number.isInteger(threshold) ||
      threshold < 0 ||
      threshold > 255
    )
      throw RangeError('Invalid etching dimensions or threshold');
    if (ArrayBuffer.isView(source) && source.byteLength !== w * h * 4)
      throw RangeError('Wrong RGBA input length');
    if (source === null && (w !== this.width || h !== this.height))
      throw Error('Resident input must be uploaded at this size before reuse');
    const gl = this.gl;
    this.allocate(w, h);
    gl.bindVertexArray(this.vao);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.DITHER);
    gl.colorMask(true, true, true, true);
    gl.viewport(0, 0, w, h);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.input);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    // Numeric fixtures are already bottom-up; DOM artwork needs the normal flip.
    // Per the WebGL spec, UNPACK_FLIP_Y_WEBGL is ignored for ImageBitmap sources,
    // so ImageBitmap inputs are flipped vertically in the grayscale shader pass.
    if (source !== null) {
      this.flipped = typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap ? 1 : 0;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(source) && !this.flipped);
    if (ArrayBuffer.isView(source))
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, source);
    else if (source !== null)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    const [a, b, c] = this.scratch.slice(1),
      result = output ?? texture(gl, w, h);
    const pass = (index, input, target, mode = 0) => {
      gl.useProgram(this.programs[index]);
      const u = this.uniforms[index];
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, input);
      gl.uniform1i(u.source, 0);
      gl.uniform2i(u.size, w, h);
      gl.uniform1i(u.mode, mode);
      gl.uniform1i(u.threshold, threshold);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    pass(0, this.input, a, this.flipped ?? 0);
    pass(1, a, b, 1);
    pass(1, b, c, 2);
    pass(1, c, a, 3);
    pass(1, a, b, 1);
    pass(1, b, c, 2);
    const u = this.uniforms[2];
    gl.useProgram(this.programs[2]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, a);
    gl.uniform1i(u.strength, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, c);
    gl.uniform1i(u.softened, 1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, result, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindVertexArray(null);
    return result;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(texture, w = this.width, h = this.height) {
    const gl = this.gl,
      rgba = new Uint8Array(w * h * 4),
      alpha = new Uint8Array(w * h);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    for (let i = 0; i < alpha.length; i++) alpha[i] = rgba[i * 4];
    return alpha;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    const gl = this.gl;
    for (const p of this.programs ?? []) gl.deleteProgram(p);
    for (const t of this.scratch ?? []) gl.deleteTexture(t);
    gl.deleteFramebuffer(this.framebuffer ?? null);
    gl.deleteVertexArray(this.vao ?? null);
  }
}

// Poll the driver timer asynchronously. No CPU readback is needed for this metric.
export async function timedGpu(gl, operation) {
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const query = ext ? gl.createQuery() : null;
  if (query) gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
  const start = performance.now();
  let value;
  try {
    value = operation();
  } catch (error) {
    if (query) {
      gl.endQuery(ext.TIME_ELAPSED_EXT);
      gl.deleteQuery(query);
    }
    throw error;
  }
  if (query) gl.endQuery(ext.TIME_ELAPSED_EXT);
  const submitMs = performance.now() - start;
  gl.flush();
  if (!query) return { value, submitMs, gpuMs: null, timer: 'unavailable' };
  try {
    const deadline = performance.now() + 10000;
    while (!gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
      if (gl.isContextLost()) throw Error('Graphics context lost during timing');
      if (performance.now() > deadline) return { value, submitMs, gpuMs: null, timer: 'timeout' };
      await new Promise((r) => setTimeout(r, 4));
    }
    if (gl.getParameter(ext.GPU_DISJOINT_EXT))
      return { value, submitMs, gpuMs: null, timer: 'disjoint' };
    return {
      value,
      submitMs,
      gpuMs: gl.getQueryParameter(query, gl.QUERY_RESULT) / 1e6,
      timer: 'valid',
    };
  } finally {
    gl.deleteQuery(query);
  }
}
