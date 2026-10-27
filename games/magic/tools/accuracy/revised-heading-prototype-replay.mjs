// Replay the measured Revised heading prototype against its pre-adoption source.
// Cached assets only. OUTPUT must be new; no experiment hooks are installed.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, output, mode = 'original', artist = 'input', snapshotFile, definitionFile] =
  process.argv.slice(2);
assert(
  inputFile &&
    snapshotFile &&
    definitionFile &&
    output &&
    ['original', 'variants'].includes(mode) &&
    ['input', 'reviewed-artist'].includes(artist),
  'Usage: revised-heading-prototype-replay.mjs INPUTS NEW_OUTPUT [original|variants] [input|reviewed-artist] SNAPSHOT DEFINITION',
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
const snapshotBytes = await readFile(snapshotFile),
  oldSource = JSON.parse(snapshotBytes),
  definitionBytes = await readFile(definitionFile),
  definition = JSON.parse(definitionBytes),
  fontAsset = definition.fonts.find((f) => f.id === 'Plantin Pro').asset,
  sourceProjection = {},
  transforms = {};
assert.equal(inputs.set, '3ed');
assert.equal(
  oldSource.rendererHash,
  'd31b46679733d81e96c200afc8770540ffd43d4f529fdce8c0eeb1090042d36a',
);
extraAssets.push(fontAsset);
const snapshotPlugin = {
  name: 'heading-before-source',
  enforce: 'pre',
  async load(id) {
    const file = path.relative(sourceRoot, id.split('?')[0]),
      e = oldSource.files[file];
    if (!file.startsWith('games/magic/src/') || !e) return;
    assert.equal(hash(e.source), e.hash);
    const working = hash(await readFile(path.join(sourceRoot, file)));
    if (working !== e.hash) sourceProjection[file] = { working, before: e.hash };
    return e.source;
  },
};
const prototypePlugin = {
  name: 'reviewed-heading-prototype',
  enforce: 'pre',
  transform(source, id) {
    let needle, replacement;
    if (id.endsWith('/revised-lettering.ts')) {
      needle = '  paintRetroGrayText(c, text, 40, y, maxWidth + originalX - 40, 1);';
      replacement =
        '  c.translate(38,y);c.scale(1.03,1);paintRetroGrayText(c,text,0,0,(maxWidth+originalX-38)/1.03,1);';
    } else if (id.endsWith('/retro-paint.ts')) {
      needle = '    : (text: string, x: number, y: number, width: number) => {';
      replacement =
        needle +
        [
          '',
          '      if(revised && !isRevisedLand(face)){',
          '        c.save();const native=c.measureText("Hg");',
          '        c.font=\'21.7px "CardRenderer MTG Revised Plantin", Georgia\';',
          '        const line=c.measureText("Hg"),dy=(-native.actualBoundingBoxAscent+native.actualBoundingBoxDescent+line.actualBoundingBoxAscent-line.actualBoundingBoxDescent)/2;',
          '        prototypeGray(c,text,x-2,y+4+dy,width,1,"#ababab",face.textInk,"type");',
          '        c.restore();return;',
          '      }',
        ].join('\n');
    } else return;
    assert.equal(source.split(needle).length, 2);
    let code = source.replace(needle, replacement);
    if (id.endsWith('/retro-paint.ts'))
      code = "import {paintRetroGrayText as prototypeGray} from './retro-lettering.js';\n" + code;
    const file = path.relative(sourceRoot, id),
      p = { before: hash(source), after: hash(code) };
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
    { sourceRoot, plugins: [snapshotPlugin, prototypePlugin] },
  ),
  rows = [];
try {
  await session.page.evaluate(async (asset) => {
    const response = await fetch(asset.url);
    if (!response.ok) throw Error('Prototype font unavailable');
    document.fonts.add(
      await new FontFace('CardRenderer MTG Revised Plantin', await response.arrayBuffer(), {
        weight: '400',
      }).load(),
    );
  }, fontAsset);
  for (const e of inputs.entries) {
    const recipe = recipes.get(e.id);
    const captured = await session.page.evaluate(
      async ({ id, variants }) => {
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
      { id: e.id, variants: recipe.variants },
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
      status: rows.length === inputs.entries.length ? 'complete' : 'in-progress',
      scope:
        'Frozen pre-adoption source with measured heading prototype; not renderer-default or set certification.',
      rendererHash,
      experiment: {
        sourceRendererHash: oldSource.rendererHash,
        snapshotHash: hash(snapshotBytes),
        definitionHash: hash(definitionBytes),
        sourceProjection,
        transforms,
        scope:
          'Pre-adoption source with measured title and type commands only. Explicit prototype, not runtime defaults.',
      },
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
