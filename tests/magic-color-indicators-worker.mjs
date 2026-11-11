import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const entry = process.argv.includes('--built')
    ? '/dist/lib/magic-presentation.js'
    : '/games/magic/src/presentation.ts';
  const rows = await page.evaluate(async (entry) => {
    function setup(api) {
      const requests = [],
        colors = {
          w: '#f6f1dc',
          u: '#1476bd',
          b: '#302b28',
          r: '#de352c',
          g: '#237c46',
          a: '#aaa9a5',
        };
      let prepared;
      return {
        requests,
        async loadFonts() {
          prepared ??= Promise.all(
            api.canvasFontAssets.map(async ({ family, style, weight }) => {
              const source =
                'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
              const font = await new FontFace(family, source, { style, weight }).load();
              (typeof document === 'undefined' ? self.fonts : document.fonts).add(font);
            }),
          );
          await prepared;
        },
        async loadImages(urls, signal) {
          signal.throwIfAborted();
          const images = new Map();
          for (const url of urls.filter(Boolean)) {
            requests.push(url);
            if (url.includes('missing-indicator')) continue;
            const c = new OffscreenCanvas(64, 64),
              ctx = c.getContext('2d');
            const color = /\/([wubrga])identity\.png$/.exec(url)?.[1];
            ctx.fillStyle = color ? colors[color] : '#85947f';
            if (color) {
              ctx.beginPath();
              ctx.arc(32, 32, 32, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(0, 0, 64, 64);
              ctx.fillStyle = '#111';
              ctx.fillRect(28, 15, 8, 34);
            }
            images.set(url, c.transferToImageBitmap());
          }
          return {
            images,
            dispose() {
              for (const b of images.values()) b.close();
            },
          };
        },
      };
    }
    await import('/games/magic/src/data/eager.ts');
    const api = await import(entry),
      hooks = setup(api);
    const workerCode = `
      import '${location.origin}/games/magic/src/data/eager.ts';
      const api=await import('${location.origin}${entry}');
      const setup=${setup.toString()};const hooks=setup(api);
      self.onmessage=async({data})=>{try {
        const start=hooks.requests.length;
        const image=await api.composeCardTexture(data.input,data.width,new AbortController().signal,
          {...hooks,loadRetroFont:hooks.loadFonts});
        if(!(image instanceof ImageBitmap))throw Error('Expected a transferable bitmap');
        const control=data.input.paintLayer==='artwork'?await api.composeCardTexture(
          {...data.input,face:{...data.input.face,colorIndicatorDisplay:'hidden'}},data.width,
          new AbortController().signal,{...hooks,loadRetroFont:hooks.loadFonts}):null;
        self.postMessage({image,control,requests:hooks.requests.slice(start)},control?[image,control]:[image]);
      }catch(e){self.postMessage({error:e.message});}};
      self.postMessage({ready:true});
    `;
    const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
    const worker = new Worker(workerUrl, { type: 'module' }),
      rows = [];
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(Error('Worker startup timed out')), 45000);
        worker.onmessage = (e) => {
          clearTimeout(timeout);
          e.data.ready ? resolve() : reject(Error('Invalid worker readiness'));
        };
        worker.onerror = (e) => {
          clearTimeout(timeout);
          reject(Error(e.message));
        };
      });
      const base = {
        name: 'Sol Ring',
        typeLine: 'Artifact',
        colors: [],
        manaSymbols: ['1'],
        setCode: 'GLINT',
        illustration: 'fixture-art',
        currentColors: ['U'],
        colorIndicatorDisplay: 'current-if-changed',
      };
      const tasks = [
        ...[244, 488, 732].map((width) => ({ width, face: base })),
        { width: 488, face: { ...base, colors: ['G'], currentColors: [] } },
        { width: 488, face: { ...base, currentColors: ['R', 'G'] } },
        { width: 488, face: { ...base, currentColors: ['R', 'U', 'B'] } },
        { width: 488, face: { ...base, currentColors: ['W', 'U', 'B', 'R'] } },
        { width: 488, face: { ...base, currentColors: ['W', 'U', 'B', 'R', 'G'] } },
        { width: 488, face: { ...base, colorIndicatorDisplay: 'hidden' } },
        { width: 488, face: base, paintLayer: 'artwork' },
        { width: 488, face: base, printedImage: 'fixture-scan' },
        {
          width: 488,
          face: { ...base, colors: ['U'], colorIndicator: ['U'], currentColors: ['U'] },
          printedImage: 'fixture-scan',
        },
      ];
      for (const task of tasks) {
        const input = { printingId: null, printedImage: null, ...task };
        delete input.width;
        const start = hooks.requests.length;
        const dom = await api.composeCardTexture(input, task.width, new AbortController().signal, {
          ...hooks,
          loadRetroFont: hooks.loadFonts,
        });
        const response = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(Error('Worker composition timed out')), 45000);
          worker.onmessage = (e) => {
            clearTimeout(timeout);
            resolve(e.data);
          };
          worker.onerror = (e) => {
            clearTimeout(timeout);
            reject(Error(e.message));
          };
          worker.postMessage({ input, width: task.width });
        });
        if (response.error) throw Error(response.error);
        const w = response.image.width,
          h = response.image.height;
        const c = new OffscreenCanvas(w, h),
          ctx = c.getContext('2d');
        ctx.drawImage(response.image, 0, 0);
        const a = ctx.getImageData(0, 0, w, h).data;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(dom, 0, 0);
        const b = ctx.getImageData(0, 0, w, h).data;
        let maximumDifference = 0,
          changedBytes = 0;
        for (let i = 0; i < a.length; i++)
          if (a[i] !== b[i]) {
            changedBytes++;
            maximumDifference = Math.max(maximumDifference, Math.abs(a[i] - b[i]));
          }
        if (maximumDifference > 0 && input.paintLayer !== 'artwork')
          throw Error(
            'Worker differs from document composition ' +
              JSON.stringify({ maximumDifference, changedBytes }),
          );
        if (input.paintLayer === 'artwork') {
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(response.control, 0, 0);
          if (!ctx.getImageData(0, 0, w, h).data.every((v, i) => v === a[i]))
            throw Error('Indicator changed worker artwork-only pixels');
          response.control.close();
          const control = await api.composeCardTexture(
            { ...input, face: { ...input.face, colorIndicatorDisplay: 'hidden' } },
            task.width,
            new AbortController().signal,
            { ...hooks, loadRetroFont: hooks.loadFonts },
          );
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(control, 0, 0);
          if (!ctx.getImageData(0, 0, w, h).data.every((v, i) => v === b[i]))
            throw Error('Indicator changed document artwork-only pixels');
          if (control instanceof ImageBitmap) control.close();
          else control.width = control.height = 0;
        }
        const indicatorRequests = response.requests.filter((u) => u.includes('/indicators/'));
        const regions = api.colorIndicatorRegions(input.face);
        if (!input.printedImage && input.paintLayer !== 'artwork' && regions.length) {
          const r = regions[0].rect;
          const index =
            (Math.floor((r[1] + r[3] / 2) * h) * w + Math.floor((r[0] + r[2] / 2) * w)) * 4;
          if (a[index + 3] !== 255) throw Error('Missing badge center');
          if (
            input.face.currentColors.length === 1 &&
            input.face.currentColors[0] === 'U' &&
            (a[index] !== 20 || a[index + 1] !== 118 || a[index + 2] !== 189)
          )
            throw Error('Missing blue color');
          const shown = api.resolveColorIndicator(input.face);
          const palette = {
            W: [246, 241, 220],
            U: [20, 118, 189],
            B: [48, 43, 40],
            R: [222, 53, 44],
            G: [35, 124, 70],
          };
          shown.colors.forEach((color, i) => {
            const angle =
              (shown.colors.length === 2 ? Math.PI / 2 : -Math.PI / 2) +
              ((i + 0.5) * 2 * Math.PI) / shown.colors.length;
            const x = Math.floor((r[0] + r[2] * (0.5 + 0.25 * Math.cos(angle))) * w),
              y = Math.floor((r[1] + r[3] * (0.5 + 0.25 * Math.sin(angle))) * h);
            const pixel = (y * w + x) * 4;
            if (!palette[color].every((v, k) => v === a[pixel + k]))
              throw Error('Missing multicolor sector ' + color);
          });
        }
        rows.push({
          width: task.width,
          maximumDifference,
          changedBytes,
          workerDocumentEqual: maximumDifference === 0,
          indicatorRequests: indicatorRequests.length,
          scanRequested: response.requests.includes('fixture-scan'),
          artworkOnly: input.paintLayer === 'artwork',
          requestParity:
            JSON.stringify(hooks.requests.slice(start)) === JSON.stringify(response.requests),
        });
        response.image.close();
        if (dom instanceof ImageBitmap) dom.close();
        else dom.width = dom.height = 0;
      }
      try {
        await api.composeCardTexture(
          { printingId: null, printedImage: 'fixture-scan', face: { ...base, illustration: null } },
          488,
          new AbortController().signal,
          hooks,
        );
        throw Error('Missing rebuild artwork was silently accepted');
      } catch (e) {
        if (!e.message.includes('requires illustration data')) throw e;
      }
    } finally {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    }
    return rows;
  }, entry);
  assert.equal(rows.length, 12);
  assert(rows.every((r) => (r.artworkOnly || r.workerDocumentEqual) && r.requestParity));
  assert.deepEqual(
    rows.map((r) => r.indicatorRequests),
    [1, 1, 1, 1, 2, 3, 4, 5, 0, 0, 1, 0],
  );
  assert.equal(rows[10].scanRequested, false, 'Changed scans rebuild printing before fetch');
  assert.equal(rows[11].scanRequested, true, 'Unchanged scans remain on the scan path');
  console.log(JSON.stringify({ built: process.argv.includes('--built'), rows }));
} finally {
  await browser?.close();
  await server.close();
}
