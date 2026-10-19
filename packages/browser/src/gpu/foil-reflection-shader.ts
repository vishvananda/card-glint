import { STUDIO_LIGHTING_GLSL } from './studio-lighting-shader.js';

// Shared reflection and studio-lighting helpers for card finishes and living surfaces.
export const FOIL_REFLECTION_GLSL = `${STUDIO_LIGHTING_GLSL}
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
  if(studioLighting>.5)return studioFoilCenter(normal);
  vec2 delta = vec2(normal.x * 2.63, normal.y * 3.33) + vec2(pointer.x - .5, .5 - pointer.y);
  // Keep the flat-pose studio offset, but taper it broadly. A narrow Gaussian
  // folds the light path near zero: highlights reverse as the card keeps turning.
  // Here the offset Jacobian norm is <= length(vec2(.18,.20))*sqrt(4/e) < .33,
  // so the unclamped mapping stays monotone with gain bounded by .67..1.33.
  vec2 rest = vec2(-.18, -.20) * exp(-dot(delta, delta) * 2.);
  return clamp(vec2(.5) + delta + rest, 0., 1.);
}
vec2 foilSweepOffset(vec2 ptr) {
  return mix(vec2(.37, .33), vec2(.63, .67), ptr);
}
float foilRadialDistance(vec2 cardUv, vec2 ptr) {
  const vec2 cardAspect = vec2(.718, 1.);
  if(studioLighting>.5)return length((cardUv-ptr)*cardAspect)/.72;
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
  if(studioLighting>.5){vec2 q=vec2(uv.x,1.-uv.y)-studioFoilCenter(normal);return dot(q,vec2(.65,.18));}
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*1.1;
  return mix(q.x+.12+q.y*.2,
    (uv.x-pointer.x)*.65+(uv.y-pointer.y)*.18+dot(reflected.xy,vec2(.16,.10)),satinCompact);
}
vec3 satin(vec2 uv, vec3 base, vec3 normal, vec3 view, float kind, float metal) {
  vec3 reflected=reflect(-view,normal);
  vec2 q=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*1.1;
  vec2 broadQ=mix(q,reflected.xy/max(abs(reflected.z),.25)+vec2(-.10,.17)+(pointer-.5)*.28,satinCompact);
  if(studioLighting>.5)broadQ=vec2(-.10,.17)+vec2(uv.x,1.-uv.y)-studioFoilCenter(normal);
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
  if(studioLighting>.5){facet=studioDetailNormal(facet,normal);lamp=normalize(studioLampPosition);}
  float spec=max(0.,dot(facet,normalize(lamp+vec3(0.,0.,1.))));
  float s2=spec*spec,s4=s2*s2,s8=s4*s4;
  float stripAxis=satinStripAxis(uv,normal,view);
  float flash=(s8*s8*s8)*exp(-(stripAxis*stripAxis)*90.);
  vec3 opal=mix(spectrum(seed*.6+triangle*.12+tilt.x*.17),vec3(.92,.99,.96),.50);
  return vec4(opal,flash*.40);
}
`;
