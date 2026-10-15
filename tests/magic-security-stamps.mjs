import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';

for (const stamp of [undefined, 'oval', 'triangle', 'acorn', 'circle', 'arena', 'heart']) {
  const { face } = presentation({
    card: {
      name: 'Printing',
      type_line: 'Creature',
      frame: '2015',
      rarity: 'rare',
      security_stamp: stamp,
    },
  });
  assert.equal(face.securityStamp, stamp ?? 'none');
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const {
      hasOvalSecurityStamp,
      mountedSecurityStamp,
      canvasAssetUrls,
      canvasAssetWidth,
      composeCardTexture,
      cardTextureKey,
      withCardWording,
      ordinaryTextLayout,
    } = await import('/games/magic/src/presentation.ts');
    const check = (condition, message) => {
      if (!condition) throw Error(message);
    };
    const base = {
      name: 'Original test',
      typeLine: 'Enchantment',
      colors: ['W'],
      rarity: 'rare',
      rulesText: 'Draw a card.',
      setCode: 'GLINT',
      frameStyle: 'modern',
      securityStamp: 'oval',
    };
    const input = (face, layer) => ({
      printingId: null,
      printedImage: null,
      face,
      paintLayer: layer,
    });
    check(
      cardTextureKey(input(base), 'inspect') !==
        cardTextureKey(input({ ...base, securityStamp: 'none' }), 'inspect'),
      'Stamp choice aliases a face cache key',
    );
    check(
      withCardWording(base, { original: base, oracle: { ...base, rulesText: 'Changed' } }, 'oracle')
        .securityStamp === 'oval',
      'Wording changed the physical stamp',
    );
    for (const kind of ['none', 'triangle', 'acorn', 'circle', 'arena', 'heart']) {
      check(
        !hasOvalSecurityStamp({ ...base, securityStamp: kind }),
        'Non-oval printing became an oval',
      );
      check(!mountedSecurityStamp({ ...base, securityStamp: kind }), 'Unexpected mount');
    }
    check(hasOvalSecurityStamp({ ...base, rarity: 'uncommon' }), 'Explicit uncommon oval ignored');
    check(
      hasOvalSecurityStamp({ ...base, securityStamp: undefined }),
      'Custom modern rare default lost',
    );
    for (const override of [
      { frameStyle: 'retro' },
      { frameAssetFamily: 'eighth' },
      { frameTemplate: 'future' },
      { layout: 'ability' },
      { typeLine: 'Enchantment — Class' },
    ])
      check(
        mountedSecurityStamp({ ...base, ...override }) === null,
        'Unsupported family borrowed a mount',
      );
    const split = {
      ...base,
      layout: 'split',
      faces: [
        { name: 'One', typeLine: 'Instant' },
        { name: 'Two', typeLine: 'Sorcery' },
      ],
    };
    const splitUrls = canvasAssetUrls(split).filter(Boolean);
    check(
      splitUrls.some((s) => s.endsWith('/holoStamps/stamp.png')),
      'Split plain interior missing',
    );
    check(!splitUrls.some((s) => /m15HoloStamp/.test(s)), 'Split acquired a colored mount');
    check(
      !canvasAssetUrls({ ...split, securityStamp: 'none' }).some((s) =>
        s?.endsWith('/holoStamps/stamp.png'),
      ),
      'Split physical opt-out ignored',
    );
    const solid = async (color) => {
      const c = document.createElement('canvas');
      c.width = 40;
      c.height = 56;
      const x = c.getContext('2d');
      x.fillStyle = color;
      x.fillRect(0, 0, 40, 56);
      return createImageBitmap(c);
    };
    const frame = await solid('#798b73'),
      stampImage = await solid('#e219ab');
    const raster = async (face, tier, layer, missing = false) =>
      composeCardTexture(input(face, layer), tier, new AbortController().signal, {
        loadFonts: async () => {},
        loadRetroFont: async () => {},
        loadImages: async (urls) => ({
          images: new Map(
            urls
              .filter(Boolean)
              .filter((url) => !missing || url !== mountedSecurityStamp(face)?.image)
              .map((url) => [url, /holoStamps|planeswalker\/holo/.test(url) ? stampImage : frame]),
          ),
          dispose() {},
        }),
      });
    const checks = [];
    for (const override of [
      {},
      { typeLine: 'Legendary Creature', power: 2, toughness: 2 },
      { frameAssetFamily: 'm15-accurate' },
      { typeLine: 'Planeswalker', loyalty: 4, rulesText: '+1: Draw a card.' },
    ]) {
      const face = { ...base, ...override },
        stamp = mountedSecurityStamp(face);
      check(stamp && canvasAssetUrls(face).includes(stamp.image), 'Stamp source not declared');
      check(
        canvasAssetWidth(stamp.image) === undefined,
        'Small decoration enlarged to full plate size',
      );
      for (const tier of ['table', 'inspect']) {
        const a = await raster({ ...face, securityStamp: 'none' }, tier);
        const b = await raster(face, tier);
        const pa = a.getContext('2d').getImageData(0, 0, a.width, a.height).data;
        const pb = b.getContext('2d').getImageData(0, 0, b.width, b.height).data;
        const scale = a.width / 488,
          [x, y, w, h] = stamp.rect;
        let changed = 0;
        for (let i = 0; i < pa.length; i += 4) {
          if ([0, 1, 2, 3].every((c) => pa[i + c] === pb[i + c])) continue;
          const px = (i / 4) % a.width,
            py = Math.floor(i / 4 / a.width);
          check(
            px >= Math.floor(x * scale) - 1 &&
              px < Math.ceil((x + w) * scale) + 1 &&
              py >= Math.floor(y * scale) - 1 &&
              py < Math.ceil((y + h) * scale) + 1,
            'Stamp changed unrelated printing',
          );
          changed++;
        }
        check(changed > 100, 'Stamp missing from composed face');
        const artA = await raster({ ...face, securityStamp: 'none' }, tier, 'artwork');
        const artB = await raster(face, tier, 'artwork');
        check(artA.toDataURL() === artB.toDataURL(), 'Stamp leaked onto the artwork-only layer');
        checks.push({
          family: override.typeLine ?? override.frameAssetFamily ?? 'normal',
          tier,
          changed,
        });
        for (const c of [a, b, artA, artB]) c.width = c.height = 0;
      }
    }
    let rejected = false;
    try {
      await raster(base, 'inspect', undefined, true);
    } catch (e) {
      rejected = /stamp asset/.test(e.message);
    }
    check(rejected, 'Missing required stamp published a partial face');
    const c = document.createElement('canvas').getContext('2d');
    const [x, y, w, h] = mountedSecurityStamp(base).rect;
    const intersects = (line) => {
      const [left, top, width, height] = line.inkBounds;
      return left < x + w && left + width > x && top < y + h && top + height > y;
    };
    let collisionTested = false;
    for (let count = 80; count < 220; count++) {
      const dense = { ...base, rulesText: 'Word '.repeat(count) };
      const without = ordinaryTextLayout(c, { ...dense, securityStamp: 'none' });
      if (without.overflow || !without.lines.some(intersects)) continue;
      const fitted = ordinaryTextLayout(c, dense);
      check(
        !fitted.overflow && !fitted.lines.some(intersects),
        'Dense lettering overlaps the physical oval',
      );
      collisionTested = true;
      break;
    }
    check(collisionTested, 'Dense collision control did not exercise the oval');
    // The native mounts have a black rectangular foot. Match that foot to the
    // stock once, without changing the source, alpha, ring or hologram pixels.
    const { prepareEarlyHsb } = await import('/games/magic/src/presentation/early-hsb-material.ts');
    const { earlyHsbBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = 4;
    sourceCanvas.height = 1;
    const sourceContext = sourceCanvas.getContext('2d');
    const sourcePixels = new Uint8ClampedArray([
      0, 0, 0, 0, 0, 0, 0, 255, 200, 30, 20, 255, 250, 250, 250, 255,
    ]);
    sourceContext.putImageData(new ImageData(sourcePixels, 4, 1), 0, 0);
    const source = await createImageBitmap(sourceCanvas),
      url = mountedSecurityStamp(base).image,
      images = new Map([[url, source]]);
    earlyHsbBitmapCache.clear();
    const readImage = CanvasRenderingContext2D.prototype.getImageData;
    let readbacks = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      readbacks++;
      return readImage.apply(this, args);
    };
    let cold, warm;
    try {
      cold = await prepareEarlyHsb(base, images, new AbortController().signal);
      check(readbacks === 1, 'Cold stamp did not prepare exactly once');
      warm = await prepareEarlyHsb(base, images, new AbortController().signal);
      check(readbacks === 1, 'Warm stamp repeated a material readback');
      check(cold.images.get(url) === warm.images.get(url), 'Stamp material not shared');
      check(images.get(url) === source, 'Borrowed source was replaced');
    } finally {
      CanvasRenderingContext2D.prototype.getImageData = readImage;
    }
    sourceContext.clearRect(0, 0, 4, 1);
    sourceContext.drawImage(cold.images.get(url), 0, 0);
    const preparedPixels = sourceContext.getImageData(0, 0, 4, 1).data;
    check(
      [...preparedPixels].join() ===
        [0, 0, 0, 0, 9, 8, 6, 255, 200, 30, 20, 255, 250, 250, 250, 255].join(),
      'Stock mapping changed alpha or bright stamp pixels',
    );
    sourceContext.clearRect(0, 0, 4, 1);
    sourceContext.drawImage(source, 0, 0);
    check(
      [...sourceContext.getImageData(0, 0, 4, 1).data].join() === [...sourcePixels].join(),
      'Stamp preparation mutated the source',
    );
    cold.dispose();
    warm.dispose();
    check(earlyHsbBitmapCache.stats.bytes === 16, 'Stamp material bytes unaccounted');
    earlyHsbBitmapCache.clear();
    check(earlyHsbBitmapCache.stats.bytes === 0, 'Stamp material leaked after eviction');
    source.close();
    frame.close();
    stampImage.close();
    return checks;
  });
  console.log(
    'Security stamps: physical metadata, cache isolation, both raster tiers, art separation, missing-source rejection, and split/plain preservation.',
    result,
  );
} finally {
  await browser.close();
  await server.close();
}
