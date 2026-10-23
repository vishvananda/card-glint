import assert from 'node:assert/strict';
import { hash } from './common.mjs';
/** Offline outer keyline trial. The existing stock mask supplies the shape. */
export function eighthOuterRuleStudy(p, expected) {
  assert(p.width > 0 && p.width <= 1);
  assert(p.rgb.length === 3 && p.rgb.every((v) => Number.isFinite(v) && v >= 0 && v <= 255));
  return {
    name: 'eighth-stock-outline-study',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/frame-plate-border.ts')) return;
      assert.equal(hash(source), expected);
      const marker = '    c.drawImage(mask, 0, 0, 488, 680);';
      assert.equal(source.split(marker).length, 2);
      const body = `
    let outline=eighthOutlineStudyCache.get(image);
    if(!outline){
      const original=m.getImageData(0,0,mask.width,mask.height), a=original.data, w=mask.width,h=mask.height;
      outline=rasterCanvas();outline.width=w;outline.height=h;
      const o=outline.getContext('2d')!;
      const next=o.createImageData(w,h);
      const sample=(x:number,y:number)=>{
        x=Math.max(0,Math.min(w-1,x));y=Math.max(0,Math.min(h-1,y));
        const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
        const at=(xx:number,yy:number)=>a[(Math.min(h-1,yy)*w+Math.min(w-1,xx))*4+3]!;
        return (at(ix,iy)*(1-fx)+at(ix+1,iy)*fx)*(1-fy)+(at(ix,iy+1)*(1-fx)+at(ix+1,iy+1)*fx)*fy;
      };
      const rays=Array.from({length:8},(_,i)=>[Math.cos(i*Math.PI/4)*${p.width * 1.5},Math.sin(i*Math.PI/4)*${p.width * 1.5}]);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const v=rays.map(([dx,dy])=>sample(x+dx!,y+dy!));
        const k=(y*w+x)*4;
        next.data[k]=${p.rgb[0]};next.data[k+1]=${p.rgb[1]};next.data[k+2]=${p.rgb[2]};
        next.data[k+3]=Math.round(Math.max(...v)-Math.min(...v));
      }
      o.putImageData(next,0,0);eighthOutlineStudyCache.set(image,outline);
    }
    c.drawImage(outline,0,0,488,680);
`;
      return {
        code:
          source.replace(marker, marker + body) +
          '\nconst eighthOutlineStudyCache=new WeakMap<object, ReturnType<typeof rasterCanvas>>();\n',
        map: null,
      };
    },
  };
}
