import assert from 'node:assert/strict';
import { createDataFixtureServer } from './magic-vite.mjs';
import { createServer as createHttpServer } from 'node:http';
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { checkSetProfile } from '../games/magic/tools/accuracy/set-profile-check.mjs';
const server = await createDataFixtureServer(`
 const profile=data.tables.setCalibrationProfiles?.['4ed'];
 if(profile){
   profile.frames.R.stockMaskFrame=[-.002,-.001,1.004,1.003];
   profile.mana.sourceInk={R:{family:'mse-old',pixels:.4,paperSample:'opaque-percentile'},G:{family:'mse-old',pixels:.2,paperSample:'opaque-percentile'}};
 }
 const fem=data.tables.setCalibrationProfiles?.fem;
 if(fem){fem.frames.R.family='abu';fem.frames.R.stockMaskFrame=[-.002,-.001,1.004,1.003];}
 const chr=data.tables.setCalibrationProfiles?.chr;
 if(chr)chr.frames['L-U']={...chr.frames.L,family:'abu',assetKey:'ul'};
`);
try {
  const frame = await server.ssrLoadModule('/games/magic/src/presentation/early-reprint-frame.ts');
  const mana = await server.ssrLoadModule('/games/magic/src/presentation/historical-mana.ts');
  const api = await server.ssrLoadModule('/games/magic/src/calibration/editor.ts');
  const { retroAssets, retroBorderMask } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const f = {
    name: 'Probe',
    setCode: '4ed',
    colors: ['R'],
    typeLine: 'Instant',
    wordingMode: 'original',
    borderColor: 'white',
  };
  assert.deepEqual(frame.earlyReprintFrame(f).stockMaskFrame, [-0.002, -0.001, 1.004, 1.003]);
  assert(retroAssets(f).includes(retroBorderMask(f)));
  assert.equal(mana.historicalManaAsset(f, 'R').inkExpansion, 0.4);
  assert.equal(mana.historicalManaPaperSample(f, 'R'), 'opaque-percentile');
  assert.equal(
    mana.historicalManaAsset(f, 'G').inkExpansion,
    undefined,
    'A different source family must not inherit the fitted weight',
  );
  assert.equal(mana.historicalManaPaperSample(f, 'G'), undefined);
  for (const face of [
    { ...f, symbolStyle: 'modern' },
    { ...f, wordingMode: 'oracle' },
    { ...f, frameStyle: 'modern' },
    { ...f, borderColor: 'black' },
    { ...f, frameAssetFamily: 'abu' },
    { ...f, layout: 'adventure' },
  ]) {
    assert.equal(mana.historicalManaAsset(face, 'R')?.inkExpansion, undefined);
    assert.equal(mana.historicalManaPaperSample(face, 'R'), undefined);
  }
  assert.equal(
    mana.historicalManaAsset({ ...f, wordingMode: 'oracle', symbolStyle: 'original' }, 'R')
      .inkExpansion,
    0.4,
  );
  const { setCalibrationProfiles } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  const { review } = await server.ssrLoadModule('/games/magic/src/calibration/sets/4ed.ts');
  const manifest = JSON.parse(await readFile('games/magic/assets.json'));
  const profile = setCalibrationProfiles['4ed'];
  checkSetProfile(profile, review, manifest);
  for (const patch of [
    { sourceInk: { R: { family: 'modern', pixels: 0.4 } } },
    { sourceInk: { X: { family: 'mse-old', pixels: 0.4 } } },
    { sourceInk: { R: { family: 'mse-old', pixels: -1 } } },
    { sourceInk: { R: { family: 'mse-old', pixels: 1.1 } } },
    { sourceInk: { R: { family: 'mse-old', pixels: NaN } } },
    { sourceInk: { R: { family: 'mse-old', pixels: 0.4, paperSample: 'unknown' } } },
  ]) {
    const invalid = structuredClone(profile);
    Object.assign(invalid.mana, patch);
    assert.throws(() => checkSetProfile(invalid, review, manifest));
  }
  const invalidMask = structuredClone(profile);
  invalidMask.frames.R.stockMaskFrame = [0, 0, 0, 1];
  assert.throws(() => checkSetProfile(invalidMask, review, manifest));
  const d = api.describeSetCalibration('4ed'),
    ids = new Set(d.controls.map((c) => c.id));
  assert(ids.has('frames.R.stockMaskFrame.0'));
  assert(!ids.has('frames.R.stockWindow.0'));
  assert(ids.has('frames.U.stockWindow.0'));
  assert(!ids.has('frames.U.stockMaskFrame.0'));
  assert(ids.has('mana.sourceInk.R.pixels'));
  assert(!ids.has('mana.sourceInk.R.family'));
  assert(!ids.has('mana.sourceInk.R.paperSample'));
  const candidate = api.createSetCalibrationCandidate('4ed', d.revision, {
    'frames.R.stockMaskFrame.0': -0.004,
    'mana.sourceInk.R.pixels': 0.2,
  });
  const edited = api.exportSetCalibrationProfile(candidate);
  assert.equal(edited.frames.R.stockMaskFrame[0], -0.004);
  assert.equal(edited.mana.sourceInk.R.pixels, 0.2);
  assert.equal(edited.mana.sourceInk.R.paperSample, 'opaque-percentile');
  assert.equal(edited.mana.sourceInk.R.family, 'mse-old');
  assert.equal(
    frame.earlyReprintFrame({ ...f, setCalibrationCandidate: candidate }).stockMaskFrame[0],
    -0.004,
  );
  assert.equal(
    mana.historicalManaAsset({ ...f, setCalibrationCandidate: candidate }, 'R').inkExpansion,
    0.2,
  );
  for (const n of [-0.1, 1.1, NaN])
    assert.throws(
      () => api.createSetCalibrationCandidate('4ed', d.revision, { 'mana.sourceInk.R.pixels': n }),
      /Invalid/,
    );
  const land = { name: 'Island', setCode: 'chr', typeLine: 'Land', land: true, frameColors: ['U'] };
  assert.equal(frame.earlyReprintFrame(land).material, 'L-U');
  assert.equal(
    frame.earlyReprintFrame({
      ...land,
      name: 'Probe',
      typeLine: 'Basic Land — Island',
      wordingMode: 'oracle',
    }).asset,
    frame.earlyReprintFrame(land).asset,
  );
  assert.equal(frame.earlyReprintFrame({ ...land, frameColors: ['U', 'B'] }), undefined);
  assert.equal(
    frame.earlyReprintFrame({ ...land, frameColors: ['R'] }),
    undefined,
    'Missing per-color profiles must not fall back to a different plate',
  );
  const black = { ...f, setCode: 'fem', borderColor: 'black' };
  assert(
    retroAssets(black).includes(retroBorderMask(black)),
    'A mask must be loaded for an otherwise mask-free black ABU plate',
  );
  const http = createHttpServer((req, res) => {
    if (req.url === '/__profile-preparation') {
      res.setHeader('Content-Type', 'text/html');
      res.end('<!doctype html><title>Profile preparation</title>');
    } else
      server.middlewares(req, res, () => {
        res.statusCode = 404;
        res.end();
      });
  });
  await new Promise((resolve) => http.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.route('https://**/*', (route) => route.abort());
    await page.goto(`http://127.0.0.1:${http.address().port}/__profile-preparation`);
    const native = await page.evaluate(async () => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
      const { paintRetroFace } = await import('/games/magic/src/presentation/retro-paint.ts');
      const { paintRetroStockBorder } = await import(
        '/games/magic/src/presentation/retro-stock-border.ts'
      );
      const { retroFrameAsset, retroBorderMask, retroPx, retroStock } = await import(
        '/games/magic/src/presentation/retro-frame.ts'
      );
      const { earlyReprintFrame } = await import(
        '/games/magic/src/presentation/early-reprint-frame.ts'
      );
      const { describeSetCalibration, createSetCalibrationCandidate } = await import(
        '/games/magic/src/calibration/editor.ts'
      );
      const make = (w, h) =>
        Object.assign(document.createElement('canvas'), { width: w, height: h });
      const source = make(732, 1020),
        sc = source.getContext('2d');
      sc.fillStyle = '#578760';
      sc.fillRect(0, 0, 732, 1020);
      const mask = make(732, 1020),
        mc = mask.getContext('2d');
      mc.fillRect(0, 0, 732, 1020);
      mc.globalCompositeOperation = 'destination-out';
      mc.beginPath();
      mc.roundRect(40, 38, 652, 944, 36);
      mc.fill();
      const face = {
        name: '',
        setCode: '4ed',
        colors: ['R'],
        typeLine: '',
        rulesText: '',
        legalText: '',
        borderColor: 'white',
        printingElements: { setSymbol: { hidden: true } },
      };
      const d = describeSetCalibration('4ed'),
        candidate = createSetCalibrationCandidate('4ed', d.revision, {
          'frames.R.stockMaskFrame.0': 0.008,
        });
      const rows = [];
      for (const width of [244, 732]) {
        const rasters = [];
        for (const f of [face, { ...face, setCalibrationCandidate: candidate }]) {
          const profile = earlyReprintFrame(f),
            images = new Map([
              [retroFrameAsset(f), source],
              [retroBorderMask(f), mask],
            ]);
          const c = make(width, Math.round((width * 680) / 488)),
            ctx = c.getContext('2d', { willReadFrequently: true });
          ctx.scale(width / 488, width / 488);
          paintRetroFace(ctx, f, images);
          const expected = make(c.width, c.height),
            e = expected.getContext('2d', { willReadFrequently: true });
          e.scale(width / 488, width / 488);
          e.fillStyle = retroStock(f);
          e.fillRect(0, 0, 488, 680);
          e.drawImage(source, ...retroPx(profile.frame));
          paintRetroStockBorder(e, mask, retroPx(profile.stockMaskFrame), retroStock(f));
          const actual = ctx.getImageData(0, 0, c.width, c.height).data,
            control = e.getImageData(0, 0, c.width, c.height).data;
          let max = 0;
          for (let i = 0; i < actual.length; i++)
            max = Math.max(max, Math.abs(actual[i] - control[i]));
          if (max !== 0)
            throw Error(
              'Native stock-mask placement disagrees with direct source composition: ' + max,
            );
          rasters.push(actual);
        }
        let changed = 0;
        for (let i = 0; i < rasters[0].length; i += 4)
          if ([0, 1, 2, 3].some((k) => rasters[0][i + k] !== rasters[1][i + k])) changed++;
        if (!changed) throw Error('Stock-mask edit has no native effect');
        rows.push({ width, maximumError: 0, changed });
      }
      const images = new Map([[retroFrameAsset(face), source]]),
        c = make(488, 680);
      let message = '';
      try {
        paintRetroFace(c.getContext('2d'), face, images);
      } catch (e) {
        message = e.message;
      }
      if (!message.includes('stock mask is unavailable'))
        throw Error('Missing mask must fail explicitly');
      return rows;
    });
    assert.equal(native.length, 2);
    assert(native.every((r) => r.maximumError === 0 && r.changed > 0));
  } finally {
    await browser.close();
    await new Promise((resolve, reject) =>
      http.close((error) => (error ? reject(error) : resolve())),
    );
  }
  console.log(
    'Profile preparation: independent stock-mask controls, source-bound ink/sampler, host opt-outs, original/Oracle symbol choice, export and data-driven land plates pass.',
  );
} finally {
  await server.close();
}
