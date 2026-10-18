import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
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
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
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
    const { mtg, opticalDocument } = await import('/games/magic/src/index.ts');
    const halves = [
      { name: 'First', typeLine: 'Instant', colors: ['U'] },
      { name: 'Second', typeLine: 'Sorcery', colors: ['R'] },
    ];
    const reflectiveFaces = [
      base,
      { ...base, frameAssetFamily: 'm15-accurate' },
      { ...base, typeLine: 'Planeswalker', rulesText: '+1: Draw a card.' },
      { ...base, typeLine: 'Enchantment — Saga', rulesText: 'I — Draw a card.' },
      { ...base, layout: 'adventure', faces: halves },
      { ...base, layout: 'prepare', faces: halves },
      { ...base, layout: 'aftermath', faces: halves },
      { ...base, layout: 'split', faces: halves },
    ];
    let sharedMask;
    for (const face of reflectiveFaces) {
      const recipe = mtg.describe(face, 'inspect');
      check(recipe.hologram, 'Supported oval lacks a coating');
      const staticRecipe = mtg.describe({ ...face, securityStampEffect: 'static' }, 'inspect');
      check(!staticRecipe.hologram, 'Static opt-out ignored');
      check(staticRecipe.color.key === recipe.color.key, 'Reflection rebuilt static ink');
      check(
        !mtg.describe({ ...face, securityStamp: 'none' }, 'inspect').hologram,
        'Absent oval reflected',
      );
      check(
        !mtg.describe({ ...face, securityStamp: 'triangle' }, 'inspect').hologram,
        'Unsupported shape borrowed oval',
      );
      check(opticalDocument(1, 1, face, 'silver').recipe.hologram, 'Sharp printing lost coating');
      check(
        recipe.hologram.mask.key === (sharedMask?.key ?? recipe.hologram.mask.key),
        'Mask not shared across frames',
      );
      sharedMask = recipe.hologram.mask;
    }
    for (const face of [
      { ...base, frameStyle: 'retro', setCode: '3ed' },
      { ...base, frameAssetFamily: 'eighth' },
      { ...base, frameTemplate: 'future' },
      { ...base, typeLine: 'Enchantment — Class' },
      { ...base, layout: 'split', faces: halves, setCode: 'dgm' },
      { ...base, layout: 'split', faces: halves, frameStyle: 'retro' },
    ])
      check(!mtg.describe(face, 'inspect').hologram, 'Unsupported frame acquired reflection');
    const maskSource = document.createElement('canvas');
    maskSource.width = 134;
    maskSource.height = 67;
    const maskContext = maskSource.getContext('2d');
    maskContext.fillStyle = '#fff';
    maskContext.beginPath();
    maskContext.ellipse(67, 33.5, 67, 33.5, 0, 0, Math.PI * 2);
    maskContext.fill();
    const bitmap = await createImageBitmap(maskSource);
    let releases = 0,
      maskReadbacks = 0;
    const readMaskOriginal = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      maskReadbacks++;
      return readMaskOriginal.apply(this, args);
    };
    const host = {
      async images(requests) {
        check(
          requests.length === 1 && requests[0].width === undefined,
          'Oval mask enlarged or unrelated assets loaded',
        );
        return {
          value: new Map([[requests[0].url, bitmap]]),
          release() {
            releases++;
          },
        };
      },
    };
    let paintedMask;
    try {
      paintedMask = await sharedMask.paint(host, new AbortController().signal);
    } finally {
      CanvasRenderingContext2D.prototype.getImageData = readMaskOriginal;
    }
    check(
      maskReadbacks === 0 && releases === 1,
      'Mask read back pixels or leaked its source lease',
    );
    const alpha = paintedMask.getContext('2d').getImageData(0, 0, 134, 67).data;
    check(
      alpha[(33 * 134 + 67) * 4 + 3] === 255 && alpha[33 * 134 * 4 + 3] === 0,
      'Oval rim was not inset',
    );
    let maskFailed = false;
    try {
      await sharedMask.paint(
        {
          async images() {
            return {
              value: new Map(),
              release() {
                releases++;
              },
            };
          },
        },
        new AbortController().signal,
      );
    } catch {
      maskFailed = true;
    }
    check(maskFailed && releases === 2, 'Missing mask silently published or leaked lease');
    bitmap.close();
    paintedMask.width = paintedMask.height = 0;
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
    // The pinline palette follows frame colors, not the text-box material.
    const pairBase = { ...base, colors: ['W', 'G'] };
    for (const override of [
      {},
      { typeLine: 'Legendary Creature' },
      { typeLine: 'Planeswalker' },
      { typeLine: 'Legendary Land', colors: [], frameColors: ['W', 'G'] },
      { typeLine: 'Artifact Creature' },
    ]) {
      const f = { ...pairBase, ...override },
        mount = mountedSecurityStamp(f);
      check(/(?:StampG|holo\/g)\.png$/.test(mount.image), 'GW left palette is wrong');
      check(/(?:StampW|holo\/w)\.png$/.test(mount.rightImage), 'GW right palette is wrong');
      check(canvasAssetUrls(f).includes(mount.rightImage), 'Right rim source not declared');
      const recipe = mtg.describe(f, 'inspect').hologram;
      check(recipe.mask.key === sharedMask.key, 'Palette rebuilt the optical mask');
    }
    const paletteSource = async (color) => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 40;
      const c = canvas.getContext('2d');
      c.fillStyle = color;
      c.fillRect(0, 0, 100, 10);
      c.fillStyle = '#ccc';
      c.fillRect(0, 10, 100, 20);
      return createImageBitmap(canvas);
    };
    const left = await paletteSource('#c03020'),
      right = await paletteSource('#2040c0');
    const paired = mountedSecurityStamp(pairBase);
    const pairImages = new Map([
      [paired.image, left],
      [paired.rightImage, right],
    ]);
    readbacks = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      readbacks++;
      return readImage.apply(this, args);
    };
    let pairCold, pairWarm;
    try {
      pairCold = await prepareEarlyHsb(pairBase, pairImages, new AbortController().signal);
      pairWarm = await prepareEarlyHsb(pairBase, pairImages, new AbortController().signal);
      check(readbacks === 2, 'Two-color rim must read each source only once across warm reuse');
      check(
        pairCold.images.get(paired.image) === pairWarm.images.get(paired.image),
        'Pair cache miss',
      );
    } finally {
      CanvasRenderingContext2D.prototype.getImageData = readImage;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(pairCold.images.get(paired.image), 0, 0);
    const pixels = ctx.getImageData(0, 0, 100, 40).data;
    const pixel = (x, y) => [...pixels.slice((y * 100 + x) * 4, (y * 100 + x) * 4 + 4)];
    check(pixel(5, 5).join() === '192,48,32,255', 'Left rim changed');
    check(pixel(95, 5).join() === '32,64,192,255', 'Right rim missing');
    check(pixel(49, 5)[0] > 100 && pixel(50, 5)[0] < 120, 'Center does not blend');
    check(pixel(50, 20).join() === '204,204,204,255', 'Common oval artwork changed');
    check(pixel(50, 35)[3] === 0, 'Palette made the mount opaque outside its silhouette');
    let missingRight = false;
    try {
      await prepareEarlyHsb(
        pairBase,
        new Map([[paired.image, left]]),
        new AbortController().signal,
      );
    } catch (e) {
      missingRight = /stamp asset/.test(e.message);
    }
    check(missingRight, 'Missing right rim silently published');
    pairCold.dispose();
    pairWarm.dispose();
    earlyHsbBitmapCache.clear();
    left.close();
    right.close();
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
