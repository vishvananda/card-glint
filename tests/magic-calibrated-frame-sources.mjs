import assert from 'node:assert/strict';
import manifest from '../games/magic/assets.json' with { type: 'json' };
import { createServer } from './magic-vite.mjs';
import { checkSetProfile } from '../games/magic/tools/accuracy/set-profile-check.mjs';
const server = await createServer({ configFile: false, server: { middlewareMode: true } });
try {
  const { calibratedFrameSource, calibratedFrameImageWindow } = await server.ssrLoadModule(
    '/games/magic/src/calibration/frame-source.ts',
  );
  const { paintRetroFramePlate } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame-plate.ts',
  );
  const { profile, review } = await server.ssrLoadModule(
    '/games/magic/src/calibration/sets/4ed.ts',
  );
  for (const family of ['abu', 'fourth', 'seventh', 'mse-old']) {
    const f = { ...profile.frames.U, family, frame: [0.01, 0.02, 0.98, 0.97] };
    const source = calibratedFrameSource(f);
    assert(
      source.startsWith(family === 'mse-old' ? manifest.MSE_TEMPLATE_ROOT : manifest.RETRO_ROOT),
    );
    const p = structuredClone(profile);
    p.frames.U = f;
    p.colors.U.source = JSON.stringify([source, f.frame]);
    checkSetProfile(p, review, manifest);
    const calls = [];
    const c = Object.fromEntries(
      ['save', 'beginPath', 'rect', 'clip', 'drawImage', 'restore'].map((name) => [
        name,
        (...args) => calls.push([name, ...args]),
      ]),
    );
    const image = { width: 375, height: 523 };
    paintRetroFramePlate(c, image, f.frame, f);
    assert.equal(calls.filter(([k]) => k === 'drawImage').length, 1);
    if (family === 'mse-old') {
      assert.deepEqual(
        calls.map(([k]) => k),
        ['save', 'beginPath', 'rect', 'rect', 'clip', 'drawImage', 'restore'],
      );
      assert.deepEqual(
        calls.find(([k]) => k === 'clip'),
        ['clip', 'evenodd'],
      );
      const hole = calibratedFrameImageWindow(f);
      assert.deepEqual(hole, [
        0.01 + (45 / 375) * 0.98,
        0.02 + (51 / 523) * 0.97,
        (286 / 375) * 0.98,
        (233 / 523) * 0.97,
      ]);
      assert.deepEqual(calls.filter(([k]) => k === 'rect')[1], [
        'rect',
        hole[0] * 488,
        hole[1] * 680,
        hole[2] * 488,
        hole[3] * 680,
      ]);
    } else {
      assert.equal(calibratedFrameImageWindow(f), undefined);
      assert.equal(
        calls.length,
        1,
        'Existing transparent sources must keep their direct draw path',
      );
    }
  }
  assert.equal(
    calibratedFrameSource({ family: 'seventh', assetKey: 'lMirage' }),
    manifest.RETRO_ROOT + '/img/frames/seventh/regular/lMirage.png',
  );
  console.log(
    'Pinned ABU/Fourth/Seventh/MSE sources validate consistently; opaque MSE image fields are clipped at their transformed source rectangle without mutating the source.',
  );
} finally {
  await server.close();
}
