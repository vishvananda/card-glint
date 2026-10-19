import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { readJson, writeJson, hash, root, sourceHash } from './common.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';

const [inputsFile, posesDirectory, baselineRoot, kernelDirectory, outputDirectory, filter = ''] =
  process.argv.slice(2);
if (!outputDirectory)
  throw Error('Usage: abu-type-study.mjs INPUTS POSES BASELINES WASM_KERNEL OUT [NAME_FILTER]');
const inputs = await readJson(inputsFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json'));
const mode =
  filter === '@shared'
    ? 'shared'
    : filter === '@count' || filter === '@native-count'
      ? 'count'
      : filter.startsWith('@details:')
        ? 'details'
        : 'individual';
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const studyDefinition = {
  inputHash: hash(await readFile(inputsFile)),
  normalizationHash: hash(JSON.stringify(poses)),
  mode,
  rendererHash,
  nativeTrials: filter === '@native-count',
  fontsHash: hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
  assetsHash: hash(await readFile(path.join(root, 'games/magic/assets.json'))),
  sources: await Promise.all(
    [
      'abu-type-study.mjs',
      'abu-type-browser.mjs',
      'abu-count-layout.mjs',
      'abu-reference-cache.mjs',
      'browser.mjs',
      'abu-type-objective.mjs',
      'edges.mjs',
    ].map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
  ),
  kernel:
    kernelDirectory === '-'
      ? 'javascript'
      : await Promise.all(
          ['text_fit_kernel.js', 'text_fit_kernel_bg.wasm'].map(async (file) => [
            file,
            hash(await readFile(path.join(kernelDirectory, file))),
          ]),
        ),
};
assert.equal(poses.inputHash, hash(await readFile(inputsFile)));
const ssr = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
await ssr.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
const { canvasAssetUrls } = await ssr.ssrLoadModule(
  '/games/magic/src/presentation/canvas-assets.ts',
);
const { RETRO_FONT, RETRO_SYMBOL_FONT } = await ssr.ssrLoadModule(
  '/games/magic/src/presentation/retro-frame.ts',
);
const entries = inputs.entries.filter((e) =>
  mode === 'details'
    ? new RegExp(filter.slice('@details:'.length), 'i').test(e.card.name)
    : mode !== 'individual' || e.card.name.toLowerCase().includes(filter.toLowerCase()),
);
const fonts = [
  ...new Set(
    [...(await readFile('games/magic/fonts.css', 'utf8')).matchAll(/url\('([^']+)'\)/g)].map(
      (m) => m[1],
    ),
  ),
].filter((u) => u.startsWith('https:'));
const components = [];
for (const url of new Set(
  [
    ...fonts,
    RETRO_FONT,
    RETRO_SYMBOL_FONT,
    ...entries.flatMap((e) => canvasAssetUrls(e.face)),
  ].filter((u) => u?.startsWith('https:')),
))
  components.push(await cachedFetch(url, { offline: true }));
await ssr.close();
studyDefinition.components = components
  .map(({ url, sha256 }) => ({ url, sha256 }))
  .sort((a, b) => a.url.localeCompare(b.url));
const studyHash = hash(JSON.stringify(studyDefinition));
const plugins = [
  {
    name: 'abu-type-study',
    enforce: 'pre',
    transform(source, id) {
      if (id.endsWith('/retro-rules.ts'))
        return source.replace(
          'function baseRetroTextLayout(',
          'export function baseRetroTextLayout(',
        );
      if (id.endsWith('/rules-paint.ts'))
        return source.replace(
          '  if (!rulesInkVisible(context)) return;',
          '  if ((globalThis as any).__abuBody?.(context, layout, images, paintSymbol, inkInsetEm, color)) return;\n  if (!rulesInkVisible(context)) return;',
        );
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/__type_kernel/')) return next();
        const file = req.url.slice('/__type_kernel/'.length).split('?')[0];
        if (file === 'config.json') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ wasm: kernelDirectory !== '-' }));
          return;
        }
        if (!['text_fit_kernel.js', 'text_fit_kernel_bg.wasm'].includes(file)) {
          res.writeHead(404).end();
          return;
        }
        try {
          res.setHeader(
            'Content-Type',
            file.endsWith('.js') ? 'application/javascript' : 'application/wasm',
          );
          res.end(await readFile(path.join(kernelDirectory, file)));
        } catch (error) {
          res.writeHead(500).end(String(error));
        }
      });
    },
  },
];
await mkdir(path.join(outputDirectory, '_source'), { recursive: true });
await writeJson(path.join(outputDirectory, '_source', 'study.json'), {
  studyHash,
  ...studyDefinition,
});
for (const [file, expected] of studyDefinition.sources) {
  const bytes = await readFile(new URL(file, import.meta.url));
  assert.equal(hash(bytes), expected);
  await writeFile(path.join(outputDirectory, '_source', file), bytes);
}
const session = await openBrowser({ entries, components }, { plugins });
const baselines = new Map();
try {
  await session.page.evaluate(async () => {
    globalThis.__typeStudy = await import('/games/magic/tools/accuracy/abu-type-browser.mjs');
  });
  let count = 0;
  for (const e of entries) {
    const output = path.join(outputDirectory, e.id + '.json');
    let prior;
    try {
      prior = await readJson(output);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const pose = poses.rows.find((r) => r.id === e.id);
    if (prior) {
      assert.equal(prior.poseHash, hash(JSON.stringify(pose)));
      assert.equal(
        prior.studyHash,
        studyHash,
        'Stale typography study; choose a new output directory',
      );
      if (baselineRoot === '-') {
        const file = e.id + '.png';
        assert.equal(
          hash(await readFile(path.join(outputDirectory, 'baseline', e.material, file))),
          prior.baselineHash,
        );
        if (!baselines.has(e.material)) baselines.set(e.material, []);
        baselines
          .get(e.material)
          .push({ id: e.id, face: e.face, baseline: { file, sha256: prior.baselineHash } });
      }
      continue;
    }
    const scan = await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'));
    const scanUrl = 'data:image/png;base64,' + scan.bytes.toString('base64');
    const prepared = await session.page.evaluate(
      ({ e, scanUrl, rulesOnly }) =>
        globalThis.__typeStudy.prepare(e, scanUrl, rulesOnly ? ['rules'] : undefined),
      { e, scanUrl, rulesOnly: filter === '@native-count' },
    );
    const nativeBytes = Buffer.from(prepared.png, 'base64'),
      baselineHash = hash(nativeBytes);
    if (baselineRoot === '-') {
      const dir = path.join(outputDirectory, 'baseline', e.material);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, e.id + '.png'), nativeBytes);
      if (!baselines.has(e.material)) baselines.set(e.material, []);
      baselines
        .get(e.material)
        .push({ id: e.id, face: e.face, baseline: { file: e.id + '.png', sha256: baselineHash } });
    } else {
      const manifest = await readJson(path.join(baselineRoot, e.material, 'observations.json'));
      assert.equal(
        baselineHash,
        manifest.records.find((r) => r.id === e.id).baseline.sha256,
        'Native baseline changed',
      );
    }
    delete prepared.png;
    const fits = {};
    if (mode === 'individual')
      for (const role of prepared.roles)
        fits[role] = await session.page.evaluate((role) => globalThis.__typeStudy.fit(role), role);
    const shared =
      mode === 'count' || mode === 'details'
        ? await session.page.evaluate(
            (selectedOnly) => globalThis.__typeStudy.countTrials(selectedOnly),
            filter === '@native-count',
          )
        : mode === 'shared'
          ? await session.page.evaluate(() => globalThis.__typeStudy.shared())
          : undefined;
    let nativeTrial;
    if (mode === 'details' || filter === '@native-count') {
      nativeTrial = await session.page.evaluate(() =>
        globalThis.__typeStudy.nativeRulesTrial({
          policy: 'count',
          mediumSize: 22.5,
          denseWidth: 1,
        }),
      );
      const candidateBytes = Buffer.from(nativeTrial.png, 'base64');
      nativeTrial.renderHash = hash(candidateBytes);
      await writeFile(path.join(outputDirectory, e.id + '-candidate.png'), candidateBytes);
      if (mode === 'details') {
        await writeFile(path.join(outputDirectory, e.id + '-baseline.png'), nativeBytes);
        await writeFile(path.join(outputDirectory, e.id + '-reference.png'), scan.bytes);
      }
      delete nativeTrial.png;
    }
    await session.page.evaluate(() => globalThis.__typeStudy.finish());
    await writeJson(output, {
      id: e.id,
      name: e.card.name,
      material: e.material,
      cohort: pose.cohort,
      normalizationAccepted: pose.accepted,
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(pose)),
      studyHash,
      rendererHash,
      baselineHash,
      mode,
      ...prepared,
      fits,
      ...(nativeTrial ? { nativeTrial } : {}),
      ...(shared ? { shared } : {}),
    });
    console.log(
      ++count,
      entries.length,
      e.card.name,
      Object.fromEntries(
        Object.entries(fits).map(([k, v]) => [
          k,
          [+v.baseline.toFixed(3), +v.score.toFixed(3), v.adjustment],
        ]),
      ),
    );
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  assert.equal(
    await sourceHash(path.join(root, 'games/magic/src')),
    rendererHash,
    'Renderer changed during capture',
  );
  for (const [file, expected] of studyDefinition.sources)
    assert.equal(
      hash(await readFile(new URL(file, import.meta.url))),
      expected,
      'Study source changed during capture',
    );
  for (const [file, expected] of [
    ['fonts.css', studyDefinition.fontsHash],
    ['assets.json', studyDefinition.assetsHash],
  ])
    assert.equal(
      hash(await readFile(path.join(root, 'games/magic', file))),
      expected,
      'Renderer asset configuration changed during capture',
    );
  const version = (await readJson(path.join(root, 'package.json'))).version;
  for (const [material, records] of baselines)
    await writeJson(path.join(outputDirectory, 'baseline', material, 'observations.json'), {
      schema: 1,
      set: poses.set,
      material,
      baseline: { version, sourceHash: rendererHash },
      records,
    });
} finally {
  await session.close();
}
