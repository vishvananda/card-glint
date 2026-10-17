const H = (r) => (Math.imul(r + 1, 1597334677) >>> 0) % 65536 / 65536;
function O(r) {
  if (r && (r.kind !== "heat" || !Number.isFinite(r.amount) || r.amount < 0 || r.amount > 0.02))
    throw RangeError("Heat deformation amount must be between 0 and 0.02");
}
function W(r, e) {
  return r?.amount ? e / (e + 4) / (1 + 2 * r.amount) : 1;
}
const N = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}`, R = `#version 300 es
precision highp float;precision highp int;precision highp usampler2D;
`, P = R + `uniform sampler2D source;uniform ivec2 size;uniform int mode;layout(location=0) out uvec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);if(mode==1)p.y=size.y-1-p.y;uvec3 rgb=uvec3(floor(texelFetch(source,p,0).rgb*255.+.5));
uint y=(54u*rgb.r+183u*rgb.g+19u*rgb.b)>>8u;color=uvec4(y,0,0,1);}`, D = R + `uniform usampler2D source;uniform ivec2 size;uniform int mode;uniform int threshold;
layout(location=0) out uvec4 color;
int at(ivec2 p){return int(texelFetch(source,p,0).r);}
void main(){ivec2 p=ivec2(gl_FragCoord.xy);int value=0;
if(mode==1){value=p.x==0||p.x==size.x-1?at(p):(at(p-ivec2(1,0))+2*at(p)+at(p+ivec2(1,0)))>>2;}
else if(mode==2){value=p.y==0||p.y==size.y-1?at(p):(at(p-ivec2(0,1))+2*at(p)+at(p+ivec2(0,1)))>>2;}
else if(p.x>0&&p.y>0&&p.x<size.x-1&&p.y<size.y-1){
int gx=-at(p+ivec2(-1,-1))+at(p+ivec2(1,-1))-2*at(p+ivec2(-1,0))+2*at(p+ivec2(1,0))-at(p+ivec2(-1,1))+at(p+ivec2(1,1));
int gy=-at(p+ivec2(-1,-1))-2*at(p+ivec2(0,-1))-at(p+ivec2(1,-1))+at(p+ivec2(-1,1))+2*at(p+ivec2(0,1))+at(p+ivec2(1,1));
value=clamp((((abs(gx)+abs(gy))>>2)-threshold)*8,0,255);}
color=uvec4(uint(value),0,0,1);}`, M = R + `uniform usampler2D strength;uniform usampler2D softened;out vec4 color;
void main(){ivec2 p=ivec2(gl_FragCoord.xy);uint a=min(255u,max(texelFetch(strength,p,0).r,texelFetch(softened,p,0).r)*2u);color=vec4(float(a)/255.,0.,0.,1.);}`;
function F(r, e, a = N) {
  const i = [], o = r.createProgram();
  try {
    for (const [n, t] of [
      [r.VERTEX_SHADER, a],
      [r.FRAGMENT_SHADER, e]
    ]) {
      const c = r.createShader(n);
      if (i.push(c), r.shaderSource(c, t), r.compileShader(c), !r.getShaderParameter(c, r.COMPILE_STATUS))
        throw Error(r.getShaderInfoLog(c));
      r.attachShader(o, c);
    }
    if (r.linkProgram(o), !r.getProgramParameter(o, r.LINK_STATUS)) throw Error(r.getProgramInfoLog(o));
    return o;
  } catch (n) {
    throw r.deleteProgram(o), n;
  } finally {
    for (const n of i) r.deleteShader(n);
  }
}
function T(r, e, a, i = r.R8, o = r.RED, n = r.UNSIGNED_BYTE) {
  const t = r.createTexture();
  r.bindTexture(r.TEXTURE_2D, t);
  const c = i === r.R8UI ? r.NEAREST : r.LINEAR;
  return r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, c), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, c), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.texImage2D(r.TEXTURE_2D, 0, i, e, a, 0, o, n, null), t;
}
class q {
  constructor(e) {
    this.gl = e, this.scratch = [], this.width = this.height = 0, this.disposed = !1;
    const a = performance.now();
    this.programs = [];
    try {
      for (const i of [P, D, M]) this.programs.push(F(e, i));
    } catch (i) {
      throw this.dispose(), i;
    }
    this.uniforms = this.programs.map(
      (i) => Object.fromEntries(
        ["source", "size", "mode", "threshold", "strength", "softened"].map((o) => [
          o,
          e.getUniformLocation(i, o)
        ])
      )
    ), this.framebuffer = e.createFramebuffer(), this.vao = e.createVertexArray(), this.compileMs = performance.now() - a;
  }
  allocate(e, a) {
    if (e === this.width && a === this.height) return;
    const i = this.gl;
    for (const o of this.scratch) i.deleteTexture(o);
    this.scratch = [], this.width = e, this.height = a, this.input = T(i, e, a, i.RGBA8, i.RGBA), this.scratch.push(this.input);
    for (let o = 0; o < 3; o++) this.scratch.push(T(i, e, a, i.R8UI, i.RED_INTEGER));
    if (i.bindFramebuffer(i.FRAMEBUFFER, this.framebuffer), i.framebufferTexture2D(
      i.FRAMEBUFFER,
      i.COLOR_ATTACHMENT0,
      i.TEXTURE_2D,
      this.scratch[1],
      0
    ), i.checkFramebufferStatus(i.FRAMEBUFFER) !== i.FRAMEBUFFER_COMPLETE)
      throw Error("GPU integer etching framebuffer is unavailable");
  }
  run(e, a, i, o = 20, n = null) {
    if (this.disposed) throw Error("GPU etcher disposed");
    if (!Number.isInteger(a) || !Number.isInteger(i) || a < 1 || i < 1 || a * i > 4194304 || !Number.isInteger(o) || o < 0 || o > 255)
      throw RangeError("Invalid etching dimensions or threshold");
    if (ArrayBuffer.isView(e) && e.byteLength !== a * i * 4)
      throw RangeError("Wrong RGBA input length");
    if (e === null && (a !== this.width || i !== this.height))
      throw Error("Resident input must be uploaded at this size before reuse");
    const t = this.gl;
    this.allocate(a, i), t.bindVertexArray(this.vao), t.disable(t.BLEND), t.disable(t.DEPTH_TEST), t.disable(t.SCISSOR_TEST), t.disable(t.DITHER), t.colorMask(!0, !0, !0, !0), t.viewport(0, 0, a, i), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, this.input), t.pixelStorei(t.UNPACK_ALIGNMENT, 1), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), e !== null && (this.flipped = typeof ImageBitmap < "u" && e instanceof ImageBitmap ? 1 : 0), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !ArrayBuffer.isView(e) && !this.flipped), ArrayBuffer.isView(e) ? t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, a, i, t.RGBA, t.UNSIGNED_BYTE, e) : e !== null && t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, t.RGBA, t.UNSIGNED_BYTE, e), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !1);
    const [c, s, p] = this.scratch.slice(1), v = n ?? T(t, a, i), f = (m, E, w, h = 0) => {
      t.useProgram(this.programs[m]);
      const d = this.uniforms[m];
      t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, E), t.uniform1i(d.source, 0), t.uniform2i(d.size, a, i), t.uniform1i(d.mode, h), t.uniform1i(d.threshold, o), t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, w, 0), t.drawArrays(t.TRIANGLES, 0, 3);
    };
    f(0, this.input, c, this.flipped ?? 0), f(1, c, s, 1), f(1, s, p, 2), f(1, p, c, 3), f(1, c, s, 1), f(1, s, p, 2);
    const l = this.uniforms[2];
    return t.useProgram(this.programs[2]), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, c), t.uniform1i(l.strength, 0), t.activeTexture(t.TEXTURE1), t.bindTexture(t.TEXTURE_2D, p), t.uniform1i(l.softened, 1), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, v, 0), t.drawArrays(t.TRIANGLES, 0, 3), t.bindFramebuffer(t.FRAMEBUFFER, null), t.bindVertexArray(null), v;
  }
  // Validation/measurement only. The real capture feeds the result directly to GL.
  read(e, a = this.width, i = this.height) {
    const o = this.gl, n = new Uint8Array(a * i * 4), t = new Uint8Array(a * i);
    o.bindFramebuffer(o.FRAMEBUFFER, this.framebuffer), o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, e, 0), o.readPixels(0, 0, a, i, o.RGBA, o.UNSIGNED_BYTE, n), o.bindFramebuffer(o.FRAMEBUFFER, null);
    for (let c = 0; c < t.length; c++) t[c] = n[c * 4];
    return t;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    const e = this.gl;
    for (const a of this.programs ?? []) e.deleteProgram(a);
    for (const a of this.scratch ?? []) e.deleteTexture(a);
    e.deleteFramebuffer(this.framebuffer ?? null), e.deleteVertexArray(this.vao ?? null);
  }
}
const z = `
flat in float rainFogDensity;
void rainCap(vec2 delta,float radius,float stretch,float strength,inout vec4 wet){
 vec2 q=delta/vec2(radius,radius*stretch);
 // Gravity-heavy teardrop profile: slightly narrower crown, fuller lower meniscus.
 q.x*=1.+clamp(q.y,-.45,.45)*.22;
 float q2=dot(q,q);
 if(q2>=1.)return;
 float cap=1.-q2;
 float cover=smoothstep(0.,.22,cap)*strength;
 // Surface-tension meniscus gradient bends the image; do not draw a bright circular outline.
 wet.xy+=q*(.32+.68*sqrt(cap))*cover;
 wet.z=max(wet.z,cover);
}
vec4 rainField(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),p=uv*metric*12.,cell=floor(p);
 vec4 wet=vec4(0.);float t=surfaceTime,seed=surfaceInfo.z*83.;
 vec2 beadShear=vec2(normal.x*.26+surfaceInfo.x*.42,normal.y*.10+surfaceInfo.y*.16);
 float streamShear=normal.x*.15+surfaceInfo.x*.22;
 // Fine stationary beads form and evaporate at independent times.
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 id=cell+vec2(float(x),float(y)),initial=surfaceHash2(id+seed);
  float cycle=9.+initial.y*11.,clock=t+initial.x*cycle,age=mod(clock,cycle);
  vec2 rnd=surfaceHash2(id+seed+floor(clock/cycle)*vec2(17.1,29.3));
  if(rnd.y>=.18){
   float fade=smoothstep(0.,1.,age)*(1.-smoothstep(cycle-2.,cycle,age));
   vec2 delta=p-(id+.18+rnd*.64);
   delta+=delta.y*beadShear;
   float radius=.085+.105*rnd.x*rnd.x;
   rainCap(delta,radius,1.+rnd.y*.22,fade,wet);
  }
 }
 // A sparser population drains down the glass, leaving narrow clear tracks.
 vec4 beads=wet;wet=vec4(0.);
 vec2 moving=uv*metric*7.;
 float column=floor(moving.x);
 for(int x=-1;x<=1;x++){
  float col=column+float(x),speed=.22+.12*surfaceHash(vec2(col,seed));
  vec2 stream=vec2(moving.x,moving.y+t*speed);
  float row=floor(stream.y);
  for(int y=-1;y<=1;y++){
   vec2 id=vec2(col,row+float(y)),rnd=surfaceHash2(id+seed+39.);
   if(rnd.y>=.58){
    vec2 delta=stream-(id+vec2(.2+rnd.x*.6,.2+rnd.y*.6));
    delta.x+=sin(delta.y*3.+rnd.y*6.)*.014+delta.y*streamShear;
    float radius=.075+.035*rnd.x;
    rainCap(delta,radius,1.28,1.,wet);
    float tx=delta.x/(radius*.48);
    float trail=exp(-tx*tx)*smoothstep(0.,.10,delta.y)*(1.-smoothstep(.10,.72,delta.y));
    wet.w=max(wet.w,trail);
   }
  }
 }
 wet.xy+=beads.xy*(1.-wet.w);
 wet.z=clamp(max(wet.z,beads.z*(1.-wet.w)),0.,1.);
 return wet;
}
vec3 rainGlass(vec2 uv,vec3 normal){
 vec4 wet=rainField(uv,normal);
 vec2 bend=-wet.xy*vec2(.020,.020/aspect);
 float clear=clamp(max(wet.z,wet.w*.88),0.,1.);
 float dry=1.-clear;
 // Frosted/fogged glass blurs the card where unwiped; droplets and drainage tracks wipe it crystal-clear.
 vec2 radius=vec2(.0056,.0056/aspect)*dry;
 vec2 baseUv=windowSceneUv(uv,normal)+bend;
 vec4 bounds=surfaceWindow(uv);
 vec3 linearInk=windowInk(baseUv,bounds)*mix(.40,.22,dry*.45);
 linearInk+=(windowInk(baseUv+vec2(radius.x,0.),bounds)+windowInk(baseUv-vec2(radius.x,0.),bounds)
  +windowInk(baseUv+vec2(0.,radius.y),bounds)+windowInk(baseUv-vec2(0.,radius.y),bounds))*.15;
 if(dry>.02){
  vec2 diag=radius*.55;
  linearInk+=(windowInk(baseUv+diag,bounds)+windowInk(baseUv-diag,bounds)
   +windowInk(baseUv+vec2(diag.x,-diag.y),bounds)+windowInk(baseUv+vec2(-diag.x,diag.y),bounds))*(.045*dry);
 }
 vec3 ink=previewInk(linearInk);

 // Physical card response behind the pane: artwork contours & frame lines catch light on tilt.
 vec2 cardUv=vec2(uv.x,1.-uv.y);
 vec2 ptr=foilPointer(normal);
 vec2 bg=foilSweepOffset(ptr);
 float rT=foilRadialDistance(cardUv,ptr);
 float spot=1.-smoothstep(.06,.88,rT);
 vec2 sampleUv=clamp(baseUv,bounds.xy,bounds.zw);
 float etched=etchMask(sampleUv),art=artWindow(sampleUv);
 float cardLines=etched*art+smoothstep(.74,.96,etched*(1.-art));
 float paneSweep=fract(dot(cardUv*vec2(.88,1.22),dir133)*1.65+(bg.x+bg.y*.3)*1.15);
 float paneBand=smoothstep(.10,.36,paneSweep)*(1.-smoothstep(.42,.68,paneSweep));
 vec3 cardSheen=vec3(.78,.90,.99)*cardLines*(.12+.24*spot+.18*paneBand)*(.45+.55*clear);
 ink=foilSheenBlend(ink,cardSheen);

 // Breath/weather condensation mist on unwiped glass: milky contrast softening + forward light scatter.
 float mist=surfaceNoise(uv*vec2(3.0,4.2)+surfaceInfo.z*11.);
 float fineMist=surfaceNoise(uv*vec2(9.5,13.5)-surfaceInfo.z*7.);
 float streak=surfaceNoise(uv*vec2(16.,2.2)+surfaceInfo.z*23.);
 float fog=clamp((.145+.058*mist+.032*fineMist+.025*streak)*dry,0.,.32)*rainFogDensity;
 vec3 mistColor=vec3(.73,.79,.83)+vec3(.11,.12,.13)*(spot*.65+paneBand*.35);
 ink=mix(ink,vec3(inkLuma(ink))*.82+.18,.16*dry*rainFogDensity);
 ink=mix(ink,mistColor,fog);

 // 3D droplet & rivulet optics: translucent water meniscus, lower-belly caustic focus, and sky glints.
 float trailRidge=wet.w*(1.-wet.w)*3.5;
 float rimMag=clamp(length(wet.xy)*1.35,0.,1.);
 vec3 dropNormal=normalize(normal+vec3(wet.xy*1.75+vec2(trailRidge*.16,0.),0.));
 float pinGlint=surfaceReflection(uv,dropNormal,48.)*wet.z;
 float crownGlow=surfaceReflection(uv,dropNormal,12.)*(wet.z*.80+trailRidge*.40);
 float sunDot=dot(wet.xy,vec2(.2614254,-.9652237));
 float bellyCaustic=max(0.,sunDot)*wet.z;
 float upperShade=max(0.,-sunDot)*wet.z*.035;
 float waterRim=rimMag*sqrt(rimMag)*wet.z*(.065+.075*spot);
 float paneReflect=(surfaceReflection(uv,normal,22.)*.024+paneBand*spot*.042)*(1.-wet.z*.35);

 vec3 lit=ink*(1.-upperShade+bellyCaustic*.24)
   +vec3(.82,.91,.99)*(waterRim+bellyCaustic*.075)
   +vec3(.94,.98,1.)*(pinGlint*.40+crownGlow*.16+paneReflect);
 return applyStudioGlare(lit,rT,.28);
}
`, C = `
vec3 heatMirageInk(vec2 uv,vec2 r,vec4 bounds){
 vec3 c=windowInk(uv,bounds)*.20;
 vec2 r1=r*.65,r2=r*.82;
 c+=(windowInk(uv+vec2(r1.x,0.),bounds)+windowInk(uv-vec2(r1.x,0.),bounds)
  +windowInk(uv+vec2(0.,r1.y),bounds)+windowInk(uv-vec2(0.,r1.y),bounds))*.12;
 c+=(windowInk(uv+vec2(r2.x,r2.y),bounds)+windowInk(uv+vec2(-r2.x,r2.y),bounds)
  +windowInk(uv+vec2(r2.x,-r2.y),bounds)+windowInk(uv+vec2(-r2.x,-r2.y),bounds))*.08;
 return previewInk(c);
}
vec3 heatHaze(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*29.;
 vec2 lean=normal.xy*.48+surfaceInfo.xy*.75;
 float grazing=1.+min(.65,length(normal.xy)*1.25);

 // Rising buoyant convective plumes + smooth thermal eddies (uv.y increases bottom to top).
 vec2 plumeCoord=vec2(uv.x*2.4-lean.x*uv.y,uv.y*4.2-t*1.10)+vec2(seed,seed*.61);
 float plume=surfaceNoise(plumeCoord);
 vec2 p=uv*vec2(1.8,18.)+vec2(seed-lean.x*1.1,-t*.92-lean.y*1.2);
 float air=surfaceNoise(p),fine=surfaceNoise(p*vec2(1.7,1.6)+vec2(t*.16+(plume-.5)*.8,-t*.68));

 // Schlieren refractive envelope: smooth rising mirage columns alternating with clearer air.
 float shear=abs(air-fine);
 float schlieren=clamp(.36+smoothstep(.20,.82,plume)*.58+shear*.65,0.,1.35)*grazing;
 float ribbon=sin(uv.y*46.-t*3.1+air*4.2+plume*2.8+uv.x*1.6);
 float microRibbon=cos(uv.y*82.-t*4.4+fine*4.5-uv.x*2.1);
 vec2 displacement=vec2(
  (ribbon*.0028+microRibbon*.0009+(fine-.5)*.0036)*schlieren,
  ((air-.5)*.00085+(plume-.5)*.00065)*schlieren
 );
 displacement.x+=normal.x*(air-.5)*.010+surfaceInfo.x*(plume-.5)*.008;
 displacement.y+=normal.y*(plume-.5)*.004;

 vec4 bounds=surfaceWindow(uv);
 float boil=clamp(smoothstep(.14,.80,plume)*.58+smoothstep(.04,.40,shear)*.52,0.,1.2);
 float mirageBlur=clamp((.32+boil*.82)*(.78+.22*(.5+.5*abs(ribbon)))*grazing,0.,1.45);
 vec2 blurRadius=vec2(.0014+.0032*mirageBlur,(.0015+.0036*mirageBlur)/aspect);
 vec3 ink=heatMirageInk(uv+displacement,blurRadius,bounds);

 // Subtle chromatic warmth/shimmer along rising thermal shear lines.
 float causticWave=(ribbon*.7+microRibbon*.3)*schlieren;
 ink=clamp(ink*vec3(1.+.022*causticWave,1.+.005*causticWave,1.-.018*causticWave),0.,1.);

 // Physical card tilt response: warm mirage glare + sunlit ember catch on artwork contours & frame.
 vec2 cardUv=vec2(uv.x,1.-uv.y);
 vec2 ptr=foilPointer(normal);
 vec2 bg=foilSweepOffset(ptr);
 float rT=foilRadialDistance(cardUv,ptr);
 float spot=1.-smoothstep(.06,.88,rT);
 vec2 sampleUv=clamp(uv+displacement*.5,bounds.xy,bounds.zw);
 float etched=etchMask(sampleUv),art=artWindow(sampleUv);
 float cardLines=etched*art+smoothstep(.74,.96,etched*(1.-art));
 float heatSweep=fract(dot(cardUv*vec2(.90,1.25),dir115)*1.75+(bg.x+bg.y*.35)*1.2);
 float mirageBand=smoothstep(.10,.36,heatSweep)*(1.-smoothstep(.42,.68,heatSweep));

 vec3 heatNormal=normalize(normal+vec3(displacement.x*36.,displacement.y*48.,0.));
 float reflection=surfaceReflection(uv+displacement,heatNormal,20.);
 float plumeRidge=smoothstep(.42,.78,plume)*(.5+.5*ribbon);
 float hearthGlow=(1.-smoothstep(0.,.68,uv.y))*(.30+.70*plume)*(.45+.55*spot);
 vec3 emberShine=mix(vec3(1.,.76,.42),vec3(1.,.92,.74),spot*.55+mirageBand*.45)
  *((.035+mirageBand*.068+plumeRidge*.048)*spot+hearthGlow*.045+cardLines*(.13+.25*spot+.16*mirageBand)+reflection*.080);

 vec3 res=foilSheenBlend(ink,emberShine);
 return applyStudioGlare(res,rT,.36);
}
`, S = `
const float waterPeriod=2.;
const float waterDepth=.65;
vec3 waterField(vec2 p,float t){
 // Non-orthogonal 9-wave quasi-periodic standing/counter-propagating spectrum
 // across varied scales (|w| = 5.1..10.8) so caustics undulate in place like a
 // bounded pool rather than drifting in one direction.
 const vec2 waves[9]=vec2[9](
   vec2(5.,1.),vec2(3.,5.),vec2(-2.,6.),
   vec2(-6.,3.),vec2(-7.,-2.),vec2(-3.,-7.),
   vec2(4.,-7.),vec2(9.,-4.),vec2(6.,9.)
 );
 const float heights[9]=float[9](.00372,.002976,.002604,.002294,.001922,.001798,.00155,.001054,.000868);
 vec3 field=vec3(0.);
 for(int i=0;i<9;i++){
  vec2 k=waves[i]*3.14159265359;float n=float(i);
  float kp=dot(k,p),freq=.42+n*.095;
  float phaseA=kp-t*freq+n*2.39996;
  float phaseB=kp+t*(freq*.86)+n*4.12345;
  float h=heights[i];
  field.xy-=k*(h*(sin(phaseA)+.85*sin(phaseB)));
  field.z+=h*(cos(phaseA)+.85*cos(phaseB));
 }
 return field;
}
`, L = `
uniform sampler2D caustics;
${S}
vec3 floorIrradiance(vec2 p){
 // A small receiving footprint softens subpixel ray folds / mesh boundaries,
 // like a light source with finite angular extent instead of an ideal point,
 // and yields the local caustic gradient for prismatic dispersion at zero extra taps.
 vec2 radius=1.25/vec2(textureSize(caustics,0));
 float c0=texture(caustics,p).r;
 float cxP=texture(caustics,p+vec2(radius.x,0.)).r,cxN=texture(caustics,p-vec2(radius.x,0.)).r;
 float cyP=texture(caustics,p+vec2(0.,radius.y)).r,cyN=texture(caustics,p-vec2(0.,radius.y)).r;
 float light=(c0*.4+(cxP+cxN+cyP+cyN)*.15)*8.;
 vec2 grad=vec2(cxP-cxN,cyP-cyN)*8.;
 return vec3(light,grad);
}
// Outward-radiating shallow-water wave train around a connected stroke capsule.
// Leaves calm water behind in the interior as the 2.5-cycle wave packet expands.
vec3 rippleCapsule(vec2 p,vec4 r,inout vec2 drag){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.25 || r.w<=0.)return vec3(0.);
 float code=r.w-1.;
 vec2 seg=(vec2(floor(code)/2047.,fract(code))-.5)*.24;
 vec2 metric=vec2(1.,aspect);
 vec2 aPt=r.xy-seg,s=(seg*2.)*metric,d=(p-aPt)*metric;
 float s2=dot(s,s);
 float h=clamp(dot(d,s)/max(s2,1e-6),0.,1.);
 vec2 delta=d-s*h;
 float r2=dot(delta,delta),eps=.014,rho=sqrt(r2+eps*eps);
 float segLen=sqrt(s2)*.5;
 float localAge=clamp(age+(.5-h)*min(.14,segLen*1.5),0.,2.25);
 float r0=.016+localAge*.23,w=.024+localAge*.009;
 float u=(rho-r0)/w;
 float dragEnv=exp(-r2*312.5-age*7.5);
 drag+=seg*(2.4*dragEnv);
 if(u<-2.8 || u>1.9)return vec3(0.);
 float innerR=max(.014,r0-w*1.85);
 float core=smoothstep(0.,1.,rho/innerR);
 // Both ends radiate: tapering the rear cap erases half of a near-stationary
 // tap as soon as a tiny pointer movement turns it into a short stroke.
 float amp=.85+min(.55,segLen*4.);
 float fade=exp(-localAge*1.05)*inversesqrt(1.+rho*9.)*smoothstep(0.,.02,localAge)*amp;
 float uShift=u+.45;
 float env=core*exp(-.36*uShift*uShift)*fade;
 float phi=3.10*u-.30;
 vec2 slope=-(delta/rho)*sin(phi)*env*.23;
 float curv=cos(phi)*env*.72;
 return vec3(slope,curv);
}
vec3 rippleWake(vec2 p,out vec2 drag){
 drag=vec2(0.);
 return rippleCapsule(p,ripple0,drag)+rippleCapsule(p,ripple1,drag)
  +rippleCapsule(p,ripple2,drag)+rippleCapsule(p,ripple3,drag);
}
const vec2 sunHorizontal=vec2(-.5822871,.8129832);
vec3 poolWater(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),slosh=surfaceInfo.xy;
 vec4 bounds=surfaceWindow(uv);
 vec2 extent=max((bounds.zw-bounds.xy)*metric,vec2(.01));
 vec2 basin=clamp((uv-bounds.xy)/(bounds.zw-bounds.xy),0.,1.);
 // The two lowest basin modes pile water against opposite walls and rebound.
 // Slosh is the host-motion-driven damped spring, not a sliding floor texture.
 vec2 phase=basin*3.14159265359;
 float swell=.20*dot(slosh,cos(phase));
 vec2 basinSlope=-.20*3.14159265359*slosh*sin(phase)/extent;
 vec2 origin=vec2(surfaceInfo.z,surfaceInfo.z*.618)*waterPeriod;
 vec2 drift=slosh*.35;
 vec2 p=uv*metric+origin+drift;
 vec3 wave=waterField(p,surfaceTime);
 // Propagate wakes in the flat surface metric. Ambient slopes still add to
 // lighting/refraction below, but must not bend a spreading wave into contours.
 vec2 wakeDrag;
 vec3 rip=rippleWake(uv,wakeDrag);
 vec2 slope=wave.xy+basinSlope+rip.xy;
 slope+=normal.xy*wave.z*3.2;
 // The painted basin floor and its caustics sit recessed below the water surface
 // and move together under tilt, slosh, and pointer-dragged water refraction.
 float wall=min(min(uv.x-bounds.x,bounds.z-uv.x),min(uv.y-bounds.y,bounds.w-uv.y));
 float wallContain=smoothstep(0.,.055,wall);
 vec2 baseUv=mix(uv,windowSceneUv(uv,normal),.72*wallContain);
 vec2 floorShift=((slope+rip.xy*1.20-slosh*.42)*vec2(.040,.040/aspect)*clamp(1.+swell*3.,.6,1.4)-wakeDrag*.28)*wallContain;
 vec2 floorUv=baseUv+floorShift;
 vec2 floorPoint=floorUv*metric+origin+drift*.25-wakeDrag*metric*1.5;
 float breath=surfaceTime*.45;
 vec2 causticWarp=vec2(
  surfaceNoise(floorPoint*1.35+vec2(sin(breath)*.35+1.7,cos(breath*.8)*.35+4.3))-.5,
  surfaceNoise(floorPoint*1.35+vec2(cos(breath*.9)*.35+8.1,sin(breath*.7)*.35+2.9))-.5
 )*.085;
 vec3 caustic=floorIrradiance((floorPoint+causticWarp)/waterPeriod);
 // Combine wake curvature with the sun-projected slope to shift the floor caustic
 // along the sun direction without a second 4-capsule rippleWake evaluation.
 float sunDot=dot(-rip.xy,sunHorizontal);
 float ripCaustic=rip.z*.88+sunDot*1.85;
 float causticFactor=clamp(1.+ripCaustic*1.15,.58,2.25);
 float flux=max(.04,caustic.x*causticFactor+max(0.,ripCaustic)*(.16+.28*caustic.x));
 vec3 ink=windowInk(floorUv,bounds);

 // Subtle prismatic dispersion along bright caustic ridges + local water depth tint.
 float fringe=clamp((caustic.y+caustic.z+ripCaustic*1.15)*.38,-.48,.48);
 vec3 prismTint=vec3(1.+fringe*.16,1.+abs(fringe)*.03,1.-fringe*.16);
 float depth=clamp(.5+swell*1.8+wave.z*14.-ripCaustic*.22,0.,1.);
 vec3 waterTint=mix(vec3(.80,.95,1.),vec3(.72,.91,1.),depth*.45)*prismTint;

 // Physical card details on the basin floor catch focused caustic rays and card tilt.
 vec2 cardUv=vec2(uv.x,1.-uv.y);
 vec2 ptr=foilPointer(normal);
 float rT=foilRadialDistance(cardUv,ptr);
 float spot=1.-smoothstep(.06,.86,rT);
 float tiltMag=clamp(length(normal.xy)*3.2,0.,1.);
 vec2 sampleUv=clamp(floorUv,bounds.xy,bounds.zw);
 float etched=etchMask(sampleUv),art=artWindow(sampleUv);
 float cardLines=etched*art+smoothstep(.74,.96,etched*(1.-art));
 float causticPeak=max(0.,flux-.85);
 vec3 submergedInk=ink+vec3(.62,.93,1.)*cardLines*(causticPeak*.16+tiltMag*spot*.26);

 // Apply irradiance in linear light: divergence dims the floor, focused rays
 // brighten it. Ambient light preserves readability in the darkest troughs.
 float sunSlope=clamp(sunDot*3.4,-.28,.38);
 vec3 floorLight=submergedInk*waterTint*(.28+.72*flux)*(1.+causticPeak*.10)*(1.+sunSlope*.32);

 vec3 waterNormal=normalize(normal+vec3(-slope*(.75+tiltMag*.18)-rip.xy*1.45,0.));
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 float nv=1.-max(0.,dot(view,waterNormal)),nv2=nv*nv;
 float fresnel=.02+.98*(nv2*nv2*nv);
 float reflection=surfaceReflection(uv,waterNormal,48.);
 float sunGlint=surfaceReflection(uv,waterNormal,135.);
 float waveFacet=clamp(dot(-(rip.xy+wave.xy*.35),sunHorizontal)*3.2,0.,1.);
 float wf2=waveFacet*waveFacet;
 float ripSpec=(wf2*waveFacet)*clamp(rip.z*1.35,0.,1.);
 vec3 reflected=vec3(.16,.31,.41)+vec3(.82,.95,1.)*(reflection*1.55+sunGlint*1.25+ripSpec*.85+.20*spot*tiltMag);
 float surfaceMix=clamp(fresnel+ripSpec*.032+tiltMag*spot*.07,0.,.52);
 vec3 combined=previewInk(mix(floorLight,reflected,surfaceMix));
 return applyStudioGlare(combined,rT,tiltMag*.26);
}
`, X = `
uniform float surfaceTime;
flat in vec4 surfaceInfo;
flat in vec4 ripple0;flat in vec4 ripple1;flat in vec4 ripple2;flat in vec4 ripple3;
float surfaceHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 surfaceHash2(vec2 p){return vec2(surfaceHash(p),surfaceHash(p+vec2(53.7,19.3)));}
float surfaceNoise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(surfaceHash(i),surfaceHash(i+vec2(1.,0.)),f.x),
 mix(surfaceHash(i+vec2(0.,1.)),surfaceHash(i+vec2(1.,1.)),f.x),f.y);
}
vec3 surfaceInk(vec2 uv){return texture(face,clamp(uv,vec2(.002),vec2(.998))).rgb;}
vec3 refractedInk(vec2 uv){return previewInk(surfaceInk(uv));}
// Project the turning pane onto a nearly stationary, front-facing scene.
// Shortest-arc rotation from +Z to the normal, with a restrained perspective
// distance in card widths. The center stays anchored: no uniform image pan.
// This is an approximation for host-owned cameras, not a world-space portal.
vec2 windowSceneUv(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),p=(uv-.5)*metric,tilt=vec2(normal.x,-normal.y);
 vec2 projected=p-tilt*dot(tilt,p)/max(.25,1.+normal.z);
 projected/=max(.65,1.+dot(tilt,p)/3.5);
 return .5+mix(p,projected,.9)/metric;
}
// In artwork-only mode, clamp to this art window so moving ink cannot pull the
// printed frame into the illustration. No overscan image or extra texture needed.
vec4 surfaceWindow(vec2 uv){
 if(finishBase<.5)for(int i=0;i<8;i++){
  vec4 b=artBounds[i];
  if(b.z>b.x && b.w>b.y && all(greaterThanEqual(uv,b.xy)) && all(lessThanEqual(uv,b.zw))){
   vec2 inset=min(.5/vec2(textureSize(face,0)),(b.zw-b.xy)*.25);
   return b+vec4(inset,-inset);
  }
 }
 return vec4(.002,.002,.998,.998);
}
vec3 windowInk(vec2 uv,vec4 bounds){return texture(face,clamp(uv,bounds.xy,bounds.zw)).rgb;}
// Small, linear-light cross filter. Radius can be anisotropic; no blur texture.
vec3 softenedInk(vec2 uv,vec2 radius,vec4 bounds){
 vec3 ink=windowInk(uv,bounds)*.4;
 ink+=(windowInk(uv+vec2(radius.x,0.),bounds)+windowInk(uv-vec2(radius.x,0.),bounds))*.15;
 ink+=(windowInk(uv+vec2(0.,radius.y),bounds)+windowInk(uv-vec2(0.,radius.y),bounds))*.15;
 return previewInk(ink);
}
vec3 softenedInk(vec2 uv,vec2 radius){return softenedInk(uv,radius,vec4(.002,.002,.998,.998));}
float surfaceReflection(vec2 uv,vec3 normal,float sharpness){
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 lamp=normalize(vec3(-.24,.32,1.));
 return pow(max(0.,dot(reflect(-view,normal),lamp)),sharpness);
}
${z}
${C}
${L}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`, V = `
float wearHash(vec2 p){return foilHash(p);}
float wearNoise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(wearHash(i),wearHash(i+vec2(1.,0.)),f.x),
 mix(wearHash(i+vec2(0.,1.)),wearHash(i+vec2(1.,1.)),f.x),f.y);
}
// Footprints come from continuous card UVs before clipping. Passing them in
// avoids nested derivatives when filtered noise also warps another octave.
float wearFilteredNoise(vec2 p,float frequency,float pixel){
 return mix(wearNoise(p),.5,smoothstep(.25,.85,pixel*frequency));
}
float wearCut(float lo,float hi,float value,float aa){
 return smoothstep(lo-aa,hi+aa,value);
}
// Jittered, finite scores with independent angles and lengths. No repeated
// parallel hatch field; antialias from continuous coordinates, not cell jumps.
float wearScores(vec2 p, float angle, float seed,vec2 pixel){
 float c=cos(angle),s=sin(angle);
 vec2 q=mat2(c,-s,s,c)*p*13.7+seed;
 vec2 cell=floor(q);
 float h=wearHash(cell);
 vec2 center=.22+.56*vec2(wearHash(cell+19.),wearHash(cell+43.));
 float direction=wearHash(cell+71.)*6.2831853;
 vec2 axis=vec2(cos(direction),sin(direction)),local=fract(q)-center;
 float halfLength=.025+.17*wearHash(cell+113.);
 float distance=length(local-axis*clamp(dot(local,axis),-halfLength,halfLength));
 float aa=max(length(pixel*13.7)*.48,.003);
 float coverage=(1.-smoothstep(.002,.002+aa,distance))*.004/max(.004,aa);
 return coverage*smoothstep(.72,.95,h);
}
vec3 wornSurface(vec2 uv,vec3 ink,vec3 coated,vec3 normal,vec3 view,float seed,float amount,float foil,vec2 pixel){
 vec2 p=uv*vec2(1.,aspect),offset=vec2(seed*37.,seed*19.);
 float footprint=max(pixel.x,pixel.y),alphaAA=clamp(footprint*40.,.012,.22);
 vec2 q=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 float edge=-(length(max(q,0.))+min(max(q.x,q.y),0.)-cornerRadius);
 // Extra abrasion where both edges meet; asymmetric, broad handling patches
 // break up the perimeter instead of drawing an even white outline.
 vec2 toEdge=min(uv,1.-uv)*vec2(1.,aspect);
 float corner=exp(-length(toEdge*vec2(1.,.85))*19.)
   *(.55+.9*wearHash(floor(uv*1.999)+offset));
 float patches=wearFilteredNoise(p*vec2(22.,17.)+offset,22.,footprint);
 // Warp the chip domain before combining incommensurate frequencies. A single
 // rotated lattice otherwise reads as diagonal stair-steps along straight cuts.
 vec2 warp=vec2(wearFilteredNoise(p*9.+offset,9.,footprint),wearFilteredNoise(p*11.-offset,11.,footprint))*2.5;
 vec2 grainP=p*vec2(92.,71.)+offset+warp;
 float chips=wearFilteredNoise(grainP,120.,footprint)*.7+wearFilteredNoise(grainP*1.67+23.,200.,footprint)*.3;
 float micro=wearFilteredNoise(p*vec2(440.,310.)+offset+warp*2.,490.,footprint);
 float grain=clamp((chips*.85+micro*.15-.5)*1.5+.5,0.,1.);
 float fibre=wearFilteredNoise(p*vec2(790.,240.)-offset,790.,footprint);
 float depth=(.0012+.008*patches*patches+corner*(.011+.016*patches))*(.18+.82*amount);
 // The leading edge wears in separate contact patches, not an even rim.
 // Two unrelated scales give intact runs between deep, ragged shuffle nicks.
 float top=smoothstep(.88,.985,uv.y);
 float coast=wearFilteredNoise(vec2(uv.x*6.7,.3)+offset,6.7,footprint);
 float nicks=wearFilteredNoise(vec2(uv.x*29.3,3.1)+offset*1.3,29.3,footprint);
 float contact=smoothstep(.34,.64,coast*.65+nicks*.35+corner*.3);
 float topContact=mix(1.,contact,top);
 depth*=mix(1.,.08+contact*2.4,top);
 float aa=max(length(pixel)*.55,.0006);
 float rim=1.-smoothstep(depth-aa,depth+aa,edge);
 rim*=wearCut(.19,.57,grain+corner*.28,alphaAA)*topContact;
 float fringe=(1.-smoothstep(depth-aa,depth+.019*amount+aa,edge))*wearCut(.61,.79,grain,alphaAA)*topContact;
 float paper=clamp(rim+fringe*.78,0.,1.)*smoothstep(.02,.3,amount);
 // Rubbed islands and pale flecks, concentrated near the shuffled borders.
 float handling=wearFilteredNoise(p*6.+offset,6.,footprint);
 float scuff=smoothstep(.39,.73,handling)*(.35+.65*patches)*amount;
 float nearEdge=exp(-edge*19.);
 float flecks=wearCut(.86-.12*amount,.95-.09*amount,grain,alphaAA)*smoothstep(.46,.68,patches)*amount;
 paper=max(paper,flecks*(.14+nearEdge*.66)*topContact);
 float scratches=wearScores(p,.16,seed*27.,pixel)
   +wearScores(p,-.48,seed*43.+7.,pixel)*.7
   +wearScores(p,1.42,seed*61.+31.,pixel)*.45;
 scratches=clamp(scratches*(.06+scuff+nearEdge*.4)*amount,0.,1.);
 // Subtle play dirt in the rough margin; intact ink keeps its original color.
 ink*=1.-nearEdge*patches*.11*amount;
 vec3 stock=mix(vec3(.64,.60,.51),vec3(.91,.89,.81),.35+.65*fibre);
 float rough=clamp(scuff*.92+scratches*.55,0.,1.);
 // Preserve the selected finish's current gloss/foil response in intact areas.
 // Scuffed varnish loses that sharp reflection rather than adding a new gloss.
 vec3 base=mix(coated,ink,rough*.88);
 float axis=satinStripAxis(uv,normal,view);
 float sharp=exp(-axis*axis*90.);
 float haze=exp(-axis*axis*32.);
 float diffuse=haze*scuff*.045;
 float scoreGlint=scratches*(.015+haze*.12+sharp*.19);
 base+=vec3(1.,.985,.95)*(diffuse+scoreGlint);
 base=mix(base,vec3(.79,.77,.69),scratches*.07);
 // Shallow ink loss reveals reflective metallized film on foil cards. It is
 // strongest along shuffled edges, with a few rubbed islands farther inside.
 float rub=wearCut(.57,.80,grain,alphaAA)*smoothstep(.35,.67,patches);
 float exposed=rub*(nearEdge*.9+scuff*.42)*amount*foil;
 float spot=1.-smoothstep(.05,.88,foilRadialDistance(vec2(uv.x,1.-uv.y),foilPointer(normal)));
 vec3 film=foilSheenBlend(vec3(.48,.50,.53),vec3(.94,.97,1.)*(.08+spot*.23+sharp*.52));
 base=mix(base,film,clamp(exposed,0.,1.));
 // Deep chips remove the film as well: matte fibres cover every reflection.
 return mix(base,stock,paper*.95);
}
`, b = (r, e) => Math.max(-e, Math.min(e, r));
function A(r, e) {
  const a = Math.min(2047, Math.max(0, Math.round((r / 0.24 + 0.5) * 2047))), i = Math.min(0.9995, Math.max(5e-4, e / 0.24 + 0.5));
  return 1 + a + i;
}
function k(r, e, a, i) {
  for (let o = 1; o <= 4; o++) {
    const n = (r.activeRipple + o) % 4, t = 4 + n * 4;
    if (!(r.data[t + 3] > 0 && e - r.data[t + 2] < 2.25))
      return r.activeRipple = n, r.segStart = [a, i], r.segTime = e, r.data.set([a, i, e, A(0, 0)], t), !0;
  }
  return !1;
}
class $ {
  states = /* @__PURE__ */ new Map();
  serial = 0;
  begin() {
    this.serial++;
  }
  end() {
    for (const [e, a] of this.states) a.seen !== this.serial && this.states.delete(e);
  }
  clear() {
    this.states.clear();
  }
  sample(e, a) {
    const i = e.finish ?? "regular";
    if (i !== "rain" && i !== "heat" && i !== "pool" && !e.deformation)
      return null;
    const o = a.time ?? 0, n = e.transform, t = e.normal ?? [0, 0, 1], c = [n[12], n[13], t[0], t[1]];
    let s = this.states.get(e.id);
    if (!s || o < s.time) {
      const f = new Float32Array(20);
      f.set([0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0], 4), s = {
        seen: this.serial,
        time: o,
        pose: c,
        velocity: [0, 0],
        data: f,
        activeRipple: 0,
        emitting: !1,
        segStart: [0.5, 0.5],
        segTime: -100,
        hoverUv: [0.5, 0.5],
        hovering: !1
      }, this.states.set(e.id, s);
    }
    s.seen = this.serial;
    const p = Math.min(0.05, o - s.time), v = a.hover?.instance === e.id ? a.hover : void 0;
    if (v) {
      const f = v.uv[0], l = 1 - v.uv[1];
      if (!s.hovering)
        s.hoverUv = [f, l], s.emitting = k(s, o, f, l);
      else {
        const m = f - s.hoverUv[0], E = l - s.hoverUv[1], w = Math.hypot(m, E);
        s.hoverUv = [f, l], p > 0 && w > 0 && (s.velocity[0] = b(s.velocity[0] + b(m * 1.8, 0.28), 1), s.velocity[1] = b(s.velocity[1] + b(E * 1.8, 0.28), 1));
        const h = (f - s.segStart[0]) * 0.5, d = (l - s.segStart[1]) * 0.5, x = Math.hypot(h, d) * 2, g = o - s.segTime;
        if (w > 5e-4)
          if (!s.emitting || x > 0.11 || g > 0.13 && x > 0.02)
            s.emitting = k(s, o, f, l);
          else {
            const U = s.segStart[0] + h, I = s.segStart[1] + d, _ = s.segTime + g * 0.45;
            s.data.set([U, I, _, A(h, d)], 4 + s.activeRipple * 4);
          }
      }
    }
    if (v || (s.emitting = !1), p > 0) {
      const f = [Math.hypot(n[0], n[1], n[2]), Math.hypot(n[4], n[5], n[6])];
      for (let l = 0; l < 2; l++) {
        const m = (c[l] - s.pose[l]) / Math.max(0.05, f[l]) + (c[l + 2] - s.pose[l + 2]) * 0.7, E = b(m, 0.22), w = Math.max(1, Math.ceil(p / (1 / 120))), h = p / w;
        for (let d = 0; d < w; d++) {
          let x = s.data[l], g = s.velocity[l] + (d === 0 ? E * 4.5 : 0);
          g += (-26 * x - 4.8 * g) * h, x = b(x + g * h, 0.35), s.data[l] = x, s.velocity[l] = b(g, 1.4);
        }
      }
    }
    return s.hovering = !!v, s.time = o, s.pose = c, s.data;
  }
}
const u = 192, y = 512, B = `#version 300 es
precision highp float;
uniform float time;
out vec2 incoming;
${S}
void main(){
 // Include a skirt around the periodic tile: rays from outside can land inside.
 vec2 p=vec2(gl_VertexID%${u + 1},gl_VertexID/${u + 1})/${u}.*2.4-.2;
 vec3 wave=waterField(p,time);
 vec3 normal=normalize(vec3(-wave.xy,1.));
 vec3 ray=refract(vec3(0.,0.,-1.),normal,1./1.333);
 vec2 floorPoint=p+ray.xy/(-ray.z)*(waterDepth+wave.z);
 incoming=p;
 gl_Position=vec4(floorPoint/waterPeriod*2.-1.,0.,1.);
}`, G = `#version 300 es
precision highp float;
in vec2 incoming;out vec4 color;
void main(){
 // Each fragment receives the area of its source light footprint. Overlapping
 // folds accumulate by additive blending; expanded footprints become darker.
 vec2 dx=dFdx(incoming),dy=dFdy(incoming);
 float flux=abs(dx.x*dy.y-dx.y*dy.x)*${(y / 2) ** 2}.;
 color=vec4(min(flux,8.)/8.,0.,0.,1.);
}`;
class Y {
  constructor(e) {
    if (this.gl = e, this.shader = F(e, G, B), this.clock = e.getUniformLocation(this.shader, "time"), this.map = T(e, y, y), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), this.framebuffer = e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.map, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE)
      throw e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteProgram(this.shader), Error("Caustics framebuffer is incomplete");
    this.vao = e.createVertexArray(), this.indices = e.createBuffer(), e.bindVertexArray(this.vao), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indices);
    const a = new Uint16Array(u * u * 6);
    for (let i = 0; i < u; i++)
      for (let o = 0; o < u; o++) {
        const n = i * (u + 1) + o, t = n + u + 1;
        a.set([n, n + 1, t, t, n + 1, t + 1], (i * u + o) * 6);
      }
    e.bufferData(e.ELEMENT_ARRAY_BUFFER, a, e.STATIC_DRAW), e.bindVertexArray(null), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  gl;
  map;
  bytes = y * y + u * u * 6 * 2;
  passes = 0;
  shader;
  framebuffer;
  vao;
  indices;
  clock;
  time = NaN;
  prepare(e) {
    if (e = Math.fround(e), e === this.time) return;
    const a = this.gl;
    a.bindFramebuffer(a.FRAMEBUFFER, this.framebuffer), a.viewport(0, 0, y, y), a.disable(a.DEPTH_TEST), a.disable(a.CULL_FACE), a.disable(a.SCISSOR_TEST), a.colorMask(!0, !0, !0, !0), a.clearColor(0, 0, 0, 0), a.clear(a.COLOR_BUFFER_BIT), a.enable(a.BLEND), a.blendEquation(a.FUNC_ADD), a.blendFunc(a.ONE, a.ONE), a.useProgram(this.shader), a.uniform1f(this.clock, e), a.bindVertexArray(this.vao), a.drawElements(a.TRIANGLES, u * u * 6, a.UNSIGNED_SHORT, 0), a.bindFramebuffer(a.FRAMEBUFFER, null), a.viewport(0, 0, a.drawingBufferWidth, a.drawingBufferHeight), a.disable(a.BLEND), this.time = e, this.passes++;
  }
  dispose() {
    const e = this.gl;
    e.deleteTexture(this.map), e.deleteFramebuffer(this.framebuffer), e.deleteVertexArray(this.vao), e.deleteBuffer(this.indices), e.deleteProgram(this.shader);
  }
}
export {
  Y as C,
  q as G,
  X as S,
  V as W,
  $ as a,
  W as e,
  F as p,
  H as s,
  T as t,
  O as v
};
