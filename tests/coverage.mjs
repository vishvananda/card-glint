import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
  });
  const toggle = async (id) => {
    await page.locator('#' + id).click();
    await page.waitForFunction(() => !document.querySelector('#scope').disabled);
  };
  const measure = () =>
    page.evaluate(async () => {
      const r = await window.lab.ready,
        card = window.lab.documents[0];
      const image = async (finish) => {
        const blob = await r.exportCard(card.id, {
          revision: card.revision,
          width: 720,
          finish,
          time: 2,
        });
        const bitmap = await createImageBitmap(blob);
        const c = window.lab.api.canvas([bitmap.width, bitmap.height]),
          ctx = c.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        return ctx.getImageData(0, 0, c.width, c.height);
      };
      const base = await image('regular'),
        results = {};
      const frame = card.layers.find((l) => l.id === 'showcase-frame');
      const raw = await frame.raster.paint();
      const fc = window.lab.api.canvas([base.width, base.height]),
        fctx = fc.getContext('2d');
      fctx.drawImage(raw, 0, 0, fc.width, fc.height);
      raw.width = raw.height = 0;
      const alpha = fctx.getImageData(0, 0, fc.width, fc.height).data;
      const protectedPixels = [];
      // Fully opaque frame ink, inside the illustration; ignore translucent enamel
      // and antialiased glyph edges where the refracted art legitimately shows through.
      for (let y = 60; y < 400; y++)
        for (let x = 10; x < fc.width - 10; x++) {
          const i = (y * fc.width + x) * 4;
          if (alpha[i + 3] === 255) protectedPixels.push(i);
        }
      if (protectedPixels.length < 10) throw Error('Missing opaque frame test samples');
      for (const finish of [
        'rain',
        'heat',
        'pool',
        'etched',
        'cold',
        'opal',
        'prismatic',
        'gloss',
      ]) {
        const actual = await image(finish);
        let inside = 0,
          outside = 0,
          protectedInk = 0;
        for (let y = 8; y < base.height - 8; y++)
          for (let x = 8; x < base.width - 8; x++) {
            const i = (y * base.width + x) * 4;
            const changed =
              Math.abs(base.data[i] - actual.data[i]) +
                Math.abs(base.data[i + 1] - actual.data[i + 1]) +
                Math.abs(base.data[i + 2] - actual.data[i + 2]) >
              2;
            const inArt = card.recipe.artWindows.some(
              ([left, top, w, h]) =>
                x / base.width > left &&
                x / base.width < left + w &&
                y / base.height > top &&
                y / base.height < top + h,
            );
            // Skip the boundary's bilinear transition.
            const nearEdge = card.recipe.artWindows.some(
              ([, top, , h]) =>
                Math.abs(y / base.height - top) < 0.01 ||
                Math.abs(y / base.height - top - h) < 0.01,
            );
            if (changed && !nearEdge) {
              if (inArt) inside++;
              else outside++;
            }
          }
        for (const i of protectedPixels) {
          if ([0, 1, 2].some((c) => Math.abs(base.data[i + c] - actual.data[i + c]) > 2))
            protectedInk++;
        }
        results[finish] = { inside, outside, protectedInk };
      }
      return { results, metrics: r.metrics };
    });
  const full = await measure();
  await toggle('scope');
  assert.equal(await page.locator('#scope').getAttribute('aria-pressed'), 'true');
  const art = await measure();
  for (const [finish, pixels] of Object.entries(art.results)) {
    assert.ok(pixels.inside > 100, finish + ' missing from artwork');
    assert.equal(pixels.outside, 0, finish + ' changed the frame/text in artwork-only mode');
    assert.equal(pixels.protectedInk, 0, finish + ' changed an overlaid frame/symbol');
    assert.ok(full.results[finish].outside > 100, finish + ' full-card mode missing');
  }
  for (const key of ['maskBuilds', 'edgeBuilds']) {
    assert.equal(art.metrics[key], full.metrics[key], key + ' rebuilt when changing effect area');
  }
  await toggle('layer');
  const layers = await page.evaluate(() => window.lab.documents[0].layers.map((l) => l.id));
  assert.ok(
    layers.includes('badge') && layers.includes('showcase-art-scope'),
    'Overlay removed the art mask',
  );
  const badge = await page.evaluate(async () => {
    const r = await window.lab.ready,
      card = window.lab.documents[0];
    const blob = await r.exportCard(1, {
      revision: card.revision,
      width: 360,
      finish: 'pool',
      time: 2,
    });
    const b = await createImageBitmap(blob),
      c = window.lab.api.canvas([b.width, b.height]);
    const ctx = c.getContext('2d');
    ctx.drawImage(b, 0, 0);
    b.close();
    return [...ctx.getImageData(40, 112, 1, 1).data];
  });
  assert.deepEqual(badge, [229, 141, 51, 255], 'Pool distorted the over-finish badge');
  await toggle('scope');
  await toggle('scope');
  const warm = await page.evaluate(async () => (await window.lab.ready).metrics);
  await toggle('scope');
  await toggle('scope');
  const reused = await page.evaluate(async () => (await window.lab.ready).metrics);
  for (const key of ['compositions', 'maskBuilds', 'edgeBuilds', 'uploads', 'readbacks']) {
    assert.equal(reused[key], warm[key], key + ' changed during a warm scope toggle');
  }
  assert.deepEqual(errors, []);
  await writeFile(
    'evidence/coverage.json',
    JSON.stringify({ full, art, badge, warm, reused, errors }, null, 2) + '\n',
  );
  console.log(
    'Artwork/full-card toggle, all finishes, PNG export, overlays and warm cache reuse passed.',
  );
} finally {
  await browser.close();
}
