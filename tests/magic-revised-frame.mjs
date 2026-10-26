import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from './magic-vite.mjs';
const report = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/revised-frame-native.json'),
);
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const geometry = await server.ssrLoadModule(
    '/games/magic/src/presentation/revised-frame-geometry.ts',
  );
  const { printingColorSource } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-source.ts',
  );
  const { calibratedFrameMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const { retroAssets, retroFrameRect } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  for (const binding of report.bindings) {
    const face = {
      name: 'Revised frame',
      setCode: '3ed',
      borderColor: 'white',
      typeLine: binding.material === 'A' ? 'Artifact' : 'Creature',
      colors: binding.material === 'A' ? [] : [binding.material],
      colorCalibration: 'set-hsb-v1',
    };
    assert.equal(printingColorSource(face).source, binding.afterSource);
    assert.equal(
      JSON.parse(binding.beforeSource)[0],
      JSON.parse(binding.afterSource)[0],
      'Retain the pinned texture',
    );
    const colors = calibratedFrameMaterials(face);
    assert.deepEqual(colors, binding.materials);
    assert.equal(
      createHash('sha256').update(JSON.stringify(colors)).digest('hex'),
      binding.materialsHash,
      'Retain exact source-local HSB and masks',
    );
    assert.deepEqual(calibratedFrameMaterials({ ...face, colorCalibration: undefined }), {});
    assert.deepEqual(geometry.revisedFrameRect(face), retroFrameRect(face));
    const frame = geometry.revisedFrameRect(face),
      art = geometry.revisedArtRect(face);
    assert.ok(
      art[0] > frame[0] &&
        art[1] > frame[1] &&
        art[0] + art[2] < frame[0] + frame[2] &&
        art[1] + art[3] < frame[1] + frame[3],
    );
    assert.ok(
      !retroAssets(face).some((url) => /border(?:Black|White)\.png$/.test(url)),
      'Do not cover the fitted plate with the obsolete border mask',
    );
    for (const override of [
      { setCode: '4ed' },
      { setCode: 'leb' },
      { borderColor: 'black' },
      { frameStyle: 'modern' },
      { frameTemplate: 'future' },
      { layout: 'split' },
      { typeLine: 'Enchantment — Saga' },
      { land: true, typeLine: 'Land' },
    ]) {
      assert.equal(geometry.revisedFrameRect({ ...face, ...override }), null);
      assert.equal(geometry.revisedArtRect({ ...face, ...override }), null);
    }
  }
  // Original Enchant Artifact is an Aura, not the frame's Artifact material.
  // Geometry, asset and source-bound pigment must all follow the same profile.
  for (const color of ['U', 'B', 'G']) {
    const original = {
      name: 'Original artifact enchantment',
      setCode: '3ed',
      typeLine: 'Enchant Artifact',
      canonicalTypeLine: 'Enchantment — Aura',
      artifact: false,
      colors: [color],
      colorCalibration: 'set-hsb-v1',
    };
    const oracle = { ...original, typeLine: 'Enchantment — Aura' };
    assert.deepEqual(geometry.revisedFrameRect(original), geometry.revisedFrameRect(oracle));
    assert.deepEqual(geometry.revisedArtRect(original), geometry.revisedArtRect(oracle));
    assert.equal(printingColorSource(original).source, printingColorSource(oracle).source);
    assert.deepEqual(calibratedFrameMaterials(original), calibratedFrameMaterials(oracle));
    assert(Object.keys(calibratedFrameMaterials(original)).length > 0);
    for (const metadata of [
      { artifact: undefined },
      { artifact: true, canonicalTypeLine: 'Artifact' },
      { artifact: false, canonicalTypeLine: 'Artifact' },
    ]) {
      const face = { ...original, ...metadata },
        canonical = { ...face, typeLine: face.canonicalTypeLine };
      assert.deepEqual(geometry.revisedFrameRect(face), geometry.revisedFrameRect(canonical));
      assert.equal(printingColorSource(face).source, printingColorSource(canonical).source);
    }
  }
  const green = { name: 'Probe', setCode: '3ed', typeLine: 'Creature', colors: ['G'] };
  assert.deepEqual(
    geometry.revisedFrameRect({ ...green, colors: ['U'], frameColors: ['G'] }),
    geometry.revisedFrameRect(green),
    'Serendib Efreet follows reviewed visible frame color',
  );
  assert.equal(report.rows.length + report.excluded.length, 306);
  assert.equal(report.sourceIsolationChecks, 44);
  assert.equal(report.unchangedLandMaterials.length, 15);
  console.log(
    'Revised geometry retains source-local colors, visible materials and adapter boundaries.',
  );
} finally {
  await server.close();
}
