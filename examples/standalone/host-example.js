import { FinishTextures, foilShader } from './finish.js';
import { hostProgram } from './host-program.js';
const canvas = document.getElementById('card');
const status = document.getElementById('status');
const finish = document.getElementById('finish');
const printing = document.getElementById('printing');
const gl = canvas.getContext('webgl2', { alpha: false });
if (!gl) throw Error('WebGL2 required');
let scope,
  pointer = [0.5, 0.5];
const vertex = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
function fragment(kind) {
  return `#version 300 es
#define GLINT_FINISH_KIND ${kind}
#define texture2D texture
precision highp float;
in vec2 uv;out vec4 color;
uniform sampler2D face;uniform sampler2D mask;
uniform float hasMask;uniform vec2 pointer;uniform float aspect;uniform vec4 artBounds[8];
${foilShader({ liquid: false })}
void main(){color=vec4(previewFoil(uv,vec3(0.,0.,1.),vec3(0.,0.,1.)),texture(face,uv).a);}`;
}
function paint() {
  const current = scope,
    program = current?.programs.get(Number(finish.value));
  if (!current?.ready || !program || gl.isContextLost()) return;
  gl.useProgram(program);
  gl.bindVertexArray(current.vao);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, printing.checked ? current.printing.texture : current.source);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, current.source); // hasMask=0 disables etching.
  const uniform = (name) => gl.getUniformLocation(program, name);
  gl.uniform1i(uniform('face'), 0);
  gl.uniform1i(uniform('mask'), 1);
  gl.uniform1f(uniform('previewKind'), Number(finish.value));
  gl.uniform1f(uniform('aspect'), 510 / 366);
  gl.uniform2fv(uniform('pointer'), pointer);
  gl.uniform4fv(uniform('artBounds[0]'), new Float32Array(32));
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
function release() {
  const current = scope;
  scope = undefined;
  if (!current) return;
  current.abort.abort();
  current.finishes.dispose();
  if (!gl.isContextLost()) {
    for (const program of current.programs.values()) gl.deleteProgram(program);
    gl.deleteTexture(current.printing?.texture); // caller-owned
    gl.deleteTexture(current.source);
    gl.deleteVertexArray(current.vao);
  }
}
async function start() {
  release();
  status.textContent = 'Preparing…';
  const current = {
    abort: new AbortController(),
    finishes: new FinishTextures(gl),
    programs: new Map(),
    ready: false,
  };
  scope = current;
  const signal = current.abort.signal;
  try {
    // Shared helper readiness precedes every synchronous preparation call.
    await current.finishes.ready(signal);
    // Only three material variants; compile outside drawing and export paths.
    for (const kind of [2, 4, 8]) {
      const program = await hostProgram(gl, vertex, fragment(kind), signal);
      if (scope !== current) {
        if (!gl.isContextLost()) gl.deleteProgram(program);
        return;
      }
      current.programs.set(kind, program);
    }
    const art = document.createElement('canvas');
    art.width = 366;
    art.height = 510;
    const ctx = art.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 366, 510);
    gradient.addColorStop(0, '#243f63');
    gradient.addColorStop(1, '#c06c47');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 366, 510);
    ctx.strokeStyle = '#edd3a0';
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, 336, 480);
    ctx.fillStyle = '#edd3a0';
    ctx.font = '26px serif';
    ctx.fillText('A host-owned card', 30, 60);
    current.source = gl.createTexture();
    if (!current.source) throw Error('Texture allocation failed');
    gl.bindTexture(gl.TEXTURE_2D, current.source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, art);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Bounded cache: one immutable source and one prepared printing texture.
    // Change source/settings/SDK revision -> delete and rebuild this entry.
    current.printing = current.finishes.printDots({
      texture: current.source,
      width: 366,
      height: 510,
    });
    current.vao = gl.createVertexArray();
    if (!current.vao) throw Error('Vertex array allocation failed');
    current.ready = true;
    paint();
    status.textContent = 'Ready';
  } catch (error) {
    if (scope !== current) return;
    release();
    if (error.name !== 'AbortError') {
      status.textContent = error.message;
      throw error;
    }
  }
}
finish.onchange = printing.onchange = paint;
canvas.onpointermove = (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer = [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  paint();
};
canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  release();
  status.textContent = 'Context lost; waiting for restoration…';
});
canvas.addEventListener('webglcontextrestored', () => {
  window.hostReady = start();
});
window.addEventListener('pagehide', release, { once: true });
window.hostReady = start();
