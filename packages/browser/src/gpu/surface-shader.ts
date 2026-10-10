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
vec3 refractedInk(vec2 uv){return previewInk(texture(face,clamp(uv,vec2(.002),vec2(.998))).rgb);}
float surfaceReflection(vec2 uv,vec3 normal,float sharpness){
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 lamp=normalize(vec3(-.24,.32,1.));
 return pow(max(0.,dot(reflect(-view,normal),lamp)),sharpness);
}
vec3 rainGlass(vec2 uv,vec3 normal){
 // Fewer, larger lenses leave enough pixels for visible chromatic dispersion.
 vec2 metric=vec2(1.,aspect), p=uv*metric*5.;
 vec2 cell=floor(p), bend=vec2(0.);float light=0.,shade=0.;
 vec2 lamp=normalize(vec2(-.7,.8)-normal.xy*3.);
 float t=surfaceTime;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 id=cell+vec2(float(x),float(y));
  float seed=surfaceHash(id+surfaceInfo.z*83.);
  float cycle=5.+seed*7., epoch=floor((t+seed*cycle)/cycle),age=mod(t+seed*cycle,cycle);
  vec2 rnd=surfaceHash2(id+epoch*17.1+surfaceInfo.z*23.);
  float fade=smoothstep(0.,.18,age)*(1.-smoothstep(cycle*.65,cycle,age));
  vec2 center=id+.2+rnd*.6;
  center.y-=max(0.,age-2.5)*max(0.,age-2.5)*.007*(.3+seed);
  vec2 q=(p-center)/(.18+.23*rnd.x);
  q.x+=q.y*(normal.x*.3+surfaceInfo.x);
  q.y/=1.+max(0.,age-2.5)*.055;
  float r=length(q),body=1.-smoothstep(.72,1.,r);
  vec2 lens=(q+normal.xy*.7)*body*fade;
  bend+=lens*(.026+.015*rnd.x)/metric;
  float rim=exp(-pow((r-.84)*18.,2.))*fade;
  light+=rim*max(0.,dot(normalize(q+vec2(.0001)),lamp))*.38;
  vec2 glint=q-lamp*.42;
  light+=exp(-dot(glint,glint)*55.)*fade*.48;
  shade+=rim*max(0.,dot(normalize(q+vec2(.0001)),-lamp))*.20;
 }
 // Three wavelengths sample the same cached face; no extra textures or passes.
 vec3 ink=vec3(refractedInk(uv+bend*1.28).r,refractedInk(uv+bend).g,refractedInk(uv+bend*.72).b);
 float reflection=surfaceReflection(uv,normal,28.);
 return ink*(1.-shade)+vec3(.76,.90,1.)*(light*(.65+reflection*.7)+reflection*.045);
}
vec3 heatHaze(vec2 uv,vec3 normal){
 float t=surfaceTime, seed=surfaceInfo.z*29.;
 vec2 p=uv*vec2(3.2,4.4)+normal.xy*.65;
 float a=surfaceNoise(p+vec2(seed,t*.45));
 float b=surfaceNoise(p*1.8+vec2(-t*.19,seed+t*.7));
 vec2 curl=vec2(sin(uv.y*32.+a*7.+t*2.4),cos(uv.x*21.+b*6.-t*1.7));
 vec2 displacement=(curl*.0055+vec2(a-.5,b-.5)*.021+normal.xy*(a-.5)*.025)*(.6+uv.y*.4);
 vec3 ink=refractedInk(uv+displacement);
 float glow=pow(max(0.,sin(uv.y*12.+a*5.-t*.9)),8.)*.032;
 float reflection=surfaceReflection(uv+displacement*2.,normal,24.);
 return ink*vec3(1.018,1.,.98)+vec3(1.,.54,.18)*glow+vec3(1.,.86,.65)*reflection*.13;
}
vec2 rippleSlope(vec2 p,vec4 r){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.8 || r.w==0.)return vec2(0.);
 vec2 d=(p-r.xy)*vec2(1.,aspect);float radius=length(d), front=radius-age*.32;
 float envelope=exp(-front*front*180.)*exp(-age*1.4)*smoothstep(0.,.08,age);
 return d/max(radius,.001)*cos(front*65.)*envelope*r.w*.12;
}
float causticCell(vec2 p,float t){
 vec2 id=floor(p),f=fract(p);float first=8.,second=8.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  vec2 g=vec2(float(x),float(y)),r=surfaceHash2(id+g);
  vec2 point=g+.5+.32*sin(t*.65+6.2831*r)-f;
  float d=dot(point,point);
  second=min(second,max(first,d));first=min(first,d);
 }
 float edge=sqrt(second)-sqrt(first);
 return pow(1.-smoothstep(.008,.11,edge),2.);
}
vec3 poolWater(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*19.;
 vec2 p=uv*vec2(1.,aspect),slosh=surfaceInfo.xy;
 vec2 slope=vec2(cos(p.x*10.+p.y*4.+t*1.2+seed),sin(p.y*11.-p.x*3.+t*.95+seed))*.035;
 slope+=vec2(sin(p.y*5.+t*1.4),cos(p.x*6.-t*1.3))*length(slosh)*1.8+slosh*.4;
 slope+=normal.xy*.075;
 slope+=rippleSlope(uv,ripple0)+rippleSlope(uv,ripple1)+rippleSlope(uv,ripple2)+rippleSlope(uv,ripple3);
 vec2 under=uv+slope*vec2(.085,.085/aspect);
 vec2 flow=vec2(sin(p.y*6.+sin(p.x*4.+t*.5)-t*.6),cos(p.x*5.+sin(p.y*3.5-t*.6)+t*.65))*.52;
 float caustics=causticCell(p*6.4+flow+slope*4.+slosh*3.+seed,t);
 caustics+=causticCell(p*8.7-flow*.7-slope*3.+vec2(t*.06,-t*.045),-t)*.28;
 vec3 ink=refractedInk(under)*vec3(.80,.95,.99);
 vec3 waterNormal=normalize(normal+vec3(-slope*1.8,0.));
 float reflection=surfaceReflection(uv,waterNormal,36.);
 return ink*(.94+caustics*.40)+vec3(.28,.83,.91)*caustics*.17+vec3(.75,.94,1.)*reflection*.16;
}
vec3 animatedSurface(vec2 uv,vec3 normal){
 if(previewKind==5.)return rainGlass(uv,normal);
 if(previewKind==6.)return heatHaze(uv,normal);
 return poolWater(uv,normal);
}
`;
