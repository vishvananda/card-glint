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
    const { prepareAssets, preparePlate, prepareMask, PREPARE_RECTS } = await import(
      '/games/magic/src/presentation/prepare-frame.ts'
    );
    const { prepareFrameImage } = await import('/games/magic/src/presentation/prepare-material.ts');
    const { paintPrepareFace } = await import('/games/magic/src/presentation/prepare-paint.ts');
    const { prepareRuleLayouts } = await import('/games/magic/src/presentation/prepare-rules.ts');
    const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { mtg } = await import('/games/magic/src/index.ts');
    const face = {
      name: 'Creature',
      typeLine: 'Creature',
      colors: ['B'],
      layout: 'prepare',
      illustration: 'art',
      rulesText: 'Flying',
      faces: [
        { name: 'Creature', typeLine: 'Creature', colors: ['B'] },
        { name: 'Spell', typeLine: 'Sorcery', colors: ['R'], rulesText: 'Draw a card.' },
      ],
    };
    const solid = (color, rect = [0, 0, 488, 680]) => {
      const canvas = document.createElement('canvas');
      canvas.width = 488;
      canvas.height = 680;
      const c = canvas.getContext('2d');
      c.fillStyle = color;
      c.fillRect(...rect);
      return canvas;
    };
    const sources = new Map([
      [preparePlate(face), solid('#111111')],
      [preparePlate(face.faces[1]), solid('#ff0000')],
      [prepareMask('prepare'), solid('#fff', [244, 425, 219, 190])],
      ['art', solid('#00ff00')],
    ]);
    const material = prepareFrameImage(face, sources),
      same = prepareFrameImage(face, sources) === material;
    const pixel = (canvas, x, y) =>
      Array.from(canvas.getContext('2d').getImageData(x, y, 1, 1).data);
    const sides = [pixel(material, 80, 550), pixel(material, 300, 550)];
    const canvas = solid('#fff'),
      c = canvas.getContext('2d');
    paintPrepareFace(c, face, sources);
    const art = pixel(canvas, 240, 200),
      outside = pixel(canvas, 30, 200);
    paintPrepareFace(c, face, sources, undefined, 'printing');
    const aperture = pixel(canvas, 240, 200),
      frame = pixel(canvas, 30, 200);
    const rejects = (fn) => {
      try {
        fn();
        return false;
      } catch {
        return true;
      }
    };
    const missing = rejects(() => prepareFrameImage(face, new Map()));
    const malformed = rejects(() => canvasAssetUrls({ ...face, faces: [] }));
    const colorless = rejects(() => canvasAssetUrls({ ...face, colors: [] }));
    const key = (f) => cardTextureKey({ face: f, printingId: null, printedImage: null }, 'inspect');
    const changed = [
      { colors: ['U'] },
      { name: 'Another spell' },
      { rulesText: 'Changed.' },
      { manaSymbols: ['U'] },
    ].map(
      (p) => key({ ...face, faces: [face.faces[0], { ...face.faces[1], ...p }] }) !== key(face),
    );
    const dense = prepareRuleLayouts(c, {
      ...face,
      rulesText: 'Long creature text. '.repeat(600),
      faces: [face.faces[0], { ...face.faces[1], rulesText: 'Long spell text. '.repeat(600) }],
    });
    const recipe = mtg.describe(face, 'inspect');
    return {
      same,
      sides,
      art,
      outside,
      aperture,
      frame,
      missing,
      malformed,
      colorless,
      changed,
      assets: canvasAssetUrls(face),
      native: prepareAssets(face),
      expected: PREPARE_RECTS.art,
      windows: recipe.artWindows,
      edges: recipe.edges.map((e) => e.destination),
      regions: recipe.regions.map((r) => r.id),
      overflow: [dense.permanent.overflow, dense.spell.overflow],
    };
  });
  assert.deepEqual(
    result.sides,
    [
      [17, 17, 17, 255],
      [255, 0, 0, 255],
    ],
    'Creature left and spell right retain independent materials',
  );
  assert.ok(result.same);
  assert.deepEqual(result.art, [0, 255, 0, 255]);
  assert.deepEqual(result.outside, [17, 17, 17, 255]);
  assert.deepEqual(result.aperture, [0, 0, 0, 0]);
  assert.deepEqual(result.frame, [17, 17, 17, 255]);
  assert.ok(
    result.missing && result.malformed && result.colorless,
    'Missing sources/layouts cannot silently fall back',
  );
  assert.ok(result.changed.every(Boolean));
  assert.ok(result.native.every((u) => result.assets.includes(u)));
  assert.deepEqual(result.windows, [result.expected]);
  assert.deepEqual(result.edges, [result.expected]);
  assert.ok(
    ['spell-title', 'spell-type', 'spell-rules'].every((id) => result.regions.includes(id)),
  );
  assert.deepEqual(result.overflow, [true, true]);
  console.log(
    'Prepared independent panels, cached materials, shared art/printing/effect bounds, hit regions and explicit failures pass',
  );
} finally {
  await browser.close();
  await server.close();
}
