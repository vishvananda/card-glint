// Exact optional-adapter compatibility; fresh native renders, never metadata-only refresh.
import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { openBrowser } from './browser.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
const [nativeDirectory, currentFile, correctedDirectory, out] = process.argv.slice(2);
assert(out, 'Usage: profile-preparation-parity.mjs NATIVE CURRENT_INPUTS CORRECTED_HEADER OUT');
const base = '280d715';
const names = execFileSync('git', ['diff', '--name-only', base, '--', 'games/magic/src'], {
  cwd: root,
})
  .toString()
  .trim()
  .split('\n')
  .filter((f) => f.endsWith('.ts'));
const edits = {};
for (const f of names) {
  const before = execFileSync('git', ['show', base + ':' + f], { cwd: root }),
    after = await readFile(path.join(root, f));
  assert.notEqual(hash(before), hash(after));
  edits[f] = { beforeHash: hash(before), afterHash: hash(after), before: before.toString() };
}
const rollback = {
  name: 'exact-before-profile-preparation',
  enforce: 'pre',
  transform(code, id) {
    const file = id.split('?')[0].replace(root, '').replace(/^\//, '');
    const change = edits[file];
    if (!change) return;
    assert.equal(hash(code), change.afterHash, 'Unknown compatibility source: ' + file);
    return change.before;
  },
};
const ssr = async (old) => {
  const s = await createServer({
    root,
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
    plugins: old ? [rollback] : [],
  });
  try {
    await s.ssrLoadModule('/games/magic/src/data/eager.ts');
    const { earlyReprintFrame } = await s.ssrLoadModule(
      '/games/magic/src/presentation/early-reprint-frame.ts',
    );
    const { historicalManaAsset, historicalManaPaperSample } = await s.ssrLoadModule(
      '/games/magic/src/presentation/historical-mana.ts',
    );
    const { retroAssets, retroRects } = await s.ssrLoadModule(
      '/games/magic/src/presentation/retro-frame.ts',
    );
    const { setCalibrationTextureKey } = await s.ssrLoadModule(
      '/games/magic/src/calibration/cache-key.ts',
    );
    const { setCalibrationProfiles } = await s.ssrLoadModule(
      '/games/magic/src/calibration/profiles.ts',
    );
    const profiles = Object.fromEntries(Object.entries(setCalibrationProfiles));
    assert.deepEqual(Object.keys(profiles).sort(), ['4ed', 'chr', 'fem']);
    assert(
      Object.values(profiles).every(
        (p) =>
          !p.dualLand &&
          !p.textTiers &&
          p.footer.artist.prefix === undefined &&
          p.footer.artist.align === undefined &&
          p.footer.artist.baseline === undefined &&
          p.footer.artist.maxWidth === undefined &&
          p.footer.legal.defaultText === undefined,
      ),
    );
    for (const p of Object.values(profiles)) {
      assert.equal(p.mana.sourceInk, undefined);
      assert(Object.values(p.frames).every((f) => !f.stockMaskFrame));
    }
    const rows = [];
    for (const set of [
      'lea',
      'leb',
      '2ed',
      '3ed',
      '4ed',
      'chr',
      'fem',
      'leg',
      'arn',
      'atq',
      'drk',
      'sum',
      'ced',
      'cei',
      'm21',
    ]) {
      const cases = [];
      for (const colors of [[], ['W'], ['U'], ['B'], ['R'], ['G'], ['W', 'U']])
        for (const typeLine of ['Creature', 'Land', 'Artifact'])
          for (const frameColors of [undefined, [], ['W'], ['U'], ['B'], ['R'], ['G'], ['W', 'U']])
            for (const option of [
              {},
              { symbolStyle: 'modern' },
              { wordingMode: 'oracle' },
              { wordingMode: 'oracle', symbolStyle: 'original' },
              { borderColor: 'black' },
              { borderColor: 'white' },
              { frameStyle: 'modern' },
              { frameAssetFamily: 'abu' },
              { layout: 'adventure' },
              { frameTemplate: 'future' },
            ]) {
              const face = {
                name: typeLine === 'Land' ? 'Island' : 'Probe',
                setCode: set,
                typeLine,
                colors,
                frameColors,
                colorCalibration: 'set-hsb-v1',
                wordingMode: 'original',
                ...option,
              };
              const value = {
                frame: earlyReprintFrame(face),
                assets: retroAssets(face),
                rects: retroRects(face),
                key: setCalibrationTextureKey(face),
                mana: ['W', 'U', 'B', 'R', 'G'].map((symbol) => [
                  historicalManaAsset(face, symbol),
                  historicalManaPaperSample(face, symbol),
                ]),
              };
              cases.push(hash(JSON.stringify([face, value])));
            }
      rows.push({ set, count: cases.length, hash: hash(JSON.stringify(cases)) });
    }
    return { profilesHash: hash(JSON.stringify(profiles)), rows };
  } finally {
    await s.close();
  }
};
await mkdir(out);
const beforeMetadata = await ssr(true),
  afterMetadata = await ssr(false);
assert.deepEqual(afterMetadata, beforeMetadata);
console.log(
  'Metadata identical',
  beforeMetadata.rows.reduce((n, r) => n + r.count, 0),
  'cases',
);
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    currentFile,
    path.join(correctedDirectory, 'review.json'),
  ].map((f) => readFile(f)),
);
const [capture, inputs, current, corrected] = raw.map((b) => JSON.parse(b));
assert.equal(inputs.entries.length, 302);
assert.equal(current.entries.length, 302);
const entries = inputs.entries.map((e) => {
  const c = current.entries.find((c) => c.id === e.id);
  assert(c);
  assert.equal(c.reference.sha256, e.reference.sha256);
  assert.equal(c.art.sha256, e.art.sha256);
  return { ...e, face: c.face };
});
const sessions = [],
  rows = [];
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
try {
  for (const old of [true, false]) {
    const session = await openBrowser({ ...inputs, entries }, { plugins: old ? [rollback] : [] });
    sessions.push(session);
    await session.page.evaluate(async () => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
    });
  }
  for (const e of entries) {
    assert.equal(e.face.wordingMode, 'original');
    assert(e.pose.accepted);
    const r = capture.rows.find((r) => r.id === e.id);
    assert.equal(r.poseHash, hash(JSON.stringify(e.pose.transform)));
    const correctedRow = corrected.rows.find((r) => r.id === e.id),
      expected = correctedRow ? correctedRow.correctedFaceHash : r.renderHash;
    const versions = [];
    for (const session of sessions) {
      const raster = await session.page.evaluate(async (e) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        try {
          const layers = {};
          for (const layer of ['face', 'etching']) {
            const image = await composeCardTexture(
              {
                face: e.face,
                printingId: e.id,
                printedImage: null,
                layer: layer === 'face' ? undefined : 'etching',
              },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              layers[layer] = image.toDataURL().split(',')[1];
            } finally {
              image.width = image.height = 0;
            }
          }
          return layers;
        } finally {
          lease.dispose();
        }
      }, e);
      const hashes = Object.fromEntries(
        Object.entries(raster).map(([k, v]) => [k, hash(Buffer.from(v, 'base64'))]),
      );
      assert.equal(
        hashes.face,
        expected,
        'Native optional profile compatibility changed ' + e.name,
      );
      versions.push(hashes);
    }
    assert.deepEqual(versions[0], versions[1], e.name + ' face/etching parity');
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: r.poseHash,
      providedFaceHash: hash(JSON.stringify(e.face)),
      beforeHash: versions[0].face,
      afterHash: versions[1].face,
      expectedHash: expected,
      etchingHash: versions[0].etching,
      identical: true,
      currentOriginalCost: !!correctedRow,
    });
    await writeJson(path.join(out, 'progress.json'), { total: 302, completed: rows.length, rows });
    if (rows.length % 25 === 0)
      console.log('Native face and etching identical', rows.length + '/302');
  }
  for (const session of sessions) assert.deepEqual(session.faults, []);
} finally {
  await Promise.all(sessions.map((s) => s.close()));
}
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  rendererHash,
  'Painter changed during capture',
);
const dependencies = {};
for (const set of ['4ed', 'chr', 'fem']) {
  const f = 'games/magic/src/calibration/sets/' + set + '.ts';
  dependencies[f] = hash(await readFile(path.join(root, f)));
}
const newModules = {};
for (const f of [
  'games/magic/src/calibration/dual-controls.ts',
  'games/magic/src/presentation/early-reprint-dual.ts',
  'games/magic/src/presentation/retro-land-colors.ts',
])
  newModules[f] = hash(await readFile(path.join(root, f)));
await writeJson(path.join(out, 'report.json'), {
  schema: 1,
  status: 'optional-dual-footer-text-profile-adapter-parity-verified',
  base,
  rendererHash,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  files: Object.fromEntries(
    Object.entries(edits).map(([f, e]) => [f, { before: e.beforeHash, after: e.afterHash }]),
  ),
  newModules,
  dependencies,
  sources: Object.fromEntries(
    ['nativeCapture', 'nativeInputs', 'currentInputs', 'correctedHeader'].map((k, i) => [
      k,
      hash(raw[i]),
    ]),
  ),
  metadata: { before: beforeMetadata, after: afterMetadata },
  browser: sessions.map((s) => s.browser.version()),
  scope:
    'Two actual native renderers compare the exact optional-adapter rollback against the current inactive profiles. All 302 Original Unlimited face PNGs match the frozen source, including the reviewed Drain Life header; their actual default etching layers match before/after. Semantic metadata equality covers 25200 cases across fifteen sets. This does not activate the Unlimited profile, certify Oracle or other sets native pixels, or approve a set calibration. New modules and exact edited bytes are bound separately; changed profiles must retain current guards.',
  rows,
});
