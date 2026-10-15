import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

// Original synthetic assets: complete plate + transparent art window and a
// gradient symbol with an opaque white hole. No third-party bytes in tests.
const png = (border = false, right = false) => {
  const p = new PNG({ width: 100, height: 140 });
  for (let y = 0; y < p.height; y++)
    for (let x = 0; x < p.width; x++) {
      const art = x >= 7 && x <= 93 && y >= 15 && y <= 79;
      const edge = x < 5 || x > 94 || y < 5 || y > 134;
      p.data.set(
        border
          ? [0, 0, 0, edge ? 255 : 0]
          : [...(right ? [190, 80, 100] : [100, 160, 190]), art ? 0 : 255],
        (y * p.width + x) * 4,
      );
    }
  return PNG.sync.write(p);
};
const symbol =
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300"><defs><linearGradient id="g"><stop stop-color="#f00"/><stop offset="1" stop-color="#00f"/></linearGradient></defs><rect width="600" height="300" fill="url(#g)"/><rect x="240" y="60" width="120" height="180" fill="white"/></svg>';
const art =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#00ff00" d="M0 0H100V100H0Z"/></svg>';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => {
    const url = route.request().url(),
      svg = url.endsWith('.svg');
    return route.fulfill({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      contentType: svg ? 'image/svg+xml' : 'image/png',
      body: svg
        ? url.includes('/art.svg')
          ? art
          : symbol
        : png(url.endsWith('/border.png'), url.endsWith('/lr.png')),
    });
  });
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const { composeCardTexture, cardTextureKey } = await import(
      '/games/magic/src/presentation/canvas-face.ts'
    );
    const { faceSetSymbol, setSymbolAsset } = await import(
      '/games/magic/src/presentation/assets.ts'
    );
    const { retroSetSymbol } = await import('/games/magic/src/presentation/retro-frame.ts');

    const { framePlate } = await import('/games/magic/src/presentation/frame-plates.ts');
    const { usesEighthBasicGeometry, paintEighthBasicFrame } = await import(
      '/games/magic/src/presentation/eighth-basic-geometry.ts'
    );
    const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
    const { canvasAssetUrls, canvasAssetWidth } = await import(
      '/games/magic/src/presentation/canvas-assets.ts'
    );
    const { mtg } = await import('/games/magic/src/index.ts');
    const { AssetStore } = await import('/packages/browser/src/assets.ts');
    const { setSymbolCrop } = await import('/games/magic/src/presentation/set-symbols.ts');
    const check = (ok, message) => {
      if (!ok) throw Error(message);
    };
    const basicFace = {
      name: 'Island',
      typeLine: 'Basic Land — Island',
      setCode: '8ed',
      frameAssetFamily: 'eighth',
      borderColor: 'white',
    };
    const basicPlate = framePlate(basicFace);
    check(usesEighthBasicGeometry(basicFace, basicPlate.frame), 'Basic geometry missing');
    for (const override of [
      { setCode: '9ed' },
      { borderColor: 'black' },
      { frameAssetFamily: 'm15-accurate' },
      { frameTemplate: 'future' },
      { layout: 'transform' },
      { typeLine: 'Land' },
      { frameColors: ['U', 'B'] },
      { frameColors: [] },
      { frameColors: ['B'] },
    ])
      check(
        !usesEighthBasicGeometry({ ...basicFace, ...override }, basicPlate.frame),
        'Basic geometry leaked into unmeasured printing/source',
      );
    check(
      !usesEighthBasicGeometry(basicFace, basicPlate.frame + '?revision=other'),
      'Basic geometry accepted an unknown source revision',
    );
    // An opaque original texture must remain opaque across every stretch seam,
    // at both canonical and fractional inspection scale. Outer stock is fixed.
    const texture = document.createElement('canvas');
    texture.width = 488;
    texture.height = 680;
    const textureContext = texture.getContext('2d');
    const textureData = textureContext.createImageData(488, 680);
    for (let i = 0; i < textureData.data.length; i += 4)
      textureData.data.set([i % 251, (i / 488) % 239, (i / 4) % 227, 255], i);
    textureContext.putImageData(textureData, 0, 0);
    for (const scale of [1, 1.5]) {
      const reference = document.createElement('canvas'),
        actual = document.createElement('canvas');
      reference.width = actual.width = 488 * scale;
      reference.height = actual.height = 680 * scale;
      const a = actual.getContext('2d'),
        b = reference.getContext('2d');
      a.scale(scale, scale);
      b.scale(scale, scale);
      b.drawImage(texture, 0, 0);
      paintEighthBasicFrame(a, texture);
      const expected = b.getImageData(0, 0, reference.width, reference.height).data,
        pixels = a.getImageData(0, 0, actual.width, actual.height).data;
      for (let y = 0; y < actual.height; y++)
        for (let x = 0; x < actual.width; x++) {
          const index = (y * actual.width + x) * 4;
          check(pixels[index + 3] === 255, 'Stretch left a transparent seam');
          if (x < 22 * scale || x >= 466 * scale || y < 22 * scale || y >= 658 * scale)
            check(
              pixels.subarray(index, index + 4).every((v, j) => v === expected[index + j]),
              'Basic geometry moved outer stock/corners',
            );
        }
    }
    check(
      retroSetSymbol({ setCode: 'ice' }).endsWith('/ice-c.svg'),
      'Ice Age bypassed imported default',
    );
    for (const [family, style, weight] of [
      ['Beleren', 'normal', '400 700'],
      ['Beleren Small Caps', 'normal', '700'],
      ['Matrix', 'normal', '700'],
      ['Matrix Small Caps', 'normal', '700'],
      ['MPlantin', 'normal', '400'],
      ['MPlantin', 'italic', '400'],
      ['Relay', 'normal', '400'],
      ['Artist Credit', 'normal', '400'],
      ['Goudy', 'normal', '400'],
      ['Historic Symbols', 'normal', '400'],
    ])
      document.fonts.add(
        await new FontFace(
          'CardRenderer MTG ' + family,
          'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")',
          { style, weight },
        ).load(),
      );
    const { styledSymbolBounds } = await import(
      '/games/magic/src/presentation/styled-symbol-placement.ts'
    );
    const bounds = [400, 390, 40, 20],
      symbol = setSymbolAsset('m21', 'rare');
    const adjusted = styledSymbolBounds(
      { setCode: 'm21', frameAssetFamily: 'm15-accurate' },
      symbol,
      bounds,
    );
    check(
      adjusted.every((value, i) => Math.abs(value - [398, 389.4, 44, 21.2][i]) < 1e-9),
      'Calibrated axis sizing or right/center anchoring changed',
    );
    for (const face of [
      { setCode: 'm21' },
      { setCode: 'm21', frameAssetFamily: 'eighth' },
      { setCode: 'm21', frameAssetFamily: 'm15-accurate', setSymbol: symbol },
    ])
      check(
        styledSymbolBounds(face, symbol, bounds) === bounds,
        'Symbol calibration leaked into another source/family',
      );
    check(setSymbolAsset('fin', 'rare').endsWith('/fin-r.svg'), 'Styled inventory not used');
    check(
      setSymbolAsset('p02', 'rare').endsWith('/p02-r.svg'),
      'Native code confused with Keyrune alias',
    );
    check(setSymbolAsset('p02', 'rare', 'keyrune').endsWith('/po2.svg'), 'Keyrune alias lost');
    check(
      setSymbolAsset('arn', 'rare').endsWith('/arn-c.svg'),
      'Imported monochrome symbol is not the default',
    );
    check(
      setSymbolAsset('arn', 'rare', 'cardconjurer').endsWith('/arn-c.svg'),
      'Pre-Exodus printing colored by rarity',
    );
    check(setSymbolAsset('not-real', 'rare') === null, 'Invented unavailable URL');
    check(setSymbolAsset('constructor', 'rare') === null, 'Prototype key accepted');
    check(setSymbolAsset('GLINT', 'rare').startsWith('data:'), 'Original symbol replaced');
    check(
      setSymbolCrop({ setCode: 'm21', rarity: 'rare', setSymbolSource: 'cardconjurer' }).join() ===
        '0,0,1,1',
      'Keyrune crop applied to styled shield',
    );
    for (const family of ['eighth', 'm15-accurate']) {
      for (const rarity of ['common', 'uncommon', 'rare', 'mythic']) {
        const input = { setCode: 'm15', rarity };
        check(
          faceSetSymbol(input) === faceSetSymbol({ ...input, frameAssetFamily: family }),
          'Frame choice silently changed a reviewed symbol source',
        );
        check(
          setSymbolCrop(input).join() ===
            setSymbolCrop({ ...input, frameAssetFamily: family }).join(),
          'Frame choice silently changed a reviewed symbol crop',
        );
      }
    }
    const { default: initialize } = await import('/packages/browser/generated/renderer.js');
    await initialize({ module_or_path: '/packages/browser/generated/renderer_bg.wasm' });
    const signal = new AbortController().signal,
      host = new AssetStore(64 * 1024 * 1024);
    const pixel = (c, x, y) =>
      Array.from(
        c.getContext('2d').getImageData(Math.round(x * c.width), Math.round(y * c.height), 1, 1)
          .data,
      );
    const face = {
      name: '',
      typeLine: '',
      setCode: 'fin',
      rarity: 'rare',
      frameStyle: 'modern',
      illustration: 'https://test.invalid/art.svg',
      colors: ['W'],
    };
    const input = (f) => ({ face: f, printingId: null, printedImage: null });
    const plainKey = cardTextureKey(input(face), 'inspect');
    const restyled = { ...face, setCode: '3ed', frameAssetFamily: 'eighth' };
    check(
      canvasAssetUrls(restyled).includes(framePlate(restyled).border),
      'Explicit modern frame lost the printing stock mask',
    );
    for (const family of ['eighth', 'm15-accurate'])
      for (const tier of ['table', 'inspect']) {
        const f = { ...face, frameAssetFamily: family, borderColor: 'white' };
        const plate = framePlate(f),
          urls = canvasAssetUrls(f),
          recipe = mtg.describe(f, tier);
        check(cardTextureKey(input(f), tier) !== plainKey, 'Family missing from key');
        check(
          urls.includes(plate.frame) &&
            !urls.some((u) => u?.includes('wingedsheep') && u.includes('/frames/')),
          'Mixed frame families',
        );
        check(canvasAssetWidth(plate.frame) === 768, 'Unbounded full-plate decoding');
        check(
          recipe.artWindows[0].join() === faceRects(f).art.join(),
          'GPU art aperture disagrees with painter',
        );
        const a = await recipe.color.paint(host, signal),
          b = await composeCardTexture(input(f), tier, signal);
        const [x, y, w, h] = plate.rects.art;
        check(
          pixel(a, x + w / 2, y + h / 2).join() === '0,255,0,255',
          'Art aperture covered by plate',
        );
        check(
          pixel(a, 0.02, 0.5)
            .slice(0, 3)
            .every((v) => v > 220),
          'White border mask missing',
        );
        const sx = plate.symbol.right - plate.symbol.width / 2,
          sy = plate.symbol.center;
        check(
          pixel(a, sx, sy)
            .slice(0, 3)
            .every((v) => v > 230),
          'Opaque symbol hole recolored',
        );
        const left = pixel(a, sx - plate.symbol.width * 0.35, sy),
          right = pixel(a, sx + plate.symbol.width * 0.35, sy);
        check(left[0] > left[2] + 50 && right[2] > right[0] + 50, 'Symbol gradient flattened');
        check(
          pixel(a, sx, sy).join() === pixel(b, sx, sy).join(),
          'Host/direct preparation differ',
        );
        const printing = await composeCardTexture(
          { ...input(f), paintLayer: 'printing' },
          tier,
          signal,
        );
        check(
          pixel(printing, x + w / 2, y + h / 2)[3] === 0,
          'Printing layer closes optical art window',
        );
        a.width = a.height = b.width = b.height = printing.width = printing.height = 0;
      }
    const dual = framePlate({
      ...face,
      frameAssetFamily: 'm15-accurate',
      typeLine: 'Land',
      frameColors: ['R', 'W'],
    });
    check(
      dual.frame.endsWith('/lr.png') && dual.rightFrame.endsWith('/lw.png'),
      'Dual-land frame palette lost',
    );
    for (const family of ['eighth', 'm15-accurate']) {
      for (const pair of ['WU', 'WB', 'RW', 'GW', 'UB', 'UR', 'GU', 'BR', 'BG', 'RG']) {
        const plate = framePlate({
          ...face,
          frameAssetFamily: family,
          typeLine: 'Land',
          frameColors: [...pair].reverse(),
        });
        const file = (color) =>
          family === 'eighth' ? `${color.toLowerCase()}l` : `l${color.toLowerCase()}`;
        check(
          plate.frame.endsWith(`/${file(pair[0])}.png`) &&
            plate.rightFrame.endsWith(`/${file(pair[1])}.png`),
          `Wrong printed land order: ${family} ${pair}`,
        );
      }
    }
    const land = await composeCardTexture(
      input({
        ...face,
        frameAssetFamily: 'm15-accurate',
        typeLine: 'Land',
        frameColors: ['U', 'R'],
      }),
      'inspect',
      signal,
    );
    const paperLeft = pixel(land, 0.43, 0.8),
      paperRight = pixel(land, 0.57, 0.8);
    check(
      paperLeft[0] > 115 && paperRight[0] < 175,
      'Dual-land paper has an abrupt half-frame split',
    );
    check(
      pixel(land, 0.43, 0.62)[0] === 100 && pixel(land, 0.57, 0.62)[0] === 190,
      'Paper blending leaked into the surrounding frame',
    );
    land.width = land.height = 0;
    check(
      faceSetSymbol({ ...face, setSymbol: 'https://custom.invalid/s.svg' }) ===
        'https://custom.invalid/s.svg',
      'Custom URL ignored',
    );
    let rejected = false;
    try {
      framePlate({ ...face, frameAssetFamily: 'eighth', typeLine: 'Planeswalker' });
    } catch {
      rejected = true;
    }
    check(rejected, 'Special layout silently painted as ordinary');
    const { paintEighthFooter, eighthArtistBrush } = await import(
      '/games/magic/src/presentation/eighth-footer.ts'
    );
    const footer = { ...face, frameAssetFamily: 'eighth', artist: 'Original Artist' };
    check(
      canvasAssetUrls(footer).includes(eighthArtistBrush(footer)),
      'Brush absent from prepared asset list',
    );
    check(
      eighthArtistBrush({ ...footer, colors: ['B'] }).endsWith('/whitebrush.svg'),
      'Dark frame needs a light artist brush',
    );
    check(eighthArtistBrush({ ...footer, artist: '' }) === null, 'Empty credit loads a brush');
    check(
      eighthArtistBrush({ ...footer, frameAssetFamily: 'm15-accurate' }) === null,
      'Eighth brush leaked to another frame',
    );
    const variable = document.createElement('canvas');
    variable.width = 488;
    variable.height = 680;
    const vc = variable.getContext('2d'),
      drawn = [];
    const fill = vc.fillText.bind(vc);
    vc.fillText = (text, ...args) => {
      drawn.push(text);
      fill(text, ...args);
    };
    vc.fillStyle = '#f0f';
    vc.textAlign = 'right';
    vc.shadowOffsetX = 4;
    paintEighthFooter(vc, { ...footer, artist: '', power: '1+*', toughness: '*' }, new Map());
    check(drawn.join('') === '1+/', 'Variable stats fell back to font dots or lost an expression');
    check(
      vc.fillStyle === '#ff00ff' && vc.textAlign === 'right' && vc.shadowOffsetX === 4,
      'Footer leaked drawing state',
    );
    check(
      vc.getImageData(379, 607, 65, 31).data.some((v, i) => i % 4 === 3 && v),
      'Variable stats rendered no ink',
    );
    variable.width = variable.height = 0;
    const warm = host.decodes;
    const f = { ...face, frameAssetFamily: 'eighth', borderColor: 'white' };
    const c = await mtg.describe(f, 'inspect').color.paint(host, signal);
    c.width = c.height = 0;
    check(host.decodes === warm, 'Warm frame preparation decoded assets again');
    host.dispose();
    mtg.dispose();
    return { symbols: 'gradient/white holes preserved', tiers: 2, families: 2, warm };
  });
  assert.equal(result.families, 2);
  console.log('Imported Magic assets:', result);
} finally {
  await browser.close();
  await server.close();
}
