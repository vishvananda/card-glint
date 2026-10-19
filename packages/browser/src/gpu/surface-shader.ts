import { RAIN_GLSL } from './rain-shader.js';
import { HEAT_GLSL } from './heat-shader.js';
import { POOL_GLSL } from './pool-shader.js';

/** Analytic optical surfaces. No animated textures, readbacks or simulation FBOs. */
export const SURFACE_GLSL = `
#ifdef GLINT_HOST_SAMPLING
#define GLINT_SURFACE_FACE(uv) glintSampleFace(uv)
#define GLINT_SURFACE_SIZE facePixelSize
vec4 glintSurfaceClamp(){vec2 t=1./facePixelSize;return vec4(t,1.-t);}
#else
#define GLINT_SURFACE_FACE(uv) texture(face,uv)
#define GLINT_SURFACE_SIZE vec2(textureSize(face,0))
vec4 glintSurfaceClamp(){return vec4(.002,.002,.998,.998);}
#endif
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
vec3 surfaceInk(vec2 uv){vec4 b=glintSurfaceClamp();return GLINT_SURFACE_FACE(clamp(uv,b.xy,b.zw)).rgb;}
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
#ifdef GLINT_ART_PAIR
 if(finishBase<.5)for(int i=0;i<2;i++){
  vec4 b=i==0?artBounds:artBounds2;
#else
 if(finishBase<.5)for(int i=0;i<8;i++){
  vec4 b=artBounds[i];
#endif
  if(b.z>b.x && b.w>b.y && all(greaterThanEqual(uv,b.xy)) && all(lessThanEqual(uv,b.zw))){
   vec2 inset=min(.5/GLINT_SURFACE_SIZE,(b.zw-b.xy)*.25);
   return b+vec4(inset,-inset);
  }
 }
 return glintSurfaceClamp();
}
vec3 windowInk(vec2 uv,vec4 bounds){return GLINT_SURFACE_FACE(clamp(uv,bounds.xy,bounds.zw)).rgb;}
// Small, linear-light cross filter. Radius can be anisotropic; no blur texture.
vec3 softenedInk(vec2 uv,vec2 radius,vec4 bounds){
 vec3 ink=windowInk(uv,bounds)*.4;
 ink+=(windowInk(uv+vec2(radius.x,0.),bounds)+windowInk(uv-vec2(radius.x,0.),bounds))*.15;
 ink+=(windowInk(uv+vec2(0.,radius.y),bounds)+windowInk(uv-vec2(0.,radius.y),bounds))*.15;
 return previewInk(ink);
}
vec3 softenedInk(vec2 uv,vec2 radius){return softenedInk(uv,radius,glintSurfaceClamp());}
float surfaceReflection(vec2 uv,vec3 normal,float sharpness){
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 lamp=normalize(vec3(-.24,.32,1.));
 if(studioLighting>.5){view=studioCardView(uv,normal);lamp=normalize(studioLampPosition-studioCardPosition(uv,normal));}
 return pow(max(0.,dot(reflect(-view,normal),lamp)),sharpness);
}
${RAIN_GLSL}
${HEAT_GLSL}
${POOL_GLSL}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`;
