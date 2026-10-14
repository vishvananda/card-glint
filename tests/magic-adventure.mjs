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
  console.log(
    'Adventure independent page colors, prepared-material reuse, art/printing/effect bounds, cache keys and explicit overflow pass',
  );
} finally {
  await browser.close();
  await server.close();
}
