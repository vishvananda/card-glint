import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { modernBasicLandProfile, paintBasicLandSymbol } = await import(
      '/games/magic/src/presentation/plate-basic-land.ts'
    );
    const { modernBasicMaterialJobs, colorModernBasicGlyph } = await import(
      '/games/magic/src/presentation/modern-basic-material.ts'
    );
    const { MaterialBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const check = (v, m) => {
      if (!v) throw Error(m);
    };
    let tested = 0;
    for (const name of ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']) {
      const face = {
        name,
        setCode: 'm21',
        canonicalTypeLine: 'Basic Land — ' + name,
        rulesText: '',
        colorCalibration: 'set-hsb-v1',
      };
      const p = modernBasicLandProfile(face);
      check(p?.source && p.sha256.length === 64, 'Missing bound glyph profile');
      for (const extra of [
        { setCode: 'war' },
        { frameStyle: 'retro' },
        { frameAssetFamily: 'eighth' },
        { frameTemplate: 'future' },
        { layout: 'transform' },
        { rulesText: 'Custom rules' },
        { canonicalTypeLine: 'Land — ' + name },
      ])
        check(!modernBasicLandProfile({ ...face, ...extra }), 'Incompatible glyph calibrated');
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 1;
      const c = canvas.getContext('2d');
      c.putImageData(
        new ImageData(new Uint8ClampedArray([...p.sourceInk, 255, 99, 44, 88, 0]), 2, 1),
        0,
        0,
      );
      const source = await createImageBitmap(canvas);
      const images = new Map([[p.source, source]]);
      const jobs = modernBasicMaterialJobs(face, images);
      check(jobs.length === 1 && jobs[0].bytes === 8, 'Missing bounded glyph job');
      check(
        modernBasicMaterialJobs({ ...face, colorCalibration: undefined }, images).length === 0,
        'Source palette changed',
      );
      const cache = new MaterialBitmapCache(64),
        signal = new AbortController().signal;
      const first = await cache.acquireMany(jobs, signal);
      const second = await cache.acquireMany(modernBasicMaterialJobs(face, images), signal);
      check(
        first[0].value === second[0].value && cache.stats.builds === 1 && cache.stats.hits === 1,
        'Warm glyph rebuilt',
      );
      c.clearRect(0, 0, 2, 1);
      c.drawImage(first[0].value, 0, 0);
      const out = c.getImageData(0, 0, 2, 1).data;
      check(
        p.body.every((v, i) => out[i] === v) && out[3] === 255 && out[7] === 0,
        'Ink/alpha incorrect',
      );
      c.clearRect(0, 0, 2, 1);
      c.drawImage(source, 0, 0);
      check(
        p.sourceInk.every((v, i) => c.getImageData(0, 0, 1, 1).data[i] === v),
        'Borrowed source mutated',
      );
      const replacement = await createImageBitmap(canvas);
      check(
        modernBasicMaterialJobs(face, new Map([[p.source, replacement]]))[0].key !== jobs[0].key,
        'Host replacement reused stale glyph',
      );
      const input = new Uint8ClampedArray([0, 0, 255, 200, 33, 44, 55, 0]);
      const expected = [...input];
      colorModernBasicGlyph(input, { sourceInk: [0, 0, 0], body: [255, 255, 255] });
      check(
        input.every((v, i) => v === expected[i]),
        'Recolor leaked outside ink range',
      );
      let drawn;
      const context = {
        save() {},
        restore() {},
        drawImage(...args) {
          drawn = args;
        },
      };
      paintBasicLandSymbol(context, face, images);
      const g = p.geometry;
      check(
        drawn[0] === source &&
          drawn[1] === 244 - 78 * g.scaleX + g.dx &&
          drawn[2] === 518 - 78 * g.scaleY + g.dy &&
          drawn[3] === 156 * g.scaleX &&
          drawn[4] === 156 * g.scaleY,
        'Geometry lost the original glyph center',
      );
      first[0].release();
      second[0].release();
      cache.clear();
      source.close();
      replacement.close();
      tested++;
    }
    return tested;
  });
  assert.equal(result, 5);
  console.log(
    'M21 five-color basic glyph scope, ink, alpha, geometry, source ownership and warm-cache reuse pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
