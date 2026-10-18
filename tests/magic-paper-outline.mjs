import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { framePaperMask } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-paper-mask.ts',
  );
  const { colorFrame } = await server.ssrLoadModule('/games/magic/src/presentation/frame-hsb.ts');
  const { futureFrameMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/future-color-profiles.ts',
  );
  const image = { width: 40, height: 60, data: new Uint8ClampedArray(40 * 60 * 4) };
  for (let i = 0; i < image.data.length; i += 4) image.data.set([200, 180, 160, 255], i);
  const spec = {
    kind: 'polygon',
    points: [
      [0.1, 0.1],
      [0.9, 0.1],
      [0.9, 0.9],
      [0.55, 0.9],
      [0.55, 0.5],
      [0.1, 0.5],
    ],
    feather: 0.05,
  };
  const mask = framePaperMask(image, spec),
    at = (x, y) => y * 40 + x;
  assert.equal(mask[at(20, 12)], 1);
  assert.equal(mask[at(10, 45)], 0, 'Concave cutout must remain frame');
  assert.equal(mask[at(30, 45)], 1);
  assert.equal(mask[at(0, 12)], 0);
  assert.ok(mask[at(4, 12)] > 0 && mask[at(4, 12)] < 1, 'Boundary is feathered in source pixels');
  assert.deepEqual(mask, framePaperMask(image, { ...spec, points: [...spec.points].reverse() }));
  image.data.set([80, 70, 60, 255], at(20, 12) * 4);
  image.data.set([8, 8, 8, 255], at(21, 12) * 4);
  const before = image.data.slice();
  colorFrame(image, {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.8 },
    mask: spec,
  });
  assert.deepEqual(
    [...image.data.slice(at(20, 12) * 4, at(20, 12) * 4 + 4)],
    [64, 56, 48, 255],
    'Paper shadow follows the paper',
  );
  assert.deepEqual(
    image.data.slice(at(21, 12) * 4, at(21, 12) * 4 + 4),
    before.slice(at(21, 12) * 4, at(21, 12) * 4 + 4),
    'Black printing is preserved',
  );
  assert.deepEqual(
    image.data.slice(at(10, 45) * 4, at(10, 45) * 4 + 4),
    before.slice(at(10, 45) * 4, at(10, 45) * 4 + 4),
  );
  const panels = { ...image, data: before.slice() };
  colorFrame(panels, {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.5 },
    paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.8 },
    mask: spec,
    regions: [
      {
        mask: { kind: 'rect', rect: [0.6, 0.2, 0.2, 0.2], feather: 0.01 },
        adjustment: { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.9 },
      },
    ],
  });
  assert.deepEqual(
    [...panels.data.slice(at(28, 18) * 4, at(28, 18) * 4 + 4)],
    [180, 162, 144, 255],
    'Panel correction uses original pixels, not the already darkened paper',
  );
  assert.deepEqual(
    [...panels.data.slice(at(30, 45) * 4, at(30, 45) * 4 + 4)],
    [160, 144, 128, 255],
    'Adjacent paper retains its own correction',
  );
  assert.deepEqual(
    [...panels.data.slice(at(10, 45) * 4, at(10, 45) * 4 + 4)],
    [100, 90, 80, 255],
    'Surrounding frame retains its own correction',
  );
  for (const bad of [
    { ...spec, feather: 0 },
    {
      ...spec,
      points: [
        [0, 0],
        [1, 1],
      ],
    },
    {
      ...spec,
      points: [
        [0, 0],
        [1, 1],
        [NaN, 0.5],
      ],
    },
  ])
    assert.throws(() => framePaperMask(image, bad), /Paper outline/);
  const face = {
    name: 'Probe',
    frameTemplate: 'future',
    futureTreatment: 'regular',
    setCode: 'fut',
    colors: ['W'],
    typeLine: 'Creature',
    colorCalibration: 'set-hsb-v1',
  };
  assert.equal(Object.keys(futureFrameMaterials(face)).length, 1);
  for (const change of [
    { colorCalibration: undefined },
    { setCode: 'other' },
    { frameTemplate: undefined },
    { futureTreatment: 'clear' },
    { futureTreatment: 'full-art', colors: ['B'] },
  ])
    assert.deepEqual(futureFrameMaterials({ ...face, ...change }), {});
  console.log(
    'Source-paper outline preserves concavity, feathering, shadows, ink and source/printing opt-in guards.',
  );
} finally {
  await server.close();
}
