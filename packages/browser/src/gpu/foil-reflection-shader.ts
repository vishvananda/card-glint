// Shared reflection response for production DOM, native table and 3D faces.
export const FOIL_REFLECTION_GLSL = `
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
