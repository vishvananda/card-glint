/** Periodic height field shared by surface normals and the light projection mesh. */
export const WATER_WAVES_GLSL = `
const float waterPeriod=2.;
const float waterDepth=.65;
vec3 waterField(vec2 p,float t){
 // Non-orthogonal 9-wave quasi-periodic standing/counter-propagating spectrum
 // across varied scales (|w| = 5.1..10.8) so caustics undulate in place like a
 // bounded pool rather than drifting in one direction.
 const vec2 waves[9]=vec2[9](
   vec2(5.,1.),vec2(3.,5.),vec2(-2.,6.),
   vec2(-6.,3.),vec2(-7.,-2.),vec2(-3.,-7.),
   vec2(4.,-7.),vec2(9.,-4.),vec2(6.,9.)
 );
 const float heights[9]=float[9](.00372,.002976,.002604,.002294,.001922,.001798,.00155,.001054,.000868);
 vec3 field=vec3(0.);
 for(int i=0;i<9;i++){
  vec2 k=waves[i]*3.14159265359;float n=float(i);
  float kp=dot(k,p),freq=.42+n*.095;
  float phaseA=kp-t*freq+n*2.39996;
  float phaseB=kp+t*(freq*.86)+n*4.12345;
  float h=heights[i];
  field.xy-=k*(h*(sin(phaseA)+.85*sin(phaseB)));
  field.z+=h*(cos(phaseA)+.85*cos(phaseB));
 }
 return field;
}
`;
