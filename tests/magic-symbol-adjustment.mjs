import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  root: process.cwd(),
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (r) => r.abort());
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  const results = await page.evaluate(async () => {
    const m = await import('/games/magic/src/presentation.ts');
    // Synthetic geometry test: avoid network font dependencies.
    document.fonts.load = async () => [{ status: 'loaded' }];
    const hash = async (canvas) =>
      Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            'SHA-256',
            canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data,
          ),
        ),
      ).join(',');
    const out = [];
    for (const [setCode, frameStyle, frameAssetFamily] of [
      ['3ed', 'retro'],
      ['usg', 'retro'],
      ['8ed', 'modern', 'eighth'],
      ['m21', 'modern'],
      ['m21', 'modern', 'm15-accurate'],
    ]) {
      const face = {
        name: 'A very long title for fitting',
        typeLine: 'Creature — Human',
        rulesText: 'Flying',
        colors: ['W'],
        manaSymbols: ['2', 'W'],
        setCode,
        frameStyle,
        frameAssetFamily,
        rarity: 'rare',
      };
      const images = new Map(
        m
          .canvasAssetUrls(face)
          .filter(Boolean)
          .map((url) => {
            const c = document.createElement('canvas');
            c.width = 488;
            c.height = 680;
            const ctx = c.getContext('2d');
            ctx.fillStyle =
              url.includes('/symbols/') || url.includes('setSymbols') ? '#182332' : '#ccc1aa';
            ctx.fillRect(0, 0, c.width, c.height);
            return [url, c];
          }),
      );
      const paint = async (extra) =>
        m.composeCardTexture(
          { face: { ...face, ...extra }, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
          {
            loadImages: async () => ({ images, dispose() {} }),
            loadFonts: async () => {},
            loadRetroFont: async () => {},
          },
        );
      const baseline = await paint({}),
        zero = await paint({
          symbolAdjustment: {
            mana: { dx: 0, dy: 0, scaleX: 1, scaleY: 1 },
            set: { dx: 0, dy: 0, scaleX: 1, scaleY: 1 },
          },
        });
      const changed = await paint({
        symbolAdjustment: {
          mana: { dx: 0.5, dy: -0.5, scaleX: 1.1, scaleY: 1.1 },
          set: { dx: 1, dy: -1, scaleX: 1.1, scaleY: 0.9 },
        },
      });
      const a = baseline.getContext('2d').getImageData(0, 0, 732, 1020).data,
        b = changed.getContext('2d').getImageData(0, 0, 732, 1020).data;
      let outside = 0;
      for (let y = 0; y < 1020; y++)
        if (y >= 95 * 1.5 && (y < 350 * 1.5 || y >= 435 * 1.5))
          for (let x = 0; x < 732 * 4; x++)
            if (a[y * 732 * 4 + x] !== b[y * 732 * 4 + x]) outside++;
      out.push({
        setCode,
        frameAssetFamily,
        zero: (await hash(baseline)) === (await hash(zero)),
        changed: (await hash(baseline)) !== (await hash(changed)),
        outside,
      });
    }
    let rejected = 0;
    for (const symbolAdjustment of [
      { mana: { dx: Infinity } },
      { set: { scaleX: 0 } },
      { unknown: { dx: 1 } },
    ])
      try {
        m.validateSymbolAdjustment({ name: 'x', symbolAdjustment });
      } catch {
        rejected++;
      }
    try {
      m.validateSymbolAdjustment({
        name: 'x',
        layout: 'saga',
        symbolAdjustment: { mana: { dx: 1 } },
      });
    } catch {
      rejected++;
    }
    return {
      out,
      rejected,
      bounds: m.adjustedSymbolBounds([10, 20, 30, 40], { dx: 0.5, scaleX: 1.1, scaleY: 0.9 }),
    };
  });
  assert.ok(
    results.out.every((r) => r.zero && r.changed && r.outside === 0),
    JSON.stringify(results),
  );
  assert.equal(results.rejected, 4);
  assert.deepEqual(results.bounds, [7.5, 22, 33, 36]);
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
  await server.close();
}
