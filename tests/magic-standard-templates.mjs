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
    const battleRows = [];
    for (const overrides of [
      { defense: '0' },
      {
        illustrationPlacement: [0.2, 0.1, 0.5, 0.4],
        illustrationCrop: [0.1, 0.2, 0.8, 0.5],
      },
    ]) {
      const face = { ...variants[2], reverseStats: { power: '4', toughness: '4' }, ...overrides };
      const images = new Map();
      for (const url of p.canvasAssetUrls(face).filter(Boolean)) {
        const image = document.createElement('canvas');
        image.width = 1200;
        image.height = 600;
        images.set(url, await createImageBitmap(image));
      }
      const canvas = document.createElement('canvas');
      canvas.width = 488;
      canvas.height = 680;
      const context = canvas.getContext('2d');
      const drawImage = context.drawImage.bind(context);
      let paintedArt;
      context.drawImage = (image, ...args) => {
        if (image === images.get(face.illustration)) {
          const [x, y, width, height] = args.length === 8 ? args.slice(4) : args;
          const transform = context.getTransform();
          const corners = [
            transform.transformPoint(new DOMPoint(x, y)),
            transform.transformPoint(new DOMPoint(x + width, y + height)),
          ];
          paintedArt = [
            Math.min(...corners.map((point) => point.x)) / 488,
            Math.min(...corners.map((point) => point.y)) / 680,
            Math.abs(corners[1].x - corners[0].x) / 488,
            Math.abs(corners[1].y - corners[0].y) / 680,
          ];
        }
        return drawImage(image, ...args);
      };
      const paintedText = [];
      const fillText = context.fillText.bind(context);
      context.fillText = (text, x, y, ...args) => {
        paintedText.push({ text, x, y, font: context.font });
        return fillText(text, x, y, ...args);
      };
      paintStandardTemplate(context, face, images);
      const recipe = (await import('/games/magic/src/index.ts')).mtg.describe(face, 'inspect');
      context.font = '17px serif';
      const reminder = p.battleReverseStatsLayout(context, face);
      battleRows.push({
        paintedArt,
        paintedText,
        defense: face.defense,
        geometry: p.artworkGeometry(face, 1200, 600),
        artRect: p.faceRects(face).art,
        placement: face.illustrationPlacement,
        crop: face.illustrationCrop,
        edge: recipe.edges[0],
        window: recipe.artWindows[0],
        defenseRegion: p.faceRects(face).stats,
        reminderRegion: recipe.regions.find((region) => region.id === 'reverse-stats')?.rect,
        reminder,
        fontRestored: context.font === '17px serif',
        noReminder: p.battleReverseStatsLayout(context, { ...face, reverseStats: undefined }),
        ordinaryReminder: p.battleReverseStatsLayout(context, {
          ...face,
          frameTemplate: undefined,
        }),
      });
      for (const image of images.values()) image.close();
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
      battleRows,
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
  const aperture = [51 / 375, 38 / 523, 162 / 375, 422 / 523];
  const near = (actual, expected, tolerance = 1e-9) => {
    assert.equal(actual.length, expected.length);
    actual.forEach((value, index) =>
      assert.ok(
        Math.abs(value - expected[index]) < tolerance,
        JSON.stringify({ actual, expected }),
      ),
    );
  };
  for (const row of result.battleRows) {
    near(row.artRect, aperture);
    near(row.geometry.aperture, aperture);
    near(row.paintedArt, row.geometry.destination, 1e-7);
    near(row.edge.destination, row.placement ?? aperture);
    near(row.edge.clip, aperture);
    near(row.window, aperture);
    assert.equal(row.edge.rotation, -90);
    assert.deepEqual(row.geometry.source, row.crop ?? [0, 0, 1, 1]);
    near(row.reminderRegion, [307 / 375, 38 / 523, 12 / 375, 30 / 523]);
    assert.notDeepEqual(row.reminderRegion, row.defenseRegion);
    assert.equal(row.reminder.text, '4/4');
    assert.equal(row.reminder.rotation, -90);
    assert.equal(row.reminder.x, 485);
    assert.ok(Math.abs(row.reminder.inkBounds[1] + row.reminder.inkBounds[3] - 319) < 1e-9);
    assert.ok(row.reminder.inkBounds[0] >= 455);
    const reverseInk = row.paintedText.filter((entry) => entry.text === '4/4');
    assert.equal(reverseInk.length, 1);
    assert.equal(reverseInk[0].x, 485);
    assert.match(reverseInk[0].font, /ModMatrix/);
    assert.ok(
      row.paintedText.some(
        (entry) => entry.text === row.defense && entry.x >= 480 && entry.y >= 336 && entry.y <= 360,
      ),
    );
    assert.equal(row.fontRestored, true);
    assert.equal(row.noReminder, null);
    assert.equal(row.ordinaryReminder, null);
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
