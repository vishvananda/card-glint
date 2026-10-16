import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { futureFrameMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/future-color-profiles.ts',
  );
  const { futureParts } = await server.ssrLoadModule(
    '/games/magic/src/presentation/future-frame.ts',
  );
  const { colorFrame } = await server.ssrLoadModule('/games/magic/src/presentation/frame-hsb.ts');
  const base = {
    name: 'Probe',
    frameTemplate: 'future',
    setCode: 'fut',
    futureTreatment: 'regular',
    typeLine: 'Creature',
    colors: ['W'],
    colorCalibration: 'set-hsb-v1',
  };
  for (const change of [
    { colorCalibration: undefined },
    { setCode: 'plc' },
    { frameTemplate: undefined },
    { futureTreatment: 'clear' },
  ])
    assert.deepEqual(futureFrameMaterials({ ...base, ...change }), {});
  const faces = [
    { ...base, typeLine: 'Artifact', colors: [] },
    { ...base, typeLine: 'Instant', colors: [] },
    { ...base, typeLine: 'Land', colors: [], frameColors: ['G', 'W'] },
    { ...base, typeLine: 'Land', colors: [], frameColors: ['U', 'B'] },
    ...['W', 'U', 'R', 'G'].map((c) => ({
      ...base,
      futureTreatment: 'full-art',
      colors: [c],
      power: '2',
      toughness: '2',
    })),
  ];
  for (const face of faces) {
    const materials = futureFrameMaterials(face);
    assert.ok(Object.keys(materials).length);
    assert.deepEqual(
      materials,
      futureFrameMaterials({ ...face, name: 'Unrelated wording', rulesText: 'Different text' }),
      'Material identity must not depend on printed wording',
    );
    const parts = futureParts(face);
    assert.ok(
      Object.keys(materials).every((url) => Object.values(parts).includes(url)),
      'Never recolor an unselected asset',
    );
    for (const adjustment of Object.values(materials)) {
      const image = { width: 375, height: 527, data: new Uint8ClampedArray(375 * 527 * 4) };
      for (let i = 0; i < image.data.length; i += 4) image.data.set([7, 8, 9, (i / 4) % 256], i);
      const before = image.data.slice();
      colorFrame(image, adjustment);
      assert.deepEqual(
        image.data,
        before,
        'Source black stock and every alpha value must remain intact',
      );
      for (let i = 0; i < image.data.length; i += 4)
        image.data.set([190, 160, 130, (i / 4) % 256], i);
      const alpha = image.data.filter((_, i) => i % 4 === 3);
      colorFrame(image, adjustment);
      assert.deepEqual(
        image.data.filter((_, i) => i % 4 === 3),
        alpha,
        'Recoloring must not change apertures or edge coverage',
      );
    }
  }
  assert.deepEqual(
    futureFrameMaterials({ ...base, futureTreatment: 'full-art', colors: ['B'] }),
    {},
    'Rejected Mass of Ghouls scan cannot establish a profile',
  );
  const darkLand = faces[3],
    darkParts = futureParts(darkLand),
    darkMaterials = futureFrameMaterials(darkLand);
  assert.equal(darkMaterials[darkParts.paper], undefined);
  assert.equal(
    darkMaterials[darkParts.reversePaper],
    undefined,
    'Failed blue/black land transfers retain the source',
  );
  const fixture = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/future-sparse-colors.json'),
  );
  assert.equal(fixture.rows.length, 15);
  assert.equal(fixture.rows.filter((r) => r.accepted).length, 14);
  for (const row of fixture.rows.filter((r) => r.accepted)) {
    assert.match(row.referenceHash, /^[a-f0-9]{64}$/);
    assert.equal(row.controls.alphaMaxDelta, 0);
    assert.equal(row.controls.artMaxDelta, 0);
    assert.ok(
      row.controls.stockMaxDelta <= 2,
      'Only resampled dark-edge pixels may differ by at most two channel levels',
    );
    const measurements = Object.values(row.measurements);
    assert.ok(
      measurements.reduce((s, m) => s + m.after - m.before, 0) < 0,
      row.name + ' overall component color check',
    );
  }
  console.log(
    'FUT sparse materials: exact source scope, preserved alpha/stock/art, reserved transfers and retained failures pass.',
  );
} finally {
  await server.close();
}
