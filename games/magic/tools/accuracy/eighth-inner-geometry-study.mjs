import assert from 'node:assert/strict';
import { hash } from './common.mjs';
/** Reuse the measured basic-land inner warp as a proposal for the same source family. */
export function eighthInnerGeometryStudy(expected) {
  return {
    name: 'eighth-inner-geometry-proposal',
    enforce: 'pre',
    transform(source, id) {
      if (id.endsWith('/presentation/frame-plate-paint.ts')) {
        assert.equal(hash(source), expected.painter);
        const marker = '    m.drawImage(required(plate.rightFrame), 0, 0, mix.width, mix.height);';
        assert.equal(source.split(marker).length, 2);
        return {
          code: source.replace(
            marker,
            '    if (usesEighthBasicGeometry(face,plate.rightFrame)) { m.save(); m.scale(1.5,1.5); paintEighthBasicFrame(m,required(plate.rightFrame)); m.restore(); } else ' +
              marker.trim(),
          ),
          map: null,
        };
      }
      if (!id.endsWith('/presentation/eighth-basic-geometry.ts')) return;
      assert.equal(hash(source), expected.geometry);
      const start = source.indexOf('export function usesEighthBasicGeometry(');
      const end = source.indexOf('\nconst x =', start);
      assert(start >= 0 && end > start);
      return {
        code:
          source.slice(0, start) +
          `export function usesEighthBasicGeometry(face:RenderedCardInput,source:string):boolean {
   const root=CONJURER_ROOT+'/img/frames/8th/';
   const filename=source.startsWith(root)?source.slice(root.length):'';
   return face.setCode?.toLowerCase()==='8ed' && face.frameAssetFamily==='eighth' &&
    !face.frameTemplate && !face.frameTreatment && (!face.layout || face.layout==='normal') &&
    (!face.borderColor || face.borderColor==='white') &&
    /^(?:[wubrgam]l?|l)[.]png$/.test(filename);
  }
` +
          source.slice(end),
        map: null,
      };
    },
  };
}
