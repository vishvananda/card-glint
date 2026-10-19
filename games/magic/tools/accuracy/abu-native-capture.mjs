import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { verifyMetadataRefresh } from './abu-metadata-refresh.mjs';
import { createServer } from 'vite';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { root, readJson, writeJson, hash, sourceHash } from './common.mjs';

const [
  inputFile,
  outputDirectory,
  parentRoot,
  expectationArgument,
  scope = 'typography',
  metadataProofFile,
] = process.argv.slice(2);
assert.ok(['typography', 'whole-card', 'mana-only', 'body-mana'].includes(scope));
const expectedFile = expectationArgument === '-' ? undefined : expectationArgument;
if (!parentRoot)
  throw Error('Usage: abu-native-capture.mjs INPUTS OUT PARENT_BASELINES [BODY_EXPECTATIONS]');
const input = await readJson(inputFile),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  inputHash = hash(await readFile(inputFile)),
  fonts = await readFile(path.join(root, 'games/magic/fonts.css')),
  assetManifest = await readFile(path.join(root, 'games/magic/assets.json')),
  version = (await readJson(path.join(root, 'package.json'))).version,
  expected = expectedFile ? await readJson(expectedFile) : {};
const ssr = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
let urls;
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  await ssr.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { canvasAssetUrls } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { RETRO_FONT, RETRO_SYMBOL_FONT } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  urls = [
    ...new Set(
      [
        ...[...fonts.toString().matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]),
        RETRO_FONT,
        RETRO_SYMBOL_FONT,
        ...input.entries.flatMap((e) => canvasAssetUrls(e.face)),
      ].filter((u) => u?.startsWith('https:')),
    ),
  ];
} finally {
  await ssr.close();
}
const components = [];
for (const url of urls) components.push(await cachedFetch(url, { offline: true }));
const definition = {
  schema: 1,
  inputHash,
  rendererHash,
  version,
  variant: `unreleased ${input.entries[0].card.set.toUpperCase()} ${scope} candidate`,
  scope,
  parentRoot: 'immutable native 0.5.3 capture; per-card hashes below',
  fontsHash: hash(fonts),
  assetsHash: hash(assetManifest),
  browser: null,
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  components: components.map((a) => [a.url, a.sha256]),
  toolHashes: await Promise.all(
    ['abu-native-capture.mjs', 'abu-assets.mjs', 'browser.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  node: process.version,
  expectationsHash: expectedFile ? hash(await readFile(expectedFile)) : null,
};
const changed = execFileSync(
  'git',
  ['ls-files', '--modified', '--others', '--exclude-standard', 'games/magic/src'],
  { cwd: root, encoding: 'utf8' },
)
  .trim()
  .split('\n')
  .filter(Boolean);
await mkdir(path.join(outputDirectory, '_source'), { recursive: true });
for (const file of changed) {
  const target = path.join(outputDirectory, '_source', file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await readFile(path.join(root, file)));
}
const session = await openBrowser({ entries: input.entries, components });
const records = new Map(),
  rows = [];
// All measured geometry changes are confined to these printing regions.
const typographyRegions = [
  [29, 362, 417, 42],
  [53, 410, 392, 192],
  [36, 607, 352, 39],
  // Include the full printed field: X/X reaches beyond ordinary digit widths.
  [377, 596, 87, 51],
];
const allowed =
  scope === 'whole-card'
    ? [[0, 0, 488, 680]]
    : scope === 'mana-only'
      ? [[23, 20, 435, 56]]
      : scope === 'body-mana'
        ? [
            [23, 20, 435, 56],
            [54, 405, 390, 197],
          ]
        : typographyRegions;
const manifests = new Map();
let prior;
try {
  prior = await readJson(path.join(outputDirectory, 'progress.json'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const completed = new Map(prior?.rows.map((r) => [r.id, r]));
if (metadataProofFile) {
  definition.metadataOnlyRefresh = await verifyMetadataRefresh(
    path.join(root, 'games/magic/src'),
    await readJson(metadataProofFile),
  );
  assert.equal(prior?.rendererHash, definition.metadataOnlyRefresh.beforeRendererHash);
  assert.equal(rendererHash, definition.metadataOnlyRefresh.afterRendererHash);
  prior.rendererHash = rendererHash;
}
if (prior) {
  for (const field of [
    'inputHash',
    'rendererHash',
    'fontsHash',
    'assetsHash',
    'expectationsHash',
    'scope',
  ])
    assert.equal(prior[field], definition[field], 'Stale native capture: ' + field);
  assert.deepEqual(prior.components, definition.components, 'Cached asset identity changed');
}
try {
  definition.browser = session.browser.version();
  await writeJson(path.join(outputDirectory, '_source', 'capture.json'), definition);
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__abuAssetLoader = await import('/games/magic/tools/accuracy/abu-assets.mjs');
    globalThis.__abuCompose = (
      await import('/games/magic/src/presentation/canvas-face.ts')
    ).composeCardTexture;
  });
  for (const e of input.entries) {
    if (!manifests.has(e.material))
      manifests.set(
        e.material,
        await readJson(path.join(parentRoot, e.material, 'observations.json')),
      );
    const parent = manifests.get(e.material).records.find((r) => r.id === e.id);
    assert.ok(parent, 'Missing immutable parent render');
    const previous = completed.get(e.id);
    if (previous) {
      const file = e.id + '.png';
      assert.equal(
        hash(await readFile(path.join(outputDirectory, e.material, file))),
        previous.after,
      );
      assert.equal(previous.outside, 0);
      assert.equal(previous.silhouette, 0);
      assert.equal(previous.before, parent.baseline.sha256);
      assert.equal(
        hash(await readFile(path.join(parentRoot, e.material, parent.baseline.file))),
        previous.before,
      );
      if (expected[e.id]) assert.equal(previous.bodyChanged, 0);
      if (!records.has(e.material)) records.set(e.material, []);
      records
        .get(e.material)
        .push({ id: e.id, face: e.face, baseline: { file, sha256: previous.after } });
      rows.push(previous);
      continue;
    }
    const base64 = await session.page.evaluate(async (e) => {
      const canvas = await globalThis.__abuCompose(
        { face: e.face, printingId: e.id, printedImage: null },
        'inspect',
        new AbortController().signal,
        {
          loadImages: (urls, signal) =>
            globalThis.__abuAssetLoader.loadAccuracyImages(urls, signal, e.face.illustration),
        },
      );
      try {
        return canvas.toDataURL().split(',')[1];
      } finally {
        canvas.width = canvas.height = 0;
      }
    }, e);
    const bytes = Buffer.from(base64, 'base64'),
      raster = PNG.sync.read(bytes);
    const beforeBytes = await readFile(path.join(parentRoot, e.material, parent.baseline.file));
    assert.equal(hash(beforeBytes), parent.baseline.sha256);
    const before = PNG.sync.read(beforeBytes);
    assert.equal(raster.width, before.width);
    assert.equal(raster.height, before.height);
    const outsideBounds = [Infinity, Infinity, -Infinity, -Infinity];
    let outside = 0,
      changedPixels = 0,
      silhouette = 0,
      artworkChanged = 0;
    for (let y = 0; y < raster.height; y++)
      for (let x = 0; x < raster.width; x++) {
        const i = (y * raster.width + x) * 4;
        if (raster.data[i + 3] !== before.data[i + 3]) silhouette++;
        if (![0, 1, 2, 3].some((k) => raster.data[i + k] !== before.data[i + k])) continue;
        changedPixels++;
        if (
          scope === 'whole-card' &&
          x >= 84 * 1.5 &&
          x < 400 * 1.5 &&
          y >= 110 * 1.5 &&
          y < 340 * 1.5
        )
          artworkChanged++;
        if (
          !allowed.some(
            ([l, t, w, h]) =>
              x >= l * 1.5 && x < (l + w) * 1.5 && y >= t * 1.5 && y < (t + h) * 1.5,
          )
        ) {
          outside++;
          outsideBounds[0] = Math.min(outsideBounds[0], x / 1.5);
          outsideBounds[1] = Math.min(outsideBounds[1], y / 1.5);
          outsideBounds[2] = Math.max(outsideBounds[2], x / 1.5);
          outsideBounds[3] = Math.max(outsideBounds[3], y / 1.5);
        }
      }
    if (outside || silhouette) {
      await writeFile(path.join(outputDirectory, 'failed-native.png'), bytes);
      await writeJson(path.join(outputDirectory, 'failed-native.json'), {
        id: e.id,
        name: e.card.name,
        outside,
        outsideBounds,
        silhouette,
      });
    }
    assert.equal(outside, 0, e.card.name + ': changes escaped typography at ' + outsideBounds);
    assert.equal(silhouette, 0, e.card.name + ': silhouette changed');
    assert.equal(artworkChanged, 0, e.card.name + ': illustration changed');
    let bodyChanged = null;
    if (expected[e.id]) {
      const targetBytes = await readFile(expected[e.id].file);
      assert.equal(hash(targetBytes), expected[e.id].sha256);
      const target = PNG.sync.read(targetBytes);
      bodyChanged = 0;
      for (let y = 615; y < 903; y++)
        for (let x = 80; x < 668; x++) {
          const i = (y * raster.width + x) * 4;
          if ([0, 1, 2, 3].some((k) => raster.data[i + k] !== target.data[i + k])) bodyChanged++;
        }
      assert.equal(bodyChanged, 0, e.card.name + ': native body differs from measured proposal');
    }
    const directory = path.join(outputDirectory, e.material);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, e.id + '.png'), bytes);
    if (!records.has(e.material)) records.set(e.material, []);
    records
      .get(e.material)
      .push({ id: e.id, face: e.face, baseline: { file: e.id + '.png', sha256: hash(bytes) } });
    rows.push({
      id: e.id,
      name: e.card.name,
      material: e.material,
      before: parent.baseline.sha256,
      after: hash(bytes),
      changedPixels,
      outside,
      silhouette,
      bodyChanged,
      artworkChanged,
    });
    await writeJson(path.join(outputDirectory, 'progress.json'), { ...definition, rows });
    if (rows.length % 10 === 0) console.log('native', rows.length, '/', input.entries.length);
  }
  assert.equal(
    await sourceHash(path.join(root, 'games/magic/src')),
    rendererHash,
    'Renderer changed during capture',
  );
  assert.equal(hash(await readFile(inputFile)), inputHash);
  assert.equal(
    hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
    definition.fontsHash,
  );
  assert.equal(
    hash(await readFile(path.join(root, 'games/magic/assets.json'))),
    definition.assetsHash,
  );
  if (session.faults.length) throw Error(session.faults.join('\n'));
  for (const [file, digest] of definition.toolHashes)
    assert.equal(
      hash(await readFile(new URL(file, import.meta.url))),
      digest,
      'Capture tool changed',
    );
  for (const [material, items] of records)
    await writeJson(path.join(outputDirectory, material, 'observations.json'), {
      schema: 1,
      set: input.entries[0].card.set,
      material,
      baseline: { version, sourceHash: rendererHash, variant: definition.variant },
      records: items,
    });
  definition.assetCache = await session.page.evaluate(() =>
    globalThis.__abuAssetLoader.accuracyAssetStats(),
  );
  await writeJson(path.join(outputDirectory, 'capture.json'), {
    ...definition,
    complete: true,
    rows,
  });
  console.log('verified', rows.length, 'native cards');
} finally {
  await session.close();
}
