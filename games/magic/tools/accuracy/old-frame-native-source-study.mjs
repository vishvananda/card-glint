// Native replay of source candidates. Does not install profiles or fit typography.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, poseFile, exportedDirectory, geometryFiles, out, profileFile, materialMode] =
  process.argv.slice(2);
assert(materialMode === undefined || ['--material-only', '--pilot'].includes(materialMode));
const pilot = materialMode === '--pilot';
const materialOnly = materialMode === '--material-only';
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const assetConfiguration = async () =>
  Object.fromEntries(
    await Promise.all(
      ['assets.json', 'set-symbol-inventory.json', 'symbol-svg-patches.json'].map(async (file) => [
        file,
        hash(await fs.readFile(path.join(root, 'games/magic', file))),
      ]),
    ),
  );
const assetConfigurationBefore = await assetConfiguration();

assert(out, 'Use INPUTS POSES EXPORTED_DIRECTORY GEOMETRY_FILES_COMMA_SEPARATED NEW_OUTPUT');
await fs.mkdir(out);
const ib = await fs.readFile(inputFile),
  pb = await fs.readFile(poseFile);
const input = JSON.parse(ib),
  poses = JSON.parse(pb);
assert.equal(poses.inputHash, hash(ib));
const eb = await fs.readFile(path.join(exportedDirectory, 'inputs.json')),
  exported = JSON.parse(eb);
assert.equal(exported.inputHash, hash(ib));
const reports = [];
for (const f of geometryFiles === '-' ? [] : geometryFiles.split(',')) {
  const raw = await fs.readFile(f),
    data = JSON.parse(raw);
  assert.equal(data.status, 'shared-source-geometry-candidates-not-adopted');
  reports.push({ hash: hash(raw), results: data.results });
}
const candidates = reports.flatMap((r) => r.results);
const sources = await Promise.all(
  [...new Set(candidates.map((c) => c.asset.url))].map((url) =>
    cachedFetch(url, { offline: true }),
  ),
);
for (const suffix of ['old/abu/border.svg', 'old/fourth/borderBlack.png']) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
  sources.push(await cachedFetch(manifest.RETRO_ROOT + '/img/frames/' + suffix, { offline: true }));
}
for (const c of candidates)
  assert.equal(
    sources.find((a) => a.url === c.asset.url).sha256,
    c.asset.sourceSha256 ?? c.asset.sha256,
  );
const profileBytes = profileFile ? await fs.readFile(profileFile) : undefined;
const candidateProfile = profileBytes ? JSON.parse(profileBytes) : undefined;
if (candidateProfile) assert.equal(candidateProfile.set, input.set);
if (geometryFiles === '-') {
  assert(candidateProfile, 'Profile-only replay requires an explicit profile');
  for (const url of new Set(
    Object.values(candidateProfile.colors).map((c) => JSON.parse(c.source)[0]),
  ))
    sources.push(await cachedFetch(url, { offline: true }));
}

if (candidateProfile?.setSymbolSource === 'keyrune') {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
  sources.push(
    await cachedFetch(manifest.KEYRUNE_ROOT + '/' + input.set + '.svg', { offline: true }),
  );
}
if (candidateProfile?.basicSymbol?.originalLetters) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
  for (const color of 'wubrg')
    sources.push(
      await cachedFetch(manifest.RETRO_ROOT + '/img/frames/m15/basics/' + color + '.png', {
        offline: true,
      }),
    );
}
const selected = [];
for (const key of new Set(exported.rows.map((r) => r.key))) {
  for (const cohort of ['calibration', 'validation', 'development']) {
    const group = exported.rows.filter((r) => r.accepted && r.key === key && r.cohort === cohort);
    if (group.length) selected.push(group[0]);
  }
}
if (candidateProfile && !materialOnly && !pilot)
  selected.splice(0, selected.length, ...exported.rows);
if (materialOnly) {
  const seen = new Set();
  const unique = selected.filter((r) => !seen.has(r.key) && seen.add(r.key));
  selected.splice(0, selected.length, ...unique);
}
const module = 'games/magic/src/calibration/profiles.ts';
const before = await fs.readFile(path.join(root, module)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
let transformHash;
const session = await openBrowser(
  { ...input, components: [...input.components, ...sources] },
  {
    plugins: [
      {
        name: 'isolated-source-profile-replay',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/' + module)) return;
          assert.equal(hash(code), hash(before));
          const needle =
            'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
          assert.equal(code.split(needle).length, 2);
          const next = code.replace(
            needle,
            'return (globalThis as any).__sourceStudyProfile?.set === set ? (globalThis as any).__sourceStudyProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;',
          );
          transformHash = hash(next);
          return next;
        },
      },
    ],
  },
);
const rows = [],
  profiles = {};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    await document.fonts.ready;
  });
  const base = await session.page.evaluate(
    async () => (await import('/games/magic/src/calibration/sets/4ed.ts')).profile,
  );
  const materialKey = (key) => (key.length === 2 && key.endsWith('L') ? 'L-' + key[0] : key);
  for (const family of new Set(candidates.map((c) => c.family))) {
    const p = structuredClone(base);
    p.set = input.set;
    p.border = 'black';
    p.revision = 1;
    p.frames = {};
    p.colors = {};
    for (const c of candidates.filter((c) => c.family === family)) {
      assert(c.art, 'Candidate has no measured illustration aperture');
      const actualFamily = family === 'seventh-mirage' ? 'seventh' : family;
      const assetKey =
        family === 'mse-old'
          ? c.asset.url.split('/').at(-1).replace('card.jpg', '')
          : c.asset.url.split('/').at(-1).replace('.png', '');
      const key = materialKey(c.key);
      p.frames[key] = {
        family: actualFamily,
        assetKey,
        frame: c.frame,
        art: c.art,
        stockWindow: [24 / 488, 26 / 680, 440 / 488, 627 / 680],
      };
      const pigment = key === 'L' ? 'L-red' : key;
      p.colors[pigment] = {
        source: JSON.stringify([c.asset.url, c.frame]),
        stock: '#101010',
        adjustment: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
      };
    }
    profiles[family] = p;
  }
  if (candidateProfile) profiles.candidate = candidateProfile;
  await writeJson(path.join(out, 'profiles.json'), profiles);
  for (const r of selected) {
    const originalEntry = input.entries.find((e) => e.id === r.id);
    const e = materialOnly
      ? { ...originalEntry, face: { ...originalEntry.face, rulesText: '', rulesParagraphs: [] } }
      : originalEntry;
    assert.equal(e.face.wordingMode, 'original');
    for (const c of candidateProfile
      ? [{ family: 'candidate' }]
      : candidates.filter((c) => c.key === r.key)) {
      const profile = profiles[c.family],
        profileHash = hash(JSON.stringify(profile));
      const result = await session.page.evaluate(
        async ({ e, profile }) => {
          globalThis.__sourceStudyProfile = profile;
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { canvasAssetUrls } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
          const signal = new AbortController().signal;
          const lease = await loadAccuracyImages(
            canvasAssetUrls(e.face),
            signal,
            e.face.illustration,
          );
          let image;
          try {
            image = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            return {
              png: image.toDataURL().split(',')[1],
              width: image.width,
              height: image.height,
            };
          } finally {
            if (image) image.width = image.height = 0;
            lease.dispose();
          }
        },
        { e, profile },
      );
      const png = Buffer.from(result.png, 'base64'),
        file = c.family + '-' + e.id + '.png';
      await fs.writeFile(path.join(out, file), png);
      rows.push({
        id: e.id,
        name: e.name,
        key: r.key,
        cohort: r.cohort,
        family: c.family,
        file,
        sha256: hash(png),
        width: result.width,
        height: result.height,
        profileHash,
        accepted: r.accepted,
        inputHash: hash(JSON.stringify(e.face)),
        referenceHash: e.reference.sha256,
        normalizedReferenceHash: r.normalizedHash,
      });
      console.log(input.set, rows.length, c.family, e.name);
    }
    if (r.accepted) {
      const scan = await fs.readFile(path.join(exportedDirectory, e.id + '.png'));
      assert.equal(hash(scan), r.normalizedHash);
      await fs.writeFile(path.join(out, e.id + '-scan.png'), scan);
    }
  }
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
  assert.equal(
    toolHash,
    hash(await fs.readFile(new URL(import.meta.url))),
    'Capture tool changed during execution',
  );
  assert.deepEqual(
    await assetConfiguration(),
    assetConfigurationBefore,
    'Asset configuration changed during capture',
  );
  await writeJson(path.join(out, 'capture.json'), {
    schema: 1,
    complete: true,
    set: input.set,
    source: {
      assetConfiguration: assetConfigurationBefore,
      rendererHash,
      ...(profileBytes ? { profileHash: hash(profileBytes) } : {}),
      materialOnly,
      pilot,
      inputHash: hash(ib),
      posesHash: hash(pb),
      exportedHash: hash(eb),
      geometryHashes: reports.map((r) => r.hash),
      toolHash,
      transform: { before: hash(before), after: transformHash },
    },
    scope: materialOnly
      ? 'Native clean material controls with visible body text explicitly empty. These are not full-card accuracy faces.'
      : candidateProfile && pilot
        ? 'Native profile pilot on frozen material/name cohorts. Original wording is preserved; no profile installed or set approved.'
        : candidateProfile
          ? 'Full-inventory native profile candidate; rejected scan poses do not prevent rendering, but remain excluded from comparison. Original wording is frozen. No profile installed or set approved.'
          : 'Native source candidates with identical Fourth typography as an unfitted control, neutral color adjustments, Original wording and frozen scan poses. One printing per material/cohort; small cohorts development-only. No profile installed or set approved.',
    rows,
    faults: session.faults,
  });
} finally {
  await session.close();
}
