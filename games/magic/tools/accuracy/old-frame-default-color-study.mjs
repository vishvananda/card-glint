// Compare complete calibrated material defaults on the same winning frame geometry.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [study, out] = process.argv.slice(2);
assert(out, 'Use STUDY_DIRECTORY NEW_OUTPUT');
await fs.mkdir(out);
const complete = JSON.parse(
  await fs.readFile(path.join(study, 'default-installed-v1/complete.json')),
);
assert(complete.complete);
const renderer = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(renderer, complete.rendererHash);
const report = JSON.parse(
  await fs.readFile(
    path.join(root, 'games/magic/fixtures/accuracy/mirage-onslaught/default-donor-review.json'),
  ),
);
const entries = [];
for (const row of report.sets.filter((r) => r.recommended === 'mir')) {
  const file =
    row.set === 'scg'
      ? 'scg-inputs-v2.json'
      : row.set === 'ath'
        ? 'ath-frame-only-inputs-v2.json'
        : row.set + '-inputs.json';
  const input = JSON.parse(await fs.readFile(path.join(study, 'default-target-pilots-v1', file)));
  const measured = JSON.parse(
    await fs.readFile(path.join(study, 'default-installed-v1', row.set + '.json')),
  );
  for (const e of input.entries)
    if (measured.rows.some((r) => r.id === e.id && Number.isFinite(r.score100))) entries.push(e);
}
const components = await fetchComponents(entries, { offline: true }, (e) => e.face);
let transformed;
const session = await openBrowser(
  { entries, components },
  {
    plugins: [
      {
        name: 'default-color-prototype',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/games/magic/src/calibration/selection.ts')) return;
          const signature = 'export function calibrationForFace(face: RenderedCardInput) {';
          assert.equal(code.split(signature).length, 2);
          const after =
            code.replace(
              signature,
              'function actualDefaultColorProfile(face: RenderedCardInput) {',
            ) +
            '\nexport function calibrationForFace(face: RenderedCardInput) { return (globalThis as any).__defaultColorProfile?.set === face.setCode ? (globalThis as any).__defaultColorProfile : actualDefaultColorProfile(face); }\n';
          transformed = { before: hash(code), after: hash(after) };
          return after;
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(
    async (sets) => {
      const { loadMagicSet } = await import('/games/magic/src/data/load.ts');
      for (const set of [...sets, 'ons']) await loadMagicSet(set);
    },
    [...new Set(entries.map((e) => e.face.setCode))],
  );
  for (const e of entries)
    for (const variant of ['ons', 'source']) {
      const result = await session.page.evaluate(
        async ({ e, variant }) => {
          delete globalThis.__defaultColorProfile;
          const { calibrationForFace } = await import('/games/magic/src/calibration/selection.ts');
          const { setCalibrationProfile } = await import(
            '/games/magic/src/calibration/profiles.ts'
          );
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const base = calibrationForFace(e.face),
            profile = structuredClone(base);
          const alternate = setCalibrationProfile('ons');
          const changed = [];
          for (const [key, value] of Object.entries(profile.colors)) {
            if (!value) continue;
            if (variant === 'source') {
              value.adjustment = {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                ...(value.adjustment.outerStock ? { outerStock: value.adjustment.outerStock } : {}),
              };
              changed.push(key);
              continue;
            }
            const next = alternate.colors[key];
            if (next && JSON.parse(next.source)[0] === JSON.parse(value.source)[0]) {
              value.adjustment = {
                ...structuredClone(next.adjustment),
                ...(value.adjustment.outerStock ? { outerStock: value.adjustment.outerStock } : {}),
              };
              changed.push(key);
            }
          }
          globalThis.__defaultColorProfile = profile;
          let image;
          try {
            image = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
            );
            return {
              png: image.toDataURL().split(',')[1],
              changed,
              profile: JSON.stringify(profile),
            };
          } finally {
            delete globalThis.__defaultColorProfile;
            if (image) image.width = image.height = 0;
          }
        },
        { e, variant },
      );
      const png = Buffer.from(result.png, 'base64'),
        file = variant + '-' + e.id + '.png';
      await fs.writeFile(path.join(out, file), png);
      rows.push({
        id: e.id,
        name: e.name,
        set: e.face.setCode,
        material: e.material,
        variant,
        file,
        sha256: hash(png),
        changed: result.changed,
        profileHash: hash(result.profile),
      });
      if (rows.length % 100 === 0) console.log(rows.length, 'color-only native prototypes');
    }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), renderer);
  await writeJson(path.join(out, 'capture.json'), {
    schema: 1,
    complete: true,
    renderer,
    transformed,
    tool: hash(await fs.readFile(new URL(import.meta.url))),
    scope:
      'Only material adjustments change. Installed winning geometry, target footer, retained typography/mana and stock remain fixed. Onslaught adjustments require the exact same source bitmap; otherwise retain the existing material. Source mode uses neutral adjustments. These are unpromoted color prototypes.',
    rows,
  });
} finally {
  await session.close();
}
