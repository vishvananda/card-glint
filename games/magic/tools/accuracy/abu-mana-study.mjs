import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { readJson, writeJson, root, hash, sourceHash } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
const [inputFile, posesDirectory, output] = process.argv.slice(2);
if (!output) throw Error('Usage: abu-mana-study.mjs INPUTS POSES OUT');
const input = await readJson(inputFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json'));
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
const candidates = [{ name: 'current', delta: {} }];
for (const dx of [-0.5, 0, 0.5])
  for (const dy of [-0.5, 0, 0.5])
    for (const scale of [0.98, 1, 1.02])
      for (const spacing of [-0.5, 0, 0.5]) {
        if (!dx && !dy && scale === 1 && !spacing) continue;
        candidates.push({
          name: `${dx}/${dy}/${scale}/${spacing}`,
          delta: { dx, dy, scaleX: scale, scaleY: scale, spacing },
        });
      }
const session = await openBrowser(
  { entries, components },
  {
    plugins: [
      {
        name: 'retained-cost-callback',
        enforce: 'pre',
        transform(source, id) {
          if (id.endsWith('/retro-paint.ts'))
            return source.replace(
              'const costAdjustment = printingManaAdjustment(face);',
              'const costAdjustment = {...printingManaAdjustment(face)}; (globalThis as any).__abuManaAdjustment?.(costAdjustment);',
            );
          if (id.endsWith('/printing-elements.ts'))
            return source.replace(
              '  const option = face.printingElements?.[element];',
              '  if ((globalThis as any).__abuManaCapture?.(c,element,paint)) return;\n  const option = face.printingElements?.[element];',
            );
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async () => {
    globalThis.__manaStudy = await import('/games/magic/tools/accuracy/abu-mana-study-browser.mjs');
  });
  for (const e of entries) {
    const pose = poses.rows.find((p) => p.id === e.id),
      scan = await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'));
    const result = await session.page.evaluate(
      ({ e, scan, candidates }) => globalThis.__manaStudy.measure(e, scan, candidates),
      { e, scan: 'data:image/png;base64,' + scan.bytes.toString('base64'), candidates },
    );
    const bytes = Buffer.from(result.nativePng, 'base64');
    await mkdir(output + '.rasters', { recursive: true });
    await writeFile(path.join(output + '.rasters', e.id + '.png'), bytes);
    delete result.nativePng;
    result.nativeHash = hash(bytes);
    rows.push({
      id: e.id,
      name: e.card.name,
      cohort: pose.cohort,
      symbol: /^[0-9]+$/.test(e.face.manaSymbols.at(-1)) ? 'N' : e.face.manaSymbols.at(-1),
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(pose)),
      ...result,
    });
    console.log('mana candidates', rows.length, '/', entries.length, e.card.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  await writeJson(output, {
    schema: 1,
    set: poses.set,
    inputHash: poses.inputHash,
    rendererHash,
    normalizationHash: hash(JSON.stringify(poses)),
    scope:
      'Native retained cost callbacks, same Canvas origin and static assets; zero replay byte parity is required. Scores include circle and glyph edges. Shared geometry only, calibration-name selection and separate reused-development validation. No per-scan registration or color fit inside this search.',
    candidates,
    rows,
  });
} finally {
  await session.close();
}
