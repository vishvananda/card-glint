import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

// Virtual profile data exercises optional capabilities without activating a set.
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
  plugins: [
    {
      name: 'optional-profile-fixture',
      enforce: 'pre',
      transform(source, id) {
        if (!id.endsWith('/calibration/profiles.ts')) return;
        const needle =
          'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
        assert.equal(source.split(needle).length, 2);
        return source.replace(
          needle,
          "return set === '2ed' ? (globalThis as any).__optionalProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;",
        );
      },
    },
  ],
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { profile: base } = await server.ssrLoadModule('/games/magic/src/calibration/sets/4ed.ts');
  const { earlyReprintFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-frame.ts',
  );
  const { earlyReprintColors } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-colors.ts',
  );
  const { earlyReprintFooter } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-footer.ts',
  );
  const { retroDualFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-dual-frame.ts',
  );
  const { createSetCalibrationCandidate, resolveSetCalibrationCandidate } =
    await server.ssrLoadModule('/games/magic/src/calibration/editor.ts');
  const manifest = JSON.parse(
    await readFile(new URL('../games/magic/assets.json', import.meta.url)),
  );
  const sourceRoot = manifest.RETRO_ROOT + '/img/frames/old/abu/';
  const geometry = {
    family: 'abu',
    assetKey: 'wl',
    frame: [0, 0, 1, 1],
    art: [0.1, 0.1, 0.8, 0.45],
    stockWindow: [0.04, 0.04, 0.92, 0.92],
    stockMaskFrame: [0, 0, 1, 1],
  };
  const source = (color) => sourceRoot + color.toLowerCase() + 'l.png';
  const neutral = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
  const data = {
    // Only the two synthetic frames below are available in this adapter probe.
    ...structuredClone(base),
    revision: 1,
    set: '2ed',
    bodyClasses: undefined,
    frames: { W: base.frames.W, 'L-dual': geometry },
    colors: {
      'L-dual': {
        source: JSON.stringify([source('W'), geometry.frame]),
        stock: '#ffffff',
        adjustment: neutral,
      },
    },
    dualLand: {
      stock: '#ffffff',
      sources: Object.fromEntries(
        [...'WUBRG'].map((c) => [
          c,
          { source: JSON.stringify([source(c), geometry.frame]), adjustment: neutral },
        ]),
      ),
      outlines: { WU: 'W', UR: 'U' },
      pinline: {
        box: { left: 188, right: 1324, top: 1253, bottom: 1871 },
        width: { left: 25, right: 25, top: 25, bottom: 25 },
        palette: Object.fromEntries([...'WUBRG'].map((c) => [c, [0.2, 0.3, 0.4]])),
        edge: [0.18, 0.18, 0.17],
      },
    },
    footer: {
      ...structuredClone(base.footer),
      artist: {
        ...base.footer.artist,
        prefix: 'Illus. © ',
        align: 'left',
        baseline: 'alphabetic',
        maxWidth: 338,
      },
      legal: { ...base.footer.legal, defaultText: '' },
    },
    textTiers: {
      mediumSize: 22.5,
      denseWidth: 1,
      transferAlphaModel: true,
      centeredDx: -6.5,
      regularWidthDelta: 8,
      regularDx: -2,
      retainRegularAboveLines: 7,
    },
  };
  const { checkSetProfile } = await import('../games/magic/tools/accuracy/set-profile-check.mjs');
  checkSetProfile(
    data,
    { revision: 1, evidence: ['synthetic-adapter-fixture'], scope: 'Adapter invariants only' },
    manifest,
  );
  const invalid = structuredClone(data);
  invalid.dualLand.sources.G.source = 'stale';
  assert.throws(
    () =>
      checkSetProfile(invalid, { revision: 1, evidence: ['fixture'], scope: 'fixture' }, manifest),
    /Stale dual source/,
  );
  globalThis.__optionalProfile = data;
  const face = {
    name: 'Tundra',
    setCode: '2ed',
    typeLine: 'Land',
    canonicalTypeLine: 'Land — Plains Island',
    frameColors: ['W', 'U'],
    land: true,
    colorCalibration: 'set-hsb-v1',
  };
  const frame = earlyReprintFrame(face);
  assert.equal(frame.material, 'L-dual');
  assert.equal(frame.asset, source('U'));
  assert.equal(frame.dual.overlay, source('W'));
  assert.equal(frame.dual.outline, source('W'));
  assert.deepEqual(earlyReprintColors(face), {
    materials: { [source('U')]: neutral, [source('W')]: neutral },
    stock: '#ffffff',
  });
  assert.deepEqual(retroDualFrame(face), frame.dual);
  assert.equal(earlyReprintFooter(face).legalText, '');
  assert.equal(earlyReprintFooter({ ...face, legalText: 'Host legal' }).legalText, 'Host legal');
  assert.equal(earlyReprintFooter(face).artist.prefix, 'Illus. © ');
  assert.equal(earlyReprintColors({ ...face, colorCalibration: undefined }), undefined);
  assert.equal(earlyReprintFrame({ ...face, frameTemplate: 'future' }), undefined);
  assert.equal(earlyReprintFrame({ ...face, frameAssetFamily: 'abu' }), undefined);
  assert.equal(earlyReprintFrame({ ...face, borderColor: 'black' }), undefined);
  assert.equal(earlyReprintFrame({ ...face, layout: 'adventure' }), undefined);
  assert.equal(
    earlyReprintFrame({ ...face, name: 'Volcanic Island', frameColors: ['U', 'R'] }).dual.outline,
    source('U'),
  );
  const moved = createSetCalibrationCandidate('2ed', 1, { 'frames.L-dual.frame.0': 0.005 });
  const resolved = resolveSetCalibrationCandidate(moved);
  for (const material of Object.values(resolved.dualLand.sources))
    assert.equal(JSON.parse(material.source)[1][0], 0.005);
  assert.equal(earlyReprintFrame({ ...face, setCalibrationCandidate: moved }).frame[0], 0.005);
  assert.throws(
    () => createSetCalibrationCandidate('2ed', 1, { 'textTiers.retainRegularAboveLines': 2.5 }),
    /density/,
  );
  assert.throws(
    () => createSetCalibrationCandidate('2ed', 1, { 'dualLand.sources.W.source': 'arbitrary URL' }),
    /Unsupported calibration control/,
  );
  globalThis.__optionalProfile = {
    ...data,
    dualLand: { ...data.dualLand, sources: { ...data.dualLand.sources, G: undefined } },
  };
  assert.equal(
    earlyReprintFrame(face),
    undefined,
    'A partial material set must not activate the new dual geometry',
  );
  globalThis.__optionalProfile = {
    ...data,
    frames: { ...data.frames, 'L-dual': { ...geometry, frame: [0.01, 0, 1, 1] } },
  };
  assert.equal(
    earlyReprintFrame(face),
    undefined,
    'Stale source placement must bypass the whole dual adapter',
  );
  console.log(
    'Optional dual materials, independent outlines, footer defaults, host opt-outs and source-bound editor proposals pass',
  );
} finally {
  delete globalThis.__optionalProfile;
  await server.close();
}
