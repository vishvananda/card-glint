import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import {
  printingPresets,
  printingPresetCompatibility,
  printingElementSupport,
  resolvePrintingPreset,
  resolveScryfallPrinting,
} from '../dist/lib/magic.js';

const source = {
  name: 'Remembered Horizon',
  typeLine: 'Creature — Spirit',
  rulesText: 'Flying',
  colors: ['U'],
  manaSymbols: ['2', 'U'],
  artist: 'A. Painter',
  collectorNumber: '42',
  setCode: 'FUT',
  frameTemplate: 'future',
  futureTreatment: 'regular',
  setSymbol: '/original.svg',
  symbolAdjustment: { set: { offset: [2, 3] } },
  legalText: 'Original notice',
  collectorLanguage: 'DE',
  securityStamp: 'oval',
};
const original = structuredClone(source);
assert.ok(Object.isFrozen(printingPresets));
assert.ok(printingPresets.every(Object.isFrozen));
assert.equal(new Set(printingPresets.map((p) => p.id)).size, printingPresets.length);
for (const p of printingPresets) {
  assert.ok(printingPresetCompatibility(source, p.id).supported, p.id);
  const face = resolvePrintingPreset(source, { preset: p.id });
  assert.equal(face.name, source.name);
  assert.equal(face.artist, source.artist);
  if (p.id !== 'match') {
    assert.equal(face.setCode, p.setCode);
    assert.equal(face.setSymbol, undefined);
    assert.equal(face.symbolAdjustment, undefined);
    assert.equal(face.legalText, undefined);
    assert.equal(face.collectorLanguage, undefined);
    assert.equal(face.symbolStyle, 'original');
    if (p.family !== 'future') assert.equal(face.frameTemplate, undefined);
  }
}
assert.deepEqual(source, original, 'Preset resolution must not mutate source data');
assert.deepEqual(resolvePrintingPreset(source, { preset: 'match' }), source);
const old = resolvePrintingPreset(source, { preset: 'lea', overrides: { artist: undefined } });
assert.equal(old.artist, source.artist, 'Undefined means follow the source/preset');
assert.equal(old.frameStyle, 'retro');
assert.equal(old.securityStamp, 'none');
const shifted = resolvePrintingPreset(source, { preset: 'plc-colorshifted' });
assert.equal(shifted.frameTreatment, 'colorshifted');
assert.equal(shifted.frameAssetFamily, 'eighth');
assert.equal(shifted.frameTemplate, undefined);
for (const face of [
  { ...source, typeLine: 'Land' },
  { ...source, colors: ['U', 'R'] },
]) {
  assert.equal(printingPresetCompatibility(face, 'plc-colorshifted').supported, false);
  assert.throws(() => resolvePrintingPreset(face, { preset: 'plc-colorshifted' }), /monocolored/);
}
assert.ok(
  printingPresetCompatibility({ ...source, typeLine: 'Artifact', colors: [] }, 'plc-colorshifted')
    .supported,
);
const overrides = {
  artist: 'New Artist',
  legalText: null,
  collectorNumber: 'P-7',
  collectorLanguage: 'FR',
  collectorSetCode: 'DEMO',
  elements: { artist: { offset: [6, -2] }, manaCost: { hidden: true } },
};
const custom = resolvePrintingPreset(source, { preset: 'm21', overrides });
assert.equal(custom.artist, 'New Artist');
assert.equal(custom.collectorNumber, 'P-7');
assert.equal(custom.collectorTotal, null);
assert.equal(custom.legalText, null);
custom.printingElements.artist.offset[0] = 50;
assert.equal(overrides.elements.artist.offset[0], 6, 'Resolver must own its override copy');
const hidden = resolvePrintingPreset(source, {
  preset: 'm21',
  overrides: { setSymbol: null, collectorNumber: null, artist: null },
});
assert.equal(hidden.printingElements.setSymbol.hidden, true);
assert.equal(hidden.printingElements.collector.hidden, true);
assert.equal(hidden.artist, null);
assert.equal(
  resolvePrintingPreset(source, { preset: 'm21' }).printingElements,
  undefined,
  'Reset by omitting overrides',
);
for (const bad of [
  { unknown: true },
  { elements: { wrong: { hidden: true } } },
  { elements: { artist: [] } },
  { elements: [] },
  { elements: null },
  { elements: { legal: { offset: [0, 101] } } },
  { elements: { artist: { offset: [NaN, 0] } } },
  { elements: { artist: { hidden: 'yes' } } },
  { collectorTotal: 0 },
  { collectorLanguage: 'EN-US' },
  { collectorSetCode: 'bad code' },
  { collectorSetCode: 42 },
  { symbolStyle: 'future' },
  { borderColor: 'gold' },
  { securityStamp: 'invalid' },
  { artist: 42 },
  { collectorFormat: 'bad' },
])
  assert.throws(
    () => resolvePrintingPreset(source, { preset: 'm21', overrides: bad }),
    JSON.stringify(bad),
  );
assert.throws(() => resolvePrintingPreset(source, { preset: 'missing' }), /Unknown/);
const split = {
  ...source,
  layout: 'split',
  frameTemplate: undefined,
  faces: [
    { ...source, typeLine: 'Instant' },
    { ...source, typeLine: 'Sorcery' },
  ],
};
for (const preset of ['7ed', '8ed', 'm21']) {
  const face = resolvePrintingPreset(split, { preset });
  assert.equal(face.faces.length, 2);
  assert.equal(face.faces[0].setCode, face.setCode);
  assert.equal(face.faces[0].layout, 'normal');
}
assert.equal(printingPresetCompatibility(split, 'fut').supported, false);
assert.throws(
  () =>
    resolvePrintingPreset(split, {
      preset: 'm21',
      overrides: { elements: { artist: { hidden: true } } },
    }),
  /composite/,
);
assert.equal(printingElementSupport(split).supported, false);
assert.equal(
  printingPresetCompatibility({ ...source, typeLine: 'Planeswalker — Probe' }, 'lea').supported,
  false,
);
const side = resolvePrintingPreset(
  { ...source, layout: 'transform' },
  { preset: 'lea', overrides: { elements: { legal: { hidden: true } } } },
);
assert.equal(side.layout, 'normal', 'Resolve a physical side independently of its source layout');
assert.equal(printingElementSupport(side).supported, true);
assert.deepEqual(resolveScryfallPrinting({ set: 'fut', frame: 'future' }), {
  setCode: 'FUT',
  symbolStyle: 'original',
  frameTemplate: 'future',
  securityStamp: 'none',
});
assert.equal(
  resolveScryfallPrinting({ set: 'plc', frame: '2003' }).frameTreatment,
  undefined,
  'Mixed sets cannot imply treatment',
);
assert.equal(
  resolveScryfallPrinting({ set: 'plc', frame: '2003', frame_effects: ['colorshifted'] })
    .frameTreatment,
  'colorshifted',
);
assert.equal(resolveScryfallPrinting({ set: 'fut', frame: '2003' }).frameTemplate, undefined);
assert.equal(
  resolveScryfallPrinting({ frame: 'future', textless: true }).futureTreatment,
  'full-art',
);
assert.equal(resolveScryfallPrinting({ frame: '1993', border_color: 'white' }).frameStyle, 'retro');
assert.equal(
  resolveScryfallPrinting({ frame: '2015', security_stamp: 'oval' }).securityStamp,
  'oval',
);

const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (r) => r.abort());
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  const result = await page.evaluate(async () => {
    const { paintPrintingElement } = await import(
      '/games/magic/src/presentation/printing-elements.ts'
    );
    const { paintModernFooter } = await import('/games/magic/src/presentation/modern-footer.ts');
    const { paintUrzaFooter } = await import('/games/magic/src/presentation/retro-urza-footer.ts');
    const { paintLegendsFooter } = await import('/games/magic/src/presentation/legends-footer.ts');
    const { paintPrintingLegendsFooter } = await import(
      '/games/magic/src/presentation/printing-legends-footer.ts'
    );
    const { paintEighthFooter } = await import('/games/magic/src/presentation/eighth-footer.ts');
    const { printingCollectorText } = await import(
      '/games/magic/src/presentation/printing-footer.ts'
    );
    const { cardTextureKey } = await import('/games/magic/src/presentation/canvas-face.ts');
    const { faceSetSymbol } = await import('/games/magic/src/presentation/assets.ts');
    const canvas = document.createElement('canvas');
    canvas.width = 488;
    canvas.height = 680;
    const c = canvas.getContext('2d'),
      trace = [];
    const fill = c.fillText.bind(c);
    c.fillText = (text, x, y, ...rest) => {
      const p = new DOMPoint(x, y).matrixTransform(c.getTransform());
      trace.push({ text, font: c.font, color: c.fillStyle, x: p.x, y: p.y });
      fill(text, x, y, ...rest);
    };
    const face = {
      name: 'Probe',
      typeLine: 'Creature',
      colors: ['U'],
      artist: 'A. Painter',
      collectorNumber: '42',
      setCode: 'M21',
    };
    const footer = (input) => {
      trace.length = 0;
      paintModernFooter(c, input);
      return structuredClone(trace);
    };
    const baseline = footer(face),
      empty = footer({ ...face, printingElements: {} });
    const moved = footer({
      ...face,
      printingElements: { artist: { offset: [11, -7] }, legal: { offset: [-4, -3] } },
    });
    const hidden = footer({
      ...face,
      printingElements: {
        artist: { hidden: true },
        collector: { hidden: true },
        legal: { hidden: true },
      },
    });
    const texts = footer({
      ...face,
      collectorSetCode: 'TEST',
      collectorLanguage: 'FR',
      collectorNumber: '77',
      collectorTotal: 100,
    });
    const key = (f, layer = 'face') =>
      cardTextureKey({ face: f, layer, printingId: null, printedImage: null }, 'inspect');
    const afterError = c.getTransform().toString();
    let threw = false;
    try {
      paintPrintingElement(
        c,
        { ...face, printingElements: { artist: { offset: [20, 20] } } },
        'artist',
        () => {
          throw Error('stop');
        },
      );
    } catch {
      threw = true;
    }
    const restored = afterError === c.getTransform().toString();
    trace.length = 0;
    const eighth = {
      ...face,
      setCode: 'PLC',
      frameAssetFamily: 'eighth',
      artist: null,
      legalText: 'A very long notice '.repeat(30),
      collectorNumber: '42',
    };
    paintEighthFooter(c, eighth, new Map());
    const combined = structuredClone(trace);
    trace.length = 0;
    paintEighthFooter(
      c,
      {
        ...eighth,
        printingElements: { legal: { offset: [20, 3] }, collector: { offset: [0, 0] } },
      },
      new Map(),
    );
    const separate = structuredClone(trace);
    trace.length = 0;
    paintUrzaFooter(c, {
      ...face,
      setCode: 'USG',
      printingElements: { artist: { hidden: true }, legal: { hidden: true } },
    });
    const urzaHidden = structuredClone(trace);
    c.clearRect(0, 0, 488, 680);
    paintPrintingLegendsFooter(c, {
      ...face,
      setCode: 'LEG',
      printingElements: { artist: { hidden: true } },
    });
    const legendsHiddenInk = c.getImageData(0, 0, 488, 680).data.some((v) => v !== 0);
    const legendsFace = { ...face, setCode: 'LEG', power: '2', toughness: '3' };
    c.clearRect(0, 0, 488, 680);
    paintLegendsFooter(c, legendsFace);
    const nativePixels = c.getImageData(0, 0, 488, 680).data;
    c.clearRect(0, 0, 488, 680);
    paintPrintingLegendsFooter(c, {
      ...legendsFace,
      printingElements: { artist: { hidden: false } },
    });
    const controlledPixels = c.getImageData(0, 0, 488, 680).data;
    const legendsEqual = nativePixels.every((v, i) => v === controlledPixels[i]);
    return {
      legendsEqual,
      urzaHidden,
      legendsHiddenInk,
      baseline,
      empty,
      moved,
      hidden,
      texts,
      threw,
      restored,
      combined,
      separate,
      serial: printingCollectorText({ ...face, collectorNumber: '42', collectorTotal: null }),
      noSymbol: faceSetSymbol({ ...face, printingElements: { setSymbol: { hidden: true } } }),
      keys: {
        plain: key(face),
        moved: key({ ...face, printingElements: { artist: { offset: [11, 0] } } }),
        total: key({ ...face, collectorTotal: 300 }),
        lang: key({ ...face, collectorLanguage: 'FR' }),
        mask: key(face, 'etching'),
        movedMask: key({ ...face, printingElements: { artist: { offset: [11, 0] } } }, 'etching'),
        hiddenMask: key({ ...face, printingElements: { setSymbol: { hidden: true } } }, 'etching'),
      },
    };
  });
  assert.ok(result.urzaHidden.some((x) => x.text === '42/350'));
  assert.ok(
    !result.urzaHidden.some((x) => x.text.includes('Painter') || x.text.includes('Wizards')),
  );
  assert.equal(result.legendsHiddenInk, false);
  assert.ok(result.legendsEqual, 'Explicit visible credit retains native Legends pixels');
  assert.deepEqual(result.baseline, result.empty, 'Default rendering remains identical');
  for (const text of ['A. Painter', 'a']) {
    const before = result.baseline.find((x) => x.text === text),
      after = result.moved.find((x) => x.text === text);
    assert.equal(after.x - before.x, 11);
    assert.equal(after.y - before.y, -7);
    assert.equal(after.font, before.font);
    assert.equal(after.color, before.color);
  }
  assert.ok(
    result.hidden.every((x) => x.text === ''),
    'Hidden groups must not emit visible footer text',
  );
  assert.ok(result.texts.some((x) => x.text === '077/100 C'));
  assert.ok(result.texts.some((x) => x.text === 'TEST • FR'));
  assert.equal(result.serial, '042 C');
  assert.equal(result.noSymbol, null);
  assert.ok(result.threw && result.restored, 'Painter state survives callback errors');
  assert.equal(
    result.separate[0].x - result.combined[0].x,
    20,
    'Offset must not shrink with long-line fitting',
  );
  assert.equal(result.separate[0].y - result.combined[0].y, 3);
  assert.notEqual(result.keys.plain, result.keys.moved);
  assert.notEqual(result.keys.plain, result.keys.total);
  assert.notEqual(result.keys.plain, result.keys.lang);
  assert.equal(result.keys.mask, result.keys.movedMask, 'Moving credits reuses art etching');
  assert.notEqual(result.keys.mask, result.keys.hiddenMask);
  console.log(
    'Printing presets: public resolver, source preservation, metadata detection, compatible splits, validation, native footer styles/offsets/visibility, and cache separation pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
