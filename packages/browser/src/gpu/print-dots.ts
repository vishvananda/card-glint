// Fine subtractive process-ink screens. Controls use physical reference pixels;
// source color, coverage and alpha stay separate from the filtered ink pattern.
export const PRINT_DOTS_GLSL = `
#ifdef GLINT_HOST_SAMPLING
#ifndef GLINT_FACE_SIZE_BINDING
#define GLINT_FACE_SIZE_BINDING
flat in vec2 facePixelSize;
#endif
vec4 glintSampleFace(vec2 uv);
#define GLINT_PRINT_FACE(uv) glintSampleFace(uv)
#define GLINT_PRINT_SIZE facePixelSize
#else
#ifndef GLINT_PRINT_FACE
#define GLINT_PRINT_FACE(uv) texture(face,uv)
#endif
#define GLINT_PRINT_CELL_FACE(uv) textureLod(face,uv,0.)
#define GLINT_PRINT_SIZE vec2(textureSize(face,0))
#endif
#ifndef GLINT_PRINT_CELL_FACE
#define GLINT_PRINT_CELL_FACE(uv) GLINT_PRINT_FACE(uv)
#endif
flat in vec4 printDotsInfo;
float printFootprint;
float printDotPeriodTexels(){return printDotsInfo.y*GLINT_PRINT_SIZE.x/732.;}
vec2 printScreenSize(){return GLINT_PRINT_SIZE*(732./GLINT_PRINT_SIZE.x);}
float printDotFootprint(vec2 uv){vec2 p=uv*printScreenSize();return max(length(dFdx(p)),length(dFdy(p)))/printDotsInfo.y;}
#ifdef PRINT_DOT_ART_WINDOWS
uniform vec4 printArtBounds[8];
#ifdef PRINT_DOT_ART_INSTANCE
flat in float printArtwork;
#else
uniform float printArtwork;
#endif
float printArea(vec2 uv){
 if(printArtwork>.5)return 1.;
 for(int i=0;i<8;i++){
  vec4 b=printArtBounds[i];
  if(b.z>b.x && b.w>b.y && all(greaterThanEqual(uv,b.xy)) && all(lessThanEqual(uv,b.zw)))return 0.;
 }
 return 1.;
}
#endif
float plateNoise(vec2 cell,float channel){return fract(sin(dot(cell,vec2(127.1,311.7))+channel*74.7)*43758.5453);}
float printNoise(vec2 p,float channel){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(plateNoise(i,channel),plateNoise(i+vec2(1.,0.),channel),f.x),mix(plateNoise(i+vec2(0.,1.),channel),plateNoise(i+1.,channel),f.x),f.y);
}
mat2 plateRotation(vec2 axis){return mat2(axis.x,axis.y,-axis.y,axis.x);}
float plateDot(vec2 cell,vec2 id,float radius,bool holes,float channel,float aa,float reach){
 if(any(greaterThan(abs(cell),vec2(reach))))return 0.;
 float variation=printDotsInfo.z;
 if(variation>0.){
  float a=plateNoise(id,channel),b=plateNoise(id,channel+1.),c=plateNoise(id,channel+2.);
  cell-=(vec2(a,b)-.5)*.5*variation;
  cell*=vec2(1.+(b-.5)*.3*variation,1.-(b-.5)*.3*variation);
  radius*=1.+(c-.5)*.36*variation;
  radius*=holes?1.-.12*variation:1.+.12*variation;
  // Stable ragged impression edges, not animated or screen-space grain.
  #ifndef GLINT_PRINT_PROCEDURAL
  float phase=plateNoise(id,channel+83.)*6.2831853,theta=atan(cell.y,cell.x);
  radius*=1.+1.5*variation*(.035*sin(3.*theta+phase)+.018*sin(5.*theta-phase));
#endif
 }
 return 1.-smoothstep(radius-aa,radius+aa,length(cell));
}
float plateScreen(vec2 p,float ink,vec2 axis,float channel,float aa){
 if(ink<=0.)return 0.;if(ink>=1.)return 1.;
 vec2 q=plateRotation(axis)*p;
 bool holes=ink>.5;
 vec2 point=q+(holes?.5:0.),id=floor(point),cell=fract(point)-.5;
 float radius=sqrt(min(ink,1.-ink)/3.14159265),variation=printDotsInfo.z;
 // Include the possible irregular edge excursion before rejecting a neighbor.
 float reach=(radius*(1.+.18*variation)*(holes?1.-.12*variation:1.+.12*variation)*(1.+.0795*variation)+aa)/(1.-.15*variation)+.25*variation;
 float dotInk=plateDot(cell,id,radius,holes,channel,aa,reach);
 // Keep the validated uniform bound dynamic: full unrolling multiplies the
 // nine blur taps, spread taps and neighbors throughout finish sampling.
 int neighborEnd=printDotsInfo.z<0.?0:1;
 if(variation>0.)for(int y=-1;y<=neighborEnd;y++)for(int x=-1;x<=neighborEnd;x++){
  if(x==0&&y==0)continue;
  vec2 offset=vec2(float(x),float(y));
  dotInk=max(dotInk,plateDot(cell-offset,id+offset,radius,holes,channel,aa,reach));
 }
 return holes?1.-dotInk:dotInk;
}
// Raw coverage helper retained for numerical screen/continuity diagnostics.
float inkScreen(vec2 p,float ink,vec2 axis,float channel){return plateScreen(p,ink,axis,channel,max(.015,length(vec2(.1,printFootprint*.4))));}
// Procedural over-finish printing has its own source, never the base face.
bool printUseLocalSource=false;
vec4 printLocalProcess;
float plateSource(vec2 id,vec2 axis,float channel){
 if(printUseLocalSource)return channel<3.?printLocalProcess.x:channel<7.?printLocalProcess.y:channel<11.?printLocalProcess.z:printLocalProcess.w;
 vec2 p=transpose(plateRotation(axis))*(id+.5)*printDotsInfo.y/printScreenSize();
 vec3 ink=previewInk(GLINT_PRINT_CELL_FACE(vec2(p.x,1.-p.y)).rgb);
 float key=1.-max(max(ink.r,ink.g),ink.b);
 vec3 cmy=clamp((1.-ink-key)/max(1.-key,.0001),0.,1.);
 return channel<3.?cmy.r:channel<7.?cmy.g:channel<11.?cmy.b:key;
}
// A blur tap can cross at most one cell boundary in either direction. Sample
// each reachable source-cell color once per plate, rather than per blur tap.
struct PrintPlate {vec2 origin;vec4 inks;vec2 registration;float density;};
PrintPlate preparePlate(vec2 p,vec2 uv,vec2 axis,float channel,vec2 offset,float softness){
 float variation=2.*printDotsInfo.z;
 vec2 field=uv*vec2(8.,11.);
 vec2 drift=(vec2(printNoise(field,71.+channel),printNoise(field+17.3,102.+channel))-.5)*.28;
 vec2 registration=(offset+drift)*variation/printDotsInfo.y;
 p+=registration;
 vec2 q=plateRotation(axis)*p,origin=floor(q),f=fract(q),side=step(vec2(.5),f)*2.-1.;
 #ifdef GLINT_PRINT_PROCEDURAL
 float extent=0.;
#else
 float extent=softness*(abs(axis.x)+abs(axis.y))/printDotsInfo.y+.00001;
#endif
 bool crossX=min(f.x,1.-f.x)<extent,crossY=min(f.y,1.-f.y)<extent;
 float a=plateSource(origin,axis,channel),b=a,c=a,d=a;
 if(crossX)b=plateSource(origin+vec2(side.x,0.),axis,channel);
 if(crossY)c=plateSource(origin+vec2(0.,side.y),axis,channel);
 if(crossX&&crossY)d=plateSource(origin+side,axis,channel);
 else d=crossX?b:c;
 float density=.08*variation*(printNoise(p*.43,124.+channel)-.5);
 return PrintPlate(origin,vec4(a,b,c,d),registration,density);
}
float screenedPlate(vec2 p,vec2 axis,float channel,PrintPlate plate,float aa,float gaps){
 p+=plate.registration;
 vec2 id=floor(plateRotation(axis)*p);
 int index=(id.x==plate.origin.x?0:1)+(id.y==plate.origin.y?0:2);
 float ink=plate.inks[index],absorption=.35+.65*ink,coverage=ink/absorption;
 coverage=clamp(coverage-gaps*coverage*(1.-coverage),0.,1.);
 coverage=clamp(coverage+plate.density*coverage*(1.-coverage),0.,1.);
 vec2 drag=vec2(0.,.6*printDotsInfo.z/printDotsInfo.y);
 #ifdef GLINT_PRINT_PROCEDURAL
 return absorption*plateScreen(p,coverage,axis,channel,length(vec2(aa,drag.y*.70710678)));
#else
 if(printDotsInfo.z<=0.)return absorption*plateScreen(p,coverage,axis,channel,aa);
 return absorption*(.25*plateScreen(p-drag,coverage,axis,channel,aa)+.5*plateScreen(p,coverage,axis,channel,aa)+.25*plateScreen(p+drag,coverage,axis,channel,aa));
#endif
}
vec3 printDotInk(vec3 ink,vec2 uv){
 // Solid process black stays solid: cell-centered plate sampling must not
 // pull a neighboring paper color into a black letter stroke.
 if(printDotsInfo.x<=0. || max(max(ink.r,ink.g),ink.b)<=0.)return ink;
 float visible=1.-smoothstep(.35,.9,printFootprint);
#ifdef PRINT_DOT_ART_WINDOWS
 visible*=printArea(uv);
#endif
 if(printDotsInfo.w>0.){
  vec2 edge=min(uv,1.-uv);float aspect=GLINT_PRINT_SIZE.y/GLINT_PRINT_SIZE.x;
  visible*=smoothstep(printDotsInfo.w*.85,printDotsInfo.w*1.15,min(edge.x,edge.y*aspect));
 }
 // Coverage is tested before source sampling and remains exact at art windows.
 if(visible<=0.)return ink;
 if(printUseLocalSource){
  float key=1.-max(max(ink.r,ink.g),ink.b);
  printLocalProcess=vec4(clamp((1.-ink-key)/max(1.-key,.0001),0.,1.),key);
 }
 vec2 paper=vec2(uv.x,1.-uv.y),p=paper*printScreenSize()/printDotsInfo.y;
 float varied=clamp(2.*printDotsInfo.z,0.,1.);
 float spread=mix(.1,mix(.06,.14,smoothstep(.1,.9,printNoise(paper*vec2(21.,30.)+vec2(13.2,7.4),39.))),varied);
 float aa=max(.015,length(vec2(spread,printFootprint*.4)));
 float softness=.5*mix(.5,smoothstep(.3,.7,printNoise(paper*vec2(21.,30.)+vec2(52.7,19.1),39.)),varied);
 float brightness=dot(ink,vec3(.2126,.7152,.0722));
 float gaps=(.06+.54*smoothstep(.18,.9,brightness))*smoothstep(.1,.35,brightness);
 float lightGain=mix(1.,2.6,smoothstep(.1,.35,brightness));
 vec2 cyan=vec2(-.258819,.965926),magenta=vec2(.258819,.965926),yellow=vec2(0.,1.),black=vec2(.707107);
 PrintPlate c=preparePlate(p,paper,cyan,1.,vec2(-.30,.12),softness);
 PrintPlate m=preparePlate(p,paper,magenta,5.,vec2(.20,-.22),softness);
 PrintPlate y=preparePlate(p,paper,yellow,9.,vec2(.08,.26),softness);
 PrintPlate k=preparePlate(p,paper,black,13.,vec2(-.05,-.03),softness);
 vec3 sum=vec3(0.);
 #ifdef GLINT_PRINT_PROCEDURAL
 // Uncached mixed-instance/pressure fallback uses the analytic footprint.
 // The native preparation pass retains the exact nine-tap reviewed filter.
 aa=length(vec2(aa,softness/printDotsInfo.y*.70710678));
 for(int sy=0;sy<=0;sy++)for(int sx=0;sx<=0;sx++){
#else
 int blurEnd=printDotsInfo.x<0.?0:1;
 for(int sy=-1;sy<=blurEnd;sy++)for(int sx=-1;sx<=blurEnd;sx++){
#endif
  vec2 q=p+vec2(float(sx),float(sy))*softness/printDotsInfo.y;
  vec3 plates=vec3(screenedPlate(q,cyan,1.,c,aa,gaps),screenedPlate(q,magenta,5.,m,aa,gaps),screenedPlate(q,yellow,9.,y,aa,gaps));
  vec3 screened=(1.-plates)*(1.-screenedPlate(q,black,13.,k,aa,gaps));
  vec3 delta=screened-ink;
  float gain=dot(delta,vec3(.2126,.7152,.0722))>=0.?lightGain:1.;
  #ifdef GLINT_PRINT_PROCEDURAL
  float weight=1.;
#else
  float weight=(sx==0?2.:1.)*(sy==0?2.:1.)/16.;
#endif
  sum+=weight*clamp(ink+delta*gain*printDotsInfo.x*visible,0.,1.);
 }
 return sum;
}
vec4 printFace(vec2 uv){
 vec4 source=GLINT_PRINT_FACE(uv);
 if(printDotsInfo.x<=0.)return source;
 return vec4(previewLinear(printDotInk(previewInk(source.rgb),uv)),source.a);
}`;
