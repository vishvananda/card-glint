import assert from 'node:assert/strict';
/** Colored artifact source-only probe. Production selectors stay unchanged. */
export function modernColoredArtifactStudy({ pinlines = false } = {}) {
  return {
    name: 'm21-colored-artifact-source-study',
    enforce: 'pre',
    transform(source, id) {
      if (id.endsWith('/presentation/modern-printing-profile.ts')) {
        const needle = 'export function modernOrdinaryPlates(face: RenderedCardInput) {';
        assert.equal(source.split(needle).length, 2);
        const addition =
          needle +
          `
  if (face.setCode?.toLowerCase() === 'm21' && face.artifact && face.colors?.length === 1) {
    const source = manifest.CONJURER_ROOT + '/img/frames/m15/new/a.png';
    const plates = modernPrintingProfile(face)?.ordinaryPlates;
    const fit = plates?.[source];
    if (!fit) throw Error('Missing source-bound artifact plate fit');
    const colored = manifest.CONJURER_ROOT + '/img/frames/m15/new/' + face.colors[0].toLowerCase() + '.png';
    return { [source]: fit, ${pinlines ? '[colored]: plates![colored]!,' : ''} };
  }`;
        return { code: source.replace(needle, addition), map: null };
      }
      if (!pinlines) return;
      if (id.endsWith('/presentation/frame-plates.ts')) {
        const needle = '    plate.frame,';
        assert.equal(source.split(needle).length, 2);
        return {
          code: source.replace(
            needle,
            needle +
              `
    ...(face.artifact && face.setCode?.toLowerCase()==='m21' && face.colors?.length===1 ? [
     CONJURER_ROOT+'/img/frames/m15/new/'+face.colors[0].toLowerCase()+'.png',
     CONJURER_ROOT+'/img/frames/m15/new/pinline.png'] : []),`,
          ),
          map: null,
        };
      }
      if (id.endsWith('/presentation/frame-plate-paint.ts')) {
        const needle = '  paintMountedSecurityStamp(c, face, images);';
        assert.equal(source.split(needle).length, 2);
        return {
          code: source.replace(
            needle,
            `
  if(face.artifact && face.setCode?.toLowerCase()==='m21' && face.colors?.length===1) {
   const scratch=rasterCanvas();scratch.width=732;scratch.height=1020;
   try {
    const m=scratch.getContext('2d')!;
    const root=plate.frame.slice(0,plate.frame.lastIndexOf('/'));
    m.drawImage(required(root+'/'+face.colors[0].toLowerCase()+'.png'),0,0,732,1020);
    m.globalCompositeOperation='destination-in';
    m.drawImage(required(root+'/pinline.png'),0,0,732,1020);
    c.drawImage(scratch,0,0,W,H);
   } finally {scratch.width=scratch.height=0;}
  }
` + needle,
          ),
          map: null,
        };
      }
    },
  };
}
