import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  const result = await page.evaluate(async () => {
    const { manaSymbolAsset } = await import('/games/magic/src/presentation/assets.ts');
    const { prepareManaNumerals } = await import('/games/magic/src/presentation/mana-numeral.ts');
    const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
    const { validateSymbolAdjustment } = await import(
      '/games/magic/src/presentation/symbol-adjustment.ts'
    );
    const source = document.createElement('canvas');
    source.width = source.height = 96;
    const c = source.getContext('2d');
    c.fillStyle = '#c1d7e9';
    c.beginPath();
    c.arc(48, 48, 48, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#101010';
    c.fillRect(38, 22, 20, 52);
    const bitmap = await createImageBitmap(source),
      images = new Map([...'WUBRG'].map((s) => [manaSymbolAsset(s), bitmap]));
    const adjustment = { mana: { glyphs: { U: { scale: 0.82, dx: 2, dy: -1 } } } };
    validateSymbolAdjustment({ name: 'Test', symbolAdjustment: adjustment });
    const face = { name: 'Test', manaSymbols: [...'WUBRG'], symbolAdjustment: adjustment };
    const signal = new AbortController().signal;
    const original = CanvasRenderingContext2D.prototype.getImageData;
    let reads = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      reads++;
      return original.apply(this, args);
    };
    const prepared = await prepareManaNumerals(face, images, signal),
      cold = reads;
    const warm = await prepareManaNumerals(face, images, signal),
      warmReads = reads - cold;
    CanvasRenderingContext2D.prototype.getImageData = original;
    const render = (map, a) => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 100;
      for (let i = 0; i < 5; i++)
        paintMana(canvas.getContext('2d'), 'WUBRG'[i], i * 100, 0, 96, map, false, a);
      return canvas.getContext('2d').getImageData(0, 0, 500, 100).data;
    };
    const base = render(images),
      candidate = render(prepared.images, adjustment.mana),
      inline = render(prepared.images);
    let changed = 0,
      other = 0,
      edge = 0,
      inlineChanges = 0;
    for (let y = 0; y < 100; y++)
      for (let x = 0; x < 500; x++)
        for (let k = 0; k < 4; k++) {
          const i = (y * 500 + x) * 4 + k;
          if (base[i] !== candidate[i]) {
            if (x < 100 || x >= 200) other++;
            else {
              changed++;
              if (Math.hypot(x - 148, y - 48) > 44) edge++;
            }
          }
          if (base[i] !== inline[i]) inlineChanges++;
        }
    const rejected = [];
    for (const glyphs of [
      { C: { scale: 1 } },
      { U: { scale: 2 } },
      { B: { dx: NaN } },
      [],
      { U: null },
      { G: { unknown: 1 } },
    ]) {
      try {
        validateSymbolAdjustment({ name: 'Test', symbolAdjustment: { mana: { glyphs } } });
        rejected.push(false);
      } catch {
        rejected.push(true);
      }
    }
    prepared.dispose();
    warm.dispose();
    bitmap.close();
    return { changed, other, edge, inlineChanges, cold, warmReads, rejected };
  });
  assert.ok(result.changed > 100, JSON.stringify(result));
  assert.equal(result.other, 0);
  assert.equal(result.edge, 0);
  assert.equal(result.inlineChanges, 0);
  assert.equal(result.cold, 1);
  assert.equal(result.warmReads, 0);
  assert.ok(result.rejected.every(Boolean));
  console.log(
    'Per-color glyph controls preserve other colors, circle edges and inline symbols; warm preparation performs no pixel readback.',
  );
} finally {
  await browser.close();
  await server.close();
}
