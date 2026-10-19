import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';

const server = await createServer({ configFile: false, server: { middlewareMode: true } });
try {
  const { earlyReprintFrame } = await server.ssrLoadModule(
      '/games/magic/src/presentation/early-reprint-frame.ts',
    ),
    { earlyReprintColors } = await server.ssrLoadModule(
      '/games/magic/src/presentation/early-reprint-colors.ts',
    ),
    { earlyReprintFooter } = await server.ssrLoadModule(
      '/games/magic/src/presentation/early-reprint-footer.ts',
    ),
    { retroDualFrame } = await server.ssrLoadModule(
      '/games/magic/src/presentation/retro-dual-frame.ts',
    ),
    { profile, review } = await server.ssrLoadModule('/games/magic/src/calibration/sets/2ed.ts'),
    { createSetCalibrationCandidate } = await server.ssrLoadModule(
      '/games/magic/src/calibration/editor.ts',
    );
  const base = {
    name: 'Printing probe',
    setCode: '2ed',
    frameStyle: 'retro',
    borderColor: 'white',
    colorCalibration: 'set-hsb-v1',
    wordingMode: 'original',
    symbolStyle: 'original',
  };
  assert.equal(review.revision, profile.revision);
  assert.equal(Object.keys(profile.frames).length, 7);
  for (const colors of [...'WUBRG']
    .map((c) => [c])
    .concat([...'WUBRG'].flatMap((c, i, all) => all.slice(i + 1).map((d) => [c, d])))) {
    const face = { ...base, typeLine: 'Land', land: true, colors: [], frameColors: colors },
      frame = earlyReprintFrame(face),
      dual = retroDualFrame(face),
      pigment = earlyReprintColors(face);
    assert.equal(frame.material, 'L');
    assert.equal(frame.stockWindow, undefined);
    assert.deepEqual(frame.frame, profile.frames.L.frame);
    assert.equal(frame.asset, dual?.base ?? frame.asset);
    if (!dual) assert.ok(frame.asset.endsWith(`/${colors[0].toLowerCase()}l.png`));
    assert.deepEqual(
      Object.keys(pigment.materials).sort(),
      [frame.asset, ...(dual ? [dual.overlay] : [])].sort(),
    );
    const proposal = createSetCalibrationCandidate('2ed', profile.revision, {
      'frames.L.frame.0': profile.frames.L.frame[0] + 0.001,
    });
    const moved = { ...face, setCalibrationCandidate: proposal },
      movedFrame = earlyReprintFrame(moved),
      movedPigment = earlyReprintColors(moved);
    assert.equal(movedFrame.frame[0], frame.frame[0] + 0.001);
    assert.deepEqual(
      Object.keys(movedPigment.materials).sort(),
      Object.keys(pigment.materials).sort(),
    );
    assert.equal(earlyReprintFooter(face).artistPrefix, 'Illus. © ');
    assert.equal(earlyReprintFooter(face).legalText, '');
    assert.equal(
      earlyReprintFooter({ ...face, legalText: 'Host credit' }).legalText,
      'Host credit',
    );
  }
  for (const setCode of ['lea', 'leb'])
    assert.equal(
      earlyReprintFrame({ ...base, setCode, typeLine: 'Summon Wolf', colors: ['G'] }),
      undefined,
    );
  assert.equal(
    earlyReprintFrame({ ...base, typeLine: 'Summon Wolf', colors: ['G'], borderColor: 'black' }),
    undefined,
  );
} finally {
  await server.close();
}
console.log(
  'Unlimited one-file profile: basic/dual palette binding, shared geometry, original footer vocabulary and caller overrides pass.',
);
