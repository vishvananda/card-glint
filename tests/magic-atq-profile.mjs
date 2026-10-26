import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const load = (file) => server.ssrLoadModule('/games/magic/src/' + file + '.ts');
  const { setCalibrationProfile } = await load('calibration/profiles');
  const { describeSetCalibration, createSetCalibrationCandidate } =
    await load('calibration/editor');
  const { earlyReprintFrame } = await load('presentation/early-reprint-frame');
  const { earlyReprintFooter } = await load('presentation/early-reprint-footer');
  const { printingManaDefaults } = await load('presentation/printing-mana-adjustment');
  const { historicalManaPaperSample } = await load('presentation/historical-mana');
  const { faceSetSymbol, faceEtchingSymbol } = await load('presentation/assets');
  const { earlyExpansionTextLayout: fit } = await load('presentation/early-expansion-text');
  const p = setCalibrationProfile('atq');
  assert.equal(p.setSymbolSource, 'keyrune');
  const face = {
    name: 'Atog',
    setCode: 'atq',
    typeLine: 'Summon Atog',
    colors: ['R'],
    wordingMode: 'original',
    symbolStyle: 'original',
    frameStyle: 'retro',
    power: '1',
    toughness: '2',
  };
  assert.equal(earlyReprintFrame(face).family, 'fourth');
  assert.equal(earlyReprintFrame({ ...face, colors: ['G'] }).family, 'abu');
  assert.equal(earlyReprintFrame({ ...face, colors: ['U'] }).family, 'fourth');
  assert.equal(earlyReprintFooter(face).artist.prefix, 'Illus. © ');
  assert.equal(earlyReprintFooter(face).legalText, '');
  assert.equal(earlyReprintFooter(face).stats.inkStyle, 'separate-shadow');
  assert.equal(earlyReprintFooter(face).stats.shadowTrim, 0.2);
  assert.deepEqual(p.mana.ink, [23 / 255, 24 / 255, 18 / 255]);
  assert.equal(printingManaDefaults(face).dy, -7.75);
  assert.equal(printingManaDefaults({ ...face, symbolStyle: 'modern' }), undefined);
  assert.equal(historicalManaPaperSample(face, 'B'), undefined);
  assert.match(faceSetSymbol(face), /\/atq\.svg$/);
  assert.equal(faceSetSymbol(face), faceEtchingSymbol(face));
  assert.match(faceSetSymbol({ ...face, setSymbolSource: 'cardconjurer' }), /\/atq-c\.svg$/);
  assert.equal(faceSetSymbol({ ...face, printingElements: { setSymbol: { hidden: true } } }), null);
  const description = describeSetCalibration('atq');
  assert.equal(description.adapter, 'profile');
  for (const id of [
    'expansionBody.unconstrained.minimumFreeSpace',
    'expansionBody.unconstrained.fractionalMetrics',
    'expansionBody.unconstrained.flavorOrphans',
    'expansionBody.unconstrained.flavorOrphanMinCharacters',
    'footer.stats.inkStyle',
    'footer.stats.shadowTrim',
    'footer.stats.tint.1',
  ]) {
    assert(
      description.controls.some((c) => c.id === id),
      id,
    );
  }
  for (const edits of [
    { 'expansionBody.unconstrained.minimumFreeSpace': -1 },
    { 'expansionBody.unconstrained.flavorOrphanMinCharacters': 1.5 },
    { 'expansionBody.unconstrained.regularLeading': 0 },
  ])
    assert.throws(() => createSetCalibrationCandidate('atq', p.revision, edits));
  const context = {
    font: '20px serif',
    save() {},
    restore() {},
    measureText(text) {
      const size = Number(this.font.match(/([\d.]+)px/)[1]);
      return {
        width: text.length * size * 0.5,
        actualBoundingBoxAscent: size * 0.8,
        actualBoundingBoxDescent: size * 0.2,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: text.length * size * 0.5,
      };
    },
  };
  const paragraphs = [
    {
      role: 'rules',
      runs: [{ text: 'A target artifact gains flying until end of turn. '.repeat(2) }],
    },
  ];
  const edited = createSetCalibrationCandidate('atq', p.revision, {
    'expansionBody.unconstrained.offset': -15,
  });
  const before = fit(
    context,
    { ...face, rulesAlignment: { mode: 'left' } },
    paragraphs,
    paragraphs,
  );
  const after = fit(
    context,
    { ...face, rulesAlignment: { mode: 'left' }, setCalibrationCandidate: edited },
    paragraphs,
    paragraphs,
  );
  assert.equal(after.top - before.top, -1, 'Refinement controls must reach the actual layout');
  console.log(
    'ATQ: scoped profile selection, historical pigment/sampler, preserved footer ink, effective controls and protected dense layout pass.',
  );
} finally {
  await server.close();
}
