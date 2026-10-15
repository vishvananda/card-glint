import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Original geometry exercises material polarity and coordinate transforms.
// Replace only checksum expectations in this test server; no third-party bytes.
const synthetic = {
  monochrome:
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path style="fill:#ffffff" d="M0 0H100V100H0Z"/><path d="M10 10H90V90H10Z"/><path fill="#fff" d="M20 20H25V80H20Z"/><path fill="#fff" d="M30 20H35V80H30Z"/><path fill="#fff" d="M40 20H45V80H40Z"/><path fill="#fff" d="M50 20H55V80H50Z"/><path fill="#fff" d="M60 20H65V80H60Z"/></svg>',
  m15: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="160"><path d="M0 0H300V160H0Z"/><linearGradient id="g"><stop stop-color="#4488aa"/><stop offset="1" stop-color="#ddeeff"/></linearGradient><path fill="url(#g)" d="M30 30H50V90H30Z"/><path fill="url(#g)" d="M60 30H80V90H60Z"/><path fill="url(#g)" d="M90 30H110V90H90Z"/><path fill="url(#g)" d="M120 30H140V90H120Z"/><path fill="url(#g)" d="M150 30H170V90H150Z"/></svg>',
  rim: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><radialGradient id="g"><stop stop-color="#888"/><stop offset="1" stop-color="#ddd"/></radialGradient><path d="M0 0H100V100H0Z"/><path fill="#333" d="M5 5H95V95H5Z"/><path fill="url(#g)" d="M10 10H90V90H10Z"/></svg>',
  numeric:
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500"><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" x2="300" gradientTransform="matrix(1 0 0 1 0 0)"><stop stop-color="#4488aa"/><stop offset="1" stop-color="#ddeeff"/></linearGradient><path fill="#fff" d="M0 0H600V500H0Z"/><path d="M10 10H590V490H10Z"/><g transform="matrix(2 0 0 2 0 0)"><path style="fill:url(#g)" d="M80 20H220V220H80Z M10 40H70V200H10Z M230 40H290V200H230Z"/></g><path d="M250 100H270V350H250Z"/></svg>',
};
const manifest = JSON.parse(await readFile('games/magic/symbol-svg-patches.json', 'utf8'));
for (const rule of Object.values(manifest.sources))
  rule.sha256 = createHash('sha256')
    .update(
      synthetic[
        rule.recipe === 'remove-outer-white'
          ? 'monochrome'
          : rule.recipe === 'm15'
            ? 'm15'
            : rule.recipe === 'white-outer-rim'
              ? 'rim'
              : 'numeric'
      ],
    )
    .digest('hex');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  plugins: [
    {
      name: 'synthetic-patch-inputs',
      enforce: 'pre',
      load(id) {
        if (id.endsWith('/symbol-svg-patches.json')) return JSON.stringify(manifest);
      },
    },
  ],
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
const requests = new Map();
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => {
    const url = route.request().url();
    requests.set(url, (requests.get(url) ?? 0) + 1);
    return route.fulfill({
      contentType: 'image/svg+xml',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: synthetic[
        url.includes('/leg-')
          ? 'monochrome'
          : url.includes('/m15-')
            ? 'm15'
            : /\/[67]ed-/.test(url)
              ? 'rim'
              : 'numeric'
      ],
    });
  });
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const { styledSetSymbol } = await import('/games/magic/src/presentation/styled-set-symbols.ts');
    const { patchSymbolSvg, hasSymbolSvgPatch } = await import(
      '/games/magic/src/presentation/symbol-svg-patches.ts'
    );
    const { resolveCanvasSources, clearHistoricalSymbolSources } = await import(
      '/games/magic/src/presentation/historical-symbol-sources.ts'
    );
    const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { AssetStore } = await import('/packages/browser/src/assets.ts');
    const { default: init } = await import('/packages/browser/generated/renderer.js');
    await init({ module_or_path: '/packages/browser/generated/renderer_bg.wasm' });
    const check = (ok, message) => {
        if (!ok) throw Error(message);
      },
      signal = new AbortController().signal;
    const urls = ['m15', '8ed', '9ed', '7ed', '6ed'].map((code) => styledSetSymbol(code, 'rare'));
    urls.push(...['6ed', '7ed', '8ed', '9ed'].map((code) => styledSetSymbol(code, 'uncommon')));
    urls.push(styledSetSymbol('leg', 'rare'));
    const parsed = [];
    for (const url of urls) {
      const sources = await resolveCanvasSources([url, url], signal);
      check(sources.urls.length === 1, 'Patched symbol created an unnecessary backing');
      const encoded = await (await fetch(sources.aliases.get(url))).text(),
        doc = new DOMParser().parseFromString(encoded, 'image/svg+xml');
      parsed.push(doc);
      check(
        doc.documentElement.getAttribute('data-card-glint-patch') === 'symbol-svg-v5',
        'Patch revision missing',
      );
      sources.dispose();
    }
    check(
      parsed.at(-1).querySelectorAll('path').length === 6,
      'Monochrome rim removal changed internal details',
    );
    const m15 = parsed[0].querySelectorAll('path');
    check(
      m15[0].getAttribute('fill') === 'url(#g)' && m15[1].getAttribute('fill') === '#000',
      'M15 material polarity stayed reversed',
    );
    check(m15[0].getAttribute('stroke') === '#000', 'M15 lost its exterior outline');
    for (const [i, url] of urls.entries()) {
      const doc = parsed[i],
        paths = doc.querySelectorAll('path');
      if (/\/[67]ed-/.test(url)) {
        check(paths[0].getAttribute('fill') === '#fff', 'Historical outer rim must be white');
        check(
          paths[1].getAttribute('fill') === '#333' && paths[2].getAttribute('fill') === 'url(#g)',
          'Historical interior material changed',
        );
        check(doc.querySelector('radialGradient'), 'Historical gradient lost');
      }
    }
    for (const code of ['6ed', '7ed', '8ed', '9ed']) {
      const common = styledSetSymbol(code, 'common'),
        original = new Blob(['unchanged common']);
      check(
        !hasSymbolSvgPatch(common) && (await patchSymbolSvg(common, original)) === original,
        `${code} common must remain byte-for-byte unchanged`,
      );
    }
    const host = new AssetStore(16 * 1024 * 1024);
    for (const url of urls) {
      const sources = await resolveCanvasSources([url], signal),
        lease = await host.images(
          sources.urls.map((url) => ({ url, width: 512 })),
          signal,
        ),
        image = lease.value.get(sources.aliases.get(url));
      const direct = await loadCanvasImages([url], signal),
        other = direct.images.get(url);
      const pixels = (im, width = im.width, height = im.height) => {
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');
        ctx.drawImage(im, 0, 0, width, height);
        const p = ctx.getImageData(0, 0, c.width, c.height).data;
        c.width = c.height = 0;
        return p;
      };
      const pixelsCache = pixels(other);
      if (url.includes('/leg-')) {
        const data = pixels(other, 100, 100),
          at = (x, y) => data.slice((y * 100 + x) * 4, (y * 100 + x) * 4 + 4);
        check(at(5, 50)[3] === 0, 'Early monochrome symbol must not have an exterior white rim');
        check(
          at(12, 50)[0] === 0 && at(12, 50)[3] === 255,
          'Early monochrome contour must remain black',
        );
        check(
          at(22, 50).every((v) => v === 255),
          'White interior detail must stay opaque',
        );
      }
      if (/\/(8ed|9ed)-/.test(url)) {
        const materialPixels = pixels(other, 600, 500),
          at = (x, y) => materialPixels.slice((y * 600 + x) * 4, (y * 600 + x) * 4 + 4),
          black = (rgba) => rgba[0] === 0 && rgba[1] === 0 && rgba[2] === 0 && rgba[3] === 255,
          metallic = (rgba) => rgba[0] > 40 && rgba[1] > 80 && rgba[2] > 100 && rgba[3] === 255;
        check(black(at(260, 200)), 'Numeric symbol must have a black numeral');
        check(black(at(156, 200)), 'Center card frame must stay black');
        for (const x of [40, 180, 420, 540])
          check(metallic(at(x, 200)), 'All three card faces must stay metallic');
        check(at(180, 200)[0] < at(420, 200)[0], 'Center card lost its gradient');
        if (url.includes('/9ed-')) {
          check(metallic(at(246, 200)), '9ED numeral border must be metallic');
          check(
            at(246, 200).every((v, i) => Math.abs(v - at(246, 80)[i]) <= 2),
            '9ED numeral border must use the transformed panel gradient',
          );
        }
      }
      check(
        pixels(image).every((v, i) => v === pixelsCache[i]),
        'Public/direct patch pixels differ',
      );
      const decodes = host.decodes;
      const warm = await host.images(
        sources.urls.map((url) => ({ url, width: 512 })),
        signal,
      );
      check(host.decodes === decodes, 'Warm patched symbol decoded again');
      warm.release();
      direct.dispose();
      lease.release();
      sources.dispose();
    }
    clearHistoricalSymbolSources();
    const custom = 'https://custom.invalid/m15-r.svg',
      blob = new Blob(['custom']);
    check(
      !hasSymbolSvgPatch(custom) && (await patchSymbolSvg(custom, blob)) === blob,
      'Custom URL was patched',
    );
    const nativeFetch = window.fetch;
    window.fetch = async (url, options) =>
      url === urls[0] ? new Response('<svg/>') : nativeFetch(url, options);
    let rejected = false;
    try {
      await resolveCanvasSources([urls[0]], signal);
    } catch (error) {
      rejected = /checksum/.test(String(error));
    }
    window.fetch = nativeFetch;
    check(rejected, 'Changed pinned bytes were accepted');
    const retry = await resolveCanvasSources([urls[0]], signal);
    check((await fetch(retry.urls[0])).ok, 'Failed patch poisoned a retry');
    clearHistoricalSymbolSources();
    check((await fetch(retry.urls[0])).ok, 'Active source was revoked early');
    retry.dispose();
    let revoked = false;
    try {
      await fetch(retry.urls[0]);
    } catch {
      revoked = true;
    }
    check(revoked, 'Patched source survived teardown');
    host.dispose();
    return { urls };
  });
  assert.equal(result.urls.length, 10);
  for (const [i, url] of result.urls.entries())
    assert.equal(requests.get(url), i === 0 ? 2 : 1, 'Preparation fetched a warm source again');
  console.log('SVG patch materials/cache:', result);
} finally {
  await browser.close();
  await server.close();
}
