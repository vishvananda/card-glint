/** Inverse silhouette map: keep in step with Rust deformation::Shape::source. */
export const DEFORMATION_GLSL = `
vec2 cardSource(vec2 local,float time,vec2 shape){
 float amount=shape.x,phase=shape.y*6.28318530718;
 if(amount==0.)return local;
 return local+amount*vec2(
  .72*sin(local.y*43.+time*2.1+phase)+.28*sin(local.y*81.-time*3.4+phase*.7),
  .18*sin(local.x*29.-time*1.3+phase));
}
`;
