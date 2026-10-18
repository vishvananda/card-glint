import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
import { earlyReprintProof } from './magic-early-reprint-source-guard.mjs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { setCalibrationProfile } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  const { earlyReprintFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-frame.ts',
  );
  const { earlyReprintColors } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-colors.ts',
  );
  const { calibratedFrameMaterials, calibratedPrintingStock } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const { retroFrameAsset, retroFrameRect, retroRects } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  let materials = 0;
  for (const setCode of ['fem', '4ed', 'chr']) {
    for (const color of ['W', 'U', 'B', 'R', 'G', 'A', ...(setCode === 'chr' ? ['M'] : [])]) {
      const face = {
        name: 'Printing probe',
        setCode,
        typeLine: color === 'A' ? 'Artifact' : 'Summon Legend',
        colors: color === 'A' ? [] : color === 'M' ? ['U', 'B', 'R'] : [color],
        colorCalibration: 'set-hsb-v1',
      };
      const frame = earlyReprintFrame(face),
        colors = earlyReprintColors(face);
      assert.equal(frame.profile, `${setCode}/${color}`);
      assert.equal(frame.family, setCalibrationProfile(setCode).frames[color].family);
      assert.equal(retroFrameAsset(face), frame.asset);
      assert.deepEqual(retroFrameRect(face), frame.frame);
      assert.deepEqual(retroRects(face).art, frame.art);
      assert.deepEqual(calibratedFrameMaterials(face), colors.materials);
      assert.equal(
        calibratedPrintingStock(face),
        setCalibrationProfile(setCode).colors[color].stock,
      );
      assert.deepEqual(
        earlyReprintFrame({
          ...face,
          wordingMode: 'oracle',
          typeLine: color === 'A' ? 'Artifact' : 'Legendary Creature — Human',
        }),
        frame,
      );
      assert.deepEqual(earlyReprintFrame({ ...face, setCode: setCode.toUpperCase() }), frame);
      for (const override of [
        { setCode: 'lea' },
        { setCode: '3ed' },
        { setCode: 'drk' },
        { setCode: 'ice' },
        { setCode: 'm21' },
        { frameStyle: 'modern' },
        { frameAssetFamily: 'eighth' },
        { frameTemplate: 'future' },
        { layout: 'split' },
        { typeLine: 'Enchantment — Saga' },
        { borderColor: 'silver' },
        { borderColor: setCode === 'fem' ? 'white' : 'black' },
      ])
        assert.equal(earlyReprintFrame({ ...face, ...override }), undefined);
      assert.equal(earlyReprintColors({ ...face, colorCalibration: undefined }), undefined);
      assert.deepEqual(calibratedFrameMaterials({ ...face, calibration: 'source' }), {});
      assert.equal(calibratedPrintingStock({ ...face, calibration: 'source' }), undefined);
      materials++;
    }
  }
  for (const [name, color] of Object.entries({
    Plains: 'W',
    Island: 'U',
    Swamp: 'B',
    Mountain: 'R',
    Forest: 'G',
  })) {
    const face = { name, setCode: '4ed', typeLine: 'Land' };
    const original = earlyReprintFrame(face);
    assert.equal(original.profile, `4ed/L-${color}`);
    assert.ok(original.asset.endsWith(`/abu/${color.toLowerCase()}l.png`));
    assert.deepEqual(
      earlyReprintFrame({ ...face, typeLine: `Basic Land — ${name}`, wordingMode: 'oracle' }),
      original,
    );
    assert.deepEqual(
      earlyReprintFrame({ ...face, name: 'Custom basic', frameColors: [color] }),
      original,
    );
    materials++;
  }
  for (const [setCode, name, profile] of [
    ['fem', 'Dwarven Hold', 'L-red'],
    ['4ed', 'Oasis', 'L-gold'],
    ['4ed', 'Mishra’s Factory', 'L-red'],
    ['chr', 'Safe Haven', 'L-dark'],
    ['chr', 'City of Brass', 'L-gold'],
    ['chr', 'Urza’s Tower', 'L-red'],
  ]) {
    const face = { name, setCode, typeLine: 'Land', colors: [], colorCalibration: 'set-hsb-v1' };
    const original = earlyReprintFrame(face);
    assert.equal(original.profile, `${setCode}/${profile}`);
    assert.ok(original.asset.endsWith('/abu/l.png'));
    assert.ok(earlyReprintColors(face));
    assert.deepEqual(
      earlyReprintFrame({ ...face, wordingMode: 'oracle', typeLine: 'Land — Urza’s Tower' }),
      original,
    );
    assert.equal(earlyReprintFrame({ ...face, frameColors: ['U', 'R'] }), undefined);
    materials++;
  }
  assert.equal(materials, 30);
  await earlyReprintProof();
  const evidence = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/early-reprint-frame-color.json'),
  );
  assert.equal(evidence.bindings.length, 30);
  for (const binding of evidence.bindings) {
    if (setCalibrationProfile(binding.profile.split('/')[0]).revision !== 1) continue;
    const face = { ...binding.face, colorCalibration: 'set-hsb-v1' };
    const frame = earlyReprintFrame(face);
    assert.equal(frame.profile, binding.profile);
    for (const [key, value] of Object.entries(binding.geometry))
      assert.deepEqual(frame[key], value);
    assert.deepEqual(calibratedFrameMaterials(face), { [frame.asset]: binding.adjustment });
    assert.equal(calibratedPrintingStock(face), binding.stock);
  }
  console.log(
    'Thirty early-reprint materials preserve printing identity, source opt-out and frame scope.',
  );
} finally {
  await server.close();
}
