import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { readJson, writeJson, root, hash, sourceHash } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { typographyReplayTransform } from './abu-type-replay-hooks.mjs';
const [inputFile, posesDirectory, output, selectedRoles = 'title,type', placementsFile] =
  process.argv.slice(2);
if (!output) throw Error('Usage: abu-heading-ink.mjs INPUTS POSES OUT');
const input = await readJson(inputFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json'));
const placements = placementsFile ? await readJson(placementsFile) : {};
const allowedRoles = ['title', 'type', 'artist', 'stats'];
assert.ok(selectedRoles.split(',').every((role) => allowedRoles.includes(role)));
for (const [role, value] of Object.entries(placements)) {
  assert.ok(allowedRoles.includes(role));
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  for (const [key, number] of Object.entries(value))
    assert.ok(
      ['dx', 'dy', 'size', 'width'].includes(key) &&
        Number.isFinite(number) &&
        Math.abs(number) <= 12,
      'Invalid filled-ink placement: ' + role + '/' + key,
    );
}
const toolHashes = await Promise.all(
  [
    'abu-heading-ink.mjs',
    'abu-heading-ink-browser.mjs',
    'abu-type-browser.mjs',
    'abu-type-replay-hooks.mjs',
  ].map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
);
assert.equal(hash(await readFile(inputFile)), poses.inputHash);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const components = [];
let entries;
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { RETRO_FONT, RETRO_SYMBOL_FONT } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  // Name-grouped existing cohorts. Select before seeing candidate scores; retain
  // all six costs and both single/multiple-disc examples in each cohort.
  const selected = new Map();
  for (const symbol of ['W', 'U', 'B', 'R', 'G', 'N'])
    for (const cohort of ['calibration', 'validation']) {
      const a = input.entries
        .filter((e) => {
          const cost = e.face.manaSymbols ?? [];
          return (
            cost.length &&
            (/^[0-9]+$/.test(cost.at(-1)) ? 'N' : cost.at(-1)) === symbol &&
            poses.rows.find((p) => p.id === e.id).accepted &&
            poses.rows.find((p) => p.id === e.id).cohort === cohort
          );
        })
        .sort((a, b) => a.id.localeCompare(b.id));
      for (const e of [
        ...a.filter((e) => e.face.manaSymbols.length === 1).slice(0, 2),
        ...a.filter((e) => e.face.manaSymbols.length > 1).slice(0, 3),
      ])
        selected.set(e.id, e);
    }
  entries = [...selected.values()];
  const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
  const urls = new Set(
    [...css.matchAll(/url\('([^']+)'\)/g)]
      .map((m) => m[1])
      .concat(RETRO_FONT, RETRO_SYMBOL_FONT, ...entries.flatMap((e) => canvasAssetUrls(e.face)))
      .filter((u) => u?.startsWith('https:')),
  );
  for (const url of urls) components.push(await cachedFetch(url, { offline: true }));
} finally {
  await server.close();
}
const session = await openBrowser(
  { entries, components },
  {
    plugins: [
      {
        name: 'heading-ink',
        enforce: 'pre',
        transform: typographyReplayTransform,
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url !== '/__type_kernel/config.json') return next();
            res.setHeader('Content-Type', 'application/json');
            res.end('{"wasm":false}');
          });
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async () => {
    globalThis.__manaStudy = await import(
      '/games/magic/tools/accuracy/abu-heading-ink-browser.mjs'
    );
  });
  for (const e of entries) {
    const pose = poses.rows.find((p) => p.id === e.id),
      scan = await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'));
    const result = await session.page.evaluate(
      ({ e, scan, roles, placements }) =>
        globalThis.__manaStudy.measure(e, scan, roles, placements),
      {
        e,
        scan: 'data:image/png;base64,' + scan.bytes.toString('base64'),
        roles: selectedRoles.split(','),
        placements,
      },
    );
    rows.push({
      id: e.id,
      name: e.card.name,
      cohort: pose.cohort,
      symbol: /^[0-9]+$/.test(e.face.manaSymbols.at(-1)) ? 'N' : e.face.manaSymbols.at(-1),
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(pose)),
      ...result,
    });
    console.log('filled heading ink', rows.length, '/', entries.length, e.card.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  for (const [file, digest] of toolHashes)
    assert.equal(hash(await readFile(new URL(file, import.meta.url))), digest);
  await writeJson(output, {
    schema: 1,
    set: poses.set,
    inputHash: poses.inputHash,
    rendererHash,
    normalizationHash: hash(JSON.stringify(poses)),
    placements,
    toolHashes,
    scope:
      'Filled-ink observations from native text at fixed shared placements. Opaque stroke interiors are identified by black/white replay subtraction; observed reference gray is inverted through coverage. Median targets exclude clipping. These are printing-ink diagnostics, independent of edge overlap; no hollow lettering or scan repositioning is fitted.',
    rows,
  });
} finally {
  await session.close();
}
