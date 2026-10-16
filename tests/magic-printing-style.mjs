import assert from 'node:assert/strict';
import {
  printingStyles,
  magic,
  faceRects,
  resolveCardProfile,
  printingStyleApiVersion,
  validatePrintingStyle,
  composePrintingSelection,
  resolvePrintingStyle,
  printingStyleOptions,
  resolvePrintingPreset,
} from '../dist/lib/magic.js';
const source = {
  name: 'Style Probe',
  typeLine: 'Creature — Wizard',
  colors: ['U'],
  manaSymbols: ['2', 'U'],
  rulesText: 'Flying',
  artist: 'Artist',
  setCode: 'M21',
  rarity: 'rare',
};
const style = {
  version: 1,
  id: 'mixed',
  label: 'Mixed-frame set',
  collectorSetCode: 'MIX',
  symbols: { default: '/common.svg', rare: '/rare.svg', mythic: null },
  defaultFrame: 'regular',
  defaults: {
    overrides: {
      legalText: 'Custom notice',
      elements: { artist: { offset: [4, -2], hidden: false } },
      symbolAdjustment: { set: { scaleX: 0.9 } },
    },
  },
  frames: [
    { id: 'regular', label: 'Regular', selection: { preset: 'plc' } },
    { id: 'future', label: 'Futureshifted', selection: { preset: 'fut' } },
    { id: 'shifted', label: 'Colorshifted', selection: { preset: 'plc-colorshifted' } },
  ],
  rules: [
    { id: 'artifact-first', when: { artifact: true }, frame: 'regular' },
    {
      id: 'blue',
      when: { colors: ['U'] },
      frame: 'future',
      defaults: { overrides: { collectorLanguage: 'FR' } },
    },
    { id: 'red', when: { colors: ['R'] }, frame: 'shifted' },
    { id: 'two-colors', when: { colorCount: [2, 5] }, frame: 'regular' },
  ],
};
const original = structuredClone(source),
  definition = structuredClone(style);
assert.equal(printingStyleApiVersion, 1);
assert.equal(printingStyles.filter((s) => s.id === 'fut').length, 1);
assert.equal(printingStyles.find((s) => s.id === 'fut').frames.length, 4);
assert.ok(Object.isFrozen(printingStyles[0].frames[0].selection));
let r = resolvePrintingStyle(source, style);
assert.equal(r.frame, 'future');
assert.equal(r.frameSource, 'rule');
assert.equal(r.rule, 'blue');
assert.equal(r.face.setCode, 'FUT');
assert.equal(r.face.collectorSetCode, 'MIX');
assert.equal(r.face.setSymbol, '/rare.svg');
assert.equal(r.face.collectorLanguage, 'FR');
assert.deepEqual(r.face.colors, ['U']);
assert.deepEqual(r.face.manaSymbols, ['2', 'U']);
r = resolvePrintingStyle({ ...source, colors: ['R'] }, style);
assert.equal(r.frame, 'shifted');
assert.equal(r.face.frameTreatment, 'colorshifted');
r = resolvePrintingStyle({ ...source, typeLine: 'Artifact Creature — Wizard' }, style);
assert.equal(r.frame, 'regular');
assert.equal(r.rule, 'artifact-first');
r = resolvePrintingStyle({ ...source, colors: ['U', 'R'] }, style);
assert.equal(r.frame, 'regular');
assert.equal(r.rule, 'two-colors');
r = resolvePrintingStyle({ ...source, typeLine: 'Basic Land — Island', colors: [] }, style);
assert.equal(r.frame, 'future', 'Basic lands match their visible frame palette');
const rulesColors = structuredClone(style);
rulesColors.rules[1].when.colorSource = 'card';
assert.equal(
  resolvePrintingStyle({ ...source, typeLine: 'Basic Land — Island', colors: [] }, rulesColors)
    .frame,
  'regular',
);
r = resolvePrintingStyle(
  source,
  style,
  { frame: 'regular', overrides: { legalText: null, elements: { artist: { hidden: true } } } },
  { frame: 'future', overrides: { elements: { artist: { offset: [0, 3] } } } },
);
assert.equal(r.frameSource, 'face');
assert.equal(r.frame, 'future');
assert.equal(r.face.collectorLanguage, 'FR');
assert.equal(r.face.legalText, null);
assert.deepEqual(r.face.printingElements.artist, { hidden: true, offset: [0, 3] });
r = resolvePrintingStyle(source, style, { overrides: { frameColors: ['R'] } });
assert.equal(r.frame, 'future', 'Palette override cannot switch the printing frame');
assert.deepEqual(r.face.frameColors, ['R']);
assert.deepEqual(r.face.colors, ['U']);
assert.equal(
  resolvePrintingStyle({ ...source, colors: [] }, style, {
    frame: 'shifted',
    overrides: { frameColors: ['U'] },
  }).frame,
  'shifted',
);
assert.equal(
  resolvePrintingPreset(
    { ...source, colors: [] },
    { preset: 'plc-colorshifted', overrides: { frameColors: ['U'] } },
  ).frameTreatment,
  'colorshifted',
);
assert.equal(
  resolvePrintingStyle({ ...source, colors: ['U', 'R'] }, style, { frame: 'future' }).frame,
  'future',
);
assert.throws(
  () => resolvePrintingStyle({ ...source, colors: ['U', 'R'] }, style, { frame: 'shifted' }),
  /monocolored/,
);
const options = printingStyleOptions({ ...source, colors: ['U', 'R'] }, style);
assert.equal(options.find((f) => f.id === 'shifted').supported, false);
assert.equal(
  printingStyleOptions({ ...source, colors: [] }, style, {
    overrides: { frameColors: ['B'] },
  }).find((f) => f.id === 'shifted').supported,
  true,
);
r = resolvePrintingStyle(
  { ...source, typeLine: 'Legendary Planeswalker — Probe', loyalty: '4' },
  style,
);
assert.equal(r.selection.preset, 'match');
assert.equal(r.frameSource, 'fallback');
assert.ok(r.notices.length >= 3);
assert.equal(r.face.legalText, 'Custom notice');
assert.equal(r.face.printingElements, undefined);
assert.equal(r.face.symbolAdjustment, undefined);
assert.throws(
  () => resolvePrintingStyle({ ...source, typeLine: 'Planeswalker' }, style, { frame: 'future' }),
  /ordinary/,
);
assert.equal(
  resolvePrintingStyle({ ...source, rarity: 'mythic' }, style).face.printingElements.setSymbol
    .hidden,
  true,
);
const split = {
  ...source,
  layout: 'split',
  faces: [
    { ...source, typeLine: 'Instant', colors: ['U'] },
    { ...source, typeLine: 'Sorcery', colors: ['R'], name: 'Other' },
  ],
};
r = resolvePrintingStyle(split, {
  ...style,
  defaults: { overrides: { legalText: 'Custom notice' } },
});
assert.equal(r.frame, 'regular');
assert.equal(r.face.faces.length, 2);
assert.ok(r.face.faces.every((f) => f.frameAssetFamily === 'eighth'));
assert.deepEqual(r.face.faces[0].colors, ['U']);
const layers = composePrintingSelection(
  {
    preset: 'lea',
    overrides: {
      symbolAdjustment: { mana: { glyphs: { B: { dx: 1, scale: 0.9 } } } },
      elements: { artist: { offset: [3, 4] } },
    },
  },
  {
    overrides: {
      symbolAdjustment: { mana: { glyphs: { B: { dy: 2 } } } },
      elements: { artist: { hidden: true } },
    },
  },
);
assert.deepEqual(layers.overrides.symbolAdjustment.mana.glyphs.B, { dx: 1, scale: 0.9, dy: 2 });
assert.deepEqual(layers.overrides.elements.artist, { offset: [3, 4], hidden: true });
const data = validatePrintingStyle(JSON.parse(JSON.stringify(style)));
assert.deepEqual(data, style);
data.defaults.overrides.elements.artist.offset[0] = 90;
assert.deepEqual(style, definition);
assert.deepEqual(source, original);
for (const mutate of [
  (s) => s.frames.push(s.frames[0]),
  (s) => (s.defaultFrame = 'missing'),
  (s) => (s.rules[0].frame = 'missing'),
  (s) => (s.rules[0].when.colors = ['X']),
  (s) => (s.rules[0].when.colorCount = [4, 2]),
  (s) => (s.rules[0].when.types = []),
  (s) => (s.rules[0].defaults = { overrides: { collectorTotal: 0 } }),
  (s) => (s.defaults.overrides = { frameColors: ['U', 'U'] }),
  (s) => (s.defaults.overrides = { symbolAdjustment: { set: { scaleX: 8 } } }),
  (s) => (s.defaults.overrides = { styleSetCode: null }),
  (s) => (s.rules[0].when = JSON.parse('{"__proto__":{}}')),
]) {
  const bad = structuredClone(style);
  mutate(bad);
  assert.throws(() => validatePrintingStyle(bad));
}
assert.throws(() => resolvePrintingStyle(source, style, { frame: 'missing' }), /Unknown chosen/);
assert.throws(
  () =>
    resolvePrintingStyle(source, style, {
      overrides: { elements: { artist: { offset: [1000, 0] } } },
    }),
  /100/,
);
console.log(
  'PASS mixed frame options, color/type/layout rules, card/face inheritance, symbols, palette overrides, compatibility and strict serialization',
);

assert.equal(
  composePrintingSelection(
    {
      preset: 'lea',
      overrides: { borderColor: 'white', elements: { artist: { hidden: true } } },
      art: { mode: 'window', zoom: 2 },
    },
    {
      overrides: { borderColor: undefined, elements: { artist: { hidden: undefined } } },
      art: { zoom: undefined },
    },
  ).overrides.elements.artist.hidden,
  true,
);

assert.equal(resolvePrintingStyle({ ...source, frameColors: ['R'] }, style).frame, 'future');

for (const preset of ['lea', 'plc-colorshifted', 'fut', 'm21']) {
  const printed = resolvePrintingPreset(source, { preset }),
    changed = { ...printed, frameColors: ['G'] };
  assert.deepEqual(changed.manaSymbols, printed.manaSymbols);
  assert.deepEqual(changed.colors, ['U']);
  assert.equal(resolveCardProfile(changed).frame, 'G');
  assert.deepEqual(
    faceRects(changed),
    faceRects(printed),
    'Recolor keeps the exact frame geometry',
  );
  const before = magic.describe(printed, 'inspect'),
    after = magic.describe(changed, 'inspect');
  assert.deepEqual(after.artWindows, before.artWindows);
  assert.deepEqual(after.regions, before.regions);
  assert.equal(after.cornerRadius, before.cornerRadius);
  assert.notEqual(after.color.key, before.color.key, 'Recolor must invalidate the printed raster');
  for (const key of [
    'frameStyle',
    'frameTemplate',
    'frameAssetFamily',
    'frameTreatment',
    'setCode',
    'symbolStyle',
  ])
    assert.equal(changed[key], printed[key]);
  const gameChanged = { ...printed, colors: ['G'] };
  assert.deepEqual(faceRects(gameChanged), faceRects(printed));
  assert.deepEqual(gameChanged.manaSymbols, source.manaSymbols);
}
console.log(
  'PASS Lifelace recoloring preserves exact frame geometry, template, treatment, typography source and blue mana symbols across Alpha, Colorshifted, Futureshifted and modern frames',
);

const future = printingStyles.find((s) => s.id === 'fut');
for (const frame of ['full-art', 'clear']) {
  const result = resolvePrintingStyle({ ...source, rulesText: '' }, future, { frame });
  assert.equal(result.face.futureTreatment, frame);
  assert.equal(
    resolvePrintingStyle(
      { ...source, rulesText: '', frameTemplate: 'future', futureTreatment: frame },
      future,
    ).frame,
    frame,
  );
}

assert.equal(
  printingStyleOptions(source, future).find((f) => f.id === 'full-art').supported,
  false,
);
assert.throws(() => resolvePrintingStyle(source, future, { frame: 'full-art' }), /no rules panel/);
assert.equal(
  printingStyleOptions({ ...source, colors: ['U', 'R'], rulesText: '' }, future).find(
    (f) => f.id === 'full-art',
  ).supported,
  false,
);
