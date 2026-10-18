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
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  const result = await page.evaluate(async () => {
    const { paintAftermathFace, aftermathRules } = await import(
      '/games/magic/src/presentation/aftermath-paint.ts'
    );
    const { aftermathFrameAsset } = await import(
      '/games/magic/src/presentation/aftermath-frame.ts'
    );
    const { splitPanels, panelRect } = await import(
      '/games/magic/src/presentation/split-layout.ts'
    );
    const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
    const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { mtg } = await import('/games/magic/src/index.ts');
    const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
    const face = {
      name: 'First // Second',
      layout: 'split',
      faces: [
        {
          name: 'First',
          colors: ['W'],
          rulesText: 'Draw a card.',
          illustration: 'first',
          typeLine: 'Sorcery',
        },
        {
          name: 'Second',
          colors: ['B'],
          rulesText: 'Aftermath\nReturn a card.',
          illustration: 'second',
          typeLine: 'Sorcery',
        },
      ],
    };
    const canvas = document.createElement('canvas');
    canvas.width = 488;
    canvas.height = 680;
    const c = canvas.getContext('2d', { willReadFrequently: true });
    const solid = (color) => {
      const x = document.createElement('canvas');
      x.width = x.height = 16;
      const q = x.getContext('2d');
      q.fillStyle = color;
      q.fillRect(0, 0, 16, 16);
      return x;
    };
    const images = new Map([
      ['first', solid('#00ff00')],
      ['second', solid('#ff0000')],
      [aftermathFrameAsset(face.faces[0]), solid('#777777')],
      [aftermathFrameAsset(face.faces[1]), solid('#999999')],
    ]);
    const panels = splitPanels(face),
      windows = panels.map((p) => panelRect(p, faceRects(p.face).art));
    const typeAnchors = [];
    const fillText = c.fillText.bind(c);
    c.fillText = (text, x, y, ...rest) => {
      const transform = c.getTransform();
      if (text === 'Sorcery' && transform.b > 0)
        typeAnchors.push([
          transform.a * x + transform.c * y + transform.e,
          transform.b * x + transform.d * y + transform.f,
        ]);
      fillText(text, x, y, ...rest);
    };
    paintAftermathFace(c, face, images);
    const pixel = (x, y) => Array.from(c.getImageData(x, y, 1, 1).data);
    const full = windows.map(([x, y, w, h]) => pixel((x + w / 2) * 488, (y + h / 2) * 680));
    paintAftermathFace(c, face, images, undefined, 'printing');
    const printing = windows.map(([x, y, w, h]) => pixel((x + w / 2) * 488, (y + h / 2) * 680));
    const frame = pixel(25, 100);
    const recipe = mtg.describe(face, 'inspect');
    const fuse = splitPanels({
      ...face,
      faces: [
        face.faces[0],
        {
          ...face.faces[1],
          rulesText: 'Do a thing.\nFuse (Reminder)',
          rulesParagraphs: [
            { role: 'rules', runs: [{ text: 'Do a thing.' }] },
            { role: 'rules', runs: [{ text: 'Fuse ' }, { text: '(Reminder)', italic: true }] },
          ],
        },
      ],
    });
    const impossible = aftermathRules(
      c,
      { name: 'Dense', rulesText: 'An extremely long instruction. '.repeat(500) },
      true,
    ).overflow;
    const shadows = [];
    const shadowContext = {
      save() {},
      restore() {},
      getTransform: () => ({ a: 0, b: 2, c: -2, d: 0 }),
      beginPath() {},
      arc() {},
      fill() {
        shadows.push([this.shadowOffsetX, this.shadowOffsetY]);
      },
      fillText() {},
    };
    paintMana(shadowContext, '1', 0, 0, 20, new Map(), true);
    const key = (f) => cardTextureKey({ face: f, printingId: null, printedImage: null }, 'inspect');
    return {
      full,
      typeAnchors,
      printing,
      frame,
      windows,
      recipeWindows: recipe.artWindows,
      edgeWindows: recipe.edges.map((e) => e.destination),
      rotations: recipe.edges.map((e) => e.rotation),
      assets: canvasAssetUrls(face),
      fuse: fuse[1].face,
      impossible,
      shadows,
      footerInvalidates: key(face) !== key({ ...face, legalText: 'Changed' }),
    };
  });
  assert.ok(result.typeAnchors.length > 0);
  for (const [x, y] of result.typeAnchors)
    assert.ok(
      x >= 241 && x <= 249 && y >= 379 && y <= 384,
      'Sideways type text starts inside the printed type plate',
    );
  assert.deepEqual(
    result.full,
    [
      [0, 255, 0, 255],
      [255, 0, 0, 255],
    ],
    'Both physical apertures show the correct independent art',
  );
  assert.deepEqual(
    result.printing,
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    'Printing has two clear apertures',
  );
  assert.equal(result.frame[3], 255, 'Clearing art preserves frame');
  assert.deepEqual(result.windows, result.recipeWindows);
  assert.deepEqual(result.windows, result.edgeWindows);
  assert.deepEqual(result.rotations, [0, 90]);
  assert.ok(result.assets.filter((x) => x?.includes('/aftermath/')).length === 2);
  assert.ok(!result.assets.some((x) => x?.includes('/boxes/')));
  assert.equal(
    result.fuse.rulesParagraphs.length,
    1,
    'Fuse removed from both text representations',
  );
  assert.equal(result.fuse.rulesText, 'Do a thing.');
  assert.ok(result.impossible);
  assert.deepEqual(
    result.shadows,
    [[-3.0744, -3.0744]],
    'Mana shadow rotates with its reading orientation',
  );
  assert.ok(result.footerInvalidates);
  console.log(
    'Aftermath art, printing, edge and foil apertures agree; Fuse, shadow and cache regressions pass',
  );
} finally {
  await browser.close();
  await server.close();
}
