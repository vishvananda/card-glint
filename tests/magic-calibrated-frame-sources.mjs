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
  const warped = {
    ...profile.frames.U,
    family: 'mse-old',
    frame: [0, 0, 1, 1],
    art: [0.13, 0.105, 0.74, 0.435],
    artWindow: { source: [0.12, 0.095, 0.76, 0.45], lowerAnchor: 0.59 },
  };
  const calls = [];
  const context = Object.fromEntries(
    ['save', 'beginPath', 'rect', 'clip', 'drawImage', 'restore'].map((name) => [
      name,
      (...args) => calls.push([name, ...args]),
    ]),
  );
  const image = { width: 375, height: 523 };
  const paint = (f) => {
    calls.length = 0;
    paintRetroFramePlate(context, image, f.frame, f);
    return calls;
  };
  paint(warped);
  const draws = calls.filter(([k]) => k === 'drawImage');
  assert.equal(draws.length, 5);
  assert.deepEqual(
    draws[0],
    ['drawImage', image, 0, 0, 488, 680],
    'Below the anchor, retain the same whole-source affine sampling',
  );
  const hole = warped.art.map((v, i) => v * (i % 2 === 0 ? 488 : 680));
  const [hx, hy, hw, hh] = hole;
  let area = 488 * 680 * (1 - warped.artWindow.lowerAnchor);
  for (const d of draws.slice(1)) {
    const [x, y, w, h] = d.slice(6);
    assert(w > 0 && h > 0);
    const ix = Math.max(0, Math.min(x + w, hx + hw) - Math.max(x, hx));
    const iy = Math.max(0, Math.min(y + h, hy + hh) - Math.max(y, hy));
    assert(ix * iy < 1e-8, 'Opaque source placeholder entered the artwork opening');
    area += w * h;
  }
  assert(Math.abs(area - (488 * 680 - hw * hh)) < 1e-7);
  assert.equal(
    calls.filter(([k]) => k === 'save').length,
    calls.filter(([k]) => k === 'restore').length,
  );
  paint({ ...warped, family: 'seventh' });
  assert.equal(
    calls.filter(([k]) => k === 'drawImage').length,
    6,
    'Transparent source centers retain their baked corner pixels',
  );
  const zero = {
    ...warped,
    art: [45 / 375, 51 / 523, 286 / 375, 233 / 523],
    artWindow: { source: [45 / 375, 51 / 523, 286 / 375, 233 / 523], lowerAnchor: 0.59 },
  };
  paint(zero);
  assert.equal(
    calls.filter(([k]) => k === 'drawImage').length,
    1,
    'Identity remaps retain the direct baseline',
  );
  const p = structuredClone(profile);
  p.frames.U = warped;
  p.colors.U.source = JSON.stringify([calibratedFrameSource(warped), warped.frame]);
  checkSetProfile(p, review, manifest);
  for (const bad of [
    { ...warped, artWindow: { ...warped.artWindow, lowerAnchor: 0.5 } },
    { ...warped, artWindow: { ...warped.artWindow, source: [0, 0.1, 0.8, 0.4] } },
    { ...warped, art: [0.13, 0.3, 0.74, 0.4] },
  ]) {
    assert.throws(() => paint(bad), /art-window/);
    assert.equal(calls.length, 0, 'Invalid geometry mutated the canvas before validation');
    const invalid = structuredClone(p);
    invalid.frames.U = bad;
    assert.throws(() => checkSetProfile(invalid, review, manifest));
  }
  console.log(
    'Pinned ABU/Fourth/Seventh/MSE sources validate consistently; opaque MSE image fields are clipped at their transformed source rectangle without mutating the source.',
  );
} finally {
  await server.close();
}
