import assert from 'node:assert/strict';
import { hash } from './common.mjs';

/** Offline observer/eraser only. Candidate text is painted by the actual helper. */
export function modernHeadingStudy(expectedHash) {
  assert.match(expectedHash, /^[a-f0-9]{64}$/);
  return {
    name: 'modern-heading-observer',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/canvas-text.ts')) return;
      assert.equal(hash(source), expectedHash, 'Changed heading painter; review the study hook');
      const start = "  if (!(width > 0)) throw Error('Magic title/type plate has no text space.');";
      const end = '  paintTextInk(\n    context,';
      assert.equal(source.split(start).length, 2);
      assert.equal(source.split(end).length, 2);
      let code = source.replace(
        start,
        start +
          `
  const observer = (globalThis as any).__m21HeadingObserver;
  const role = observer?.targets.get(text);
  if (role) {
    const m = context.getTransform();
    observer.calls.push({role,text,x,y,width,size,bold,widthScale,family,strokeInset,textInk,
      matrix:[m.a,m.b,m.c,m.d,m.e,m.f],baseline:context.textBaseline,
      align:context.textAlign,direction:context.direction,tracking:context.letterSpacing,
      rendering:context.textRendering,kerning:context.fontKerning,wordSpacing:context.wordSpacing,
      fill:context.fillStyle,shadowColor:context.shadowColor,
      shadowOffsetX:context.shadowOffsetX,shadowOffsetY:context.shadowOffsetY,shadowBlur:context.shadowBlur});
    if (observer.erase) return;
  }
`,
      );
      code = code.replace(
        end,
        `  if(role){
    const m=context.getTransform(), t=context.measureText(text);
    observer.calls.at(-1).final={text,x,y,maxWidth:width,font:context.font,width:t.width,nWidth:context.measureText('nnnnn').width,ascent:t.actualBoundingBoxAscent,
      descent:t.actualBoundingBoxDescent,matrix:[m.a,m.b,m.c,m.d,m.e,m.f],alpha:context.globalAlpha,
      composite:context.globalCompositeOperation,filter:context.filter,tracking:context.letterSpacing,
      wordSpacing:context.wordSpacing,rendering:context.textRendering,kerning:context.fontKerning};
  }
` + end,
      );
      return { code, map: null };
    },
  };
}
