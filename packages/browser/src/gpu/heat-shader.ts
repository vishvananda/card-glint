/** Broad horizontal air layers: lateral distortion with a small softening kernel. */
export const HEAT_GLSL = `
vec3 heatHaze(vec2 uv,vec3 normal){
 float t=surfaceTime,seed=surfaceInfo.z*29.;
 vec2 p=uv*vec2(1.8,32.)+vec2(seed,-t*.9)+normal.xy*.4;
 float air=surfaceNoise(p),fine=surfaceNoise(p*vec2(1.7,1.8)+vec2(t*.15,-t*.6));
 float ribbon=sin(uv.y*90.-t*3.1+air*4.+uv.x*1.5);
 vec2 displacement=vec2(ribbon*.0036+(fine-.5)*.0045,(air-.5)*.00065);
 displacement.x+=normal.x*(air-.5)*.01;
 vec2 radius=vec2(.0016+fine*.0008,.0004/aspect);
 vec3 ink=softenedInk(uv+displacement,radius);
 float reflection=surfaceReflection(uv+displacement,normal,24.);
 return ink*vec3(1.01,1.,.99)+vec3(1.,.87,.70)*reflection*.065;
}
`;
