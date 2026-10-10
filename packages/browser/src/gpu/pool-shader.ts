import { WATER_WAVES_GLSL } from './water-waves.js';

/** A moving water surface above a separately illuminated, recessed card face. */
export const POOL_GLSL = `
uniform sampler2D caustics;
${WATER_WAVES_GLSL}
float floorIrradiance(vec2 p){
 // A small receiving footprint softens subpixel ray folds / mesh boundaries,
 // like a light source with finite angular extent instead of an ideal point.
 vec2 radius=1.25/vec2(textureSize(caustics,0));
 float light=texture(caustics,p).r*.4;
 light+=(texture(caustics,p+vec2(radius.x,0.)).r+texture(caustics,p-vec2(radius.x,0.)).r)*.15;
 light+=(texture(caustics,p+vec2(0.,radius.y)).r+texture(caustics,p-vec2(0.,radius.y)).r)*.15;
 return light*8.;
}
vec2 rippleSlope(vec2 p,vec4 r){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.8 || r.w==0.)return vec2(0.);
 vec2 d=(p-r.xy)*vec2(1.,aspect);float radius=length(d),front=radius-age*.32;
 float envelope=exp(-front*front*180.)*exp(-age*1.4)*smoothstep(0.,.08,age);
 return d/max(radius,.001)*cos(front*65.)*envelope*r.w*.12;
}
vec3 poolWater(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),slosh=surfaceInfo.xy;
 vec2 origin=vec2(surfaceInfo.z,surfaceInfo.z*.618)*waterPeriod;
 vec2 p=uv*metric+origin+slosh*.20;
 vec3 wave=waterField(p,surfaceTime);
 vec2 slope=wave.xy;
 slope+=vec2(sin(p.y*5.+surfaceTime*1.4),cos(p.x*6.-surfaceTime*1.3))*length(slosh)*1.8+slosh*.4;
 slope+=rippleSlope(uv,ripple0)+rippleSlope(uv,ripple1)+rippleSlope(uv,ripple2)+rippleSlope(uv,ripple3);
 // Floor ink and its illumination share a ray intersection. Ripples and glints
 // live above them; tilting reveals the distance between these optical layers.
 vec2 floorUv=surfaceParallax(uv,normal,.16,1.333)+slope*vec2(.055,.055/aspect);
 vec2 floorPoint=floorUv*metric+origin+slosh*.20;
 float flux=floorIrradiance(floorPoint/waterPeriod);
 vec3 ink=windowInk(floorUv,surfaceWindow(uv));
 // Apply irradiance in linear light: divergence dims the floor, focused rays
 // brighten it. Ambient light preserves readability in the darkest troughs.
 vec3 floorLight=ink*vec3(.78,.94,1.)*(.28+.72*flux);
 vec3 waterNormal=normalize(normal+vec3(-slope*.65,0.));
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 float fresnel=.02+.98*pow(1.-max(0.,dot(view,waterNormal)),5.);
 float reflection=surfaceReflection(uv,waterNormal,52.);
 vec3 reflected=vec3(.18,.32,.41)+vec3(.8,.94,1.)*reflection*1.6;
 return previewInk(mix(floorLight,reflected,clamp(fresnel,0.,.6)));
}
`;
