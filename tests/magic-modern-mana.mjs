import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { prepareManaNumerals } = await import('/games/magic/src/presentation/mana-numeral.ts');
    const { modernCostNumeralAsset } = await import(
      '/games/magic/src/presentation/modern-cost-mana.ts'
    );
    const { faceManaAssets } = await import('/games/magic/src/presentation/mana-assets.ts');
    const { manaSymbolAsset } = await import('/games/magic/src/presentation/assets.ts');
    const { printingManaAdjustment } = await import(
      '/games/magic/src/presentation/printing-mana-adjustment.ts'
    );
    const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
    // Preserve the historical component source control under exact-printing policy.
    // Inherited M21 defaults have separate positive adoption and worker tests.
    const face = {
      name: 'Probe',
      setCode: 'war',
      calibration: 'printing',
      manaSymbols: ['3'],
      rulesText: 'Pay {3}.',
    };
    const make = async (triangle) => {
      const c = document.createElement('canvas');
      c.width = c.height = 96;
      const x = c.getContext('2d');
      x.fillStyle = triangle ? '#cbc2bf' : '#cac5c0';
      x.beginPath();
      x.arc(48, 48, 48, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = triangle ? '#130c0e' : '#0d0f0f';
      if (triangle) {
        x.beginPath();
        x.moveTo(48, 20);
        x.lineTo(70, 75);
        x.lineTo(26, 75);
        x.closePath();
        x.fill();
      } else x.fillRect(40, 20, 16, 55);
      return createImageBitmap(c);
    };
    const original = await make(false),
      candidate = await make(true),
      url = modernCostNumeralAsset(face, '3');
    const images = new Map([
      [manaSymbolAsset('3'), original],
      [url, candidate],
    ]);
    const get = CanvasRenderingContext2D.prototype.getImageData;
    let reads = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      reads++;
      return get.apply(this, args);
    };
    const signal = new AbortController().signal,
      p = await prepareManaNumerals(face, images, signal),
      cold = reads;
    const warm = await prepareManaNumerals(face, images, signal),
      warmReads = reads - cold;
    const paint = (map, cost, a, rotate = false) => {
      const c = document.createElement('canvas');
      c.width = c.height = 150;
      const x = c.getContext('2d');
      if (rotate) x.setTransform(0, 1, -1, 0, 150, 0);
      paintMana(x, '3', 25, 25, 96, map, cost, a);
      return get.call(x, 0, 0, 150, 150).data;
    };
    const baseInline = paint(images, false),
      newInline = paint(p.images, false),
      baseCost = paint(images, true),
      newCost = paint(p.images, true, printingManaAdjustment(face));
    const changed = (a, b) => a.reduce((n, v, i) => n + (v !== b[i] ? 1 : 0), 0);
    const beforePaintReads = reads;
    paint(p.images, true, printingManaAdjustment(face));
    const paintingReads = reads - beforePaintReads;
    const rotated = paint(p.images, true, printingManaAdjustment(face), true);
    const alphaBounds = (a) => {
      let l = 150,
        t = 150,
        r = 0,
        b = 0;
      for (let y = 0; y < 150; y++)
        for (let x = 0; x < 150; x++)
          if (a[(y * 150 + x) * 4 + 3] > 128) {
            l = Math.min(l, x);
            t = Math.min(t, y);
            r = Math.max(r, x);
            b = Math.max(b, y);
          }
      return [l, t, r, b];
    };
    CanvasRenderingContext2D.prototype.getImageData = get;
    const scoped = [
      { setCode: '8ed', frameAssetFamily: 'eighth' },
      { frameTemplate: 'battle' },
      { rulesText: 'Level up {1}' },
      { layout: 'split' },
      { frameAssetFamily: 'eighth' },
      { frameStyle: 'retro' },
      { typeLine: 'Legendary Planeswalker — Teferi' },
      { frameAssetFamily: 'm15-accurate' },
    ].map((extra) => modernCostNumeralAsset({ ...face, ...extra }, '3'));
    const delta = printingManaAdjustment({
      ...face,
      symbolAdjustment: { mana: { numberDx: 0.5, numberScale: 1.1 } },
    });
    const neutral = await prepareManaNumerals(
      { ...face, symbolAdjustment: { mana: { numberScale: 1 / 0.98, numberDx: 0.25 } } },
      images,
      signal,
    );
    const result = {
      legendary: modernCostNumeralAsset(
        { ...face, legendary: true, typeLine: 'Legendary Creature' },
        '3',
      ),
      whiteStock: modernCostNumeralAsset({ ...face, borderColor: 'white' }, '3'),
      neutralSource: neutral.images.manaNumerals?.has('3'),
      admitted: ['m15', 'm20', 'war', 'dmu', 'dsk', 'future-set', undefined].map((setCode) => ({
        url: modernCostNumeralAsset({ ...face, setCode }, '3'),
        adjustment: printingManaAdjustment({ ...face, setCode }),
      })),
      inline: changed(baseInline, newInline),
      cost: changed(baseCost, newCost),
      cold,
      warmReads,
      paintingReads,
      scoped,
      urls: faceManaAssets(face),
      source: url,
      bounds: alphaBounds(newCost),
      rotated: alphaBounds(rotated),
      delta,
      shadow: p.images.manaCostShadow,
    };
    p.dispose();
    warm.dispose();
    neutral.dispose();
    original.close();
    candidate.close();
    return result;
  });
  assert.equal(result.inline, 0, 'Cost-source replacement must not alter inline symbols');
  assert.ok(result.cost > 100, 'Loaded cost source must change painted ink/shadow');
  assert.equal(result.cold, 1);
  assert.equal(result.warmReads, 0);
  assert.equal(result.paintingReads, 0);
  assert.ok(result.scoped.every((x) => x === null));
  assert.ok(result.urls.includes(result.source));
  assert.equal(result.legendary, result.source);
  assert.equal(result.whiteStock, result.source);
  assert.equal(result.neutralSource, true);
  for (const a of result.admitted) {
    assert.equal(a.url, result.source);
    assert.deepEqual(a.adjustment, {
      scaleX: 1.01,
      scaleY: 1.01,
      numberScale: 0.98,
      numberDx: -0.25,
    });
  }
  assert.equal(result.delta.numberDx, 0.25);
  assert.equal(result.delta.numberScale, 0.98 * 1.1);
  assert.deepEqual(result.shadow, [-1.0372, 2.0372]);
  assert.deepEqual(
    result.rotated,
    [149 - result.bounds[3], result.bounds[0], 149 - result.bounds[1], result.bounds[2]],
    'Shadow rotates in panel-local coordinates',
  );
  const evidence = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/m21-mana-refinement.json'),
  );
  assert.equal(evidence.adopt, true);
  assert.deepEqual(evidence.flags, []);
  assert.equal(evidence.rows.filter((r) => r.cohort === 'calibration').length, 20);
  assert.equal(evidence.rows.filter((r) => r.cohort === 'validation').length, 41);
  assert.equal(new Set(evidence.rows.map((r) => r.id)).size, 61);
  assert.ok(evidence.validation.after > evidence.validation.before + 0.005);
  assert.ok(evidence.validation.groups.every((g) => g.after >= g.before));
  const transfer = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/modern-mana-transfer.json'),
  );
  assert.equal(transfer.summary.total, 152);
  assert.equal(transfer.summary.measured, 148);
  assert.equal(transfer.summary.alignmentReview, 4);
  assert.deepEqual(transfer.initialAdoptedSets, ['m15', 'war']);
  assert.equal(transfer.defaultPolicy, 'ordinary-modern-component-frame');
  for (const set of transfer.initialAdoptedSets) {
    assert.ok(transfer.sets[set].after > transfer.sets[set].before + 0.005);
    assert.ok(transfer.sets[set].inkAfter > transfer.sets[set].inkBefore);
    const group = transfer.frameReferences.filter((g) => g.set === set);
    for (const g of group) {
      const held = new Set(
        transfer.rows.filter((r) => r.set === set && r.material === g.material).map((r) => r.id),
      );
      assert.ok(
        g.calibration.every((r) => !held.has(r.id)),
        'Frame references must be disjoint from mana validation',
      );
    }
  }
  assert.ok(transfer.sets.dmu.after < transfer.sets.dmu.before);
  console.log(
    'Modern cost source, scope, transfer evidence, rotation, editor deltas and warm-cache behavior verified.',
  );
} finally {
  await browser.close();
  await server.close();
}
