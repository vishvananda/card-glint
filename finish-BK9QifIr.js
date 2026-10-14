const a = `
  if(previewKind>=5.) {
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
`, i = `
uniform float satinCompact;
uniform float satinHoverGain;
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
  float broad=exp(-dot((broadQ-vec2(-.10,.17))*vec2(2.1,1.1),(broadQ-vec2(-.10,.17))*vec2(2.1,1.1)))*.46;
  float stripAxis=satinStripAxis(uv,normal,view);
  float strip=exp(-pow(stripAxis,2.)*340.)*.32;
  float reflection=broad+strip;
  float fresnel=.10+.75*pow(1.-abs(dot(normal,view)),4.);
  vec3 bands=spectrum(uv.x*.78+uv.y*.34+reflected.x*1.55+reflected.y*.90);
  vec3 substrate=base*vec3(.91,.96,1.02);
  vec3 light=vec3(.82,.93,1.)*reflection*(.78+fresnel);
  if (kind==1.) {
    substrate=base*mix(vec3(1.),vec3(.98,.94,.85),.40);
    reflection=broad*.40+strip*(.16+metal*2.5);
    light=mix(vec3(1.,.86,.61),vec3(1.,.93,.76),metal)*reflection*(.70+fresnel+metal*.90);
  } else if(kind==2.) {
    substrate=base*(.94+.06*mix(vec3(1.),bands,.80));
    // Keep the broad rainbow translucent; concentrate the shine into the
    // reflected strip so the illustration retains its contrast on hover.
    reflection=broad*.24+strip*.58;
    light=mix(vec3(1.,.98,.94),bands,.85)*reflection*(.72+fresnel);
    light+=vec3(1.,.99,.96)*exp(-pow(stripAxis,2.)*620.)*.075;
  } else if(kind==3.) {
    // Keep cold foil's ink contrast while retaining its broad cool reflection.
    light*=.75;
  } else if(kind==4.) {
    // Opal reflects jade and mint light without a cool white veil over its pigment.
    substrate=base*vec3(.94,1.,.96);
    reflection=broad*.24+strip*.58;
    light=vec3(.36,.88,.52)*reflection*(.78+fresnel);
  }
  return substrate+light*(1.+satinHoverGain);
}
vec4 opalFacet(vec2 uv, vec2 tilt, vec3 normal, vec3 view) {
  vec2 grid=uv*vec2(17.,17.*aspect), cell=floor(grid), p=fract(grid);
  float triangle=step(p.x,p.y);
  float seed=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
  vec3 facet=normalize(vec3((seed-.5)*1.25,(triangle-.5)*.8,1.));
  vec3 lamp=normalize(vec3(tilt*.6+vec2(-.4,.45),1.));
  float flash=pow(max(0.,dot(facet,normalize(lamp+vec3(0.,0.,1.)))),30.);
  flash*=exp(-pow(satinStripAxis(uv,normal,view),2.)*340.);
  vec3 opal=mix(spectrum(seed*.6+triangle*.12+tilt.x*.17),vec3(.96,.98,1.),.45);
  return vec4(opal,.10+flash*.42);
}
`;
function r(e = {}) {
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
${i}
${t}
// Gameplay mask alpha is stored unchanged in a linear R8 red channel.
float contour(vec2 uv) { return texture2D(mask,uv).r*hasMask*artWindow(uv); }
vec3 previewFoil(vec2 uv, vec3 normal, vec3 view) {
  vec3 base=previewInk(texture2D(face,uv).rgb);
  if(previewKind==1.) {
    float etched=texture2D(mask,uv).r*hasMask;
    float art=artWindow(uv), line=etched*art*.45, stamp=etched*(1.-art)/.68*.42;
    base=1.-(1.-base)*(1.-vec3(.78,.56,.24)*.46*line);
    base=mix(base,base*vec3(.66,.45,.20),stamp);
    return satin(uv,base,normal,view,1.,clamp(line+stamp,0.,1.));
  }
  if(previewKind==2. || previewKind==3.) return satin(uv,base,normal,view,previewKind,0.);
  vec2 tilt=(pointer-.5)*2.;
  if(previewKind==4.) {
    vec4 facet=opalFacet(uv,tilt,normal,view);
    float highlight=exp(-pow(satinStripAxis(uv,normal,view),2.)*340.);
    vec3 lamp=normalize(vec3(tilt*.6+vec2(-.4,.45),1.));
    base=mix(base,facet.rgb,facet.a);
    float h=contour(uv); vec2 d=vec2(.002,0.);
    vec2 slope=vec2(contour(uv+d)-contour(uv-d),contour(uv+d.yx)-contour(uv-d.yx));
    float pressure=.35+1.65*exp(-dot(uv-pointer,uv-pointer)*42.);
    vec3 relief=normalize(vec3(-slope*pressure*8.,1.));
    float shade=max(0.,dot(relief,lamp));
    float glint=pow(max(0.,dot(relief,normalize(lamp+vec3(0.,0.,1.)))),48.)*highlight;
    // Stronger bevel contrast and mint highlights keep the raised contour
    // visible without increasing the broad satin wash or triangular facets.
    base=base*(1.+h*(shade-.5)*.80)+vec3(.52,.97,.74)*glint*h*1.05;
    float stamp=clamp(texture2D(mask,uv).r*hasMask*(1.-artWindow(uv))/.68,0.,1.);
    // Jade pigment preserves the printed rules. Its mint glint follows the
    // same reflected strip as the satin surface, including card tilt.
    base*=mix(vec3(1.),vec3(.36,.72,.51),stamp*.34);
    return mix(base,satin(uv,base,normal,view,4.,0.),.75)+vec3(.52,.97,.74)*highlight*stamp*.28;
  }

${e.liquid ? a : ""}
  return base;
}`;
}
const s = r();
export {
  s as F,
  i as a,
  r as f
};
