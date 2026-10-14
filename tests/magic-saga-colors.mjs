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
    const { sagaColorAssets, sagaColorFrames, paintSagaColors, SAGA_COLOR_MASKS } = await import(
      '/games/magic/src/presentation/saga-colors.ts'
    );
    const { specialRules } = await import('/games/magic/src/presentation/special-frames.ts');
    const make = (color, rect = [0, 0, 20, 28]) => {
      const c = document.createElement('canvas');
      c.width = 20;
      c.height = 28;
      const ctx = c.getContext('2d');
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(...rect);
      }
      return c;
    };
    const face = { name: 'Gold saga', typeLine: 'Enchantment — Saga', colors: ['B', 'U'] },
      frames = sagaColorFrames(face);
    const pin = make('#fff', [1, 1, 1, 26]);
    pin.getContext('2d').fillStyle = '#fff';
    pin.getContext('2d').fillRect(18, 1, 1, 26);
    const sources = new Map([
      [frames[0], make('#0000ff')],
      [frames[1], make('#000000')],
      [SAGA_COLOR_MASKS[0], pin],
      [SAGA_COLOR_MASKS[1], make('#fff', [2, 5, 4, 20])],
      [SAGA_COLOR_MASKS[2], make('#fff', [4, 5, 2, 20])],
      [SAGA_COLOR_MASKS[3], make(null)],
    ]);
    const out = document.createElement('canvas');
    out.width = 488;
    out.height = 680;
    const c = out.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.fillStyle = '#ffcc00';
    c.fillRect(0, 0, 488, 680);
    paintSagaColors(c, face, sources);
    const at = (x, y) => Array.from(c.getImageData((x / 20) * 488, (y / 28) * 680, 1, 1).data);
    let missing = false;
    try {
      paintSagaColors(c, face, new Map());
    } catch {
      missing = true;
    }
    return {
      frames,
      pixels: [at(1.5, 3), at(18.5, 3), at(3, 10), at(5, 10), at(10, 10)],
      missing,
      single: sagaColorAssets({ ...face, colors: ['U'] }),
      land: sagaColorAssets({ ...face, land: true }),
      transform: sagaColorAssets({ ...face, layout: 'transform' }),
      order: sagaColorFrames({ ...face, colors: ['W', 'R'] }),
      chapters: specialRules({ ...face, rulesText: 'I — First.\nII — Second.|III — Third.' }).map(
        (r) => r.badges,
      ),
      literal: specialRules({ ...face, rulesText: 'I — Keep A|B intact.' })[0].text,
    };
  });
  assert.ok(
    result.frames[0].endsWith('sagaFrameU.png') && result.frames[1].endsWith('sagaFrameB.png'),
  );
  assert.ok(
    result.order[0].endsWith('sagaFrameR.png') && result.order[1].endsWith('sagaFrameW.png'),
  );
  assert.deepEqual(result.pixels, [
    [0, 0, 255, 255],
    [0, 0, 0, 255],
    [0, 0, 255, 255],
    [0, 0, 0, 255],
    [255, 204, 0, 255],
  ]);
  assert.deepEqual([result.single, result.land, result.transform], [[], [], []]);
  assert.ok(result.missing);
  assert.deepEqual(result.chapters, [['I'], ['II'], ['III']]);
  assert.equal(result.literal, 'Keep A|B intact.');
  console.log(
    'Two-color Saga pinlines/bookmarks preserve gold material, order colors correctly and separate source chapter delimiters',
  );
} finally {
  await browser.close();
  await server.close();
}
