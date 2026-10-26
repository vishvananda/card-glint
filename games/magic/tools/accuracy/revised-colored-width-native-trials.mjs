// Bounded native frame trials. The baseline is the public Original capture
// format; no private study paths or external downloads are required.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { physicalRevisedMaterial } from './revised-pixel-template-fit.mjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';

const [inputFile, baselineFile, output, mode = 'trials', proposalFile] = process.argv.slice(2);
assert(
  inputFile &&
    baselineFile &&
    output &&
    proposalFile &&
    ['trials', 'variants', 'native'].includes(mode),
  'Usage: revised-colored-width-native-trials.mjs INPUTS BASELINE_CAPTURE OUTPUT MODE SHARED_GEOMETRY_JSON',
);
const sourceRoot = path.resolve(process.env.NATIVE_RENDERER_ROOT ?? root),
  inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes),
  baselineBytes = await readFile(baselineFile),
  baseline = JSON.parse(baselineBytes),
  rendererHash = await sourceHash(path.join(sourceRoot, 'games/magic/src'));
assert.equal(inputs.set, '3ed');
assert.equal(baseline.set, '3ed');
assert.equal(baseline.source.inputHash, hash(inputBytes));
if (mode !== 'native') assert.equal(baseline.source.rendererHash, rendererHash);
const offsets = JSON.parse(await readFile(proposalFile));
assert.deepEqual(Object.keys(offsets).sort(), ['B', 'G', 'R', 'U', 'W']);
assert(
  Object.values(offsets).every(
    (v) =>
      v &&
      Object.keys(v).sort().join(',') === 'dx,sx' &&
      Number.isFinite(v.dx) &&
      Math.abs(v.dx) <= 3 &&
      Number.isFinite(v.sx) &&
      v.sx >= 0.995 &&
      v.sx <= 1.005,
  ),
);
const entries = inputs.entries.filter((e) => Object.hasOwn(offsets, physicalRevisedMaterial(e)));
assert.equal(entries.length, 230);
const trials = (mode === 'native' ? [0] : [0, 1]).map((factor) => ({
  id: factor === 0 ? 'current' : 'proposed',
  factor,
}));
const extraAssets = [],
  recipes = new Map(),
  ssr = await createServer({
    root: sourceRoot,
    configFile: false,
    server: { middlewareMode: true, hmr: false },
  });
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { canvasAssetUrls } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const knownUrls = new Set(
    [...(inputs.components ?? []), ...inputs.entries.flatMap((e) => [e.art, e.reference])]
      .filter(Boolean)
      .map((a) => a.url),
  );
  const { withCardWording } = await ssr.ssrLoadModule('/games/magic/src/presentation/wording.ts'),
    { printingCalibrationMaterials } = await ssr.ssrLoadModule(
      '/games/magic/src/presentation/printing-calibration-materials.ts',
    );
  for (const entry of entries) {
    const modes = [{ id: 'original', face: entry.face }];
    if (mode !== 'trials') {
      const wordings = {
        original: entry.face,
        oracle: {
          typeLine: entry.card.type_line,
          rulesText: entry.card.oracle_text ?? '',
          power: entry.card.power,
          toughness: entry.card.toughness,
        },
      };
      modes.push(
        {
          id: 'oracle',
          face: withCardWording(entry.face, wordings, 'oracle', { symbolStyle: 'original' }),
        },
        {
          id: 'oracle-modern',
          face: withCardWording(entry.face, wordings, 'oracle', { symbolStyle: 'modern' }),
        },
        { id: 'etching', face: entry.face, layer: 'etching' },
      );
    }
    for (const variant of modes)
      for (const url of canvasAssetUrls(variant.face)) {
        if (typeof url !== 'string' || !url.startsWith('https:') || knownUrls.has(url)) continue;
        extraAssets.push(await cachedFetch(url, { offline: true }));
        knownUrls.add(url);
      }
    recipes.set(
      entry.id,
      modes.map((m) => ({ ...m, material: printingCalibrationMaterials(m.face) })),
    );
  }
} finally {
  await ssr.close();
}
const prototype = {};
const plugin = {
  name: 'bounded-revised-colored-frame-trial',
  enforce: 'pre',
  transform(code, id) {
    let after = code;
    const once = (before, replacement) => {
      assert.equal(after.split(before).length, 2, id);
      after = after.replace(before, replacement);
    };
    if (id.split('?')[0].endsWith('/revised-frame-geometry.ts')) {
      once(
        '} = geometry[key];',
        '} = geometry[key];\n const {sx: wx = 1, dx: wd = 0} = (globalThis as any).__revisedFrameOffsets?.[key] ?? {};',
      );
      once(
        '(244 + (0.012 * 488 - 244) * sx + dx) / 488,',
        '(244 + (0.012 * 488 - 244) * sx * wx + dx * wx + wd) / 488,',
      );
      once('0.974 * sx,', '0.974 * sx * wx,');
    } else if (id.split('?')[0].endsWith('/printing-calibration-materials.ts'))
      once(
        'export function printingCalibrationMaterials(input: RenderedCardInput) {',
        'export function printingCalibrationMaterials(input: RenderedCardInput) {\n if ((globalThis as any).__revisedArtifactMaterial && input.setCode?.toLowerCase()==="3ed" && !resolveCardProfile(input).artifact && !resolveCardProfile(input).land) return (globalThis as any).__revisedArtifactMaterial;',
      );
    else return;
    prototype[id.split('?')[0].split('/').at(-1)] = { before: hash(code), after: hash(after) };
    return after;
  },
};
await mkdir(output, { recursive: true });
for (const trial of trials) await mkdir(path.join(output, trial.id), { recursive: true });
const session = await openBrowser(
    { ...inputs, components: [...(inputs.components ?? []), ...extraAssets] },
    {
      sourceRoot,
      plugins: mode === 'native' ? [] : [plugin],
    },
  ),
  rows = [];
try {
  for (const entry of entries) {
    const modes = recipes.get(entry.id);
    const captured = await session.page.evaluate(
      async ({ id, modes, trials, native, offsets }) => {
        await import('/games/magic/src/data/eager.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts'),
          { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
          { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts'),
          signal = new AbortController().signal,
          out = {};
        try {
          for (const mode of modes) {
            const lease = await loadAccuracyImages(
              canvasAssetUrls(mode.face),
              signal,
              mode.face.illustration,
            );
            try {
              if (!native) globalThis.__revisedArtifactMaterial = mode.material;
              for (const trial of trials) {
                if (!native)
                  globalThis.__revisedFrameOffsets = Object.fromEntries(
                    Object.entries(offsets).map(([key, warp]) => [
                      key,
                      { sx: 1 + (warp.sx - 1) * trial.factor, dx: warp.dx * trial.factor },
                    ]),
                  );
                const canvas = await composeCardTexture(
                  {
                    face: mode.face,
                    printingId: id,
                    printedImage: null,
                    ...(mode.layer ? { layer: mode.layer } : {}),
                  },
                  'inspect',
                  signal,
                  { loadImages: async () => ({ ...lease, dispose() {} }) },
                );
                try {
                  const layout = retroTextLayout(canvas.getContext('2d'), mode.face);
                  (out[mode.id] ??= {})[trial.id] = {
                    png: canvas.toDataURL().split(',')[1],
                    layout: layout
                      ? {
                          size: layout.size,
                          x: layout.x,
                          width: layout.width,
                          top: layout.top,
                          height: layout.height,
                          overflow: layout.overflow,
                          lines: layout.lines.map((line) =>
                            line.runs.map((run) => run.text).join(''),
                          ),
                        }
                      : null,
                  };
                } finally {
                  canvas.width = canvas.height = 0;
                }
              }
            } finally {
              lease.dispose();
            }
          }
          return out;
        } finally {
          delete globalThis.__revisedArtifactMaterial;
          delete globalThis.__revisedFrameOffsets;
        }
      },
      { id: entry.id, modes, trials, native: mode === 'native', offsets },
    );
    const results = {};
    for (const recipe of modes) {
      const values = {},
        byTrial = captured[recipe.id];
      let originalAlpha;
      for (const trial of trials) {
        const v = byTrial[trial.id],
          bytes = Buffer.from(v.png, 'base64'),
          png = PNG.sync.read(bytes);
        const alpha = Uint8Array.from(
          { length: png.width * png.height },
          (_, i) => png.data[i * 4 + 3],
        );
        if (trial.factor === 0) originalAlpha = alpha;
        else if (recipe.id !== 'etching')
          assert.deepEqual(alpha, originalAlpha, 'Card silhouette moved');
        const file = path.join(trial.id, entry.id + '-' + recipe.id + '.png');
        await writeFile(path.join(output, file), bytes);
        values[trial.id] = { file, sha256: hash(bytes), alphaHash: hash(alpha), layout: v.layout };
        assert.deepEqual(v.layout, byTrial.current.layout, 'Geometry trial changed text layout');
      }
      if (recipe.id === 'original' && mode !== 'native') {
        const old = baseline.rows.find((r) => r.id === entry.id).modes.original;
        assert.equal(values.current.sha256, old.sha256, entry.name + ' baseline pixel drift');
        assert.deepEqual(values.current.layout, old.layout);
      }
      results[recipe.id] = {
        inputHash: hash(JSON.stringify(recipe.face)),
        material: recipe.material,
        trials: values,
      };
    }
    rows.push({
      id: entry.id,
      name: entry.name,
      referenceHash: entry.reference.sha256,
      artHash: entry.art.sha256,
      modes: results,
    });
    if (rows.length % 10 === 0) console.log('Native colored variants', rows.length, '/230');
    await writeJson(path.join(output, 'capture.json'), {
      schema: 1,
      set: '3ed',
      status: session.faults.length
        ? 'failed'
        : rows.length === entries.length
          ? 'complete'
          : 'in-progress',
      rendererHash,
      inputHash: hash(inputBytes),
      baselineHash: hash(baselineBytes),
      toolHash: hash(await readFile(new URL(import.meta.url))),
      mode,
      trials,
      offsets,
      prototype,
      scope:
        mode === 'native'
          ? 'Unmodified production painter; current Original/Oracle/historical-symbol/etching variants.'
          : 'Bounded shared physical-color frame/art horizontal scale and translation. Source-local material pixels held at the baseline. Current trial must reproduce the native Original baseline; all lettering layouts and physical face alpha remain unchanged. Experimental pixels never certify a set.',
      extraAssets,
      browser: session.browser.version(),
      rows,
      faults: session.faults,
    });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(sourceRoot, 'games/magic/src')), rendererHash);
} catch (error) {
  console.error(session.faults);
  throw error;
} finally {
  await session.close();
}
