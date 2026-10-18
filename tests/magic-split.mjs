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
  const results = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { paintNativeSplitFace, splitRules } = await import(
      '/games/magic/src/presentation/split-paint.ts'
    );
    const { nativeSplitEra, splitPlateAsset, hasFuse } = await import(
      '/games/magic/src/presentation/split-frame.ts'
    );
    const { splitPanels, panelRect } = await import(
      '/games/magic/src/presentation/split-layout.ts'
    );
    const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
    const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { mtg } = await import('/games/magic/src/index.ts');
    const key = (face) => cardTextureKey({ face, printingId: null, printedImage: null }, 'inspect');
    const solid = (color) => {
      let c = document.createElement('canvas');
      c.width = c.height = 20;
      let ctx = c.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 20, 20);
      return c;
    };
    const output = [];
    for (const set of ['apc', 'dis', 'dgm', 'grn', 'moc']) {
      const face = {
        name: 'One // Two',
        layout: 'split',
        setCode: set,
        faces: [
          {
            name: 'One',
            typeLine: 'Instant',
            colors: ['R'],
            illustration: 'a',
            rulesText: 'Draw a card.',
          },
          {
            name: 'Two',
            typeLine: 'Sorcery',
            colors: ['U'],
            illustration: 'b',
            rulesText: 'Return a card.',
          },
        ],
      };
      if (set === 'dgm' || set === 'moc')
        face.faces[1].rulesParagraphs = [
          { role: 'rules', runs: [{ text: 'Return a card.' }] },
          { role: 'rules', runs: [{ text: 'Fuse ' }, { text: '(Reminder)', italic: true }] },
        ];
      const era = nativeSplitEra(face),
        fuse = hasFuse(face),
        panels = splitPanels(face);
      const images = new Map([
        ['a', solid('#ff0000')],
        ['b', solid('#00ff00')],
        ...panels.map((p, i) => [splitPlateAsset(p.face, era, fuse, i), solid('#888888')]),
        ...canvasAssetUrls(face)
          .filter((url) => url?.endsWith('bridge.png') || url?.endsWith('bridgemask.png'))
          .map((url) => [url, solid('#888888')]),
      ]);
      const canvas = solid('#000');
      canvas.width = 488;
      canvas.height = 680;
      const c = canvas.getContext('2d', { willReadFrequently: true });
      const windows = panels.map((p) => panelRect(p, faceRects(p.face).art));
      const pixel = (x, y) => Array.from(c.getImageData(x, y, 1, 1).data);
      const sample = () =>
        windows.map(([x, y, w, h]) => pixel((x + w / 2) * 488, (y + h / 2) * 680));
      paintNativeSplitFace(c, face, images);
      const full = sample();
      paintNativeSplitFace(c, face, images, undefined, 'printing');
      const printing = sample();
      const recipe = mtg.describe(face, 'inspect');
      const changed = structuredClone(face);
      changed.faces[1].watermark = 'boros';
      const reminder = structuredClone(face);
      if (fuse) reminder.faces[1].rulesParagraphs[1].runs[1].text = '(Different reminder)';
      let missing = false;
      try {
        paintNativeSplitFace(c, face, new Map());
      } catch {
        missing = true;
      }
      output.push({
        set,
        era,
        fuse,
        full,
        printing,
        windows,
        recipeWindows: recipe.artWindows,
        edgeWindows: recipe.edges.map((e) => e.destination),
        rotations: recipe.edges.map((e) => e.rotation),
        assets: canvasAssetUrls(face),
        watermarkKey: key(face) !== key(changed),
        reminderKey: !fuse || key(face) !== key(reminder),
        paragraphCount: panels[1].face.rulesParagraphs?.length,
        missing,
        overflow: splitRules(c, { rulesText: 'W'.repeat(5000) }, era, fuse).overflow,
      });
    }
    const { splitPlateImage, splitBlendMask, paintSplitWatermark, splitWatermark } = await import(
      '/games/magic/src/presentation/split-materials.ts'
    );
    const pair = { colors: ['W', 'U'] };
    const mask = solid('#000');
    mask.getContext('2d').fillStyle = '#fff';
    mask.getContext('2d').fillRect(2, 2, 16, 16);
    const materials = new Map([
      [splitPlateAsset(pair, 'eighth', false, 0), solid('#777777')],
      [splitPlateAsset({ colors: ['W'] }, 'eighth', false, 0), solid('#ff0000')],
      [splitPlateAsset({ colors: ['U'] }, 'eighth', false, 0), solid('#00ff00')],
      [splitBlendMask(false, 0), mask],
    ]);
    const merged = splitPlateImage(pair, 'eighth', false, 0, materials),
      mc = merged.getContext('2d');
    const materialPixels = [
      mc.getImageData(0, 0, 1, 1),
      mc.getImageData(3, 10, 1, 1),
      mc.getImageData(16, 10, 1, 1),
    ].map((x) => Array.from(x.data));
    const reused = merged === splitPlateImage(pair, 'eighth', false, 0, materials);
    const watermarkCanvas = solid('#000');
    watermarkCanvas.width = 350;
    watermarkCanvas.height = 480;
    const wc = watermarkCanvas.getContext('2d'),
      watermarkFace = { watermark: 'boros' };
    paintSplitWatermark(
      wc,
      watermarkFace,
      new Map([[splitWatermark(watermarkFace), solid('#000')]]),
      350,
    );
    const watermarkAlpha = [
      wc.getImageData(160, 350, 1, 1).data[3],
      wc.getImageData(190, 350, 1, 1).data[3],
    ];
    const monoWatermarks = ['U', 'R'].map((color) => {
      wc.clearRect(0, 0, 350, 480);
      const face = { watermark: 'izzet', colors: [color] };
      paintSplitWatermark(wc, face, new Map([[splitWatermark(face), solid('#000')]]), 350);
      return [160, 190].map((x) => Array.from(wc.getImageData(x, 350, 1, 1).data));
    });
    const sharedGuild = (left, right, guild) =>
      splitPanels({
        layout: 'split',
        faces: [
          { name: 'Left', typeLine: 'Instant', colors: left, watermark: guild },
          { name: 'Right', typeLine: 'Instant', colors: right, watermark: null },
        ],
      }).map((p) => p.face.watermark);
    const { modernSplitAssets, modernSplitPlate, modernSplitImage, HYBRID_SPLIT_LABELS } =
      await import('/games/magic/src/presentation/split-modern-frame.ts');
    const large = (color, width = 488, height = 680) => {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      c.getContext('2d').fillStyle = color;
      c.getContext('2d').fillRect(0, 0, width, height);
      return c;
    };
    const { paintModernSplitFrames } = await import(
      '/games/magic/src/presentation/split-modern-paint.ts'
    );
    const fuseFace = {
      layout: 'split',
      faces: [
        { name: 'Left', typeLine: 'Instant', colors: ['U'] },
        { name: 'Right', typeLine: 'Instant', colors: ['R'], rulesText: 'Fuse (Reminder)' },
      ],
    };
    const fuseCanvas = large('#000'),
      fc = fuseCanvas.getContext('2d');
    paintModernSplitFrames(
      fc,
      fuseFace,
      new Map(
        splitPanels(fuseFace).map((p, i) => [
          modernSplitPlate(p.face),
          large(i ? '#ff0000' : '#0000ff'),
        ]),
      ),
    );
    const bridgePixels = [
      [450, 290],
      [450, 324],
      [450, 360],
      [400, 323],
      [400, 325],
    ].map(([x, y]) => Array.from(fc.getImageData(x, y, 1, 1).data));
    const gold = { colors: ['W', 'U'], layout: 'split-m15', manaSymbols: ['W', 'U'] },
      hybrid = { ...gold, manaSymbols: ['W/U'] },
      modernAssets = new Map([
        [modernSplitPlate(gold), large('#cccc00')],
        [modernSplitPlate({ ...gold, colors: ['W'] }), large('#ff0000')],
        [modernSplitPlate({ ...gold, colors: ['U'] }), large('#0000ff')],
        ...HYBRID_SPLIT_LABELS.map((u) => [u, large('#888888', 482, 345)]),
      ]);
    const goldImage = modernSplitImage(gold, modernAssets),
      hybridImage = modernSplitImage(hybrid, modernAssets),
      sampleMaterial = (im, x, y) =>
        Array.from(im.getContext('2d').getImageData(y, 680 - x, 1, 1).data),
      modernPixels = [
        sampleMaterial(goldImage, 100, 25),
        sampleMaterial(goldImage, 100, 50),
        sampleMaterial(goldImage, 65, 150),
        sampleMaterial(goldImage, 320, 150),
        sampleMaterial(hybridImage, 100, 25),
        sampleMaterial(hybridImage, 100, 50),
        sampleMaterial(hybridImage, 320, 280),
      ],
      modernReuse = goldImage === modernSplitImage(gold, modernAssets);
    modernAssets.set(modernSplitPlate({ ...gold, colors: ['W'] }), large('#00ff00'));
    const modernInvalidation = goldImage !== modernSplitImage(gold, modernAssets);
    let modernMissing = false;
    modernAssets.delete(HYBRID_SPLIT_LABELS[0]);
    try {
      modernSplitImage(hybrid, modernAssets);
    } catch {
      modernMissing = true;
    }
    return {
      modernPixels,
      modernReuse,
      modernInvalidation,
      modernMissing,
      fuseAssets: modernSplitAssets({ ...gold, layout: 'split-m15-fuse' }),
      materialPixels,
      reused,
      watermarkAlpha,
      monoWatermarks,
      sharedWatermarks: [
        sharedGuild(['U'], ['R'], 'izzet'),
        sharedGuild(['W', 'U'], ['W', 'U'], 'azorius'),
        sharedGuild(['G', 'U'], ['W', 'U'], 'simic'),
      ],
      bridgePixels,
      output,
      room: nativeSplitEra({
        layout: 'split',
        setCode: 'dgm',
        faces: [{ typeLine: 'Enchantment — Room' }, { typeLine: 'Enchantment — Room' }],
      }),
      modern: nativeSplitEra({
        layout: 'split',
        setCode: 'rna',
        faces: [{ typeLine: 'Instant' }, { typeLine: 'Sorcery' }],
      }),
    };
  });
  for (const r of results.output) {
    assert.deepEqual(r.full, [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
    ]);
    assert.deepEqual(r.printing, [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    assert.deepEqual(r.windows, r.recipeWindows);
    assert.deepEqual(r.windows, r.edgeWindows);
    assert.deepEqual(r.rotations, [-90, -90]);
    assert.ok(
      r.assets.filter((a) => a?.includes('.mse-style/') || a?.includes('/m15/split/')).length >= 2,
    );
    assert.ok(r.watermarkKey && r.reminderKey && r.missing && r.overflow);
    if (r.fuse) assert.equal(r.paragraphCount, 1);
  }
  assert.deepEqual(
    results.materialPixels,
    [
      [119, 119, 119, 255],
      [255, 0, 0, 255],
      [0, 255, 0, 255],
    ],
    'Only masked pinlines/paper receive two-color materials',
  );
  assert.ok(results.reused);
  assert.deepEqual(
    results.modernPixels,
    [
      [204, 204, 0, 255],
      [204, 204, 0, 255],
      [255, 0, 0, 255],
      [0, 0, 255, 255],
      [255, 0, 0, 255],
      [136, 136, 136, 255],
      [136, 136, 136, 255],
    ],
    'Gold/hybrid split labels and colored pinlines retain separate source materials',
  );
  assert.ok(results.modernReuse && results.modernInvalidation && results.modernMissing);
  assert.ok(results.fuseAssets.every((url) => url.includes('/split/fuse/')));
  assert.ok(
    results.watermarkAlpha.every((x) => x > 50),
    'Both watermark halves survive source-in tinting',
  );
  assert.deepEqual(results.sharedWatermarks, [
    ['izzet', 'izzet'],
    ['azorius', 'azorius'],
    ['simic', null],
  ]);
  for (const halves of results.monoWatermarks) assert.deepEqual(halves[0], halves[1]);
  assert.notDeepEqual(results.monoWatermarks[0][0], results.monoWatermarks[1][0]);
  const [right, middle, left, aboveRight, aboveLeft] = results.bridgePixels;
  assert.deepEqual(right, [255, 0, 0, 255]);
  assert.deepEqual(left, [0, 0, 255, 255]);
  assert.ok(middle[0] > 90 && middle[0] < 165 && middle[2] > 90 && middle[2] < 165);
  assert.deepEqual(aboveRight, right, 'Separate rules panels must retain their own colors');
  assert.deepEqual(aboveLeft, left);
  assert.equal(results.room, null);
  assert.equal(results.modern, 'm15');
  console.log(
    'Old/2003/M15/Fuse split artwork, materials, printing, geometry and cache invalidation pass',
  );
} finally {
  await browser.close();
  await server.close();
}

const { splitFooterInput } = await import('../games/magic/tools/accuracy/split-footer-input.mjs');
const legal = (
  await import('../games/magic/fixtures/accuracy/split-legal-text.json', { with: { type: 'json' } })
).default;
for (const [id, row] of Object.entries(legal.printings)) {
  const result = splitFooterInput({ id, set: row.set }, { sha256: row.referenceSha256 }, '9999');
  assert.equal(result.legalText, row.legalText);
  assert.equal(result.footerSource, 'scan-transcription');
  assert.throws(
    () => splitFooterInput({ id, set: row.set }, { sha256: 'stale' }, '2001'),
    /does not match/,
  );
}
assert.equal(
  splitFooterInput({ id: 'unreviewed', set: 'apc' }, {}, '2001').footerSource,
  'unverified-release-year-template',
);
