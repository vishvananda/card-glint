import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL('..', import.meta.url)),
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const url = new URL('worker-composition-check.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Worker composition</title>',
    }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const base = location.origin;
    const code = `
   import {composeCardTexture,cardTextureSize} from '${base}/games/magic/src/presentation.ts';
   const local='local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
   async function fonts(){ for(const [family,style,weight] of [['Goudy','normal','400'],['Historic Symbols','normal','400'],['Beleren','normal','400 700'],['Beleren Small Caps','normal','700'],['MPlantin','normal','400'],['MPlantin','italic','400'],['Relay','normal','400'],['Artist Credit','normal','400'],['Matrix','normal','400 700']])self.fonts.add(await new FontFace('CardRenderer MTG '+family,local,{style,weight}).load()); }
   let fontReady;const loadFonts=()=>fontReady??=fonts();
   async function images(urls,signal){signal.throwIfAborted();const c=new OffscreenCanvas(64,64),ctx=c.getContext('2d');ctx.fillStyle='#76847c';ctx.fillRect(0,0,64,64);ctx.fillStyle='#b0a090';ctx.fillRect(0,0,64,32);const b=c.transferToImageBitmap();return{images:new Map(urls.filter(Boolean).map(u=>[u,b])),dispose(){b.close();c.width=c.height=0;}};}
   self.onmessage=async({data})=>{try{if(typeof document!=='undefined')throw Error('Worker unexpectedly has document');const controller=new AbortController();let disposed=false;const input={printingId:null,printedImage:null,face:{name:'Worker Adept',typeLine:'Creature',colors:['U'],rulesText:'Draw a card.',illustration:'fixture-art',setCode:'m21',power:'1',toughness:'2',...(data.retro?{frameStyle:'retro'}:{})},...(data.custom?{custom:{key:'worker-custom',artBounds:[0,0,1,1],async compose(tier,signal,layer){const [w,h]=cardTextureSize(tier),c=new OffscreenCanvas(w,h),ctx=c.getContext('2d');ctx.fillStyle=layer==='etching'?'#fff':'#c04020';ctx.fillRect(0,0,w,h/2);return c;}}}:{})};if(data.aborted)controller.abort();const image=await composeCardTexture({...input,layer:data.layer},data.tier,controller.signal,{loadImages:images,loadFonts,loadRetroFont:loadFonts,resolveEtching:async()=> 'fixture-mask',output:data.output});if(data.output==='r8'){self.postMessage({ok:true,map:image},[image.data.buffer]);return;}if(!(image instanceof ImageBitmap))throw Error('Worker did not return transferable ImageBitmap');self.postMessage({ok:true,image},[image]);}catch(e){self.postMessage({ok:false,name:e.name,error:e.message});}};
  `;
    const workerUrl = URL.createObjectURL(new Blob([code], { type: 'text/javascript' })),
      worker = new Worker(workerUrl, { type: 'module' }),
      rows = [];
    try {
      for (const task of [
        { tier: 'table' },
        { tier: 'native' },
        { tier: 'inspect' },
        { tier: 128 },
        { tier: 'native', retro: true },
        { tier: 'native', layer: 'etching' },
        { tier: 128, custom: true },
        { tier: 128, custom: true, layer: 'etching' },
        { tier: 128, custom: true, aborted: true },
        { tier: 0 },
        { tier: 128, custom: true, layer: 'etching', output: 'r8' },
        { tier: 128, output: 'r8' },
      ]) {
        const r = await new Promise((resolve, reject) => {
          worker.onmessage = (e) => resolve(e.data);
          worker.onerror = (e) => reject(Error(e.message));
          worker.postMessage(task);
        });
        if (!r.ok) {
          rows.push({ ...task, ok: false, name: r.name, error: r.error });
          continue;
        }
        if (r.map) {
          rows.push({
            ...task,
            ok: true,
            size: [r.map.width, r.map.height],
            rowOrder: r.map.rowOrder,
            first: r.map.data[0],
            last: r.map.data.at(-1),
          });
          continue;
        }
        const c = document.createElement('canvas');
        c.width = r.image.width;
        c.height = r.image.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(r.image, 0, 0);
        rows.push({
          ...task,
          ok: true,
          size: [c.width, c.height],
          top: Array.from(ctx.getImageData(2, 2, 1, 1).data),
          bottom: Array.from(ctx.getImageData(2, c.height - 2, 1, 1).data),
          center: Array.from(ctx.getImageData(c.width / 2, c.height * 0.4, 1, 1).data),
        });
        r.image.close();
      }
    } finally {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    }
    return rows;
  });
  assert.deepEqual(
    result.slice(0, 4).map((r) => r.size),
    [
      [244, 340],
      [488, 680],
      [732, 1020],
      [128, 178],
    ],
    JSON.stringify(result),
  );
  for (const r of result.slice(0, 8)) assert.equal(r.ok, true, JSON.stringify(r));
  assert.deepEqual(result[6].top, [192, 64, 32, 255]);
  assert.equal(result[6].bottom[3], 0);
  assert.deepEqual(result[7].top, [255, 255, 255, 255]);
  assert.equal(result[7].bottom[3], 0);
  assert.equal(result[8].name, 'AbortError');
  assert.equal(result[9].name, 'RangeError');
  assert.ok(result[5].center[3] > 0, 'Actual worker etching paints artwork coverage');
  assert.equal(result[10].rowOrder, 'bottom-up');
  assert.equal(result[10].first, 0);
  assert.equal(result[10].last, 255);
  assert.equal(result[11].ok, false);
  console.log(JSON.stringify(result));
} finally {
  await browser?.close();
  await server.close();
}
