import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
await server.listen();
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/__symbol-mask-test', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Symbol mask test</title>' }),
  );
  await page.route('https://**', (r) => r.abort());
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__symbol-mask-test`);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { acquireSetSymbolMask, setSymbolMaskCache: cache } = await import(
      '/games/magic/src/presentation/set-symbol-mask.ts'
    );
    const { paintEtchingMask } = await import('/games/magic/src/presentation/canvas-etching.ts');
    const { magic } = await import('/games/magic/src/index.ts');
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
    const { faceSetSymbol, faceEtchingSymbol } = await import(
      '/games/magic/src/presentation/assets.ts'
    );
    const { resolvePrintingPreset } = await import(
      '/games/magic/src/presentation/printing-presets.ts'
    );
    const { validatePrintingStyle } = await import(
      '/games/magic/src/presentation/printing-style-schema.ts'
    );
    const { splitPanels } = await import('/games/magic/src/presentation/split-layout.ts');
    const check = (ok, label) => {
      if (!ok) throw Error(label);
    };
    const canvas = (w = 64, h = 64) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    };
    const source = canvas(),
      ctx = source.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = 'black';
    ctx.fillRect(4, 4, 56, 56);
    ctx.fillStyle = 'white';
    ctx.fillRect(12, 12, 40, 40);
    ctx.fillStyle = 'black';
    ctx.fillRect(30, 12, 4, 40);
    const pixels = ctx.getImageData(0, 0, 64, 64);
    pixels.data.set([128, 128, 128, 128], (20 * 64 + 40) * 4);
    ctx.putImageData(pixels, 0, 0);
    const bitmap = await createImageBitmap(source),
      signal = new AbortController().signal,
      face = { name: 'Opaque symbol', setCode: 'PLC', typeLine: 'Instant' };
    const url = faceSetSymbol(face, 'common');
    check(url.endsWith('/plc-c.svg'), 'Test must exercise the styled PLC source policy');
    for (const rarity of ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus']) {
      check(
        faceEtchingSymbol({ ...face, rarity }) === url,
        'Every rarity must etch the common symbol',
      );
    }
    for (const rarity of ['uncommon', 'rare']) {
      const printed = faceSetSymbol({ ...face, rarity });
      const overridden = { ...face, setCode: 'M21', rarity, setSymbol: printed };
      check(
        faceEtchingSymbol(overridden) === url,
        'Explicit styled URL must etch its own set common, not the card set or rarity',
      );
      check(faceSetSymbol(overridden) === printed, 'Etching changed the printed rarity symbol');
      const common = { ...overridden, setSymbol: url };
      check(
        magic.describe(overridden, 'inspect').stamp.key ===
          magic.describe(common, 'inspect').stamp.key,
        'Common contours must share the stamp cache across rarity overrides',
      );
    }
    check(
      faceEtchingSymbol({ ...face, setSymbol: '/custom.svg' }) === '/custom.svg',
      'Custom symbol overrides must survive',
    );
    check(
      faceEtchingSymbol({ ...face, printingElements: { setSymbol: { hidden: true } } }) === null,
      'Hidden symbols must stay hidden',
    );

    const original = CanvasRenderingContext2D.prototype.getImageData;
    let reads = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      reads++;
      return original.apply(this, args);
    };
    const samples = (image) => {
      const c = canvas(image.width, image.height),
        g = c.getContext('2d');
      g.drawImage(image, 0, 0);
      const p = original.call(g, 0, 0, c.width, c.height).data;
      return [
        p[3],
        p[(6 * 64 + 6) * 4 + 3],
        p[(20 * 64 + 20) * 4 + 3],
        p[(20 * 64 + 31) * 4 + 3],
        p[(20 * 64 + 40) * 4 + 3],
      ];
    };
    cache.clear();
    let a, b;
    try {
      [a, b] = await Promise.all([
        acquireSetSymbolMask(bitmap, url, undefined, signal),
        acquireSetSymbolMask(bitmap, url, 'ink', signal),
      ]);
      check(
        a.value === b.value && reads === 1,
        'Concurrent preparation must share one source conversion',
      );
      const alpha = samples(a.value);
      check(
        alpha.join(',') === '0,255,0,255,64',
        'Keep black lines, white holes and partial alpha/gray coverage: ' + alpha,
      );
      a.release();
      b.release();
      const warm = await acquireSetSymbolMask(bitmap, url, 'auto', signal);
      check(reads === 1, 'Warm lookup reread source pixels');
      warm.release();
      for (const [symbol, mode] of [
        [url, 'alpha'],
        ['/custom.svg', undefined],
        ['/keyrune.svg', 'auto'],
      ]) {
        const lease = await acquireSetSymbolMask(bitmap, symbol, mode, signal);
        check(lease.value === bitmap, 'Alpha policy must retain the original bitmap');
        lease.release();
      }
      check(reads === 1, 'Alpha-only symbols must skip source readback');
      const explicit = await acquireSetSymbolMask(bitmap, '/opaque-custom.png', 'ink', signal);
      check(samples(explicit.value)[2] === 0, 'Custom opaque bitmap ignores explicit ink mask');
      explicit.release();
      check(
        samples(bitmap).join(',') === '255,255,255,255,128',
        'Normalization modified the borrowed source',
      );
    } finally {
      CanvasRenderingContext2D.prototype.getImageData = original;
    }
    const stats = { ...cache.stats };
    let releases = 0;
    const requested = [];
    const loader = async (urls) => ({
      images: new Map(
        urls.map((u) => {
          requested.push(u);
          return [u, bitmap];
        }),
      ),
      dispose() {
        releases++;
      },
    });
    const draw = async (input) => {
      const c = canvas(488, 680);
      await paintEtchingMask(c.getContext('2d'), input, null, signal, undefined, undefined, loader);
      return c;
    };
    const preset = resolvePrintingPreset(
      { ...face, rarity: 'rare' },
      { preset: 'match', overrides: { setSymbolCode: 'PLC' } },
    );
    await draw(preset);
    check(
      requested.length > 0 && requested.every((source) => source === url),
      'Preset etching requested a colored rarity asset',
    );
    const etched = await draw(face),
      solid = await draw({ ...face, setSymbolMask: 'alpha' }),
      [x, y, w, h] = faceRects(face).stamp.map((n, i) => n * (i % 2 ? 680 : 488));
    const at = (c, sx, sy) =>
      c.getContext('2d').getImageData(Math.floor(x + sx * w), Math.floor(y + sy * h), 1, 1).data[3];
    check(
      at(etched, 0.3, 0.3) === 0 && at(solid, 0.3, 0.3) > 160,
      'The actual stamp painter must preserve internal white holes',
    );
    check(at(etched, 0.49, 0.3) > 160, 'Actual stamp painter lost the internal dark line');
    const moved = await draw({ ...face, printingElements: { setSymbol: { offset: [7, 9] } } });
    const ea = etched.getContext('2d').getImageData(0, 0, 488, 680).data,
      ma = moved.getContext('2d').getImageData(0, 0, 488, 680).data;
    for (let yy = 0; yy < 671; yy++)
      for (let xx = 0; xx < 481; xx++)
        check(
          ea[(yy * 488 + xx) * 4 + 3] === ma[((yy + 9) * 488 + xx + 7) * 4 + 3],
          'Normalized symbol lost its native offset',
        );
    const hidden = await draw({ ...face, printingElements: { setSymbol: { hidden: true } } });
    check(
      !hidden
        .getContext('2d')
        .getImageData(0, 0, 488, 680)
        .data.some((v) => v),
      'Hidden symbol painted ink',
    );
    const key = (input, layer) => cardTextureKey({ face: input, layer }, 'inspect');
    check(
      key(face, 'face') === key({ ...face, setSymbolMask: 'alpha' }, 'face'),
      'Mask mode invalidated printed color',
    );
    check(
      key(face, 'etching') !== key({ ...face, setSymbolMask: 'alpha' }, 'etching'),
      'Direct mask key ignored its mode',
    );
    check(
      magic.describe(face, 'inspect').stamp.key !==
        magic.describe({ ...face, setSymbolMask: 'alpha' }, 'inspect').stamp.key,
      'Public stamp key ignored its mode',
    );
    check(
      magic.describe(face, 'inspect').stamp.key ===
        magic.describe({ ...face, name: 'Another name' }, 'inspect').stamp.key,
      'Text edit invalidated the set mask',
    );
    const split = {
      ...face,
      layout: 'split',
      setSymbolMask: 'ink',
      faces: [{ ...face }, { ...face, setSymbolMask: 'alpha' }],
    };
    check(
      splitPanels(split)
        .map((p) => p.face.setSymbolMask)
        .join(',') === 'ink,alpha',
      'Panel override/inheritance lost',
    );
    check(
      resolvePrintingPreset(face, { preset: 'match', overrides: { setSymbolMask: 'alpha' } })
        .setSymbolMask === 'alpha',
      'Preset override ignored',
    );
    check(
      resolvePrintingPreset({ ...face, setSymbolMask: 'ink' }, { preset: 'm21' }).setSymbolMask ===
        undefined,
      'New preset retained an old mask override',
    );
    let rejected = false;
    try {
      resolvePrintingPreset(face, { preset: 'match', overrides: { setSymbolMask: 'invalid' } });
    } catch {
      rejected = true;
    }
    check(rejected, 'Invalid mask override accepted');
    validatePrintingStyle({
      version: 1,
      id: 'symbol-test',
      label: 'Symbol test',
      defaultFrame: 'normal',
      frames: [
        {
          id: 'normal',
          label: 'Normal',
          selection: { preset: 'm21', overrides: { setSymbolMask: 'ink' } },
        },
      ],
    });
    const cancelled = new AbortController();
    cancelled.abort();
    let abort = false;
    try {
      await acquireSetSymbolMask(bitmap, url, 'ink', cancelled.signal);
    } catch {
      abort = true;
    }
    check(abort, 'Aborted mask preparation succeeded');
    const failed = canvas(488, 680),
      f = failed.getContext('2d');
    f.translate(2, 3);
    f.globalAlpha = 0.4;
    let failure = false;
    try {
      await paintEtchingMask(
        f,
        { ...face, setSymbolMask: 'invalid' },
        null,
        signal,
        undefined,
        undefined,
        loader,
      );
    } catch {
      failure = true;
    }
    check(
      failure && f.getTransform().e === 2 && f.getTransform().f === 3 && f.globalAlpha === 0.4,
      'Failure leaked canvas state',
    );
    check(releases === 5, 'Loaded source leases were not released: ' + releases);
    const png = etched.toDataURL(),
      beforeClear = cache.stats.bytes;
    magic.dispose();
    check(
      cache.stats.bytes === 0 && beforeClear > 0,
      'Pack disposal did not clear symbol derivatives',
    );
    bitmap.close();
    return { alphaReads: reads, stats, leasesReleased: releases, png };
  });
  const { png, ...metrics } = result;
  await mkdir('evidence', { recursive: true });
  await writeFile('evidence/set-symbol-mask.png', Buffer.from(png.split(',')[1], 'base64'));
  assert.deepEqual(errors, []);
  console.log(
    'PASS styled/custom symbol masks, alpha compatibility, partial coverage, cache reuse, offsets, overrides, cancellation and disposal',
    metrics,
  );
} finally {
  await browser.close();
  await server.close();
}
