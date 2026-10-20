import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { openBrowser } from '../browser.mjs';
const [root, run = 'actual-geometry'] = process.argv.slice(2);
if (!root || !/^[a-z0-9-]+$/.test(run)) throw Error('Pass external study and run name');
const out = root + '/' + run;
await mkdir(out, { recursive: true });
const snapshot = JSON.parse(await readFile(root + '/final/inputs.json')),
  chosen = JSON.parse(await readFile(root + '/inputs.json')).records.filter((r) =>
    snapshot.entries.some((e) => e.id === r.id),
  );
const session = await openBrowser(snapshot, {
  plugins: [
    {
      name: 'current-heading-capture',
      enforce: 'pre',
      transform(code, id) {
        if (run === 'actual-before' && id.endsWith('/planeswalker-geometry.ts'))
          return code
            .replace('titleWidth: 1.06', 'titleWidth: 1')
            .replace('typeWidth: 1.03', 'typeWidth: 1')
            .replace(/return Object.hasOwn\(SYMBOL_SIZE, code\)[^;]+;/, 'return [1, 1];');
        if (id.endsWith('/canvas-text.ts'))
          return (
            code.replace('export function paintFittedText(', 'function paintFittedTextBase(') +
            `
export function paintFittedText(...args:Parameters<typeof paintFittedTextBase>){
 if(args[11]==='stats'){paintFittedTextBase(...args);return;}
 const original=args[0],fill=original.fillText,c=document.createElement('canvas');c.width=original.canvas.width;c.height=original.canvas.height;const ctx=c.getContext('2d')!;
 original.fillText=function(...glyphArgs:Parameters<CanvasRenderingContext2D['fillText']>){
  ctx.setTransform(original.getTransform());ctx.font=original.font;ctx.textBaseline=original.textBaseline;ctx.textAlign=original.textAlign;ctx.direction=original.direction;ctx.fontKerning=original.fontKerning;ctx.fontStretch=original.fontStretch;
  ctx.letterSpacing=args[6]?FACE_TEXT.titleTracking+'px':'0px';if(original.wordSpacing)ctx.wordSpacing=original.wordSpacing;ctx.fillStyle='#000';ctx.fillText(...glyphArgs);fill.call(original,...glyphArgs);
 };
 try{paintFittedTextBase(...args);}finally{original.fillText=fill;}
 ((globalThis as any).__headingMasks??=[]).push({role:args[6]?'title':'type',text:args[1],x:args[2],y:args[3],width:args[4],size:args[5],url:c.toDataURL()});
}
`
          );
        if (id.endsWith('/canvas-face.ts'))
          return code.replace(
            '  const symbolBounds = adjustedSymbolBounds(originalSymbolBounds, face.symbolAdjustment?.set);',
            `  const symbolBounds = adjustedSymbolBounds(originalSymbolBounds, face.symbolAdjustment?.set);
  if(setIcon){const c=document.createElement('canvas');c.width=context.canvas.width;c.height=context.canvas.height;const ctx=c.getContext('2d')!;ctx.setTransform(context.getTransform());ctx.drawImage(setIcon,...originalSymbolBounds);(globalThis as any).__symbolMask={url:c.toDataURL(),bounds:originalSymbolBounds,setUrl};}`,
          );
      },
    },
  ],
});
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const r of chosen) {
    const e = snapshot.entries.find((e) => e.id === r.id);
    for (const bevel of [true]) {
      const result = await session.page.evaluate(
        async ({ face, bevel }) => {
          window.__headingMasks = [];
          window.__symbolMask = null;
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
          const im = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            'inspect',
            new AbortController().signal,
          );
          const c = document.createElement('canvas');
          c.width = im.width;
          c.height = im.height;
          c.getContext('2d').drawImage(im, 0, 0);
          im.close?.();
          return {
            url: c.toDataURL(),
            rects: faceRects(face),
            headings: window.__headingMasks,
            symbol: window.__symbolMask,
          };
        },
        { face: e.face, bevel },
      );
      await writeFile(
        out + '/' + r.id + '-full.png',
        Buffer.from(result.url.split(',')[1], 'base64'),
      );
      for (const h of result.headings) {
        await writeFile(
          out + '/' + r.id + '-' + h.role + '.png',
          Buffer.from(h.url.split(',')[1], 'base64'),
        );
        delete h.url;
      }
      if (result.symbol) {
        await writeFile(
          out + '/' + r.id + '-symbol.png',
          Buffer.from(result.symbol.url.split(',')[1], 'base64'),
        );
        delete result.symbol.url;
      }
      await writeFile(
        out + '/' + r.id + '.json',
        JSON.stringify({ rects: result.rects, headings: result.headings, symbol: result.symbol }),
      );
    }
    console.log(r.palette, r.family, r.name);
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  await writeFile(out + '/cards.json', JSON.stringify(chosen, null, 2));
} finally {
  await session.close();
}
