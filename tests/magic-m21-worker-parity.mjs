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
  page.setDefaultTimeout(120000);
  const url = new URL('m21-worker-parity.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>M21 current worker parity</title>',
    }),
  );
  await page.goto(url);
  const oldDefaults = process.argv.includes('--old-defaults');
  const defaultDonor = oldDefaults || process.argv.includes('--defaults');
  const oldChoices = oldDefaults
    ? (await server.ssrLoadModule('/games/magic/src/calibration/old-frame-default-values.ts'))
        .oldFrameDefaults
    : {};
  const oldSets = oldDefaults
    ? [
        ...Object.entries(oldChoices).map(([set, p]) => [set, p.border]),
        ['mir', 'black'],
        ['ons', 'black'],
      ]
    : [];
  const entry = process.argv.includes('--built')
    ? defaultDonor
      ? '/dist/lib/magic-lazy.js'
      : '/dist/lib/magic-presentation.js'
    : defaultDonor
      ? '/games/magic/src/lazy.ts'
      : '/games/magic/src/presentation.ts';
  const rows = await page.evaluate(
    async ({ entry, fontSources, diagnose, cpuPixels, defaultDonor, oldDefaults, oldSets }) => {
      async function harness(scope, api, fonts, cpuPixels) {
        for (const { family, weight, style } of api.canvasFontAssets)
          (scope.document?.fonts ?? scope.fonts).add(
            await new FontFace(family, fonts[style] ?? fonts.normal, { weight, style }).load(),
          );
        let textTrace = [];
        const patched = [];
        for (const prototype of [
          scope.CanvasRenderingContext2D?.prototype,
          scope.OffscreenCanvasRenderingContext2D?.prototype,
        ].filter(Boolean)) {
          for (const method of ['measureText', 'fillText', 'strokeText']) {
            const original = prototype[method];
            prototype[method] = function (...args) {
              const result = original.apply(this, args);
              const m = this.getTransform();
              textTrace.push([
                method,
                args,
                this.font,
                this.textRendering,
                this.fontKerning,
                this.letterSpacing,
                this.wordSpacing,
                String(this.fillStyle),
                this.shadowColor,
                this.shadowBlur,
                this.shadowOffsetX,
                this.shadowOffsetY,
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
        }
        const images = new Map();
        let requested;
        const loadImages = async (urls, signal) => {
          const out = new Map();
          for (const url of urls.filter(Boolean)) {
            signal.throwIfAborted();
            requested.add(url);
            let image = images.get(url);
            if (!image) {
              let seed = 0;
              for (const char of url) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) >>> 0;
              const rgb = [
                90 + (seed % 120),
                90 + ((seed >>> 8) % 120),
                90 + ((seed >>> 16) % 120),
              ];
              const width = url.endsWith('.svg') ? 256 : 488,
                height = url.endsWith('.svg') ? 256 : 680;
              const ink = [41, 40, 35],
                paper = [213, 196, 161];
              const pixels = new Uint8ClampedArray(width * height * 4);
              for (let y = 0; y < height; y++)
                for (let x = 0; x < width; x++) {
                  const color =
                    x >= (width * 28) / 64 &&
                    x < (width * 36) / 64 &&
                    y >= (height * 12) / 64 &&
                    y < (height * 44) / 64
                      ? ink
                      : x >= (width * 5) / 64 &&
                          x < (width * 59) / 64 &&
                          y >= (height * 10) / 64 &&
                          y < (height * 55) / 64
                        ? paper
                        : rgb;
                  const i = (y * width + x) * 4;
                  pixels[i] = color[0];
                  pixels[i + 1] = color[1];
                  pixels[i + 2] = color[2];
                  pixels[i + 3] = 255;
                }
              // Decoded-pixel bitmaps avoid making the fixture's own GPU canvas
              // interpolation part of the worker-composition comparison.
              image = await createImageBitmap(new ImageData(pixels, width, height));
              images.set(url, image);
            }
            out.set(url, image);
          }
          return { images: out, dispose() {} };
        };
        return {
          async draw(face, tier, layer, debug = false) {
            requested = new Set();
            textTrace = [];
            const result = await api.composeCardTexture(
              { face, printingId: null, printedImage: null, ...(layer ? { layer } : {}) },
              tier,
              new AbortController().signal,
              {
                loadImages,
                loadFonts: async () => {},
                loadRetroFont: async () => {},
                output: 'bitmap',
                cpuPixels,
              },
            );
            if (!(result instanceof ImageBitmap))
              throw Error('Explicit bitmap output was not honored');
            const c = new OffscreenCanvas(result.width, result.height),
              ctx = c.getContext('2d');
            ctx.drawImage(result, 0, 0);
            const pixels = ctx.getImageData(0, 0, c.width, c.height).data;
            const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', pixels)))
              .map((v) => v.toString(16).padStart(2, '0'))
              .join('');
            const out = {
              size: [c.width, c.height],
              hash,
              textTraceHash: Array.from(
                new Uint8Array(
                  await crypto.subtle.digest(
                    'SHA-256',
                    new TextEncoder().encode(JSON.stringify(textTrace)),
                  ),
                ),
              )
                .map((v) => v.toString(16).padStart(2, '0'))
                .join(''),
              geometryHash: Array.from(
                new Uint8Array(
                  await crypto.subtle.digest(
                    'SHA-256',
                    new TextEncoder().encode(
                      JSON.stringify({
                        frame: api.faceFrame(face),
                        rects: api.faceRects(face),
                        profile: api.resolveCardProfile(face),
                        corner: api.faceCornerRadius(face),
                        plate: api.framePlate(face),
                      }),
                    ),
                  ),
                ),
              )
                .map((v) => v.toString(16).padStart(2, '0'))
                .join(''),
              assets: [...requested].sort(),
              ...(debug ? { pixels: pixels.slice() } : {}),
            };
            result.close();
            c.width = c.height = 0;
            return out;
          },
          dispose() {
            for (const image of images.values()) image.close();
            for (const restore of patched) restore();
          },
        };
      }
      const api = await import(entry),
        main = await harness(globalThis, api, fontSources, cpuPixels);
      const code = `import * as api from '${location.origin}${entry}';const ready=(${harness.toString()})(globalThis,api,${JSON.stringify(fontSources)},${JSON.stringify(cpuPixels)});onmessage=async({data})=>{try{if(typeof document!=='undefined')throw Error('Worker has document');const result=await(await ready).draw(data.face,data.tier,data.layer,data.debug);postMessage({ok:true,result},[]);}catch(e){postMessage({ok:false,error:e.stack??e.message});}};`;
      const blob = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
      const worker = new Worker(blob, { type: 'module' });
      const base = {
        name: 'Current profile adept',
        setCode: 'm21',
        frameStyle: 'modern',
        wordingMode: 'original',
        colorCalibration: 'set-hsb-v1',
        illustration: 'original-fixture-art',
        artist: 'Original Artist',
        typeLine: 'Creature — Wizard',
        rulesText: 'Draw a card.',
        power: '2',
        toughness: '3',
        collectorNumber: '10',
        rarity: 'common',
      };
      const faces = ['W', 'U', 'B', 'R', 'G'].map((color) => ({
        ...base,
        name: color + ' adept',
        // Preserve the variable-power glyph as well as ordinary numerals.
        power: color === 'U' ? '*' : base.power,
        toughness: color === 'U' ? '4' : base.toughness,
        colors: [color],
        manaSymbols: ['2', color],
      }));
      faces.push(
        {
          ...base,
          name: 'Neutral artifact',
          artifact: true,
          typeLine: 'Artifact Creature — Golem',
          colors: [],
          manaSymbols: ['4'],
        },
        {
          ...base,
          name: 'Colored artifact',
          artifact: true,
          typeLine: 'Artifact Creature — Golem',
          colors: ['G'],
          manaSymbols: ['4', 'G'],
        },
        ...['W', 'B'].map((color) => ({
          ...base,
          name: color + ' calibrated artifact',
          artifact: true,
          typeLine: 'Artifact Creature — Golem',
          colors: [color],
          manaSymbols: ['4', color],
        })),
        { ...base, name: 'Two color adept', colors: ['W', 'U'], manaSymbols: ['W', 'U'] },
        {
          ...base,
          name: 'Legendary adept',
          legendary: true,
          colors: ['B'],
          typeLine: 'Legendary Creature — Wizard',
          manaSymbols: ['2', 'B'],
        },
      );
      for (const color of ['W', 'U', 'B', 'R', 'G'])
        faces.push({
          ...base,
          name: { W: 'Plains', U: 'Island', B: 'Swamp', R: 'Mountain', G: 'Forest' }[color],
          typeLine:
            'Basic Land — ' +
            { W: 'Plains', U: 'Island', B: 'Swamp', R: 'Mountain', G: 'Forest' }[color],
          land: true,
          creature: false,
          colors: [],
          frameColors: [color],
          producedMana: [color],
          manaSymbols: [],
          rulesText: '',
          power: undefined,
          toughness: undefined,
        });
      for (const colors of [[], ['B', 'G']])
        faces.push({
          ...base,
          name: colors.length ? 'Dual land' : 'Neutral land',
          typeLine: 'Land',
          land: true,
          creature: false,
          colors: [],
          frameColors: colors,
          producedMana: colors,
          manaSymbols: [],
          rulesText: '{T}: Add one mana.',
          power: undefined,
          toughness: undefined,
        });
      for (const [kind, colors, collectorNumber, rulesText] of [
        ['regular', ['W'], '7', '+1: Gain life.\n−3: Draw a card.\n−10: Take another turn.'],
        ['colorless', [], '1', '+2: Gain life.\n−3: Draw a card.\n−10: Take another turn.'],
        [
          'tall',
          ['U'],
          '75',
          'You may draw during another turn.\n+1: Draw a card.\n−3: Choose a creature.\n−10: Take two extra turns.',
        ],
        [
          'deck',
          ['U'],
          '324',
          '+1: Draw a card.\n−3: Choose a creature.\n−10: Take two extra turns.',
        ],
      ])
        faces.push({
          ...base,
          name: kind + ' walker',
          typeLine: 'Legendary Planeswalker — Example',
          colors,
          collectorNumber,
          rulesText,
          manaSymbols: colors.length ? ['4', colors[0]] : ['8'],
          loyalty: '4',
          legendary: true,
          power: undefined,
          toughness: undefined,
        });
      if (oldDefaults) {
        const oldBase = {
          ...base,
          frameStyle: 'retro',
          symbolStyle: 'original',
          typeLine: 'Summon Wizard',
          flavorText: 'A memory of the original printing.',
        };
        const selected = oldSets.map(([setCode, borderColor]) => ({
          ...oldBase,
          setCode,
          borderColor,
          name: setCode + ' default control',
          colors: ['U'],
          manaSymbols: ['2', 'U'],
        }));
        for (const setCode of ['mir', 'ons', '7ed', 'all']) {
          const borderColor = oldSets.find(([code]) => code === setCode)[1];
          const common = { ...oldBase, setCode, borderColor };
          for (const color of ['W', 'B', 'R', 'G'])
            selected.push({
              ...common,
              name: setCode + ' ' + color + ' control',
              colors: [color],
              manaSymbols: ['2', color],
            });
          selected.push(
            {
              ...common,
              name: setCode + ' gold control',
              typeLine: 'Summon Legend',
              legendary: true,
              colors: ['W', 'B'],
              manaSymbols: ['W', 'B'],
            },
            {
              ...common,
              name: setCode + ' artifact control',
              typeLine: 'Artifact Creature',
              artifact: true,
              colors: [],
              manaSymbols: ['4'],
            },
            {
              ...common,
              name: 'Forest',
              typeLine: 'Land',
              land: true,
              creature: false,
              colors: [],
              frameColors: ['G'],
              producedMana: ['G'],
              manaSymbols: [],
              rulesText: '',
              power: undefined,
              toughness: undefined,
            },
            {
              ...common,
              name: setCode + ' dual land',
              typeLine: 'Land',
              land: true,
              creature: false,
              colors: [],
              frameColors: ['U', 'R'],
              producedMana: ['U', 'R'],
              manaSymbols: [],
              rulesText: '{T}: Add {U} or {R}.',
              power: undefined,
              toughness: undefined,
            },
          );
        }
        faces.splice(0, faces.length, ...selected);
      } else if (defaultDonor) {
        const names = [
          'U adept',
          'W calibrated artifact',
          'B calibrated artifact',
          'Plains',
          'Dual land',
          'Legendary adept',
          'regular walker',
        ];
        const selected = faces.filter((face) => names.includes(face.name));
        if (selected.length !== 7) throw Error('Incomplete modern default worker matrix');
        faces.splice(0, faces.length, ...selected.map((face) => ({ ...face, setCode: 'qzz' })));
      }
      const rows = [];
      try {
        for (const face of faces)
          for (const wordingMode of ['original', 'oracle'])
            for (const tier of ['table', 'native', 'inspect'])
              for (const layer of [undefined, 'etching']) {
                const input = { ...face, wordingMode };
                const before = await main.draw(input, tier, layer);
                const reply = await new Promise((resolve, reject) => {
                  worker.onmessage = (event) => resolve(event.data);
                  worker.onerror = (event) => reject(Error(event.message));
                  worker.postMessage({ face: input, tier, layer });
                });
                if (!reply.ok) throw Error(reply.error);
                let debug;
                if (before.hash !== reply.result.hash) {
                  const a = await main.draw(input, tier, layer, true);
                  const b = await new Promise((resolve, reject) => {
                    worker.onmessage = (event) => resolve(event.data);
                    worker.onerror = (event) => reject(Error(event.message));
                    worker.postMessage({ face: input, tier, layer, debug: true });
                  });
                  if (!b.ok) throw Error(b.error);
                  let changedBytes = 0,
                    maxDelta = 0,
                    left = a.size[0],
                    right = -1,
                    top = a.size[1],
                    bottom = -1;
                  const sample = [];
                  for (let i = 0; i < a.pixels.length; i++) {
                    const delta = Math.abs(a.pixels[i] - b.result.pixels[i]);
                    if (!delta) continue;
                    changedBytes++;
                    maxDelta = Math.max(maxDelta, delta);
                    const x = Math.floor(i / 4) % a.size[0],
                      y = Math.floor(i / 4 / a.size[0]);
                    left = Math.min(left, x);
                    right = Math.max(right, x);
                    top = Math.min(top, y);
                    bottom = Math.max(bottom, y);
                    if (sample.length < 8)
                      sample.push({ x, y, channel: i % 4, a: a.pixels[i], b: b.result.pixels[i] });
                  }
                  // HTML and Offscreen raster filters differ at clip edges.
                  // Keep layout/text/asset checks exact, and bound both the
                  // complete face error and each64px tile, so a missing small
                  // element cannot hide in a low full-card average.
                  const width = a.size[0],
                    height = a.size[1],
                    nx = Math.ceil(width / 64);
                  const tiles = new Float64Array(nx * Math.ceil(height / 64));
                  let totalDelta = 0,
                    alphaEnvelopeFailures = 0;
                  for (let y = 0; y < height; y++)
                    for (let x = 0; x < width; x++)
                      for (let k = 0; k < 4; k++) {
                        const i = (y * width + x) * 4 + k,
                          d = Math.abs(a.pixels[i] - b.result.pixels[i]);
                        totalDelta += d;
                        tiles[Math.floor(y / 64) * nx + Math.floor(x / 64)] += d;
                        if (k !== 3 || d <= 1) continue;
                        for (const [from, to] of [
                          [a.pixels, b.result.pixels],
                          [b.result.pixels, a.pixels],
                        ]) {
                          let lo = 255,
                            hi = 0;
                          for (let yy = Math.max(0, y - 1); yy <= Math.min(height - 1, y + 1); yy++)
                            for (
                              let xx = Math.max(0, x - 1);
                              xx <= Math.min(width - 1, x + 1);
                              xx++
                            ) {
                              const v = to[(yy * width + xx) * 4 + 3];
                              lo = Math.min(lo, v);
                              hi = Math.max(hi, v);
                            }
                          if (from[i] < lo - 1 || from[i] > hi + 1) alphaEnvelopeFailures++;
                        }
                      }
                  let maxTileMAE = 0;
                  for (let i = 0; i < tiles.length; i++) {
                    const w = Math.min(64, width - (i % nx) * 64),
                      h = Math.min(64, height - Math.floor(i / nx) * 64);
                    maxTileMAE = Math.max(maxTileMAE, tiles[i] / (w * h * 4));
                  }
                  const meanAbsoluteDelta = totalDelta / a.pixels.length;
                  debug = {
                    name: face.name,
                    wordingMode,
                    tier,
                    layer: layer ?? 'face',
                    changedBytes,
                    maxDelta,
                    bounds: [left, top, right, bottom],
                    sample,
                    meanAbsoluteDelta,
                    maxTileMAE,
                    alphaEnvelopeFailures,
                  };
                }
                rows.push({
                  name: face.name,
                  wordingMode,
                  tier,
                  layer: layer ?? 'face',
                  before,
                  after: reply.result,
                  ...(debug ? { debug } : {}),
                });
              }
      } finally {
        main.dispose();
        worker.terminate();
        URL.revokeObjectURL(blob);
      }
      return rows;
    },
    {
      entry,
      fontSources: await installedSerifFonts(),
      diagnose: process.argv.includes('--diagnose'),
      cpuPixels: process.argv.includes('--cpu'),
      defaultDonor,
      oldDefaults,
      oldSets,
    },
  );
  assert.equal(rows.length, oldDefaults ? (oldSets.length + 32) * 12 : defaultDonor ? 84 : 264);
  if (oldDefaults)
    assert.deepEqual(
      new Set(rows.map((r) => r.name).filter((n) => n.endsWith(' default control'))),
      new Set(oldSets.map(([code]) => code + ' default control')),
    );
  if (process.argv.includes('--diagnose'))
    for (const row of rows) if (row.debug) console.log(JSON.stringify(row.debug));
  for (const row of rows) {
    const { hash: beforeHash, ...before } = row.before,
      { hash: afterHash, ...after } = row.after;
    const label = JSON.stringify({
      name: row.name,
      mode: row.wordingMode,
      tier: row.tier,
      layer: row.layer,
    });
    assert.deepEqual(before, after, label + ' assets, size or text/metric calls changed');
    if (row.debug) {
      assert(
        row.debug.meanAbsoluteDelta <= 1,
        label + ' exceeds one8-bit level mean raster error: ' + JSON.stringify(row.debug),
      );
      assert(
        row.debug.maxTileMAE <= 3,
        label + ' exceeds three8-bit levels in a64px tile: ' + JSON.stringify(row.debug),
      );
      assert.equal(
        row.debug.alphaEnvelopeFailures,
        0,
        label + ' silhouette differs beyond one raster pixel',
      );
    }
    assert(beforeHash === afterHash || row.debug, label + ' missing raster comparison');
    if (row.layer === 'etching') assert.equal(beforeHash, afterHash, label + ' mask changed');
  }
  console.log(
    JSON.stringify({
      entry,
      cases: rows.length,
      exactPixelPairs: rows.filter((r) => r.before.hash === r.after.hash).length,
      rasterEquivalentPairs: rows.filter((r) => r.before.hash !== r.after.hash).length,
      scope: oldDefaults
        ? 'Every34 old-frame starting default plus independent MIR/ONS through the slim entry. Original/Oracle,244/488/732 pixels, face/etching, actual OffscreenCanvas worker and transferable bitmaps. Extra color, gold, artifact and basic/dual land cases cover both donors, the Fourth branch, white stock and mixed/neutral pigment policies. Assets, geometry and text traces stay exact; existing M21 raster bounds are unchanged. Synthetic assets test portability, not scan accuracy.'
        : defaultDonor
          ? 'Inherited M21 defaults through the slim entry:7 roles, Original/Oracle,244/488/732 pixels, face/etching, real OffscreenCanvas worker and transferable ImageBitmap. Both calibrated artifact palettes, basic/dual lands, legend and planeswalker. Same bounded raster envelope as the exact-M21 matrix. Synthetic assets prove portability, not target-set scan accuracy.'
          : 'Current M21 browser/real-worker assets, raster sizes, frame geometry and text draws/metrics match across22 roles, including both calibrated artifact paper palettes, Original/Oracle, all3 tiers, face/etching and transferable bitmap output. Raster tolerance: at most one8-bit level mean/card, three levels/64px tile; silhouette coverage stays within one raster pixel. Exact and bounded-raster pairs are separate. Synthetic assets and installed fonts prove portability, not scan accuracy.',
    }),
  );
} finally {
  await browser?.close();
  await server.close();
}
