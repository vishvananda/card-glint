// Independently authored diffraction response. Fine grooves stay attached to
// the printed patch while reflected light follows the surface normal/view.
export const HOLOGRAM_GLSL = `
uniform sampler2D hologramMask;
uniform vec4 hologramRect;
uniform vec2 hologramMaterial;
vec3 localHologram(vec2 uv, vec3 ink, vec3 normal, vec3 view, float grainFilter) {
  if(hologramMaterial.x<=0.) return ink;
  vec2 p=(uv-hologramRect.xy)/hologramRect.zw;
  if(any(lessThan(p,vec2(0.))) || any(greaterThan(p,vec2(1.)))) return ink;
  float cover=texture(hologramMask,p).a*hologramMaterial.x;
  if(cover<=0.) return ink;
  vec3 reflected=reflect(-view,normal);
  vec2 light=reflected.xy/max(abs(reflected.z),.25)+(pointer-.5)*.85;
  float seed=hologramMaterial.y;
  float axisA=dot(p,vec2(1.6,.45))+dot(light,vec2(1.1,.65))+seed;
  float axisB=dot(p,vec2(-.7,1.9))+dot(light,vec2(-.8,1.3))+seed*.37;
  // Reuse the card foil's mylar spectra while retaining patch-local axes,
  // stationary grooves and the printed emblem's luminance.
  vec3 rainbow=mix(pastelSpectrum(axisA),vividSpectrum(axisA+.06),.48);
  vec3 rawDiffraction=mix(rainbow,iridescentBands(axisB,3.),.35);
  vec3 diffraction=mix(vec3(inkLuma(rawDiffraction)),rawDiffraction,.84);
  float stripe=dot(p,vec2(24.,8.));
  float grain=1.-.035*(.5+.5*cos(stripe*6.2831853))*grainFilter;
  float broad=exp(-dot(light-vec2(-.15,.12),light-vec2(-.15,.12))*2.8);
  float flash=exp(-pow(dot(p-.5,vec2(.7,.25))+dot(light,vec2(.85,.4)),2.)*70.);
  float luminance=dot(ink,vec3(.2126,.7152,.0722));
  vec3 silver=ink*(.80+.12*broad)*grain;
  vec3 colored=diffraction*(.12+.28*broad+.25*flash)*(.25+.75*luminance);
  vec3 specular=vec3(1.,.99,.96)*flash*.24;
  return mix(ink,silver+colored+specular,cover);
}
`;
