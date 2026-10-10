/** Periodic height field shared by surface normals and the light projection mesh. */
export const WATER_WAVES_GLSL = `
const float waterPeriod=2.;
const float waterDepth=.65;
vec3 waterField(vec2 p,float t){
 const vec2 waves[6]=vec2[6](vec2(6.,2.),vec2(-2.,7.),vec2(8.,-6.),
   vec2(-7.,-4.),vec2(12.,3.),vec2(4.,-11.));
 const float heights[6]=float[6](.008,.006,.003,.004,.0015,.002);
 vec3 field=vec3(0.);
 p-=vec2(.043,.027)*t;
 for(int i=0;i<6;i++){
  vec2 k=waves[i]*3.14159265359;float n=float(i);
  float phase=dot(k,p)-t*(.31+n*.137)+n*2.39;
  field.xy-=k*(heights[i]*sin(phase));
  field.z+=heights[i]*cos(phase);
 }
 return field;
}
`;
