import { FOIL_PREVIEW_GLSL } from './foil-preview-shader.js';
export const vertex = `#version 300 es
layout(location=0) in vec2 position;
layout(location=1) in mat4 model;
layout(location=5) in vec3 instanceNormal;
layout(location=6) in float instanceFinish;
uniform mat4 viewProjection;
out vec2 v_uv;out vec3 v_normal;flat out float previewKind;
void main(){v_uv=position;v_normal=instanceNormal;previewKind=instanceFinish;gl_Position=viewProjection*model*vec4(position,0.,1.);}`;
const foil = FOIL_PREVIEW_GLSL.replace(
  'uniform float previewKind;',
  'flat in float previewKind;',
).replaceAll('texture2D(mask,uv).r*hasMask', 'edgeCoverage(uv)');
export const fragment = `#version 300 es
precision highp float;
in vec2 v_uv;in vec3 v_normal;
uniform sampler2D face;uniform sampler2D mask;uniform sampler2D overlay;uniform sampler2D coverage;
uniform vec2 pointer;uniform vec4 artBounds[8];
uniform float hasMask;uniform float cornerRadius;uniform float aspect;uniform float finishBase;
out vec4 out_color;
#define texture2D texture
float edgeCoverage(vec2 uv){vec4 c=texture(coverage,uv);return max(texture(mask,uv).r*hasMask,c.b)*(1.-c.a);}
${foil}
void main(){
 vec2 uv=vec2(v_uv.x,1.-v_uv.y);
 vec2 corner=abs((uv-.5)*vec2(1.,aspect))-(vec2(.5,aspect*.5)-cornerRadius);
 if(length(max(corner,0.))+min(max(corner.x,corner.y),0.)-cornerRadius>0.)discard;
 vec3 view=normalize(vec3((uv-.5)*vec2(-.65,-.90),1.));
 vec3 shaded=previewLinear(previewFoil(uv,normalize(v_normal),view));
 vec3 base=texture(face,uv).rgb;
 vec4 c=texture(coverage,uv),top=texture(overlay,uv);
 vec3 under=mix(base,shaded,max(finishBase,c.r)*(1.-c.g));
 out_color=vec4(previewInk(mix(under,top.rgb,top.a)),1.);
}`;
export const imageFragment = `#version 300 es
precision highp float;in vec2 v_uv;uniform sampler2D face;out vec4 out_color;
void main(){out_color=texture(face,vec2(v_uv.x,1.-v_uv.y));if(out_color.a<.001)discard;}`;
