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
  const { DUAL_HSB_PROFILES } = await server.ssrLoadModule(
    '/games/magic/src/presentation/old-dual-hsb-profiles.ts',
  );
  const current = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/old-dual-hsb-results.json'),
  );
  for (const [key, profile] of Object.entries(DUAL_HSB_PROFILES)) {
    const [setCode, borderColor, m] = key.split('-'),
      basic = { WL: 'Plains', UL: 'Island', BL: 'Swamp', RL: 'Mountain', GL: 'Forest' }[m];
    const f = {
      ...face,
      setCode,
      borderColor,
      frameStyle: 'retro',
      colors: /^[WUBRG]$/.test(m) ? [m] : m === 'M' || m === 'LEGENDSFRAMEM' ? ['W', 'U'] : [],
      typeLine: basic
        ? 'Land — ' + basic
        : m === 'L'
          ? 'Land'
          : m === 'A'
            ? 'Artifact'
            : 'Creature',
    };
    const actual = calibratedDualFrameProfile(f);
    if (setCode === 'leg') assert.equal(actual, undefined, key + ' obsolete source/geometry');
    else if (profile.asset.endsWith('/old/fourth/w.png')) {
      assert.deepEqual(actual.frame, profile.adjustment.frame);
      assert.deepEqual(actual.paper, profile.adjustment.paper);
      assert.deepEqual(actual.mask, {
        kind: 'rect',
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500,
      });
    } else assert.deepEqual(actual, profile.adjustment, key);
    for (const change of [
      { colorCalibration: undefined },
      { setCode: 'unknown' },
      { layout: 'token' },
      { frameStyle: 'modern' },
    ])
      assert.equal(calibratedDualFrameProfile({ ...f, ...change }), undefined);
    if (setCode === '3ed') assert.deepEqual(profile, REVISED_DUAL_HSB_PROFILES[m]);
    else
      assert.ok(
        current.groups.some(
          (g) =>
            g.status === 'trial' &&
            g.set === setCode &&
            g.border === borderColor &&
            g.source.asset === profile.asset,
        ),
      );
  }
  const { DUAL_MANA_TARGETS } = await server.ssrLoadModule(
    '/games/magic/src/presentation/old-dual-hsb-profiles.ts',
  );
  const scope = JSON.parse(await readFile('games/magic/fixtures/accuracy/hsb-printing-scope.json'));
  for (const key of scope.excludedFrameKeys)
    assert.equal(DUAL_HSB_PROFILES[key], undefined, 'Foil-only frame cohort was adopted');
  for (const key of scope.excludedManaKeys)
    assert.equal(DUAL_MANA_TARGETS[key], undefined, 'Foil-only mana cohort was adopted');
  for (const setCode of ['usg', 'uds'])
    assert.ok(
      calibratedDualFrameProfile({ ...face, setCode, colors: ['W'] }),
      setCode + ' white regression',
    );

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
  const whiteAt = (33 * 64 + 22) * 4;
  for (let i = 0; i < single.data.length; i++)
    if (i < whiteAt || i >= whiteAt + 3)
      assert.equal(single.data[i], dual.data[i], 'Equal transforms must not introduce a mask seam');
  assert.deepEqual(
    [...single.data.slice(whiteAt, whiteAt + 3)],
    [255, 255, 255],
    'White mana details stay intact',
  );
  assert.deepEqual(
    [...dual.data.slice(whiteAt, whiteAt + 3)],
    [217, 217, 217],
    'Frame highlights follow brightness rather than becoming false relief',
  );
  const split = copy();
  colorFrame(split, {
    frame: adjustment,
    paper: { ...adjustment, brightnessScale: 1.1 },
    mask: spec,
  });
  for (let p = 0; p < 64 * 64; p++) assert.equal(split.data[p * 4 + 3], image.data[p * 4 + 3]);
  for (const x of [21, 23])
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
  const profile = REVISED_DUAL_HSB_PROFILES.G.adjustment,
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
