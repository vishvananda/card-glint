import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';
import { createServer } from 'vite';

// Synthetic assets keep this cross-browser regression offline and distributable.
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'stock-test',
      configureServer(s) {
        s.middlewares.use((req, res, next) => {
          if (req.url !== '/__stock-test') return next();
          res.setHeader('Content-Type', 'text/html');
          res.end('<!doctype html><title>Stock border regression</title>');
        });
      },
    },
  ],
});
await server.listen();
try {
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.route('https://**/*', (route) => route.abort());
      await page.goto(server.resolvedUrls.local[0] + '__stock-test');
      const rows = await page.evaluate(async () => {
        const { paintRetroStockBorder } = await import(
          '/games/magic/src/presentation/retro-stock-border.ts'
        );
        const { legendsFrame } = await import('/games/magic/src/presentation/legends-frame.ts');
        const make = (w, h) => {
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          return c;
        };
        const source = make(732, 1020),
          sc = source.getContext('2d');
        sc.fillStyle = '#fff';
        sc.fillRect(0, 0, 732, 1020);
        sc.fillStyle = '#578760';
        sc.fillRect(26, 26, 680, 968);
        const mask = make(732, 1020),
          mc = mask.getContext('2d');
        mc.fillRect(0, 0, 732, 1020);
        // A nonrectangular aperture checks that only the outside bleed changes.
        mc.globalCompositeOperation = 'destination-out';
        mc.beginPath();
        mc.roundRect(26, 26, 680, 968, 4.5);
        mc.fill();
        const frames = ['G', 'U', 'R', 'A', 'L', 'M'].map((material) => {
          const face = {
            setCode: 'leg',
            colors: material === 'M' ? ['W', 'U'] : [material],
            artifact: material === 'A',
            land: material === 'L',
          };
          return {
            material,
            rect: legendsFrame(face).frame.map((v, i) => v * (i % 2 ? 680 : 488)),
          };
        });
        const rows = [];
        for (const size of [244, 732])
          for (const stock of ['#080808', '#eeedeb', '#b7b7b7'])
            for (const { material, rect } of frames) {
              const [x, y, w, h] = rect,
                scale = size / 488;
              const render = (fixed) => {
                const c = make(size, (size * 680) / 488),
                  ctx = c.getContext('2d');
                ctx.scale(scale, scale);
                ctx.fillStyle = stock;
                ctx.fillRect(0, 0, 488, 680);
                ctx.drawImage(source, ...rect);
                if (fixed) paintRetroStockBorder(ctx, mask, rect, stock);
                else {
                  const layer = make(732, 1020),
                    lc = layer.getContext('2d');
                  lc.drawImage(mask, 0, 0);
                  lc.globalCompositeOperation = 'source-in';
                  lc.fillStyle = stock;
                  lc.fillRect(0, 0, 732, 1020);
                  ctx.drawImage(layer, ...rect);
                }
                return ctx.getImageData(0, 0, c.width, c.height);
              };
              const before = render(false),
                after = render(true),
                rgb = [1, 3, 5].map((start) => parseInt(stock.slice(start, start + 2), 16));
              let beforeBad = 0,
                afterBad = 0,
                interiorChanges = 0,
                interiorMax = 0;
              const badSamples = [];
              for (let yy = 0; yy < after.height; yy++)
                for (let xx = 0; xx < after.width; xx++) {
                  const i = (yy * after.width + xx) * 4;
                  const sx = (((xx + 0.5) / scale - x) * 732) / w,
                    sy = (((yy + 0.5) / scale - y) * 1020) / h;
                  // Exclude only the aperture's antialiasing footprint from stock assertions.
                  if (sx < 22 || sx > 710 || sy < 22 || sy > 998) {
                    beforeBad += Number(before.data[i] !== rgb[0]);
                    if (after.data[i] !== rgb[0] && badSamples.length < 8)
                      badSamples.push([xx, yy, [...after.data.slice(i, i + 4)]]);
                    afterBad += Number(
                      after.data[i] !== rgb[0] ||
                        after.data[i + 1] !== rgb[1] ||
                        after.data[i + 2] !== rgb[2] ||
                        after.data[i + 3] !== 255,
                    );
                  }
                  // Include the inner mask boundary: its position/shape must not move.
                  if (sx > 10 && sx < 722 && sy > 10 && sy < 1010) {
                    for (let channel = 0; channel < 4; channel++) {
                      const d = Math.abs(before.data[i + channel] - after.data[i + channel]);
                      interiorChanges += Number(d !== 0);
                      interiorMax = Math.max(interiorMax, d);
                    }
                  }
                }
              rows.push({
                size,
                stock,
                material,
                beforeBad,
                afterBad,
                interiorChanges,
                interiorMax,
                badSamples,
              });
            }
        return rows;
      });
      for (const row of rows) {
        assert.equal(row.afterBad, 0, `${engine.name()} stock seam: ${JSON.stringify(row)}`);
        assert.equal(
          row.interiorMax,
          0,
          `${engine.name()} aperture changed: ${JSON.stringify(row)}`,
        );
      }
      if (engine === webkit)
        assert.ok(
          rows.some((r) => r.beforeBad > 0),
          'WebKit must reproduce the original fringe',
        );
      console.log(
        engine.name(),
        rows.length,
        'stock/aperture cases pass; old fringes in',
        rows.filter((r) => r.beforeBad).length,
      );
    } finally {
      await browser.close();
    }
  }
} finally {
  await server.close();
}
