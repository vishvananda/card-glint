import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
    const { profileAssets } = await import('/games/magic/src/presentation/assets.ts');
    const { plateBasicSymbol } = await import('/games/magic/src/presentation/plate-basic-land.ts');
    const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { printingCollectorText, printingLegalText } = await import(
      '/games/magic/src/presentation/printing-footer.ts'
    );
    const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
    const check = (v, m) => {
      if (!v) throw Error(m);
    };
    for (const setCode of ['m15', 'war', 'm21', 'fdn', 'custom'])
      for (const [name, color] of [
        ['Plains', 'W'],
        ['Island', 'U'],
        ['Swamp', 'B'],
        ['Mountain', 'R'],
        ['Forest', 'G'],
      ]) {
        const face = {
          name,
          setCode,
          colors: [],
          typeLine: `Basic Land — ${name}`,
          rulesText: `({T}: Add {${color}}.)`,
        };
        const profile = resolveCardProfile(face),
          assets = profileAssets(profile);
        check(profile.frame === color, 'Missing basic palette');
        check(assets.background.endsWith('/bg/Land.webp'), 'Basic lost land background');
        check(assets.boxes.endsWith(`/boxes/${color}.webp`), 'Basic plate lost its color');
        const symbol = plateBasicSymbol(face);
        check(symbol && canvasAssetUrls(face).includes(symbol), 'Symbol was not prepared');
        check(
          resolveCardProfile({ ...face, frameColors: [] }).frame === 'Artifact',
          'Explicit palette overwritten',
        );
        for (const extra of [
          { rulesText: 'Custom rules' },
          { rulesParagraphs: [{ role: 'flavor', runs: [{ text: 'Flavor' }] }] },
          {
            rulesParagraphs: [
              { role: 'rules', align: 'center', runs: [{ text: face.rulesText, italic: true }] },
            ],
          },
          { frameTemplate: 'future' },
          { frameStyle: 'retro' },
          { layout: 'transform' },
        ])
          check(
            plateBasicSymbol({ ...face, ...extra }) === null,
            'Custom or special content replaced',
          );
      }
    check(
      plateBasicSymbol({ name: 'Land', typeLine: 'Land — Island', rulesText: 'U' }) === null,
      'Nonbasic rules replaced',
    );
    check(
      printingCollectorText({
        name: 'x',
        setCode: 'm21',
        collectorNumber: '3',
        rarity: 'uncommon',
      }) === '003/274 U',
      'M21 printed numbering',
    );
    check(
      printingCollectorText({
        name: 'x',
        setCode: 'm21',
        collectorNumber: '322',
        rarity: 'rare',
      }) === '322 R',
      'Bonus number denominator',
    );
    check(
      printingCollectorText({ name: 'x', setCode: '8ed', collectorNumber: '6' }, false) === '6/350',
      'Eighth numbering',
    );
    check(
      printingCollectorText({
        name: 'x',
        setCode: 'fdn',
        collectorNumber: '272',
        typeLine: 'Basic Land — Plains',
      }) === 'L 0272',
      'Recent collector style',
    );
    check(
      printingLegalText({ name: 'x', setCode: 'm21', legalText: null }) === null,
      'Suppressed legal text',
    );
    check(printingLegalText({ name: 'x', setCode: 'unknown' }) === null, 'Invented legal year');
    const { paintPlaneswalkerLoyalty, paintPlaneswalkerCost } = await import(
      '/games/magic/src/presentation/planeswalker-loyalty.ts'
    );
    const shield = document.createElement('canvas');
    shield.width = 100;
    shield.height = 60;
    const shieldContext = shield.getContext('2d');
    for (const number of ['4', '5', '7', '20']) {
      shieldContext.clearRect(0, 0, 100, 60);
      paintPlaneswalkerLoyalty(shieldContext, number, [10, 5, 78, 47]);
      const data = shieldContext.getImageData(0, 0, 100, 60).data,
        ys = [];
      for (let y = 0; y < 60; y++)
        for (let x = 0; x < 100; x++) if (data[(y * 100 + x) * 4 + 3] > 128) ys.push(y);
      check(
        Math.min(...ys) > 13 && Math.max(...ys) < 49,
        'Loyalty ink touches the shield crest or bottom',
      );
    }
    // Prior title/rules tracking and baselines must not leak into either
    // loyalty role, and their temporary font/placement must not leak out.
    for (const [paint, texts, rect] of [
      [paintPlaneswalkerLoyalty, ['3', '4', '5', '7', '20'], [10, 5, 78, 47]],
      [paintPlaneswalkerCost, ['+1', '+2', '0', '−2', '−X', '−10'], [20, 10, 54, 40]],
    ]) {
      for (const text of texts) {
        const draw = (tracking, baseline) => {
          shieldContext.clearRect(0, 0, 100, 60);
          shieldContext.letterSpacing = tracking;
          shieldContext.textBaseline = baseline;
          shieldContext.textAlign = 'right';
          paint(shieldContext, text, rect);
          check(
            shieldContext.letterSpacing === tracking &&
              shieldContext.textBaseline === baseline &&
              shieldContext.textAlign === 'right',
            'Loyalty painter leaked text state',
          );
          return shieldContext.getImageData(0, 0, 100, 60).data;
        };
        const clean = draw('0px', 'alphabetic'),
          inherited = draw('4px', 'bottom');
        check(
          clean.every((v, i) => v === inherited[i]),
          'Loyalty inherited unrelated typography',
        );
      }
    }
    const source = document.createElement('canvas');
    source.width = source.height = 100;
    source.getContext('2d').fillStyle = '#00ffff';
    source.getContext('2d').fillRect(0, 0, 100, 100);
    const image = await createImageBitmap(source),
      images = new Map([['probe-art', image]]);
    // This tests aperture composition, not measured font rasters. Register the
    // public font contract locally rather than silently relying on fallbacks.
    const { canvasFontAssets } = await import('/games/magic/src/presentation.ts');
    let fontsReady;
    const loadFonts = () =>
      (fontsReady ??= Promise.all(
        canvasFontAssets.map(async ({ family, style, weight }) => {
          document.fonts.add(
            await new FontFace(
              family,
              'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")',
              { style, weight },
            ).load(),
          );
        }),
      ));
    const hooks = { loadFonts, loadImages: async () => ({ images, dispose() {} }) };
    const samples = [];
    for (const setCode of ['m21', 'm15', 'war', 'fdn']) {
      const face = {
        name: '',
        setCode,
        illustration: 'probe-art',
        rulesText: '',
        rulesParagraphs: [],
        legalText: null,
      };
      const paint = (paintLayer) =>
        composeCardTexture(
          { face, printingId: null, printedImage: null, paintLayer },
          'inspect',
          new AbortController().signal,
          hooks,
        );
      const full = await paint(),
        art = await paint('artwork'),
        printing = await paint('printing');
      art.getContext('2d').resetTransform();
      art.getContext('2d').drawImage(printing, 0, 0);
      const actual = full.getContext('2d').getImageData(0, 0, full.width, full.height).data;
      const layered = art.getContext('2d').getImageData(0, 0, art.width, art.height).data;
      const rect = faceRects(face).art.map((v, i) => v * (i % 2 ? 680 : 488));
      const [x, y, w, h] = rect;
      // The same aperture drives the combined face and separate foil/art layers.
      for (let py = Math.ceil((y - 3) * 1.5); py < Math.floor((y + h + 3) * 1.5); py++)
        for (let px = Math.ceil((x - 3) * 1.5); px < Math.floor((x + w + 3) * 1.5); px++) {
          const i = (py * full.width + px) * 4;
          // Fractional clipping blends once for full and twice for separate layers;
          // compare interior and exterior, excluding the antialiased edge pixel.
          if (
            Math.min(
              Math.abs(px - x * 1.5),
              Math.abs(px - (x + w) * 1.5),
              Math.abs(py - y * 1.5),
              Math.abs(py - (y + h) * 1.5),
            ) < 2
          )
            continue;
          check(
            actual[i] === layered[i] && actual[i + 1] === layered[i + 1],
            `Art layer aperture diverged ${setCode} ${px},${py}: ${actual.slice(i, i + 4)} vs ${layered.slice(i, i + 4)}`,
          );
        }
      const pixel = (px, py) => [
        ...full.getContext('2d').getImageData(Math.round(px * 1.5), Math.round(py * 1.5), 1, 1)
          .data,
      ];
      const points = [
        [x - 0.7, y + h / 2],
        [x + w + 0.2, y + h / 2],
        [x + w / 2, y - 0.7],
        [x + w / 2, y + h + 0.2],
      ];
      for (const p of points) check(pixel(...p)[1] < 180, 'Missing black rim on an art edge');
      check(pixel(x + w / 2, y + h / 2)[1] === 255, 'Art did not fill the aperture');
      samples.push({ setCode, rect });
      for (const c of [full, art, printing]) c.width = c.height = 0;
    }
    image.close();
    return samples;
  });
  assert.equal(result.length, 4);
  assert.ok(
    result.find((r) => r.setCode === 'm21').rect[2] >
      result.find((r) => r.setCode === 'war').rect[2],
    'Art does not follow frame resizing',
  );
  console.log(
    'Modern basics, preserved custom content, printed footer metadata and four-sided art apertures pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
