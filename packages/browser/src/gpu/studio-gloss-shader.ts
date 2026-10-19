/** Experimental clear varnish in a fixed studio, measured in card heights.
 * Reflect a soft rectangular emitter; cursor and time do not move the lamp.
 * This is a blurred area-reflection approximation, not a GGX integration. */
export const STUDIO_GLOSS_GLSL = `
vec3 studioGloss(vec3 ink, vec3 normal, vec3 view, vec3 position) {
  vec3 n=normalize(normal),v=normalize(view);
  float nv=dot(n,v);
  if(nv<=0.)return ink;
  vec3 ray=reflect(-v,n);
  if(ray.z<=.0001)return ink;
  const vec3 lamp=vec3(-.85,1.10,3.);
  const vec2 halfSize=vec2(.52,.95);
  float travel=(lamp.z-position.z)/ray.z;
  if(travel<=0.)return ink;
  vec2 hit=(position+ray*travel).xy-lamp.xy;
  // A modest reflection cone softens the source without pinning it to the face.
  float blur=.10+travel*.08;
  vec2 edge=abs(hit)-halfSize;
  vec2 coverage=vec2(1.)-smoothstep(vec2(-blur),vec2(blur),edge);
  float source=coverage.x*coverage.y;
  float grazing=1.-clamp(nv,0.,1.);
  float g2=grazing*grazing;
  float fresnel=.035+.965*g2*g2*grazing;
  // Restrained pack-fresh varnish, with a nearly neutral softbox reflection.
  vec3 reflected=vec3(1.00,.99,.97)*source*fresnel*.78;
  vec3 linearInk=previewLinear(ink);
  return previewInk(clamp(linearInk*(1.-source*fresnel*.15)+reflected,0.,1.));
}
`;
