// Cache-only native replay of Original/Oracle and independent symbol modes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
const [inputFile, out, baseline = 'HEAD'] = process.argv.slice(2);
assert(out, 'Usage: printing-symbol-mode-audit.mjs INPUTS NEW_OUTPUT BASELINE_GIT_REF');
await fs.mkdir(out, { recursive: false });
const inputBytes = await fs.readFile(inputFile),
  input = JSON.parse(inputBytes);
const files = execFileSync('git', ['diff', '--name-only', baseline, '--', 'games/magic/src'], {
  cwd: root,
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean);
const changes = {};
for (const file of files) {
  const before = execFileSync('git', ['show', baseline + ':' + file], { cwd: root });
  const after = await fs.readFile(path.join(root, file));
  changes[file] = { before: hash(before), after: hash(after), beforeSource: before.toString() };
}
const afterRenderer = await sourceHash(path.join(root, 'games/magic/src'));
const server = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
let components, entries;
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { fromScryfallCard } = await server.ssrLoadModule(
    '/games/magic/src/presentation/scryfall-card.ts',
  );
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { retroFontAssets } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-font.ts',
  );
  entries = input.entries.map((e) => ({
    ...e,
    modes: Object.fromEntries([
      ['original', e.face],
      ...['modern', 'original'].map((symbolStyle) => [
        'oracle-' + symbolStyle,
        {
          ...fromScryfallCard(e.card, {
            wording: 'oracle',
            symbolStyle,
            illustrations: [e.face.illustration],
          }),
          artist: e.face.artist,
        },
      ]),
    ]),
  }));
  const css = await fs.readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
  const urls = [
    ...new Set(
      [
        ...[...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]),
        ...retroFontAssets.map((a) => a.url),
        ...entries.flatMap((e) => Object.values(e.modes).flatMap(canvasAssetUrls)),
      ].filter((u) => u?.startsWith('https:')),
    ),
  ];
  components = await Promise.all(urls.map((url) => cachedFetch(url, { offline: true })));
} finally {
  await server.close();
}
const rows = [];
for (const phase of ['before', 'after']) {
  const session = await openBrowser(
    { ...input, components },
    {
      plugins:
        phase === 'before'
          ? [
              {
                name: 'exact-reviewed-source-parent',
                enforce: 'pre',
                transform(source, id) {
                  const file = path.relative(root, id.split('?')[0]),
                    change = changes[file];
                  if (!change) return;
                  assert.equal(
                    hash(source),
                    change.after,
                    'Unexpected source during baseline replay: ' + file,
                  );
                  return change.beforeSource;
                },
              },
            ]
          : [],
    },
  );
  try {
    await session.page.evaluate(async () => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
    });
    for (const e of entries) {
      const images = await session.page.evaluate(async (e) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(
            Object.values(e.modes).flatMap(canvasAssetUrls),
            signal,
            e.face.illustration,
          );
        const result = {};
        try {
          for (const [mode, face] of Object.entries(e.modes)) {
            const image = await composeCardTexture(
              { face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              result[mode] = image.toDataURL().split(',')[1];
            } finally {
              image.width = image.height = 0;
            }
          }
        } finally {
          lease.dispose();
        }
        return result;
      }, e);
      for (const [mode, data] of Object.entries(images)) {
        const bytes = Buffer.from(data, 'base64'),
          file = e.id + '-' + mode + '.png';
        if (phase === 'before') {
          await fs.writeFile(path.join(out, file), bytes);
          rows.push({
            id: e.id,
            name: e.name,
            mode,
            inputHash: hash(JSON.stringify(e.modes[mode])),
            referenceHash: e.reference.sha256,
            before: hash(bytes),
          });
        } else {
          const row = rows.find((r) => r.id === e.id && r.mode === mode);
          const oldBytes = await fs.readFile(path.join(out, file));
          assert.equal(hash(oldBytes), row.before);
          const old = PNG.sync.read(oldBytes),
            image = PNG.sync.read(bytes);
          assert.equal(old.width, image.width);
          assert.equal(old.height, image.height);
          let outside = 0,
            alpha = 0,
            changed = 0;
          for (let y = 0; y < image.height; y++)
            for (let x = 0; x < image.width; x++) {
              const at = (y * image.width + x) * 4;
              if (old.data[at + 3] !== image.data[at + 3]) alpha++;
              if (![0, 1, 2, 3].some((k) => old.data[at + k] !== image.data[at + k])) continue;
              changed++;
              const cx = (x * 488) / image.width,
                cy = (y * 680) / image.height;
              const allowed =
                mode === 'oracle-modern'
                  ? cy >= 15 && cy <= 80 && cx >= 23 && cx <= 465
                  : cy >= 400 && cy <= 610 && cx >= 45 && cx <= 451;
              if (!allowed) outside++;
            }
          assert.equal(alpha, 0, 'Changed silhouette ' + e.id + '/' + mode);
          assert.equal(outside, 0, 'Changed unrelated component ' + e.id + '/' + mode);
          Object.assign(row, { after: hash(bytes), changed, alpha, outside });
          // Keep compact review crops; full-card pixel identities are in the receipt.
          if (changed) {
            const rect = mode === 'oracle-modern' ? [20, 15, 450, 65] : [45, 400, 406, 210];
            for (const [label, png] of [
              ['before', old],
              ['after', image],
            ]) {
              const [x, y, w, h] = rect.map((v) => Math.round((v * image.width) / 488));
              const crop = new PNG({ width: w, height: h });
              PNG.bitblt(png, crop, x, y, w, h, 0, 0);
              await fs.writeFile(
                path.join(out, e.id + '-' + mode + '-' + label + '-crop.png'),
                PNG.sync.write(crop),
              );
            }
          }
          await fs.unlink(path.join(out, file));
        }
      }
      if (rows.length % 30 === 0) console.log(phase, e.name, rows.length);
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
}
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  afterRenderer,
  'Source changed while replaying',
);
await writeJson(path.join(out, 'audit.json'), {
  schema: 1,
  status: 'complete-native-symbol-mode-replay',
  source: {
    baseline,
    afterRenderer,
    inputHash: hash(inputBytes),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  },
  files: changes,
  components: components.map((a) => [a.url, a.sha256]),
  scope:
    'Original and both Oracle symbol choices, immutable input wording/art, 732x1020 native Canvas2D. Fixed reference identities; no scan refitting. Pixel changes restricted to rules symbols or modern-cost/header geometry.',
  summary: {
    cards: entries.length,
    renders: rows.length,
    changed: rows.filter((r) => r.changed).length,
    alpha: 0,
    outside: 0,
  },
  rows,
});
console.log('Symbol modes complete', entries.length, rows.length);
