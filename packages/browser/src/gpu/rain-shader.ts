/** Small cap lenses and draining trails over lightly condensed glass. */
export const RAIN_GLSL = `
void rainCap(vec2 delta,float radius,float stretch,float strength,inout vec4 wet){
 vec2 q=delta/vec2(radius,radius*stretch);
 float cap=max(0.,1.-dot(q,q));
 float cover=smoothstep(0.,.22,cap)*strength;
 // The cap gradient bends the image; do not draw a bright circular outline.
 wet.xy+=q*sqrt(cap)*cover;
 wet.z=max(wet.z,cover);
}
vec4 rainField(vec2 uv,vec3 normal){
 vec2 metric=vec2(1.,aspect),p=uv*metric*12.,cell=floor(p);
 vec4 wet=vec4(0.);float t=surfaceTime,seed=surfaceInfo.z*83.;
 // Fine stationary beads form and evaporate at independent times.
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 id=cell+vec2(float(x),float(y)),initial=surfaceHash2(id+seed);
  float cycle=9.+initial.y*11.,clock=t+initial.x*cycle,age=mod(clock,cycle);
  vec2 rnd=surfaceHash2(id+seed+floor(clock/cycle)*vec2(17.1,29.3));
  float fade=smoothstep(0.,1.,age)*(1.-smoothstep(cycle-2.,cycle,age));
  vec2 delta=p-(id+.18+rnd*.64);
  delta.x+=delta.y*(normal.x*.24+surfaceInfo.x*.4);
  float radius=.085+.105*rnd.x*rnd.x;
  rainCap(delta,radius,1.+rnd.y*.22,fade*step(.18,rnd.y),wet);
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
   vec2 delta=stream-(id+vec2(.2+rnd.x*.6,.2+rnd.y*.6));
   delta.x+=sin(delta.y*3.+rnd.y*6.)*.014+delta.y*normal.x*.13;
   float strength=step(.58,rnd.y),radius=.075+.035*rnd.x;
   rainCap(delta,radius,1.25,strength,wet);
   float trail=exp(-pow(delta.x/(radius*.48),2.))*smoothstep(0.,.10,delta.y)
     *(1.-smoothstep(.10,.72,delta.y))*strength;
   wet.w=max(wet.w,trail);
  }
 }
 wet.xy+=beads.xy*(1.-wet.w);
 wet.z=clamp(max(wet.z,beads.z*(1.-wet.w)),0.,1.);
 return wet;
}
vec3 rainGlass(vec2 uv,vec3 normal){
 vec4 wet=rainField(uv,normal);
 vec2 bend=-wet.xy*vec2(.018,.018/aspect);
 float clear=max(wet.z,wet.w*.8);
 // Sharp lenses and wiped tracks sit over a softly fogged, still readable face.
 vec2 radius=vec2(.0020,.0020/aspect)*(1.-clear);
 vec3 ink=softenedInk(uv+bend,radius);
 float fog=(.030+.015*surfaceNoise(uv*vec2(3.,4.)+surfaceInfo.z*11.))*(1.-clear);
 ink=mix(ink,vec3(.72,.77,.79),fog);
 vec3 dropNormal=normalize(normal+vec3(wet.xy*1.8,0.));
 float glint=surfaceReflection(uv,dropNormal,65.)*wet.z;
 float shade=max(0.,dot(wet.xy,normalize(vec2(.5,-.7))))*wet.z*.09;
 return ink*(1.-shade)+vec3(.90,.96,1.)*(glint*.30+surfaceReflection(uv,normal,24.)*.018);
}
`;
