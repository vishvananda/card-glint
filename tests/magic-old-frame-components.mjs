import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'optional-old-frame-components',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('/calibration/profiles.ts')) return;
        const needle =
          'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
        assert.equal(code.split(needle).length, 2);
        return code.replace(
          needle,
          'return (globalThis as any).__componentProfile?.set === set ? (globalThis as any).__componentProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;',
        );
      },
    },
  ],
});
let browser;
try {
  server.middlewares.use((req, res, next) => {
    if (req.url !== '/__components') return next();
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><title>Old frame component contracts</title>');
  });
  await server.listen();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto('http://127.0.0.1:' + server.httpServer.address().port + '/__components');
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { profile: base } = await import('/games/magic/src/calibration/sets/4ed.ts');
    const { placeCalibrationRules } = await import(
      '/games/magic/src/calibration/rules-adjustment.ts'
    );
    const { simpleBasicMana } = await import('/games/magic/src/presentation/retro-basic.ts');
    const { earlyReprintFrame } = await import(
      '/games/magic/src/presentation/early-reprint-frame.ts'
    );
    const { paintEarlyReprintFooter, earlyReprintFooter } = await import(
      '/games/magic/src/presentation/early-reprint-footer.ts'
    );
    const { framePaperMask } = await import('/games/magic/src/presentation/frame-paper-mask.ts');
    const { calibrationControls } = await import('/games/magic/src/calibration/editor-controls.ts');

    const check = (v, m) => {
      if (!v) throw Error(m);
    };
    const equal = (a, b, m) => check(JSON.stringify(a) === JSON.stringify(b), m);
    const layout = {
      size: 22,
      x: 60,
      top: 430,
      width: 360,
      height: 120,
      overflow: false,
      lines: [450, 478, 520].map((baseline, i) => ({
        x: i === 1 ? 90 : undefined,
        runs: [{ text: 'same row ' + i }],
        width: 100,
        baseline,
        role: i === 2 ? 'flavor' : 'rules',
        inkBounds: [60, baseline - 20, 100, 22],
      })),
      separators: [500],
    };
    const before = JSON.stringify(layout),
      spec = {
        baselineScale: 1.04,
        offset: [1, 0],
        verticalLimits: [412, 603],
        maximumHeight: 159,
      };
    const adjusted = placeCalibrationRules(layout, spec);
    check(adjusted !== layout, 'Eligible layout was not placed');
    equal(
      adjusted.lines.map((l) => l.runs),
      layout.lines.map((l) => l.runs),
      'Runs changed',
    );
    equal(
      adjusted.lines.map((l) => l.width),
      layout.lines.map((l) => l.width),
      'Wrap widths changed',
    );
    check(adjusted.size === layout.size, 'Font size changed');
    check(adjusted.x === 61 && adjusted.lines[1].x === 91, 'Line origins did not move together');
    check(
      Math.abs(adjusted.lines[1].baseline - adjusted.lines[0].baseline - 28 * 1.04) < 1e-10,
      'Wrong baseline scale',
    );
    check(
      placeCalibrationRules({ ...layout, height: 174 }, spec).height === 174,
      'Dense layout was changed',
    );
    check(
      placeCalibrationRules(layout, { ...spec, verticalLimits: [449, 470] }) === layout,
      'Overflow did not keep baseline',
    );
    check(placeCalibrationRules(layout) === layout, 'Unset policy lost identity');
    check(JSON.stringify(layout) === before, 'Layout mutated');
    const scaled = placeCalibrationRules(
      { ...layout, horizontalScale: 2 },
      { ...spec, offset: [2, 0] },
    );
    check(scaled.x === 61, 'Canonical horizontal offset was scaled twice');
    for (const bad of [
      { ...spec, baselineScale: NaN },
      { ...spec, offset: [9, 0] },
      { ...spec, verticalLimits: [10, 9] },
    ]) {
      let failed = false;
      try {
        placeCalibrationRules(layout, bad);
      } catch {
        failed = true;
      }
      check(failed, 'Malformed placement accepted');
    }
    const profile = structuredClone(base);
    globalThis.__componentProfile = profile;
    profile.basicSymbol = { originalLetters: true };
    const face = {
      name: 'Forest',
      setCode: '4ed',
      typeLine: 'Land',
      canonicalTypeLine: 'Basic Land — Forest',
      land: true,
      wordingMode: 'original',
      rulesText: 'G',
    };
    check(simpleBasicMana(face) === 'G', 'Original basic letter was not recognized');
    check(simpleBasicMana({ ...face, rulesText: 'B' }) === null, 'Wrong color accepted');
    check(simpleBasicMana({ ...face, name: 'Custom' }) === null, 'Custom land accepted');
    check(
      simpleBasicMana({ ...face, wordingMode: 'oracle' }) === null,
      'Original-only override leaked into Oracle',
    );
    check(
      simpleBasicMana({
        ...face,
        rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Custom rules' }] }],
      }) === null,
      'Explicit paragraph was replaced',
    );
    delete profile.basicSymbol;
    check(simpleBasicMana(face) === null, 'Unset profile changed original letters');
    profile.landMaterials = { 'Test Fetch': 'L-W' };
    check(
      earlyReprintFrame({ ...face, name: 'Test Fetch', rulesText: '' }).material === 'L-W',
      'Named paper class ignored',
    );
    check(
      earlyReprintFrame({ ...face, name: 'Test Fetch', frameColors: ['U'] }).material === 'L-U',
      'Explicit palette did not win',
    );
    profile.frames['L-WU'] = profile.frames['L-W'];
    check(
      earlyReprintFrame({ ...face, name: 'Custom', frameColors: ['U', 'W'] }).material === 'L-WU',
      'Two-color palette did not resolve declared class',
    );
    profile.footer.legal = {
      ...profile.footer.legal,
      x: 244,
      y: 640,
      align: 'center',
      maxWidth: 440,
      collectorTotal: 350,
      defaultText: '™ & © 1993–2002 Wizards of the Coast, Inc.',
      lightMaterials: ['L'],
    };
    profile.rulesPlacement = { default: spec };
    profile.basicSymbol = { originalLetters: true, bounds: [0.3, 0.6, 0.4, 0.2] };
    const controls = calibrationControls(profile);
    check(
      !controls.some((c) => c.id === 'footer.legal.collectorTotal'),
      'Printed total became an adjustment knob',
    );
    check(
      controls.some((c) => c.id === 'rulesPlacement.default.baselineScale'),
      'Placement controls missing',
    );
    check(
      controls.some((c) => c.id === 'basicSymbol.bounds.0'),
      'Basic-symbol controls missing',
    );
    for (const c of controls)
      if (c.kind === 'number')
        check(c.value >= c.min && c.value <= c.max, 'Default outside editor bounds: ' + c.id);
    const footerFace = { ...face, collectorNumber: '345', colorCalibration: 'set-hsb-v1' };
    check(
      earlyReprintFooter(footerFace).legalGray === profile.footer.legal.lightGray,
      'Land legal pigment not selected',
    );
    const calls = [],
      original = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, max) {
      const t = this.getTransform();
      calls.push({ text, x: t.e + t.a * x, y: t.f + t.d * y, scale: t.a, color: this.fillStyle });
      return original.call(this, text, x, y, max);
    };
    function paint(options = {}) {
      calls.length = 0;
      const c = document.createElement('canvas');
      c.width = 488;
      c.height = 680;
      paintEarlyReprintFooter(c.getContext('2d'), { ...footerFace, ...options });
      return structuredClone(calls);
    }
    try {
      const all = paint();
      check(all.length === 2, 'Legal and collector should be separate semantic pieces');
      check(all[1].text === '345/350', 'Wrong printed collector text');
      const hiddenLegal = paint({ printingElements: { legal: { hidden: true } } });
      equal(hiddenLegal, [all[1]], 'Hiding legal text moved or hid collector');
      const hiddenCollector = paint({ printingElements: { collector: { hidden: true } } });
      equal(hiddenCollector, [all[0]], 'Hiding collector moved legal text');
      const moved = paint({ printingElements: { collector: { offset: [2, -1] } } });
      check(
        Math.abs(moved[1].x - all[1].x - 2) < 1e-10 && moved[1].y === all[1].y - 1,
        'Host offset lost canonical units',
      );
      check(paint({ collectorTotal: null })[1].text === '345', 'Null total ignored');
      check(
        paint({ collectorNumber: null }).length === 1,
        'Missing collector created a phantom piece',
      );
      check(
        paint({ legalText: 'Custom legal' })[0].text === 'Custom legal',
        'Host legal override ignored',
      );
    } finally {
      CanvasRenderingContext2D.prototype.fillText = original;
    }
    const image = { width: 100, height: 100, data: new Uint8ClampedArray(40000) },
      mask = framePaperMask(image, { kind: 'linear', rect: [0.1, 0.2, 0.8, 0.6], feather: 0.01 });
    check(mask[50 * 100 + 5] === 0 && mask[5 * 100 + 50] === 0, 'Gradient escaped paper');
    check(
      mask[50 * 100 + 20] < mask[50 * 100 + 50] && mask[50 * 100 + 50] < mask[50 * 100 + 80],
      'Gradient is not continuous across the panel',
    );
    let rejected = false;
    try {
      framePaperMask(image, { kind: 'linear', rect: [0, 0, 0, 1], feather: 0.01 });
    } catch {
      rejected = true;
    }
    check(rejected, 'Invalid paper mask accepted');
    delete globalThis.__componentProfile;
    return {
      retainedRows: adjusted.lines.length,
      footerPieces: 2,
      largeBasicOriginalOnly: true,
      paperGradient: true,
    };
  });
  assert.equal(result.retainedRows, 3);
  console.log('Optional old-frame components preserve wrapping and host overrides:', result);
} finally {
  await browser?.close();
  await server.close();
}
