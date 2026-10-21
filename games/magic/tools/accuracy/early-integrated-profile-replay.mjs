// Complete-profile study, through the production painter with exact default controls.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
import { createServer } from 'vite';
const [nativeDirectory, currentFile, correctionDirectory, profileFile, out, mode = 'pilot'] =
  process.argv.slice(2);
assert(
  out,
  'Usage: early-integrated-profile-replay.mjs NATIVE CURRENT_INPUTS HEADER_CORRECTION PROFILE OUT [pilot|all]',
);
assert(['pilot', 'all'].includes(mode));
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    currentFile,
    path.join(correctionDirectory, 'review.json'),
    profileFile,
  ].map((f) => readFile(f)),
);
const [capture, inputs, current, corrected, profile] = raw.map((b) => JSON.parse(b));
assert.equal(inputs.entries.length, 302);
assert.equal(current.entries.length, 302);
assert.equal(profile.set, '2ed');
const ssr = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
try {
  const { checkSetProfile } = await import('./set-profile-check.mjs');
  const manifest = JSON.parse(await readFile(path.join(root, 'games/magic/assets.json')));
  checkSetProfile(
    profile,
    {
      revision: profile.revision,
      evidence: ['complete-profile-study'],
      scope: 'Unlimited integration candidate',
    },
    manifest,
  );
} finally {
  await ssr.close();
}
const entries = inputs.entries.map((e) => {
  const c = current.entries.find((c) => c.id === e.id);
  assert.equal(c.reference.sha256, e.reference.sha256);
  assert.equal(c.art.sha256, e.art.sha256);
  assert.equal(c.face.wordingMode, 'original');
  assert(e.pose.accepted);
  return { ...e, face: c.face };
});
const module = 'games/magic/src/calibration/profiles.ts',
  moduleHash = hash(await readFile(path.join(root, module))),
  transformed = {};
const source = {
  schema: 1,
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  currentInputsHash: hash(raw[2]),
  headerReviewHash: hash(raw[3]),
  profileHash: hash(raw[4]),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    'Native complete-profile candidate study; fixed Original words and independently normalized scans. Exact current default face controls precede every candidate. No scan or card-specific renderer offsets, runtime promotion, Oracle certification, or set completion is implied.',
};
await mkdir(out, { recursive: true });
let rows = [];
try {
  const prior = JSON.parse(await readFile(path.join(out, 'capture.json')));
  assert.deepEqual(
    prior.source,
    source,
    'Different candidate/source requires a new output directory',
  );
  rows = prior.rows;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const pilotNames = new Set([
  'Animate Wall',
  'Counterspell',
  'Dark Ritual',
  'Lightning Bolt',
  'Giant Growth',
  'Black Lotus',
  'Plains',
  'Mountain',
  'Forest',
  'Bayou',
  'Tundra',
  'Volcanic Island',
]);
const selected = mode === 'all' ? entries : entries.filter((e) => pilotNames.has(e.name));
const session = await openBrowser(
  { ...inputs, entries },
  {
    plugins: [
      {
        name: 'typed-profile-integration-study',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/' + module)) return;
          assert.equal(hash(code), moduleHash);
          const needle =
            'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
          assert.equal(code.split(needle).length, 2);
          const after = code.replace(
            needle,
            "return set === '2ed' && (globalThis as any).__integratedProfile ? (globalThis as any).__integratedProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;",
          );
          transformed[module] = { before: hash(code), after: hash(after) };
          return after;
        },
      },
    ],
  },
);
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of selected) {
    const previous = rows.find((r) => r.id === e.id);
    if (previous) {
      for (const [variant, layers] of Object.entries(previous.rasters))
        for (const [layer, digest] of Object.entries(layers))
          assert.equal(
            hash(
              await readFile(
                path.join(out, variant, e.id + (layer === 'face' ? '' : '-etching') + '.png'),
              ),
            ),
            digest,
          );
      continue;
    }
    const baseline = capture.rows.find((r) => r.id === e.id);
    assert.equal(baseline.poseHash, hash(JSON.stringify(e.pose.transform)));
    const header = corrected.rows.find((r) => r.id === e.id),
      expected = header ? header.correctedFaceHash : baseline.renderHash;
    const scan = await readFile(path.join(nativeDirectory, '2ed', e.id + '-scan.png'));
    assert.equal(hash(scan), baseline.scanHash);
    const rendered = await session.page.evaluate(
      async ({ e, profile }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { earlyReprintFrame } = await import(
          '/games/magic/src/presentation/early-reprint-frame.ts'
        );
        const { printingCalibrationMaterials } = await import(
          '/games/magic/src/presentation/printing-calibration-materials.ts'
        );
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const urls = [];
        for (const candidate of [undefined, profile]) {
          globalThis.__integratedProfile = candidate;
          urls.push(...canvasAssetUrls(e.face));
        }
        const lease = await loadAccuracyImages(
          urls,
          new AbortController().signal,
          e.face.illustration,
        );
        const variants = {};
        try {
          for (const [variant, candidate] of [
            ['current', undefined],
            ['candidate', profile],
          ]) {
            globalThis.__integratedProfile = candidate;
            const frame = earlyReprintFrame(e.face);
            if (candidate && !frame) throw Error('Complete profile did not select ' + e.name);
            const values = {};
            let body;
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
                values[layer] = image.toDataURL().split(',')[1];
                if (layer === 'face') {
                  const layout = retroTextLayout(image.getContext('2d'), e.face);
                  body = layout
                    ? {
                        size: layout.size,
                        overflow: layout.overflow,
                        horizontalScale: layout.horizontalScale ?? 1,
                        lines: layout.lines.map((l) => ({
                          role: l.role,
                          text: l.runs.map((r) => r.text).join(''),
                          baseline: l.baseline,
                          inkBounds: l.inkBounds,
                        })),
                      }
                    : null;
                }
              } finally {
                image.width = image.height = 0;
              }
            }
            variants[variant] = {
              ...values,
              body,
              frame,
              materials: printingCalibrationMaterials(e.face).materials,
            };
          }
          return variants;
        } finally {
          delete globalThis.__integratedProfile;
          lease.dispose();
        }
      },
      { e, profile },
    );
    assert.equal(
      hash(Buffer.from(rendered.current.face, 'base64')),
      expected,
      'Changed current control: ' + e.name,
    );
    const rasters = {};
    for (const [variant, values] of Object.entries(rendered)) {
      await mkdir(path.join(out, variant), { recursive: true });
      rasters[variant] = {};
      for (const layer of ['face', 'etching']) {
        const bytes = Buffer.from(values[layer], 'base64');
        rasters[variant][layer] = hash(bytes);
        await writeFile(
          path.join(out, variant, e.id + (layer === 'face' ? '' : '-etching') + '.png'),
          bytes,
        );
      }
    }
    const row = {
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: e.pose.cohort,
      referenceHash: e.reference.sha256,
      poseHash: baseline.poseHash,
      scanHash: baseline.scanHash,
      currentFaceInputHash: hash(JSON.stringify(e.face)),
      baselineParity: true,
      rasters,
      body: { current: rendered.current.body, candidate: rendered.candidate.body },
      selectedFrame: rendered.candidate.frame,
      appliedMaterials: rendered.candidate.materials,
      etchingUnchanged: rasters.current.etching === rasters.candidate.etching,
    };
    rows.push(row);
    await writeFile(path.join(out, e.id + '-scan.png'), scan);
    await writeJson(path.join(out, 'capture.json'), {
      source,
      transformed,
      status:
        rows.length === 302
          ? 'complete-profile-native-study-complete'
          : 'complete-profile-native-study-in-progress',
      denominator: 302,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/302 ' + e.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  source.rendererHash,
  'Painter changed during full-profile replay',
);
await writeJson(path.join(out, 'inputs.json'), { ...inputs, entries, profile, source });
console.log(
  JSON.stringify({
    completed: rows.length,
    denominator: 302,
    mode,
    overflow: rows.filter((r) => r.body.candidate?.overflow).map((r) => r.name),
  }),
);
