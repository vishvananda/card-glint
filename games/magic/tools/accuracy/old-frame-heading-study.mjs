// Frozen native typography trials. No frame, art, wording or pose changes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { hash, sourceHash, root, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
const [inputFile, poseFile, exportedFile, nativeDirectory, profileFile, definitionFile, out] =
  process.argv.slice(2);
assert(out, 'Use INPUTS POSES EXPORTED_INPUTS NATIVE_DIRECTORY PROFILE DEFINITION NEW_OUTPUT');
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const dependencyFiles = [
  'text-filled-objective.mjs',
  'edges.mjs',
  'abu-type-objective.mjs',
  'pixels-pure.mjs',
  'scan-transform.mjs',
  'abu-assets.mjs',
  'browser.mjs',
];
const dependencyHashes = async () =>
  Object.fromEntries(
    await Promise.all(
      dependencyFiles.map(async (file) => [
        file,
        hash(await fs.readFile(new URL(file, import.meta.url))),
      ]),
    ),
  );
const dependencies = await dependencyHashes();
const bytes = await Promise.all(
  [
    inputFile,
    poseFile,
    exportedFile,
    path.join(nativeDirectory, 'capture.json'),
    profileFile,
    definitionFile,
  ].map((f) => fs.readFile(f)),
);
const [input, poses, exported, capture, profile, definition] = bytes.map((b) => JSON.parse(b));
assert(['mir', 'ons'].includes(input.set));
assert.equal(poses.inputHash, hash(bytes[0]));
assert.equal(capture.source.inputHash, hash(bytes[0]));
assert(capture.complete && !capture.faults.length);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, capture.source.rendererHash);
assert.equal(definition.candidates[0].id, 'current');
assert(definition.candidates.length <= 300);
assert.equal(new Set(definition.candidates.map((c) => c.id)).size, definition.candidates.length);
assert(
  definition.roles.length > 0 &&
    definition.roles.every((r) => ['title', 'type', 'artist', 'legal', 'stats'].includes(r)),
);
assert.equal(new Set(definition.roles).size, definition.roles.length);
assert.equal(profile.set, input.set);
const extra = [];
for (const url of new Set(Object.values(profile.colors).map((c) => JSON.parse(c.source)[0])))
  extra.push(await cachedFetch(url, { offline: true }));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
for (const suffix of ['old/abu/border.svg', 'old/fourth/borderBlack.png'])
  extra.push(await cachedFetch(manifest.RETRO_ROOT + '/img/frames/' + suffix, { offline: true }));
const sources = {};
const session = await openBrowser(
  { ...input, components: [...input.components, ...extra] },
  {
    plugins: [
      {
        name: 'old-frame-typography-probe',
        enforce: 'pre',
        transform(code, id) {
          let needle, replacement;
          if (id.endsWith('/games/magic/src/calibration/profiles.ts')) {
            needle = 'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
            replacement =
              'return (globalThis as any).__headingProfile?.set === set ? (globalThis as any).__headingProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
          } else if (id.endsWith('/early-reprint-title.ts')) {
            needle = '  const p = earlyReprintTitle(face);';
            replacement =
              '  if ((globalThis as any).__headingCapture?.("title",c,{face,right})) return true;\n' +
              needle;
          } else if (id.endsWith('/early-reprint-type.ts')) {
            needle = '  const p = earlyReprintType(face);';
            replacement =
              '  if ((globalThis as any).__headingCapture?.("type",c,{face,text,right})) return true;\n' +
              needle;
          } else if (id.endsWith('/early-reprint-footer.ts')) {
            needle = '    const p = { ...profile[role], ...override };';
            replacement =
              '    if ((globalThis as any).__headingCapture?.(role,c,{face,text})) return;\n' +
              needle;
          } else return;
          assert.equal(code.split(needle).length, 2);
          const after = code.replace(needle, replacement);
          sources[id.slice(id.indexOf('/games/') + 1)] = { before: hash(code), after: hash(after) };
          return after;
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async (p) => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__headingProfile = p;
  }, profile);
  let entries = input.entries.filter(
    (e) =>
      (definition.includeLands || e.material !== 'L') &&
      poses.rows.find((r) => r.id === e.id)?.accepted,
  );
  const selected = [];
  for (const key of new Set(entries.map((e) => e.material)))
    for (const cohort of ['calibration', 'validation']) {
      const peers = entries
        .filter(
          (e) => e.material === key && exported.rows.find((r) => r.id === e.id).cohort === cohort,
        )
        .sort((a, b) => hash(a.name.toLowerCase()).localeCompare(hash(b.name.toLowerCase())));
      const count = Math.min(peers.length, definition.maximumPerCohort ?? 3);
      for (let i = 0; i < count; i++)
        selected.push(peers[Math.floor(((i + 0.5) * peers.length) / count)]);
    }
  entries = selected;
  for (const e of entries) {
    const pose = poses.rows.find((r) => r.id === e.id),
      n = capture.rows.find((r) => r.id === e.id);
    assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(n.profileHash, hash(JSON.stringify(profile)));
    const b = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(b), e.reference.sha256);
    const scan = normalize(PNG.sync.read(b), pose.transform);
    const url =
      'data:image/png;base64,' +
      PNG.sync.write({ width: 488, height: 680, data: Buffer.from(scan.data) }).toString('base64');
    const result = await session.page.evaluate(
      async ({ e, url, definition }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { paintEarlyReprintTitle } = await import(
          '/games/magic/src/presentation/early-reprint-title.ts'
        );
        const { paintEarlyReprintType } = await import(
          '/games/magic/src/presentation/early-reprint-type.ts'
        );
        const { paintEarlyReprintFooter, earlyReprintFooter } = await import(
          '/games/magic/src/presentation/early-reprint-footer.ts'
        );
        const { TextFilledObjective } = await import(
          '/games/magic/tools/accuracy/text-filled-objective.mjs'
        );
        const { nativeGrayCrop } = await import(
          '/games/magic/tools/accuracy/abu-type-objective.mjs'
        );
        const { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration);
        let full;
        const probes = {};
        try {
          globalThis.__headingCapture = (role, c, args) => {
            if (role === 'legal' && probes[role])
              args = { ...args, text: probes[role].args.text + ' ' + args.text };
            probes[role] = {
              args,
              matrix: Array.from([
                c.getTransform().a,
                c.getTransform().b,
                c.getTransform().c,
                c.getTransform().d,
                c.getTransform().e,
                c.getTransform().f,
              ]),
              properties: Object.fromEntries(
                [
                  'font',
                  'fontKerning',
                  'textRendering',
                  'letterSpacing',
                  'textAlign',
                  'textBaseline',
                  'fillStyle',
                  'shadowColor',
                  'shadowBlur',
                  'shadowOffsetX',
                  'shadowOffsetY',
                  'globalAlpha',
                  'globalCompositeOperation',
                  'filter',
                ].map((k) => [k, c[k]]),
              ),
            };
            return false;
          };
          full = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          delete globalThis.__headingCapture;
          const baseline = full.toDataURL().split(',')[1];
          const sc = document.createElement('canvas');
          sc.width = 488;
          sc.height = 680;
          const image = new Image();
          image.src = url;
          await image.decode();
          sc.getContext('2d').drawImage(image, 0, 0);
          const reference = sc.getContext('2d').getImageData(0, 0, 488, 680);
          const canvas = document.createElement('canvas');
          canvas.width = 732;
          canvas.height = 1020;
          const c = canvas.getContext('2d', { willReadFrequently: true });
          const roles = {};
          for (const role of definition.roles) {
            const probe = probes[role];
            if (!probe) continue;
            // Fixed interior strips omit horizontal and vertical frame rails. Bound
            // unused textured paper by the unchanged font's advance, plus a fixed reserve.
            const base =
              role === 'title' || role === 'type'
                ? globalThis.__headingProfile[role]
                : globalThis.__headingProfile.footer[role];
            c.font =
              base.size +
              'px \"CardRenderer MTG ' +
              (role === 'title' ? 'Goudy' : 'MPlantin') +
              '\", Georgia';
            const advance = c.measureText(probe.args.text ?? e.face.name).width * base.width;
            const end = Math.min(probe.args.right ?? 450, base.x + advance + 35);
            const rect =
              role === 'title'
                ? [48, 34, Math.max(60, Math.ceil(end) - 48), 21]
                : role === 'type'
                  ? [48, 379, Math.max(60, Math.ceil(end) - 48), 20]
                  : role === 'stats'
                    ? [366, 617, 87, 26]
                    : role === 'artist'
                      ? [48, 614, 326, 23]
                      : [48, 631, 392, 24];
            const gray = cropGray(reference, rect).gray;
            // Light filled letters are compared as ink, rather than rewarding their dark shadows.
            const invert =
              role !== 'legal' ||
              (definition.lightLegal ?? earlyReprintFooter(e.face).legalGray > 127);
            const convert = (g) => (invert ? Float32Array.from(g, (v) => 255 - v) : g);
            const mask = new Uint8Array(gray.length).fill(1),
              objective = new TextFilledObjective(convert(gray), rect[2], rect[3], mask);
            const origin = [Math.floor(rect[0] * 1.5) - 2, Math.floor(rect[1] * 1.5) - 2],
              size = [Math.ceil(rect[2] * 1.5) + 5, Math.ceil(rect[3] * 1.5) + 5];
            const trials = [];
            for (const candidate of definition.candidates) {
              const prior = globalThis.__headingProfile;
              const current =
                role === 'title' || role === 'type' ? prior[role] : prior.footer[role];
              const delta = candidate[role] ?? candidate.delta ?? {};
              const p = {
                ...current,
                x: current.x + (delta.dx ?? 0),
                y: current.y + (delta.dy ?? 0),
                size: current.size + (delta.size ?? 0),
                width: current.width * (delta.width ?? 1),
                ...delta.absolute,
              };
              globalThis.__headingProfile =
                role === 'title' || role === 'type'
                  ? { ...prior, [role]: p }
                  : { ...prior, footer: { ...prior.footer, [role]: p } };
              c.resetTransform();
              c.clearRect(0, 0, 732, 1020);
              c.fillStyle = invert ? '#111' : '#eee';
              c.fillRect(0, 0, 732, 1020);
              Object.assign(c, probe.properties);
              c.setTransform(...probe.matrix);
              try {
                if (role === 'title') paintEarlyReprintTitle(c, probe.args.face, probe.args.right);
                else if (role === 'type')
                  paintEarlyReprintType(c, probe.args.face, probe.args.text, probe.args.right);
                else {
                  globalThis.__headingCapture = (r) => r !== role;
                  paintEarlyReprintFooter(c, probe.args.face);
                  delete globalThis.__headingCapture;
                }
                c.resetTransform();
                const raster = c.getImageData(origin[0], origin[1], size[0], size[1]);
                trials.push({
                  id: candidate.id,
                  ...objective.score(convert(nativeGrayCrop(raster, rect, origin))),
                });
              } finally {
                delete globalThis.__headingCapture;
                globalThis.__headingProfile = prior;
              }
            }
            roles[role] = { rect, text: probe.args.text ?? e.face.name, trials };
          }
          canvas.width = canvas.height = sc.width = sc.height = 0;
          return { baseline, roles };
        } finally {
          delete globalThis.__headingCapture;
          if (full) full.width = full.height = 0;
          lease.dispose();
        }
      },
      { e, url, definition },
    );
    assert.equal(
      hash(Buffer.from(result.baseline, 'base64')),
      n.sha256,
      'Native heading control changed: ' + e.name,
    );
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: exported.rows.find((r) => r.id === e.id).cohort,
      inputHash: n.inputHash,
      nativeHash: n.sha256,
      referenceHash: e.reference.sha256,
      roles: result.roles,
    });
    if (rows.length % 10 === 0) console.log(input.set, rows.length, '/', entries.length);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
  assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
  assert.deepEqual(await dependencyHashes(), dependencies);
  await writeJson(out, {
    schema: 1,
    status: 'native-filled-heading-candidates-not-adopted',
    set: input.set,
    source: {
      rendererHash,
      toolHash,
      dependencies,
      inputHash: hash(bytes[0]),
      poseHash: hash(bytes[1]),
      exportedHash: hash(bytes[2]),
      nativeHash: hash(bytes[3]),
      profileHash: hash(bytes[4]),
      definitionHash: hash(bytes[5]),
      sources,
    },
    scope:
      'Fixed scan normalization and original wording; exact full-native control parity, production filled painters, isolated letter rasters, and frozen calibration/validation names. No outline fonts or per-card fitting. Candidate score is an offline text objective, not the published whole-card metric.',
    rows,
  });
} finally {
  await session.close();
}
