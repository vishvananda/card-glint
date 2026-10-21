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
  page.setDefaultTimeout(120000);
  const url = new URL('unlimited-worker-parity.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Unlimited current profile worker parity</title>',
    }),
  );
  await page.goto(url);
  const entry = process.argv.includes('--built')
    ? '/dist/lib/magic-presentation.js'
    : '/games/magic/src/presentation.ts';
  const rows = await page.evaluate(async (entry) => {
    async function harness(scope, api) {
      const local = 'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
      for (const { family, style, weight } of api.canvasFontAssets)
        (scope.document?.fonts ?? scope.fonts).add(
          await new FontFace(family, local, { style, weight }).load(),
        );
      const images = new Map();
      let requested;
      const loadImages = async (urls, signal) => {
        const out = new Map();
        for (const url of urls.filter(Boolean)) {
          signal.throwIfAborted();
          requested.add(url);
          let bitmap = images.get(url);
          if (!bitmap) {
            const c = new OffscreenCanvas(64, 64),
              ctx = c.getContext('2d');
            let seed = 0;
            for (const ch of url) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) >>> 0;
            ctx.fillStyle = `rgb(${90 + (seed % 120)},${90 + ((seed >>> 8) % 120)},${90 + ((seed >>> 16) % 120)})`;
            ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#d5c4a1';
            ctx.fillRect(5, 10, 54, 45);
            ctx.fillStyle = '#292823';
            ctx.fillRect(28, 12, 8, 32);
            bitmap = c.transferToImageBitmap();
            images.set(url, bitmap);
            c.width = c.height = 0;
          }
          out.set(url, bitmap);
        }
        return { images: out, dispose() {} };
      };
      return {
        async draw(face, tier) {
          requested = new Set();
          const c = await api.composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
            { loadImages, loadFonts: async () => {}, loadRetroFont: async () => {} },
          );
          const out = new OffscreenCanvas(c.width, c.height),
            ctx = out.getContext('2d');
          ctx.drawImage(c, 0, 0);
          const pixels = ctx.getImageData(0, 0, out.width, out.height).data;
          const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', pixels)))
            .map((v) => v.toString(16).padStart(2, '0'))
            .join('');
          const result = { size: [out.width, out.height], hash, assets: [...requested].sort() };
          if (c instanceof ImageBitmap) c.close();
          else c.width = c.height = 0;
          out.width = out.height = 0;
          return result;
        },
        dispose() {
          for (const b of images.values()) b.close();
        },
      };
    }
    const api = await import(entry),
      main = await harness(globalThis, api);
    const workerCode = `import * as api from '${location.origin}${entry}';const ready=(${harness.toString()})(globalThis,api);onmessage=async({data})=>{try{if(typeof document!=='undefined')throw Error('Worker has document');const h=await ready;postMessage({ok:true,value:await h.draw(data.face,data.tier)});}catch(e){postMessage({ok:false,error:e.stack??e.message});}};`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' })),
      worker = new Worker(workerUrl, { type: 'module' }),
      rows = [];
    const base = {
      name: 'Current profile adept',
      setCode: '2ed',
      frameStyle: 'retro',
      borderColor: 'white',
      symbolStyle: 'original',
      colorCalibration: 'set-hsb-v1',
      illustration: 'fixture-art',
      artist: 'Original Artist',
      power: '2',
      toughness: '3',
    };
    const faces = [
      {
        ...base,
        name: 'White adept',
        typeLine: 'Summon Wizard',
        colors: ['W'],
        manaSymbols: ['2', 'W'],
        rulesText: 'First strike. Gain 2 life.',
        flavorText: 'A memory of the original printing.',
      },
      {
        ...base,
        name: 'Black adept',
        typeLine: 'Summon Wizard',
        colors: ['B'],
        manaSymbols: ['1', 'B', 'B'],
        rulesText:
          'Tap to draw a card, then discard a card. You may use this ability only once each turn. At the beginning of your next upkeep, return this creature to your hand.',
      },
      {
        ...base,
        name: 'Artifact adept',
        typeLine: 'Mono Artifact',
        artifact: true,
        colors: [],
        manaSymbols: ['3'],
        rulesText: 'Tap to draw a card.',
        power: undefined,
        toughness: undefined,
      },
      {
        ...base,
        name: 'Bayou',
        typeLine: 'Land',
        land: true,
        colors: [],
        frameColors: ['B', 'G'],
        producedMana: ['B', 'G'],
        manaSymbols: [],
        rulesText:
          'Counts as both swamp and forest and is affected by spells that affect either. Tap to add either {B} or {G} to your mana pool.',
        power: undefined,
        toughness: undefined,
      },
      {
        ...base,
        name: 'Island',
        typeLine: 'Land',
        land: true,
        colors: [],
        frameColors: ['U'],
        producedMana: ['U'],
        manaSymbols: [],
        rulesText: 'Tap to add {U} to your mana pool.',
        power: undefined,
        toughness: undefined,
      },
    ];
    try {
      for (const face of faces)
        for (const wordingMode of ['original', 'oracle'])
          for (const tier of ['table', 'native']) {
            const input = {
              ...face,
              wordingMode,
              ...(wordingMode === 'oracle' && face.typeLine.startsWith('Summon')
                ? { typeLine: 'Creature — Wizard' }
                : {}),
            };
            const browser = await main.draw(input, tier);
            const other = await new Promise((resolve, reject) => {
              worker.onmessage = (e) => resolve(e.data);
              worker.onerror = (e) => reject(Error(e.message));
              worker.postMessage({ face: input, tier });
            });
            if (!other.ok) throw Error(other.error);
            rows.push({ name: face.name, wordingMode, tier, browser, worker: other.value });
          }
    } finally {
      main.dispose();
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    }
    return rows;
  }, entry);
  assert.equal(rows.length, 20);
  for (const row of rows)
    assert.deepEqual(
      row.browser,
      row.worker,
      JSON.stringify({ name: row.name, mode: row.wordingMode, tier: row.tier }),
    );
  console.log(
    JSON.stringify({
      entry,
      cases: rows.length,
      scope:
        'Current Unlimited browser/OffscreenCanvas pixels and requested assets match for white/black, artifact, dual/basic lands, Original/Oracle and table/native tiers. Synthetic assets and local fonts test portability, not scan accuracy.',
    }),
  );
} finally {
  await browser?.close();
  await server.close();
}
