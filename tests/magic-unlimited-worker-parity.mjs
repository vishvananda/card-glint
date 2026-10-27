import { mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';
const abuDuals = process.argv.includes('--abu-duals');
const revised = process.argv.includes('--revised');
const fourth = process.argv.includes('--fourth');
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
  const rows = await page.evaluate(
    async ({ entry, abuDuals, revised, fourth }) => {
      async function harness(scope, api, cpuAssets = false) {
        const local = 'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
        for (const { family, style, weight } of api.canvasFontAssets)
          (scope.document?.fonts ?? scope.fonts).add(
            await new FontFace(family, local, { style, weight }).load(),
          );
        let textTrace = [];
        const patched = [];
        if (cpuAssets)
          for (const prototype of [
            scope.CanvasRenderingContext2D?.prototype,
            scope.OffscreenCanvasRenderingContext2D?.prototype,
          ].filter(Boolean))
            for (const method of ['measureText', 'fillText', 'strokeText']) {
              const original = prototype[method];
              prototype[method] = function (...args) {
                const result = original.apply(this, args),
                  m = this.getTransform();
                textTrace.push([
                  method,
                  args,
                  this.font,
                  this.textAlign,
                  this.textBaseline,
                  this.textRendering,
                  String(this.fillStyle),
                  String(this.strokeStyle),
                  this.shadowColor,
                  this.shadowBlur,
                  this.shadowOffsetX,
                  this.shadowOffsetY,
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
              patched.push(() => {
                prototype[method] = original;
              });
            }
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
              if (cpuAssets) {
                // Canonical CPU bytes keep source bitmaps independent of a
                // window/worker's GPU-backed Canvas2D rasterization.
                const pixels = new Uint8ClampedArray(64 * 64 * 4);
                const rgb = [
                  90 + (seed % 120),
                  90 + ((seed >>> 8) % 120),
                  90 + ((seed >>> 16) % 120),
                ];
                for (let y = 0; y < 64; y++)
                  for (let x = 0; x < 64; x++) {
                    const color =
                      x >= 28 && x < 36 && y >= 12 && y < 44
                        ? [41, 40, 35]
                        : x >= 5 && x < 59 && y >= 10 && y < 55
                          ? [213, 196, 161]
                          : rgb;
                    pixels.set([...color, 255], (y * 64 + x) * 4);
                  }
                bitmap = await createImageBitmap(new ImageData(pixels, 64, 64));
              } else bitmap = c.transferToImageBitmap();
              images.set(url, bitmap);
              c.width = c.height = 0;
            }
            out.set(url, bitmap);
          }
          return { images: out, dispose() {} };
        };
        return {
          async draw(face, tier, layer, debug = false) {
            requested = new Set();
            textTrace = [];
            const c = await api.composeCardTexture(
              { face, printingId: null, printedImage: null, layer },
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
            const result = {
              size: [out.width, out.height],
              hash,
              assets: [...requested].sort(),
              ...(cpuAssets ? { textTrace } : {}),
              ...(debug ? { pixels: Array.from(pixels) } : {}),
            };
            if (c instanceof ImageBitmap) c.close();
            else c.width = c.height = 0;
            out.width = out.height = 0;
            return result;
          },
          dispose() {
            for (const b of images.values()) b.close();
            for (const restore of patched.reverse()) restore();
          },
        };
      }
      const api = await import(entry),
        main = await harness(globalThis, api, fourth);
      const workerCode = `import * as api from '${location.origin}${entry}';const ready=(${harness.toString()})(globalThis,api,${fourth});onmessage=async({data})=>{try{if(typeof document!=='undefined')throw Error('Worker has document');const h=await ready;postMessage({ok:true,value:await h.draw(data.face,data.tier,data.layer,data.debug)});}catch(e){postMessage({ok:false,error:e.stack??e.message});}};`;
      const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' })),
        worker = new Worker(workerUrl, { type: 'module' }),
        rows = [];
      const base = {
        name: 'Current profile adept',
        setCode: fourth ? '4ed' : revised ? '3ed' : '2ed',
        ...(revised || fourth ? { wordingMode: 'original' } : {}),
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
      // Exercise the current ABU typography branches independently of the
      // frozen pre-worker historical comparison.
      faces.push(
        {
          ...faces[1],
          name: 'Word of Command',
          rulesText:
            "You may look at opponent's hand and choose any card opponent can legally play using mana from his or her mana pool or lands. Opponent must play this card immediately; you make all the decisions it calls for. This spell may not be countered after you have looked at opponent's hand.",
        },
        {
          ...faces[0],
          name: 'Howl from Beyond',
          rulesText: 'Target creature gains +X/+0 until end of turn.',
        },
        {
          ...faces[0],
          name: 'Birds of Paradise',
          rulesText:
            'Flying\nTap to add one mana of any color to your mana pool. This tap may be played as an interrupt.',
        },
        {
          ...faces[0],
          name: 'Twiddle',
          rulesText: 'Caster may tap or untap any one land, creature, or artifact in play.',
        },
        {
          ...faces[1],
          name: 'Dense original control',
          rulesText:
            'Tap to draw a card, then discard a card. You may use this ability only once each turn. At the beginning of your next upkeep, return this creature to your hand. ' +
            'You may use this ability only during your upkeep, before drawing a card. If you do not, sacrifice this creature. This ability may not be countered.',
        },
      );
      if (fourth) {
        faces.push(
          {
            ...faces[1],
            name: 'Two-ability paragraph control',
            typeLine: 'Enchantment',
            rulesText:
              'White spells cost an additional {3} to cast.\nWhite enchantments with activation costs require an additional {3} to use.',
          },
          {
            ...faces[0],
            name: 'Explicit mixed paragraph control',
            rulesParagraphs: [
              { role: 'rules', runs: [{ text: 'First strike.' }] },
              {
                role: 'flavor',
                runs: [{ text: 'A memory of the original printing.', italic: true }],
              },
            ],
          },
          {
            ...faces[1],
            name: 'Chosen reference fitting control',
            rulesText: 'Target creature gains flying until end of turn. '.repeat(9),
            rulesAlignment: {
              mode: 'auto',
              reference: [
                {
                  role: 'rules',
                  runs: [{ text: 'Target creature gains flying until end of turn.' }],
                },
              ],
            },
          },
        );
      }
      const selected = abuDuals
        ? ['lea', 'leb', '2ed'].flatMap((setCode) => [
            ...['BG', 'UR', 'WU'].map((pair) => ({
              ...faces.find((f) => f.name === 'Bayou'),
              setCode,
              borderColor: setCode === '2ed' || setCode === '4ed' ? 'white' : 'black',
              name: setCode + ' dual ' + pair,
              frameColors: pair.split(''),
              producedMana: pair.split(''),
              rulesText:
                'Tap to add either {' + pair[0] + '} or {' + pair[1] + '} to your mana pool.',
            })),
            {
              ...faces.find((f) => f.name === 'Island'),
              setCode,
              borderColor: setCode === '2ed' || setCode === '4ed' ? 'white' : 'black',
              name: setCode + ' basic control',
            },
          ])
        : (fourth ? ['4ed'] : revised ? ['3ed'] : ['lea', 'leb', '2ed']).flatMap((setCode) =>
            faces.map((face) => ({
              ...face,
              setCode,
              borderColor: setCode === '2ed' || setCode === '4ed' ? 'white' : 'black',
            })),
          );
      const modes =
        abuDuals || fourth
          ? [
              ['original', 'original'],
              ['oracle', 'original'],
              ['oracle', 'modern'],
            ]
          : [
              ['original', 'original'],
              ['oracle', 'original'],
            ];
      const tiers =
        abuDuals || revised || fourth ? ['table', 'native', 'inspect', 323] : ['table', 'native'];
      const layers = abuDuals || revised || fourth ? ['face', 'etching'] : [undefined];
      try {
        for (const face of selected)
          for (const [wordingMode, symbolStyle] of modes)
            for (const tier of tiers)
              for (const layer of layers) {
                const input = {
                  ...face,
                  wordingMode,
                  symbolStyle,
                  ...(wordingMode === 'oracle' && face.typeLine.startsWith('Summon')
                    ? { typeLine: 'Creature — Wizard' }
                    : {}),
                };
                const browser = await main.draw(input, tier, layer);
                const other = await new Promise((resolve, reject) => {
                  worker.onmessage = (e) => resolve(e.data);
                  worker.onerror = (e) => reject(Error(e.message));
                  worker.postMessage({ face: input, tier, layer });
                });
                if (!other.ok) throw Error(other.error);
                if (browser.hash !== other.value.hash) {
                  const mainDebug = await main.draw(input, tier, layer, true);
                  const workerDebug = await new Promise((resolve, reject) => {
                    worker.onmessage = (e) => resolve(e.data);
                    worker.onerror = (e) => reject(Error(e.message));
                    worker.postMessage({ face: input, tier, layer, debug: true });
                  });
                  if (!workerDebug.ok) throw Error(workerDebug.error);
                  let changedPixels = 0,
                    maxColorDelta = 0,
                    alphaChanges = 0;
                  for (let i = 0; i < mainDebug.pixels.length; i += 4) {
                    let changed = false;
                    for (let k = 0; k < 3; k++) {
                      const delta = Math.abs(
                        mainDebug.pixels[i + k] - workerDebug.value.pixels[i + k],
                      );
                      maxColorDelta = Math.max(maxColorDelta, delta);
                      changed ||= delta > 0;
                    }
                    alphaChanges += Number(
                      mainDebug.pixels[i + 3] !== workerDebug.value.pixels[i + 3],
                    );
                    changedPixels += Number(changed);
                  }
                  if (
                    mainDebug.hash !== browser.hash ||
                    workerDebug.value.hash !== other.value.hash
                  )
                    throw Error('A parity fixture changed between repeated captures');
                  // Match the established M21 portability envelope: exact
                  // typography and assets, bounded HTML/Offscreen filter pixels.
                  if (fourth && layer !== 'etching') {
                    const [width, height] = mainDebug.size,
                      nx = Math.ceil(width / 64);
                    const tiles = new Float64Array(nx * Math.ceil(height / 64));
                    let total = 0;
                    for (let y = 0; y < height; y++)
                      for (let x = 0; x < width; x++)
                        for (let k = 0; k < 4; k++) {
                          const i = (y * width + x) * 4 + k;
                          const d = Math.abs(mainDebug.pixels[i] - workerDebug.value.pixels[i]);
                          total += d;
                          tiles[Math.floor(y / 64) * nx + Math.floor(x / 64)] += d;
                        }
                    let maxTileMAE = 0;
                    for (let i = 0; i < tiles.length; i++) {
                      const w = Math.min(64, width - (i % nx) * 64),
                        h = Math.min(64, height - Math.floor(i / nx) * 64);
                      maxTileMAE = Math.max(maxTileMAE, tiles[i] / (w * h * 4));
                    }
                    const envelope = {
                      meanAbsoluteDelta: total / (width * height * 4),
                      maxTileMAE,
                      alphaChanges,
                      maxColorDelta,
                      changedPixels,
                    };
                    if (
                      envelope.meanAbsoluteDelta <= 1 &&
                      envelope.maxTileMAE <= 3 &&
                      alphaChanges === 0
                    ) {
                      rows.push({
                        name: face.name,
                        set: face.setCode,
                        wordingMode,
                        symbolStyle,
                        tier,
                        layer,
                        browser,
                        worker: other.value,
                        rasterEnvelope: envelope,
                      });
                      continue;
                    }
                  }
                  const rounding = {
                    changedPixels,
                    maxColorDelta,
                    alphaChanges,
                    limit: Math.ceil((browser.size[0] * browser.size[1]) / 10000),
                  };
                  if (
                    abuDuals &&
                    alphaChanges === 0 &&
                    maxColorDelta <= 2 &&
                    changedPixels <= rounding.limit
                  ) {
                    rows.push({
                      name: face.name,
                      set: face.setCode,
                      wordingMode,
                      symbolStyle,
                      tier,
                      layer,
                      browser,
                      worker: other.value,
                      rounding,
                    });
                    continue;
                  }
                  rows.push({
                    name: face.name,
                    set: face.setCode,
                    wordingMode,
                    symbolStyle,
                    tier,
                    layer,
                    browser,
                    worker: other.value,
                    rounding,
                    debug: { browser: mainDebug, worker: workerDebug.value },
                  });
                  return rows;
                }

                rows.push({
                  name: face.name,
                  set: face.setCode,
                  wordingMode,
                  symbolStyle,
                  tier,
                  layer,
                  browser,
                  worker: other.value,
                });
              }
      } finally {
        main.dispose();
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      }
      return rows;
    },
    { entry, abuDuals, revised, fourth },
  );
  for (const row of rows.filter((r) => r.debug)) {
    const out = 'test-results/abu-worker-parity';
    await mkdir(out, { recursive: true });
    for (const version of ['browser', 'worker']) {
      const v = row.debug[version];
      await writeFile(
        out + '/' + version + '.png',
        PNG.sync.write({ width: v.size[0], height: v.size[1], data: Buffer.from(v.pixels) }),
      );
    }
    assert.fail(
      JSON.stringify({
        name: row.name,
        tier: row.tier,
        layer: row.layer,
        debug: out,
        browser: row.browser,
        worker: row.worker,
      }),
    );
  }
  assert.equal(rows.length, fourth ? 312 : abuDuals ? 288 : revised ? 160 : 120);
  if (fourth) assert(rows.every((r) => r.set === '4ed'));
  if (revised) assert(rows.every((r) => r.set === '3ed'));
  for (const row of rows) {
    assert.deepEqual(row.browser.size, row.worker.size);
    assert.deepEqual(row.browser.assets, row.worker.assets);
    if (fourth) assert.deepEqual(row.browser.textTrace, row.worker.textTrace);
    if (row.rasterEnvelope) {
      assert(fourth && row.layer !== 'etching');
      assert(row.rasterEnvelope.meanAbsoluteDelta <= 1 && row.rasterEnvelope.maxTileMAE <= 3);
      assert.equal(row.rasterEnvelope.alphaChanges, 0);
    } else if (row.rounding) {
      assert(
        abuDuals &&
          row.rounding.alphaChanges === 0 &&
          row.rounding.maxColorDelta <= 2 &&
          row.rounding.changedPixels <= row.rounding.limit,
      );
    } else assert.equal(row.browser.hash, row.worker.hash);
  }
  console.log(
    JSON.stringify({
      entry,
      cases: rows.length,
      boundedFilterPairs: rows.filter((r) => r.rasterEnvelope).length,
      sparseTwoByteRoundingCases: rows.filter((r) => r.rounding).length,
      scope: fourth
        ? 'Current Fourth white-border profiles, pure/mixed/compact bodies, chosen wording reference and basic/nonbasic controls: exact browser/worker text metrics/draws, assets and masks at table/native/inspect/323px; face filters stay within one 8-bit level/card, three levels/64px tile with exact alpha, Original and both Oracle symbol modes, face/etching. Synthetic assets and local fonts test portability,not scan accuracy.'
        : abuDuals
          ? 'Current Alpha/Beta/Unlimited BG/UR/WU duals and basic controls: browser/worker geometry, alpha and asset requests match (at most 0.01% color pixels may differ by at most two byte levels at antialiased bitmap corners) at table/native/inspect/323px, Original and both Oracle symbol modes, face/default etching. Synthetic assets and local fonts test portability, not scan accuracy.'
          : revised
            ? 'Current Revised Original/Oracle body, land and etching browser/worker replay at table/native/inspect/323px. Synthetic assets and local fonts test portability, not scan accuracy.'
            : 'Current Alpha/Beta/Unlimited browser/OffscreenCanvas pixels and requested assets match for white/black, artifact, dual/basic lands and reviewed text-flow branches, Original/Oracle and table/native tiers. Synthetic assets and local fonts test portability, not scan accuracy.',
    }),
  );
} finally {
  await browser?.close();
  await server.close();
}
