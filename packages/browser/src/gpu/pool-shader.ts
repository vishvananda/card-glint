/** Traveling wave slopes and a bounded ray-footprint focusing approximation. */
export const POOL_GLSL = `
vec2 rippleSlope(vec2 p,vec4 r){
 float age=surfaceTime-r.z;
 if(age<0. || age>2.8 || r.w==0.)return vec2(0.);
 vec2 d=(p-r.xy)*vec2(1.,aspect);float radius=length(d),front=radius-age*.32;
 float envelope=exp(-front*front*180.)*exp(-age*1.4)*smoothstep(0.,.08,age);
 return d/max(radius,.001)*cos(front*65.)*envelope*r.w*.12;
}
struct PoolField{vec2 slope;vec3 curvature;};
PoolField poolField(vec2 p,float t){
 const vec2 waves[6]=vec2[6](vec2(18.,6.),vec2(-7.,23.),vec2(25.,-19.),
   vec2(-22.,-13.),vec2(38.,9.),vec2(12.,-35.));
 const float heights[6]=float[6](.0038,.0028,.0018,.0024,.0009,.0011);
 PoolField field=PoolField(vec2(0.),vec3(0.));
 // Continuous transport, not cells oscillating around fixed lattice centers.
 p-=vec2(.043,.027)*t;
 for(int i=0;i<6;i++){
  vec2 k=waves[i];float n=float(i);
  float phase=dot(k,p)-t*(.31+n*.137)+surfaceInfo.z*37.+n*2.39;
  field.slope-=k*(heights[i]*sin(phase));
  field.curvature-=vec3(k.x*k.x,k.y*k.y,k.x*k.y)*(heights[i]*cos(phase));
 }
 return field;
}
float poolFocus(vec3 curvature){
 // Area of a refracted light footprint: convergence brightens the pool floor.
 // Bounded and filtered at folds; this is not a multi-ray caustic solver.
 vec3 h=curvature*.72;
 float determinant=(1.+h.x)*(1.+h.y)-h.z*h.z;
 float width=max(.065,fwidth(determinant)*.65);
 return pow(width/(abs(determinant)+width),1.25);
}
vec3 poolWater(vec2 uv,vec3 normal){
 float t=surfaceTime;
 vec2 p=uv*vec2(1.,aspect),slosh=surfaceInfo.xy;
 PoolField field=poolField(p,t);
 vec2 slope=field.slope;
 slope+=vec2(sin(p.y*5.+t*1.4),cos(p.x*6.-t*1.3))*length(slosh)*1.8+slosh*.4;
 slope+=normal.xy*.075;
 slope+=rippleSlope(uv,ripple0)+rippleSlope(uv,ripple1)+rippleSlope(uv,ripple2)+rippleSlope(uv,ripple3);
 vec2 under=uv+slope*vec2(.055,.055/aspect);
 // One inverse-footprint estimate moves the focused light onto the floor.
 PoolField floorField=poolField(p-field.slope*.72+slosh*.25,t);
 float caustics=poolFocus(floorField.curvature);
 vec3 ink=refractedInk(under)*vec3(.86,.97,1.);
 vec3 waterNormal=normalize(normal+vec3(-slope*1.5,0.));
 float reflection=surfaceReflection(uv,waterNormal,36.);
 return ink*(.96+caustics*.52)+vec3(.50,.91,1.)*caustics*.22+vec3(.75,.94,1.)*reflection*.12;
}
`;
