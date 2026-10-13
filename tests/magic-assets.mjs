import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const manifest = JSON.parse(await readFile('games/magic/assets.json', 'utf8')),
  symbolUrl = `${manifest.KEYRUNE_ROOT}/arn.svg`;
// Original test geometry: six closed contours, with one explicitly white hole
// and other genuinely transparent openings. No downloaded asset is used.
const symbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill-rule="evenodd" d="M0 0H100V100H0Z M10 10H25V25H10Z M40 40H60V60H40Z M75 10H90V25H75Z M10 75H25V90H10Z M75 75H90V90H75Z"/></svg>`;
const frame = new PNG({ width: 64, height: 90 });
for (let i = 0; i < frame.data.length; i += 4) frame.data.set([50, 100, 140, 255], i);
const png = PNG.sync.write(frame),
  requests = new Map();
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage();
  await page.route('https://**/*', async (route) => {
    const url = route.request().url();
    requests.set(url, (requests.get(url) ?? 0) + 1);
    await route.fulfill({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      contentType: url === symbolUrl ? 'image/svg+xml' : 'image/png',
      body: url === symbolUrl ? symbol : png,
    });
  });
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async (symbolUrl) => {
    const { magic } = await import('/games/magic/src/index.ts');
    const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { canvasAssetUrls, loadCanvasImages } = await import(
      '/games/magic/src/presentation/canvas-assets.ts'
    );
    const { resolveCanvasSources, clearHistoricalSymbolSources } = await import(
      '/games/magic/src/presentation/historical-symbol-sources.ts'
    );
    const { historicalBackingKey } = await import(
      '/games/magic/src/presentation/historical-symbol-backing.ts'
    );
    const { manaSymbolAsset } = await import('/games/magic/src/presentation/assets.ts');
    const { earlyHsbMaterialKey } = await import(
      '/games/magic/src/presentation/early-hsb-material.ts'
    );
    const { earlyHsbBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const { EARLY_HSB_PROFILES } = await import(
      '/games/magic/src/presentation/early-hsb-profiles.ts'
    );
    const { AssetStore } = await import('/packages/browser/src/assets.ts');
    const { default: initialize } = await import('/packages/browser/generated/renderer.js');
    await initialize({ module_or_path: '/packages/browser/generated/renderer_bg.wasm' });
    const check = (condition, message) => {
      if (!condition) throw Error(message);
    };
    const local = 'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
    for (const [family, style, weight] of [
      ['Goudy', 'normal', '400'],
      ['Historic Symbols', 'normal', '400'],
      ['Beleren', 'normal', '400 700'],
      ['MPlantin', 'normal', '400'],
      ['MPlantin', 'italic', '400'],
      ['Relay', 'normal', '400'],
      ['Artist Credit', 'normal', '400'],
    ])
      document.fonts.add(
        await new FontFace('CardRenderer MTG ' + family, local, { style, weight }).load(),
      );
    const face = {
        name: 'Test specimen',
        typeLine: 'Artifact',
        setCode: 'arn',
        setSymbolSource: 'keyrune',
        rarity: 'common',
        rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Pay {G}.' }] }],
      },
      input = { face, printingId: null, printedImage: null },
      signal = new AbortController().signal,
      host = new AssetStore(32 * 1024 * 1024),
      green = manaSymbolAsset('G');
    check(canvasAssetUrls(face).includes(green), 'Retro paragraph-only mana was not requested');
    check(
      canvasAssetUrls({ ...face, setCode: 'm21' }).includes(green),
      'Modern paragraph-only mana was not requested',
    );
    const pixels = (canvas) =>
      canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    const differences = (a, b) => a.reduce((n, v, i) => n + Number(v !== b[i]), 0);
    let parity = 0,
      backingEffect = 0;
    for (const tier of ['table', 'inspect']) {
      const publicFace = await magic.describe(face, tier).color.paint(host, signal),
        directFace = await composeCardTexture(input, tier, signal),
        loaded = await loadCanvasImages(canvasAssetUrls(face), signal);
      try {
        parity += differences(pixels(publicFace), pixels(directFace));
        const without = new Map(loaded.images);
        without.delete(historicalBackingKey(symbolUrl));
        const missing = await composeCardTexture(input, tier, signal, {
          loadImages: async () => ({ images: without, dispose() {} }),
        });
        backingEffect += differences(pixels(publicFace), pixels(missing));
        missing.width = missing.height = 0;
      } finally {
        loaded.dispose();
        check(loaded.images.size === 0, 'Direct disposal retained closed image handles');
        publicFace.width = publicFace.height = directFace.width = directFace.height = 0;
      }
    }
    check(parity === 0, `Public/direct pixels differ: ${parity}`);
    check(backingEffect > 20, 'Backing did not affect visible historical details');
    const coldDecodes = host.decodes;
    const warm = await magic
      .describe({ ...face, name: 'Second specimen' }, 'inspect')
      .color.paint(host, signal);
    warm.width = warm.height = 0;
    check(host.decodes === coldDecodes, 'A different face decoded resident assets again');

    // Separate cards and raster tiers share the same calibrated component.
    const profileKey = '3ed-R',
      adjustment = EARLY_HSB_PROFILES['lea-U'],
      [set, material] = profileKey.split('-'),
      calibrated = {
        name: 'Calibrated specimen',
        typeLine: material === 'A' ? 'Artifact' : 'Creature',
        colors: material === 'A' ? [] : [material],
        setCode: set,
        colorCalibration: 'early-hsb-v1',
      },
      buildsBefore = earlyHsbBitmapCache.stats.builds,
      calibratedPublic = await magic.describe(calibrated, 'table').color.paint(host, signal),
      calibratedDirect = await composeCardTexture(
        {
          face: { ...calibrated, name: 'Another calibrated specimen' },
          printingId: null,
          printedImage: null,
        },
        'inspect',
        signal,
      );
    calibratedPublic.width =
      calibratedPublic.height =
      calibratedDirect.width =
      calibratedDirect.height =
        0;
    check(
      earlyHsbBitmapCache.stats.builds === buildsBefore + 1,
      'HSB repeated across card/tier/loaders',
    );
    check(earlyHsbBitmapCache.stats.hits > 0, 'Calibrated component was not reused');
    const dualFace = { ...calibrated, setCode: '3ed', colors: ['W'], typeLine: 'Instant' };
    const dualFirst = await magic.describe(dualFace, 'table').color.paint(host, signal);
    const dualBuilds = earlyHsbBitmapCache.stats.builds;
    const dualSecond = await magic
      .describe({ ...dualFace, name: 'Another masked specimen' }, 'inspect')
      .color.paint(host, signal);
    check(earlyHsbBitmapCache.stats.builds === dualBuilds, 'Masked HSB rebuilt across cards/tiers');
    dualFirst.width = dualFirst.height = dualSecond.width = dualSecond.height = 0;
    const identity = earlyHsbMaterialKey('pinned:source', 768, 1075, adjustment);
    check(
      identity !== earlyHsbMaterialKey('pinned:other-source', 768, 1075, adjustment),
      'Source missing from material key',
    );
    check(
      identity !== earlyHsbMaterialKey('pinned:source', 244, 340, adjustment),
      'Dimensions missing from material key',
    );
    check(
      identity !==
        earlyHsbMaterialKey('pinned:source', 768, 1075, {
          ...adjustment,
          hueDegrees: adjustment.hueDegrees + 1,
        }),
      'Transform missing from material key',
    );

    // Encoded-source teardown must never close a bitmap owned by the host.
    const sources = await resolveCanvasSources([symbolUrl], signal),
      images = await host.images(
        sources.urls.map((url) => ({ url })),
        signal,
      ),
      original = images.value.get(sources.aliases.get(symbolUrl)),
      width = original.width;
    magic.dispose();
    check(earlyHsbBitmapCache.stats.bytes === 0, 'Pack disposal retained idle derived bitmaps');
    check((await fetch(sources.aliases.get(symbolUrl))).ok, 'Active source was revoked early');
    sources.dispose();
    let revoked = false;
    try {
      await fetch(sources.aliases.get(symbolUrl));
    } catch {
      revoked = true;
    }
    check(revoked, 'Retired object URL survived its final source lease');
    check(original.width === width, 'Derived-source cleanup closed the host bitmap');
    images.release();
    host.dispose();

    // Concurrent consumers share preparation, but cancellation is independent.
    const nativeFetch = window.fetch;
    let releaseFetch,
      fetches = 0;
    const gate = new Promise((resolve) => (releaseFetch = resolve));
    window.fetch = async (url, options) => {
      if (url === symbolUrl) {
        fetches++;
        await gate;
      }
      return nativeFetch(url, options);
    };
    const canceled = new AbortController(),
      first = resolveCanvasSources([symbolUrl], canceled.signal),
      second = resolveCanvasSources([symbolUrl], signal);
    canceled.abort();
    releaseFetch();
    const settled = await Promise.allSettled([first, second]);
    window.fetch = nativeFetch;
    check(settled[0].status === 'rejected', 'Canceled source preparation succeeded');
    check(settled[1].status === 'fulfilled', 'One cancellation poisoned a shared source');
    check(fetches === 1, 'Concurrent symbol preparation fetched twice');
    settled[1].value.dispose();
    clearHistoricalSymbolSources();

    // When no consumer remains, cancel the source fetch instead of keeping a
    // retired network job alive or caching its rejection.
    let started,
      networkCanceled = false;
    const start = new Promise((resolve) => (started = resolve));
    window.fetch = (url, options) =>
      url === symbolUrl
        ? new Promise((_, reject) => {
            options.signal.addEventListener('abort', () => {
              networkCanceled = true;
              reject(options.signal.reason);
            });
            started();
          })
        : nativeFetch(url, options);
    const sole = new AbortController(),
      pending = resolveCanvasSources([symbolUrl], sole.signal);
    await start;
    sole.abort();
    const canceledOnly = await Promise.allSettled([pending]);
    window.fetch = nativeFetch;
    check(canceledOnly[0].status === 'rejected', 'Canceled source retained its consumer');
    check(networkCanceled, 'Unneeded historical source fetch continued after cancellation');

    // A failed parse must leave no cached rejection, allowing a corrected retry.
    window.fetch = async (url, options) =>
      url === symbolUrl
        ? new Response('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0H1V1Z"/></svg>')
        : nativeFetch(url, options);
    let invalidRejected = false;
    try {
      await resolveCanvasSources([symbolUrl], signal);
    } catch (error) {
      invalidRejected = /Unexpected pinned/.test(String(error));
    }
    window.fetch = nativeFetch;
    check(invalidRejected, 'Malformed pinned symbol was silently accepted');
    const retry = await resolveCanvasSources([symbolUrl], signal);
    retry.dispose();
    clearHistoricalSymbolSources();
    const customUrl = symbolUrl + '?custom',
      custom = await resolveCanvasSources([customUrl], signal);
    check(custom.urls[0] === customUrl && custom.aliases.size === 1, 'Custom asset was rewritten');
    custom.dispose();
    return { parity, backingEffect, coldDecodes, fetches };
  }, symbolUrl);
  assert.equal(result.parity, 0);
  assert.ok(result.backingEffect > 20);
  assert.equal(result.fetches, 1);
  // First bundle, isolated concurrent bundle, and successful retry: never one
  // source fetch per face, tier, or direct/public rendering path.
  assert.equal(requests.get(symbolUrl), 3);
  console.log(
    'Magic loading: public/direct symbol parity, paragraph mana, warm decoded reuse, shared-source cancellation, validation retry and ownership pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
