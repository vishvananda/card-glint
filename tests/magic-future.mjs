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
    const { withCardWording } = await import('/games/magic/src/presentation/wording.ts');
    const { calibrateFutureFrame } = await import(
      '/games/magic/src/presentation/future-frame-geometry.ts'
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
    const tribal = futureParts({ ...base, typeLine: 'Tribal Enchantment — Rebel Aura' });
    const coloredArtifact = futureParts({
      ...base,
      typeLine: 'Artifact Creature — Myr',
      colors: ['U'],
    });
    const colorlessArtifact = futureParts({ ...base, typeLine: 'Artifact', colors: [] });
    const colorlessSpell = futureParts({ ...base, typeLine: 'Instant', colors: [] });
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
    return {
      rows,
      seamError,
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
      rejectsText,
    };
  });
  assert.equal(result.rows.length, 7);
  assert.equal(result.seamError, 0, 'Frame bands remain opaque and retain their color at seams');
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
  console.log(
    'Future physical treatments, exact optical layer composition, full-art wording retention, type icon and cache identity pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
