// Local diagnostic host for the public shader. Never imported by a game/runtime.
// blackGeneration=1 and rotation=0 must match FinishResources.printDots.
export function createDotExperiment(PRINT_DOTS_GLSL, source) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true });
  if (!gl) throw Error('WebGL2 unavailable for print experiment');
  const { width, height } = source;
  const replace = (text, before, after) => {
    if (text.split(before).length !== 2)
      throw Error('Print shader changed; review the experimental adapter');
    return text.replace(before, after);
  };
  let body = replace(
    PRINT_DOTS_GLSL,
    'flat in vec4 printDotsInfo;',
    'uniform vec4 printDotsInfo; uniform float blackGeneration; uniform float screenRotation;',
  );
  body = replace(
    body,
    'float k=1.-max(max(ink.r,ink.g),ink.b);',
    'float k=(1.-max(max(ink.r,ink.g),ink.b))*blackGeneration;',
  );
  body = replace(
    body,
    'float k=(1.-max',
    'p=mat2(cos(screenRotation),sin(screenRotation),-sin(screenRotation),cos(screenRotation))*p;\n float k=(1.-max',
  );
  const vertex = `#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
  const fragment = `#version 300 es
precision highp float;
in vec2 uv;out vec4 color;uniform sampler2D face;
vec3 previewInk(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 previewLinear(vec3 c){return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c));}
${body}
void main(){
 printFootprint=1./printDotsInfo.y;
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
  const compile = (type, text) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex),
    fs = compile(gl.FRAGMENT_SHADER, fragment),
    program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  const texture = () => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.SRGB8_ALPHA8,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  const input = texture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  const output = texture(),
    fbo = gl.createFramebuffer(),
    vao = gl.createVertexArray();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, output, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    throw Error('Experimental framebuffer incomplete');
  gl.viewport(0, 0, width, height);
  gl.disable(gl.BLEND);
  gl.disable(gl.DITHER);
  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, input);
  gl.uniform1i(gl.getUniformLocation(program, 'face'), 0);
  const info = gl.getUniformLocation(program, 'printDotsInfo'),
    black = gl.getUniformLocation(program, 'blackGeneration'),
    rotation = gl.getUniformLocation(program, 'screenRotation');
  return {
    updateSource(image) {
      if (image.width !== width || image.height !== height)
        throw Error('Print experiment source dimensions changed');
      gl.bindTexture(gl.TEXTURE_2D, input);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    },
    render(settings) {
      gl.uniform4fv(info, [
        settings.amount,
        settings.period,
        settings.variation,
        settings.inset ?? 0,
      ]);
      gl.uniform1f(black, settings.blackGeneration ?? 1);
      gl.uniform1f(rotation, ((settings.rotation ?? 0) * Math.PI) / 180);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const data = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      if (gl.getError() !== gl.NO_ERROR) throw Error('Experimental print draw failed');
      return { width, height, data };
    },
    dispose() {
      gl.deleteTexture(input);
      gl.deleteTexture(output);
      gl.deleteFramebuffer(fbo);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
