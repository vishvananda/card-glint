import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { readPreArtistHostSource, readPreManaHostSource } from './magic-native-source-guard.mjs';

const proof = JSON.parse(await readFile('games/magic/fixtures/accuracy/early-expansion-mana.json'));
assert.equal(proof.validationKind, 'repeated');
assert.equal(proof.native.summary.cards, 316);
assert.equal(proof.native.summary.exactNative, 276);
assert.equal(proof.native.summary.outsideChanged, 0);
assert.equal(proof.controls.cards, 84);
assert.equal(proof.controls.changed, 0);
assert.equal(proof.fullCardDiagnostic.total, 316);
assert.equal(proof.fullCardDiagnostic.scored, 306);
assert.equal(proof.fullCardDiagnostic.summary.improved, 280);
assert.deepEqual(
  proof.fullCardDiagnostic.regressions.map((row) => row.name),
  ["Gaea's Touch"],
);
assert.equal(proof.fullCardDiagnostic.originalCostCorrections.length, 1);
const annotation = proof.annotationCorrection;
const previous = await readPreManaHostSource(annotation.file);
assert.equal(hash(previous), annotation.before);
const current = JSON.parse(await readFile(annotation.file));
assert.deepEqual(current.cards[annotation.printingId].reviewedFields, ['manaSymbols']);
assert.deepEqual(current.cards[annotation.printingId].manaSymbols, ['5', '5']);
delete current.cards[annotation.printingId];
assert.deepEqual(current, JSON.parse(previous), 'Other reviewed wording must stay unchanged');
for (const row of proof.native.rows) {
  assert.equal(row.outsideChanged, 0);
  if (row.costScored) assert.equal(row.proposalParity, true);
}
for (const row of proof.controls.rows) assert.equal(row.before, row.sha256);
for (const [file, expected] of Object.entries(proof.sourceGuards))
  assert.equal(
    hash(await readPreArtistHostSource(file)),
    expected,
    'Stale mana calibration: ' + file,
  );
for (const set of ['arn', 'atq', 'drk']) {
  const group = proof.summary[set + '/validation'];
  for (const crop of group.crops) {
    assert.ok(crop.after - crop.before > 0.2);
    assert.equal(crop.improved, group.printings);
  }
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { printingManaDefaults, printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const { earlyManaNumeral, arabianManaVariant } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-mana.ts',
  );
  const { calibratedManaTarget } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  for (const setCode of ['arn', 'atq', 'drk']) {
    const face = {
      name: 'Scope probe',
      setCode,
      colors: ['U'],
      typeLine: 'Summon Bird',
      symbolStyle: 'original',
      collectorNumber: '20†',
      colorCalibration: 'set-hsb-v1',
    };
    const p = printingManaDefaults(face);
    assert.deepEqual(p, proof.profiles[setCode]);
    assert.deepEqual(
      printingManaDefaults({ ...face, setCode: setCode.toUpperCase(), wordingMode: 'oracle' }),
      p,
    );
    for (const override of [
      { frameStyle: 'modern' },
      { frameTemplate: 'future' },
      { layout: 'split' },
      { legendary: true },
      { borderColor: 'white' },
      { symbolStyle: 'modern' },
      { symbolStyle: undefined, wordingMode: 'oracle' },
    ]) {
      const alternate = { ...face, ...override };
      if (override.frameStyle === 'modern') assert.notDeepEqual(printingManaDefaults(alternate), p);
      else assert.equal(printingManaDefaults(alternate), undefined);
      assert.equal(earlyManaNumeral(alternate), undefined);
      assert.notDeepEqual(calibratedManaTarget(alternate, 'U'), calibratedManaTarget(face, 'U'));
    }
    assert.equal(calibratedManaTarget({ ...face, calibration: 'source' }, 'U'), undefined);
    assert.ok(calibratedManaTarget(face, 'U'));
    const a = printingManaAdjustment({
      ...face,
      symbolAdjustment: {
        mana: { dx: 0.5, spacing: 0.25, numberScale: 1.1, glyphs: { G: { dy: 0.5 } } },
      },
    });
    assert.equal(a.dx, p.dx + 0.5);
    assert.equal(a.spacing, p.spacing + 0.25);
    assert.equal(a.numberScale, p.numberScale * 1.1);
    assert.equal(a.glyphs.G.dy, p.glyphs.G.dy + 0.5);
  }
  const dark = {
    name: 'Probe',
    setCode: 'ARN',
    collectorNumber: '9',
    colors: ['W'],
    typeLine: 'Summon Smith',
    symbolStyle: 'original',
    calibration: 'auto',
  };
  assert.equal(arabianManaVariant(dark), 'dark');
  assert.ok(earlyManaNumeral(dark));
  assert.equal(printingManaDefaults(dark).numberScale, 0.87);
  for (const collectorNumber of [undefined, '', '9a', '9†'])
    assert.equal(earlyManaNumeral({ ...dark, collectorNumber }), undefined);
  assert.notDeepEqual(
    calibratedManaTarget(dark, 'W'),
    calibratedManaTarget({ ...dark, collectorNumber: '9†' }, 'W'),
  );
  assert.notDeepEqual(earlyManaNumeral(dark), earlyManaNumeral({ ...dark, calibration: 'source' }));
  const { resolvePrintingWording } = await server.ssrLoadModule(
    '/games/magic/src/printing/resolve.ts',
  );
  const wording = { typeLine: 'Artifact', rulesText: 'Original rules', manaSymbols: ['10'] };
  const input = { oracle: wording, original: wording };
  const result = resolvePrintingWording('8fecc5d2-5298-4d47-b085-f160603f220e', input);
  assert.deepEqual(result.wordings.original.manaSymbols, ['5', '5']);
  assert.deepEqual(result.wordings.oracle.manaSymbols, ['10']);
  assert.deepEqual(input.original.manaSymbols, ['10']);
  assert.deepEqual(resolvePrintingWording('other-printing', input).wordings.original.manaSymbols, [
    '10',
  ]);
  console.log(
    'Early mana: 276 scored costs, 316 isolated native replays, 84 controls, style scope, editor deltas and original-only printed-cost correction.',
  );
} finally {
  await server.close();
}
