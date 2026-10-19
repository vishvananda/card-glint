/** Shared virtual studio for normal-driven foil and clear-coat lighting. */
export const STUDIO_LIGHTING_GLSL = `
#ifndef GLINT_STUDIO_LIGHTING_UNIFORM
#define GLINT_STUDIO_LIGHTING_UNIFORM
uniform float studioLighting;
#endif
#ifndef GLINT_LIGHTING_POINTER
#define GLINT_LIGHTING_POINTER (studioLighting>.5?vec2(.5):pointer)
#endif
const vec3 studioLampPosition=vec3(-.85,1.10,3.);
const vec3 studioEyePosition=vec3(0.,0.,2.1);
void studioCardBasis(vec3 normal,out vec3 right,out vec3 up){
 vec3 n=normalize(normal);
 float cy=max(length(n.yz),.0001),sx=-n.y/cy,cx=n.z/cy;
 right=vec3(cy,sx*n.x,-cx*n.x);up=vec3(0.,cx,sx);
}
vec3 studioCardPosition(vec2 uv,vec3 normal){
 vec3 right,up;studioCardBasis(normal,right,up);
 return right*((uv.x-.5)/aspect)+up*(uv.y-.5);
}
vec3 studioCardView(vec2 uv,vec3 normal){
 return normalize(studioEyePosition-studioCardPosition(uv,normal));
}
vec3 studioDetailNormal(vec3 detail,vec3 normal){
 vec3 right,up;studioCardBasis(normal,right,up);
 return normalize(right*detail.x+up*detail.y+normalize(normal)*detail.z);
}
// Mirror the fixed lamp through the card plane, then intersect the eye-to-image
// ray with that plane. Keep the source outside the card when it leaves the face.
vec2 studioFoilCenter(vec3 normal){
 vec3 n=normalize(normal),right,up;studioCardBasis(n,right,up);
 vec3 image=studioLampPosition-2.*n*dot(studioLampPosition,n);
 vec3 ray=image-studioEyePosition;
 float denominator=dot(n,ray);
 if(denominator>=-.0001)return vec2(4.);
 vec3 hit=studioEyePosition-ray*(dot(n,studioEyePosition)/denominator);
 return vec2(.5+dot(hit,right)*aspect,.5-dot(hit,up));
}
`;
