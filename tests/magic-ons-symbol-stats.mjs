import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
try {
  const { profile } = await server.ssrLoadModule('/games/magic/src/calibration/sets/ons.ts');
  const { earlyCostGenericPaper } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-cost-mana.ts',
  );
  const { earlyReprintManaTarget } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-mana.ts',
  );
  const { describeSetCalibration, createSetCalibrationCandidate, resolveSetCalibrationCandidate } =
    await server.ssrLoadModule('/games/magic/src/calibration/editor.ts');
  const face = {
    name: 'Physical material probe',
    setCode: 'ons',
    colors: ['W'],
    typeLine: 'Creature',
    wordingMode: 'original',
    symbolStyle: 'original',
    colorCalibration: 'set-hsb-v1',
    manaSymbols: ['1', 'X', 'G'],
  };
  assert.equal(profile.revision, 2);
  assert.equal(profile.footer.stats.weight, 700);
  assert.equal(profile.footer.stats.trim, 0);
  assert.equal(profile.footer.stats.size, 28);
  for (const material of ['W', 'U', 'B', 'R', 'G', 'A']) {
    const f = {
      ...face,
      colors: material === 'A' ? [] : [material],
      typeLine: material === 'A' ? 'Artifact' : 'Creature',
    };
    assert.deepEqual(earlyCostGenericPaper(f), profile.mana.costGenericPaper[material]);
    assert.deepEqual(
      earlyCostGenericPaper({ ...f, wordingMode: 'oracle' }),
      profile.mana.costGenericPaper[material],
    );
    assert.deepEqual(
      earlyReprintManaTarget(f, 'N'),
      profile.mana.paper.N,
      'Inline palette remains independent',
    );
  }
  for (const override of [
    { calibration: 'source' },
    { colorCalibration: undefined },
    { symbolStyle: 'modern' },
    { symbolStyle: undefined, wordingMode: 'oracle' },
    { frameStyle: 'modern' },
    { frameTemplate: 'future' },
    { frameAssetFamily: 'eighth' },
    { layout: 'split' },
    { borderColor: 'white' },
    { setCode: 'mir' },
    { setCode: 'ody' },
    { setCode: '7ed' },
  ])
    assert.equal(
      earlyCostGenericPaper({ ...face, ...override }),
      undefined,
      JSON.stringify(override),
    );
  const controls = describeSetCalibration('ons').controls;
  const weight = controls.find((c) => c.id === 'footer.stats.weight');
  assert.equal(weight.value, 700);
  assert.equal(weight.max, 900);
  assert.equal(weight.step, 100);
  assert(controls.some((c) => c.id === 'mana.costGenericPaper.W.2'));
  const edited = resolveSetCalibrationCandidate(
    createSetCalibrationCandidate('ons', 2, {
      'footer.stats.weight': 400,
      'mana.costGenericPaper.W.2': 1,
    }),
  );
  assert.equal(edited.footer.stats.weight, 400);
  assert.equal(edited.mana.costGenericPaper.W[2], 1);
  assert.deepEqual(edited.mana.paper.N, profile.mana.paper.N);
  assert.equal(profile.footer.stats.weight, 700);
  assert.throws(
    () => createSetCalibrationCandidate('ons', 2, { 'footer.stats.weight': 901 }),
    /Invalid calibration value: footer\.stats\.weight/,
  );
  server.middlewares.use((req, res, next) => {
    if (req.url !== '/__ons') return next();
    res.setHeader('Content-Type', 'text/html');
    res.end('<meta charset="utf-8"><title>ONS preparation controls</title>');
  });
  await server.listen();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('https://**/*', (r) => r.abort());
  await page.goto('http://127.0.0.1:' + server.httpServer.address().port + '/__ons');
  const result = await page.evaluate(async (face) => {
    await import('/games/magic/src/data/eager.ts');
    const { prepareManaNumerals } = await import('/games/magic/src/presentation/mana-numeral.ts');
    const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
    const { manaSymbolAsset } = await import('/games/magic/src/presentation/assets.ts');
    const source = document.createElement('canvas');
    source.width = source.height = 8;
    const s = source.getContext('2d');
    s.fillStyle = 'rgb(210,195,180)';
    s.fillRect(0, 0, 8, 8);
    s.fillStyle = '#111';
    s.fillRect(3, 2, 2, 4);
    const bitmap = await createImageBitmap(source);
    const images = new Map(['1', 'X', 'G'].map((key) => [manaSymbolAsset(key), bitmap]));
    const original = CanvasRenderingContext2D.prototype.getImageData;
    let reads = 0;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      reads++;
      return original.apply(this, args);
    };
    const signal = new AbortController().signal;
    let first, second;
    try {
      first = await prepareManaNumerals(face, images, signal);
      const built = reads;
      second = await prepareManaNumerals(face, images, signal);
      const cached = reads;
      const target = document.createElement('canvas');
      target.width = 200;
      target.height = 100;
      const c = target.getContext('2d');
      for (const [i, symbol] of ['1', 'X', 'G'].entries()) {
        paintMana(c, symbol, 10 + i * 30, 10, 24, second.images, false, {
          numberDx: 1,
          numberDy: 0.5,
          numberScale: 0.94,
        });
        paintMana(c, symbol, 10 + i * 30, 50, 24, second.images);
      }
      return {
        built,
        cached,
        paintedReads: reads,
        paper: second.images.manaCostGenericPaper,
        hasX: second.images.manaNumerals.has('X'),
        sameAtlas:
          second.images.manaNumerals.get('1').image === second.images.manaNumerals.get('X').image,
        inlineUnchanged: !second.images.manaRulesNumeral,
      };
    } finally {
      first?.dispose();
      second?.dispose();
      CanvasRenderingContext2D.prototype.getImageData = original;
      bitmap.close();
      source.width = source.height = 0;
    }
  }, face);
  assert(result.built > 0);
  assert.equal(result.cached, result.built);
  assert.equal(result.paintedReads, result.cached);
  assert.equal(result.paper, 'rgb(191,173,167)');
  assert.equal(result.hasX, true);
  assert.equal(result.sameAtlas, true);
  assert.equal(result.inlineUnchanged, true);
  assert.deepEqual(errors, []);
  console.log(
    'ONS: physical-material cost-only paper, numeric/X atlas sharing, source/modern/custom/inherited exclusions, inline palette isolation, bounded stats-weight controls and zero warm-preparation/painting readbacks pass.',
  );
} finally {
  await browser?.close();
  await server.close();
}
