// Experimental process-ink screens, evaluated before finish and wear.
// Conventional C/M/Y/K angles: 105, 75, 90, 45 degrees. This is a visual
// approximation, not a color-managed press simulation or scan reconstruction.
export const PRINT_DOTS_GLSL = `
#ifdef GLINT_HOST_SAMPLING
#define GLINT_PRINT_FACE(uv) glintSampleFace(uv)
#define GLINT_PRINT_SIZE facePixelSize
#else
#define GLINT_PRINT_FACE(uv) texture(face,uv)
#define GLINT_PRINT_SIZE vec2(textureSize(face,0))
#endif
flat in vec4 printDotsInfo;
float printFootprint;
// The period describes the physical card, not the selected raster tier.
float printDotPeriodTexels(){return printDotsInfo.y*GLINT_PRINT_SIZE.x/732.;}
vec2 printScreenSize(){return GLINT_PRINT_SIZE*(732./GLINT_PRINT_SIZE.x);}
float printDotFootprint(vec2 uv){vec2 p=uv*printScreenSize();return max(length(dFdx(p)),length(dFdy(p)))/printDotsInfo.y;}
// Optional host contract. Without these defines the public shader is unchanged.
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
float plateDot(vec2 cell,vec2 id,float radius,bool holes,float channel,float aa,float reach){
 // Reject distant neighbors before hashing; only nearby impressions can touch.
 if(any(greaterThan(abs(cell),vec2(reach))))return 0.;
 if(printDotsInfo.z>0.){
  float a=plateNoise(id,channel),b=plateNoise(id,channel+1.),c=plateNoise(id,channel+2.);
  // Stable impression irregularity. Neighboring dots stay on their plate's
  // screen, with subpixel registration shifts, ellipticity and uneven ink gain.
  cell-=(vec2(a,b)-.5)*.5*printDotsInfo.z;
  cell*=vec2(1.+(b-.5)*.3*printDotsInfo.z,1.-(b-.5)*.3*printDotsInfo.z);
  radius*=1.+(c-.5)*.36*printDotsInfo.z;
  radius*=holes?1.-.12*printDotsInfo.z:1.+.12*printDotsInfo.z;
 }
 return 1.-smoothstep(radius-aa,radius+aa,length(cell));
}
float inkScreen(vec2 p,float ink,vec2 axis,float channel){
 if(ink<=0.)return 0.;if(ink>=1.)return 1.;
 vec2 q=mat2(axis.x,axis.y,-axis.y,axis.x)*p;
 bool holes=ink>.5;
 vec2 point=q+(holes?.5:0.),id=floor(point),cell=fract(point)-.5;
 float radius=sqrt(min(ink,1.-ink)/3.14159265),aa=max(.015,printFootprint*.4);
 float variation=printDotsInfo.z;
 float reach=(radius*(1.+.18*variation)*(holes?1.-.12*variation:1.+.12*variation)+aa)/(1.-.15*variation)+.25*variation;
 float dotInk=plateDot(cell,id,radius,holes,channel,aa,reach);
 // Varied dots can cross cell borders. Union neighboring impressions instead
 // of clipping each dot to its square cell, including reversed (hole) screens.
 if(variation>0.)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  if(x==0&&y==0)continue;
  vec2 offset=vec2(float(x),float(y));
  dotInk=max(dotInk,plateDot(cell-offset,id+offset,radius,holes,channel,aa,reach));
 }
 return holes?1.-dotInk:dotInk;
}
vec3 printDotInk(vec3 ink,vec2 uv){
 if(printDotsInfo.x<=0.)return ink;
 float visible=1.-smoothstep(.35,.9,printFootprint);
#ifdef PRINT_DOT_ART_WINDOWS
 visible*=printArea(uv);
#endif
 if(printDotsInfo.w>0.){
  vec2 edge=min(uv,1.-uv);float printAspect=GLINT_PRINT_SIZE.y/GLINT_PRINT_SIZE.x;
  visible*=smoothstep(printDotsInfo.w*.85,printDotsInfo.w*1.15,min(edge.x,edge.y*printAspect));
 }
 if(visible<=0.)return ink;
 vec2 p=vec2(uv.x,1.-uv.y)*printScreenSize()/printDotsInfo.y;
 float k=1.-max(max(ink.r,ink.g),ink.b);
 vec3 cmy=clamp((1.-ink-k)/max(1.-k,.0001),0.,1.);
 vec3 plates=vec3(inkScreen(p,cmy.x,vec2(-.258819,.965926),1.),inkScreen(p,cmy.y,vec2(.258819,.965926),5.),inkScreen(p,cmy.z,vec2(0.,1.),9.));
 float black=inkScreen(p,k,vec2(.707107),13.);
 vec3 screened=(1.-plates)*(1.-black);
 return mix(ink,screened,printDotsInfo.x*visible);
}
vec4 printFace(vec2 uv){
 vec4 source=GLINT_PRINT_FACE(uv);
 if(printDotsInfo.x<=0.)return source;
 return vec4(previewLinear(printDotInk(previewInk(source.rgb),uv)),source.a);
}`;
