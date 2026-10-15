import { WATER_WAVES_GLSL } from './water-waves.js';

/** A shallow basin: fixed printed floor, inertial water and separate illumination. */
export const POOL_GLSL = `
uniform sampler2D caustics;
${WATER_WAVES_GLSL}
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
 float taper=segLen>.004 ? smoothstep(0.,.18,h) : 1.;
 float amp=(.85+min(.55,segLen*4.))*taper;
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
 // Ambient waves organically advect the dragged wake so it undulates with the pool.
 vec2 wakeDrag;
 vec3 rip=rippleWake(uv+wave.xy*.24,wakeDrag);
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
`;
