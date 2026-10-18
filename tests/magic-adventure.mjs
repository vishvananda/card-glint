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
    const { adventureAssets, adventurePlate, ADVENTURE_LEFT_MASK, ADVENTURE_RECTS } = await import(
      '/games/magic/src/presentation/adventure-frame.ts'
    );
    const { adventureFrameImage } = await import(
      '/games/magic/src/presentation/adventure-material.ts'
    );
    const { paintAdventureFace } = await import('/games/magic/src/presentation/adventure-paint.ts');
    const { adventureRuleLayouts } = await import(
      '/games/magic/src/presentation/adventure-rules.ts'
    );
    const { prepareAdventurePaper } = await import(
      '/games/magic/src/presentation/adventure-paper.ts'
    );
    const { adventureCollectorText } = await import(
      '/games/magic/src/presentation/adventure-footer.ts'
    );
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { mtg } = await import('/games/magic/src/index.ts');
    const face = {
      name: 'Creature',
      typeLine: 'Creature',
      colors: ['B'],
      layout: 'adventure',
      illustration: 'art',
      rulesText: 'Flying',
      faces: [
        { name: 'Creature', typeLine: 'Creature', colors: ['B'], rulesText: 'Flying' },
        {
          name: 'Adventure',
          typeLine: 'Sorcery — Adventure',
          colors: ['R'],
          manaSymbols: ['R'],
          rulesText: 'Draw a card.',
        },
      ],
    };
    const solid = (color, rect = [0, 0, 488, 680]) => {
      const c = document.createElement('canvas');
      c.width = 488;
      c.height = 680;
      const ctx = c.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(...rect);
      return c;
    };
    const sources = new Map([
      [adventurePlate(face), solid('#111111')],
      [adventurePlate(face.faces[1]), solid('#ff0000')],
      [ADVENTURE_LEFT_MASK, solid('#fff', [25, 425, 219, 204])],
      ['art', solid('#00ff00')],
    ]);
    const material = adventureFrameImage(face, sources),
      same = adventureFrameImage(face, sources) === material;
    const pixel = (c, x, y) => Array.from(c.getContext('2d').getImageData(x, y, 1, 1).data);
    const sides = [pixel(material, 80, 550), pixel(material, 300, 550)];
    const canvas = solid('#fff');
    const c = canvas.getContext('2d');
    paintAdventureFace(c, face, sources);
    const art = pixel(canvas, 240, 200),
      outside = pixel(canvas, 30, 200);
    paintAdventureFace(c, face, sources, undefined, 'printing');
    const aperture = pixel(canvas, 240, 200),
      frame = pixel(canvas, 30, 200);
    let missing = false;
    try {
      adventureFrameImage(face, new Map());
    } catch {
      missing = true;
    }
    const key = (f) => cardTextureKey({ face: f, printingId: null, printedImage: null }, 'inspect');
    const base = key(face);
    const invalidations = [
      { colors: ['U'] },
      { rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Changed', italic: true }] }] },
      { manaSymbols: ['U'] },
      { name: 'Other' },
    ].map(
      (change) =>
        key({ ...face, faces: [face.faces[0], { ...face.faces[1], ...change }] }) !== base,
    );
    const recipe = mtg.describe(face, 'inspect');
    const dense = {
      ...face,
      rulesText: 'A long instruction. '.repeat(600),
      faces: [face.faces[0], { ...face.faces[1], rulesText: 'A long spell. '.repeat(600) }],
    };
    const overflow = adventureRuleLayouts(c, dense);
    const paper = solid('#32658a');
    prepareAdventurePaper(paper, { ...face, setCode: 'eld', colorCalibration: 'set-hsb-v1' }, 'U');
    const unchanged = solid('#32658a');
    prepareAdventurePaper(
      unchanged,
      { ...face, setCode: 'clb', colorCalibration: 'set-hsb-v1' },
      'U',
    );
    const formats = [
      adventureCollectorText({
        ...face,
        setCode: 'eld',
        collectorNumber: '044/269',
        rarity: 'rare',
      }),
      adventureCollectorText({
        ...face,
        setCode: 'woe',
        collectorNumber: '230/276',
        rarity: 'mythic',
      }),
      adventureCollectorText({
        ...face,
        setCode: 'custom',
        collectorFormat: 'rarity-first',
        collectorNumber: '12a',
        rarity: 'uncommon',
      }),
    ];
    return {
      sides,
      same,
      art,
      outside,
      aperture,
      frame,
      missing,
      invalidations,
      assets: canvasAssetUrls(face),
      native: adventureAssets(face),
      windows: recipe.artWindows,
      edges: recipe.edges.map((e) => e.destination),
      expected: ADVENTURE_RECTS.art,
      overflow: [overflow.permanent.overflow, overflow.spell.overflow],
      paper: {
        body: pixel(paper, 100, 550),
        header: pixel(paper, 100, 475),
        fold: pixel(paper, 28, 550),
        rail: pixel(paper, 100, 630),
        unsupported: pixel(unchanged, 100, 550),
      },
      formats,
      formatInvalidates: base !== key({ ...face, collectorFormat: 'rarity-first' }),
    };
  });
  assert.deepEqual(
    result.sides,
    [
      [255, 0, 0, 255],
      [17, 17, 17, 255],
    ],
    'Inset keeps its own color without repainting the permanent page',
  );
  assert.ok(result.same, 'Prepared material is reused');
  assert.deepEqual(result.art, [0, 255, 0, 255]);
  assert.deepEqual(result.outside, [17, 17, 17, 255]);
  assert.deepEqual(result.aperture, [0, 0, 0, 0]);
  assert.deepEqual(result.frame, [17, 17, 17, 255]);
  assert.ok(result.missing, 'Missing source masks must fail instead of publishing a partial face');
  assert.ok(
    result.invalidations.every(Boolean),
    'Every inset presentation input invalidates the face',
  );
  assert.deepEqual(result.windows, [result.expected]);
  assert.deepEqual(result.edges, [result.expected]);
  assert.ok(result.native.every((url) => result.assets.includes(url)));
  assert.ok(!result.assets.some((url) => url?.includes('/boxes/')));
  assert.deepEqual(result.overflow, [true, true]);
  for (const area of ['header', 'fold', 'rail', 'unsupported'])
    assert.deepEqual(result.paper[area], [50, 101, 138, 255]);
  assert.ok(
    result.paper.body[0] + result.paper.body[1] + result.paper.body[2] > 289,
    'Admitted correction lightens only the inset paper',
  );
  assert.equal(result.paper.body[3], 255);
  assert.deepEqual(result.formats, ['044/269 R', 'M 0230', 'U 0012a']);
  assert.ok(result.formatInvalidates);
  console.log(
    'Adventure independent page colors, prepared-material reuse, art/printing/effect bounds, cache keys and explicit overflow pass',
  );
} finally {
  await browser.close();
  await server.close();
}
