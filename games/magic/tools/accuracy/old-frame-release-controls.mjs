// Native published-release controls for every unchanged frame era outside the adopted defaults.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { cachedFetch } from './cache.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, exportedFile, beforeRoot, out] = process.argv.slice(2);
assert(out, 'Use INPUTS EXPORTED_INPUTS BEFORE_SOURCE_ROOT NEW_REPORT');
await fs.access(out).then(
  () => {
    throw Error('Report exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const [ib, eb] = await Promise.all([inputFile, exportedFile].map((f) => fs.readFile(f)));
const input = JSON.parse(ib),
  exported = JSON.parse(eb);
assert.equal(exported.inputHash, hash(ib));
const beforeHash = await sourceHash(path.join(beforeRoot, 'games/magic/src'));
const afterHash = await sourceHash(path.join(root, 'games/magic/src'));
const probes = [];
for (const key of new Set(exported.rows.map((r) => r.key))) {
  const row = exported.rows.find((r) => r.accepted && r.key === key);
  const e = input.entries.find((e) => e.id === row.id);
  for (const set of [
    'lea',
    'leb',
    '2ed',
    '3ed',
    'leg',
    'drk',
    'fem',
    '4ed',
    'chr',
    'ice',
    '8ed',
    'm21',
    'plc',
    'mir',
  ]) {
    const modern = ['8ed', 'm21', 'plc'].includes(set);
    const custom = ['mir', 'ons'].includes(set);
    probes.push({
      ...e,
      id: set + '-' + key,
      sourceId: e.id,
      face: {
        ...e.face,
        setCode: set,
        borderColor: ['2ed', '4ed', 'chr', '8ed'].includes(set) ? 'white' : 'black',
        ...(modern
          ? {
              frameStyle: 'modern',
              typeLine: e.card.type_line,
              frameAssetFamily: set === 'm21' ? undefined : 'eighth',
            }
          : {}),
        ...(custom
          ? {
              frameStyle: 'modern',
              typeLine: e.card.type_line,
              frameAssetFamily: 'm15-accurate',
              calibration: 'auto',
            }
          : {}),
      },
    });
  }
}
const components = await fetchComponents(probes, { offline: true }, (e) => e.face);
// Include the parent's actual asset requests rather than assuming source inventories match.
const server = await createServer({
  configFile: false,
  root: beforeRoot,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { prepareMagicCards } = await server.ssrLoadModule('/games/magic/src/data/load.ts');
  await prepareMagicCards(probes.map((e) => e.face));
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { RETRO_FONT, RETRO_SYMBOL_FONT } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { revisedTypeFontAsset } = await server.ssrLoadModule(
    '/games/magic/src/presentation/revised-lettering.ts',
  );
  components.push(await cachedFetch(revisedTypeFontAsset.url, { offline: true }));
  const css = await fs.readFile(path.join(beforeRoot, 'games/magic/fonts.css'), 'utf8');
  const urls = [
    ...new Set(
      [...css.matchAll(/url\('([^']+)'\)/g)]
        .map((m) => m[1])
        .concat(
          [RETRO_FONT, RETRO_SYMBOL_FONT],
          probes.flatMap((e) => canvasAssetUrls(e.face)),
        ),
    ),
  ];
  for (const url of urls.filter((url) => url?.startsWith('https:')))
    components.push(await cachedFetch(url, { offline: true }));
} finally {
  await server.close();
}
const values = {};
for (const mode of ['before', 'after']) {
  const session = await openBrowser(
    { entries: probes, components },
    { sourceRoot: mode === 'before' ? beforeRoot : root },
  );
  try {
    await session.page.evaluate(async () => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
    });
    values[mode] = [];
    for (const e of probes) {
      console.log(mode, e.id);
      const png = await session.page.evaluate(async (e) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        let image;
        try {
          image = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            new AbortController().signal,
          );
          return image.toDataURL().split(',')[1];
        } finally {
          if (image) image.width = image.height = 0;
        }
      }, e);
      values[mode].push({
        id: e.id,
        set: e.face.setCode,
        sourceId: e.sourceId,
        inputHash: hash(JSON.stringify(e.face)),
        sha256: hash(Buffer.from(png, 'base64')),
      });
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
}
assert.deepEqual(values.after, values.before, 'Foreign or explicitly selected frame changed');
assert.equal(await sourceHash(path.join(beforeRoot, 'games/magic/src')), beforeHash);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), afterHash);
await writeJson(out, {
  schema: 1,
  status: 'unchanged-native-adoption-foreign-controls',
  beforeHash,
  afterHash,
  source: {
    inputs: hash(ib),
    exported: hash(eb),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  },
  scope:
    'Actual parent/current source, cached real assets and identical synthetic control faces. Unlimited/FEM/Fourth/Chronicles/ICE, Eighth/M21/PLC and explicitly selected MIR/ONS frames must be byte-identical. These controls certify no scan fit or target-default accuracy.',
  count: probes.length,
  changed: 0,
  rows: values.after,
});
console.log(values.after.length, 'foreign and explicit-frame native controls are byte-identical.');
