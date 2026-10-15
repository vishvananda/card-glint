/** Buoyant rising thermal plumes, schlieren shimmer filaments, and tilt-reactive mirage glare. */
export const HEAT_GLSL = `
vec3 heatMirageInk(vec2 uv,vec2 r,vec4 bounds){
 vec3 c=windowInk(uv,bounds)*.20;
 vec2 r1=r*.65,r2=r*.82;
 c+=(windowInk(uv+vec2(r1.x,0.),bounds)+windowInk(uv-vec2(r1.x,0.),bounds)
  +windowInk(uv+vec2(0.,r1.y),bounds)+windowInk(uv-vec2(0.,r1.y),bounds))*.12;
 c+=(windowInk(uv+vec2(r2.x,r2.y),bounds)+windowInk(uv+vec2(-r2.x,r2.y),bounds)
  +windowInk(uv+vec2(r2.x,-r2.y),bounds)+windowInk(uv+vec2(-r2.x,-r2.y),bounds))*.08;
 return previewInk(c);
}
vec3 heatHaze(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*29.;
 vec2 lean=normal.xy*.48+surfaceInfo.xy*.75;
 float grazing=1.+min(.65,length(normal.xy)*1.25);

 // Rising buoyant convective plumes + smooth thermal eddies (uv.y increases bottom to top).
 vec2 plumeCoord=vec2(uv.x*2.4-lean.x*uv.y,uv.y*4.2-t*1.10)+vec2(seed,seed*.61);
 float plume=surfaceNoise(plumeCoord);
 vec2 p=uv*vec2(1.8,18.)+vec2(seed-lean.x*1.1,-t*.92-lean.y*1.2);
 float air=surfaceNoise(p),fine=surfaceNoise(p*vec2(1.7,1.6)+vec2(t*.16+(plume-.5)*.8,-t*.68));

 // Schlieren refractive envelope: smooth rising mirage columns alternating with clearer air.
 float shear=abs(air-fine);
 float schlieren=clamp(.36+smoothstep(.20,.82,plume)*.58+shear*.65,0.,1.35)*grazing;
 float ribbon=sin(uv.y*46.-t*3.1+air*4.2+plume*2.8+uv.x*1.6);
 float microRibbon=cos(uv.y*82.-t*4.4+fine*4.5-uv.x*2.1);
 vec2 displacement=vec2(
  (ribbon*.0028+microRibbon*.0009+(fine-.5)*.0036)*schlieren,
  ((air-.5)*.00085+(plume-.5)*.00065)*schlieren
 );
 displacement.x+=normal.x*(air-.5)*.010+surfaceInfo.x*(plume-.5)*.008;
 displacement.y+=normal.y*(plume-.5)*.004;

 vec4 bounds=surfaceWindow(uv);
 float boil=clamp(smoothstep(.14,.80,plume)*.58+smoothstep(.04,.40,shear)*.52,0.,1.2);
 float mirageBlur=clamp((.32+boil*.82)*(.78+.22*(.5+.5*abs(ribbon)))*grazing,0.,1.45);
 vec2 blurRadius=vec2(.0014+.0032*mirageBlur,(.0015+.0036*mirageBlur)/aspect);
 vec3 ink=heatMirageInk(uv+displacement,blurRadius,bounds);

 // Subtle chromatic warmth/shimmer along rising thermal shear lines.
 float causticWave=(ribbon*.7+microRibbon*.3)*schlieren;
 ink=clamp(ink*vec3(1.+.022*causticWave,1.+.005*causticWave,1.-.018*causticWave),0.,1.);

 // Physical card tilt response: warm mirage glare + sunlit ember catch on artwork contours & frame.
 vec2 cardUv=vec2(uv.x,1.-uv.y);
 vec2 ptr=foilPointer(normal);
 vec2 bg=foilSweepOffset(ptr);
 float rT=foilRadialDistance(cardUv,ptr);
 float spot=1.-smoothstep(.06,.88,rT);
 vec2 sampleUv=clamp(uv+displacement*.5,bounds.xy,bounds.zw);
 float etched=etchMask(sampleUv),art=artWindow(sampleUv);
 float cardLines=etched*art+smoothstep(.74,.96,etched*(1.-art));
 float heatSweep=fract(dot(cardUv*vec2(.90,1.25),dir115)*1.75+(bg.x+bg.y*.35)*1.2);
 float mirageBand=smoothstep(.10,.36,heatSweep)*(1.-smoothstep(.42,.68,heatSweep));

 vec3 heatNormal=normalize(normal+vec3(displacement.x*36.,displacement.y*48.,0.));
 float reflection=surfaceReflection(uv+displacement,heatNormal,20.);
 float plumeRidge=smoothstep(.42,.78,plume)*(.5+.5*ribbon);
 float hearthGlow=(1.-smoothstep(0.,.68,uv.y))*(.30+.70*plume)*(.45+.55*spot);
 vec3 emberShine=mix(vec3(1.,.76,.42),vec3(1.,.92,.74),spot*.55+mirageBand*.45)
  *((.035+mirageBand*.068+plumeRidge*.048)*spot+hearthGlow*.045+cardLines*(.13+.25*spot+.16*mirageBand)+reflection*.080);

 vec3 res=foilSheenBlend(ink,emberShine);
 return applyStudioGlare(res,rT,.36);
}
`;
