import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
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
  const { calibratedDualFrameProfile } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const { earlyHsbMaterialKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-hsb-material.ts',
  );
  const { REVISED_DUAL_HSB_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/revised-dual-hsb-profiles.ts',
  );
  const report = JSON.parse(await readFile('games/magic/fixtures/accuracy/revised-dual-hsb.json'));
  assert.equal(report.complete, true);
  for (const g of report.groups) {
    assert.deepEqual(REVISED_DUAL_HSB_PROFILES[g.material], {
      asset: g.asset,
      rect: g.rect,
      adjustment: g.adjustment,
    });
    assert.ok(g.cards.filter((c) => c.cohort === 'validation').length >= 5);
    for (const c of ['frame', 'paper']) assert.ok(g.errors.dual[c] < g.errors.current[c]);
  }
  const face = {
    name: 'Probe',
    setCode: '3ed',
    colors: ['G'],
    typeLine: 'Creature',
    colorCalibration: 'set-hsb-v1',
  };
  for (const material of ['W', 'U', 'B', 'R', 'G', 'A']) {
    const profile = calibratedDualFrameProfile({
      ...face,
      colors: [material],
      typeLine: material === 'A' ? 'Artifact' : 'Creature',
    });
    assert.ok(profile, material);
    assert.equal(profile.mask.kind, ['G', 'B'].includes(material) ? 'chroma' : 'rect');
  }
  for (const change of [
    { colorCalibration: undefined },
    { setCode: '4ed' },
    { borderColor: 'black' },
    { frameStyle: 'modern' },
    { layout: 'token' },
    { typeLine: 'Land' },
    { colors: ['W', 'U'] },
  ])
    assert.equal(calibratedDualFrameProfile({ ...face, ...change }), undefined);

  const image = { width: 64, height: 64, data: new Uint8ClampedArray(64 * 64 * 4) };
  const put = (x, y, rgb, alpha = 255) => image.data.set([...rgb, alpha], (y * 64 + x) * 4);
  const frame = [40, 90, 60],
    paper = [180, 150, 100];
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) put(x, y, frame);
  // Jagged paper edge, a shadow entering it, and a disconnected warm fleck.
  for (let y = 24; y < 56; y++) for (let x = 16 + (y % 3); x < 52; x++) put(x, y, paper);
  put(
    20,
    32,
    paper.map((v) => v / 3),
  );
  put(9, 26, paper);
  put(21, 33, [1, 1, 1]);
  put(22, 33, [255, 255, 255]);
  put(23, 33, paper, 0);
  const spec = {
    kind: 'chroma',
    bounds: [0, 0, 1, 1],
    seed: [0.5, 0.5],
    frameRgb: frame.map((v) => v / 255),
    paperRgb: paper.map((v) => v / 255),
  };
  const mask = framePaperMask(image, spec);
  assert.equal(mask[32 * 64 + 20], 1, 'An embedded shadow belongs to the paper');
  assert.equal(mask[26 * 64 + 9], 0, 'A disconnected fleck is not paper');
  assert.equal(mask[30 * 64 + 15], 0);
  assert.equal(mask[30 * 64 + 16], 1);
  const copy = () => ({ ...image, data: image.data.slice() });
  const adjustment = { hueDegrees: 9, saturationScale: 0.7, brightnessScale: 0.85 };
  const single = copy(),
    dual = copy();
  colorFrame(single, adjustment);
  colorFrame(dual, { frame: adjustment, paper: adjustment, mask: spec });
  assert.deepEqual(single.data, dual.data, 'Equal transforms must not introduce a mask seam');
  const split = copy();
  colorFrame(split, {
    frame: adjustment,
    paper: { ...adjustment, brightnessScale: 1.1 },
    mask: spec,
  });
  for (let p = 0; p < 64 * 64; p++) assert.equal(split.data[p * 4 + 3], image.data[p * 4 + 3]);
  for (const x of [21, 22, 23])
    assert.deepEqual(
      split.data.slice((33 * 64 + x) * 4, (33 * 64 + x + 1) * 4),
      image.data.slice((33 * 64 + x) * 4, (33 * 64 + x + 1) * 4),
    );
  const rect = framePaperMask(image, {
    kind: 'rect',
    rect: [0.25, 0.25, 0.5, 0.5],
    feather: 1 / 64,
  });
  assert.equal(rect[32 * 64 + 16], 0.5);
  assert.equal(rect[32 * 64 + 17], 1);
  assert.equal(rect[32 * 64 + 15], 0);
  const profile = calibratedDualFrameProfile(face),
    key = (p) => earlyHsbMaterialKey('pinned-source', 64, 64, p);
  assert.notEqual(
    key(profile),
    key({ ...profile, paper: { ...profile.paper, brightnessScale: 1 } }),
  );
  assert.notEqual(key(profile), key({ ...profile, mask: { ...profile.mask, seed: [0.4, 0.5] } }));
  console.log(
    'Dual HSB: reserved cohorts, source/stock guards, irregular shadows, seam-free equal fits, alpha/ink preservation and cache identity pass.',
  );
} finally {
  await server.close();
}
