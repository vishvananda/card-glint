// Experimental process-ink screens, evaluated before finish and wear.
// Conventional C/M/Y/K angles: 105, 75, 90, 45 degrees. This is a visual
// approximation, not a color-managed press simulation or scan reconstruction.
export const PRINT_DOTS_GLSL = `
flat in vec2 printDotsInfo;
float printFootprint;
float inkScreen(vec2 p,float ink,vec2 axis){
 vec2 q=mat2(axis.x,axis.y,-axis.y,axis.x)*p;
 bool holes=ink>.5;
 vec2 cell=fract(q+(holes?.5:0.))-.5;
 float radius=sqrt(min(ink,1.-ink)/3.14159265);
 float aa=max(.015,printFootprint*.4);
 float dotInk=1.-smoothstep(radius-aa,radius+aa,length(cell));
 if(ink<=0.)return 0.;if(ink>=1.)return 1.;
 return holes?1.-dotInk:dotInk;
}
vec3 printDotInk(vec3 ink,vec2 uv){
 if(printDotsInfo.x<=0.)return ink;
 float visible=1.-smoothstep(.35,.9,printFootprint);
 if(visible<=0.)return ink;
 vec2 p=vec2(uv.x,1.-uv.y)*vec2(textureSize(face,0))/printDotsInfo.y;
 float k=1.-max(max(ink.r,ink.g),ink.b);
 vec3 cmy=clamp((1.-ink-k)/max(1.-k,.0001),0.,1.);
 vec3 plates=vec3(inkScreen(p,cmy.x,vec2(-.258819,.965926)),inkScreen(p,cmy.y,vec2(.258819,.965926)),inkScreen(p,cmy.z,vec2(0.,1.)));
 float black=inkScreen(p,k,vec2(.707107));
 vec3 screened=(1.-plates)*(1.-black);
 return mix(ink,screened,printDotsInfo.x*visible);
}
vec4 printFace(vec2 uv){
 vec4 source=texture(face,uv);
 if(printDotsInfo.x<=0.)return source;
 return vec4(previewLinear(printDotInk(previewInk(source.rgb),uv)),source.a);
}`;
