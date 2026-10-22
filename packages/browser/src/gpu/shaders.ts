import { foilShader } from './foil-preview-shader.js';
import { SURFACE_GLSL } from './surface-shader.js';
import { DEFORMATION_GLSL } from './deformation-shader.js';
import { HOLOGRAM_GLSL } from './hologram-shader.js';
import { WORN_GLSL } from './worn-shader.js';
import { CARDSTOCK_GLSL } from './cardstock.js';
import { PRINT_DOTS_GLSL } from './print-dots.js';
export const vertex = `#version 300 es
layout(location=0) in vec2 position;
layout(location=1) in mat4 model;
layout(location=5) in vec3 instanceNormal;
layout(location=6) in float instanceFinish;
layout(location=7) in vec4 instanceSurface;
layout(location=8) in vec4 instanceRipple0;layout(location=9) in vec4 instanceRipple1;
layout(location=10) in vec4 instanceRipple2;layout(location=11) in vec4 instanceRipple3;
layout(location=12) in vec2 instanceWear;
layout(location=13) in float instanceCardstock;
flat out float cardstockAmount;
layout(location=14) in vec4 instancePrintDots;
flat out vec4 printDotsInfo;
layout(location=15) in vec2 instanceRainFog;
flat out float printArtwork;
flat out float rainFogDensity;
uniform mat4 viewProjection;
out vec2 v_uv;out vec3 v_normal;flat out float previewKind;flat out vec2 wearInfo;
out vec3 studioPosition;flat out vec4 studioCamera;flat out float studioVirtual;
flat out vec4 surfaceInfo;flat out vec4 ripple0;flat out vec4 ripple1;flat out vec4 ripple2;flat out vec4 ripple3;
void main(){
vec2 pad=instanceSurface.w*vec2(1.,.18);
vec2 local=position*(1.+2.*pad)-pad;
v_uv=local;v_normal=instanceNormal;previewKind=instanceFinish;wearInfo=instanceWear;
cardstockAmount=instanceCardstock;printDotsInfo=instancePrintDots;
rainFogDensity=instanceRainFog.x;printArtwork=instanceRainFog.y;
surfaceInfo=instanceSurface;ripple0=instanceRipple0;ripple1=instanceRipple1;ripple2=instanceRipple2;ripple3=instanceRipple3;
vec4 world=model*vec4(local,0.,1.);
studioPosition=world.xyz/world.w;
studioVirtual=viewProjection==mat4(1.)?1.:0.;
vec4 eye=inverse(viewProjection)*vec4(0.,0.,1.,0.);
studioCamera=abs(eye.w)>.00001?vec4(eye.xyz/eye.w,1.):vec4(normalize(eye.xyz),0.);
gl_Position=viewProjection*world;}`;
const foil = foilShader()
  .replace('uniform float previewKind;', 'flat in float previewKind;')
  .replaceAll('texture2D(mask,uv).r*hasMask', 'edgeCoverage(uv)')
  .replaceAll('texture2D(face,', 'printFace(');
export const fragment = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;flat in vec2 wearInfo;
in vec3 studioPosition;flat in vec4 studioCamera;flat in float studioVirtual;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 overlayFoil;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
vec4 printFace(vec2 uv);
${CARDSTOCK_GLSL}
${foil}
#ifdef PROCEDURAL_PRINT
#define GLINT_PRINT_PROCEDURAL
#define PRINT_DOT_ART_WINDOWS
#define PRINT_DOT_ART_INSTANCE
${PRINT_DOTS_GLSL}
#else
vec4 printFace(vec2 uv){return texture(face,uv);}
#endif
${SURFACE_GLSL.replaceAll('texture(face,', 'printFace(')}
${DEFORMATION_GLSL}
${WORN_GLSL}
#ifdef LOCAL_HOLOGRAM
${HOLOGRAM_GLSL}
#endif
void main(){
 vec2 source=cardSource(v_uv,surfaceTime,surfaceInfo.wz);
 vec2 uv=vec2(source.x,1.-source.y);
#ifdef PROCEDURAL_PRINT
 printFootprint=printDotFootprint(uv);
#endif
#ifdef LOCAL_HOLOGRAM
 // Evaluate derivatives before any per-fragment return/discard. The outer
 // material condition is uniform across the draw, including instanced cards.
 float grainFilter=1.;
 if(hologramMaterial.x>0.) {
   vec2 local=(uv-hologramRect.xy)/hologramRect.zw;
   grainFilter=exp(-fwidth(dot(local,vec2(24.,8.)))*2.);
 }
#endif
 // Filter the sheet grooves before silhouette rejection, like local patches.
 if(previewKind==9.)holofoilGrainFilter=exp(-fwidth(dot(uv,vec2(24.,8.)))*2.);
 // Derive wear filtering from continuous UVs before silhouette rejection.
 vec2 wearPixel=vec2(0.);
 if(wearInfo.x>0.)wearPixel=fwidth(uv*vec2(1.,aspect));
 vec2 corner=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 if(length(max(corner,0.))+min(max(corner.x,corner.y),0.)-cornerRadius>0.)discard;
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 if(studioLighting>.5)view=studioVirtual>.5?studioCardView(uv,normalize(v_normal)):normalize(studioCamera.xyz-studioPosition*studioCamera.w);
 vec3 optical;
 if(previewKind==8. && studioVirtual<.5 && studioLighting>.5)optical=studioGloss(previewInk(printFace(uv).rgb),normalize(v_normal),normalize(studioCamera.xyz-studioPosition*studioCamera.w),studioPosition);
 else optical=previewKind>=5. && previewKind<8. ? animatedSurface(uv,normalize(v_normal)) : previewFoil(uv,normalize(v_normal),view);
 vec3 shaded=previewLinear(optical);
 vec3 base=printFace(uv).rgb;
 if(cardstockAmount>0. && previewKind>.5)shaded=previewLinear(cardstockGloss(uv,previewInk(base),previewInk(shaded)));
 if(wearInfo.x>0.) {
   float foilSubstrate=max(step(.5,previewKind)*(1.-step(4.5,previewKind)),step(8.5,previewKind));
   shaded=previewLinear(wornSurface(uv,previewInk(base),previewInk(shaded),normalize(v_normal),view,wearInfo.y,wearInfo.x,foilSubstrate,wearPixel));
 }
 vec4 c=texture(coverage,uv),top=texture(overlay,uv);
 vec3 under=mix(base,shaded,max(finishBase,c.r)*(1.-c.g));
 // Printing stays at the original UV, above all optical effects. The same
 // satin response as the conventional finishes supplies an optional reflection.
 vec3 printing=top.rgb;
#ifdef PROCEDURAL_PRINT
 if(printDotsInfo.x>0. && top.a>0.) {
  printUseLocalSource=true;
  printing=previewLinear(printDotInk(previewInk(top.rgb),uv));
  printUseLocalSource=false;
 }
#endif
 if(overlayFoil.y>0. && top.a>0.) {
   // Gold printing is metallic even without an etch mask. The zero-metal
   // satin branch deliberately mutes its strip and made this foil nearly flat.
   float metal=overlayFoil.x==1. ? .35 : 0.;
   vec3 reflected=previewLinear(satin(uv,previewInk(printing),normalize(v_normal),view,overlayFoil.x,metal));
   printing=mix(printing,reflected,overlayFoil.y);
 }
 vec3 printed=previewInk(mix(under,printing,top.a));
#ifdef LOCAL_HOLOGRAM
 out_color=vec4(localHologram(uv,printed,normalize(v_normal),view,grainFilter),1.);
#else
 out_color=vec4(printed,1.);
#endif
}`;
export const hologramFragment = fragment.replace(
  '#version 300 es',
  '#version 300 es\n#define LOCAL_HOLOGRAM',
);
export const proceduralFragment = fragment.replace(
  '#version 300 es',
  '#version 300 es\n#define PROCEDURAL_PRINT',
);
export const proceduralHologramFragment = hologramFragment.replace(
  '#version 300 es',
  '#version 300 es\n#define PROCEDURAL_PRINT',
);
export const imageFragment = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`;
