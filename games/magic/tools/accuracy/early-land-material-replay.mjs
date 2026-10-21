// Execute private frame/mask geometry trials through the actual native painter.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, readJson, writeJson, sourceHash } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { earlyLandMaterialPlugin } from './early-land-material-plugin.mjs';
import { normalize } from './pixels-pure.mjs';
import { measureWhiteFrame, boundaryDifference } from './frame-boundaries.mjs';
const [nativeDirectory, definitionFile, out] = process.argv.slice(2);
assert(out, 'Usage: early-land-material-replay.mjs NATIVE_CAPTURE DEFINITION OUT');
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes),
  snapshot = await readJson(path.join(nativeDirectory, 'inputs.json')),
  definitionBytes = await readFile(definitionFile),
  definition = JSON.parse(definitionBytes);
assert.equal(native.source.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.deepEqual(snapshot.source.rendererHash, native.source.rendererHash);
const entries = snapshot.entries.filter((e) => definition.ids.includes(e.id));
assert.equal(entries.length, new Set(definition.ids).size);
const components = [...snapshot.components];
const extraUrls = new Set(
  definition.trials.flatMap((t) =>
    Object.values(t.materials).flatMap((m) =>
      [m.asset, m.mask, m.outline, ...Object.keys(m.pigments ?? {})].filter(Boolean),
    ),
  ),
);
for (const url of extraUrls)
  if (!components.some((c) => c.url === url))
    components.push(await cachedFetch(url, { offline: true }));
const transformed = {},
  session = await openBrowser(
    { entries, components },
    {
      plugins: [earlyLandMaterialPlugin(transformed)],
    },
  ),
  rows = [];
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'definition.json'), definitionBytes);
const source = {
  schema: 1,
  rendererHash: native.source.rendererHash,
  nativeCaptureHash: hash(nativeBytes),
  definitionHash: hash(definitionBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  pluginHash: hash(await readFile(new URL('./early-land-material-plugin.mjs', import.meta.url))),
  palettePluginHash: hash(
    await readFile(new URL('./early-dual-pinline-palette-plugin.mjs', import.meta.url)),
  ),
  pinlinePluginHash: hash(
    await readFile(new URL('./early-dual-pinline-plugin.mjs', import.meta.url)),
  ),
  colorPluginHash: hash(await readFile(new URL('./early-dual-color-plugin.mjs', import.meta.url))),
  geometryPluginHash: hash(
    await readFile(new URL('./early-frame-trial-plugin.mjs', import.meta.url)),
  ),
  ...(definition.pigment
    ? {
        pinlinePluginHash: hash(
          await readFile(new URL('./early-dual-pinline-plugin.mjs', import.meta.url)),
        ),
        colorPluginHash: hash(
          await readFile(new URL('./early-color-trial-plugin.mjs', import.meta.url)),
        ),
      }
    : {}),
  components: components.map((c) => [c.url, c.sha256]),
  browser: session.browser.version(),
  scope:
    'Actual native 732x1020 Original land materials and default etching. Shared per-basic-name geometry and source pigments; one shared dual geometry/palette and brown-frame HSB; independently selected full-frame outline source. Material identities and exact frozen default faces are checked before normal cached preparation/composition. No per-printing pose/color fit or runtime profile adoption.',
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    const alternatives = [
      { id: 'current', trial: null },
      ...definition.trials
        .filter(
          (t) =>
            (t.materials['name:' + e.name] ?? t.materials[e.material]) &&
            (!t.names || t.names.includes(e.name)) &&
            (!t.colors || t.colors.some((c) => e.face.frameColors.includes(c))),
        )
        .map((t) => ({
          id: t.id,
          trial: t.materials['name:' + e.name] ?? t.materials[e.material],
        })),
    ];
    const renders = await session.page.evaluate(
      async ({ e, alternatives }) => {
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
          { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const choices = alternatives.map((t) => ({
          ...t,
          face: t.trial ? { ...e.face, __earlyFrameTrial: t.trial } : e.face,
        }));
        const lease = await loadAccuracyImages(
          choices.flatMap((t) => canvasAssetUrls(t.face)),
          new AbortController().signal,
          e.face.illustration,
        );
        try {
          const values = [];
          for (const t of choices) {
            let appliedMaterial;
            if (t.trial?.pigment) {
              const { printingCalibrationMaterials } = await import(
                '/games/magic/src/presentation/printing-calibration-materials.ts'
              );
              const { asset, adjustment } = t.trial.pigment;
              appliedMaterial = printingCalibrationMaterials(t.face).materials[asset];
              if (
                !lease.images.has(asset) ||
                JSON.stringify(appliedMaterial) !== JSON.stringify(adjustment)
              )
                throw Error('Study pigment did not resolve to its supplied source material');
            }
            if (t.trial?.pigments) {
              const { printingCalibrationMaterials } = await import(
                '/games/magic/src/presentation/printing-calibration-materials.ts'
              );
              const resolved = printingCalibrationMaterials(t.face).materials;
              const { retroDualFrame } = await import(
                '/games/magic/src/presentation/retro-dual-frame.ts'
              );
              const plan = retroDualFrame(t.face);
              const used = new Set(
                plan ? [plan.base, plan.overlay, plan.outline] : [t.trial.asset],
              );
              appliedMaterial = {};
              for (const [asset, adjustment] of Object.entries(t.trial.pigments)) {
                if (
                  (used.has(asset) && !lease.images.has(asset)) ||
                  JSON.stringify(resolved[asset]) !== JSON.stringify(adjustment)
                )
                  throw Error('Dual material source/adjustment mismatch');
                appliedMaterial[asset] = resolved[asset];
              }
            }
            const layers = {};
            for (const layer of ['face', 'etching']) {
              const image = await composeCardTexture(
                {
                  face: t.face,
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
            values.push({ id: t.id, appliedMaterial, ...layers });
          }
          return values;
        } finally {
          lease.dispose();
        }
      },
      { e, alternatives },
    );
    const expected = native.rows.find((r) => r.id === e.id);
    assert.equal(
      hash(Buffer.from(renders[0].face, 'base64')),
      expected.renderHash,
      'Instrumented default face differs: ' + e.name,
    );
    const scanBytes = await readFile(path.join(nativeDirectory, e.set, e.id + '-scan.png'));
    assert.equal(hash(scanBytes), expected.scanHash);
    const reference = normalize(PNG.sync.read(scanBytes));
    const baseline = PNG.sync.read(Buffer.from(renders[0].face, 'base64')),
      row = {
        id: e.id,
        name: e.name,
        set: e.set,
        material: e.material,
        cohort: e.pose.cohort,
        referenceHash: expected.referenceHash,
        poseHash: expected.poseHash,
        baselineParity: true,
        trials: {},
      };
    for (const value of renders) {
      const directory = path.join(out, value.id);
      await mkdir(directory, { recursive: true });
      const bytes = Buffer.from(value.face, 'base64'),
        etch = Buffer.from(value.etching, 'base64');
      await writeFile(path.join(directory, e.id + '.png'), bytes);
      await writeFile(path.join(directory, e.id + '-etching.png'), etch);
      const image = PNG.sync.read(bytes);
      let changed = 0,
        interiorChanged = 0;
      for (let y = 0; y < 1020; y++)
        for (let x = 0; x < 732; x++) {
          const p = (y * 732 + x) * 4;
          if (![0, 1, 2, 3].some((k) => baseline.data[p + k] !== image.data[p + k])) continue;
          changed++;
          if (x > 60 && x < 672 && y > 68 && y < 952) interiorChanged++;
        }
      const supplied = alternatives.find((t) => t.id === value.id)?.trial;
      if (supplied?.pigments) assert.deepEqual(value.appliedMaterial, supplied.pigments);
      if (supplied?.pigment) {
        const { pigment, ...geometry } = supplied;
        const pure = alternatives.find(
          (t) =>
            t.trial && !t.trial.pigment && JSON.stringify(t.trial) === JSON.stringify(geometry),
        );
        if (pure) {
          const control = renders.find((t) => t.id === pure.id);
          assert.notEqual(
            hash(bytes),
            hash(Buffer.from(control.face, 'base64')),
            'Pigment candidate has no pixel effect: ' + e.name,
          );
        }
        assert.deepEqual(value.appliedMaterial, pigment.adjustment);
      }
      row.trials[value.id] = {
        ...(value.appliedMaterial
          ? { appliedMaterialHash: hash(JSON.stringify(value.appliedMaterial)) }
          : {}),
        faceHash: hash(bytes),
        etchingHash: hash(etch),
        etchingChanged: hash(etch) !== hash(Buffer.from(renders[0].etching, 'base64')),
        changedPixels: changed,
        interiorChanged,
        outerBoundary: boundaryDifference(
          measureWhiteFrame(reference),
          measureWhiteFrame(normalize(image)),
        ),
      };
    }
    rows.push(row);
    await writeJson(path.join(out, 'capture.json'), { source, transformed, rows });
    console.log(rows.length + '/' + entries.length + ' ' + e.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(Object.keys(transformed).length, 8);
} finally {
  await session.close();
}
console.log(
  JSON.stringify({
    total: rows.length,
    baselineParity: rows.every((r) => r.baselineParity),
    trials: definition.trials.map((t) => t.id),
  }),
);
