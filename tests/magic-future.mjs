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
  const result = await page.evaluate(async () => {
    const p = await import('/games/magic/src/presentation.ts');
    const { futureParts, futureGeometry, futurePalette } = await import(
      '/games/magic/src/presentation/future-frame.ts'
    );
    const { paintFutureTemplate } = await import(
      '/games/magic/src/presentation/future-template-paint.ts'
    );
    const { futureRulesLayout } = await import('/games/magic/src/presentation/future-rules.ts');
    const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
    const { withCardWording } = await import('/games/magic/src/presentation/wording.ts');
    const { calibrateFutureFrame } = await import(
      '/games/magic/src/presentation/future-frame-geometry.ts'
    );
    const { prepareFutureFrame } = await import(
      '/games/magic/src/presentation/future-frame-paint.ts'
    );
    const { paintIllustration } = await import(
      '/games/magic/src/presentation/illustration-paint.ts'
    );
    const { paintEtchingMask } = await import('/games/magic/src/presentation/canvas-etching.ts');
    const { mtg } = await import('/games/magic/src/index.ts');
    const { prepareEarlyHsb } = await import('/games/magic/src/presentation/early-hsb-material.ts');
    const { earlyHsbBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const { futureManaAsset, futureGenericSources } = await import(
      '/games/magic/src/presentation/future-mana.ts'
    );
    const { futureSetSymbolRect } = await import(
      '/games/magic/src/presentation/future-set-symbol.ts'
    );
    const base = {
      name: '',
      frameTemplate: 'future',
      futureTreatment: 'regular',
      colors: ['W'],
      typeLine: '',
      illustration: '/original-art',
      rulesText: '',
      setCode: null,
      manaSymbols: [],
    };
    const original = {
      ...base,
      futureTreatment: 'full-art',
      typeLine: 'Creature',
      power: '2',
      toughness: '1',
    };
    const wordings = {
      original: { typeLine: 'Creature', rulesText: '' },
      oracle: { typeLine: 'Creature — Cat Rebel', rulesText: '' },
    };
    const selected = withCardWording(original, wordings, 'oracle');
    const variants = [
      base,
      original,
      { ...base, futureTreatment: 'clear', colors: [] },
      { ...base, typeLine: 'Land', frameColors: ['G', 'W'] },
      {
        ...base,
        typeLine: 'Land',
        frameColors: ['B', 'R'],
        rulesText: 'Light ink on a dark land panel.',
      },
      { ...base, colors: ['U'], typeLine: 'Artifact Creature — Myr' },
      { ...base, colors: [], typeLine: 'Instant' },
      { ...base, illustrationPlacement: [105 / 488, 84 / 680, 353 / 488, 293 / 680] },
    ];
    const rows = [];
    for (const face of variants) {
      const images = new Map();
      for (const url of p.canvasAssetUrls(face).filter(Boolean)) {
        const a = document.createElement('canvas');
        a.width = 744;
        a.height = 1039;
        const c = a.getContext('2d');
        c.fillStyle = url === face.illustration ? '#ba3020' : '#d8ceaa';
        c.fillRect(0, 0, a.width, a.height);
        if (url.includes('futureFrame')) c.clearRect(90, 130, 600, 420);
        if (url.includes('mask_image')) {
          c.fillStyle = 'black';
          c.fillRect(0, 0, a.width, a.height);
          c.fillStyle = 'white';
          c.fillRect(80, 130, 500, 600);
        }
        images.set(url, await createImageBitmap(a));
      }
      const make = () => {
        const a = document.createElement('canvas');
        a.width = 488;
        a.height = 680;
        return a;
      };
      const full = make(),
        composite = make(),
        art = make(),
        printing = make();
      paintFutureTemplate(full.getContext('2d'), face, images);
      paintFutureTemplate(art.getContext('2d'), face, images, 'artwork');
      paintFutureTemplate(printing.getContext('2d'), face, images, 'printing');
      const c = composite.getContext('2d');
      c.fillStyle = '#080808';
      c.fillRect(0, 0, 488, 680);
      c.drawImage(art, 0, 0);
      c.drawImage(printing, 0, 0);
      const one = full.getContext('2d').getImageData(0, 0, 488, 680).data,
        two = c.getImageData(0, 0, 488, 680).data;
      let max = 0;
      for (let i = 0; i < one.length; i++) max = Math.max(max, Math.abs(one[i] - two[i]));
      const body = full.getContext('2d').getImageData(50, 433, 393, 166).data;
      const typePixels = full.getContext('2d').getImageData(59, 382, 367, 40).data;
      let whiteInk = 0;
      for (let i = 0; i < body.length; i += 4)
        if (body[i] > 245 && body[i + 1] > 245 && body[i + 2] > 245) whiteInk++;
      let whiteTypeInk = 0;
      for (let i = 0; i < typePixels.length; i += 4)
        if (typePixels[i] > 245 && typePixels[i + 1] > 245 && typePixels[i + 2] > 245)
          whiteTypeInk++;
      rows.push({
        max,
        whiteInk,
        whiteTypeInk,
        artPixel: [...art.getContext('2d').getImageData(200, 220, 1, 1).data],
        rect: p.faceRects(face).art,
      });
      for (const i of images.values()) i.close();
    }
    let rejectsText = false;
    try {
      paintFutureTemplate(
        document.createElement('canvas').getContext('2d'),
        { ...original, rulesText: 'Cannot silently omit this.' },
        new Map(),
      );
    } catch (e) {
      rejectsText = e.message.includes('no rules panel');
    }
    const key = (face) =>
      p.cardTextureKey({ face, printingId: null, printedImage: null }, 'inspect');
    const placed = variants[7];
    const source = document.createElement('canvas');
    source.width = 540;
    source.height = 448;
    const sc = source.getContext('2d');
    sc.fillStyle = '#123456';
    sc.fillRect(0, 0, 540, 448);
    sc.fillStyle = 'white';
    sc.fillRect(260, 214, 20, 20);
    const sourceImage = await createImageBitmap(source);
    sc.clearRect(0, 0, 540, 448);
    sc.fillRect(260, 214, 20, 20);
    const derivative = await createImageBitmap(source);
    const placedCanvas = document.createElement('canvas'),
      maskCanvas = document.createElement('canvas');
    placedCanvas.width = maskCanvas.width = 488;
    placedCanvas.height = maskCanvas.height = 680;
    paintIllustration(
      placedCanvas.getContext('2d'),
      placed,
      new Map([[placed.illustration, sourceImage]]),
      futureGeometry(base).art,
      'artwork',
    );
    await paintEtchingMask(
      maskCanvas.getContext('2d'),
      placed,
      null,
      new AbortController().signal,
      20,
      undefined,
      async () => ({
        images: new Map([
          [placed.illustration, sourceImage],
          ['/mask', derivative],
        ]),
        dispose() {},
      }),
      async () => '/mask',
    );
    const pixel = (canvas, x, y) => [...canvas.getContext('2d').getImageData(x, y, 1, 1).data];
    const placement = {
      source: pixel(placedCanvas, 281, 230),
      fallback: pixel(placedCanvas, 60, 230),
      edge: pixel(maskCanvas, 281, 230),
      emptyEdge: pixel(maskCanvas, 60, 230),
      recipe: mtg.describe(placed, 'inspect').edges[0],
      aperture: p.faceRects(base).art,
      bounds: placed.illustrationPlacement,
      keyChanges: key(base) !== key(placed),
      maskKeyChanges:
        p.cardTextureKey({ face: base, layer: 'etching' }, 'inspect') !==
        p.cardTextureKey({ face: placed, layer: 'etching' }, 'inspect'),
    };
    sourceImage.close();
    derivative.close();
    const manaSource = document.createElement('canvas');
    manaSource.width = manaSource.height = 200;
    const mc = manaSource.getContext('2d');
    mc.fillStyle = '#c8c8c8';
    mc.fillRect(0, 0, 200, 200);
    mc.clearRect(0, 0, 1, 1);
    const manaImage = await createImageBitmap(manaSource),
      manaUrl = futureManaAsset('B');
    const manaFace = {
      ...base,
      setCode: 'FUT',
      manaSymbols: ['B', 'B', '1', '2'],
      colorCalibration: 'set-hsb-v1',
    };
    const manaImages = new Map([
        [manaUrl, manaImage],
        ...futureGenericSources().map((url) => [url, manaImage]),
      ]),
      signal = new AbortController().signal;
    const firstMana = await prepareEarlyHsb(manaFace, manaImages, signal);
    const builds = earlyHsbBitmapCache.stats.builds;
    const secondMana = await prepareEarlyHsb(manaFace, manaImages, signal);
    const repeatedBuilds = earlyHsbBitmapCache.stats.builds - builds;
    const uncalibrated = await prepareEarlyHsb(
      { ...manaFace, colorCalibration: undefined },
      manaImages,
      signal,
    );
    mc.clearRect(0, 0, 200, 200);
    mc.drawImage(firstMana.images.get(manaUrl), 0, 0);
    const manaColors = {
      center: pixel(manaSource, 100, 100),
      rim: pixel(manaSource, 180, 100),
      alpha: pixel(manaSource, 0, 0)[3],
      reused: firstMana.images.get(manaUrl) === secondMana.images.get(manaUrl),
      builds: repeatedBuilds,
      optIn: uncalibrated.images.get(manaUrl) === manaImage,
      genericShared:
        futureManaAsset('1') === futureManaAsset('2') &&
        futureManaAsset('2').endsWith('/future/f0.png'),
    };
    firstMana.dispose();
    secondMana.dispose();
    uncalibrated.dispose();
    manaImage.close();
    const tribal = futureParts({ ...base, typeLine: 'Tribal Enchantment — Rebel Aura' });
    const coloredArtifact = futureParts({
      ...base,
      typeLine: 'Artifact Creature — Myr',
      colors: ['U'],
    });
    const colorlessArtifact = futureParts({ ...base, typeLine: 'Artifact', colors: [] });
    const colorlessSpell = futureParts({ ...base, typeLine: 'Instant', colors: [] });
    // Translucent MSE paper needs the source backing below the visible art.
    // A broad source illustration mask must not punch through that backing.
    const paperImages = new Map();
    for (const [url, fill] of [
      [colorlessSpell.base, '#507080'],
      [colorlessSpell.mask, '#fff'],
      [colorlessSpell.paper, '#dce5eacc'],
      [colorlessSpell.type, '#0000'],
    ]) {
      const canvas = document.createElement('canvas');
      canvas.width = 375;
      canvas.height = 523;
      const context = canvas.getContext('2d');
      context.fillStyle = fill;
      context.fillRect(0, 0, canvas.width, canvas.height);
      paperImages.set(url, await createImageBitmap(canvas));
    }
    const backed = prepareFutureFrame({ ...base, typeLine: 'Instant', colors: [] }, paperImages),
      paperBackingAlpha = backed.getContext('2d').getImageData(400, 880, 1, 1).data[3],
      rightArtAlpha = backed.getContext('2d').getImageData(926, 400, 1, 1).data[3];
    for (const image of paperImages.values()) image.close();
    backed.width = backed.height = 0;
    // Fractional piecewise destinations must not create transparent/dark seams.
    const solid = document.createElement('canvas');
    solid.width = 976;
    solid.height = 1360;
    const solidContext = solid.getContext('2d');
    solidContext.fillStyle = '#c8a064';
    solidContext.fillRect(0, 0, solid.width, solid.height);
    const fitted = calibrateFutureFrame(solid, base),
      strip = fitted.getContext('2d').getImageData(480, 20, 8, 1320).data;
    let seamError = 0;
    for (let i = 0; i < strip.length; i++)
      seamError = Math.max(seamError, Math.abs(strip[i] - [200, 160, 100, 255][i % 4]));
    solid.width = solid.height = fitted.width = fitted.height = 0;
    const bodyContext = document.createElement('canvas').getContext('2d'),
      bodyBounds = { x: 50, y: 433, width: 393, height: 166 },
      bodyCases = [1, 3, 5].map((repetitions) => {
        const paragraphs = [
          {
            role: 'rules',
            runs: [{ text: 'Reach (This creature can block creatures with flying.)' }],
          },
          {
            role: 'rules',
            runs: [
              { text: 'Whenever this creature deals damage, draw a card. '.repeat(repetitions) },
            ],
          },
          {
            role: 'flavor',
            runs: [{ text: 'The sentinel watches from the highest branch.', italic: true }],
          },
        ];
        const before = layoutRules(
          bodyContext,
          paragraphs,
          bodyBounds,
          (17.6 * 4) / 3,
          (8 * 4) / 3,
          {
            leading: 0.95,
            paragraphGap: 0.4,
            flavorGap: 0.5,
            flavorOrphans: false,
          },
        );
        const after = futureRulesLayout(
          bodyContext,
          { ...base, rulesParagraphs: paragraphs },
          [50, 433, 393, 166],
        );
        const words = (layout) => layout.lines.map((line) => line.runs.map((run) => run.text));
        return {
          preserved: JSON.stringify(words(before)) === JSON.stringify(words(after)),
          sameSize: before.size === after.size,
          noDivider: before.separators.length === 1 && after.separators.length === 0,
          fits:
            !after.overflow &&
            after.lines.every(
              (line) =>
                line.inkBounds[1] >= 433 - 0.01 && line.inkBounds[1] + line.inkBounds[3] <= 599.01,
            ),
        };
      });
    return {
      bodyCases,
      rows,
      seamError,
      paperBackingAlpha,
      rightArtAlpha,
      placement,
      manaColors,
      treatment: selected.futureTreatment,
      rectStable:
        JSON.stringify(futureGeometry(original)) === JSON.stringify(futureGeometry(selected)),
      keyChanges: key(base) !== key({ ...base, futureTreatment: 'full-art' }),
      fullAssets: p.canvasAssetUrls(original),
      tribal: tribal.typeSymbol,
      coloredArtifact,
      colorlessArtifact,
      colorlessSpell,
      palette: futurePalette(variants[3]),
      symbolSources: {
        ordinary: futureSetSymbolRect({ ...base, setCode: 'fut', colors: ['W'], rarity: 'common' }),
        land: futureSetSymbolRect({ ...base, setCode: 'fut', typeLine: 'Land', rarity: 'rare' }),
        full: futureSetSymbolRect({
          ...base,
          setCode: 'fut',
          futureTreatment: 'full-art',
          colors: ['W'],
        }),
        excluded: [
          { setCode: 'tsr' },
          { setCode: 'fut', setSymbol: 'custom.svg' },
          { setCode: 'fut', setSymbolSource: 'keyrune' },
          { setCode: 'fut', futureTreatment: 'clear' },
        ].map((change) => futureSetSymbolRect({ ...base, ...change }) ?? null),
      },
      rejectsText,
    };
  });
  assert.equal(result.rows.length, 8);
  assert.ok(result.bodyCases.every((r) => r.preserved && r.sameSize && r.noDivider && r.fits));
  assert.deepEqual(result.placement.source, [255, 255, 255, 255]);
  assert.deepEqual(result.placement.fallback, [18, 52, 86, 255]);
  assert.deepEqual(result.placement.edge, [255, 255, 255, 255]);
  assert.equal(result.placement.emptyEdge[3], 0, 'Solid fallback must not acquire artwork edges');
  assert.equal(
    result.rightArtAlpha,
    0,
    'Source plate clipping must clear the registered right art edge',
  );
  assert.deepEqual(result.placement.recipe.destination, result.placement.bounds);
  assert.deepEqual(result.placement.recipe.clip, result.placement.aperture);
  assert.equal(result.placement.keyChanges, true);
  assert.equal(result.placement.maskKeyChanges, true);
  assert.deepEqual(result.manaColors.center, [126, 116, 108, 255]);
  assert.deepEqual(result.manaColors.rim, [102, 100, 100, 255]);
  assert.equal(result.manaColors.alpha, 0);
  assert.equal(result.manaColors.reused, true);
  assert.equal(result.manaColors.builds, 0);
  assert.equal(result.manaColors.optIn, true);
  assert.equal(result.manaColors.genericShared, true);
  assert.equal(result.seamError, 0, 'Frame bands remain opaque and retain their color at seams');
  assert.equal(result.paperBackingAlpha, 255, 'Translucent paper retains opaque frame backing');
  assert.ok(result.rows[4].whiteInk > 30, 'Dark land panels retain light rules ink');
  assert.ok(result.rows[5].whiteTypeInk > 30, 'Colored artifacts retain the colored-frame ink');
  assert.ok(
    result.rows.every((r) => r.max <= 1),
    JSON.stringify(result.rows),
  );
  assert.equal(result.rows[0].artPixel[3], 255);
  assert.deepEqual(result.rows[0].artPixel.slice(0, 3), [186, 48, 32]);
  assert.equal(result.treatment, 'full-art');
  assert.equal(result.rectStable, true);
  assert.equal(result.keyChanges, true);
  assert.ok(result.fullAssets.some((u) => u?.includes('magic-future-textless.mse-style')));
  assert.ok(result.tribal.includes('multitype'));
  assert.ok(result.coloredArtifact.base.endsWith('/futureFrameU.png'));
  assert.ok(result.coloredArtifact.typeSymbol.endsWith('/multitype_white.png'));
  assert.ok(result.colorlessArtifact.base.endsWith('/futureFrameA.png'));
  assert.ok(result.colorlessSpell.base.endsWith('/magic-future.mse-style/ccard.jpg'));
  assert.ok(result.colorlessSpell.paper.endsWith('/magic-future.mse-style/ctextbox.png'));
  assert.equal(result.rows[6].rect[3], result.rows[0].rect[3], 'Colorless spells use ordinary art');
  assert.deepEqual(result.palette, ['G', 'W']);
  assert.equal(result.rejectsText, true);
  assert.notDeepEqual(result.symbolSources.ordinary, result.symbolSources.land);
  assert.ok(result.symbolSources.full[1] > 550);
  assert.deepEqual(result.symbolSources.excluded, [null, null, null, null]);
  console.log(
    'Future physical treatments, exact optical layer composition, full-art wording retention, type icon and cache identity pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
