// Native filled-glyph masks and clean material backgrounds for ink/shadow fitting.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
const [nativeDirectory, profileFile, out] = process.argv.slice(2);
assert(out, 'Usage: early-profile-ink-capture.mjs INTEGRATED_CAPTURE PROFILE OUT');
const captureBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  profileBytes = await readFile(profileFile);
const capture = JSON.parse(captureBytes),
  inputs = JSON.parse(inputBytes),
  profile = JSON.parse(profileBytes);
assert.equal(capture.completed, 302);
assert.equal(capture.denominator, 302);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, capture.source.rendererHash);
assert.equal(hash(profileBytes), capture.source.profileHash);
const modules = [
  'games/magic/src/calibration/profiles.ts',
  'games/magic/src/presentation/solid-title.ts',
  'games/magic/src/presentation/early-reprint-footer-ink.ts',
];
const sources = Object.fromEntries(
    await Promise.all(modules.map(async (f) => [f, hash(await readFile(path.join(root, f)))])),
  ),
  transformed = {};
await mkdir(out, { recursive: true });
const source = {
  schema: 1,
  rendererHash,
  nativeCaptureHash: hash(captureBytes),
  nativeInputsHash: hash(inputBytes),
  profileHash: hash(profileBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  sources,
  scope:
    'Actual native filled glyph coverage at the selected shared geometry, plus one background with those four lettering roles hidden. No scan/color/placement fitting or profile adoption occurs here. Every untouched full face must exactly reproduce the integrated capture before masks are collected. Raster/font states and transforms are copied by the live production helper, without cloning a text layout algorithm.',
};
const rows = [];
const session = await openBrowser(inputs, {
  plugins: [
    {
      name: 'native-profile-ink-masks',
      enforce: 'pre',
      transform(code, id) {
        const file = modules.find((f) => id.endsWith('/' + f));
        if (!file) return;
        assert.equal(hash(code), sources[file]);
        let needle, replacement;
        if (file.endsWith('/profiles.ts')) {
          needle = 'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
          replacement =
            "return set === '2ed' && (globalThis as any).__integratedProfile ? (globalThis as any).__integratedProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;";
        } else if (file.endsWith('/solid-title.ts')) {
          needle = '  c.save();\n  const matrix = c.getTransform();';
          replacement =
            '  if ((globalThis as any).__profileInkMask?.(c, text, x, y, maxWidth, p)) return;\n' +
            needle;
        } else {
          needle = '  const layer = rasterCanvas();';
          replacement =
            '  if ((globalThis as any).__profileInkMask?.(c, text, 0, 0, maxWidth, p)) return;\n' +
            needle;
        }
        assert.equal(code.split(needle).length, 2, file + ' hook changed');
        const after = code.replace(needle, replacement);
        transformed[file] = { before: hash(code), after: hash(after) };
        return after;
      },
    },
  ],
});
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of inputs.entries) {
    const prior = capture.rows.find((r) => r.id === e.id);
    assert.equal(prior.currentFaceInputHash, hash(JSON.stringify(e.face)));
    const result = await session.page.evaluate(
      async ({ e, profile }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        globalThis.__integratedProfile = profile;
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        const masks = {},
          counts = {},
          states = {};
        const render = async () => {
          const image = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            new AbortController().signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          try {
            return image.toDataURL().split(',')[1];
          } finally {
            image.width = image.height = 0;
          }
        };
        try {
          const control = await render();
          globalThis.__profileInkMask = (c, text, x, y, max, p) => {
            const role =
              text === e.face.name && c.font.includes('Goudy')
                ? 'title'
                : text === e.face.typeLine
                  ? 'type'
                  : text.startsWith('Illus.')
                    ? 'artist'
                    : /^[*\dX]+\s*\/\s*[*\dX]+$/.test(text)
                      ? 'stats'
                      : undefined;
            if (!role) throw Error('Unknown production lettering role: ' + text);
            if (!masks[role])
              masks[role] = Object.assign(document.createElement('canvas'), {
                width: 732,
                height: 1020,
              });
            const m = masks[role].getContext('2d');
            m.save();
            m.setTransform(c.getTransform());
            for (const key of ['font', 'textAlign', 'textBaseline', 'letterSpacing', 'wordSpacing'])
              m[key] = c[key];
            m.fillStyle = 'white';
            m.fillText(text, x, y, max);
            if (p.trim > 0) {
              m.globalCompositeOperation = 'destination-out';
              m.lineWidth = p.trim * 2;
              m.strokeText(text, x, y, max);
            }
            m.restore();
            counts[role] = (counts[role] ?? 0) + 1;
            states[role] = {
              text,
              font: c.font,
              textAlign: c.textAlign,
              textBaseline: c.textBaseline,
              letterSpacing: c.letterSpacing,
              wordSpacing: c.wordSpacing,
              transform: Array.from([
                c.getTransform().a,
                c.getTransform().b,
                c.getTransform().c,
                c.getTransform().d,
                c.getTransform().e,
                c.getTransform().f,
              ]),
              x,
              y,
              maxWidth: max,
              gray: p.gray,
              shadow: p.shadow,
              trim: p.trim,
              width: p.width,
            };
            return true;
          };
          const background = await render();
          const encoded = Object.fromEntries(
            Object.entries(masks).map(([k, c]) => [k, c.toDataURL().split(',')[1]]),
          );
          return { control, background, masks: encoded, counts, states };
        } finally {
          delete globalThis.__profileInkMask;
          delete globalThis.__integratedProfile;
          for (const c of Object.values(masks)) c.width = c.height = 0;
          lease.dispose();
        }
      },
      { e, profile },
    );
    assert.equal(
      hash(Buffer.from(result.control, 'base64')),
      prior.rasters.candidate.face,
      'Changed native profile control ' + e.name,
    );
    for (const role of ['title', 'type', 'artist'])
      assert.equal(result.counts[role], 1, e.name + ' ' + role + ' mask');
    if (e.face.power != null && e.face.toughness != null)
      assert.equal(result.counts.stats, 1, e.name + ' stats mask');
    const assets = {};
    for (const [key, png] of Object.entries({ background: result.background, ...result.masks })) {
      const bytes = Buffer.from(png, 'base64');
      const file = e.id + '-' + key + '.png';
      await writeFile(path.join(out, file), bytes);
      assets[key] = { file, sha256: hash(bytes) };
    }
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: e.pose.cohort,
      referenceHash: e.reference.sha256,
      poseHash: prior.poseHash,
      controlHash: prior.rasters.candidate.face,
      scanHash: prior.scanHash,
      assets,
      states: result.states,
    });
    await writeJson(path.join(out, 'capture.json'), {
      source,
      transformed,
      status:
        rows.length === 302
          ? 'native-profile-ink-masks-complete'
          : 'native-profile-ink-masks-in-progress',
      denominator: 302,
      completed: rows.length,
      rows,
    });
    if (rows.length % 25 === 0) console.log('Filled native masks ' + rows.length + '/302');
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  rendererHash,
  'Painter changed during ink-mask capture',
);
console.log(
  JSON.stringify({
    completed: rows.length,
    stats: rows.filter((r) => r.assets.stats).length,
    maskRoles: rows.reduce((n, r) => n + Object.keys(r.states).length, 0),
  }),
);
