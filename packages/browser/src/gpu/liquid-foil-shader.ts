/** Optional host-supplied height-field coating; no simulation or scheduling. */
export const LIQUID_FOIL_GLSL = `
  if(previewKind>=5.) {
    vec2 d=vec2(1./244.,1./340.);
    float height=texture2D(wave,uv).r*hasWave;
    vec2 gradient=vec2(texture2D(wave,uv+vec2(d.x,0.)).r-texture2D(wave,uv-vec2(d.x,0.)).r,
      texture2D(wave,uv+vec2(0.,d.y)).r-texture2D(wave,uv-vec2(0.,d.y)).r)*hasWave;
    vec4 bounds=vec4(.03937,.02531,.96063,.96063);
    float edge=min(min(uv.x-bounds.x,bounds.z-uv.x),min(uv.y-bounds.y,bounds.w-uv.y));
    float window=smoothstep(0.,max(fwidth(edge),.00001),edge);
    gradient*=smoothstep(0.,.016,edge);
    vec2 shift=gradient*1.3;
    shift*=min(1.,max(0.,edge-.0015)/max(length(shift),.00001));
    // The bounded shift cannot cross the border. Preserve texture filtering
    // there instead of snapping the sample to an inset art rectangle.
    base=previewInk(texture2D(face,uv+shift).rgb);
    vec3 fluidNormal=normalize(vec3(-gradient*32.,1.));
    // Ripple glints perturb the same reflected strip as cold/prismatic foil.
    // At rest their angle is identical, including the card's physical tilt.
    vec3 tangent=normalize(vec3(normal.z,0.,-normal.x));
    vec3 bitangent=normalize(cross(normal,tangent));
    vec3 rippleNormal=normalize(normal+tangent*fluidNormal.x+bitangent*fluidNormal.y);
    float spec=exp(-pow(satinStripAxis(uv,rippleNormal,view),2.)*620.);
    float crest=smoothstep(.0003,.012,length(gradient));
    vec3 fluid=base;
    if(window>0.) {
      if(previewKind==5.) {
        fluid+=vec3(.10,.16,.17)*crest;
        fluid=mix(fluid,mix(vec3(.12,.38,.48),vec3(.9,.99,1.),spec),.012+crest*.11+spec*crest*.75);
      } else {
        float phase=height*15.+fluidNormal.x*1.7+fluidNormal.y*1.3+dot(uv,vec2(.12,.18));
        fluid=mix(fluid,mix(spectrum(phase),vec3(1.),spec*.3),min(.85,.06+crest*.64+spec*crest*.24));
      }
    }
    base=mix(base,fluid,window);
    return mix(base,satin(uv,base,normal,view,previewKind==6.?2.:3.,0.),.65);
  }
`;
