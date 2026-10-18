import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch({ args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const { paintIllustration } = await import(
      '/games/magic/src/presentation/illustration-paint.ts'
    );
    const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
    const make = () => {
      const c = document.createElement('canvas');
      c.width = 488;
      c.height = 680;
      return c;
    };
    const art = make(),
      source = art.getContext('2d');
    source.fillStyle = '#00f';
    source.fillRect(0, 0, 488, 680);
    const image = await createImageBitmap(art),
      images = new Map([['art', image]]),
      results = [];
    for (const large of [false, true]) {
      const face = {
        name: 'Probe',
        typeLine: 'Planeswalker',
        illustration: 'art',
        rulesText: Array(large ? 4 : 3)
          .fill('+1: Draw a card.')
          .join('\n'),
      };
      const rects = faceRects(face),
        bounds = rects.art.map((v, i) => v * (i % 2 ? 680 : 488));
      const c = make(),
        ctx = c.getContext('2d');
      paintIllustration(ctx, face, images, bounds, 'artwork');
      const alpha = (x, y) => ctx.getImageData(x, y, 1, 1).data[3];
      const before = {
        left: alpha(36, 73),
        right: alpha(455, 73),
        inside: alpha(245, 100),
        middleLeft: alpha(39, 210),
      };
      const printing = make(),
        p = printing.getContext('2d');
      p.fillStyle = '#f00';
      p.fillRect(0, 0, 488, 680);
      paintIllustration(p, face, images, bounds, 'printing');
      ctx.drawImage(printing, 0, 0);
      const composed = [...ctx.getImageData(36, 73, 1, 1).data];
      results.push({
        before,
        composed,
        center: bounds[0] + bounds[2] / 2,
        frameCenter: (rects.frame[0] + rects.frame[2] / 2) * 488,
      });
    }
    const { paintUrzaFooter } = await import('/games/magic/src/presentation/retro-urza-footer.ts');
    const footers = [
      null,
      'An exceptionally long supplied illustrator credit with two artists',
    ].map((artist) => {
      const c = make(),
        ctx = c.getContext('2d');
      ctx.fillStyle = '#555';
      ctx.fillRect(0, 0, 488, 680);
      paintUrzaFooter(ctx, {
        name: 'Footer probe',
        setCode: 'uds',
        artist,
        power: '1',
        toughness: '1',
        legalText: null,
      });
      return ctx.getImageData(394, 606, 70, 39).data;
    });
    if (!footers[0].every((v, i) => v === footers[1][i]))
      throw Error('Long illustrator credit overlaps power/toughness');
    image.close();
    return results;
  });
  for (const row of result) {
    assert.equal(row.before.left, 0, 'Art leaked left of the curved aperture');
    assert.equal(row.before.right, 0, 'Art leaked right of the curved aperture');
    assert.equal(row.before.inside, 255);
    assert.equal(row.before.middleLeft, 255, 'Curved aperture lost its middle');
    assert.deepEqual(row.composed, [255, 0, 0, 255], 'Printing layer cleared outside the aperture');
    assert.ok(Math.abs(row.center - row.frameCenter) < 1e-6, 'Art and frame centers differ');
  }
  console.log(
    'Planeswalker apertures: centered art, curved clipping and matching printing cutout in both frame heights.',
  );
} finally {
  await browser.close();
  await server.close();
}
