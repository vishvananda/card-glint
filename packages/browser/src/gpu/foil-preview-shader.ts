import { LIQUID_FOIL_GLSL } from './liquid-foil-shader.js';
import { FOIL_REFLECTION_GLSL } from './foil-reflection-shader.js';

// Shared by the DOM motion fixture and the 3D card face pass. Preview finishes
// are presentation settings, not inventory finish identifiers.
export function foilShader(
  options: { artWindows?: 'array' | 'pair'; liquid?: boolean } = {},
): string {
  const artWindow =
    options.artWindows === 'pair'
      ? `float artWindow(vec2 uv) {
    float first=step(artBounds.x,uv.x)*step(uv.x,artBounds.z)*step(artBounds.y,uv.y)*step(uv.y,artBounds.w);
    float second=step(artBounds2.x,uv.x)*step(uv.x,artBounds2.z)*step(artBounds2.y,uv.y)*step(uv.y,artBounds2.w);
    return max(first,second);
  }`
      : `float artWindow(vec2 uv) {
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
${FOIL_REFLECTION_GLSL}
${artWindow}
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

${options.liquid ? LIQUID_FOIL_GLSL : ''}
  return base;
}`;
}
export const FOIL_PREVIEW_GLSL = foilShader();
