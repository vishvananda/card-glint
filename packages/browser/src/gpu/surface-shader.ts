import { RAIN_GLSL } from './rain-shader.js';
import { HEAT_GLSL } from './heat-shader.js';
import { POOL_GLSL } from './pool-shader.js';

/** Analytic optical surfaces. No animated textures, readbacks or simulation FBOs. */
export const SURFACE_GLSL = `
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
// Small, linear-light cross filter. Radius can be anisotropic; no blur texture.
vec3 softenedInk(vec2 uv,vec2 radius){
 vec3 ink=surfaceInk(uv)*.4;
 ink+=(surfaceInk(uv+vec2(radius.x,0.))+surfaceInk(uv-vec2(radius.x,0.)))*.15;
 ink+=(surfaceInk(uv+vec2(0.,radius.y))+surfaceInk(uv-vec2(0.,radius.y)))*.15;
 return previewInk(ink);
}
float surfaceReflection(vec2 uv,vec3 normal,float sharpness){
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 lamp=normalize(vec3(-.24,.32,1.));
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
