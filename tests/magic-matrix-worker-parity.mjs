import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { installedSerifFonts } from './magic-fixture-fonts.mjs';

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
  const url = new URL('matrix-worker-parity.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Matrix current worker parity</title>',
    }),
  );
  await page.goto(url);
  const entry = process.argv.includes('--built')
    ? '/dist/lib/magic-presentation.js'
    : '/games/magic/src/presentation.ts';
  const rows = await page.evaluate(
    async ({ entry, fonts }) => {
      async function harness(scope, api, fonts) {
        for (const { family, style, weight } of api.canvasFontAssets)
          (scope.document?.fonts ?? scope.fonts).add(
            await new FontFace(family, fonts[style] ?? fonts.normal, { style, weight }).load(),
          );
        let textTrace = [];
        for (const prototype of [
          scope.CanvasRenderingContext2D?.prototype,
          scope.OffscreenCanvasRenderingContext2D?.prototype,
        ].filter(Boolean)) {
          for (const method of ['measureText', 'fillText', 'strokeText']) {
            const original = prototype[method];
            prototype[method] = function (...args) {
              const result = original.apply(this, args),
                m = this.getTransform();
              textTrace.push([
                method,
                args,
                this.font,
                this.textBaseline,
                this.textAlign,
                this.textRendering,
                this.fontKerning,
                this.letterSpacing,
                this.wordSpacing,
                [m.a, m.b, m.c, m.d, m.e, m.f],
                method === 'measureText'
                  ? [
                      result.width,
                      result.actualBoundingBoxLeft,
                      result.actualBoundingBoxRight,
                      result.actualBoundingBoxAscent,
                      result.actualBoundingBoxDescent,
                    ]
                  : null,
              ]);
              return result;
            };
          }
        }
        const images = new Map();
        let requested;
        const loadImages = async (urls, signal) => {
          const result = new Map();
          for (const url of urls.filter(Boolean)) {
            signal.throwIfAborted();
            requested.add(url);
            let image = images.get(url);
            if (!image) {
              const pixels = new Uint8ClampedArray(64 * 64 * 4);
              let n = 0;
              for (const ch of url) n = (Math.imul(n, 31) + ch.charCodeAt(0)) >>> 0;
              const rgb = [90 + (n % 120), 90 + ((n >>> 8) % 120), 90 + ((n >>> 16) % 120)];
              for (let y = 0; y < 64; y++)
                for (let x = 0; x < 64; x++) {
                  const color =
                    (y >= 5 && y < 8) || (x >= 28 && x < 36 && y >= 20 && y < 44)
                      ? [68, 68, 68]
                      : x >= 5 && x < 59 && y >= 12 && y < 60
                        ? [222, 194, 154]
                        : rgb;
                  const at = (y * 64 + x) * 4;
                  pixels.set([...color, 255], at);
                }
              image = await createImageBitmap(new ImageData(pixels, 64, 64));
              images.set(url, image);
            }
            result.set(url, image);
          }
          return { images: result, dispose() {} };
        };
        return {
          async draw(face, tier, layer) {
            requested = new Set();
            textTrace = [];
            const image = await api.composeCardTexture(
              { face, printedImage: null, printingId: null, layer },
              tier,
              new AbortController().signal,
              {
                loadImages,
                loadFonts: async () => {},
                loadRetroFont: async () => {},
                output: 'bitmap',
              },
            );
            const canvas = new OffscreenCanvas(image.width, image.height),
              c = canvas.getContext('2d');
            try {
              c.drawImage(image, 0, 0);
              const pixels = c.getImageData(0, 0, canvas.width, canvas.height).data;
              const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', pixels)))
                .map((v) => v.toString(16).padStart(2, '0'))
                .join('');
              return {
                size: [canvas.width, canvas.height],
                hash,
                pixels,
                textTrace,
                assets: [...requested].sort(),
              };
            } finally {
              if (image instanceof ImageBitmap) image.close();
              else image.width = image.height = 0;
              canvas.width = canvas.height = 0;
            }
          },
          dispose() {
            for (const image of images.values()) image.close();
          },
        };
      }
      const api = await import(entry),
        main = await harness(globalThis, api, fonts);
      const workerCode =
        "import * as api from '" +
        location.origin +
        entry +
        "'; const ready=(" +
        harness.toString() +
        ')(globalThis,api,' +
        JSON.stringify(fonts) +
        ");onmessage=async({data})=>{try{if(typeof document!=='undefined')throw Error('Worker has document');const h=await ready;postMessage({ok:true,value:await h.draw(data.face,data.tier,data.layer)});}catch(e){postMessage({ok:false,error:e.stack??e.message});}};";
      const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' })),
        worker = new Worker(workerUrl, { type: 'module' });
      const base = {
        name: 'Matrix Adept',
        typeLine: 'Creature — Wizard',
        colors: ['U'],
        manaSymbols: ['2', 'U'],
        rulesText: 'Draw a card.\nA second paragraph.',
        power: '2',
        toughness: '3',
        artist: 'Original Artist',
        illustration: 'fixture-art',
        setCode: '8ed',
        frameStyle: 'modern',
        frameAssetFamily: 'eighth',
        borderColor: 'white',
      };
      const cases = [
        { label: '8ed', face: base },
        { label: '9ed-inherited', face: { ...base, setCode: '9ed', borderColor: 'black' } },
        {
          label: '8ed-basic',
          face: {
            ...base,
            name: 'Plains',
            typeLine: 'Basic Land — Plains',
            canonicalTypeLine: 'Basic Land — Plains',
            land: true,
            creature: false,
            colors: [],
            frameColors: ['W'],
            manaSymbols: [],
            power: undefined,
            toughness: undefined,
            rulesText: '',
          },
        },
        {
          label: 'future',
          face: {
            ...base,
            setCode: 'fut',
            borderColor: 'black',
            frameAssetFamily: undefined,
            frameTemplate: 'future',
          },
        },
        {
          label: '2003-split',
          face: {
            ...base,
            name: 'One // Two',
            setCode: 'dis',
            borderColor: 'black',
            layout: 'split',
            power: undefined,
            toughness: undefined,
            faces: [
              {
                ...base,
                name: 'One',
                setCode: 'dis',
                typeLine: 'Instant',
                power: undefined,
                toughness: undefined,
              },
              {
                ...base,
                name: 'Two',
                setCode: 'dis',
                typeLine: 'Sorcery',
                colors: ['R'],
                manaSymbols: ['1', 'R'],
                power: undefined,
                toughness: undefined,
              },
            ],
          },
        },
      ];
      const rows = [];
      try {
        for (const { label, face } of cases)
          for (const tier of ['table', 'native', 'inspect'])
            for (const layer of [undefined, 'etching']) {
              const a = await main.draw(face, tier, layer);
              const b = await new Promise((resolve, reject) => {
                worker.onmessage = (e) =>
                  e.data.ok ? resolve(e.data.value) : reject(Error(e.data.error));
                worker.onerror = (e) => reject(Error(e.message));
                worker.postMessage({ face, tier, layer });
              });
              const traceEqual = JSON.stringify(a.textTrace) === JSON.stringify(b.textTrace);
              let error = 0,
                max = 0,
                changed = 0,
                alphaChanged = 0;
              const tiles = new Map(),
                width = a.size[0],
                height = a.size[1];
              for (let at = 0; at < a.pixels.length; at++) {
                const delta = Math.abs(a.pixels[at] - b.pixels[at]);
                error += delta;
                max = Math.max(max, delta);
                if (delta) changed++;
                if (at % 4 === 3 && delta) alphaChanged++;
                const pixel = Math.floor(at / 4),
                  x = pixel % width,
                  y = Math.floor(pixel / width),
                  key = Math.floor(x / 64) + ',' + Math.floor(y / 64);
                const t = tiles.get(key) ?? [0, 0];
                t[0] += delta;
                t[1]++;
                tiles.set(key, t);
              }
              rows.push({
                label,
                tier,
                layer: layer ?? 'face',
                size: a.size,
                hashes: [a.hash, b.hash],
                assetsIdentical: JSON.stringify(a.assets) === JSON.stringify(b.assets),
                traceEqual,
                meanError: error / a.pixels.length,
                maxError: max,
                changedBytes: changed,
                alphaChanged,
                tileMeanMax: Math.max(...[...tiles.values()].map(([sum, n]) => sum / n)),
                ...(!traceEqual
                  ? {
                      firstTraceMismatch: a.textTrace.findIndex(
                        (t, i) => JSON.stringify(t) !== JSON.stringify(b.textTrace[i]),
                      ),
                      browserTrace: a.textTrace.slice(0, 3),
                      workerTrace: b.textTrace.slice(0, 3),
                    }
                  : {}),
              });
            }
      } finally {
        main.dispose();
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      }
      return rows;
    },
    { entry, fonts: await installedSerifFonts() },
  );
  assert.equal(rows.length, 30);
  for (const row of rows) {
    const label = row.label + '/' + row.tier + '/' + row.layer;
    assert(row.assetsIdentical, label + ': requested assets changed');
    assert(row.traceEqual, label + ': text commands, metrics or baselines changed');
    assert.equal(row.alphaChanged, 0, label + ': silhouette changed');
    // Same cross-context color-raster envelope as the current M21 replay.
    // Independent exact text traces above prevent treating a layout shift as
    // harmless raster rounding. Etching remains byte-exact.
    assert(row.meanError <= 1, label + ': mean exceeds one8-bit level');
    assert(row.tileMeanMax <= 3, label + ':64px tile exceeds three8-bit levels');
    if (row.layer === 'etching')
      assert.equal(row.hashes[0], row.hashes[1], label + ': mask changed');
  }
  console.log(
    JSON.stringify({
      entry,
      cases: rows.length,
      exactPairs: rows.filter((row) => row.changedBytes === 0).length,
      boundedRasterPairs: rows.filter((row) => row.changedBytes !== 0).length,
      maxMean8BitError: Math.max(...rows.map((row) => row.meanError)),
      max64pxTileMeanError: Math.max(...rows.map((row) => row.tileMeanMax)),
      scope:
        'Current browser/real OffscreenCanvas worker parity: 8ED, inherited, basic land, future and2003 split; face/etching at244/488/732. Exact text commands/metrics/baselines, asset requests, silhouettes and masks. Color raster uses the existing M21 envelope of one8-bit level mean/card and three/64px tile. Synthetic decoded assets and installed substitute outlines prove portability, not scan accuracy.',
    }),
  );
} finally {
  await browser?.close();
  await server.close();
}
