import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { setCalibrationProfile } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  const { describeSetCalibration, createSetCalibrationCandidate } = await server.ssrLoadModule(
    '/games/magic/src/calibration/editor.ts',
  );
  const { earlyReprintFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-frame.ts',
  );
  const { printingManaDefaults } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const { historicalManaPaperSample } = await server.ssrLoadModule(
    '/games/magic/src/presentation/historical-mana.ts',
  );
  const { faceSetSymbol, faceEtchingSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/assets.ts',
  );
  const { resolvePrintingWording } = await server.ssrLoadModule(
    '/games/magic/src/printing/resolve.ts',
  );
  const { earlyExpansionTextLayout } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-text.ts',
  );
  const { earlyInlineManaNumeral } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-inline-mana.ts',
  );
  const profile = setCalibrationProfile('arn');
  assert.equal(profile.setSymbolSource, 'keyrune');
  const face = {
    name: 'Army of Allah',
    setCode: 'arn',
    typeLine: 'Instant',
    colors: ['W'],
    wordingMode: 'original',
    symbolStyle: 'original',
    frameStyle: 'retro',
    collectorNumber: '3',
  };
  const light = { ...face, collectorNumber: '3†' },
    modern = { ...face, symbolStyle: 'modern' };
  assert.equal(printingManaDefaults(face).numberScale, 0.87);
  assert.equal(printingManaDefaults(light).numberScale, 1.01);
  const geometry = printingManaDefaults(modern);
  assert.deepEqual(geometry, {
    dx: profile.mana.geometry.dx,
    dy: profile.mana.geometry.dy,
    scaleX: profile.mana.geometry.scaleX,
    scaleY: profile.mana.geometry.scaleY,
    spacing: profile.mana.geometry.spacing,
  });
  assert.deepEqual(
    printingManaDefaults({ ...modern, symbolStyle: undefined, wordingMode: 'oracle' }),
    geometry,
  );
  assert.equal(geometry.numberScale, undefined);
  assert.equal(geometry.glyphs, undefined);
  assert.equal(historicalManaPaperSample(face, 'B'), undefined, 'Preserve the original B sampler');
  assert.match(faceSetSymbol(face), /\/arn\.svg$/);
  assert.equal(faceSetSymbol(face), faceEtchingSymbol(face));
  assert.match(faceSetSymbol({ ...face, setSymbolSource: 'cardconjurer' }), /\/arn-c\.svg$/);
  assert.equal(
    faceSetSymbol({ ...face, setSymbol: 'https://example.invalid/custom.svg' }),
    'https://example.invalid/custom.svg',
  );
  const inlineFace = { ...face, colors: ['R'], colorCalibration: 'set-hsb-v1' };
  assert.deepEqual(earlyInlineManaNumeral(inlineFace), { fill: 'rgba(96,52,46,0.8)' });
  assert.deepEqual(earlyInlineManaNumeral({ ...inlineFace, typeLine: 'Artifact', colors: [] }), {
    fill: 'rgba(160,172,174,1)',
  });
  assert.equal(earlyInlineManaNumeral({ ...inlineFace, symbolStyle: 'modern' }), undefined);
  assert.equal(earlyInlineManaNumeral({ ...inlineFace, calibration: 'source' }), undefined);
  assert.equal(earlyInlineManaNumeral({ ...inlineFace, setCode: 'atq' }), undefined);
  const marginUser = { dx: 0.5, dy: 1, scaleX: 1.1, numberDy: 0.75 };
  const { printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const adjusted = printingManaAdjustment({ ...modern, symbolAdjustment: { mana: marginUser } });
  assert.equal(adjusted.dx, geometry.dx + 0.5);
  assert.equal(adjusted.dy, geometry.dy + 1);
  assert.equal(adjusted.scaleX, geometry.scaleX * 1.1);
  assert.equal(adjusted.numberDy, 0.75);
  assert.equal(printingManaDefaults({ ...modern, frameTemplate: 'future' }), undefined);
  const mountain = { ...face, name: 'Mountain', typeLine: 'Land', colors: [], land: true };
  assert.equal(earlyReprintFrame(mountain).assetKey, 'rl');
  assert.equal(earlyReprintFrame(mountain).family, 'abu');
  assert.equal(profile.footer.legal.defaultText, '', 'Do not invent a separate legal line');
  const description = describeSetCalibration('arn');
  assert.equal(description.adapter, 'profile');
  for (const id of [
    'mana.inlineGeneric.A.alpha',
    'mana.inlineGeneric.R.paper.0',
    'expansionBody.regular',
    'expansionBody.offset',
    'expansionBody.largeSize',
    'mana.variants.dark.geometry.numberScale',
    'footer.artist.inkStyle',
    'footer.artist.tint.1',
  ])
    assert(
      description.controls.some((c) => c.id === id),
      id,
    );
  assert.throws(
    () =>
      createSetCalibrationCandidate('arn', profile.revision, { 'expansionBody.bounds.width': 10 }),
    /Invalid expansion/,
  );
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
  const paragraphs = [{ role: 'rules', runs: [{ text: 'A short rules sentence. '.repeat(9) }] }];
  const before = earlyExpansionTextLayout(context, face, paragraphs, paragraphs);
  const candidate = createSetCalibrationCandidate('arn', profile.revision, {
    'expansionBody.offset': -12,
  });
  const after = earlyExpansionTextLayout(
    context,
    { ...face, setCalibrationCandidate: candidate },
    paragraphs,
    paragraphs,
  );
  assert.equal(after.top - before.top, 2, 'Expansion editor offset must reach the actual layout');
  const oracle = { typeLine: 'Artifact', rulesText: 'Unchanged Oracle wording.' };
  const city = resolvePrintingWording('9598b346-a47d-4c4c-9571-156824e86b9c', {
    oracle,
    original: { typeLine: 'Artifact', rulesText: 'Original provider placeholder.' },
  });
  assert.equal(city.wordings.oracle.rulesText, oracle.rulesText);
  assert.equal(
    city.wordings.original.rulesParagraphs
      .flatMap((p) => p.runs)
      .filter((r) => r.italic && r.text === 'Arabian Nights').length,
    2,
  );
  const king = resolvePrintingWording('4d3dce0f-2168-4f63-b2f9-156a11beeea7', {
    oracle,
    original: { typeLine: 'Summon King', rulesText: 'Original provider placeholder.' },
  });
  const flavor = king.wordings.original.rulesParagraphs.filter((p) => p.role === 'flavor');
  assert.equal(flavor.length, 1);
  assert(
    flavor[0].runs
      .map((r) => r.text)
      .join('')
      .includes('him." —The Qur'),
  );
  assert.equal(king.wordings.oracle.rulesText, oracle.rulesText);
  console.log(
    'ARN: effective editor controls, authentic wording styles, historical mana variants/sampler, shared color/etch source and corrected Mountain routing pass.',
  );
} finally {
  await server.close();
}
