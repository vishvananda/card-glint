const a = `
  if(previewKind>=5. && previewKind<8.) {
    vec2 d=vec2(1./244.,1./340.);
    float height=texture2D(wave,uv).r*hasWave;
    vec2 gradient=vec2(texture2D(wave,uv+vec2(d.x,0.)).r-texture2D(wave,uv-vec2(d.x,0.)).r,
      texture2D(wave,uv+vec2(0.,d.y)).r-texture2D(wave,uv-vec2(0.,d.y)).r)*hasWave;
    vec4 bounds=vec4(.03937,.02531,.96063,.96063);
    float edge=min(min(uv.x-bounds.x,bounds.z-uv.x),min(uv.y-bounds.y,bounds.w-uv.y));
    float window=smoothstep(0.,max(fwidth(edge),.00001),edge);
    gradient*=smoothstep(0.,.016,edge);
    vec2 shift=gradient*1.3;
    shift*=min(1.,max(0.,edge-.0015)/max(length(shift),.00001));
    // The bounded shift cannot cross the border. Preserve texture filtering
    // there instead of snapping the sample to an inset art rectangle.
    base=previewInk(texture2D(face,uv+shift).rgb);
    vec3 fluidNormal=normalize(vec3(-gradient*32.,1.));
    // Ripple glints perturb the same reflected strip as cold/prismatic foil.
    // At rest their angle is identical, including the card's physical tilt.
    vec3 tangent=normalize(vec3(normal.z,0.,-normal.x));
    vec3 bitangent=normalize(cross(normal,tangent));
    vec3 rippleNormal=normalize(normal+tangent*fluidNormal.x+bitangent*fluidNormal.y);
    float spec=exp(-pow(satinStripAxis(uv,rippleNormal,view),2.)*620.);
    float crest=smoothstep(.0003,.012,length(gradient));
    vec3 fluid=base;
    if(window>0.) {
      if(previewKind==5.) {
        fluid+=vec3(.10,.16,.17)*crest;
        fluid=mix(fluid,mix(vec3(.12,.38,.48),vec3(.9,.99,1.),spec),.012+crest*.11+spec*crest*.75);
      } else {
        float phase=height*15.+fluidNormal.x*1.7+fluidNormal.y*1.3+dot(uv,vec2(.12,.18));
        fluid=mix(fluid,mix(spectrum(phase),vec3(1.),spec*.3),min(.85,.06+crest*.64+spec*crest*.24));
      }
    }
    base=mix(base,fluid,window);
    return mix(base,satin(uv,base,normal,view,previewKind==6.?2.:3.,0.),.65);
  }
`, r = `
uniform float satinCompact;
uniform float satinHoverGain;
float foilHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
vec2 foilHash2(vec2 p) {
  return vec2(foilHash(p), foilHash(p + vec2(37.2, 19.8)));
}
float inkLuma(vec3 c) {
  return dot(c, vec3(.2126, .7152, .0722));
}
vec3 blendColorDodge(vec3 base, vec3 blend) {
  return clamp(base / max(vec3(1.) - clamp(blend, 0., .95), vec3(.05)), 0., 1.);
}
vec3 blendOverlay(vec3 base, vec3 blend) {
  return mix(
    2. * base * blend,
    vec3(1.) - 2. * (vec3(1.) - base) * (vec3(1.) - blend),
    step(vec3(.5), base)
  );
}
vec3 blendScreen(vec3 a, vec3 b) {
  return vec3(1.) - (vec3(1.) - a) * (vec3(1.) - b);
}
// Color-dodge + subtle screen lift so foil highlights work naturally on both bright art and dark frames.
vec3 foilSheenBlend(vec3 base, vec3 shine) {
  vec3 s = clamp(shine, 0., .90);
  vec3 lifted = max(base, min(vec3(.26), s * .42));
  return mix(blendColorDodge(lifted, s), blendScreen(base, s * .85), .28);
}
vec2 foilPointer(vec3 normal) {
  vec2 delta = vec2(normal.x * 2.63, normal.y * 3.33) + vec2(pointer.x - .5, .5 - pointer.y);
  vec2 rest = vec2(-.18, -.20) * exp(-dot(delta, delta) * 180.);
  return clamp(vec2(.5) + delta + rest, 0., 1.);
}
vec2 foilSweepOffset(vec2 ptr) {
  return mix(vec2(.37, .33), vec2(.63, .67), ptr);
}
float foilRadialDistance(vec2 cardUv, vec2 ptr) {
  const vec2 cardAspect = vec2(.718, 1.);
  float cornerDist = length(max(ptr, vec2(1.) - ptr) * cardAspect);
  return length((cardUv - ptr) * cardAspect) / max(cornerDist, .5);
}
vec3 applyStudioGlare(vec3 c, float rT, float opacity) {
  vec2 pa;
  if (rT <= .10) {
    pa = vec2(.80, .80);
  } else if (rT <= .20) {
    pa = mix(vec2(.80, .80), vec2(.65, .65), (rT - .10) * 10.);
  } else {
    float u = clamp((rT - .20) * 1.4285714, 0., 1.);
    pa = mix(vec2(.65, .65), vec2(.0, .50), u);
  }
  float a = pa.y;
  float gray = pa.x / max(a, 1e-4);
  vec3 ov = blendOverlay(c, vec3(gray));
  float bloom = max(0., gray - .5) * 2. * (1. - smoothstep(0., .58, rT));
  vec3 glazed = mix(ov, blendScreen(c, vec3(bloom * .48)), .42);
  return mix(c, glazed, clamp(a * opacity, 0., 1.));
}
vec3 spectrum(float phase) { return .5 + .5*cos(6.2831853*(phase+vec3(0.,.333,.667))); }
float satinStripAxis(vec2 uv, vec3 normal, vec3 view) {
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*1.1;
  return mix(q.x+.12+q.y*.2,
    (uv.x-pointer.x)*.65+(uv.y-pointer.y)*.18+dot(reflected.xy,vec2(.16,.10)),satinCompact);
}
vec3 satin(vec2 uv, vec3 base, vec3 normal, vec3 view, float kind, float metal) {
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*1.1;
  vec2 broadQ=mix(q,reflected.xy/max(abs(reflected.z),.25)+vec2(-.10,.17)+(pointer-.5)*.28,satinCompact);
  vec2 broadDelta=(broadQ-vec2(-.10,.17))*vec2(1.45,.85);
  float broad=exp(-dot(broadDelta,broadDelta))*.38;
  float stripAxis=satinStripAxis(uv,normal,view);
  float strip2=stripAxis*stripAxis;
  float strip=exp(-strip2*48.)*.34+exp(-strip2*240.)*.18;
  float reflection=broad+strip;
  float nv=1.-abs(dot(normal,view)),nv2=nv*nv;
  float fresnel=.08+.62*(nv2*nv2);
  vec3 bands=spectrum(uv.x*.62+uv.y*.28+reflected.x*1.35+reflected.y*.75);
  vec3 substrate=base;
  vec3 light=vec3(.84,.94,1.)*reflection*(.68+fresnel);
  if (kind==1.) {
    substrate=base*mix(vec3(1.),vec3(.99,.95,.88),.28);
    reflection=broad*.34+strip*(.22+metal*2.1);
    light=mix(vec3(1.,.86,.58),vec3(1.,.94,.78),metal)*reflection*(.68+fresnel+metal*.85);
  } else if(kind==2.) {
    substrate=base*(.96+.04*mix(vec3(1.),bands,.75));
    reflection=broad*.26+strip*.54;
    light=mix(vec3(1.,.98,.94),bands,.82)*reflection*(.70+fresnel);
    light+=vec3(1.,.99,.96)*exp(-strip2*280.)*.08;
  } else if(kind==3.) {
    reflection=broad*.28+strip*.52;
    light=vec3(.86,.94,1.)*reflection*(.64+fresnel);
  } else if(kind==4.) {
    substrate=base*vec3(.96,1.,.98);
    reflection=broad*.24+strip*.52;
    light=vec3(.42,.90,.62)*reflection*(.72+fresnel);
  }
  return clamp(substrate+light*(1.+satinHoverGain),0.,1.);
}
vec4 opalFacet(vec2 uv, vec2 tilt, vec3 normal, vec3 view) {
  vec2 grid=uv*vec2(14.,14.*aspect), cell=floor(grid), p=fract(grid);
  float triangle=step(p.x,p.y);
  float seed=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
  vec3 facet=normalize(vec3((seed-.5)*1.15,(triangle-.5)*.75,1.));
  vec3 lamp=normalize(vec3(tilt*.6+vec2(-.4,.45),1.));
  float spec=max(0.,dot(facet,normalize(lamp+vec3(0.,0.,1.))));
  float s2=spec*spec,s4=s2*s2,s8=s4*s4;
  float stripAxis=satinStripAxis(uv,normal,view);
  float flash=(s8*s8*s8)*exp(-(stripAxis*stripAxis)*90.);
  vec3 opal=mix(spectrum(seed*.6+triangle*.12+tilt.x*.17),vec3(.92,.99,.96),.50);
  return vec4(opal,flash*.40);
}
`;
function c(e = {}) {
  const t = e.artWindows === "pair" ? `float artWindow(vec2 uv) {
    float first=step(artBounds.x,uv.x)*step(uv.x,artBounds.z)*step(artBounds.y,uv.y)*step(uv.y,artBounds.w);
    float second=step(artBounds2.x,uv.x)*step(uv.x,artBounds2.z)*step(artBounds2.y,uv.y)*step(uv.y,artBounds2.w);
    return max(first,second);
  }` : `float artWindow(vec2 uv) {
  float coverage=0.;
  for(int i=0;i<8;i++){
    vec4 bounds=artBounds[i];
    coverage=max(coverage,step(bounds.x,uv.x)*step(uv.x,bounds.z)*step(bounds.y,uv.y)*step(uv.y,bounds.w));
  }
  return coverage;
}`;
  return `
uniform float previewKind;
uniform sampler2D wave;
uniform float hasWave;
// The study was tuned against printed sRGB ink. Preserve those amounts when
// the host uploads sRGB textures and performs the final output conversion.
vec3 previewInk(vec3 c) { return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c)); }
vec3 previewLinear(vec3 c) { return mix(c/12.92,pow(max((c+.055)/1.055,vec3(0.)),vec3(2.4)),step(vec3(.04045),c)); }
${r}
${t}
// Gameplay mask alpha is stored unchanged in a linear R8 red channel.
float etchMask(vec2 uv) { return texture2D(mask,uv).r*hasMask; }
float contour(vec2 uv) { return texture2D(mask,uv).r*hasMask*artWindow(uv); }
vec3 vividSpectrum(float t) {
  float x=fract(t)*5.;
  int idx=int(floor(x));
  float f=fract(x);
  vec3 c0=vec3(.788,.161,.945);
  vec3 c1=vec3(.051,.741,.914);
  vec3 c2=vec3(.129,.914,.522);
  vec3 c3=vec3(.933,.875,.063);
  vec3 c4=vec3(.973,.055,.208);
  if(idx==0) return mix(c0,c1,f);
  if(idx==1) return mix(c1,c2,f);
  if(idx==2) return mix(c2,c3,f);
  if(idx==3) return mix(c3,c4,f);
  return mix(c4,c0,f);
}
vec3 iridescentBands(float t, float offset) {
  float x=fract(t+offset*.1666667)*6.;
  int idx=int(floor(x));
  float f=fract(x);
  vec3 c0=vec3(1.00,.46,.44);
  vec3 c1=vec3(1.00,.93,.38);
  vec3 c2=vec3(.67,1.00,.38);
  vec3 c3=vec3(.52,1.00,.97);
  vec3 c4=vec3(.48,.58,1.00);
  vec3 c5=vec3(.84,.44,1.00);
  if(idx==0) return mix(c0,c1,f);
  if(idx==1) return mix(c1,c2,f);
  if(idx==2) return mix(c2,c3,f);
  if(idx==3) return mix(c3,c4,f);
  if(idx==4) return mix(c4,c5,f);
  return mix(c5,c0,f);
}
vec3 pastelSpectrum(float t) {
  float x=fract(t)*7.;
  int idx=int(floor(x));
  float f=fract(x);
  vec3 c0=vec3(.94,.48,.48);
  vec3 c1=vec3(.95,.78,.44);
  vec3 c2=vec3(.64,.92,.45);
  vec3 c3=vec3(.42,.90,.88);
  vec3 c4=vec3(.44,.82,.96);
  vec3 c5=vec3(.56,.66,.98);
  vec3 c6=vec3(.84,.52,.94);
  if(idx==0) return mix(c0,c1,f);
  if(idx==1) return mix(c1,c2,f);
  if(idx==2) return mix(c2,c3,f);
  if(idx==3) return mix(c3,c4,f);
  if(idx==4) return mix(c4,c5,f);
  if(idx==5) return mix(c5,c6,f);
  return mix(c6,c0,f);
}
float microSparkle(vec2 cardUv, vec2 shift, float density) {
  vec2 p=(cardUv+shift)*vec2(96.,134.)*density;
  vec2 i=floor(p);
  vec2 f=fract(p);
  vec2 rnd=foilHash2(i);
  float d=length(f-(.18+.64*rnd));
  float h=foilHash(i+vec2(11.7,53.1));
  float speck=smoothstep(.28,.03,d)*step(.36,h);
  float bright=smoothstep(.18,.0,d)*step(.82,h);
  return clamp(speck*.55+bright*.75,0.,1.);
}
float nacreWavePattern(vec2 cardUv) {
  vec2 tile=fract(cardUv*vec2(3.,4.18))-.5;
  vec2 w=tile+vec2(.06*sin(tile.y*6.28318),-.06*sin(tile.x*6.28318));
  float astroid=pow(abs(w.x)+.001,.68)+pow(abs(w.y)+.001,.68);
  return .5+.5*cos(astroid*88.);
}
float embossFacetPattern(vec2 cardUv) {
  vec2 p=cardUv*vec2(3.,4.18);
  vec2 r=vec2(p.x+p.y,p.y-p.x)*2.2;
  vec2 cell=floor(r);
  vec2 f=fract(r);
  float dir=step(.5,foilHash(cell));
  float coord=mix(f.x,f.y,dir);
  float stripes=.5+.5*cos(coord*25.1327);
  float border=smoothstep(.0,.08,min(min(f.x,1.-f.x),min(f.y,1.-f.y)));
  return stripes*border;
}
const vec2 dir133=vec2(-.6819984,.7313537);
const vec2 dir115=vec2(-.4226183,.9063078);
const vec2 dir35=vec2(.8191520,.5735764);
const vec2 dirNeg35=vec2(.8191520,-.5735764);
vec3 previewFoil(vec2 uv, vec3 normal, vec3 view) {
  vec3 base=previewInk(texture2D(face,uv).rgb);
  if(previewKind<.5) return base;
  vec2 cardUv=vec2(uv.x,1.-uv.y);
  vec2 ptr=foilPointer(normal);
  vec2 bg=foilSweepOffset(ptr);
  float rT=foilRadialDistance(cardUv,ptr);
  float spot=1.-smoothstep(.05,.88,rT);
  float innerCore=1.-smoothstep(0.,.38,rT);
  float etched=etchMask(uv);
  float art=artWindow(uv);
  float line=etched*art;
  float stamp=clamp(etched*(1.-art)/.68,0.,1.);
  vec3 lamp=normalize(vec3((ptr-.5)*vec2(1.35,-1.35)+vec2(-.28,.36),1.));

  if(previewKind==8.) {
    // Glossy card finish: pack-fresh clear varnish sheen + soft radial studio glare + subtle ink-gloss catch.
    float sweep=dot(cardUv*vec2(.86,1.20)-(bg-.5)*1.25,dir133)-.42;
    float coatBand=exp(-(sweep*sweep)*5.5);
    float stripAxis=satinStripAxis(uv,normal,view);
    float strip=exp(-(stripAxis*stripAxis)*34.);
    float fineLine=smoothstep(.28,.90,etched)*art;
    float frameLines=smoothstep(.74,.96,etched*(1.-art));
    float inkGloss=1.+clamp(fineLine*.22+frameLines*.34,0.,1.);
    vec3 clearCoat=vec3(.97,.98,1.)*((.032+coatBand*.092+strip*.062)*spot+innerCore*.052)*inkGloss;
    vec3 res=foilSheenBlend(base,clearCoat*(1.+satinHoverGain*.25));
    // Keep clear varnish slightly softer independently of optional cardstock.
    return mix(base,applyStudioGlare(res,rT,.52),.9);
  }
  if(previewKind==1.) {
    // Etched gold foil: embossed contour bevels, warm champagne-gold leaf, and micro-sparkle (+10% gold highlight).
    float fineLine=smoothstep(.24,.88,etched)*art;
    vec2 d=vec2(.0015,0.);
    vec2 slopeArt=vec2(contour(uv+d)-contour(uv-d),contour(uv+d.yx)-contour(uv-d.yx));
    vec2 slopeAll=vec2(etchMask(uv+d)-etchMask(uv-d),etchMask(uv+d.yx)-etchMask(uv-d.yx));
    vec2 slope=mix(slopeAll*1.25,slopeArt,art);
    vec3 relief=normalize(vec3(-slope*(.56+1.08*spot)*6.6,1.));
    float shade=max(0.,dot(relief,lamp));
    float spec=max(0.,dot(relief,normalize(lamp+vec3(0.,0.,1.))));
    float s2=spec*spec,s4=s2*s2,s8=s4*s4,s16=s8*s8;
    float ridgeGlint=s16*s16;
    float ridgeEdge=clamp(length(slope)*4.2,0.,1.);

    vec3 goldInk=vec3(.88,.725,.42);
    float textPreserve=1.-smoothstep(.31,.71,inkLuma(base))*.80;
    base=mix(base,blendScreen(base,goldInk*.47),fineLine*.38);
    vec3 stampGold=mix(base+goldInk*.16,blendScreen(base,goldInk*.45),.48);
    base=mix(base,stampGold,stamp*textPreserve*.46);
    base*=1.+(fineLine*.82+stamp*textPreserve*.69)*(shade-.48)*.46;
    base+=vec3(.98,.90,.66)*ridgeGlint*(fineLine*.37+stamp*textPreserve*(.28+ridgeEdge*.47))*spot;

    float d1=fract(dot(cardUv*vec2(.92,1.28),dir133)*2.2+(bg.x+bg.y*.3)*1.25);
    float pillar=smoothstep(.11,.34,d1)*(1.-smoothstep(.38,.61,d1));
    vec3 champagne=mix(vec3(.92,.775,.45),vec3(.99,.935,.76),innerCore*.53+pillar*.47);
    vec3 warmSpectrum=mix(champagne,iridescentBands(cardUv.y*.55-bg.y*.55,2.),.08);

    float glit=microSparkle(cardUv,(ptr-.5)*.02,1.15);
    float geom=embossFacetPattern(cardUv*1.8);
    float stampTex=(.78+.22*geom)*(.31+.69*textPreserve);
    float metalMask=clamp(fineLine*.86+stamp*stampTex*.82,0.,1.);
    float sheenStrength=(.036+pillar*.050)*spot+metalMask*(.17+pillar*.29+spot*.23+ridgeGlint*.31);
    vec3 shine=warmSpectrum*sheenStrength+mix(champagne,vec3(1.),.53)*glit*(.029+.31*metalMask)*(.31+.69*spot);

    vec3 res=foilSheenBlend(base,shine*(1.+satinHoverGain*.30));
    return applyStudioGlare(res,rT,.40);
  }
  if(previewKind==2.) {
    // Prismatic foil: natural mylar rainbow diffraction bands with contour catch.
    float phase1=dot(cardUv-(bg-.5)*1.35,dir115);
    float phase2=dot(cardUv*.78+(bg-.5)*.85,dir35)+.14;
    vec3 rain=mix(pastelSpectrum(phase1),vividSpectrum(phase1+.06),.48);
    vec3 sun=iridescentBands(phase2,3.);
    vec3 rawPrism=mix(rain,sun,.35);
    vec3 prism=mix(vec3(inkLuma(rawPrism)),rawPrism,.84);

    float sweepOffset=(bg.x+bg.y*.25)*1.30;
    float d1=fract(dot(cardUv*vec2(.88,1.22),dir133)*2.15+sweepOffset);
    float d2=fract(dot(cardUv*vec2(1.24,1.72),dir133)*2.15-sweepOffset);
    float pillar1=smoothstep(.11,.34,d1)*(1.-smoothstep(.38,.61,d1));
    float pillar2=smoothstep(.13,.36,d2)*(1.-smoothstep(.40,.63,d2));
    float sheet=(.15+pillar1*.34+pillar2*.19)*(.35+.65*spot)+innerCore*.11;
    float fineLine=smoothstep(.24,.88,etched)*art;
    float frameLines=smoothstep(.74,.96,etched*(1.-art));
    float edgeBoost=1.+clamp(fineLine*.40+frameLines*.54,0.,1.)*.38;

    vec3 shine=prism*sheet*edgeBoost;
    vec3 dodged=foilSheenBlend(base,shine*(1.+satinHoverGain*.32));
    vec3 tinted=mix(dodged,blendOverlay(base,prism),clamp(sheet*.05,0.,.045));
    return applyStudioGlare(tinted,rT,.45);
  }
  if(previewKind==3.) {
    // Cold silver foil: brushed-aluminum grain with twin specular silver beams.
    float fineLine=smoothstep(.33,.90,etched)*art;
    float frameLines=smoothstep(.74,.96,etched*(1.-art));
    float silverMask=clamp(fineLine*.74+frameLines*.87,0.,1.);
    vec3 silverLeaf=mix(vec3(inkLuma(base)),vec3(.87,.91,.96),.38);
    base=mix(base,silverLeaf,silverMask*.205);

    float brushed=.89+.11*sin((cardUv.x*.32+cardUv.y*.95)*380.);
    float bgShift=bg.x+bg.y*.28;
    float d1=fract(dot(cardUv*vec2(.90,1.25),dir133)*2.25+bgShift*1.30);
    float d2=fract(dot(cardUv*vec2(1.28,1.78),dir133)*2.25-bgShift*1.15);
    float pillar1=smoothstep(.12,.33,d1)*(1.-smoothstep(.37,.58,d1));
    float core1=smoothstep(.26,.34,d1)*(1.-smoothstep(.36,.44,d1));
    float pillar2=smoothstep(.16,.36,d2)*(1.-smoothstep(.40,.60,d2));

    vec3 coolSpec=mix(vec3(.815,.89,.965),vec3(.96,.985,1.),core1*.62+innerCore*.38);
    float sheen=((.068+pillar1*.20+pillar2*.105)*spot+silverMask*(.13+pillar1*.30+core1*.20+spot*.205))*brushed;
    vec3 shine=coolSpec*sheen;

    vec3 res=foilSheenBlend(base,shine*(1.+satinHoverGain*.32));
    return applyStudioGlare(res,rT,.42);
  }
  vec2 tilt=(pointer-.5)*2.;
  if(previewKind==4.) {
    // Opal embossed foil: contour relief bevels and mother-of-pearl nacre.
    vec4 facet=opalFacet(uv,tilt,normal,view);
    float stripAxis=satinStripAxis(uv,normal,view);
    float highlight=exp(-(stripAxis*stripAxis)*85.);
    float h=smoothstep(.20,.86,line);
    vec2 d=vec2(.0017,0.);
    vec2 slopeArt=vec2(contour(uv+d)-contour(uv-d),contour(uv+d.yx)-contour(uv-d.yx));
    vec2 slopeAll=vec2(etchMask(uv+d)-etchMask(uv-d),etchMask(uv+d.yx)-etchMask(uv-d.yx));
    vec2 slope=mix(slopeAll*1.25,slopeArt,art);
    float pressure=.48+1.15*spot;
    vec3 relief=normalize(vec3(-slope*pressure*6.8,1.));
    float shade=max(0.,dot(relief,lamp));
    float spec=max(0.,dot(relief,normalize(lamp+vec3(0.,0.,1.))));
    float s2=spec*spec,s4=s2*s2,s8=s4*s4,s16=s8*s8;
    float glint=(s16*s16*spec)*(.35+.65*spot);
    float ridgeEdge=clamp(length(slope)*4.2,0.,1.);

    vec3 pearl1=pastelSpectrum(dot(cardUv*.68+(ptr-.5)*.55,dirNeg35));
    vec3 pearl2=mix(vec3(.58,.94,.79),vec3(.89,.76,.96),.5+.5*sin(dot(cardUv,vec2(2.4,1.8))-(bg.x-bg.y)*3.2));
    vec3 rawNacre=mix(pearl1,pearl2,.52);
    vec3 nacre=mix(vec3(inkLuma(rawNacre)),rawNacre,.82);
    float wave=.77+.23*nacreWavePattern(cardUv)*(.65+.35*etched);

    float textPreserve=1.-smoothstep(.31,.71,inkLuma(base))*.79;
    vec3 opalStampInk=mix(vec3(.48,.82,.68),nacre,.48);
    base=mix(base,blendScreen(base,opalStampInk*.35),stamp*textPreserve*(.40+.19*wave));
    base=base*(1.+(h*.86+stamp*textPreserve*.74)*(shade-.48)*.58)+vec3(.66,.97,.84)*glint*(h*.75+stamp*textPreserve*(.39+ridgeEdge*.54));
    base=mix(base,facet.rgb,facet.a*.85*(.20+.80*clamp(h+stamp*textPreserve,0.,1.)));

    float glit=microSparkle(cardUv,(ptr-.5)*.02,1.10);
    float opalMask=clamp(h*.78+stamp*(.34+.66*textPreserve)*(.68+.27*wave),0.,1.);
    vec3 shine=nacre*wave*((.12+.135*spot)*spot+opalMask*(.20+.30*spot+highlight*.22))
             +mix(nacre,vec3(1.),.60)*glit*(.039+.255*opalMask)*(.32+.68*spot);

    vec3 res=foilSheenBlend(base,shine*(1.+satinHoverGain*.32));
    return applyStudioGlare(res,rT,.47);
  }

${e.liquid ? a : ""}
  return base;
}`;
}
const s = c();
export {
  s as F,
  r as a,
  c as f
};
