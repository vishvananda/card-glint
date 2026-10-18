import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  const result = await page.evaluate(async () => {
    const { withPrintingOmissions } = await import(
      '/games/magic/src/presentation/printing-omissions.ts'
    );
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const canvas = document.createElement('canvas');
    canvas.width = 976;
    canvas.height = 1360;
    const c = canvas.getContext('2d');
    c.scale(2, 2);
    c.font = '18px monospace';
    const fill = c.fillText,
      stroke = c.strokeText;
    const base = { name: 'Probe', typeLine: 'Creature', rulesText: 'Keep this.', colors: ['U'] };
    const edited = {
      ...base,
      printingOmissions: [{ rect: [50 / 488, 155 / 680, 150 / 488, 60 / 680], texts: ['Hide'] }],
    };
    const paint = () => {
      c.fillText('Keep', 60, 100);
      c.fillText('Hide', 60, 180);
      c.strokeText('Hide', 60, 210);
      c.fillText('Hide', 300, 180);
    };
    const ink = (x, y, w, h) =>
      c
        .getImageData(x * 2, y * 2, w * 2, h * 2)
        .data.filter((_, i) => i % 4 === 3)
        .reduce((a, b) => a + b, 0);
    withPrintingOmissions(c, edited, paint);
    const counts = {
      kept: ink(50, 70, 100, 40),
      omitted: ink(50, 150, 150, 70),
      repeatedElsewhere: ink(290, 150, 100, 40),
    };
    const restored = c.fillText === fill && c.strokeText === stroke;
    let threw = false;
    try {
      withPrintingOmissions(c, edited, () => {
        throw Error('stop');
      });
    } catch {
      threw = true;
    }
    const restoredAfterError = c.fillText === fill && c.strokeText === stroke;
    c.clearRect(0, 0, 488, 680);
    c.save();
    c.translate(300, 100);
    c.rotate(Math.PI / 2);
    const rotated = {
      ...base,
      printingOmissions: [
        { rect: [300 / 488, 100 / 680, 120 / 488, 50 / 680], rotation: 90, texts: ['Hide'] },
      ],
    };
    withPrintingOmissions(c, rotated, () => c.fillText('Hide', 20, 20));
    c.restore();
    const rotatedInk = ink(240, 100, 80, 120);
    const key = (face, layer = 'face') =>
      cardTextureKey({ face, layer, printingId: null, printedImage: null }, 'inspect');
    return {
      counts,
      restored,
      threw,
      restoredAfterError,
      rotatedInk,
      keys: {
        original: key(base),
        empty: key({ ...base, printingOmissions: [], blackBorderLift: 0 }),
        edited: key(edited),
        lifted: key({ ...base, blackBorderLift: 0.04 }),
        mask: key(base, 'etching'),
        editedMask: key(edited, 'etching'),
      },
    };
  });
  assert.ok(result.counts.kept > 0);
  assert.equal(result.counts.omitted, 0);
  assert.ok(
    result.counts.repeatedElsewhere > 0,
    'Matching text outside the region must remain visible',
  );
  assert.ok(result.restored && result.threw && result.restoredAfterError);
  assert.equal(result.rotatedInk, 0, 'Physical coordinates must follow rotated panel transforms');
  assert.equal(result.keys.original, result.keys.empty);
  assert.notEqual(result.keys.original, result.keys.edited);
  assert.notEqual(result.keys.original, result.keys.lifted);
  assert.equal(result.keys.mask, result.keys.editedMask, 'Text editing must reuse artwork etching');
  console.log(
    'Printing omissions: bounded fill/stroke ink, rotated panels, restoration after errors, cache separation and unchanged defaults pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
