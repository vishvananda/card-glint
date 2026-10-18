import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
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
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const p = await import('/games/magic/src/presentation.ts');
    const { hasColorCalibration } = await import(
      '/games/magic/src/presentation/calibration-profiles.ts'
    );
    const { retroDualFrame } = await import('/games/magic/src/presentation/retro-dual-frame.ts');
    const { paintStandardTemplate } = await import(
      '/games/magic/src/presentation/standard-frame-paint.ts'
    );
    const { templateImageMask } = await import(
      '/games/magic/src/presentation/template-image-mask.ts'
    );
    const base = {
      name: 'Original template fixture',
      typeLine: 'Creature — Test',
      colors: ['W'],
      manaSymbols: ['1', 'W'],
      rulesText: 'A complete visible ability.',
      artist: 'Original fixture',
      setCode: 'GLINT',
      setSymbol: '/original-symbol',
      power: '2',
      toughness: '3',
      illustration: '/original-art',
    };
    const variants = [
      { ...base, frameTemplate: 'future' },
      {
        ...base,
        layout: 'flip',
        frameTemplate: 'flip',
        faces: [
          base,
          { ...base, name: 'Reverse title', rulesText: 'A different reverse ability.' },
        ],
      },
      {
        ...base,
        typeLine: 'Battle — Test',
        power: null,
        toughness: null,
        frameTemplate: 'battle',
        defense: '5',
      },
    ];
    const rows = [];
    for (const face of variants) {
      const images = new Map();
      for (const url of p.canvasAssetUrls(face).filter(Boolean)) {
        const c = document.createElement('canvas');
        c.width = 375;
        c.height = 523;
        const x = c.getContext('2d');
        x.fillStyle = url.includes('mask') ? 'black' : '#e8ddc3';
        x.fillRect(0, 0, 375, 523);
        x.fillStyle = url.includes('mask') ? 'white' : '#567ba4';
        x.fillRect(35, 50, 300, 290);
        images.set(url, await createImageBitmap(c));
      }
      const c = document.createElement('canvas');
      c.width = 488;
      c.height = 680;
      paintStandardTemplate(c.getContext('2d'), face, images);
      const rect = p.faceRects(face).art;
      const recipe = (await import('/games/magic/src/index.ts')).mtg.describe(face, 'inspect');
      rows.push({
        kind: face.frameTemplate,
        rect,
        assets: p.canvasAssetUrls(face).filter(Boolean),
        width: c.width,
        height: c.height,
        regions: recipe.regions?.length ?? recipe.hitRegions?.length ?? 0,
      });
      for (const i of images.values()) i.close();
    }
    const flip = variants[1];
    const input = (face) => ({ face, printingId: null, printedImage: null });
    const old = p.cardTextureKey(input(flip), 'inspect');
    const changed = structuredClone(flip);
    changed.faces[1].rulesText = 'Changed reverse ability';
    const mask = document.createElement('canvas');
    mask.width = mask.height = 8;
    const m = mask.getContext('2d');
    m.fillStyle = 'black';
    m.fillRect(0, 0, 8, 8);
    m.fillStyle = 'white';
    m.fillRect(2, 2, 4, 4);
    const bitmap = await createImageBitmap(mask),
      one = templateImageMask(bitmap),
      two = templateImageMask(bitmap);
    const alpha = one.getContext('2d').getImageData(0, 0, 8, 8).data;
    let missing = false;
    try {
      paintStandardTemplate(
        document.createElement('canvas').getContext('2d'),
        variants[0],
        new Map(),
      );
    } catch (e) {
      missing = e.message.includes('unavailable');
    }
    return {
      rows,
      excludesOldCalibration: !hasColorCalibration({
        ...variants[0],
        setCode: 'leb',
        colorCalibration: 'set-hsb-v1',
      }),
      excludesOldComposite: !retroDualFrame({
        ...variants[0],
        setCode: 'leb',
        typeLine: 'Land',
        land: true,
        frameColors: ['B', 'G'],
      }),
      keyChanges: old !== p.cardTextureKey(input(changed), 'inspect'),
      maskReused: one === two,
      outerAlpha: alpha[3],
      innerAlpha: alpha[(3 * 8 + 3) * 4 + 3],
      missing,
    };
  });
  assert.equal(result.rows.length, 3);
  for (const row of result.rows) {
    assert.equal(row.width, 488);
    assert.equal(row.height, 680);
    assert.ok(row.rect.every((n) => Number.isFinite(n) && n >= 0 && n <= 1));
    assert.ok(row.assets.some((u) => u.includes('Full-Magic-Pack/16f1d13')));
  }
  assert.equal(result.keyChanges, true);
  assert.equal(result.excludesOldCalibration, true);
  assert.equal(result.excludesOldComposite, true);
  assert.equal(result.maskReused, true);
  assert.equal(result.outerAlpha, 0);
  assert.equal(result.innerAlpha, 255);
  assert.equal(result.missing, true);
  console.log(
    'Three standard templates render; geometry, cache keys, shared mask conversion, missing assets and calibration isolation pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
