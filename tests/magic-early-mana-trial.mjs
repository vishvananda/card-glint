import assert from 'node:assert/strict';
import { earlyManaTrialPlugin } from '../games/magic/tools/accuracy/early-mana-trial-plugin.mjs';
import { earlyManaRetainedPlugin } from '../games/magic/tools/accuracy/early-mana-retained-plugin.mjs';
import { earlyManaInkPlugin } from '../games/magic/tools/accuracy/early-mana-ink-plugin.mjs';
const prefix = '/repo/games/magic/src/presentation/';
const functions = [
  'export function earlyReprintMana(face: RenderedCardInput): boolean {',
  'export function earlyReprintManaDefaults(face: RenderedCardInput) {',
  'export function earlyReprintManaTarget(face: RenderedCardInput, symbol: string) {',
  'export function earlyReprintManaInk(face: RenderedCardInput) {',
]
  .map((signature) => signature + '\n return undefined;\n}')
  .join('\n');
const proof = {},
  plugin = earlyManaTrialPlugin(proof);
const code = plugin.transform(functions, prefix + 'early-reprint-mana.ts');
assert.equal(code.split('__earlyManaTrial').length, 5);
assert(code.includes('trial.geometry ?? {}'));
assert(code.includes('trial.ink'));
assert.equal(plugin.transform(functions, prefix + 'early-reprint-mana.ts'), code);
assert.throws(() => plugin.transform(functions + '\n// changed', prefix + 'early-reprint-mana.ts'));
assert.throws(() =>
  earlyManaTrialPlugin({}).transform('changed source', prefix + 'early-reprint-mana.ts'),
);
const cache = earlyManaTrialPlugin({}).transform(
  "    'canvas-face-v148',",
  prefix + 'canvas-face.ts',
);
assert(cache.includes('__earlyManaTrial ?? null'));
const retainedProof = {},
  retained = earlyManaRetainedPlugin(retainedProof);
const samples = [
  ['retro-paint.ts', 'const costAdjustment = printingManaAdjustment(face);', '__abuManaAdjustment'],
  [
    'printing-elements.ts',
    '  const option = face.printingElements?.[element];',
    '__abuManaCapture',
  ],
  ['canvas-text.ts', "  if (symbol === 'W' && images.originalWhiteGlyph) {", '__manaStudyImages'],
];
for (const [file, source, marker] of samples) {
  const generated = retained.transform(source, prefix + file);
  assert(generated.includes(marker));
  assert.equal(retained.transform(source, prefix + file), generated);
  assert.equal(retained.transform(source, '/repo/packages/browser/src/' + file), undefined);
  assert.throws(() => earlyManaRetainedPlugin({}).transform('missing boundary', prefix + file));
}
assert.equal(retained.transform('unrelated', prefix + 'layout.ts'), undefined);
console.log(
  'Mana study hooks: exact boundaries, immutable transforms, palette cache identity and core exclusion pass.',
);

const inkSource = `export function historicalManaPaperSample(face: RenderedCardInput, symbol: string) {
 return undefined;
}
export function historicalManaAsset(face: RenderedCardInput, symbol: string) {
 const asset = undefined, ink = undefined;
  return asset && ink ? { ...asset, inkExpansion: ink.pixels } : asset;
}`;
const inkProof = {},
  inkPlugin = earlyManaInkPlugin(inkProof);
const inkCode = inkPlugin.transform(inkSource, prefix + 'historical-mana.ts');
assert(inkCode.includes('inkExpansion: amount'));
assert(inkCode.includes("return 'opaque-percentile'"));
assert(inkCode.includes("throw Error('Invalid trial ink expansion')"));
assert.equal(inkPlugin.transform(inkSource, prefix + 'historical-mana.ts'), inkCode);
assert.equal(
  inkPlugin.transform(inkSource, '/repo/packages/browser/src/historical-mana.ts'),
  undefined,
);
assert.throws(() => inkPlugin.transform(inkSource + '// changed', prefix + 'historical-mana.ts'));
assert.throws(() => earlyManaInkPlugin({}).transform('missing', prefix + 'historical-mana.ts'));
assert.equal(inkPlugin.transform('unrelated', prefix + 'layout.ts'), undefined);
