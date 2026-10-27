// Replay explicit Revised mana prototypes against their exact pre-adoption source snapshot.
// Cached assets only; output is experimental and cannot certify renderer defaults.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, output, mode = 'original', artist = 'input', prototypeDefinitionFile] =
  process.argv.slice(2);
assert(
  inputFile &&
    output &&
    prototypeDefinitionFile &&
    ['original', 'variants'].includes(mode) &&
    ['input', 'reviewed-artist'].includes(artist),
  'Usage: printing-native-replay.mjs INPUTS NEW_OUTPUT [original|variants] [input|reviewed-artist] PROTOTYPE_DEFINITION',
);
await mkdir(output); // Deliberately refuses to overwrite an earlier run.
const sourceRoot = path.resolve(process.env.NATIVE_RENDERER_ROOT ?? root),
  inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes),
  rendererHash = await sourceHash(path.join(sourceRoot, 'games/magic/src')),
  recipes = new Map(),
  extraAssets = [];
assert(
  inputs.entries.length && new Set(inputs.entries.map((e) => e.id)).size === inputs.entries.length,
);
const prototypeBytes = await readFile(prototypeDefinitionFile),
  prototype = JSON.parse(prototypeBytes),
  sourceBytes = await readFile(prototype.sourceSnapshot),
  oldSource = JSON.parse(sourceBytes),
  paletteBytes = await readFile(prototype.paletteDefinition),
  palette = JSON.parse(paletteBytes).candidates.find((c) => c.name === prototype.palette),
  geometryBytes = await readFile(prototype.geometryDefinition),
  geometry = JSON.parse(geometryBytes).mana,
  sourceProjection = {},
  transforms = {};
assert.equal(prototype.set, '3ed');
assert.equal(palette?.name, 'ink-40');
assert(
  inputs.entries.every((e) => e.face.setCode?.toLowerCase() === '3ed' && !e.face.symbolAdjustment),
);
const snapshotPlugin = {
  name: 'native-mana-prototype-source',
  enforce: 'pre',
  async load(id) {
    const file = path.relative(sourceRoot, id.split('?')[0]),
      e = oldSource.files[file];
    if (!file.startsWith('games/magic/src/') || !e) return;
    assert.equal(hash(e.source), e.hash);
    const current = hash(await readFile(path.join(sourceRoot, file)));
    if (current !== e.hash) sourceProjection[file] = { working: current, before: e.hash };
    return e.source;
  },
};
const palettePlugin = {
  name: 'native-mana-prototype-palette',
  enforce: 'pre',
  transform(source, id) {
    let needle, replacement;
    if (id.endsWith('/games/magic/src/presentation/printing-calibration-materials.ts')) {
      needle = 'export const calibratedManaTarget = (face: RenderedCardInput, symbol: string) => {';
      replacement =
        needle +
        '\n  const trial=(globalThis as any).__revisedPalette; if(trial && face.setCode?.toLowerCase()==="3ed") { if(symbol==="INK" && trial.ink)return trial.ink; if(trial.paper?.[symbol])return trial.paper[symbol]; }\n';
    } else if (id.endsWith('/games/magic/src/presentation/canvas-face.ts')) {
      needle = "    'canvas-face-v148',";
      replacement =
        needle +
        "\n    ...((globalThis as any).__revisedPalette ? [['revised-mana-prototype-v1', (globalThis as any).__revisedPalette]] : []),";
    } else return;
    assert.equal(source.split(needle).length, 2);
    const code = source.replace(needle, replacement),
      p = { before: hash(source), after: hash(code) },
      file = path.relative(sourceRoot, id);
    if (transforms[file]) assert.deepEqual(transforms[file], p);
    transforms[file] = p;
    return code;
  },
};

const ssr = await createServer({
  plugins: [snapshotPlugin],
  root: sourceRoot,
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  await ssr.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { withCardWording } = await ssr.ssrLoadModule('/games/magic/src/presentation/wording.ts'),
    { resolvePrintingArtist } = await ssr.ssrLoadModule('/games/magic/src/printing/artist.ts'),
    { canvasAssetUrls } = await ssr.ssrLoadModule('/games/magic/src/presentation/canvas-assets.ts');
  const known = new Set(
    [...(inputs.components ?? []), ...inputs.entries.flatMap((e) => [e.reference, e.art])]
      .filter(Boolean)
      .map((a) => a.url),
  );
  for (const e of inputs.entries) {
    const resolved =
      artist === 'reviewed-artist'
        ? resolvePrintingArtist(e.id, e.face.artist, { referenceSha256: e.reference.sha256 })
        : null;
    assert(resolved?.provenance.status !== 'reference-mismatch');
    const face = resolved ? { ...e.face, artist: resolved.artist } : e.face;
    const variants = [{ id: 'original', face }];
    if (mode === 'variants') {
      const wording = {
        original: face,
        oracle: {
          typeLine: e.card.type_line,
          rulesText: e.card.oracle_text ?? '',
          power: e.card.power,
          toughness: e.card.toughness,
        },
      };
      for (const symbolStyle of ['original', 'modern'])
        variants.push({
          id: symbolStyle === 'original' ? 'oracle' : 'oracle-modern',
          face: withCardWording(face, wording, 'oracle', { symbolStyle }),
        });
      variants.push({ id: 'etching', face, layer: 'etching' });
    }
    for (const v of variants)
      if (['original', 'oracle'].includes(v.id) && v.face.manaSymbols?.length)
        v.face = { ...v.face, symbolAdjustment: { mana: geometry } };
    for (const v of variants)
      for (const url of canvasAssetUrls(v.face)) {
        if (typeof url !== 'string' || !url.startsWith('https:') || known.has(url)) continue;
        extraAssets.push(await cachedFetch(url, { offline: true }));
        known.add(url);
      }
    recipes.set(e.id, { variants, provenance: resolved?.provenance ?? null });
  }
} finally {
  await ssr.close();
}
const session = await openBrowser(
    { ...inputs, components: [...(inputs.components ?? []), ...extraAssets] },
    { sourceRoot, plugins: [snapshotPlugin, palettePlugin] },
  ),
  rows = [];
try {
  for (const e of inputs.entries) {
    const recipe = recipes.get(e.id);
    const captured = await session.page.evaluate(
      async ({ id, variants, palette }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture, cardTextureKey } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          ),
          { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
          { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts'),
          signal = new AbortController().signal,
          out = {};
        for (const v of variants) {
          globalThis.__revisedPalette = ['original', 'oracle'].includes(v.id) ? palette : undefined;
          const lease = await loadAccuracyImages(
            canvasAssetUrls(v.face),
            signal,
            v.face.illustration,
          );
          try {
            const input = {
                face: v.face,
                printingId: id,
                printedImage: null,
                ...(v.layer ? { layer: v.layer } : {}),
              },
              c = await composeCardTexture(input, 'inspect', signal, {
                loadImages: async () => ({ ...lease, dispose() {} }),
              });
            try {
              const l = retroTextLayout(c.getContext('2d'), v.face);
              out[v.id] = {
                png: c.toDataURL().split(',')[1],
                key: cardTextureKey(input, 'inspect'),
                layout: l
                  ? {
                      size: l.size,
                      x: l.x,
                      width: l.width,
                      top: l.top,
                      height: l.height,
                      overflow: l.overflow ?? false,
                      lines: l.lines.map((line) => line.runs.map((r) => r.text).join('')),
                    }
                  : null,
              };
            } finally {
              c.width = c.height = 0;
            }
          } finally {
            lease.dispose();
          }
        }
        return out;
      },
      { id: e.id, variants: recipe.variants, palette },
    );
    const modes = {};
    for (const v of recipe.variants) {
      const result = captured[v.id],
        bytes = Buffer.from(result.png, 'base64'),
        file = e.id + '-' + v.id + '.png';
      await writeFile(path.join(output, file), bytes);
      modes[v.id] = {
        inputHash: hash(JSON.stringify(v.face)),
        sha256: hash(bytes),
        keyHash: hash(result.key),
        layout: result.layout,
        file,
      };
    }
    rows.push({
      id: e.id,
      set: e.card.set,
      name: e.name,
      referenceHash: e.reference.sha256,
      artHash: e.art?.sha256,
      artistProvenance: recipe.provenance,
      modes,
    });
    await writeJson(path.join(output, 'capture.json'), {
      schema: 1,
      experiment: {
        status: 'reviewed-mana-prototype-not-default',
        definitionHash: hash(prototypeBytes),
        sourceSnapshotHash: hash(sourceBytes),
        sourceRendererHash: oldSource.rendererHash,
        paletteDefinitionHash: hash(paletteBytes),
        geometryDefinitionHash: hash(geometryBytes),
        palette,
        geometry,
        sourceProjection,
        transforms,
      },
      status: rows.length === inputs.entries.length ? 'complete' : 'in-progress',
      scope:
        'Exact pre-adoption source snapshot with explicit reviewed public geometry controls and palette override in historical-symbol modes only. Prototype recipe/key changes are recorded; not renderer-default output or set certification.',
      rendererHash,
      inputHash: hash(inputBytes),
      toolHash: hash(await readFile(new URL(import.meta.url))),
      mode,
      artist,
      extraAssets,
      browser: session.browser.version(),
      rows,
      faults: session.faults,
    });
    if (rows.length % 25 === 0 || rows.length === inputs.entries.length)
      console.log('Native printing replay', rows.length, '/', inputs.entries.length);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(sourceRoot, 'games/magic/src')), rendererHash);
} finally {
  await session.close();
}
